# apiCommon/views.py

from django.http import JsonResponse
from .models import LatestFile

def latest_file_view(request):
    latest_file = LatestFile.objects.first()
    if latest_file:
        return JsonResponse({'file_key': latest_file.file_key})
    return JsonResponse({'error': 'No files found'}, status=404)
