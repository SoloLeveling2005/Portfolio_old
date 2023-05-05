# serializers.py
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User


class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'biography_small',)

    def create(self, validated_data):
        # записываем пароль в переменную password и удаляем его их массива
        password = validated_data.pop('password')

        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class TokenObtainPairSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        try:
            user = User.objects.get(username=username)
        except Exception as e:
            raise serializers.ValidationError('User with this username does not exist')

        if not user.check_password(password):
            raise serializers.ValidationError('Incorrect password')

        refresh = RefreshToken.for_user(user)

        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

        return data
