import datetime

from django.contrib.auth.hashers import make_password
from django.db import models


# Create your models here.


class UserSettings(models.Model):
    """
    Модель настроек пользователя.
    """
    show_additional_information = models.BooleanField(default=True)
    show_activity_on_the_site = models.BooleanField(default=True)
    telegram_mailing_list = models.BooleanField(default=False)
    notification_new_entries = models.BooleanField(default=False)
    notification_comments_under_posts = models.BooleanField(default=True)
    notification_mentions = models.BooleanField(default=True)
    notification_new_friend = models.BooleanField(default=True)


class User(models.Model):
    """
    Модель пользователя.
    """
    username = models.CharField(max_length=100, null=False)
    login = models.CharField(max_length=100, null=False)
    password = models.CharField(max_length=255, null=False)
    settings = models.ForeignKey(UserSettings, on_delete=models.CASCADE, related_name='user')
    biography_small = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    @classmethod
    def new_user(cls, username: str, login: str, password: str, biography: str):
        """
        Создает нового пользователя в базе данных и хеширует его пароль.
        :param login: Логин
        :param username: Имя Фамилия
        :param password: Пароль
        :param biography: Биография пользователя
        """
        settings = UserSettings.objects.create()
        cls.objects.create(
            username=username,
            password=make_password(password),
            settings=settings,
            login=login,
            biography=biography
        )

    def avatar(self):
        """
        :return: Возвращает аватарку пользователя.
        """
        return self.user_avatar.get()

    def info(self):
        pass

    def rating(self):
        pass

    def comments(self):
        pass

    def articles(self):
        """
        :return: Возвращает статьи пользователя.
        """
        return self.user_article.all()

    def news(self):
        pass

    def article_bookmakers(self):
        pass

    def news_bookmakers(self):
        pass

    def communities(self):
        pass

    def chats(self):
        pass

    def banned_chat(self):
        pass

    def banned_user(self):
        pass

    def subscribers_users(self):
        pass


