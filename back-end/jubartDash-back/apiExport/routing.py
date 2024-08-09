# apiExport/routing.py

from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/export-data/$', consumers.DataUpdateConsumer.as_asgi()), 
]
