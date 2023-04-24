from datetime import datetime, timedelta
import jwt
import requests
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import render
import api.models as api_model
from rest_framework.authtoken.models import Token
from rest_framework import generics, serializers
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token

from api import models


# Create your views here.


def sign_in(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            # Выпуск JWT токена с истечением через 1 день
            token = jwt.encode({'user_id': user.id, 'exp': datetime.utcnow() + timedelta(days=1)}, 'secret_key')
            return JsonResponse({'token': token.decode('UTF-8')})
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)


class SignUpView(APIView):
    serializer_class = serializers.ModelSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        biography = request.data.get('biography')
        user = models.User.new_user(username=username, password=password, biography=biography)
        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        else:
            return Response({'error': 'User already exists'}, status=status.HTTP_409_CONFLICT)


class SignInView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class SignOutView(APIView):
    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response({'message': 'User signed out'})


def sign_up(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        email = request.POST.get('email')
        # Создание нового пользователя в БД Django
        user = api_model.User.objects.create_user(username, email, password)
        # Выпуск JWT токена с истечением через 1 день
        token = jwt.encode({'user_id': user.id, 'exp': datetime.utcnow() + timedelta(days=1)}, 'secret_key')
        return JsonResponse({'token': token.decode('UTF-8')})
