# todo Добавить фильтр: Если пользователь подписан на какие то сообщества, контент вначале берется оттуда а затем
#  если не зватает берутся остальные (по темам которые интересует пользователей).
# todo Добавить фильтр: Если сообщество у него в черном списке оно не появляется в списке с сообществами.
# todo Добавить проверки на роли: Если роль позволяет то пропускать иначе отбрасывать.

from django.db.models import Q
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.pagination import PageNumberPagination
from .models import User, Article, News, Community, CommunityRole, CommunityParticipant
from .serializers import UserSerializer


def user(request, user_id: int):
    """
    Возвращает информацию о пользователе с id = user_id.
    """

    requesting_user = User.objects.get(id=user_id)
    return Response(data=requesting_user, status=status.HTTP_200_OK)


class CommunitiesView:
    def __init__(self, user_id: int):
        """
        Контроллер для управления сообществами.\n
        Требуемые методы:
         - Создание сообщества (method post_new_community).
         - Удаление сообщества (method delete_community).
         - Создание роли в сообществе (method post_create_role).
         - Удаление роли в сообществе (method delete_role).
         - Добавить пользователя в сообщество - вступить пользователю user_id в сообщество (method post_add_participant).
         - Удалить пользователя из сообщества - выйти пользователю user_id из сообщества.
         - Добавить рекомендацию сообщества пользователем.
         - Вывод списка "Мои сообщества" - сообщества в которых состоит пользовать user_id.
         - Вывод списка "Поиск сообществ" - все сообщества с возможностью фильтрации.
         - Вывод списка "Рекомендации друзей" - сообщества, которые рекомендовали друзья.
        """
        self.requesting_user = User.objects.get(id=user_id)

    def post_new_community(self, request):
        """
        Создает новое сообщество.
        """
        title = request.POST.get('title')
        description = request.POST.get('description')

        Community.new_community(user_id=self.requesting_user.id, title=title, description=description)
        return Response(data={'status': 'success'}, status=status.HTTP_201_CREATED)

    def delete_community(self, request):
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

    def post_create_role(self, request):
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

    def delete_role(self, request):
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

    def post_add_participant(self, request):
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

    def delete_kick_out_participant(self, request):
        """
        Удаляет пользователя с участников сообщества.
        """
        community_id = request.POST.get('community_id')
        target_user_id = request.POST.get('target_user_id')

        community = Community.objects.filter(id=community_id)
        if not community.exists():
            return Response(data={}, status=status.HTTP_204_NO_CONTENT)
        community = community.first()

        user = User.objects.filter(id=target_user_id)
        if not user.exists():
            return Response(data={}, status=status.HTTP_204_NO_CONTENT)
        user = user.first()


    def get_user_communities(self, request):
        """
        Возвращает список сообществ в которые пользователь зашел + сообщества, которые создал пользователь.
        """

        data = self.requesting_user.my_communities()
        return Response(data=data, status=status.HTTP_200_OK)

    @staticmethod
    def get_find_communities(request, find_data: str):
        """
        Возвращает список сообществ по тексту который введет пользователь при поиске.
        """

        # Экранирование происходит автоматически в Django ORM.
        data = Community.objects.filter(Q(title=rf"{find_data}") or Q(description=rf"{find_data}"))
        return Response(data=data, status=status.HTTP_200_OK)


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
