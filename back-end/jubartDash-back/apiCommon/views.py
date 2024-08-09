# apiCommon/views.py

from django.http import JsonResponse
from .models import LatestFile

def latest_file_view(request):
    latest_file = LatestFile.objects.first()
    if latest_file:
        return JsonResponse({'file_key': latest_file.file_key})
    return JsonResponse({'error': 'No files found'}, status=404)

def update_latest_file_key(request):
    try:
        latest_files = LatestFile.objects.filter(file_type='export')
        if latest_files.exists():
            latest_files.update(file_key='data/dados_exportacao.json')
            return JsonResponse({'message': 'File keys updated successfully'})
        else:
            return JsonResponse({'error': 'No LatestFile entries found for export'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
