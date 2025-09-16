from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(
        r'ws/chat/$',
        consumers.ChatConsumer.as_asgi(),
        name='chat_websocket'
    ),
]

"""
WebSocket URL routing configuration.

Defines the WebSocket endpoints exposed by the application.

WebSocket Endpoints:
- ws/chat/:
    Description: Endpoint for real-time chat messaging.
    Consumer: ChatConsumer
    Usage: Establish a WebSocket connection to this URL to send and receive chat messages.

Note:
- This is not part of the HTTP REST API and is not described by OpenAPI/Swagger specs.
- WebSocket connections should handle authentication as per your app's consumer implementation.
"""
