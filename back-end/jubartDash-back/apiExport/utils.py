# apiExport/utils.py

import logging
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# Configurar o logger
logger = logging.getLogger('myapp')

def notify_update(data):
    try:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "data_updates",
            {
                "type": "send_update",
                "data": data
            }
        )
        logger.info(f"Notificação enviada: {data}")
    except Exception as e:
        logger.error(f"Erro ao enviar notificação via WebSocket: {e}")
