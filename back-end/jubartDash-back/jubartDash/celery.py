# jubartDash/celery.py

from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Define as configurações padrão do Django para o celery
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jubartDash.settings')

app = Celery('jubartDash')

# o objeto de configuração para transferi-lo para os subprocessos.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Descobre automaticamente as tarefas em apps Django.
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')

app.conf.update(
    broker_connection_retry_on_startup=True
)