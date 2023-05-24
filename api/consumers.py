import json
import random
import string
import time

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from asgiref.sync import sync_to_async

from api import models
from api.models import User


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        if await sync_to_async(User.objects.filter(id=self.room_name).exists)():
            self.room_group_name = f'chat_{self.room_name}'
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()



    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]
        username = data["username"]
        room = data["room"]
        await self.save_message(username, room, message)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "username": username,
                "room": room
            }
        )

    async def chat_message(self, event):
        message = event["message"]
        username = event["username"]
        room = event["room"]

        await self.send(text_data=json.dumps({
            "message": message,
            "username": username,
            "room": room
        }))

    @sync_to_async
    def save_message(self, username, room, message):
        room = models.Room.objects.get(slug=room)

        user = models.User.objects.get(username=username)

        models.ChatMessage.objects.create(user=user, chat=room, content=str(message))
