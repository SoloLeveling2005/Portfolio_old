# serializers.py
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User


# Регистрация пользователя (сериализатор)
class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'biography_small',)

    def create(self, validated_data):
        # Записываем пароль в переменную password и удаляем его их массива
        password = validated_data.pop('password')

        user = User.new_user(username=validated_data.username, password=password,
                             biography=validated_data.biography_small)
        return user


# Выдача токена, авторизация
class TokenObtainPairSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        # Проверка на существование пользователя.
        try:
            user = User.objects.get(username=username)
        except Exception as e:
            print(e)
            raise serializers.ValidationError('User with this username does not exist')

        # Проверка на совпадение пароля
        if not user.check_password(password):
            raise serializers.ValidationError('Incorrect password')

        # Создаем refresh и access токен пользователя
        refresh = RefreshToken.for_user(user)

        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

        return data
