import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import apiImport.routing
import apiExport.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jubartDash.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            apiImport.routing.websocket_urlpatterns +
            apiExport.routing.websocket_urlpatterns
        )
    ),
})
