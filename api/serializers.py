# serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_jwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()
jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class UserRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
        )
        payload = jwt_payload_handler(user)
        refresh_token = RefreshToken.for_user(user)
        access_token = RefreshToken.for_user(user).access_token

        return {
            'username': user.username,
            'access_token': access_token,
            'refresh_token': str(refresh_token),
        }


class UserAuthenticationSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(username=username, password=password)

            if not user:
                raise serializers.ValidationError('Invalid username or password.')

            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')

        else:
            raise serializers.ValidationError('Username and password are required.')

        attrs['user'] = user
        return attrs
