from datetime import datetime
from functools import wraps

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.files.storage import default_storage
from django.db.models import Q
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
# from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.settings import api_settings
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken, Token

from .models import User, Community, CommunityRole, CommunityParticipant, CommunityTag, \
    CommunityRecommendation, RequestCommunityParticipant, UserSubscriptions, UserProfile, UserAdditionalInformation, \
    RequestUserSubscriptions, UserBlacklist, UserRating, Article, ArticleTags, ArticleComment, ArticleAssessment, \
    ArticleBookmarks, CommunityAvatar, UserAvatar
from .serializers import UserRegistrationSerializer, UserAuthenticationSerializer, SerializerCreateCommunityRole, \
    SerializerUserAdditionalInformation, SerializerUserProfile, UserSerializer, ProfileSerializer, \
    AdditionalInformationSerializer, ArticleSerializer, CommunitySerializer, ArticleCommentSerializer, \
    UserSerializerModel, RequestUserSubscriptionsSerializer, UserSubscriptionsSerializer


# Helpers
# Exists хелперы. Основная идея. Если данные есть, то возвращает их, иначе возвращает None.

def check_community_exists(community_id: int):
    """Проверяем на существование сообщества."""
    community = Community.objects.filter(id=community_id)
    if not community.exists():
        return None
    return community.first()


def check_user_exists(user_id: int):
    """Проверяем на существование пользователя."""
    user = User.objects.filter(id=user_id)
    if not user.exists():
        return None
    return user.first()


def check_user_rating_exists(user):
    """"""
    profile = UserProfile.objects.filter(user=user)
    if not profile.exists():
        return None
    return profile.first()


def check_profile_exists(user):
    """Проверяем на существование профиля пользователя."""
    profile = UserProfile.objects.filter(user=user)
    if not profile.exists():
        return None
    return profile.first()


def check_user_in_blacklist_exists(user, banned_user):
    """Проверяем, пользователь уже в бане?"""
    banned_user = UserBlacklist.objects.filter(user=user, banned_user=banned_user)
    if not banned_user.exists():
        return None
    return banned_user.first()


def check_request_user_subscription_exists(user, subscriber_id):
    """Возвращает None в случае ошибки или True в случае успеха"""
    print("Начинем проверку")

    # Проверяет на существование пользователя subscriber.
    subscriber = check_user_exists(user_id=subscriber_id)
    if subscriber is None:
        return None

    print("Пользователь существует")

    # Проверяет на существование друга. Если он уже в друзьях, то вызываем ошибку.
    subscription = UserSubscriptions.objects.filter(user=user, subscriber=subscriber)
    if subscription.exists():
        return None

    print("Пользователь не в друзьях")

    # Проверяет на существование запроса в друзья. Если он уже подал запрос в друзья, то вызываем ошибку.
    subscription_request = RequestUserSubscriptions.objects.filter(user=user, subscriber=subscriber)
    if subscription_request.exists():
        return None

    print("Пользователь не в запросе в друзья")

    return True


def check_not_request_user_subscription_exists(user, subscriber_id):
    """Возвращает None в случае ошибки или объект subscription_request в случае успеха"""

    # Проверяет на существование пользователя subscriber.
    subscriber = check_user_exists(user_id=subscriber_id)
    if subscriber is None:
        return None

    # Проверяет на существование друга. Если он уже в друзьях, то вызываем ошибку.
    subscription = UserSubscriptions.objects.filter(user=user, subscriber=subscriber)
    if subscription.exists():
        return None

    # Проверяет на существование запроса в друзья. Если он уже подал запрос в друзья, то успех.
    subscription_request = RequestUserSubscriptions.objects.filter(user=user, subscriber=subscriber)
    if subscription_request.exists():
        return subscription_request.first()

    return None


def check_on_new_friend_subscriptions_exists(user, subscriber):
    """Проверяет друзья пользователи или нет + есть ли запрос на добавление в друзья. Возвращает None или object"""
    print("начинаем проверку на подписку и друга")
    # Проверяет на существование друга.
    subscription = UserSubscriptions.objects.filter(user=user, subscriber=subscriber)
    if subscription.exists():
        return None
    print("Подписки на друзья проверено, нет подписки")
    # Проверяет на существование запроса в друзья. Если он уже подал запрос в друзья, то успех.
    subscription_request = RequestUserSubscriptions.objects.filter(user=user, subscriber=subscriber)
    if subscription_request.exists():
        return subscription_request.first()
    print("Запрос на подписки на друзья проверено, нет подписки")
    return None


def check_friend_subscription(user1, user2):
    """Проверяет пользователи друзья или нет. Возвращает None или object"""

    # Проверяет на существование друга.
    subscription = UserSubscriptions.objects.filter(user=user1, subscriber=user2)
    if subscription.exists():
        return subscription.first()

    return None


