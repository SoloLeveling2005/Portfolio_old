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
        # Извлекаем имя комнаты из URL-маршрута и сохраняем его в self.room_id.
        self.room_id = self.scope['url_route']['kwargs']['room_id']

        # Проверяем существование комнаты с идентификатором, равным room_id.
        if await sync_to_async(models.Room.objects.filter(id=self.room_id).exists)():

            # Если пользователь существует, формируем имя группы комнаты (room_group_name).
            self.room_group_name = f'chat_{self.room_id}'

            # Добавляем текущий канал (channel_name) в эту группу.
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            # Принимаем соединение с клиентом
            await self.accept()

    async def disconnect(self, code):
        # Удаляем текущий канал из группы комнаты (self.room_group_name), когда клиент отключается.
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

    async def receive(self, text_data):
        # Получаем данные с клиента.
        data = json.loads(text_data)
        message = data["message"]
        username = data["username"]
        room_id = data["room_id"]

        # Вызываем метод сохранения сообщения в бд.
        await self.save_message(username, room_id, message)

        # Отправляем сообщение группе комнаты.
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "username": username,
                "room_id": room_id
            }
        )

    async def chat_message(self, event):
        # Получает событие chat_message от группы комнаты.
        # Извлекаем информацию о сообщении, имени пользователя и комнате из полученного события.
        message = event["message"]
        username = event["username"]
        room_id = event["room_id"]

        # Отправляем данные о сообщении, имени пользователя и комнате обратно клиенту с помощью send().
        await self.send(text_data=json.dumps({
            "message": message,
            "user_id": username,
            "room_id": room_id
        }))

    @sync_to_async
    def save_message(self, username, room_id, message):
        # Получаем модели комнаты и пользователя.
        room = models.Room.objects.get(id=room_id)
        user = models.User.objects.get(username=username)

        # Создаем сообщение в бд.
        models.RoomMessage.objects.create(user=user, room=room, content=str(message))


class UserNotification(AsyncJsonWebsocketConsumer):
    async def connect(self):
        # Извлекаем имя комнаты из URL-маршрута и сохраняем его в self.room_id.
        self.sender_id = self.scope['url_route']['kwargs']['user_id']

        # Проверяем существование пользователя с идентификатором, равным room_id.
        if await sync_to_async(User.objects.filter(id=self.sender_id).exists)():
            # Если пользователь существует, формируем имя группы комнаты (room_group_name).
            self.room_group_name = f'notification/user/{self.sender_id}'

            # Добавляем текущий канал (channel_name) в эту группу.
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            # Принимаем соединение с клиентом
            await self.accept()

    async def disconnect(self, code):
        # Удаляем текущий канал из группы комнаты (self.room_group_name), когда клиент отключается.
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

    async def receive(self, text_data):
        # Получаем данные с клиента.
        data = json.loads(text_data)
        notification_type = data["notification_type"]
        receiver_id = data["receiver_id"]

        room_group_name = f'notification/user/{receiver_id}'

        # Вызываем метод сохранения сообщения в бд.
        await self.save_message(username, room_id, message)

        # Отправляем сообщение группе комнаты.
        await self.channel_layer.group_send(
            room_group_name,
            {
                "type": "chat_message",
                "message": notification_type,
            }
        )

    async def notify_admin_notification(self):
        # Метод для обработки уведомления от администрации.
        # Вызывается, когда приходит новое оповещение от администрации.
        # Может содержать информацию о тексте уведомления, дате и т.д.
        await self.send(text_data=json.dumps({
            "type": "admin_notification"
        }))

    async def notify_friend_request(self):
        # Метод для обработки уведомления о запросе в друзья.
        # Вызывается, когда приходит новый запрос в друзья.
        # Может содержать информацию о пользователе, отправившем запрос, дате и т.д.
        await self.send(text_data=json.dumps({
            "type": "friend_request"
        }))

    async def notify_new_post(self):
        # Метод для обработки уведомления о новых записях
        # Вызывается, когда появляется новая запись.
        # Может содержать информацию о записи, авторе, дате и т.д.
        await self.send(text_data=json.dumps({
            "type": "new_post"
        }))

    async def notify_new_comment(self):
        # Метод для обработки уведомления о комментариях под публикациями
        # Вызывается, когда появляется новый комментарий.
        # Может содержать информацию о комментарии, авторе, публикации, дате и т.д.
        await self.send(text_data=json.dumps({
            "type": "new_comment"
        }))

    async def notify_new_rating(self):
        # Метод для обработки уведомления об оценке под публикациями
        # Вызывается, когда появляется новая оценка.
        # Может содержать информацию об оценке, авторе, публикации, дате и т.д.
        await self.send(text_data=json.dumps({
            "type": "new_rating"
        }))

    async def notify_new_friend(self):
        # Метод для обработки уведомления о новом друге.
        # Вызывается, когда появляется новый друг.
        # Может содержать информацию о пользователе, добавленном в друзья, дате и т.д.
        await self.send(text_data=json.dumps({
            "type": "new_friend"
        }))