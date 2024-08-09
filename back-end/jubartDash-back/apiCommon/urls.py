# apiCommon/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('latest_file/', views.latest_file_view, name='latest_file'),
    path('update_latest_file_key/', views.update_latest_file_key, name='update_latest_file_key'),
]
