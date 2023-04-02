from django.urls import path
from messenger import consumers

websocket_urlpatterns = [
    path('ws/<slug:room_name>/', consumers.ChatConsumer.as_asgi())
]
