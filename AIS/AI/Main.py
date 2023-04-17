"""
    todo Задача на данный момент. Обучить модель какие существуют сочетания слов.

"""
import threading
import time
from queue import Queue


class Human:
    def __init__(self):
        self.head = Head()


class Long_term_memory:
    def __init__(self):
        """
        {
            'key':
        }
        """
        self.storage = {}

    def set_value(self, key, value):
        self.storage[key] = value

    def get_value(self, key):
        return self.storage.get(key)


class Head:
    def __init__(self):
        self.long_term_memory = Long_term_memory()  # Долговечная память как БД.

        self.wiretapping = Queue()  # Создаем объект очереди

        print('Create ears')
        self.ears = Ears(self.long_term_memory, self.wiretapping)
        print('Create mouth')
        self.mouth = Mouth(self.long_term_memory)
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

    def run(self):
        while True:
            data = self.wiretapping.get()  # Получаем данные из очереди и обрабатываем их
            print(data)

    def start(self):
        self.run()


class Ears(Head, threading.Thread):
    def __init__(self, shared_storage, wiretapping, ):
        threading.Thread.__init__(self)

        self.wiretapping = wiretapping  # Получаем объект очереди

    def listen(self):
        while True:
            text = input( "> ")
            self.wiretapping.put(text)  # Помещаем данные в очередь

    def start(self):
        self.listen()


class Mouth(threading.Thread):
    def __init__(self, long_term_memory):
        threading.Thread.__init__(self)

    def speak(self, message):
        print(message)


# создаем экземпляр класса Human и запускаем все функции в нескольких потоках
Human()
