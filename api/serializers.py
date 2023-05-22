# serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_jwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken

from . import models
from .models import User
from .serializers_classes import UserAuth

# Регистрируем классы сереализаторы
UserRegistrationSerializer = UserAuth.UserRegistrationSerializer
UserAuthenticationSerializer = UserAuth.UserAuthenticationSerializer


class UserSerializerModel(serializers.ModelSerializer):
    # Добавьте это поле, чтобы получить объект пользователя вместо строки "username"
    id = serializers.IntegerField()
    username = serializers.CharField()
    password = serializers.CharField()

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'is_active',
                  'is_staff']  # Укажите нужные поля вашей модели пользователя


class SerializerCreateCommunityRole(serializers.Serializer):
    title = serializers.CharField()
    edit_community_information = serializers.BooleanField()
    manage_participants = serializers.BooleanField()
    publish_articles = serializers.BooleanField()
    publish_news = serializers.BooleanField()
    publish_ads = serializers.BooleanField()


class SerializerUserProfile(serializers.Serializer):
    short_info = serializers.CharField()
    location = serializers.CharField()
    gender = serializers.BooleanField()
    birthday = serializers.CharField()


class SerializerUserAdditionalInformation(serializers.Serializer):
    website = serializers.CharField()
    vk_page = serializers.CharField()
    instagram_page = serializers.CharField()
    telegram_profile_link = serializers.CharField()
    telegram_profile_id = serializers.CharField()
    other_info = serializers.CharField()


# JSON

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserProfile
        fields = '__all__'


class AdditionalInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserAdditionalInformation
        fields = '__all__'


class ArticleCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ArticleComment
        fields = '__all__'


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Article
        fields = '__all__'


class CommunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Community
        fields = '__all__'


class RequestUserSubscriptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RequestUserSubscriptions
        fields = '__all__'


class UserSubscriptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserSubscriptions
        fields = '__all__'


class CommunityAvatarSereilizer(serializers.ModelSerializer):
    class Meta:
        model = models.CommunityAvatar
        fields = '__all__'


class CommunityRolesSereilizer(serializers.ModelSerializer):
    class Meta:
        model = models.CommunityRole
        fields = '__all__'


class RequestCommunityParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RequestCommunityParticipant
        fields = '__all__'