class UserAvatar(models.Model):
    """
    Модель аватарка пользователя.
    """
    img = models.ImageField(null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_avatar')

    @classmethod
    def new_avatar(cls, user_id: int, img):
        """
        Создает новую аватарку для пользователя в базе данных.
        :param user_id: ID пользователя
        :param img: Аватарка
        """
        user = User.objects.get(id=user_id)
        cls.objects.create(user=user, img=img)


class TagSkill(models.Model):
    """
    Модель всевозможных скиллов пользователей.
    """
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tag_skill')
    tag = models.CharField(max_length=150)

    @classmethod
    def new_tag_skill(cls, user_id: int, tag: str):
        """
        Создает новый тег скилл.
        :param user_id: ID пользователя.
        :param tag: Название тега.
        """
        user = User.objects.get(id=user_id)
        cls.objects.create(author=user, tag=tag)


class TagUserSkill(models.Model):
    """
    Модель скиллов пользователя.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tag_user_skill')
    tag = models.ForeignKey(TagSkill, on_delete=models.CASCADE, related_name='tag_user_skill')

    @classmethod
    def new_tag_skill(cls, user_id: int, tag_id: int):
        """
        Создает новый тег скилл.
        :param user_id: ID пользователя.
        :param tag_id: ID тег скилла.
        """
        user = User.objects.get(id=user_id)
        tag = TagSkill.objects.get(id=tag_id)
        cls.objects.create(author=user, tag=tag)


class UserInfo(models.Model):
    """
    Модель аватарка пользователя.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_info')
    gender = models.CharField(max_length=5)  # man, woman
    birthday = models.DateTimeField()
    location = models.CharField(max_length=100)
    vk_profile = models.CharField(max_length=100)
    telegram_profile = models.CharField(max_length=100)
    youtube_chanel = models.CharField(max_length=100)
    other_info = models.TextField()

    @classmethod
    def new_avatar(cls, user_id: int, gender: str, birthday: datetime, location: str, vk_profile: str,
                   telegram_profile: str, youtube_chanel: str, other_info: str):
        """
        Создает доп. информацию пользователя.
        :param user_id: ID пользователя.
        :param gender: Пол.
        :param birthday: Дата рождения.
        :param location: Местоположение.
        :param vk_profile: Ссылка на вк профиль.
        :param telegram_profile: Ссылка на telegram профиль.
        :param youtube_chanel: Ссылка на youtube профиль.
        :param other_info: Остальная информация.
        """
        user = User.objects.get(id=user_id)
        cls.objects.create(user=user, gender=gender, birthday=birthday, location=location, vk_profile=vk_profile,
                           telegram_profile=telegram_profile, youtube_chanel=youtube_chanel, other_info=other_info)

    def user_tags(self):
        """
        :return: Возвращает теги пользователя.
        """
        return self.tag_user_skill.all()


class UserSubscriptions(models.Model):
    """
    Модель подписок на пользователей.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_subscriptions')
    subscriber = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_subscriptions')
    status = models.BooleanField(default=False)

    @classmethod
    def new_user_subscriptions(cls, user_id: int, subscriber_id: int, status: bool):
        """
        Создает новую связь двух пользователей.
        :param user_id: ID пользователя.
        :param subscriber_id: ID собеседника.
        :param status: Статус ban/friend.
        """
        user = User.objects.get(id=user_id)
        subscriber = User.objects.get(id=subscriber_id)
        cls.objects.create(user=user, subscriber=subscriber, status=status)

    def chats(self):
        pass


class UserRating(models.Model):
    """
    Модель рейтинг пользователя.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_rating')
    appraiser = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_rating')
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


# todo --------------------------------------------------------------------------------------------------------
class Article(models.Model):
    """
    Модель статьи.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_article')
    title = models.CharField(max_length=255, null=False)
    content = models.TextField(null=False)
    status = models.SmallIntegerField(null=False, default=1)  # global = 1 / local = 2
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    @classmethod
    def new_article(cls, user_id: int, title: str, content: str, status: int):
        """
        Создает статью в бд.
        :param user_id: Объект пользователя, который создает статью.
        :param title: Название статьи.
        :param content: Текст статьи.
        :param status: global = 1 / local = 2.
        """
        user = User.objects.get(id=user_id)
        cls.objects.create(user=user, title=title, content=content, status=status)

    def get_title_img(self):
        """
        :return: Возвращает титульную картинку статьи.
        """
        return self.article_title_img.get()

    def get_comments(self):
        """
        :return: Возвращает все комментарии к статье.
        """
        return self.article_comment.get()

    def get_assessment(self):
        """
        :return: Возвращает все оценки в виде [положительные,отрицательные].
        """
        return self.article_assessment.filter(status=True), self.article_assessment.filter(status=False)


class TitleImageArticle(models.Model):
    """
    Модель титульная картинка статьи.
    """
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='article_title_img')
    img = models.ImageField(null=False)

    @classmethod
    def title_img(cls, article_id: int, img):
        """
        Создает или обновляет титульную картинку статьи в базе данных.
        :param article_id: ID статьи.
        :param img: Аватарка.
        Если
        """
        article = Article.objects.get(id=article_id)

        # Если аватарка была добавлена, то обновляем ее, иначе создаем
        if cls.objects.filter(article=article).exists():
            img_article = cls.objects.get(article=article)
            img_article.img = img
            img_article.save()
        else:
            cls.objects.create(article=article, img=img)


class ArticleComment(models.Model):
    """
    Модель комментарий статьи.
    """
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='article_comment')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='article_create_by_user')
    content = models.CharField(max_length=255)

    @classmethod
    def new_comment(cls, article_id: int, user_id: int, content: str):
        """
        Создает новый комментарий в базе данных.
        :param article_id: ID статьи.
        :param user_id: ID автора.
        :param content: Текст комментария.
        """
        article = Article.objects.get(id=article_id)
        user = User.objects.get(id=user_id)
        cls.objects.create(article=article, user=user, content=content)


class ArticleAssessment(models.Model):
    """
    Модель оценка статьи.
    """
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='article_assessment')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='article_assessment')
    status = models.BooleanField()  # true - like, false - dislike

    @classmethod
    def new_assessment(cls, article_id: int, user_id: int, status: bool):
        """
        Создает новый комментарий в базе данных.
        :param article_id: ID статьи.
        :param user_id: ID автора.
        :param status: Оценка статьи (true - like, false - dislike).
        """
        article = Article.objects.get(id=article_id)
        user = User.objects.get(id=user_id)

        # Если оценка уже поставлена, удаляем старую оценку
        if cls.objects.filter(article=article, user=user).exists():
            cls.objects.get(article=article, user=user).delete()

        cls.objects.create(article=article, user=user, status=status)


class Community(models.Model):
    """
    Модель сообщества.
    """
    title = models.CharField(max_length=100, null=False)
    description = models.CharField(max_length=255, null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    @classmethod
    def new_community(cls, title: str, description: str):
        """
        Создает новое сообщество в бд.
        :param title: Название сообщества.
        :param description: Описание сообщества.
        """
        cls.objects.create(title=title, description=description)


class CommunityAvatar(models.Model):
    """
    Модель аватарки сообщества.
    """
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='community_avatar')
    img = models.ImageField(null=False)

    @classmethod
    def new_avatar(cls, community_id: int, img):
        """
        Создает или обновляет аватарку сообщества в бд.
        :param community_id: ID сообщества.
        :param img: Картинка сообщества.
        """
        community = Community.objects.get(id=community_id)

        # Если аватарка была добавлена, то обновляем ее, иначе создаем
        if cls.objects.filter(community=community).exists():
            img_community = cls.objects.get(community=community)
            img_community.img = img
            img_community.save()
        else:
            cls.objects.create(community=community, img=img)


class CommunityRole(models.Model):
    """
    Модель роли в сообществе и его разрешения.
    """
    title = models.CharField(max_length=100)
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='community_role')
    create_articles = models.BooleanField(default=False)
    manage_participants = models.BooleanField(default=False)
    community_editing = models.BooleanField(default=False)
    article_editing = models.BooleanField(default=False)

    @classmethod
    def new_role(cls, title: str, community_id: int, create_articles: bool, manage_participants: bool,
                 community_editing: bool, article_editing: bool):
        """
        Создает новую роль для сообщества в бд.
        :param title: Название роли.
        :param community_id: ID сообщества.
        :param create_articles: Разрешение на создание статей - true/false
        :param manage_participants: Разрешение на управление участниками - true/false
        :param community_editing: Разрешение на редактирование сообщества - true/false
        :param article_editing: Разрешение на редактирование статей - true/false
        """
        community = Community.objects.get(id=community_id)
        cls.objects.create(title=title,
                           community=community,
                           create_articles=create_articles,
                           manage_participants=manage_participants,
                           community_editing=community_editing,
                           article_editing=article_editing)


class CommunityParticipant(models.Model):
    """
    Модель участников сообщества.
    """
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='community_participant')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='community_participant')
    role = models.ForeignKey(CommunityRole, on_delete=models.CASCADE)

    @classmethod
    def new_participant(cls, community_id: int, user_id: int, role_id: int):
        """
        Добавляет нового пользователя в сообщество.
        :param community_id: ID сообщества.
        :param user_id: ID пользователя.
        :param role_id: ID роли.
        """
        community = Community.objects.get(id=community_id)
        user = User.objects.get(id=user_id)
        role = CommunityRole.objects.get(id=role_id)

        cls.objects.create(community=community, user=user, role=role)


class CommunityChat(models.Model):
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='community_room')
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)


class ChatMessage(models.Model):
    room = models.ForeignKey(CommunityChat, related_name="messages", on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name="messages", on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now=True)
