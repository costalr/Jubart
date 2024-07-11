import logging
from celery import shared_task
import requests
import csv
import boto3
from datetime import datetime
import urllib3
from apiCommon.models import LatestFile
from django.conf import settings
from django.core.cache import cache
from pathlib import Path

logger = logging.getLogger('myapp')

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def save_latest_file(file_type, file_key):
    try:
        latest_file, created = LatestFile.objects.get_or_create(file_type=file_type)
        latest_file.file_key = f"data/{file_key}"
        latest_file.save()
        logger.info(f"Registro salvo com sucesso: {latest_file.file_key}")
    except Exception as e:
        logger.error(f"Erro ao salvar o registro: {e}")

@shared_task
def fetch_and_update_export_data():
    logger.info("Iniciando a tarefa de atualização de dados de exportação")
    
    try:
        cached_data = cache.get('export_data')
        if cached_data:
            logger.info("Dados de exportação obtidos do cache")
            return cached_data

        url_last_update = 'https://api-comexstat.mdic.gov.br/general/dates/updated'
        response_last_update = requests.get(url_last_update, verify=False)

        if response_last_update.status_code == 200:
            data_last_update = response_last_update.json()
            last_year = data_last_update['data']['year']
            last_month = data_last_update['data']['monthNumber']
            logger.info(f"Última atualização encontrada: {last_year}-{last_month}")
        else:
            logger.error(f"Erro ao obter a última data de atualização: {response_last_update.status_code} - {response_last_update.text}")
            return

        params = {
            'flow': 'export',
            'monthDetail': True,
            'period': {
                'from': '1997-01',
                'to': f"{last_year}-{last_month:02}"
            },
            'filters': [
                {
                    'filter': 'heading',
                    'values': [
                        '0302', '0303', '0304', '0305', '0306', '0307', '0308', '0309', '1604', '1605',
                    ],
                },
                {
                    'filter': 'country',
                    'values': [
                        '756', '063', '069', '105', '149', '158', '160', '169', '687', '239',
                        '245', '249', '267', '275', '305', '365', '379', '386', '399', '442',
                        '474', '493', '499', '538', '548', '565', '580', '589', '607', '623',
                        '628', '888', '791', '750', '776', '161', '845', '858',
                    ],
                },
            ],
            'details': ['country', 'state', 'ncm', 'heading'],
            'metrics': ['metricFOB', 'metricKG'],
        }

        url = 'https://api-comexstat.mdic.gov.br/general'
        logger.info("Enviando solicitação para a API com parâmetros especificados.")
        response = requests.post(url, json=params, verify=False)
        logger.info("Status da resposta da API: %s", response.status_code)
        response.raise_for_status()

        logger.info("Resposta recebida com sucesso da API")
        data = response.json()

        if 'data' not in data or 'list' not in data['data']:
            logger.error("Lista de dados não encontrada na resposta da API.")
            return

        new_data = data['data']['list']
        logger.info("Número de registros recebidos: %d", len(new_data))

        cache.set('export_data', new_data, timeout=settings.CACHE_TTL)

        BASE_DIR = Path(__file__).resolve().parent.parent

        file_name = "dados_exportacao.csv"
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

        try:
            with open(file_path, 'w', newline='', encoding='utf-8') as file:
                writer = csv.writer(file)
                headers = ["year", "monthNumber", "country", "state", "ncm", "heading", "metricFOB", "metricKG"]
                writer.writerow(headers)
                for item in new_data:
                    row = [
                        item.get("year", ""),
                        item.get("monthNumber", ""),
                        item.get("country", ""),
                        item.get("state", ""),
                        item.get("ncm", ""),
                        item.get("heading", ""),
                        item.get("metricFOB", ""),
                        item.get("metricKG", "")
                    ]
                    writer.writerow(row)
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
            response = s3_client.list_objects_v2(Bucket='jubart-dashboard', Prefix='data/dados_exportacao_')
            if 'Contents' in response:
                for obj in response['Contents']:
                    s3_client.delete_object(Bucket='jubart-dashboard', Key=obj['Key'])
                logger.info("Arquivos antigos de exportação deletados com sucesso do S3.")
        except Exception as e:
            logger.error(f"Erro ao deletar arquivos antigos de exportação do S3: {e}")

        try:
            s3_client.upload_file(file_path, 'jubart-dashboard', f"data/{file_name}")
            logger.info("Arquivo de exportação enviado com sucesso para o S3.")
            save_latest_file('export', f"data/{file_name}")
        except Exception as e:
            logger.error(f"Erro ao enviar o arquivo de exportação para o S3: {e}")

    except requests.exceptions.RequestException as e:
        logger.error(f"Erro na solicitação para a API: {e}")
    except Exception as e:
        logger.error(f"Erro ao atualizar dados no banco de dados: {e}")