def check_user_additional_information_exists(user):
    """Проверяем на существование доп.информации пользователя."""
    additional_information = UserAdditionalInformation.objects.filter(user=user)
    if not additional_information.exists():
        return None
    return additional_information.first()


def check_participant_exists(community, participant):
    """Проверяем на существование участника в сообществе."""
    participant = CommunityParticipant.objects.filter(community=community, user=participant)
    if not participant.exists():
        return None
    return participant.first()


def check_participant_request_exists(community, participant):
    """Проверяем на существование запроса на вступление."""
    participant = RequestCommunityParticipant.objects.filter(community=community, user=participant)
    if not participant.exists():
        return None
    return participant.first()


def check_community_role_exists(community, community_role_title):
    """Проверяем на существование роли в сообществе."""
    community_role = CommunityRole.objects.filter(community=community, title=community_role_title)
    if not community_role.exists():
        return None
    return community_role.first()


def check_community_tag_exists(community, community_tag_title):
    """Проверяем на существование тега в сообществе."""
    community_tag = CommunityTag.objects.filter(community=community, tag=community_tag_title)
    if not community_tag.exists():
        return None
    return community_tag.first()


def check_user_recommendation_community_exists(community, participant):
    """Проверяем на существование рекомендации сообщества пользователем."""
    community_recommendation = CommunityRecommendation.objects.filter(community=community, user=participant)
    if not community_recommendation.exists():
        return None
    return None


