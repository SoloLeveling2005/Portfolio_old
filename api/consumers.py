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
            "username": username,
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
    """
    Класс обрабатывающий сокет, сообщает клиенту тип уведомлений для обновления данных.
    Какие типы уведомлений могут быть:
    - admin_notification - уведомление от админа.
    - notification_new_entries - уведомление о новых записях
    - notification_comments_under_posts - уведомление о комментариях под публикациями.
    - notification_assessment_under_posts - уведомление об оценке под публикациями.
    - notification_new_friend - уведомление о новом друге
    - notification_confirm_friend - уведомление о подтверждение добавлении в друзья другим пользователем.
    """

    async def connect(self):
        # Извлекаем имя комнаты из URL-маршрута и сохраняем его в self.room_id.
        self.sender_id = self.scope['url_route']['kwargs']['sender_id']

        # Проверяем существование пользователя с идентификатором, равным room_id.
        if await sync_to_async(User.objects.filter(id=self.sender_id).exists)():
            # Если пользователь существует, формируем имя группы комнаты (room_group_name).
            self.room_group_name = f'notification_user_{self.sender_id}'

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

        # Отправляем уведомление тому кому нужно, а не тому кто в данной комнате
        room_group_name = f'notification_user_{receiver_id}'

        message = ''

        # Проверка на существование пользователя.
        receiver = User.objects.filter(id=receiver_id)
        if not receiver.exists():
            # Отправляем сообщение обратно самому же (ошибку).
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "status": "error",
                    "type": "error",
                    "message": "Такого пользователя не существует",
                }
            )

        if notification_type == 'admin_notification':
            message = data["message"]
            if message is None:
                # Отправляем сообщение обратно самому же (ошибку).
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "status": "error",
                        "type": "error",
                        "message": "Сообщение не было предоставлено",
                    }
                )

        elif notification_type == 'notification_new_entries':
            # Проверяем настройки пользователя, если уведомление такого типа включено то добавляем
            if receiver.notification_new_entries:
                community_title = data["community_title"]
                if community_title is None:
                    # Отправляем сообщение обратно самому же (ошибку).
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            "status": "error",
                            "type": "error",
                            "message": "Название сообщества не было подано.",
                        }
                    )

                message = f"В сообществе {community_title} опубликовали новую запись"

        elif notification_type == 'notification_comments_under_posts':
            # Проверяем настройки пользователя, если уведомление такого типа включено то добавляем
            if receiver.notification_comments_under_posts:
                article_title = data["article_title"]
                if article_title is None:
                    # Отправляем сообщение обратно самому же (ошибку).
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            "status": "error",
                            "type": "error",
                            "message": "Название сообщества не было подано.",
                        }
                    )

                message = f"Под вашей статьей {article_title} оставили новый комментарий"

        elif notification_type == 'notification_assessment_under_posts':
            # Проверяем настройки пользователя, если уведомление такого типа включено то добавляем
            if receiver.notification_assessment_under_posts:
                article_title = data["article_title"]
                if article_title is None:
                    # Отправляем сообщение обратно самому же (ошибку).
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            "status": "error",
                            "type": "error",
                            "message": "Название сообщества не было подано.",
                        }
                    )

                message = f"Под вашей статьей {article_title} оставили оценку"

        elif notification_type == 'notification_new_friend':
            # Проверяем настройки пользователя, если уведомление такого типа включено то добавляем
            if receiver.notification_new_friend:
                message = f"У вас новый друг!"

        elif notification_type == 'notification_confirm_friend':
            # Проверяем настройки пользователя, если уведомление такого типа включено то добавляем
            if receiver.notification_new_friend:
                message = f"Ваша заявка в друзья подтверждена"

        if message != '':
            # Если пользователь онлайн, отправляем ему сообщение.
            if await self.channel_layer.group_exists(room_group_name):

                # Создаем уведомление
                sync_to_async(models.Notification.objects.create(
                    user=receiver,
                    notification_type=notification_type,
                    message=message,
                    is_read=True
                ))

                # Отправляем сообщение группе комнаты.
                await self.channel_layer.group_send(
                    room_group_name,
                    {
                        "status": "success",
                        "type": notification_type,
                        "message": message,
                    }
                )
            else:
                # Создаем уведомление без отправки на Frontend, прочитан = False
                sync_to_async(models.Notification.objects.create(
                    user=receiver,
                    notification_type=notification_type,
                    message=message,
                    is_read=False
                ))
        else:
            # Отправляем сообщение обратно самому же (warning).
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "status": "warning",
                    "type": "warning",
                    "message": "Неопределённая",
                }
            )
