from django.contrib import admin
from django.urls import path, include, re_path
from django.views.decorators.http import require_http_methods
from . import views

urlpatterns = [
    # Добавляем обработчик несуществующего пути
    re_path('api/', include([
        # Добавляем путь для авторизации + добавляем обработчик методов.
        re_path(r'^post_create_community$', require_http_methods(['POST'])(views.create_community)),
        re_path(r'^delete_community$', require_http_methods(['DELETE'])(views.delete_community)),
    ])),





    # TODO Система авторизации, регистрации, выход из системы
    path('api/signup/', views.UserRegistrationView.as_view(), name='signup'),
    path('api/signin/', views.UserAuthenticationView.as_view(), name='signin'),
    path('api/signout/', views.UserSignoutView.as_view(), name='signout'),
]
