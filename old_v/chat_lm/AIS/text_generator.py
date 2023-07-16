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
    def __init__(self, name: str = "TextGenerator", path: str = "./"):
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
        self.bot_cursor.execute("""
                CREATE TABLE IF NOT EXISTS dependencies(
                    id INTEGER PRIMARY KEY,
                    word VARCHAR(50)
                    question_length INTEGER,
                    last_word_id INTEGER,
                    FOREIGN KEY (last_word_id) REFERENCES tokens(id)
                );
                CREATE TABLE IF NOT EXISTS tokens(
                    id INTEGER PRIMARY KEY,
                    token VARCHAR(150),
                    dependencies INT,
                    FOREIGN KEY (answer_id) REFERENCES answers(id)
                );
            """)

        print(f"{bcolors.SUCCESS}Удачный запуск!{bcolors.ENDC}")

    def train(self, text):
        for sentence in text.split('.'):
            for word in sentence:
                pass

