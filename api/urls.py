from django.contrib import admin
from django.urls import path, include, re_path
from django.views.decorators.http import require_http_methods

from .views import LogoutView, RegisterView, \
    TokenObtainPairWithUserInfoView, TokenRefreshWithUserInfoView

urlpatterns = [
    # Добавляем обработчик несуществующего пути
    # re_path('api/', include([
    #     # Добавляем путь для авторизации + добавляем обработчик методов.
    #     re_path('sign_up', require_http_methods(['POST','GET'])(SignUpView.as_view())),
    #     re_path('sign_in', require_http_methods(['POST'])(SignInView.as_view())),
    #     re_path('sign_out', require_http_methods(['POST'])(SignOutView.as_view())),
    # ])),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/token/', TokenObtainPairWithUserInfoView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshWithUserInfoView.as_view(), name='token_refresh'),
]
