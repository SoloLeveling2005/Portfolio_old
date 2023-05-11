import datetime
import random

from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser, PermissionsMixin, Group, Permission
from django.db import models
from django.db.models import Q
from django.template.defaultfilters import slugify


# todo START USERS
# При регистрации создается модель User, отправляется сигнал на создание UserProfile и UserSettings
#
#
#

class User(AbstractUser):
    biography_small = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.username

    def info(self):
        return {'user': self, 'profile': self.profile(), 'avatar': self.avatar(), }

    def avatar(self):
        """
        :return: Возвращает аватарку пользователя.
        """
        return UserAvatar.objects.get(user=self)

    def profile(self):
        return UserProfile.objects.get(user=self)

    #     def rating(self):
    #         pass
    #
    #     def comments(self):
    #         pass
    #
    def articles(self):
        """
        :return: Возвращает статьи пользователя.
        """
        return Article.objects.filter(author=self)

    #     def news(self):
    #         pass
    #
    #     def article_bookmakers(self):
    #         pass
    #
    #     def news_bookmakers(self):
    #         pass
    #
    def my_communities(self):
        communities_ = CommunityParticipant.objects.filter(Q(user=self))
        my_communities = Community.objects.filter(Q(user=self))
        communities_ = communities_.union(my_communities)
        return communities_

    #
    #     def chats(self):
    #         pass
    #
    #     def banned_chat(self):
    #         pass
    #
    #     def banned_user(self):
    #         pass
    #
    #     def subscribers_users(self):
    #         pass
    #
    #


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
        cls.objects.create(user=user, img=img)

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
    Модель аватарка пользователя.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_profile')
    location = models.CharField(max_length=100)
    gender = models.CharField(max_length=5)  # man, woman
    birthday = models.DateTimeField()

    def create_user_info(self, user_id: int, gender: str, birthday: datetime, location: str, vk_profile: str,
                         telegram_profile_link: str, telegram_profile_id: str, other_info: str):
        """
        Создает доп. информацию пользователя.
        :param user_id: ID пользователя.
        :param gender: Пол.
        :param birthday: Дата рождения.
        :param location: Местоположение.
        :param vk_profile: Ссылка на вк профиль.
        :param telegram_profile_link: Ссылка на telegram профиль.
        :param telegram_profile_id: ID telegram профиля.
        :param other_info: Остальная информация.
        """
        user = User.objects.get(id=user_id)
        self.objects.create(user=user, gender=gender, birthday=birthday, location=location, vk_profile=vk_profile,
                            telegram_profile_link=telegram_profile_link, telegram_profile_id=telegram_profile_id,
                            other_info=other_info)


class UserAdditionalInformation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_additional_information')
    vk_profile = models.CharField(max_length=100)
    telegram_profile_link = models.CharField(max_length=100)
    telegram_profile_id = models.CharField(max_length=100)
    other_info = models.TextField()

    def create_user_info(self, user_id: int, vk_profile: str,
                         telegram_profile_link: str, telegram_profile_id: str, other_info: str):
        """
        Создает доп. информацию пользователя.
        :param user_id: ID пользователя.
        :param vk_profile: Ссылка на вк профиль.
        :param telegram_profile_link: Ссылка на telegram профиль.
        :param telegram_profile_id: ID telegram профиля.
        :param other_info: Остальная информация.
        """
        user = User.objects.get(id=user_id)
        self.objects.create(user=user, vk_profile=vk_profile, telegram_profile_link=telegram_profile_link,
                            telegram_profile_id=telegram_profile_id, other_info=other_info)


class UserSubscriptions(models.Model):
    """
    Модель подписок на пользователей.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_subscriptions_on_user')
    subscriber = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_subscriptions_on_subscriber')
    status = models.BooleanField(default=False)  # ban - false / friend - true

    def new_user_subscriptions(self, user_id: int, subscriber_id: int, status: bool):
        """
        Создает новую связь двух пользователей.
        :param user_id: ID пользователя.
        :param subscriber_id: ID собеседника.
        :param status: Статус ban/friend false/true.
        """
        user = User.objects.get(id=user_id)
        subscriber = User.objects.get(id=subscriber_id)
        self.objects.create(user=user, subscriber=subscriber, status=status)


class UserRating(models.Model):
    """
    Модель рейтинг пользователя.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_rating_on_user')
    appraiser = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_rating_on_appraiser')
    estimation = models.IntegerField()

    @classmethod
    def new_rating(cls, user_id: int, appraiser_id: int, estimation: int):
        """
        Создает новый рейтинг.
        :param user_id: ID пользователя, которому ставят рейтинг.
        :param appraiser_id: ID пользователя, который ставит рейтинг.
        :param estimation:
        :return:
        """
        user = User.objects.get(id=user_id)
        appraiser = User.objects.get(id=appraiser_id)
        cls.objects.create(user=user, appraiser=appraiser, estimation=estimation)


class Chat(models.Model):
    """
    Модель чата между двумя пользователями.
    """
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    @classmethod
    def create_community_chat(cls, title: str, first_user_id: int, second_user_id: int):
        """
        Метод создает чат между двумя пользователями.
        :param title:
        :param first_user_id:
        :param second_user_id:
        :return:
        """
        first_user = User.objects.get(id=first_user_id)
        second_user = User.objects.get(id=second_user_id)
        chat = cls.objects.create(title=title)
        ChatParticipant.objects.create(chat=chat, user=first_user)
        ChatParticipant.objects.create(chat=chat, user=second_user)

    def get_messages(self):
        return ChatMessage.objects.filter(chat=self)

    def get_participants(self):
        return ChatParticipant.objects.filter(chat=self)


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
        cls.objects.create(title=title, description=description)

    def get_tags(self):
        pass

    def get_settings(self):
        pass

    def get_avatar(self):
        pass

    def get_participants(self):
        pass

    def get_banned_user(self):
        pass

    def get_chats(self):
        pass

    def get_articles(self):
        pass

    def get_news(self):
        pass

    def get_roles(self):
        return CommunityRole.objects.filter(community=self)


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
    def create(cls, community_id: int, user_id: int, score: int):
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

        cls.objects.create(community=community, user=user_, score=score)

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
    def create(cls, community_id: int, user_id: int, role_id: int):
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

        cls.objects.create(community=community, user=user_, role=role)

        return {'status': 'success'}


class RequestCommunityParticipant(models.Model):
    """
    Модель участников сообщества.
    """
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='request_in_community_by_community')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='request_in_community_by_user')

    @classmethod
    def create(cls, community_id: int, user_id: int):
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

        cls.objects.create(community=community, user=user_)

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
    def create(cls, community_id: int, tag: str):
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

        cls.objects.create(community=community, tag=tag)
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
        cls.objects.create(user=user, title=title, description=description, content=content, status=status)

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
        cls.objects.create(author=user, tag=tag)


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
        cls.objects.create(user=user, title=title, description=description, status=status)

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
        cls.objects.create(user=user, tag=tag)


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


class BannedUser(models.Model):
    """
    Модель заблокированных пользователей.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='banned_user')
    reason = models.CharField(max_length=100)
