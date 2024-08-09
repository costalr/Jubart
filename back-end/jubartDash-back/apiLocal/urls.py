from django.urls import path
from .views import get_import_data, get_export_data

urlpatterns = [
    path('get_import_data/', get_import_data, name='get_import_data'),
    path('get_export_data/', get_export_data, name='get_export_data'),
]
