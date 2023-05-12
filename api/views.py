# todo Добавить фильтр: Если пользователь подписан на какие то сообщества, контент вначале берется оттуда а затем
#  если не зватает берутся остальные (по темам которые интересует пользователей).
# todo Добавить фильтр: Если сообщество у него в черном списке оно не появляется в списке с сообществами.
# todo Добавить проверки на роли: Если роль позволяет то пропускать иначе отбрасывать.

from django.db.models import Q
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.pagination import PageNumberPagination
from .models import User, Article, News, Community, CommunityRole, CommunityParticipant, CommunityTag, \
    CommunityRecommendation, RequestCommunityParticipant, UserSubscriptions
from .serializers import UserSerializer


def user(request, user_id: int):
    """
    Возвращает информацию о пользователе с id = user_id.
    """

    requesting_user = User.objects.get(id=user_id)
    return Response(data=requesting_user, status=status.HTTP_200_OK)


class UserView:
    authentication_classes = [JWTAuthentication]

    def __init__(self, request):
        """
        Контроллер управления пользователем. \n
        Требуемые методы: \n
         - Авторизация, регистрация, создание токена уже реализовано в классах ниже. \n

         - Создание профиля пользователя. \n
         - Редактирование (+удаление) профиля пользователя. \n

         - Создание дополнительной информации пользователя. \n
         - Редактирование (+удаление) дополнительной информации пользователя. \n

         - Добавить запрос пользователя в друзья. \n
         - Удалить запрос пользователя в друзья. \n

         - Добавить пользователя в друзья. \n
         - Удалить пользователя из друзей. \n

         - Добавить пользователя в черный список.
         - Удалить пользователя из черного списка.

         - Добавить отзыв пользователя о другом пользователе.
         - Удалить отзыв пользователя о другом пользователе.





        """
        self.requesting_user = request.user


