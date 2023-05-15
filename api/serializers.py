# serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_jwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers_classes import UserAuth

# Регистрируем классы сереализаторы
UserRegistrationSerializer = UserAuth.UserRegistrationSerializer
UserAuthenticationSerializer = UserAuth.UserAuthenticationSerializer


class SerializerCreateCommunityRole(serializers.Serializer):
    title = serializers.CharField()
    invite_participants = serializers.BooleanField()
    edit_community_information = serializers.BooleanField()
    manage_participants = serializers.BooleanField()
    publish_articles = serializers.BooleanField()
    publish_news = serializers.BooleanField()