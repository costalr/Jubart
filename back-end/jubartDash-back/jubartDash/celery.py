from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Defina o ambiente padrão para o Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jubartDash.settings')

app = Celery('jubartDash')

# Carregar configurações do Django
app.config_from_object('django.conf:settings', namespace='CELERY')

# Descobrir e carregar tarefas
app.autodiscover_tasks()
