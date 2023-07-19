# ПЛАН РАЗРАБОТКИ.
# Была проведена настройка в settings.py.
# Была проведена настройка глобальных путей.
# TODO Реализация API.
# TODO Построение моделей и сигналов.
# TODO Настройка сериализаторов.
# TODO Разработка views.py
# TODO Настраиваем asgi соединение.
# TODO
# TODO

from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.settings import api_settings
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from api.models import User
from api.serializers import UserRegistrationSerializer, UserAuthenticationSerializer


# TODO Реализовать и проверить регистрацию, авторизацию, выход из системы. Реализовать авто тесты.
# TODO Реализовать следующие views:
# TODO * ПОЛЬЗОВАТЕЛЬ:
# TODO * Настройка профиля пользователя.
# TODO * Добавление пользователей в друзья. Вывод списка пользователей и друзей а также раздел рекомендации друзей.
# TODO * Реализовать черный список друзей. Добавить в черный список, удалить из него.
# TODO * СООБЩЕСТВО:
# TODO * Создание и вывод списка сообществ, а также список с рекомендации от друзей. Удаление сообщества.
# TODO * Реализовать настройки сообщества.
# TODO * Добавление пользователей в сообщество. Назначение роли. Бан пользователя.
# ДЕНЬ ВТОРОЙ.
# TODO *
# TODO *
# TODO
# TODO
# TODO
# TODO
# TODO
# TODO
# TODO
# TODO
# TODO
# TODO
# TODO




# TODO Система авторизации, регистрации, выход из системы API (единственное место где происходит какая та магия 😅)


jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = (permissions.AllowAny,)


class UserAuthenticationView(generics.GenericAPIView):
    serializer_class = UserAuthenticationSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh_token = RefreshToken.for_user(user)
        access_token = str(refresh_token.access_token)

        return Response({
            'user_id': user.id,
            'username': user.username,
            'access_token': access_token,
            'refresh_token': str(refresh_token)
        })


class UserSignoutView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            refresh_token = str(request.data.get('refresh_token'))
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response({'detail': 'User successfully signed out.'}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Refresh token not provided.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({'detail': 'An error occurred while signing out.'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserTokenRestoreView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        token = request.data.get('token')
        user_id = request.data.get('user_id')

        if token and user_id:
            user = User.objects.get(id=user_id)
            refresh_token = RefreshToken.for_user(user)
            access_token = str(refresh_token.access_token)
            return Response({
                'user_id': user.id,
                'username': user.username,
                'access_token': access_token,
                'refresh_token': str(token)
            }, status=status.HTTP_200_OK)
        # except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        #     return Response({'detail': 'Invalid token or user_id.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'detail': 'Token and user_id are required.'}, status=status.HTTP_400_BAD_REQUEST)
