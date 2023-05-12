import datetime
import random

from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser, PermissionsMixin, Group, Permission
from django.db import models
from django.db.models import Q
from django.template.defaultfilters import slugify


# todo START USERS
# При регистрации создается модель User, отправляется сигнал на создание UserSettings


class User(AbstractUser):
    """
    Сигнал на создание настроек пользователя создан.
    """
    biography_small = models.CharField(max_length=255, blank=True)

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


class UserAvatar(models.Model):
    """
    Модель аватарка пользователя.
    - user - ссылка на пользователя, который имеет данную аватарку.
    - img - аватарка пользователя.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_avatar')
    img = models.ImageField(null=False)

    @classmethod
    def create_avatar(cls, user_id: int, img):
        """
        Создает новую аватарку для пользователя в базе данных.
        :param user_id: ID пользователя
        :param img: Аватарка
        """
        user = User.objects.get(id=user_id)
        cls.objects.create_(user=user, img=img)

    @classmethod
    def get_avatar(cls, user_id: int):
        """
        Возвращает модель картинки.
        :param user_id: ID пользователя.
        """
        user = User.objects.get(id=user_id)
        return UserAvatar.objects.get(user=user)


class UserSettings(models.Model):
    """
    Модель настроек пользователя.
    show_additional_information - показывать дополнительную информацию
    show_activity_on_the_site - показывать активность на сайте
    telegram_notification - уведомление в telegram
    notification_new_entries - уведомление о новых записях
    notification_comments_under_posts - уведомление о комментариях под публикациями
    notification_new_friend - уведомление о новом друге
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_settings')
    show_additional_information = models.BooleanField(default=True)
    show_activity_on_the_site = models.BooleanField(default=True)
    telegram_notification = models.BooleanField(default=False)
    notification_new_entries = models.BooleanField(default=True)
    notification_comments_under_posts = models.BooleanField(default=True)
    notification_new_friend = models.BooleanField(default=True)


