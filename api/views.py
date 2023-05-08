# todo Добавить фильтр: Если пользователь подписан на какие то сообщества, контент вначале берется оттуда а затем
#  если не зватает берутся остальные (по темам которые интересует пользователей).
# todo Добавить фильтр: Если сообщество у него в черном списке оно не появляется в списке с сообществами.

from django.db.models import Q
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.pagination import PageNumberPagination
from .models import User, Article, News, Community
from .serializers import UserSerializer


def user(request, user_id: int):
    """
    Возвращает информацию о пользователе с id = user_id.
    """

    user_ = User.objects.get(id=user_id)
    return Response(data=user_, status=status.HTTP_200_OK)


class CommunitiesView:
    def __init__(self, user_id: int):
        self.user_ = User.objects.get(id=user_id)

    def get_user_communities(self, request):
        """
        Возвращает список сообществ в которые пользователь зашел + сообщества которые создал пользователь.
        """

        data = self.user_.my_communities()
        return Response(data=data, status=status.HTTP_200_OK)

    @staticmethod
    def get_find_communities(request, find_data: str):
        """
        Возвращает список сообществ по тексту который введет пользователь при поиске.
        """

        # Экранирование происходит автоматически в Django ORM.
        data = Community.objects.filter(Q(title=rf"{find_data}") or Q(description=rf"{find_data}"))
        return Response(data=data, status=status.HTTP_200_OK)


    def post_new_community(self, request):
        title = request.POST.get('title')
        description = request.POST.get('description')

        Community.new_community(user_id=self.user_.id, title=title, description=description)




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
