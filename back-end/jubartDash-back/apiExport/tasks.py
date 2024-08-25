import logging
import requests
import pandas as pd
import json
import hashlib
import boto3
import gzip
from pathlib import Path
from apiCommon.models import LatestFile
from django.conf import settings
from celery import shared_task
from apiImport.utils import notify_update

logger = logging.getLogger('myapp')

def calculate_data_hash(data):
    data_string = json.dumps(data, sort_keys=True)
    return hashlib.md5(data_string.encode('utf-8')).hexdigest()

def save_latest_file(file_type, file_key, last_month, last_year, file_hash=None):
    try:
        # Exclui todos os registros antigos desse tipo de arquivo
        LatestFile.objects.filter(file_type=file_type).delete()
        
        # Cria um novo registro com as informações atualizadas
        latest_file = LatestFile(
            file_type=file_type, 
            file_key=file_key, 
            last_month=last_month,
            last_year=last_year,
            file_hash=file_hash  # Armazena o hash do arquivo
        )
        latest_file.save()
        logger.info(f"Registro salvo com sucesso: {latest_file.file_key} para {latest_file.last_year}-{latest_file.last_month}")
    except Exception as e:
        logger.error(f"Erro ao salvar o registro: {e}")

@shared_task
def fetch_and_update_export_data():
    logger.info("Iniciando a tarefa de atualização de dados de exportação")

    # Baixar mapeamento de NCM para Categoria e Espécie do S3
    mapeamento_path = '/tmp/pescado_mapeamento.csv'
    s3_client = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
    )

    try:
        s3_client.download_file('jubart-dashboard', 'data/pescado_mapeamento.csv', mapeamento_path)
        logger.info("Arquivo de mapeamento baixado do S3 com sucesso.")
    except Exception as e:
        logger.error(f"Erro ao baixar o arquivo de mapeamento do S3: {e}")
        return

    mapeamento_df = pd.read_csv(mapeamento_path, dtype=str)
    mapeamento_df['CO_NCM'] = mapeamento_df['CO_NCM'].apply(lambda x: x.zfill(8))  # Garantir que todos os códigos tenham 8 dígitos
    mapeamento_dict = mapeamento_df.set_index('CO_NCM').to_dict(orient='index')

    try:
        url_last_update = 'https://api-comexstat.mdic.gov.br/general/dates/updated'
        response_last_update = requests.get(url_last_update, verify=False)

        if response_last_update.status_code == 200:
            data_last_update = response_last_update.json()
            last_year = int(data_last_update['data']['year'])
            last_month = int(data_last_update['data']['monthNumber'])
            logger.info(f"Última atualização encontrada: {last_year}-{last_month:02}")
        else:
            logger.error(f"Erro ao obter a última data de atualização: {response_last_update.status_code} - {response_last_update.text}")
            return

        # Configuração dos parâmetros para a API
        headings = ['0302', '0303', '0304', '0305', '0306', '0307', '0308', '1604', '1605']
        common_params = {
            'flow': 'export',
            'monthDetail': True,
            'filters': [
                {
                    'filter': 'heading',
                    'values': headings,
                }
            ],
            'details': ['country', 'state', 'ncm', 'heading'],
            'metrics': ['metricFOB', 'metricKG']
        }

        params_anos_anteriores = {
            **common_params,
            'period': {
                'from': '1997-01',
                'to': f"{last_year-1}-12"
            },
        }

        params_ano_corrente = {
            **common_params,
            'period': {
                'from': f"{last_year}-01",
                'to': f"{last_year}-{last_month:02}"
            },
        }

        url = 'https://api-comexstat.mdic.gov.br/general'

        logger.info("Enviando solicitação para a API para anos anteriores ao ano corrente.")
        response_anos_anteriores = requests.post(url, json=params_anos_anteriores, verify=False)
        logger.info(f"Status da resposta da API para anos anteriores: {response_anos_anteriores.status_code}")
        response_anos_anteriores.raise_for_status()
        data_anos_anteriores = response_anos_anteriores.json()['data']['list']

        logger.info("Enviando solicitação para a API para o ano corrente.")
        response_ano_corrente = requests.post(url, json=params_ano_corrente, verify=False)
        logger.info(f"Status da resposta da API para o ano corrente: {response_ano_corrente.status_code}")
        response_ano_corrente.raise_for_status()
        data_ano_corrente = response_ano_corrente.json()['data']['list']

        # Combinar os dados
        dados_totais = data_anos_anteriores + data_ano_corrente

        # Adicionar Categoria e Espécie aos dados
        for idx, item in enumerate(dados_totais):
            ncm_codigo = item['coNcm']
            ncm_info = mapeamento_dict.get(ncm_codigo)

            if ncm_info:
                item['Categoria'] = ncm_info.get('Categoria', 'Desconhecida')
                item['Espécie'] = ncm_info.get('Espécie', 'Desconhecida')
            else:
                item['Categoria'] = 'Desconhecida'
                item['Espécie'] = 'Desconhecida'

            # Ajustar os campos para os nomes do modelo
            item['ano'] = item.pop('year')
            item['mes'] = item.pop('monthNumber')
            item['pais'] = item.pop('country')
            item['estado'] = item.pop('state')
            item['sh4'] = item.pop('headingCode')
            item['total_usd'] = item.pop('metricFOB')
            item['total_kg'] = item.pop('metricKG')

        df_dados = pd.DataFrame(dados_totais)

        # Salvar dados brutos no JSON principal
        file_name = "dados_exportacao.json.gz"
        directory = Path(__file__).resolve().parent.parent / 'data'
        file_path = directory / file_name

        if not directory.exists():
            directory.mkdir(parents=True, exist_ok=True)

        if file_path.exists():
            with gzip.open(file_path, 'rt', encoding='utf-8') as file:
                existing_data = json.load(file)
            existing_data_hash = calculate_data_hash(existing_data)
            if calculate_data_hash(dados_totais) == existing_data_hash:
                logger.info("Os dados não foram alterados. Não é necessário atualizar o arquivo.")
                return
            else:
                logger.info("Os dados foram alterados. Atualizando o arquivo.")
        else:
            logger.info("O arquivo não existe. Criando um novo arquivo.")

        with gzip.open(file_path, 'wt', encoding='utf-8') as file:
            json.dump(dados_totais, file, separators=(',', ':'))
        logger.info(f"Dados salvos localmente em: {file_path}")

        # Salvar dados agrupados em um arquivo JSON separado e comprimido
        grupos_file_name = "dados_exportacao_agrupados.json.gz"
        grupos_file_path = directory / grupos_file_name

        grupos = {
            'por_pais': df_dados.groupby('pais').apply(lambda x: x.to_dict(orient='records')).to_dict(),
            'por_categoria': df_dados.groupby('Categoria').apply(lambda x: x.to_dict(orient='records')).to_dict(),
            'por_especie': df_dados.groupby('Espécie').apply(lambda x: x.to_dict(orient='records')).to_dict(),
            'por_ncm': df_dados.groupby('ncm').apply(lambda x: x.to_dict(orient='records')).to_dict(),
            'por_estado': df_dados.groupby('estado').apply(lambda x: x.to_dict(orient='records')).to_dict(),
        }

        # Log para verificar os primeiros 10 registros agrupados por país
        logger.info(f"Dados agrupados por país: {list(grupos['por_pais'].items())[:10]}")

        with gzip.open(grupos_file_path, 'wt', encoding='utf-8') as f:
            json.dump(grupos, f, separators=(',', ':'), ensure_ascii=False)
        logger.info(f"Dados agrupados salvos localmente em: {grupos_file_path}")

        # Fazer o upload dos arquivos para o S3
        try:
            s3_client.upload_file(str(file_path), 'jubart-dashboard', f"data/{file_name}")
            logger.info(f"Arquivo de dados brutos enviado para o bucket S3: data/{file_name}")

            s3_client.upload_file(str(grupos_file_path), 'jubart-dashboard', f"data/{grupos_file_name}")
            logger.info(f"Arquivo de dados agrupados enviado para o bucket S3: data/{grupos_file_name}")

        except Exception as e:
            logger.error(f"Erro ao enviar arquivos para o S3: {e}")
            return
        
        # Salvar arquivos de dados brutos e agrupados no banco de dados
        save_latest_file('export', f"data/{file_name}", last_month, last_year)
        save_latest_file('export_grouped', f"data/{grupos_file_name}", last_month, last_year)

        # Notificar via WebSocket após a atualização
        notify_update({
            'message': 'Dados de exportação atualizados',
            'file_key': f"data/{file_name}",
            'last_month': last_month,
        })

    except Exception as e:
        logger.error(f"Erro na tarefa de atualização de dados de exportação: {e}", exc_info=True)
