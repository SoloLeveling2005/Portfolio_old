import array
import re

from django.db import models


# Create your models here.

class Token(models.Model):
    title = models.CharField(max_length=255)
    token = models.CharField(max_length=255, unique=True)

    @classmethod
    def new_token(cls, title: str, token: str):
        if not Token.objects.filter(token=token).exists():
            cls.objects.create(title=title, token=token)

    @classmethod
    def get_token_by_title(cls, title):
        return cls.objects.get(title=title).token

    @classmethod
    def get_communication_where_this_token(cls, token):
        return Communication.objecs.filter(token=token)


class Last_communication(models.Model):
    number = models.BigIntegerField()




class Communication(models.Model):
    communication_number = models.BigIntegerField()
    token = models.ForeignKey(Token, on_delete=models.CASCADE)

    @classmethod
    def new_communication(cls, text: str, tokens_ru: array):
        # Создаем id связи
        tokens = [Token.get_token_by_title(title=token_ru) for token_ru in tokens_ru]
        try:
            number = Last_communication.objects.first()
        except Exception as e:
            Last_communication.objects.create(number=1)
            number = Last_communication.objects.first()
        [Communication.new_token_communication(token=token, last_communication_number=number) for token in tokens]
        number.number += 1
        number.save()
        text_array = re.findall(r'[\s.,?!;:]+|[^\w\s]+', text)
        [Word.add_word(word=word, communication_number=number) for word in text_array]

    @classmethod
    def new_token_communication(cls, token: str, last_communication_number: int):
        cls.objects.create(
            communication_number=last_communication_number,
            token=token
        )


class Word(models.Model):
    communication_number = models.ForeignKey(Communication, on_delete=models.CASCADE)
    last_word = models.CharField(max_length=255)
    word = models.CharField(max_length=255)

    @classmethod
    def add_word(cls, communication_number, word: str):
        last_word = None
        if Word.objects.filter(communication_number=communication_number, word=word).exists():
            last_word = Word.objects.get(communication_number=communication_number, last_word=word).word

        cls.objects.create(
            communication_number=communication_number,
            word=word,
            last_word=last_word
        )

    @classmethod
    def next_word(cls, word):
        return cls.objects.get(last_word=word)
