# todo Добавить фильтр: Если пользователь подписан на какие то сообщества, контент вначале берется оттуда а затем
#  если не зватает берутся остальные (по темам которые интересует пользователей).
# todo Добавить фильтр: Если сообщество у него в черном списке оно не появляется в списке с сообществами.
# todo Добавить проверки на роли: Если роль позволяет то пропускать иначе отбрасывать.
from functools import wraps

from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.views import APIView
from rest_framework_jwt.settings import api_settings

from django.db.models import Q
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from .models import User, Article, News, Community, CommunityRole, CommunityParticipant, CommunityTag, \
    CommunityRecommendation, RequestCommunityParticipant, UserSubscriptions, UserProfile, UserAdditionalInformation, \
    RequestUserSubscriptions, UserBlacklist, UserRating
from .serializers import UserRegistrationSerializer, UserAuthenticationSerializer, SerializerCreateCommunityRole


# Helpers

def check_community_exists(community_id):
    """Проверяем на существование сообщества."""
    community = Community.objects.filter(id=community_id)
    if not community.exists():
        return Response(data={}, status=status.HTTP_204_NO_CONTENT)
    return community.first()


def check_user_exists(community_id):
    """Проверяем на существование сообщества."""
    user = User.objects.filter(id=community_id)
    if not user.exists():
        return Response(data={}, status=status.HTTP_204_NO_CONTENT)
    return user.first()


def check_participant_exists(community_id):
    """Проверяем на существование сообщества."""
    participant = CommunityParticipant.objects.filter(id=community_id)
    if participant.exists():
        return Response(data={}, status=status.HTTP_409_CONFLICT)
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def post_create_user_profile(self, request):
    location = request.POST.get('location')
    gender = request.POST.get('gender')
    birthday = request.POST.get('birthday')
    user_id = request.user.id

    profile = UserProfile.create(user_id=user_id, location=location, gender=gender, birthday=birthday)
    if profile.status == 'error':
        return Response(data={'message': profile.message}, status=status.HTTP_204_NO_CONTENT)

    return Response(data={}, status=status.HTTP_201_CREATED)


def update_user_profile(self, request):
    location = request.POST.get('location')
    gender = request.POST.get('gender')
    birthday = request.POST.get('birthday')
    user_id = self.requesting_user.id

    profile = UserProfile.update(user_id=user_id, location=location, gender=gender, birthday=birthday)
    if profile.status == 'error':
        return Response(data={'message': profile.message}, status=status.HTTP_204_NO_CONTENT)

    return Response(data={}, status=status.HTTP_200_OK)


def post_create_user_additional_information(self, request):
    website = request.POST.get('website')
    telegram_profile_link = request.POST.get('telegram_profile_link')
    telegram_profile_id = request.POST.get('telegram_profile_id')
    other_info = request.POST.get('other_info')
    user_id = self.requesting_user.id

    additional_information = UserAdditionalInformation.create(
        user_id=user_id,
        website=website,
        telegram_profile_link=telegram_profile_link,
        telegram_profile_id=telegram_profile_id,
        other_info=other_info
    )
    if additional_information.status == 'error':
        return Response(data={'message': additional_information.message}, status=status.HTTP_204_NO_CONTENT)

    return Response(data={}, status=status.HTTP_201_CREATED)


def update_user_additional_information(self, request):
    website = request.POST.get('website')
    telegram_profile_link = request.POST.get('telegram_profile_link')
    telegram_profile_id = request.POST.get('telegram_profile_id')
    other_info = request.POST.get('other_info')
    user_id = self.requesting_user.id

    additional_information = UserAdditionalInformation.update(
        user_id=user_id,
        website=website,
        telegram_profile_link=telegram_profile_link,
        telegram_profile_id=telegram_profile_id,
        other_info=other_info
    )
    if additional_information.status == 'error':
        return Response(data={'message': additional_information.message}, status=status.HTTP_204_NO_CONTENT)

    return Response(data={}, status=status.HTTP_200_OK)


