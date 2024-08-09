import boto3
from django.http import JsonResponse
from django.conf import settings
import logging
import json
from .tasks import calculate_data_hash, fetch_and_update_import_data
from apiCommon.models import LatestFile
from django.views.decorators.http import require_GET, require_POST

# Configuração do logging
logger = logging.getLogger(__name__)

def get_s3_presigned_url(file_key):
    s3_client = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
    )
    try:
        url = s3_client.generate_presigned_url(
            ClientMethod='get_object',
            Params={'Bucket': 'jubart-dashboard', 'Key': file_key},
            ExpiresIn=3600
        )
        return url
    except Exception as e:
        logger.error(f"Erro ao gerar URL presignada para importação: {e}")
        return None

@require_GET
def get_import_data_url(request):
    try:
        latest_file = LatestFile.objects.filter(file_type='import').first()
        if latest_file:
            file_key = latest_file.file_key
            url = get_s3_presigned_url(file_key)
            if url:
                logger.info(f"URL gerada para dados de importação: {url}")
                return JsonResponse({'url': url})
        return JsonResponse({'error': 'Unable to generate URL'}, status=500)
    except Exception as e:
        logger.error(f"Erro ao obter URL de dados de importação: {e}", exc_info=True)
        return JsonResponse({'error': str(e)}, status=500)

@require_GET
def get_import_data_hash(request):
    try:
        latest_file = LatestFile.objects.filter(file_type='import').first()
        if latest_file:
            file_key = latest_file.file_key
            s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
            )
            response = s3_client.get_object(Bucket='jubart-dashboard', Key=file_key)
            data = response['Body'].read().decode('utf-8')
            data_hash = calculate_data_hash(json.loads(data))
            logger.info(f"Hash dos dados de importação: {data_hash}")
            return JsonResponse({'hash': data_hash})
        return JsonResponse({'error': 'Unable to get hash'}, status=500)
    except Exception as e:
        logger.error(f"Erro ao obter hash de dados de importação: {e}", exc_info=True)
        return JsonResponse({'error': str(e)}, status=500)

@require_POST
def update_import_data_view(request):
    try:
        result = fetch_and_update_import_data.delay()
        logger.info(f"Update de dados de importação iniciado: {result.id}")
        return JsonResponse({'message': 'Dados de importação atualizados com sucesso.'})
    except Exception as e:
        logger.error(f"Erro ao atualizar dados de importação: {e}", exc_info=True)
        return JsonResponse({'error': str(e)}, status=500)

# Função para logs detalhados (desativada por padrão)
def log_data(data, data_type="importação"):
    volume_atual = sum(item['metricKG'] for item in data['current_year_data']) / 1000
    volume_ano_passado = sum(item['metricKG'] for item in data['previous_year_data']) / 1000
    dispendio_atual = sum(item['metricFOB'] for item in data['current_year_data'])
    dispendio_ano_passado = sum(item['metricFOB'] for item in data['previous_year_data'])
    preco_medio_atual = dispendio_atual / volume_atual
    preco_medio_ano_passado = dispendio_ano_passado / volume_ano_passado

    # logger.info(f"Resultados para {data_type} - JSON")
    # logger.info(f"Volume de {data_type} Atual (JSON): {volume_atual:.2f} t")
    # logger.info(f"Dispendio de {data_type} Atual (JSON): {dispendio_atual:.2f} US$")
    # logger.info(f"Preço Médio de {data_type} Atual (JSON): {preco_medio_atual:.2f} US$/t")
    # logger.info(f"Volume de {data_type} Ano Passado (JSON): {volume_ano_passado:.2f} t")
    # logger.info(f"Dispendio de {data_type} Ano Passado (JSON): {dispendio_ano_passado:.2f} US$")
    # logger.info(f"Preço Médio de {data_type} Ano Passado (JSON): {preco_medio_ano_passado:.2f} US$/t")

    variacao_volume = ((volume_atual - volume_ano_passado) / volume_ano_passado) * 100
    variacao_dispendio = ((dispendio_atual - dispendio_ano_passado) / dispendio_ano_passado) * 100
    variacao_preco_medio = ((preco_medio_atual - preco_medio_ano_passado) / preco_medio_ano_passado) * 100

    # logger.info(f"Variação de Volume de {data_type} (JSON): {variacao_volume:.2f} %")
    # logger.info(f"Variação de Dispendio de {data_type} (JSON): {variacao_dispendio:.2f} %")
    # logger.info(f"Variação de Preço Médio de {data_type} (JSON): {variacao_preco_medio:.2f} %")