class UserProfile(models.Model):
    """
    Модель профиля пользователя.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_profile')
    location = models.CharField(max_length=100, null=True)
    gender = models.BooleanField(null=True)  # man true, woman false
    birthday = models.DateTimeField(null=True)

    @classmethod
    def create_(cls, user_id: int, location: str = None, gender: bool = None, birthday: datetime = None):
        """
        Создает профиль пользователя.
         - Проверяет на существование пользователя.
         - Проверяет на существование профиля пользователя.
        """
        user_ = User.objects.filter(id=user_id)
        if not user_.exists():
            return {'message': 'User not found', 'status': 'error'}
        user_ = user_.first()

        created = cls.objects.filter(user=user_)
        if created.exists():
            return {'message': 'User already created', 'status': 'error'}

        cls.objects.create_(user=user_, location=location, gender=gender, birthday=birthday)

        return {'status': 'success'}

    @classmethod
    def update(cls, user_id: int, location: str = None, gender: bool = None, birthday: datetime = None):
        """
        Редактирует профиль пользователя.
         - Проверяет на существование пользователя.
         - Проверяет на существование профиля пользователя.
        """
        user_ = User.objects.filter(id=user_id)
        if not user_.exists():
            return {'message': 'User not found', 'status': 'error'}
        user_ = user_.first()

        created = cls.objects.filter(user=user_)
        if not created.exists():
            return {'message': 'User profile not found', 'status': 'error'}
        created = created.first()

        location = location if location is not None else created.location
        gender = gender if gender is not None else created.gender
        birthday = birthday if birthday is not None else created.birthday
        created.location, created.gender, created.birthday = location, gender, birthday
        created.save()

        return {'status': 'success'}


class UserAdditionalInformation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_additional_information')
    website = models.CharField(max_length=200, null=True)
    telegram_profile_link = models.CharField(max_length=200, null=True)
    telegram_profile_id = models.CharField(max_length=100, null=True)
    other_info = models.TextField(null=True)

    @classmethod
    def create_(cls,
                user_id: int,
                website: str = None,
                telegram_profile_link: bool = None,
                telegram_profile_id: datetime = None,
                other_info: str = None
                ):
        """
        Создает доп.информацию пользователя.
         - Проверяет на существование пользователя.
         - Проверяет на существование доп.информации пользователя.
        """
        user_ = User.objects.filter(id=user_id)
        if not user_.exists():
            return {'message': 'User not found', 'status': 'error'}
        user_ = user_.first()

        created = User.objects.filter(user=user_)
        if created.exists():
            return {'message': 'User additional information already created', 'status': 'error'}

        cls.objects.create_(
            user=user_,
            website=website,
            telegram_profile_link=telegram_profile_link,
            telegram_profile_id=telegram_profile_id,
            other_info=other_info
        )

        return {'status': 'success'}

    @classmethod
    def update(cls,
               user_id: int,
               website: str = None,
               telegram_profile_link: bool = None,
               telegram_profile_id: datetime = None,
               other_info: str = None
               ):
        """
        Редактирует доп.информацию пользователя.
         - Проверяет на существование пользователя.
         - Проверяет на существование доп.информации пользователя.
        """
        user_ = User.objects.filter(id=user_id)
        if not user_.exists():
            return {'message': 'User not found', 'status': 'error'}
        user_ = user_.first()

        created = User.objects.filter(user=user_)
        if not created.exists():
            return {'message': 'User additional information not found', 'status': 'error'}
        created = created.first()

        website = website if website is not None else created.website
        telegram_profile_link = telegram_profile_link if telegram_profile_link is not None else created.telegram_profile_link
        telegram_profile_id = telegram_profile_id if telegram_profile_id is not None else created.telegram_profile_id
        other_info = other_info if other_info is not None else created.other_info
        created.website, created.telegram_profile_link, created.telegram_profile_id, created.other_info = \
            website, telegram_profile_link, telegram_profile_id, other_info
        created.save()

        return {'status': 'success'}


class UserSubscriptions(models.Model):
    """
    Модель подписок на пользователей.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_subscriptions_on_user')
    subscriber = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_subscriptions_on_subscriber')

    @classmethod
    def create_(cls, user_id: int, subscriber_id: int):
        user_ = User.objects.filter(id=user_id)
        if not user_.exists():
            return {'message': 'User not found', 'status': 'error'}
        user_ = user_.first()

        subscriber = User.objects.filter(id=subscriber_id)
        if not user_.exists():
            return {'message': 'Subscriber not found', 'status': 'error'}
        subscriber = subscriber.first()

        created = cls.objects.filter(user=user_, subscriber=subscriber)
        if created.exists():
            return {'message': 'UserSubscriptions already exists', 'status': 'error'}

        cls.objects.create_(user=user_, subscriber=subscriber)

        return {'status': 'success'}

    @classmethod
    def delete_(cls, user_id: int, subscriber_id: int):
        user_ = User.objects.filter(id=user_id)
        if not user_.exists():
            return {'message': 'User not found', 'status': 'error'}
        user_ = user_.first()

        subscriber = User.objects.filter(id=subscriber_id)
        if not user_.exists():
            return {'message': 'Subscriber not found', 'status': 'error'}
        subscriber = subscriber.first()

        created = cls.objects.filter(user=user_, subscriber=subscriber)
        if not created.exists():
            return {'message': 'UserSubscriptions not found', 'status': 'error'}
        created = created.first()
        created.delete()

        return {'status': 'success'}


