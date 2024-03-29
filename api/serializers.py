# Настраиваем сериализаторы.

from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_jwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken

# Импорт моделей
from . import models
# Импорт модели User
from .models import User
# Импорт сериализатора UserAuth
from .serializers_classes import UserAuth

# Регистрируем классы сереализаторы
UserRegistrationSerializer = UserAuth.UserRegistrationSerializer
UserAuthenticationSerializer = UserAuth.UserAuthenticationSerializer


# Сериализатор модели User.
class UserSerializerModel(serializers.ModelSerializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    password = serializers.CharField()

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'is_active',
                  'is_staff', 'is_online', 'last_online']


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

# class NotificationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = models.Notification
#         fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ['id', 'username', 'is_online', 'last_online', 'created_at']

# class ProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = models.UserProfile
#         fields = '__all__'
#
#
# class AdditionalInformationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = models.UserAdditionalInformation
#         fields = '__all__'
#
#
# class ArticleCommentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = models.ArticleComment
#         fields = '__all__'
#
#
# class ArticleSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = models.Article
#         fields = '__all__'
#
#
# class CommunitySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = models.Community
#         fields = '__all__'
#
#
# class RequestUserSubscriptionsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = models.RequestUserSubscriptions
#         fields = '__all__'
#
#
# class UserSubscriptionsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = models.UserSubscriptions
#         fields = '__all__'
#
#
# class CommunityParticipantSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = models.CommunityParticipant
#         fields = '__all__'
#
#
# class CommunityAvatarSereilizer(serializers.ModelSerializer):
#     class Meta:
#         model = models.CommunityAvatar
#         fields = '__all__'
#
#
# class CommunityRolesSereilizer(serializers.ModelSerializer):
#     class Meta:
#         model = models.CommunityRolew
