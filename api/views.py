from datetime import datetime, timedelta
import jwt
from django.contrib.auth.views import LogoutView
from django.http import JsonResponse
from rest_framework import generics, serializers
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny, IsAuthenticated

from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from api import models
from api.serializers import RegistrationSerializer, TokenObtainPairSerializer


# Контроллер для регистрации пользователя
class RegistrationView(APIView):
    permission_classes = [AllowAny]
    serializer_class = RegistrationSerializer

    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            print(request.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("Ошибка при создании пользователя:",e)
            return Response({"User already exists"}, status=status.HTTP_400_BAD_REQUEST)

#
class AuthorizationView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer


class RestrictedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Обработка GET-запроса
        return Response({'message': 'This is a restricted view for GET requests!'})


# Контроллер для выхода из системы
class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data['refresh_token']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)