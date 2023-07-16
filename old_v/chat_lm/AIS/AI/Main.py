"""
    todo Задача на данный момент. Обучить модель какие существуют сочетания слов.

"""
import threading
import time
from queue import Queue
import nltk


class Human:
    def __init__(self):
        self.head = Head()


class Long_term_memory:
    def __init__(self):
        """
        {
            'tokens': {
                'token':{
                    'id':1
                    'part_of_speech':'VB'
                }
            }
            'connections_of_phrases':[
                'word':{
                    'second_word':tokens.word.id,
                    'associations':[tokens.word.id],
                    'probability':1
                ]
            }
        }
        """
        self.storage = {
            'tokens': {},
            'connections_of_phrases': {}
        }

    def get_token(self, word):
        """
        Возвращает информацию о слове (токене).
        :param word: Слово которое надо искать.
        """
        return self.storage['tokens'][word]

    def new_token(self, word):
        """
        Добавляет информацию о новом слове.
        :param word: Слово которое надо добавить.
        :return: Id слова.
        """
        id_ = len(self.storage['tokens'])
        part_of_speech = nltk.word_tokenize(word)[0][1]
        self.storage['tokens'][word] = {
            'id': id_,
            'part_of_speech': part_of_speech
        }
        return id_

    def search_word_in_phrases(self, word):
        """
        Ищет словосочетание первое слово которое, word.
        :param word: Слово, которое надо найти.
        :return: Возвращает массив объектов словосочетания.
        """
        return [i for i in self.storage['connections_of_phrases'] if i.name == word]

    def add_word_in_phrases(self, word, second_word, associations):
        """
        Добавляет словосочетание.
        :param word: Первое слово.
        :param second_word: Второе слово.
        :param associations: Ассоциации [токены].
        """
        # Добавляем все слова из подаваемых ассоциаций в токены.
        for i in associations:
            word_id = self.get_token(word)
            if not word_id:
                word_id = self.new_token(word)

        # Переводим два подаваемых слова в токены
        word_id = self.get_token(word)
        second_word_id = self.get_token(second_word)
        if not word_id:
            word_id = self.new_token(word)
        if not second_word_id:
            second_word_id = self.new_token(second_word)

        word_in_phrases = self.search_word_in_phrases(word)
        d = [i for i in word_in_phrases if len(set(i['associations']).intersection(set()))]
        self.storage['connections_of_phrases'][word] = {
            'second_word': second_word,
            'associations': associations,
            'probability': 1
        }





class Head:
    def __init__(self):
        self.long_term_memory = Long_term_memory()  # Долговечная память как БД.

        self.wiretapping = Queue()  # Создаем объект очереди

        print('Create ears')
        self.ears = Ears(self.long_term_memory, self.wiretapping)
        print('Create mouth')
        self.mouth = Mouth(self.long_term_memory, self.wiretapping)
        print('Create brain')
        self.brain = Brain(
            long_term_memory=self.long_term_memory,
            wiretapping=self.wiretapping,
            ears=self.ears,
            mouth=self.mouth
        )
        ears = threading.Thread(target=self.ears.start, args=())
        ears.start()
        mouth = threading.Thread(target=self.mouth.start, args=())
        mouth.start()
        brain = threading.Thread(target=self.brain.start, args=())
        brain.start()


class Brain(Head, threading.Thread):
    def __init__(self, long_term_memory, wiretapping, ears, mouth):
        threading.Thread.__init__(self)

        self.long_term_memory = long_term_memory  # Долговечная память как БД.
        self.wiretapping = wiretapping  # Получаем объект очереди

        self.ears = ears
        self.mouth = mouth

    def listen(self):
        while True:
            message = self.wiretapping.get()  # Получаем данные из очереди и обрабатываем их
            self.mouth.speak(message)

    def learning(self):
        pass

    def start(self):
        self.listen()


class Ears(Head, threading.Thread):
    def __init__(self, shared_storage, wiretapping, ):
        threading.Thread.__init__(self)

        self.wiretapping = wiretapping  # Получаем объект очереди

    def listen(self):
        while True:
            text = input("> ")
            self.wiretapping.put(text)  # Помещаем данные в очередь

    def start(self):
        self.listen()


class Mouth(threading.Thread):
    def __init__(self, long_term_memory, wiretapping):
        threading.Thread.__init__(self)
        self.wiretapping = wiretapping

    def speak(self, message):
        print(message)


# создаем экземпляр класса Human и запускаем все функции в нескольких потоках
Human()