def check_community_exists_decorator(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        community_id = request.POST.get('community_id')
        community = check_community_exists(community_id)
        if isinstance(community, Response):
            return Response(data={}, status=status.HTTP_204_NO_CONTENT)
        return func(request, *args, **kwargs)

    return wrapper


# views


class UserView:
    authentication_classes = [JWTAuthentication]

    def __init__(self, request):
        """
        Контроллер управления пользователем. \n
        Требуемые методы: \n
         - Авторизация, регистрация, выход из системы, создание токена уже реализовано в классах ниже. \n

         - Создание профиля пользователя (method post_create_user_profile). \n
         - Редактирование профиля пользователя (method update_user_profile). \n

         - Создание дополнительной информации пользователя (method post_create_user_additional_information). \n
         - Редактирование дополнительной информации пользователя (method update_user_additional_information). \n

         - Создание аватарки пользователя (method post_create_avatar). \n
         - Редактирование аватарки пользователя (method update_avatar). \n

         - Добавить запрос пользователя в друзья (method post_add_request_in_friend). \n
         - Удалить запрос пользователя в друзья (method delete_request_in_friend). \n

         - Добавить пользователя в друзья (method post_add_new_friend_subscriptions). \n
         - Удалить пользователя из друзей (method delete_friend_subscriptions). \n

         - Добавить пользователя в черный список (method post_add_user_in_blacklist). \n
         - Удалить пользователя из черного списка (method delete_user_from_blacklist). \n

         - Добавить отзыв пользователя о другом пользователе (method post_add_rating_user). \n
         - Удалить отзыв пользователя о другом пользователе (method delete_rating_user). \n

         - Вывод информации о пользователе, по user_id (method get_user). \n
         - Вывод информации о пользователе, который отправляет запрос (method get_me). \n
         - Вывод списка "Мои друзья" (method get_my_friends). \n
         - Вывод списка "Заявки в друзья" (method get_request_to_friend). \n
         - Вывод списка "Поиск друзей" (method get_find_friends). \n

        """
        self.requesting_user = request.user


# todo Получить пользователя по id.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request, user_id: int):
    receiving_user = request.user
    is_own_data = True

    # Проверяем на существование пользователя.
    requesting_user = check_user_exists(user_id=user_id)
    if not requesting_user:
        return Response(status=status.HTTP_204_NO_CONTENT)
    print(requesting_user.id)

    if receiving_user != requesting_user:
        is_own_data = False

    profile = ProfileSerializer(UserProfile.objects.get(user=requesting_user)).data
    additional_information = AdditionalInformationSerializer(
        UserAdditionalInformation.objects.get(user=requesting_user)).data
    comments = ArticleCommentSerializer(ArticleComment.objects.filter(user=requesting_user)).data \
        if ArticleComment.objects.filter(user=requesting_user).exists() else []
    articles = ArticleSerializer(Article.objects.filter(author=requesting_user)).data \
        if Article.objects.filter(author=requesting_user).exists() else []

    # Получаем сообщества пользователя
    user_communities = CommunitySerializer(Community.objects.filter(user=requesting_user), many=True).data \
        if Community.objects.filter(user=requesting_user).exists() else []

    # Получаем сообщества, связанные с пользователем через CommunityParticipant
    participant_communities = CommunitySerializer(
        Community.objects.filter(community_participant_by_community__user=requesting_user), many=True).data \
        if Community.objects.filter(community_participant_by_community__user=requesting_user).exists() else []

    # Объединяем оба QuerySet community
    communities = user_communities + participant_communities

    # Получаем аватарку
    avatar = UserAvatar.objects.get(user=requesting_user)
    image_url = None
    if avatar.img:
        image_url = avatar.img.url

    # Сереализуем пользователя
    requesting_user = UserSerializer(requesting_user).data

    return Response(
        data={'is_own_data': is_own_data, 'user': requesting_user, 'userAvatarUrl': image_url, 'profile': profile,
              'additional_information': additional_information, 'comments': comments,
              'articles': articles, 'communities': communities}, status=status.HTTP_200_OK)


# todo Получить информацию о пользователе по отношению к нам по id.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_about(request, user_id: int):
    user = request.user
    # Проверяем на существование пользователя.
    subscriber = check_user_exists(user_id=user_id)
    if not subscriber:
        return Response(status=status.HTTP_204_NO_CONTENT)

    friend = UserSubscriptions.objects.filter(Q(user=user) and Q(subscriber=subscriber))
    request_to_friend = RequestUserSubscriptions.objects.filter(Q(user=user) and Q(subscriber=subscriber))
    blacklist = UserBlacklist.objects.filter(Q(user=user) and Q(banned_user=subscriber))

    return Response(
        data={'friend': True if friend.exists() else False,
              'request_to_friend': True if request_to_friend.exists() else False,
              'blacklist': True if blacklist.exists() else False},
        status=status.HTTP_200_OK
    )


# todo Обновить аватарку пользователя.
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user_avatar(request):
    user = request.user

    avatar = request.FILES.get('avatar')
    file_path = default_storage.save(avatar.name, avatar)
    print(file_path)
    # Если аватарка была передана успешно
    if avatar:
        # Обновляем аватарку
        avatar_model = UserAvatar.objects.get(user=user)
        avatar_model.img.save(name=avatar.name, content=avatar, save=True)
        avatar_model.save()

        # Возвращаем успешный ответ.
        return Response(status=status.HTTP_200_OK)
    else:
        # Обнаружены ошибки валидации, можно вернуть ошибку.
        return Response(status=status.HTTP_400_BAD_REQUEST)


# todo обновить профиль пользователя.
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    user = request.user

    serializer = SerializerUserProfile(data=request.data)
    if serializer.is_valid():
        data = request.data

        # Проверяет на существование профиля.
        profile = check_profile_exists(user=user)
        if profile is None:
            return Response(status=status.HTTP_409_CONFLICT)
        print(data)
        print(data['location'])
        # Превращаем дату строку в дату
        date = datetime.strptime(data['birthday'], "%Y-%m-%d").date()

        # Редактируем (вносим изменения)
        profile.location = data['location']
        profile.gender = data['gender']
        profile.short_info = data['short_info']
        profile.birthday = date
        profile.save()

        # Возвращаем успешный ответ.
        return Response(status=status.HTTP_200_OK)
    else:
        # Обнаружены ошибки валидации, можно вернуть ошибку.
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# todo обновить дополнительную информацию о пользователе.
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user_additional_information(request):
    user = request.user

    serializer = SerializerUserAdditionalInformation(data=request.data)
    if serializer.is_valid():
        data = request.data

        # Проверяет на существование доп.информации.
        additional_information = check_user_additional_information_exists(user=user)
        if additional_information is None:
            return Response(status=status.HTTP_409_CONFLICT)

        # Редактируем (вносим изменения)
        additional_information.website = data.website
        additional_information.vk_page = data.vk_page
        additional_information.instagram_page = data.instagram_page
        additional_information.telegram_profile_link = data.telegram_profile_link
        additional_information.telegram_profile_id = data.telegram_profile_id
        additional_information.other_info = data.other_info
        additional_information.save()

        return Response(status=status.HTTP_200_OK)
    else:
        # Обнаружены ошибки валидации, можно вернуть ошибку.
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# todo Получить всех пользователей, получить друзей, получить запросы в друзья, отправить запрос в друзья, принять запрос в друзья, поиск друзей


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_friends(request):
    """Возвращает друзей пользователя."""
    user = request.user

    subscription = UserSubscriptions.objects.filter(user=user)

    serialized_data = []
    for request in subscription:
        serialized_request = {
            'subscriber': UserSerializer(request.subscriber).data,
            'user': UserSerializer(request.user).data,
        }
        serialized_data.append(serialized_request)
    print(serialized_data[0])
    return Response(data={'subscription': serialized_data}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_find_friends(request):
    user = request.user
    username = request.data['username']

    if username != "":
        users = User.objects.filter(
            Q(username__icontains=username) & ~Q(username__icontains=user.username) & Q(is_superuser=False))
    else:
        print('username is none')
        users = User.objects.filter(~Q(username__icontains=user.username) & Q(is_superuser=False))

    users = UserSerializer(users, many=True).data
    return Response(data={'users': users}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_request_in_friend(request):
    user = request.user
    subscriber_id = request.data['subscriber_id']

    # Проверяет на существование запроса в друзья или уже друга.
    user_subscription = check_request_user_subscription_exists(user=user, subscriber_id=subscriber_id)
    if user_subscription is None:
        return Response(status=status.HTTP_409_CONFLICT)

    RequestUserSubscriptions.objects.create(
        user=user,
        subscriber=User.objects.get(id=subscriber_id)
    )

    return Response(status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_request_in_friend(request, subscriber_id):
    user = request.user

    # Проверяет на существование запроса в друзья или уже друга.
    user_subscription = check_not_request_user_subscription_exists(user=user, subscriber_id=subscriber_id)
    if user_subscription is None:
        return Response(status=status.HTTP_409_CONFLICT)

    user_subscription.delete()

    return Response(status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_requests_to_friend(request):
    user = request.user

    requests_to_friend = RequestUserSubscriptions.objects.filter(subscriber=user)

    serialized_data = []
    for request in requests_to_friend:
        serialized_request = {
            'subscriber': UserSerializer(request.subscriber).data,
            'user': UserSerializer(request.user).data,
        }
        serialized_data.append(serialized_request)

    return Response(data={'requests_to_friend': serialized_data}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_new_friend_subscriptions(request):
    """
    Тут наоборот. Subscriber это пользователь, который нажмет подтверждение добавить в друзья. А user_id этот то кто
    отправил запрос в друзья.
    """

    subscriber = request.user
    user_id = request.data['user_id']

    print(user_id)

    # Проверяем на существование пользователя.
    user = check_user_exists(user_id=user_id)
    if user is None:
        return Response(status=status.HTTP_409_CONFLICT)

    # Проверяем на существование запроса в друзья.
    users_subscription = check_on_new_friend_subscriptions_exists(user=user, subscriber=subscriber)
    if users_subscription is None:
        return Response(status=status.HTTP_409_CONFLICT)

    # Создаем модели подписки
    UserSubscriptions.objects.create(
        user=user,
        subscriber=subscriber
    )
    UserSubscriptions.objects.create(
        user=subscriber,
        subscriber=user
    )

    # Удаляем запрос
    users_subscription.delete()

    return Response(status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_friend_subscriptions(request, user_id):
    user = request.user  # тот кто хочет удалить связь

    # Проверяем существует ли пользователь с id = user_id
    subscriber = check_user_exists(user_id=user_id)
    if subscriber is None:
        return Response(status=status.HTTP_409_CONFLICT)

    # Проверяем существует ли связь (двух пользователей).
    users_subscription = check_friend_subscription(user1=user, user2=subscriber)
    if users_subscription is None:
        return Response(status=status.HTTP_409_CONFLICT)

    UserSubscriptions.objects.get(user=user, subscriber=users_subscription).delete()
    UserSubscriptions.objects.get(user=users_subscription, subscriber=user).delete()

    return Response(data={}, status=status.HTTP_200_OK)


# todo Реализованные выше


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_add_user_in_blacklist(request):
    """Добавляет пользователя в черный список."""

    user = request.user
    user_id_for_ban = request.data['user_id']

    # Проверяем существует ли пользователь с id = user_id
    banned_user = check_user_exists(user_id=user_id_for_ban)
    if banned_user is None:
        return Response(status=status.HTTP_409_CONFLICT)

    # Проверяем есть ли пользователь уже в бане.
    banned_user = check_user_in_blacklist_exists(user=user, banned_user=banned_user)
    if banned_user:
        return Response(status=status.HTTP_409_CONFLICT)

    # Отправляем пользователя в бан.
    UserBlacklist.objects.create(user=user, banned_user=banned_user)

    return Response(status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user_from_blacklist(request):
    """Удаляет пользователя из черного списка."""

    user = request.user
    banned_user_id = request.POST.get('banned_user_id')

    # Проверяем существует ли пользователь с id = user_id
    banned_user = check_user_exists(user_id=banned_user_id)
    if banned_user is None:
        return Response(status=status.HTTP_409_CONFLICT)

    # Проверяем есть ли пользователь уже в бане.
    banned_user = check_user_in_blacklist_exists(user=user, banned_user=banned_user)
    if not banned_user:
        return Response(status=status.HTTP_204_NO_CONTENT)

    # Удаляем пользователя из бана.
    banned_user.delete()

    return Response(status=status.HTTP_200_OK)


# Если будет время. Но пока не планируется.
# def post_add_rating_user(request):
#     user = request.user
#     appraiser_id = request.POST.get('appraiser_id')
#     estimation = request.POST.get('estimation')
#
#     check_user_rating_exists
#
#     rating = UserRating.create_(user_id=user_id, appraiser_id=appraiser_id, estimation=estimation)
#     if rating.status == 'error':
#         return Response(data={'message': rating.message}, status=status.HTTP_204_NO_CONTENT)
#
#     return Response(data={}, status=status.HTTP_201_CREATED)
#
#
# def delete_rating_user(request):
#     user = request.user
#     appraiser_id = request.POST.get('appraiser_id')
#
#     rating = UserRating.delete_(user_id=user_id, appraiser_id=appraiser_id)
#     if rating.status == 'error':
#         return Response(data={'message': rating.message}, status=status.HTTP_204_NO_CONTENT)
#
#     return Response(data={}, status=status.HTTP_200_OK)


class CommunitiesView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    # def __init__(self, request, **kwargs):
    #     """
    #     Контроллер управления сообществами.\n
    #     Требуемые методы:
    #      - Создание сообщества (method post_new_community).\n
    #      - Удаление сообщества (method delete_community).\n
    #
    #      - Создание роли в сообществе (method post_create_role).\n
    #      - Удаление роли в сообществе (method delete_role).\n
    #
    #      - Создание тега в сообществе (method post_create_tag).\n
    #      - Удаление тега в сообществе (method delete_tag).\n
    #
    #      - Создание запроса для вступления в сообщество (method post_request_to_join_participant).\n
    #      - Удаление запроса для вступления в сообщество (method delete_request_to_join_participant).\n
    #
    #      - Добавить пользователя в сообщество - вступить пользователю в сообщество (method post_add_participant).\n
    #      - Удалить пользователя из сообщества - выйти пользователю из сообщества (method delete_kick_out_participant).\n
    #
    #      - Добавить рекомендацию сообщества пользователем (method post_create_user_recommendation).\n
    #      - Удалить рекомендацию сообщества пользователем (method delete_user_recommendation).\n
    #
    #      - todo Вывод информации об одном сообществе (method get_community). \n
    #      - Вывод списка запросов на вступление в сообщество (method get_request_to_join_participant)
    #      - Вывод списка "Мои сообщества" - сообщества в которых состоит пользовать user_id (method get_my_communities).\n
    #      - Вывод списка "Поиск сообществ" - все сообщества с возможностью фильтрации (method get_find_communities).\n
    #      - Вывод списка "Рекомендации друзей" - сообщества, которые рекомендовали друзья (method get_friend_recommendations).\n
    #     """
    #
    #     super().__init__(**kwargs)
    #     self.requesting_user = request.user


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_community(request) -> Response:
    """Создает новое сообщество."""

    user = request.user
    title = request.POST.get('title')
    short_info = request.POST.get('short_info')
    image_file = request.FILES.get('image')
    tag1 = request.POST.get('tagFirst')
    tag2 = request.POST.get('tagSecond')
    tag3 = request.POST.get('tagThird')

    print(title)
    community = Community.objects.create(user=user, title=title, short_info=short_info)
    print('Сообщество создано')
    CommunityTag.objects.create(community=community, tag=tag1)
    CommunityTag.objects.create(community=community, tag=tag2)
    CommunityTag.objects.create(community=community, tag=tag3)
    print('Теги созданы')

    # Создание экземпляра CommunityAvatar и сохранение изображения
    community_avatar = CommunityAvatar()
    community_avatar.community = community
    community_avatar.img.save(image_file.name, image_file)
    community_avatar.save()

    return Response(data={'status': 'success', 'community_id': community.id}, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_community(request) -> Response:
    """Удаляет сообщество."""

    # Получаем данные.
    user = request.user
    community_id = request.POST.get('community_id')

    # Проверяет на существование сообщества. Проходим если сообщество есть.
    community = check_community_exists(community_id)
    if isinstance(community, Response):
        return Response(data={}, status=status.HTTP_409_CONFLICT)

    # Проверяем, если пользователь не админ то запрещаем удаление.
    if community.user != user:
        return Response(data={}, status=status.HTTP_403_FORBIDDEN)

    # Удаляем и возвращаем успешный ответ.
    community.delete()

    return Response(data={}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_community_role(request) -> Response:
    """Создает роль в сообществе."""

    # Получаем данные.
    user = request.user
    community_id = request.POST.get('community_id')

    # Проверяет на существование сообщества.
    community = check_community_exists(community_id)
    if isinstance(community, Response):
        return Response(data={}, status=status.HTTP_204_NO_CONTENT)

    # Проверяем, если пользователь не админ то запрещаем создание ролей.
    if community.user != user:
        return Response(data={}, status=status.HTTP_403_FORBIDDEN)

    # Проверяем на существование роли.
    if Community.objects.filter(Q(community=community) and Q(title=community.title)).exists():
        return Response(data={'message': 'Role already exists'}, status=status.HTTP_409_CONFLICT)

    # Сериализуем данные и в случае успеха создаем роль.
    serializer = SerializerCreateCommunityRole(data=request.data)
    if serializer.is_valid():
        # Создаем роль.
        community_role = CommunityRole()
        community_role.title = request.POST.get('title')
        community_role.edit_community_information = request.POST.get('edit_community_information')
        community_role.manage_participants = request.POST.get('manage_participants')
        community_role.publish_articles = request.POST.get('publish_articles')
        community_role.publish_news = request.POST.get('publish_news')
        community_role.publish_ads = request.POST.get('publish_ads')
        community_role.save()

        # Возвращаем успешный ответ.
        return Response(data={}, status=status.HTTP_201_CREATED)
    else:
        # Обнаружены ошибки валидации, можно вернуть ошибку.
        return Response(serializer.errors, status=400)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_community_role(request) -> Response:
    """Удаляет роль."""

    # Получаем данные.
    user = request.user
    role_title = request.POST.get('role_title')
    community_id = request.POST.get('community_id')

    # Проверяет на существование сообщества.
    community = check_community_exists(community_id)
    if isinstance(community, Response):
        return Response(data={}, status=status.HTTP_204_NO_CONTENT)

    # Проверяем, если пользователь не админ то запрещаем удаление ролей.
    if community.user != user:
        return Response(data={}, status=status.HTTP_403_FORBIDDEN)

    # Проверяем на существование роли.
    role = CommunityRole.objects.filter(Q(community=community) and Q(title=role_title))
    if not role:
        return Response(data={}, status=status.HTTP_204_NO_CONTENT)

    # Удаляем роль.
    role.delete()

    # Возвращаем успешный ответ.
    return Response(data={}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_requests_to_join_participant(request, community_id):
    """Вывод списка запросов на вход в сообщество."""

    # Проверяет на существование сообщества.
    community = check_community_exists(community_id)
    if isinstance(community, Response):
        return Response(data={}, status=status.HTTP_204_NO_CONTENT)

    # Получаем список запросов на вступление в сообщество.
    requests_participant = RequestCommunityParticipant.objects.filter(community=community)

    # Вывод списка
    return Response(data={'requests_participant': requests_participant}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_request_to_join_participant(request):
    """Создать запрос для вступления в сообщество"""

    # Получаем данные.
    participant = request.user
    community_id = request.POST.get('community_id')

    # Проверяет на существование сообщества.
    community = check_community_exists(community_id)
    if isinstance(community, Response):
        return Response(data={}, status=status.HTTP_204_NO_CONTENT)

    # Проверяет на существование пользователя.
    participant = check_user_exists(participant.id)
    if not isinstance(participant, Response):
        return Response(data={}, status=status.HTTP_204_NO_CONTENT)

    # Проверяет на присутствие участника в сообществе.
    check_participant = check_participant_exists(community=community, participant=participant)
    if not isinstance(check_participant, Response):
        return Response(data={}, status=status.HTTP_409_CONFLICT)

    # Проверяет на присутствие запроса в участники в сообщество.
    check_participant = check_participant_request_exists(community=community, participant=participant)
    if isinstance(check_participant, Response):
        return Response(data={}, status=status.HTTP_409_CONFLICT)

    RequestCommunityParticipant.objects.create(community=community, user=participant)

    return Response(data={}, status=status.HTTP_201_CREATED)


def delete_request_to_join_participant(request):
    """
    Удалить запрос для вступления в сообщество
    """
    community_id = request.POST.get('community_id')
    participant_id = request.POST.get('participant_id')

    participant = RequestCommunityParticipant.delete_(community_id=community_id, user_id=participant_id)
    if participant.status == 'error':
        return Response(data={'message': participant.message}, status=status.HTTP_204_NO_CONTENT)

    return Response(data={}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_community_participant(request) -> Response:
    """Добавляет пользователя в участники сообщества."""

    # Получаем данные.
    user = request.user
    participant_id = request.POST.get('participant_id')
    community_id = request.POST.get('community_id')
    role_title = request.POST.get('role_title')

    # Проверяет на существование сообщества.
    community = check_community_exists(community_id)
    if isinstance(community, Response):
        return Response(data={}, status=status.HTTP_204_NO_CONTENT)

    # Проверяет на существование роли в сообществе.
    role = check_community_role_exists(community=community, community_role_title=role_title)
    if isinstance(role, Response):
        return Response(data={}, status=status.HTTP_204_NO_CONTENT)

    # Проверяет на существование пользователя.
    participant = check_user_exists(participant_id)
    if isinstance(participant, Response):
        return Response(data={}, status=status.HTTP_204_NO_CONTENT)

    # Проверяет на присутствие участника в сообществе.
    check_participant = check_participant_exists(community=community, participant=participant)
    if isinstance(check_participant, Response):
        return Response(data={}, status=status.HTTP_409_CONFLICT)

    # Получаем информацию об участнике принимающий пользователя.
    community_participant = CommunityParticipant.objects.filter(user=user)
    community_participant_role = None
    if community_participant.exists():
        community_participant_role = community_participant.first().role

    # Проверяем, если пользователь(который принимает участника user) не имеет прав то отклоняем.
    if community.user != user and community_participant.exists() and community_participant_role is not None:
        if community_participant_role.manage_participants is False:
            return Response(data={}, status=status.HTTP_403_FORBIDDEN)

    community_participant = CommunityParticipant()
    community_participant.user = participant
    community_participant.community = community
    community_participant.role = role
    community_participant.save()

    return Response(data={}, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def kick_out_community_participant(self, request) -> Response:
    """Удаляет пользователя с участников сообщества."""

    # Получаем данные.
    user = request.user
    participant_id = request.POST.get('participant_id')
    community_id = request.POST.get('community_id')

    # Проверяет на существование сообщества.
    community = check_community_exists(community_id)
    if isinstance(community, Response):
        return Response(data={}, status=status.HTTP_204_NO_CONTENT)

    # Проверяет на существование участника.
    participant = check_user_exists(participant_id)
    if isinstance(participant, Response):
        return Response(data={}, status=status.HTTP_204_NO_CONTENT)

    # Проверяет на присутствие участника в сообществе.
    check_participant = check_participant_exists(community=community, participant=participant)
    if isinstance(check_participant, Response):
        return Response(data={}, status=status.HTTP_409_CONFLICT)

    # Получаем информацию об участнике принимающий пользователя.
    community_participant = CommunityParticipant.objects.filter(user=user)
    community_participant_role = None
    if community_participant.exists():
        community_participant_role = community_participant.first().role

    # Проверяем, если пользователь(который принимает участника user) не имеет прав то отклоняем.
    if community.user != user and community_participant.exists() and community_participant_role is not None:
        if community_participant_role.manage_participants is False:
            return Response(data={}, status=status.HTTP_403_FORBIDDEN)

    # Удаляем пользователя из сообщества.
    CommunityParticipant.objects.get(community=community, user=participant).delete()

    return Response(data={}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_community_tag(self, request) -> Response:
    """Создает тег сообщества."""

    # Получаем данные.
    user = request.user
    community_id = request.POST.get('community_id')
    tag_title = request.POST.get('tag_title')

    # Проверяет на существование сообщества.
    community = check_community_exists(community_id)
    if isinstance(community, Response):
        return Response(data={}, status=status.HTTP_204_NO_CONTENT)

    # Проверяет на существование тега в сообществе. Если его нет, то ок.
    tag = check_community_tag_exists(community=community, community_tag_title=tag_title)
    if isinstance(tag, Response):
        return Response(data={}, status=status.HTTP_204_NO_CONTENT)

    # Проверяем, если пользователь не админ то запрещаем создание тега.
    if community.user != user:
        return Response(data={}, status=status.HTTP_403_FORBIDDEN)

    # Создаем тег.
    CommunityTag.objects.create(community=community, tag=tag_title)

    # Возвращаем успешный ответ.
    return Response(data={}, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_tag(self, request) -> Response:
    """Удаляет тег сообщества."""

    # Получаем данные.
    user = request.user
    community_id = request.POST.get('community_id')
    tag_title = request.POST.get('tag_title')

    # Проверяет на существование сообщества.
    community = check_community_exists(community_id)
    if isinstance(community, Response):
        return Response(data={}, status=status.HTTP_204_NO_CONTENT)

    # Проверяет на существование тега в сообществе. Если он есть, то ок.
    tag = check_community_tag_exists(community=community, community_tag_title=tag_title)
    if not isinstance(tag, Response):
        return Response(data={}, status=status.HTTP_409_CONFLICT)

    # Проверяем, если пользователь не админ то запрещаем удаление тега.
    if community.user != user:
        return Response(data={}, status=status.HTTP_403_FORBIDDEN)

    CommunityTag.objects.get(community=community, community_tag_title=tag_title).delete()

    # Возвращаем успешный ответ.
    return Response(data={}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_create_user_recommendation(self, request):
    """Добавить рекомендацию сообщества пользователем."""

    # Получаем данные.
    participant = request.user
    community_id = request.POST.get('community_id')
    score = request.POST.get('score')

    score = score if score < 1 or score > 10 else 5

    # Проверяет на существование сообщества.
    community = check_community_exists(community_id)
    if isinstance(community, Response):
        return Response(data={}, status=status.HTTP_204_NO_CONTENT)

    # Проверяет на существование рекомендации пользователя. Если его нет, то ок.
    recommendation = check_user_recommendation_community_exists(community=community, participant=participant)
    if isinstance(recommendation, Response):
        return Response(data={}, status=status.HTTP_409_CONFLICT)

    CommunityRecommendation.objects.create(community=community, user=participant, score=score)

    return Response(data={}, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user_recommendation(self, request):
    """Удалить рекомендацию сообщества пользователем"""

    # Получаем данные.
    participant = request.user
    community_id = request.POST.get('community_id')

    # Проверяет на существование сообщества.
    community = check_community_exists(community_id)
    if isinstance(community, Response):
        return Response(data={}, status=status.HTTP_204_NO_CONTENT)

    # Проверяет на существование тега в сообществе. Если он есть, то ок.
    recommendation = check_user_recommendation_community_exists(community=community, participant=participant)
    if not isinstance(recommendation, Response):
        return Response(data={}, status=status.HTTP_409_CONFLICT)

    CommunityRecommendation.objects.get(community=community, participant=participant).delete()

    return Response(data={}, status=status.HTTP_200_OK)


def get_user_communities(self, request):
    """
    Вывод списка "Мои сообщества"
    """
    user_communities = User.user_communities(user_id=self.requesting_user.id)
    return Response(data={'communities': user_communities}, status=status.HTTP_200_OK)


def get_find_communities(self, request):
    """
    Вывод списка "Поиск сообществ"
    """
    find_text = request.GET.get('find_text')
    data = Community.objects.filter(Q(title=rf"{find_text}") or Q(description=rf"{find_text}"))
    return Response(data=data, status=status.HTTP_200_OK)


# Остались методы
def get_friend_recommendations(self, request):
    """
    Вывод списка "Рекомендации друзей"
    """
    friends = UserSubscriptions.objects.filter(user=self.requesting_user)
    communities = [CommunityParticipant.objects.filter(user=friend.subscriber) for friend in friends]
    # Немного страшный код, но лучше не придумал.
    data = []
    for community in communities:
        data.extend(community)

    return Response(data={'communities': data}, status=status.HTTP_200_OK)


#
#
# def articles(request, page: int, size: int):
#     """
#     Возвращает статьи с пагинацией.
#     \n * page - страница.
#     \n * size - количество страниц.
#     """
#
#     data = Article.objects.filter(Q(status=1)).order_by('id')  # status - глобальные (1)
#     page_number = page  # Номер страницы
#     page_size = size  # Количество элементов на странице
#
#     paginator = PageNumberPagination(data, page_size)
#
#     try:
#         page = paginator.page(page_number)
#         data = page.object_list
#         total_pages = paginator.get_page_number()
#         status_code = 200
#     except Exception as e:
#         print(e)
#         data = []
#         total_pages = 0
#         total_items = 0
#         status_code = 204
#
#     return Response(
#         data=data,
#         status=status.HTTP_200_OK if status_code == 200 else status.HTTP_204_NO_CONTENT
#     )
#
#
# def article(request, article_id: int):
#     """
#     Возвращает данные одной статьи.
#     """
#     data = Article.objects.get(id=article_id)
#     status_code = 200 if data else 204
#     data = data if data else []
#
#     return Response(
#         data=data,
#         status=status.HTTP_200_OK if status_code == 200 else status.HTTP_204_NO_CONTENT
#     )
#
#
# def news(request):
#     """
#     Возвращает последние 4 новости.
#     """
#     data = News.objects.get().order_by('id')
#     status_code = 200 if data else 204
#     data = data[:4] if data else []
#
#     return Response(
#         data=data,
#         status=status.HTTP_200_OK if status_code == 200 else status.HTTP_204_NO_CONTENT
#     )


# TODO Система авторизации, регистрации, выход из системы


jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = (permissions.AllowAny,)


class UserAuthenticationView(generics.GenericAPIView):
    serializer_class = UserAuthenticationSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh_token = RefreshToken.for_user(user)
        access_token = str(refresh_token.access_token)

        return Response({
            'user_id': user.id,
            'username': user.username,
            'access_token': access_token,
            'refresh_token': str(refresh_token)
        })


class UserSignoutView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            refresh_token = str(request.data.get('refresh_token'))
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response({'detail': 'User successfully signed out.'}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Refresh token not provided.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({'detail': 'An error occurred while signing out.'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserTokenRestoreView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        token = request.data.get('token')
        user_id = request.data.get('user_id')

        if token and user_id:
            user = User.objects.get(id=user_id)
            refresh_token = RefreshToken.for_user(user)
            print(Token.for_user(user=user))
            print(refresh_token)
            print(token)
            access_token = str(refresh_token.access_token)
            return Response({
                'user_id': user.id,
                'username': user.username,
                'access_token': access_token,
                'refresh_token': str(token)
            }, status=status.HTTP_200_OK)
        # except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        #     return Response({'detail': 'Invalid token or user_id.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'detail': 'Token and user_id are required.'}, status=status.HTTP_400_BAD_REQUEST)
