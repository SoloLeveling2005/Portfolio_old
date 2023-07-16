from django.db import transaction
from django.test import TestCase
import models

class UserTests(TestCase):
    def create_user(self):
        with transaction.atomic():
            try:
                # Создание пользователя
                user = models.User.objects.create(username='john', email='john@example.com')

                # Проверка создания пользователя
                self.assertEqual(user.username, 'john')
                self.assertEqual(user.email, 'john@example.com')
                self.assertTrue(user.is_active)

                # Проверка, что пользователь сохранен в базу данных
                saved_user = models.User.objects.get(username='john')
                self.assertEqual(saved_user, user)
            except Exception as e:
                transaction.set_rollback(True)
                raise e