def post_add_request_in_friend(self, request):
    user_id = self.requesting_user.id
    subscriber_id = request.POST.get('subscriber_id')

    request_user_subscriptions = RequestUserSubscriptions.create(user_id=user_id, subscriber_id=subscriber_id)
    if request_user_subscriptions.status == 'error':
        return Response(data={'message': request_user_subscriptions.message}, status=status.HTTP_204_NO_CONTENT)

    return Response(data={}, status=status.HTTP_201_CREATED)


def delete_request_in_friend(self, request):
    user_id = self.requesting_user.id
    subscriber_id = request.POST.get('subscriber_id')

    request_user_subscriptions = RequestUserSubscriptions.delete_(user_id=user_id, subscriber_id=subscriber_id)
    if request_user_subscriptions.status == 'error':
        return Response(data={'message': request_user_subscriptions.message}, status=status.HTTP_204_NO_CONTENT)

    return Response(data={}, status=status.HTTP_200_OK)


def post_add_new_friend_subscriptions(self, request):
    user_id = self.requesting_user.id
    subscriber_id = request.POST.get('subscriber_id')

    user_subscriptions = UserSubscriptions.create(user_id=user_id, subscriber_id=subscriber_id)
    if user_subscriptions.status == 'error':
        return Response(data={'message': user_subscriptions.message}, status=status.HTTP_204_NO_CONTENT)

    return Response(data={}, status=status.HTTP_201_CREATED)


def delete_friend_subscriptions(self, request):
    user_id = self.requesting_user.id
    subscriber_id = request.POST.get('subscriber_id')

    user_subscriptions = UserSubscriptions.delete_(user_id=user_id, subscriber_id=subscriber_id)
    if user_subscriptions.status == 'error':
        return Response(data={'message': user_subscriptions.message}, status=status.HTTP_204_NO_CONTENT)

    return Response(data={}, status=status.HTTP_200_OK)


def post_add_user_in_blacklist(self, request):
    user_id = self.requesting_user.id
    banned_user_id = request.POST.get('banned_user_id')

    banned_user = UserBlacklist.create_(user_id=user_id, banned_user_id=banned_user_id)
    if banned_user.status == 'error':
        return Response(data={'message': banned_user.message}, status=status.HTTP_204_NO_CONTENT)

    return Response(data={}, status=status.HTTP_201_CREATED)


def delete_user_from_blacklist(self, request):
    user_id = self.requesting_user.id
    banned_user_id = request.POST.get('banned_user_id')

    banned_user = UserBlacklist.delete_(user_id=user_id, banned_user_id=banned_user_id)
    if banned_user.status == 'error':
        return Response(data={'message': banned_user.message}, status=status.HTTP_204_NO_CONTENT)

    return Response(data={}, status=status.HTTP_200_OK)


def post_add_rating_user(self, request):
    user_id = self.requesting_user.id
    appraiser_id = request.POST.get('appraiser_id')
    estimation = request.POST.get('estimation')

    rating = UserRating.create_(user_id=user_id, appraiser_id=appraiser_id, estimation=estimation)
    if rating.status == 'error':
        return Response(data={'message': rating.message}, status=status.HTTP_204_NO_CONTENT)

    return Response(data={}, status=status.HTTP_201_CREATED)


def delete_rating_user(self, request):
    user_id = self.requesting_user.id
    appraiser_id = request.POST.get('appraiser_id')

    rating = UserRating.delete_(user_id=user_id, appraiser_id=appraiser_id)
    if rating.status == 'error':
        return Response(data={'message': rating.message}, status=status.HTTP_204_NO_CONTENT)

    return Response(data={}, status=status.HTTP_200_OK)


