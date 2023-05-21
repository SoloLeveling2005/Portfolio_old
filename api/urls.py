from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.decorators.http import require_http_methods

from django_settings import settings
from . import views
from rest_framework_simplejwt import views as jwt_views
urlpatterns = [
    # Добавляем обработчик несуществующего пути
    # re_path('api/', include([
    #     # Добавляем путь для авторизации + добавляем обработчик методов.
    #     re_path(r'^post_create_community$', require_http_methods(['POST'])(views.create_community)),
    #     re_path(r'^delete_community$', require_http_methods(['DELETE'])(views.delete_community)),
    # ])),


    # Работа с пользователем

    path('users/get_user/<int:user_id>', views.get_user, name='get_user'),
    path('users/update_user_avatar', views.update_user_avatar, name='update_user_avatar'),
    path('users/update_user_profile', views.update_user_profile, name="update_user_profile"),
    path('users/update_user_additional_information', views.update_user_additional_information,
         name="update_user_additional_information"),

    # Получить всех пользователей, получить друзей, получить запросы в друзья, отправить запрос в друзья, принять запрос в друзья, поиск друзей
    path('users/get_my_friends', views.get_my_friends, name="get_my_friends"),
    path('users/get_find_friends', views.get_find_friends, name="get_find_friends"),


    # Работа с сообществом
    path('community/create_community', views.create_community, name="create_community"),
    path('community/create_community', views.create_community, name="create_community"),
    path('community/create_community', views.create_community, name="create_community"),



    # TODO Система авторизации, регистрации, выход из системы
    path('signup', views.UserRegistrationView.as_view(), name='signup'),
    path('signin', views.UserAuthenticationView.as_view(), name='signin'),
    path('signout', views.UserSignoutView.as_view(), name='signout'),
    path('refresh_token', jwt_views.TokenRefreshView.as_view(), name='refresh_token'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
