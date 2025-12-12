# backend/backend/asgi.py
import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

import simulation.routing  # <-- our new app's websocket routes

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

# This is the standard Django ASGI app for HTTP
django_asgi_app = get_asgi_application()

# This is the main ASGI application used by Daphne/Uvicorn/etc.
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(
            simulation.routing.websocket_urlpatterns
        )
    ),
})
