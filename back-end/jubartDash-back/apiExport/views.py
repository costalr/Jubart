import boto3
from django.http import JsonResponse
from django.conf import settings
import logging
import json
import gzip
import io
from .tasks import calculate_data_hash, fetch_and_update_export_data
from apiCommon.models import LatestFile
from django.views.decorators.http import require_GET, require_POST

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
        logger.error(f"Erro ao gerar URL presignada para exportação: {e}")
        return None

@require_GET
def get_export_data_url(request):
    try:
        latest_file = LatestFile.objects.filter(file_type='export').first()
        if (latest_file):
            file_key = latest_file.file_key
            url = get_s3_presigned_url(file_key)
            if url:
                logger.info(f"URL gerada para dados de exportação: {url}")
                return JsonResponse({'url': url})
        return JsonResponse({'error': 'Unable to generate URL'}, status=500)
    except Exception as e:
        logger.error(f"Erro ao obter URL de dados de exportação: {e}", exc_info=True)
        return JsonResponse({'error': str(e)}, status=500)

@require_GET
def get_export_data_hash(request):
    try:
        latest_file = LatestFile.objects.filter(file_type='export').first()
        if (latest_file):
            file_key = latest_file.file_key
            s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
            )
            response = s3_client.get_object(Bucket='jubart-dashboard', Key=file_key)
            compressed_data = response['Body'].read()

            with gzip.GzipFile(fileobj=io.BytesIO(compressed_data)) as gz:
                data = gz.read().decode('utf-8')

            data_hash = calculate_data_hash(json.loads(data))
            logger.info(f"Hash dos dados de exportação: {data_hash}")
            return JsonResponse({'hash': data_hash})
        return JsonResponse({'error': 'Unable to get hash'}, status=500)
    except Exception as e:
        logger.error(f"Erro ao obter hash de dados de exportação: {e}", exc_info=True)
        return JsonResponse({'error': str(e)}, status=500)

@require_GET
def get_export_grouped_data_url(request):
    try:
        latest_file = LatestFile.objects.filter(file_type='export_grouped').first()
        if latest_file:
            file_key = latest_file.file_key
            url = get_s3_presigned_url(file_key)
            if url:
                logger.info(f"URL gerada para dados agrupados de exportação: {url}")
                return JsonResponse({'url': url})
        return JsonResponse({'error': 'Unable to generate URL'}, status=500)
    except Exception as e:
        logger.error(f"Erro ao obter URL de dados agrupados de exportação: {e}", exc_info=True)
        return JsonResponse({'error': str(e)}, status=500)

@require_GET
def get_export_grouped_data_hash(request):
    try:
        latest_file = LatestFile.objects.filter(file_type='export_grouped').first()
        if latest_file:
            file_key = latest_file.file_key
            s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
            )
            response = s3_client.get_object(Bucket='jubart-dashboard', Key=file_key)
            compressed_data = response['Body'].read()

            with gzip.GzipFile(fileobj=io.BytesIO(compressed_data)) as gz:
                data = gz.read().decode('utf-8')

            data_hash = calculate_data_hash(json.loads(data))
            logger.info(f"Hash dos dados agrupados de exportação: {data_hash}")
            return JsonResponse({'hash': data_hash})
        return JsonResponse({'error': 'Unable to get hash'}, status=500)
    except Exception as e:
        logger.error(f"Erro ao obter hash de dados agrupados de exportação: {e}", exc_info=True)
        return JsonResponse({'error': str(e)}, status=500)

@require_POST
def update_export_data_view(request):
    try:
        result = fetch_and_update_export_data.delay()
        logger.info(f"Update de dados de exportação iniciado: {result.id}")
        return JsonResponse({'message': 'Dados de exportação atualizados com sucesso.'})
    except Exception as e:
        logger.error(f"Erro ao atualizar dados de exportação: {e}", exc_info=True)
        return JsonResponse({'error': str(e)}, status=500)