class RequestUserSubscriptions(models.Model):
    """
    Модель запросов на подписку пользователей в друзья.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='request_user_subscriptions_on_user')
    subscriber = models.ForeignKey(User, on_delete=models.CASCADE,
                                   related_name='request_user_subscriptions_on_subscriber')

    @classmethod
    def create_(cls, user_id: int, subscriber_id: int):
        user_ = User.objects.filter(id=user_id)
        if not user_.exists():
            return {'message': 'User not found', 'status': 'error'}
        user_ = user_.first()

        subscriber = User.objects.filter(id=subscriber_id)
        if not subscriber.exists():
            return {'message': 'Subscriber not found', 'status': 'error'}
        subscriber = subscriber.first()

        created = cls.objects.filter(user=user_, subscriber=subscriber)
        if created.exists():
            return {'message': 'RequestUserSubscriptions already exists', 'status': 'error'}

        cls.objects.create_(user=user_, subscriber=subscriber)

        return {'status': 'success'}

    @classmethod
    def delete_(cls, user_id: int, subscriber_id: int):
        user_ = User.objects.filter(id=user_id)
        if not user_.exists():
            return {'message': 'User not found', 'status': 'error'}
        user_ = user_.first()

        subscriber = User.objects.filter(id=subscriber_id)
        if not subscriber.exists():
            return {'message': 'Subscriber not found', 'status': 'error'}
        subscriber = subscriber.first()

        created = cls.objects.filter(user=user_, subscriber=subscriber)
        if not created.exists():
            return {'message': 'RequestUserSubscriptions not found', 'status': 'error'}
        created = created.first()
        created.delete()

        return {'status': 'success'}


class UserRating(models.Model):
    """
    Модель рейтинг пользователя.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_rating_on_user')
    appraiser = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_rating_on_appraiser')
    estimation = models.IntegerField()  # 1 ... 10

    @classmethod
    def create_(cls,
                user_id: int,
                appraiser_id: int,
                estimation: int
                ):
        """
        Добавляет рейтинг пользователя.
         - Проверяет на существование пользователя.
         - Проверяет на существование рейтинга.
        """
        user_ = User.objects.filter(id=user_id)
        if not user_.exists():
            return {'message': 'User not found', 'status': 'error'}
        user_ = user_.first()

        appraiser = User.objects.filter(id=appraiser_id)
        if not appraiser.exists():
            return {'message': 'Appraiser not found', 'status': 'error'}
        appraiser = appraiser.first()

        created = cls.objects.filter(user=user_, appraiser=appraiser)
        if created.exists():
            return {'message': 'Rating already created', 'status': 'error'}

        cls.objects.create(
            user=user_,
            appraiser=appraiser,
            estimation=estimation,
        )

        return {'status': 'success'}

    @classmethod
    def delete_(cls,
                user_id: int,
                appraiser_id: int
                ):
        """
        Удаляет рейтинг пользователя.
         - Проверяет на существование пользователя.
         - Проверяет на существование рейтинга.
        """
        user_ = User.objects.filter(id=user_id)
        if not user_.exists():
            return {'message': 'User not found', 'status': 'error'}
        user_ = user_.first()

        appraiser = User.objects.filter(id=appraiser_id)
        if not appraiser.exists():
            return {'message': 'Appraiser not found', 'status': 'error'}
        appraiser = appraiser.first()

        created = cls.objects.filter(user=user_, appraiser=appraiser)
        if not created.exists():
            return {'message': 'Rating not found', 'status': 'error'}
        created = created.first()
        created.delete()

        return {'status': 'success'}


