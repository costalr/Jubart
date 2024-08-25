from django.urls import path
from . import views

urlpatterns = [
    path('get_import_data_url/', views.get_import_data_url, name='get_import_data_url'),
    path('get_import_data_hash/', views.get_import_data_hash, name='get_import_data_hash'),
    path('update_import_data/', views.update_import_data_view, name='update_import_data'),

    # URLs para dados agrupados
    path('get_import_grouped_data_url/', views.get_import_grouped_data_url, name='get_import_grouped_data_url'),
    path('get_import_grouped_data_hash/', views.get_import_grouped_data_hash, name='get_import_grouped_data_hash'),
]
