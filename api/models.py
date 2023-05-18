import datetime
import random

from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser, PermissionsMixin, Group, Permission
from django.db import models
from django.db.models import Q
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.template.defaultfilters import slugify


# todo START USERS
# При регистрации создается модель User, отправляется сигнал на создание UserSettings


class CustomUserManager(BaseUserManager):
    def create_user(self, username, password, **extra_fields):
        if not username:
            raise ValueError("The Email field must be set")
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Модель пользователя."""
    username = models.CharField(max_length=150, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'

    objects = CustomUserManager()

    def __str__(self):
        return self.username

    @classmethod
    def user_communities(cls, user_id: int):
        """
        Возвращает список сообществ в которых состоит или которыми владеет пользователь.
         - Проверяет на существование пользователя.
        """
        user_ = cls.objects.filter(id=user_id)
        if not user_.exists():
            return {'message': 'User not found', 'status': 'error'}
        user_ = user_.first()

        communities_ = CommunityParticipant.objects.filter(Q(user=user_))
        my_communities = Community.objects.filter(Q(user=user_))
        communities_ = communities_.union(my_communities)
        return {'status': 'success'}

    @classmethod
    def user(cls, user_id: int):
        user_ = cls.objects.filter(id=user_id)
        if not user_.exists():
            return {'message': 'User not found', 'status': 'error'}
        user_ = user_.first()

        user_avatar = UserAvatar.objects.filter(user=user_)
        if not user_avatar.exists():
            user_avatar = None

        user_profile = UserProfile.objects.filter(user=user_)
        if not user_profile.exists():
            user_profile = None

        user_additional_info = UserAdditionalInformation.objects.filter(id=user_id)
        if not user_additional_info.exists():
            user_additional_info = None

        articles = Article.objects.filter(author=user_)
        comments = ArticleComment.objects.filter(user=user_)

        return {
            'user_info': user_,
            'user_avatar': user_avatar,
            'user_profile': user_profile,
            'user_additional_info': user_additional_info,
            'articles': articles,
            'comments': comments,
        }


@receiver(post_save, sender=User)
def create_user_settings(sender, instance, created, **kwargs):
    if created:
        UserSettings.objects.create(user=instance)


class UserAvatar(models.Model):
    """Модель аватарка пользователя."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_avatar')
    img = models.ImageField(null=False)


class UserSettings(models.Model):
    """
    Модель настроек пользователя.
    show_additional_information - показывать дополнительную информацию
    show_activity_on_the_site - показывать активность на сайте
    telegram_notification - уведомление в telegram
    notification_new_entries - уведомление о новых записях
    notification_comments_under_posts - уведомление о комментариях под публикациями.
    notification_comments_under_posts - уведомление об оценке под публикациями.
    notification_new_friend - уведомление о новом друге
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_settings')
    show_additional_information = models.BooleanField(default=True)
    show_activity_on_the_site = models.BooleanField(default=True)
    telegram_notification = models.BooleanField(default=False)
    notification_new_entries = models.BooleanField(default=True)
    notification_comments_under_posts = models.BooleanField(default=True)
    notification_assessment_under_posts = models.BooleanField(default=True)
    notification_new_friend = models.BooleanField(default=True)


class UserProfile(models.Model):
    """Модель профиля пользователя."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_profile')
    location = models.CharField(max_length=100, null=True)
    gender = models.BooleanField(null=True)  # man true, woman false
    birthday = models.DateTimeField(null=True)


class UserAdditionalInformation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_additional_information')
    website = models.CharField(max_length=200, null=True)
    vk_page = models.CharField(max_length=200, null=True)
    instagram_page = models.CharField(max_length=200, null=True)
    telegram_profile_link = models.CharField(max_length=200, null=True)
    telegram_profile_id = models.CharField(max_length=100, null=True)
    other_info = models.TextField(null=True)


class RequestUserSubscriptions(models.Model):
    """
    Модель запросов на подписку пользователей в друзья.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='request_user_subscriptions_on_user')
    subscriber = models.ForeignKey(User, on_delete=models.CASCADE,
                                   related_name='request_user_subscriptions_on_subscriber')


class UserSubscriptions(models.Model):
    """
    Модель подписок на пользователей.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_subscriptions_on_user')
    subscriber = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_subscriptions_on_subscriber')


class UserRating(models.Model):
    """
    Модель рейтинг пользователя.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_rating_on_user')
    appraiser = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_rating_on_appraiser')
    estimation = models.IntegerField()  # 1 ... 10


class UserBlacklist(models.Model):
    """
    Модель заблокированных пользователей.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_blacklist_on_user')
    banned_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_blacklist_on_banned_user')


class Chat(models.Model):
    """
    Модель чата между двумя пользователями.
    """
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)


class ChatMessage(models.Model):
    """
    Модель сообщения чата между двумя пользователями.
    """
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="chat_messages")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chat_messages")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now=True)