def get_user(self, request, user_id: int):
    user_ = User.user(user_id=user_id)
    if user_.status == 'error':
        return Response(data={'message': user_.message}, status=status.HTTP_204_NO_CONTENT)
    return Response(data={'user': user_}, status=status.HTTP_200_OK)


def get_me(self, request):
    user_id = self.requesting_user.id
    user_ = User.user(user_id=user_id)
    if user_.status == 'error':
        return Response(data={'message': user_.message}, status=status.HTTP_204_NO_CONTENT)
    return Response(data={'user': user_}, status=status.HTTP_200_OK)


def get_my_friends(self, request):
    pass


def get_request_to_friend(self, request):
    pass


def get_find_friends(self, request):
    pass


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
    description = request.POST.get('description')

    Community.new_community(user_id=user.id, title=title, description=description)
    return Response(data={'status': 'success'}, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_community(request) -> Response:
    """Удаляет сообщество."""

    # Получаем данные.
    user = request.user
    community_id = request.POST.get('community_id')

    # Проверяет на существование сообщества.
    community = check_community_exists(community_id)
    if isinstance(community, Response):
        return Response(data={}, status=status.HTTP_204_NO_CONTENT)

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
        community_role.title = request.POST.get('title', community.title)
        community_role.invite_participants = request.POST.get('invite_participants', community.invite_participants)
        community_role.edit_community_information = request.POST.get('edit_community_information',
                                                                     community.edit_community_information)
        community_role.manage_participants = request.POST.get('manage_participants', community.manage_participants)
        community_role.publish_articles = request.POST.get('publish_articles', community.publish_articles)
        community_role.publish_news = request.POST.get('publish_news', community.publish_news)
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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_community_participant(request) -> Response:
    """Добавляет пользователя в участники сообщества."""

    # Получаем данные.
    user = request.user
    participant_id = request.POST.get('participant_id')
    community_id = request.POST.get('community_id')

    # Проверяет на существование сообщества.
    community = check_community_exists(community_id)
    if isinstance(community, Response):
        return Response(data={}, status=status.HTTP_204_NO_CONTENT)

    # todo Проверяет на существование роли в сообществе.
    community = check_community_exists(community_id)
    if isinstance(community, Response):
        return Response(data={}, status=status.HTTP_204_NO_CONTENT)

    # Проверяет на существование участника.
    participant = check_user_exists(participant_id)
    if isinstance(participant, Response):
        return Response(data={}, status=status.HTTP_204_NO_CONTENT)

    # Проверяет на присутствие участника в сообществе.
    check_participant = check_user_exists(participant_id)
    if isinstance(check_participant, Response):
        return Response(data={}, status=status.HTTP_409_CONFLICT)

    # Получаем информацию об участнике принимающий пользователя.
    community_participant = CommunityParticipant.objects.filter(user=user)
    community_participant_role = None
    if community_participant.exists():
        community_participant_role = community_participant.first().role

    # Проверяем, если пользователь(который принимает участника user) не имеет прав то отклоняем.
    if community.user != user and community_participant.exists() and community_participant_role is not None:
        if community_participant_role.invite_participants is False:
            return Response(data={}, status=status.HTTP_403_FORBIDDEN)

    community_participant = CommunityParticipant()
    community_participant.user = participant
    community_participant.community = community
    community_participant.role = role
    community_participant.save()

    return Response(data={}, status=status.HTTP_201_CREATED)


def kick_out_community_participant(self, request) -> Response:
    """Удаляет пользователя с участников сообщества."""
    community_id = request.POST.get('community_id')
    target_user_id = request.POST.get('target_user_id')

    # Проверка на существование сообщества.
    community = Community.objects.filter(id=community_id)
    if not community.exists():
        return Response(data={'message': 'Community not found'}, status=status.HTTP_204_NO_CONTENT)
    community = community.first()

    # Проверка на существование пользователя.
    user_ = User.objects.filter(id=target_user_id)
    if not user_.exists():
        return Response(data={'message': 'User not found'}, status=status.HTTP_204_NO_CONTENT)
    user_ = user_.first()

    # Проверка на существование этого пользователя в этом сообществе.
    participant = CommunityParticipant.objects.filter(community=community, user=user_)
    if not participant:
        return Response(data={'message': 'Participant not found'}, status=status.HTTP_204_NO_CONTENT)
    participant = participant.first()

    # Удаляем пользователя из сообщества.
    participant.delete()

    return Response(data={}, status=status.HTTP_200_OK)


def post_create_tag(self, request) -> Response:
    """
    Создает тег сообщества.
    """
    community_id = request.POST.get('community_id')
    tag = request.POST.get('tag')

    # Вызываем метод модели, там есть проверка на существование сообщества и проверка на существование тега.
    community_tag = CommunityTag.create(community_id=community_id, tag=tag)
    if community_tag.status == 'error':
        return Response(data={'message': community_tag.message}, status=status.HTTP_204_NO_CONTENT)

    return Response(data={}, status=status.HTTP_201_CREATED)


def delete_tag(self, request) -> Response:
    """
    Удаляет тег сообщества.
    """
    community_id = request.POST.get('community_id')
    tag = request.POST.get('tag')

    # Вызываем метод модели, там есть проверка на существование сообщества и проверка на существование тега.
    community_tag = CommunityTag.create(community_id=community_id, tag=tag)
    if community_tag.status == 'error':
        return Response(data={'message': community_tag.message}, status=status.HTTP_204_NO_CONTENT)

    return Response(data={}, status=status.HTTP_200_OK)


def post_create_user_recommendation(self, request):
    """
    Добавить рекомендацию сообщества пользователем
    """
    community_id = request.POST.get('community_id')
    user_id = self.requesting_user.id
    score = request.POST.get('score')

    score = score if 1 <= score <= 10 else 5
    recommendation = CommunityRecommendation.create(community_id=community_id, user_id=user_id, score=score)
    if recommendation.status == 'error':
        return Response(data={'message': recommendation.message}, status=status.HTTP_204_NO_CONTENT)

    return Response(data={}, status=status.HTTP_200_OK)


def delete_user_recommendation(self, request):
    """
    Удалить рекомендацию сообщества пользователем
    """
    community_id = request.POST.get('community_id')
    user_id = self.requesting_user.id

    recommendation = CommunityRecommendation.delete_(community_id=community_id, user_id=user_id)
    if recommendation.status == 'error':
        return Response(data={'message': recommendation.message}, status=status.HTTP_204_NO_CONTENT)

    return Response(data={}, status=status.HTTP_200_OK)


def get_request_to_join_participant(self, request):
    """
    Вывод списка запросов на вход в сообщество.
    """
    community_id = request.POST.get('community_id')

    requests_participant = RequestCommunityParticipant.list()
    if requests_participant.status == 'error':
        return Response(data={'message': requests_participant.message}, status=status.HTTP_204_NO_CONTENT)

    return Response(data={'requests_participant': requests_participant}, status=status.HTTP_200_OK)


def post_request_to_join_participant(self, request):
    """
    Создать запрос для вступления в сообщество
    """
    community_id = request.POST.get('community_id')
    participant_id = request.POST.get('participant_id')

    participant = RequestCommunityParticipant.create(community_id=community_id, user_id=participant_id)
    if participant.status == 'error':
        return Response(data={'message': participant.message}, status=status.HTTP_204_NO_CONTENT)

    return Response(data={}, status=status.HTTP_201_CREATED)


def delete_request_to_join_participant(self, request):
    """
    Удалить запрос для вступления в сообщество
    """
    community_id = request.POST.get('community_id')
    participant_id = request.POST.get('participant_id')

    participant = RequestCommunityParticipant.delete_(community_id=community_id, user_id=participant_id)
    if participant.status == 'error':
        return Response(data={'message': participant.message}, status=status.HTTP_204_NO_CONTENT)

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
