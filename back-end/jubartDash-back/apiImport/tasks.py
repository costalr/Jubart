# apiImport/tasks.py

import logging
import requests
import json
import boto3
import hashlib
from datetime import datetime
from pathlib import Path
from apiCommon.models import LatestFile
from django.conf import settings
from celery import shared_task
from apiImport.utils import notify_update  

logger = logging.getLogger('myapp')

def calculate_data_hash(data):
    data_string = json.dumps(data, sort_keys=True)
    return hashlib.md5(data_string.encode('utf-8')).hexdigest()

def save_latest_file(file_type, file_key, last_month):
    try:
        # Exclui registros duplicados, se existirem
        LatestFile.objects.filter(file_type=file_type).exclude(id=LatestFile.objects.filter(file_type=file_type).first().id).delete()
        
        # Obtém ou cria o registro mais recente
        latest_file, created = LatestFile.objects.get_or_create(file_type=file_type)
        latest_file.file_key = file_key
        latest_file.last_month = last_month
        latest_file.save()
        logger.info(f"Registro salvo com sucesso: {latest_file.file_key}")
    except Exception as e:
        logger.error(f"Erro ao salvar o registro: {e}")

@shared_task
def fetch_and_update_import_data():
    logger.info("Iniciando a tarefa de atualização de dados de importação")

    try:
        # Obter a última data de atualização
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

        # Headings a serem buscados (excluindo 0309)
        headings = [
            '0302', '0303', '0304', '0305', '0306', '0307', '0308', '1604', '1605',
        ]
        logger.info(f"Headings buscados: {', '.join(headings)}")

        # Parâmetros comuns para a API
        common_params = {
            'flow': 'import',
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

        # Solicitação para anos anteriores ao ano corrente (janeiro a dezembro)
        params_anos_anteriores = {
            **common_params,
            'period': {
                'from': '1997-01',
                'to': f"{last_year-1}-12"
            },
        }

        # Solicitação para o ano corrente (janeiro até o mês corrente)
        params_ano_corrente = {
            **common_params,
            'period': {
                'from': f"{last_year}-01",
                'to': f"{last_year}-{last_month:02}"
            },
        }

        url = 'https://api-comexstat.mdic.gov.br/general'

        # Solicitação para anos anteriores
        logger.info("Enviando solicitação para a API para anos anteriores ao ano corrente.")
        response_anos_anteriores = requests.post(url, json=params_anos_anteriores, verify=False)
        logger.info(f"Status da resposta da API para anos anteriores: {response_anos_anteriores.status_code}")
        response_anos_anteriores.raise_for_status()
        data_anos_anteriores = response_anos_anteriores.json()

        # Solicitação para o ano corrente
        logger.info("Enviando solicitação para a API para o ano corrente.")
        response_ano_corrente = requests.post(url, json=params_ano_corrente, verify=False)
        logger.info(f"Status da resposta da API para o ano corrente: {response_ano_corrente.status_code}")
        response_ano_corrente.raise_for_status()
        data_ano_corrente = response_ano_corrente.json()

        # Combinar os dados
        dados_totais = data_anos_anteriores['data']['list'] + data_ano_corrente['data']['list']

        # Adicionar registros vazios para meses não disponíveis do ano corrente
        for month in range(last_month + 1, 13):
            empty_row = {
                'coNcm': None,
                'year': last_year,
                'monthNumber': f"{month:02}",
                'country': None,
                'state': None,
                'ncm': None,
                'headingCode': None,
                'heading': None,
                'metricFOB': None,
                'metricKG': None
            }
            dados_totais.append(empty_row)

        new_data_hash = calculate_data_hash(dados_totais)

        BASE_DIR = Path(__file__).resolve().parent.parent
        file_name = "dados_importacao.json"
        directory = BASE_DIR / 'data'

        if not directory.exists():
            try:
                directory.mkdir(parents=True, exist_ok=True)
                logger.info(f"Diretório criado: {directory}")
            except OSError as e:
                logger.error(f"Erro ao criar diretório: {directory}, {e}")
                return
        else:
            logger.info(f"Diretório já existe: {directory}")

        file_path = directory / file_name
        logger.info(f"Caminho do arquivo: {file_path}")

        if file_path.exists():
            with open(file_path, 'r', encoding='utf-8') as file:
                existing_data = json.load(file)
            existing_data_hash = calculate_data_hash(existing_data)
            if new_data_hash == existing_data_hash:
                logger.info("Os dados não foram alterados. Não é necessário atualizar o arquivo.")
                return
            else:
                logger.info("Os dados foram alterados. Atualizando o arquivo.")
        else:
            logger.info("O arquivo não existe. Criando um novo arquivo.")

        try:
            with open(file_path, 'w', encoding='utf-8') as file:
                json.dump(dados_totais, file, ensure_ascii=False, indent=4)
            logger.info(f"Dados salvos localmente em: {file_path}")
        except Exception as e:
            logger.error(f"Erro ao escrever dados no arquivo: {e}")
            return

        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )
        try:
            s3_client.upload_file(str(file_path), 'jubart-dashboard', f"data/{file_name}")
            logger.info(f"Arquivo enviado para o bucket S3: data/{file_name}")
        except Exception as e:
            logger.error(f"Erro ao enviar arquivo para o S3: {e}")
            return

        save_latest_file('import', f"data/{file_name}", last_month)

        # Notificar via WebSocket após a atualização
        notify_update({
            'message': 'Dados de importação atualizados',
            'file_key': f"data/{file_name}",
            'last_month': last_month,
        })

    except Exception as e:
        logger.error(f"Erro na tarefa de atualização de dados de importação: {e}", exc_info=True)
