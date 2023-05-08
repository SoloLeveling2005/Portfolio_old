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
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from api import models
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import User
from .serializers import UserSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer


class LogoutView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        # Просто верните успешный ответ, чтобы выйти из системы
        return Response(status=status.HTTP_200_OK)


class TokenObtainPairWithUserInfoView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer


class TokenRefreshWithUserInfoView(TokenRefreshView):
    serializer_class = TokenObtainPairSerializer
