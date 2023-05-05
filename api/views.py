from datetime import datetime, timedelta
import jwt
from django.http import JsonResponse
from rest_framework import generics, serializers
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny, IsAuthenticated

from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from api import models
from api.serializers import RegistrationSerializer, TokenObtainPairSerializer


class RegistrationView(APIView):
    permission_classes = [AllowAny]
    serializer_class = RegistrationSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(request.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer


class RestrictedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': 'This is a restricted view!'}, status=status.HTTP_200_OK)