class UserBlacklist(models.Model):
    """
    Модель заблокированных пользователей.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_blacklist')
    banned_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_blacklist')

    @classmethod
    def create_(cls, user_id: int, banned_user_id: int):
        user_ = User.objects.filter(id=user_id)
        if not user_.exists():
            return {'message': 'User not found', 'status': 'error'}
        user_ = user_.first()

        banned_user = User.objects.filter(id=banned_user_id)
        if not banned_user.exists():
            return {'message': 'Subscriber not found', 'status': 'error'}
        banned_user = banned_user.first()

        created = cls.objects.filter(user=user_, banned_user=banned_user)
        if created.exists():
            return {'message': 'UserBlacklist already exists', 'status': 'error'}

        cls.objects.create_(user=user_, banned_user=banned_user)

        return {'status': 'success'}

    @classmethod
    def delete_(cls, user_id: int, banned_user_id: int):
        user_ = User.objects.filter(id=user_id)
        if not user_.exists():
            return {'message': 'User not found', 'status': 'error'}
        user_ = user_.first()

        banned_user = User.objects.filter(id=banned_user_id)
        if not banned_user.exists():
            return {'message': 'Subscriber not found', 'status': 'error'}
        banned_user = banned_user.first()

        created = cls.objects.filter(user=user_, banned_user=banned_user)
        if not created.exists():
            return {'message': 'UserBlacklist not found', 'status': 'error'}
        created = created.first()
        created.delete()

        return {'status': 'success'}


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

    @classmethod
    def new_community(cls, user_id: int, title: str, description: str):
        """
        Создает новое сообщество в бд.
        :param user_id: ID пользователя, создателя сообщества.
        :param title: Название сообщества.
        :param description: Описание сообщества.
        """
        cls.objects.create_(title=title, description=description)


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

    @classmethod
    def create_(cls, community_id: int, user_id: int, score: int):
        """
        Создает новую рекомендацию.
         - Проверяет на существование сообщества.
         - Проверяет на существование пользователя.
        """
        community = Community.objects.filter(id=community_id)
        if not community.exists():
            return {'message': 'Community not found', 'status': 'error'}
        community = community.first()

        user_ = User.objects.filter(id=user_id)
        if not user_.exists():
            return {'message': 'User not found', 'status': 'error'}
        user_ = user_.first()

        cls.objects.create_(community=community, user=user_, score=score)

        return {'status': 'success'}

    @classmethod
    def delete_(cls, community_id: int, user_id: int):
        """
        Удаляет рекомендацию.
         - Проверяет на существование сообщества.
         - Проверяет на существование пользователя.
         - Проверяет на существование рекомендации.
        """
        community = Community.objects.filter(id=community_id)
        if not community.exists():
            return {'message': 'Community not found', 'status': 'error'}
        community = community.first()

        user_ = User.objects.filter(id=user_id)
        if not user_.exists():
            return {'message': 'User not found', 'status': 'error'}
        user_ = user_.first()

        recommendation = cls.objects.filter(community=community, user=user_)
        if not recommendation.exists():
            return {'message': 'Recommendation not found', 'status': 'error'}
        recommendation = recommendation.first()
        recommendation.delete()

        return {'status': 'success'}


class CommunityAvatar(models.Model):
    """
    Модель аватарки сообщества.
    """
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='community_avatar')
    img = models.ImageField(null=False)

    @classmethod
    def create_(cls, community_id: int, img):
        """
        Добавляет или обновляет аватарку сообщества.
         - Проверяет на существование сообщества.
        """
        community = Community.objects.filter(id=community_id)
        if not community.exists():
            return {'message': 'Community not found', 'status': 'error'}
        community = community.first()

        avatar = Community.objects.filter(id=community_id)
        if not community.exists():
            return {'message': 'Community not found', 'status': 'error'}
        community = community.first()


class CommunityRole(models.Model):
    """
    Модель роли в сообществе и его разрешения.
    """
    title = models.CharField(max_length=100, unique=True)
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='community_role')
    administrator = models.BooleanField(default=False)
    content_moderator = models.BooleanField(default=False)
    invite_participants = models.BooleanField(default=False)
    edit_community_information = models.BooleanField(default=False)
    manage_participants = models.BooleanField(default=False)
    publish_articles = models.BooleanField(default=False)
    publish_news = models.BooleanField(default=False)


class CommunityParticipant(models.Model):
    """
    Модель участников сообщества.
    """
    community = models.ForeignKey(Community, on_delete=models.CASCADE,
                                  related_name='community_participant_by_community')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='community_participant_by_user')
    role = models.ForeignKey(CommunityRole, on_delete=models.CASCADE, null=True)

    @classmethod
    def create_(cls, community_id: int, user_id: int, role_id: int):
        """
        Добавляет участника в сообщество.
         - Проверяет на существование сообщества.
         - Проверяет на существование пользователя.
         - Проверяет на существование роли.
        """
        community = Community.objects.filter(id=community_id)
        if not community.exists():
            return {'message': 'Community not found', 'status': 'error'}
        community = community.first()

        user_ = User.objects.filter(id=user_id)
        if not user_.exists():
            return {'message': 'User not found', 'status': 'error'}
        user_ = user_.first()

        role = CommunityRole.objects.filter(id=role_id)
        if not role.exists():
            return {'message': 'User not found', 'status': 'error'}
        role = role.first()

        participant = cls.objects.filter(community=community, user=user_, role=role)
        if participant.exists():
            return {'message': 'Participant already exists', 'status': 'error'}

        cls.objects.create_(community=community, user=user_, role=role)

        return {'status': 'success'}


class RequestCommunityParticipant(models.Model):
    """
    Модель участников сообщества.
    """
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='request_in_community_by_community')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='request_in_community_by_user')

    @classmethod
    def list(cls, community_id: int):
        """
        Выводит список запросов на вход в сообщество.
         - Проверяет на существование сообщества.
        """
        community = Community.objects.filter(id=community_id)
        if not community.exists():
            return {'message': 'Community not found', 'status': 'error'}
        community = community.first()

        return cls.objects.filter(community=community)

    @classmethod
    def create_(cls, community_id: int, user_id: int):
        """
        Добавляет участника в сообщество.
         - Проверяет на существование сообщества.
         - Проверяет на существование пользователя.
         - Проверяет на существование роли.
        """
        community = Community.objects.filter(id=community_id)
        if not community.exists():
            return {'message': 'Community not found', 'status': 'error'}
        community = community.first()

        user_ = User.objects.filter(id=user_id)
        if not user_.exists():
            return {'message': 'User not found', 'status': 'error'}
        user_ = user_.first()

        participant = cls.objects.filter(community=community, user=user_)
        if participant.exists():
            return {'message': 'Participant already exists', 'status': 'error'}

        cls.objects.create_(community=community, user=user_)

        return {'status': 'success'}

    @classmethod
    def delete_(cls, community_id: int, user_id: int):
        """
        Добавляет участника в сообщество.
         - Проверяет на существование сообщества.
         - Проверяет на существование пользователя.
         - Проверяет на существование роли.
        """
        community = Community.objects.filter(id=community_id)
        if not community.exists():
            return {'message': 'Community not found', 'status': 'error'}
        community = community.first()

        user_ = User.objects.filter(id=user_id)
        if not user_.exists():
            return {'message': 'User not found', 'status': 'error'}
        user_ = user_.first()

        participant = cls.objects.filter(community=community, user=user_)
        if not participant.exists():
            return {'message': 'Participant not found', 'status': 'error'}

        cls.objects.get(community=community, user=user_).delete()

        return {'status': 'success'}


class CommunityTag(models.Model):
    """
    Модель тега сообщества.
    """
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='community_tag')
    tag = models.CharField(max_length=150)

    @classmethod
    def create_(cls, community_id: int, tag: str):
        """
        Создает новый тег.
         - Проверяет на существование сообщества.
         - Проверяет на существование тега.
        """
        community = Community.objects.filter(id=community_id)
        if not community.exists():
            return {'message': 'Community not found', 'status': 'error'}
        community = community.first()

        if cls.objects.filter(community=community, tag=tag).exists():
            return {'message': 'Tag already created', 'status': 'error'}

        cls.objects.create_(community=community, tag=tag)
        return {'status': 'success'}

    @classmethod
    def delete_(cls, community_id: int, tag: str):
        """
        Удаляет тег.
         - Проверяет на существование сообщества.
         - Проверяет на существование тега.
        """

        community = Community.objects.filter(id=community_id)
        if not community.exists():
            return {'message': 'Community not found', 'status': 'error'}
        community = community.first()

        if not cls.objects.filter(community=community, tag=tag).exists():
            return {'message': 'Tag not found', 'status': 'error'}

        cls.objects.get(community=community, tag=tag).delete()
        return {'status': 'success'}


class CommunityChat(models.Model):
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='community_room')
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)


class CommunityChatMessage(models.Model):
    room = models.ForeignKey(CommunityChat, related_name="community_chat_message", on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name="community_chat_message", on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now=True)


class CommunityChatParticipant(models.Model):
    chat = models.ForeignKey(CommunityChat, related_name="community_chat_participant", on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name="community_chat_participant", on_delete=models.CASCADE)


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
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='article')
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='article')
    title = models.CharField(max_length=155, null=False)
    description = models.CharField(max_length=355, null=False)
    content = models.TextField(null=False)
    status = models.SmallIntegerField(null=False, default=1)  # global = 1 / local = 2
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField()

    @classmethod
    def new_article(cls, user_id: int, title: str, description: str, content: str, status: int):
        """
        Создает статью в бд.
        :param user_id: Объект пользователя, который создает статью.
        :param title: Название статьи.
        :param description: Описание статьи.
        :param content: Текст статьи.
        :param status: global = 1 / local = 2.
        """
        user = User.objects.get(id=user_id)
        cls.objects.create_(user=user, title=title, description=description, content=content, status=status)

    def get_title_img(self):
        """
        :return: Возвращает титульную картинку статьи.
        """
        return TitleImageArticle.objects.get(user=self)

    def get_comments(self):
        """
        :return: Возвращает все комментарии к статье.
        """
        return ArticleComment.objects.filter(user=self)

    def get_assessments(self):
        """
        :return: Возвращает все оценки в виде [положительные,отрицательные].
        """
        return ArticleAssessment.objects.filter(user=self, status=True), \
            ArticleAssessment.objects.filter(user=self, status=False)


class AllArticleTags(models.Model):
    """
    Модель всевозможных скиллов пользователей.
    """
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='article_tags')
    tag = models.CharField(max_length=150, unique=True)

    @classmethod
    def new_tag_article(cls, user_id: int, tag: str):
        """
        Создает новый тег скилл.
        :param user_id: ID пользователя.
        :param tag: Название тег скилла.
        """
        user = User.objects.get(id=user_id)
        cls.objects.create_(author=user, tag=tag)


class ArticleTags(models.Model):
    """
    Модель скиллов пользователя.
    """
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='article_tag')
    tag = models.ForeignKey(AllArticleTags, on_delete=models.CASCADE, related_name='article_tag')


class ArticleComment(models.Model):
    """
    Модель комментария статьи.
    """
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='article_comment')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='article_comment')
    content = models.CharField(max_length=300)


class ArticleAssessment(models.Model):
    """
    Модель оценок для статьи.
    """
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='article_assessment')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='article_assessment')
    status = models.BooleanField(null=False)


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

    @classmethod
    def new_news(cls, user_id: int, title: str, description: str, status: int):
        """
        Создает статью в бд.
        :param user_id: Объект пользователя, который создает статью.
        :param title: Название статьи.
        :param description: Описание статьи.
        :param status: global = 1 / local = 2.
        """
        user = User.objects.get(id=user_id)
        cls.objects.create_(user=user, title=title, description=description, status=status)

    def get_assessments(self):
        """
        :return: Возвращает все оценки в виде [положительные,отрицательные].
        """
        return NewsAssessment.objects.filter(user=self, status=True), \
            NewsAssessment.objects.filter(user=self, status=False)


class AllNewsTags(models.Model):
    """
    Модель всевозможных скиллов пользователей.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='news_tags')
    tag = models.CharField(max_length=150, unique=True)

    @classmethod
    def new_tag_article(cls, user_id: int, tag: str):
        """
        Создает новый тег скилл.
        :param user_id: ID пользователя автора.
        :param tag: Название тег скилла.
        """
        user = User.objects.get(id=user_id)
        cls.objects.create_(user=user, tag=tag)


class NewsTags(models.Model):
    """
    Модель скиллов пользователя.
    """
    news = models.ForeignKey(News, on_delete=models.CASCADE, related_name='news_tag')
    tag = models.ForeignKey(AllArticleTags, on_delete=models.CASCADE, related_name='news_tag')


class NewsAssessment(models.Model):
    """
    Модель оценок для статьи.
    """
    news = models.ForeignKey(News, on_delete=models.CASCADE, related_name='news_assessment')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='news_assessment')
    status = models.BooleanField(null=False)


# todo END NEWS   ---------------------------------------------------------------------


class UserBookmarks(models.Model):
    """
    Модель закладок пользователя.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_bookmark')
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='user_bookmark')


class UserBannedChat(models.Model):
    """
    Модель заблокированных пользователями чатов.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_banned_chat')
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='user_banned_chat')