class CommunitiesView:
    authentication_classes = [JWTAuthentication]

    def __init__(self, request):
        """
        Контроллер управления сообществами.\n
        Требуемые методы:
         - Создание сообщества (method post_new_community).\n
         - Удаление сообщества (method delete_community).\n

         - Создание роли в сообществе (method post_create_role).\n
         - Удаление роли в сообществе (method delete_role).\n

         - Создание тега в сообществе (method post_create_tag).\n
         - Удаление тега в сообществе (method delete_tag).\n

         - Создание запроса для вступления в сообщество (method post_request_to_join_participant).\n
         - Удаление запроса для вступления в сообщество (method delete_request_to_join_participant).\n

         - Добавить пользователя в сообщество - вступить пользователю в сообщество (method post_add_participant).\n
         - Удалить пользователя из сообщества - выйти пользователю из сообщества (method delete_kick_out_participant).\n

         - Добавить рекомендацию сообщества пользователем (method post_create_user_recommendation).\n
         - Удалить рекомендацию сообщества пользователем (method delete_user_recommendation).\n

         - Вывод списка запросов на вступление в сообщество (method get_request_to_join_participant)
         - Вывод списка "Мои сообщества" - сообщества в которых состоит пользовать user_id (method get_my_communities).\n
         - Вывод списка "Поиск сообществ" - все сообщества с возможностью фильтрации (method get_find_communities).\n
         - Вывод списка "Рекомендации друзей" - сообщества, которые рекомендовали друзья (method get_friend_recommendations).\n
        """
        self.requesting_user = request.user

    def post_create_community(self, request) -> Response:
        """
        Создает новое сообщество.
        """
        title = request.POST.get('title')
        description = request.POST.get('description')

        Community.new_community(user_id=self.requesting_user.id, title=title, description=description)
        return Response(data={'status': 'success'}, status=status.HTTP_201_CREATED)

    def delete_community(self, request) -> Response:
        """
        Удаляет сообщество.
        - Если сообщества не существует вызываем исключение.
        - Если пользователь администратор мы удаляем сообщество, иначе нет.
        """
        community_id = request.POST.get('community_id')

        community = Community.objects.filter(id=community_id)
        if not community.exists():
            return Response(data={}, status=status.HTTP_204_NO_CONTENT)
        community = community.first()

        if community.user != self.requesting_user:
            return Response(data={}, status=status.HTTP_403_FORBIDDEN)
        community.delete()
        return Response(data={}, status=status.HTTP_200_OK)

    def post_create_role(self, request) -> Response:
        """
        Создает роль в сообществе.
        """
        community_id = request.POST.get('community_id')

        community = Community.objects.filter(id=community_id)
        if not community.exists():
            return Response(data={}, status=status.HTTP_204_NO_CONTENT)
        community = community.first()

        if community.user != self.requesting_user:
            return Response(data={}, status=status.HTTP_403_FORBIDDEN)
        if Community.objects.filter(Q(community=community) and Q(title=community.title)).exists():
            return Response(data={'message': 'Role already exists'}, status=status.HTTP_409_CONFLICT)

        community_role = CommunityRole()
        community_role.title = request.POST.get('title', community.title)
        community_role.administrator = request.POST.get('administrator', community.administrator)
        community_role.content_moderator = request.POST.get('content_moderator', community.content_moderator)
        community_role.invite_participants = request.POST.get('invite_participants', community.invite_participants)
        community_role.edit_community_information = request.POST.get('edit_community_information',
                                                                     community.edit_community_information)
        community_role.manage_participants = request.POST.get('manage_participants', community.manage_participants)
        community_role.publish_articles = request.POST.get('publish_articles', community.publish_articles)
        community_role.publish_news = request.POST.get('publish_news', community.publish_news)
        community_role.save()

        return Response(data={}, status=status.HTTP_200_OK)

    def delete_role(self, request) -> Response:
        """
        Удаляет роль.
        """
        community_id = request.POST.get('community_id')
        role_title = request.POST.get('role_title')

        community = Community.objects.filter(id=community_id)
        if not community.exists():
            return Response(data={}, status=status.HTTP_204_NO_CONTENT)
        community = community.first()

        role = CommunityRole.objects.filter(Q(community=community) and Q(title=role_title))
        if not role:
            return Response(data={}, status=status.HTTP_204_NO_CONTENT)
        role.delete()

        return Response(data={}, status=status.HTTP_200_OK)

    def post_add_participant(self, request) -> Response:
        """
        Добавляет пользователя в участники сообщества.
        """
        community_id = request.POST.get('community_id')

        community = Community.objects.filter(id=community_id)
        if not community.exists():
            return Response(data={}, status=status.HTTP_204_NO_CONTENT)
        community = community.first()

        participant = CommunityParticipant()
        participant.user = self.requesting_user
        participant.community = community
        participant.save()

        return Response(data={}, status=status.HTTP_201_CREATED)

    def delete_kick_out_participant(self, request) -> Response:
        """
        Удаляет пользователя с участников сообщества.
        """
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


def articles(request, page: int, size: int):
    """
    Возвращает статьи с пагинацией.
    \n * page - страница.
    \n * size - количество страниц.
    """

    data = Article.objects.filter(Q(status=1)).order_by('id')  # status - глобальные (1)
    page_number = page  # Номер страницы
    page_size = size  # Количество элементов на странице

    paginator = PageNumberPagination(data, page_size)

    try:
        page = paginator.page(page_number)
        data = page.object_list
        total_pages = paginator.get_page_number()
        status_code = 200
    except Exception as e:
        print(e)
        data = []
        total_pages = 0
        total_items = 0
        status_code = 204

    return Response(
        data=data,
        status=status.HTTP_200_OK if status_code == 200 else status.HTTP_204_NO_CONTENT
    )


def article(request, article_id: int):
    """
    Возвращает данные одной статьи.
    """
    data = Article.objects.get(id=article_id)
    status_code = 200 if data else 204
    data = data if data else []

    return Response(
        data=data,
        status=status.HTTP_200_OK if status_code == 200 else status.HTTP_204_NO_CONTENT
    )


def news(request):
    """
    Возвращает последние 4 новости.
    """
    data = News.objects.get().order_by('id')
    status_code = 200 if data else 204
    data = data[:4] if data else []

    return Response(
        data=data,
        status=status.HTTP_200_OK if status_code == 200 else status.HTTP_204_NO_CONTENT
    )


# TODO Система авторизации, регистрации, выход из системы

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer


class LogoutView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        return Response(status=status.HTTP_200_OK)


class TokenObtainPairWithUserInfoView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer


class TokenRefreshWithUserInfoView(TokenRefreshView):
    serializer_class = TokenObtainPairSerializer