class ChatParticipant(models.Model):
    """
    Модель участника чата между двумя пользователями.
    """
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="chat_participant")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chat_participant")


class UserBannedChat(models.Model):
    """
    Модель заблокированных пользователями чатов.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_banned_chat')
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='user_banned_chat')


# todo END USERS   ---------------------------------------------------------------------
# todo START COMMUNITY   ---------------------------------------------------------------------

class Community(models.Model):
    """
    Модель сообщества.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='community')
    title = models.CharField(max_length=100, null=False)
    description = models.CharField(max_length=255, null=False)
    created_at = models.DateTimeField(auto_now_add=True)


class CommunityAvatar(models.Model):
    """
    Модель аватарки сообщества.
    """
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='community_avatar')
    img = models.ImageField(null=False)


class CommunityRecommendation(models.Model):
    """
    Модель рекомендаций сообществ. Рейтинг сообщества.
    """
    community = models.ForeignKey(
        Community,
        on_delete=models.CASCADE,
        related_name='community_recommendation_by_community'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='community_recommendation_by_user'
    )
    score = models.SmallIntegerField()  # от 1 до 10


class CommunityRole(models.Model):
    """
    Модель роли в сообществе и его разрешения.
     - edit_community_information - редактировать информацию о сообществе (название, теги, описание и т.д.).
     - manage_participants - управление пользователями (добавление, удаление, бан и т.д.).
     - publish_articles - публиковать статьи.
     - publish_news - публиковать новости.
     - publish_ads - публиковать рекламу.
    """
    title = models.CharField(max_length=100, unique=True)
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='community_role')
    edit_community_information = models.BooleanField(default=False)
    manage_participants = models.BooleanField(default=False)
    publish_articles = models.BooleanField(default=True)
    publish_news = models.BooleanField(default=True)
    publish_ads = models.BooleanField(default=False)


class CommunityParticipant(models.Model):
    """
    Модель участников сообщества.
    """
    community = models.ForeignKey(Community, on_delete=models.CASCADE,
                                  related_name='community_participant_by_community')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='community_participant_by_user')
    role = models.ForeignKey(CommunityRole, on_delete=models.CASCADE, null=True)


class RequestCommunityParticipant(models.Model):
    """
    Модель запросов участников на вступление в сообщество.
    """
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='request_in_community_by_community')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='request_in_community_by_user')


class CommunityTag(models.Model):
    """
    Модель тега сообщества.
    """
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='community_tag')
    tag = models.CharField(max_length=150)


class CommunityChat(models.Model):
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='community_room')
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)


class CommunityChatMessage(models.Model):
    room = models.ForeignKey(CommunityChat, related_name="community_chat_message_by_room", on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name="community_chat_message_by_user", on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now=True)


class CommunityChatParticipant(models.Model):
    chat = models.ForeignKey(CommunityChat, related_name="community_chat_participant_by_chat", on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name="community_chat_participant_by_user", on_delete=models.CASCADE)


# todo END COMMUNITY   ---------------------------------------------------------------------
# todo START ARTICLES   ---------------------------------------------------------------------

class TitleImageArticle(models.Model):
    """
    Модель картинки в заголовке.
    """
    img = models.ImageField(null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='article_title_img')


class Article(models.Model):
    """
    Модель статьи.
    """
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='article_by_author')
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='article_by_community')
    title = models.CharField(max_length=155, null=False)
    description = models.CharField(max_length=355, null=False)
    content = models.TextField(null=False)
    status = models.SmallIntegerField(null=False, default=1)  # global = 1 / local = 2
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField()


class ArticleTags(models.Model):
    """
    Модель тегов статьи.
    """
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='article_tag')
    tag = models.CharField(max_length=100)


class ArticleComment(models.Model):
    """
    Модель комментария статьи.
    """
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='article_comment_on_article')
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE,
                                       related_name='article_comment_on_parent_comment', null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='article_comment_on_user')
    content = models.CharField(max_length=300)


class ArticleAssessment(models.Model):
    """
    Модель оценок статьи.
    """
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='article_assessment')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='article_assessment')
    status = models.BooleanField(null=False)


class ArticleBookmarks(models.Model):
    """
    Модель закладок пользователя (статей).
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_bookmark')
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='user_bookmark')


# todo END ARTICLES   ---------------------------------------------------------------------
# todo START  NEWS  ---------------------------------------------------------------------

class News(models.Model):
    """
    Модель новости.
    """
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='news')
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='news')
    title = models.CharField(max_length=155, null=False)
    description = models.CharField(max_length=355, null=False)
    status = models.SmallIntegerField(null=False, default=1)  # global = 1 / local = 2
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField()


class NewsTag(models.Model):
    """
    Модель тега новости.
    """
    news = models.ForeignKey(News, on_delete=models.CASCADE, related_name='news_tag')
    tag = models.CharField(max_length=100)

# todo END NEWS   ---------------------------------------------------------------------
