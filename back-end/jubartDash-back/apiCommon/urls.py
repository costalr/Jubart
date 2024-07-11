from django.urls import path
from . import views

urlpatterns = [
    path('latest-file/', views.latest_file_view, name='latest_file_view'),
]
