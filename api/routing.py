from django.urls import path
from api import consumers

websocket_urlpatterns = [
    path('ws/room/<int:room_id>', consumers.ChatConsumer.as_asgi()),
    path('ws/notifications/<int:user_id>', consumers.UserNotification.as_asgi()),
]