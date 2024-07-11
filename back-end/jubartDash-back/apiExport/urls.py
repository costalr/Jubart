from django.urls import path
from . import views

urlpatterns = [
    path('get_export_data_url/', views.get_export_data_url, name='get_export_data_url'),
    path('update_export_data/', views.update_export_data_view, name='update_export_data'),
]
