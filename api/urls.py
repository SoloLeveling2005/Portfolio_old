from django.contrib import admin
from django.urls import path, include, re_path
from django.views.decorators.http import require_http_methods

from .views import UserRegistrationView, UserAuthenticationView, \
    UserSignoutView

urlpatterns = [
    # Добавляем обработчик несуществующего пути
    # re_path('api/', include([
    #     # Добавляем путь для авторизации + добавляем обработчик методов.
    #     re_path('sign_up', require_http_methods(['POST','GET'])(SignUpView.as_view())),
    #     re_path('sign_in', require_http_methods(['POST'])(SignInView.as_view())),
    #     re_path('sign_out', require_http_methods(['POST'])(SignOutView.as_view())),
    # ])),





    # TODO Система авторизации, регистрации, выход из системы
    path('api/register/', UserRegistrationView.as_view(), name='user-registration'),
    path('api/login/', UserAuthenticationView.as_view(), name='user-login'),
    path('api/logout/', UserSignoutView.as_view(), name='user-logout'),
]
