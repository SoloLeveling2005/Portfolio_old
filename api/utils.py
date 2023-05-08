from datetime import timedelta
from django.conf import settings
from django.utils import timezone
from rest_framework_simplejwt.tokens import Token
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken


def generate_access_token(user):
    access_token_lifetime = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']
    access_token = Token(access_token_lifetime)
    access_token['user_id'] = user.id
    access_token['username'] = user.username
    access_token['biography_small'] = user.biography_small
    return str(access_token)


def verify_access_token(token):
    try:
        access_token = Token(token)
        expire_at = access_token['exp']
        if expire_at < timezone.now().timestamp():
            raise InvalidToken('Token has expired')
    except TokenError as e:
        raise InvalidToken(str(e))
    return access_token
