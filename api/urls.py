from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.decorators.http import require_http_methods
from rest_framework import permissions
from rest_framework_swagger.views import get_swagger_view

from django_settings import settings
from . import views
from rest_framework_simplejwt import views as jwt_views

from drf_yasg.views import get_schema_view
from drf_yasg import openapi

description = """
Hubr API Documentation
======================

Welcome to the Hubr API documentation. Hubr is a platform for developers to share and discover open-source projects.

Authentication
---------------
To access certain endpoints, authentication is required. You should include an Authorization header in your requests with a valid token.


Error Handling
--------------
The API may return the following HTTP status codes:
- 200 OK: Request successful.
- 201 Created: Resource created successfully.
- 400 Bad Request: Invalid request data or parameters.
- 401 Unauthorized: Authentication required or invalid token.
- 403 Forbidden: Access to the requested resource is forbidden.
- 404 Not Found: Requested resource not found.
- 500 Internal Server Error: An unexpected error occurred.

Contact
-------
If you have any questions or need assistance, please contact us at support@hubr.com.

"""

schema_view = get_schema_view(
   openapi.Info(
      title="HubAnywhere API",
      default_version='v1',
      description=description,
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

urlpatterns = [
   re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
   re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
   re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    # Добавляем обработчик несуществующего пути
    # re_path('api/', include([
    #     # Добавляем путь для авторизации + добавляем обработчик методов.
    #     re_path(r'^post_create_community$', require_http_methods(['POST'])(views.create_community)),
    #     re_path(r'^delete_community$', require_http_methods(['DELETE'])(views.delete_community)),
    # ])),


    # Работа с пользователем

    path('users/get_user/<int:user_id>', views.get_user, name='get_user'),
    path('users/user_about/<int:user_id>', views.user_about, name='user_about'),

    path('users/update_user_avatar', views.update_user_avatar, name='update_user_avatar'),
    path('users/update_user_profile', views.update_user_profile, name="update_user_profile"),
    path('users/update_user_additional_information', views.update_user_additional_information,
         name="update_user_additional_information"),

    # Получить всех пользователей, получить друзей, получить запросы в друзья, отправить запрос в друзья, принять запрос в друзья, поиск друзей
    path('users/get_my_friends', views.get_my_friends, name="get_my_friends"),
    path('users/get_find_friends', views.get_find_friends, name="get_find_friends"),
    path('users/create_request_in_friend', views.create_request_in_friend, name="create_request_in_friend"),
    path('users/delete_request_in_friend/<int:subscriber_id>', views.delete_request_in_friend, name="delete_request_in_friend"),
    path('users/get_requests_to_friend', views.get_requests_to_friend, name="get_requests_to_friend"),
    path('users/create_new_friend_subscriptions', views.create_new_friend_subscriptions, name="create_new_friend_subscriptions"),
    path('users/delete_friend_subscriptions/<int:subscriber_id>', views.delete_friend_subscriptions, name="delete_friend_subscriptions"),
    path('users/post_add_user_in_blacklist', views.post_add_user_in_blacklist, name="post_add_user_in_blacklist"),








    # Работа с сообществом
    path('community/get_community/<int:community_id>', views.get_community, name="get_community"),
    path('community/create_community', views.create_community, name="create_community"),
    path('community/get_user_communities', views.get_user_communities, name="get_user_communities"),
    path('community/get_find_communities', views.get_find_communities, name="get_find_communities"),
    path('community/get_about_community/<int:community_id>', views.get_about_community, name="get_about_community"),
    path('community/create_community_role', views.create_community_role, name="create_community_role"),
    path('community/delete_community_role/<int:community_id>/<str:role_title>', views.delete_community_role, name="delete_community_role"),




    # TODO Система авторизации, регистрации, выход из системы
    path('signup', views.UserRegistrationView.as_view(), name='signup'),
    path('signin', views.UserAuthenticationView.as_view(), name='signin'),
    path('signout', views.UserSignoutView.as_view(), name='signout'),
    path('refresh_token', jwt_views.TokenRefreshView.as_view(), name='refresh_token'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
