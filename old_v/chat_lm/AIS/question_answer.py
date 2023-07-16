import concurrent.futures
import sqlite3
from typing import List
import sys
import time
from nltk.tokenize import sent_tokenize, word_tokenize
from colorama import Fore, Style
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize
import string
from pymystem3 import Mystem
from nltk.corpus import stopwords
import nltk
from concurrent.futures import ThreadPoolExecutor, as_completed

# Загружаем стоп слова для фильтрации предложений
nltk.download('stopwords')


class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    SUCCESS = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


class Core:
    def __init__(self, name: str = "ChatBot", path: str = "./"):
        self.name = name
        self.path = path
        self.answer_data = []

        self.lemmatizer = Mystem()
        self.translator = str.maketrans('', '', string.punctuation)
        self.stop_words = set(stopwords.words('russian'))

        # create db
        self.bot = sqlite3.connect(f"{path}{name}.db")
        self.bot_cursor = self.bot.cursor()

        # create tables
        self.bot_cursor.executescript("""
                CREATE TABLE IF NOT EXISTS answers(
                    id INTEGER PRIMARY KEY,
                    answer TEXT,
                    question_length INTEGER
                );
                CREATE TABLE IF NOT EXISTS question_tokens(
                    id INTEGER PRIMARY KEY,
                    token VARCHAR(150),
                    answer_id INT,
                    FOREIGN KEY (answer_id) REFERENCES answers(id)
                );
            """)

        print(f"{bcolors.SUCCESS}Удачный запуск!{bcolors.ENDC}")

    def speak(self, question: str = ""):
        """
        При ответе смотрим на:
         - количество совпадений токенов.
         - количество слов в предложении.
         -
        :param question:
        :return:
        """
        # очищаем прошлый запрос
        self.answer_data = []

        # Вытаскиваем все токены с вопроса
        question_tokens = [i for i in [
            self.lemmatizer.lemmatize(word)[0] for word in [
                word for word in word_tokenize(question.translate(self.translator))
                if word.lower() not in self.stop_words
            ]
        ]]

        # Получаем всевозможные совпадения с токенами
        with ThreadPoolExecutor(max_workers=4) as executor:
            future_results = [executor.submit(self.get_token_on_question, question_token) for question_token in
                              question_tokens]
        results = []
        for future in concurrent.futures.as_completed(future_results):
            result = future.result()
            results.append(result)

        # Вычисляем самый подходящий ответ (id key)
        counts = {}
        for item in self.answer_data:
            count = counts.get(item[2], 0)
            counts[item[2]] = count + 1
        max_key = max(counts.items(), key=lambda x: x[1])[0]

        # Вытаскиваем ответ
        response = self.bot_cursor.execute(f"SELECT answer FROM answers WHERE id={max_key}")
        response = response.fetchone()
        return response[0]

    def train(self, data):
        """
        :param data: [{'question':'', 'answer':''},{'question':'', 'answer':''}}]
        :return: Тренировка модели.
        """
        # Режем массив вопросов
        for one_data in data:
            # print(len(one_data['question']))
            # print(one_data['answer'])
            answer = self.bot_cursor.execute(f"""
                            INSERT INTO answers (answer, question_length) VALUES
                                ('{one_data['answer']}', {len(one_data['question'])})
                        """)
            answer_id = answer.lastrowid
            self.write_in_db_tokens(data=one_data, primary_key=answer_id)
        self.bot.commit()

        print(f"{bcolors.SUCCESS}Тренировка прошла успешно!{bcolors.ENDC}")

    def write_in_db_tokens(self, data, primary_key):
        self.training_animation()
        data = data['question']
        result = [
            self.bot_cursor.execute(f"""
                    INSERT INTO question_tokens(token,answer_id) VALUES
                        ("{i}", {primary_key})
                """)
            for i in [
                self.lemmatizer.lemmatize(word)[0] for word in [
                    word for word in word_tokenize(data.translate(self.translator))
                    if word.lower() not in self.stop_words
                ]
            ]
        ]

    @staticmethod
    def training_animation():
        for i in range(10, 101, 10):
            time.sleep(0.3)
            progress_bar = "Обучение модели: [{}{}] {}%".format("=" * int(i / 10), " " * (10 - int(i / 10)), i)
            sys.stdout.write('\r' + progress_bar)
            sys.stdout.flush()
        print("")

    def __del__(self):
        # закрываем соединение с базой данных
        self.bot.close()

    def get_token_on_question(self, question_token):
        conn = sqlite3.connect(f"{self.path}{self.name}.db")  # создаем соединение с БД
        c = conn.cursor()  # создаем курсор
        response = c.execute(f"SELECT * FROM question_tokens WHERE token='{question_token}'")  # выполняем запрос
        self.answer_data = [*self.answer_data, *response.fetchall()]
