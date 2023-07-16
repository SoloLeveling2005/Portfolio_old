from django.shortcuts import render
import concurrent.futures
# import sqlite3
# from typing import List
# import sys
# import time
# from nltk.tokenize import sent_tokenize, word_tokenize
# from colorama import Fore, Style
# from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize
import string
from pymystem3 import Mystem
from nltk.corpus import stopwords
import nltk
from concurrent.futures import ThreadPoolExecutor, as_completed
import chat_lm.models as ai_models
# from chat_lm.models import *

translator = str.maketrans('', '', string.punctuation)
lemmatizer = Mystem()

stop_words = set(stopwords.words('russian'))
answer_data = []
# Create your views here.

class Teacher:

    def train(self, text: str):
        text_tokens = [i for i in [
            lemmatizer.lemmatize(word)[0] for word in [
                word for word in word_tokenize(text.translate(translator))
                if word.lower() not in stop_words
            ]
        ]]
        ai_models.Communication.new_communication(tokens_ru=text_tokens, text=text)

    def speak(self, text: str):
        # todo вытаскиваем токены поданного текста
        text_tokens = [i for i in [
            lemmatizer.lemmatize(word)[0] for word in [
                word for word in word_tokenize(text.translate(translator))
                if word.lower() not in stop_words
            ]
        ]]

        # todo запускаем в четырех рабочих, которые ищет связи в которых есть данные токены.
        with ThreadPoolExecutor(max_workers=4) as executor:
            future_results = [executor.submit(self.get_token_text, question_token) for question_token in
                              text_tokens]

        # todo ждем выполнение работы всех четырех рабочих.
        results = []
        for future in concurrent.futures.as_completed(future_results):
            result = future.result()
            results.append(result)

            counts = {}
            for item in answer_data:
                print(item)
                # count = counts.get(item[2], 0)
                # counts[item[2]] = count + 1
            # max_key = max(counts.items(), key=lambda x: x[1])[0]

    def get_token_text(self, token):
        global answer_data
        communications = ai_models.Token.get_communication_where_this_token(token=token)
        answer_data = [*answer_data, *communications]
