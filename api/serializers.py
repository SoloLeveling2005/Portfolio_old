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
    edit_community_information = serializers.BooleanField()
    manage_participants = serializers.BooleanField()
    publish_articles = serializers.BooleanField()
    publish_news = serializers.BooleanField()
    publish_ads = serializers.BooleanField()


class SerializerUserProfile(serializers.Serializer):
    location = serializers.CharField()
    gender = serializers.BooleanField()
    birthday = serializers.DateTimeField()


class SerializerUserAdditionalInformation(serializers.Serializer):
    website = serializers.CharField()
    vk_page = serializers.CharField()
    instagram_page = serializers.CharField()
    telegram_profile_link = serializers.CharField()
    telegram_profile_id = serializers.CharField()
    other_info = serializers.CharField()
