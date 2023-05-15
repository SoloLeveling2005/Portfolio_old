from django.contrib import admin
from django.urls import path, include, re_path
from django.views.decorators.http import require_http_methods
from . import views
from .views import UserRegistrationView, UserAuthenticationView, \
    UserSignoutView, CommunitiesView, post_create_community

urlpatterns = [
    # Добавляем обработчик несуществующего пути
    re_path('api/', include([
        # Добавляем путь для авторизации + добавляем обработчик методов.
        re_path(r'^post_create_community$', require_http_methods(['POST'])(views.post_create_community)),
        re_path(r'^delete_community$', require_http_methods(['DELETE'])(views.delete_community)),
    ])),





    # TODO Система авторизации, регистрации, выход из системы
    path('api/signup/', UserRegistrationView.as_view(), name='signup'),
    path('api/signin/', UserAuthenticationView.as_view(), name='signin'),
    path('api/signout/', UserSignoutView.as_view(), name='signout'),
]
