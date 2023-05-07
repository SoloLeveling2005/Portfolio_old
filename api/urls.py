from django.contrib import admin
from django.urls import path, include, re_path
from django.views.decorators.http import require_http_methods

from .views import RegistrationView, AuthorizationView, LogoutView, RestrictedView
from api import views

urlpatterns = [
    # Добавляем обработчик несуществующего пути
    # re_path('api/', include([
    #     # Добавляем путь для авторизации + добавляем обработчик методов.
    #     re_path('sign_up', require_http_methods(['POST','GET'])(SignUpView.as_view())),
    #     re_path('sign_in', require_http_methods(['POST'])(SignInView.as_view())),
    #     re_path('sign_out', require_http_methods(['POST'])(SignOutView.as_view())),
    # ])),
    path('api/register', RegistrationView.as_view(), name='register'),
    path('api/auth', AuthorizationView.as_view(), name='authorization'),
    path('api/logout', LogoutView.as_view(), name='logout'),
    path('api/restricted', RestrictedView.as_view(), name='restricted'),
]
