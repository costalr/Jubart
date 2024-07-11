from django.http import JsonResponse
from django.conf import settings
import boto3
from apiCommon.models import LatestFile
import logging
from .tasks import fetch_and_update_import_data
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
        logger.error(f"Erro ao gerar URL presignada: {e}")
        return None

@require_GET
def get_import_data_url(request):
    try:
        latest_file = LatestFile.objects.filter(file_type='import').first()
        if latest_file:
            # Ajuste do caminho do arquivo para data/ em vez de data/data/
            file_key = 'data/' + latest_file.file_key.split('/')[-1]
            url = get_s3_presigned_url(file_key)
            if url:
                return JsonResponse({'url': url})
        return JsonResponse({'error': 'Unable to generate URL'}, status=500)
    except Exception as e:
        logger.error(f"Erro ao obter URL de dados de importação: {e}", exc_info=True)
        return JsonResponse({'error': str(e)}, status=500)

@require_POST
def update_import_data_view(request):
    try:
        fetch_and_update_import_data.delay()  # Certifique-se de que a tarefa Celery está sendo chamada de forma assíncrona
        return JsonResponse({'message': 'Dados de importação atualizados com sucesso.'})
    except Exception as e:
        logger.error(f"Erro ao atualizar dados de importação: {e}", exc_info=True)
        return JsonResponse({'error': str(e)}, status=500)

# Funções de teste, que parecem ser placeholders, então vou deixá-las como estão
def fetch_data_imp(request):
    return JsonResponse({"message": "Dados de importação"})

def get_import_data(request):
    return JsonResponse({"message": "Obter dados de importação"})

def test_upload(request):
    return JsonResponse({"message": "Testar upload"})
