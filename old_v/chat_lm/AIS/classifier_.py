import array

from textblob.classifiers import NaiveBayesClassifier
import pickle
import os


class Classificator:
    """
    Классификатор текста. \n
    - Имеет возможность создание, обучение и использование модели классификатора. \n
    - По умолчанию при создании экземпляра данного класса, классификатор сам создаст себя и будет пустым. \n
    - Обучить и дообучить его можно с помощью метода trainer. \n
    - Если вы хотите сохранить свою модель используйте метод save_model. \n
    - После сохранение модели вы можете загрузить его с помощью метода load_model. \n
    """

    def __init__(self, path: str = './', name: str = 'classifier'):
        """
        :param path: Путь где лежит или будет лежать модель. По умолчанию в том же месте где создается Classificator.
        :param name: Название модели. По умолчанию: classifier.
        """
        self.path = path
        self.name = name + ".pickle"

        self.train = []
        self.classifier = NaiveBayesClassifier(self.train)

    def trainer(self, data: array):
        """
        Тренер классификатора.
        :param data: Массив содержащий данные для обучения, пример:
        [('текст.', 'тип_текста'),]
        """
        self.classifier.update(data)

    def tell(self, text):
        response = self.classifier.prob_classify(text)
        return response

    def load_model(self):
        with open(self.path + self.name, 'rb') as f:
            self.classifier = pickle.load(f)

    def save_model(self):
        with open(self.path + self.name, 'wb') as f:
            pickle.dump(self.classifier, f)


#
train = [
    ('Кто такой Напалеон?', 'Вопрос'),
    ('Тетрадь это', 'Вопрос'),
    ('Что такое Земля', 'Вопрос'),
    ('Машина - это', 'Вопрос'),
    ('Привет. Как дела?', 'Приветствие с вопросом.'),
    ('Здравствуй. Что делаешь?', 'Приветствие с вопросом.'),
    ('Салам. Что такое Земля', 'Приветствие с вопросом.'),
    ('Привет. Тетрадь это', 'Приветствие с вопросом.'),
    ('Пока.', 'Прощание'),
    ('До встречи.', 'Прощание'),
]
# classifire = Classificator()
# classifire.trainer(train)
# print(classifire.tell(' Что такое тетрадь?').max())

# prob_dist = cl.prob_classify("Hello.")
# print(prob_dist.prob("Приветствие"))
