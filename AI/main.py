from question_answer import Core
import sys

data = [
    {'question': 'Привет',
     'answer': 'Привет'},
    {'question': 'Как дела?',
     'answer': 'Нормально.'},
    {'question': 'Как дела? Что делаешь?',
     'answer': 'Выполняю домашнее задание.'},
    {'question': 'Какое количество фруктов и овощей необходимо потреблять в день?',
     'answer': 'Рекомендуется потреблять не менее 400 граммов фруктов и овощей в день.'},
    {'question': 'Какое количество воды необходимо выпивать в день для поддержания здоровья?',
     'answer': 'Рекомендуется выпивать не менее 2 литров воды в день.'}
]

bot = Core()
# bot.train(data=data)
while True:
    question = input('>')
    print(bot.speak(question=question))

# import time
#
# def training_animation():
#     for i in range(10, 101, 10):
#         time.sleep(0.3)
#         progress_bar = "Обучение модели: [{}{}] {}%".format("=" * int(i / 10), " " * (10 - int(i / 10)), i)
#         sys.stdout.write('\r' + progress_bar)
#         sys.stdout.flush()
#
#
# training_animation()
# training_animation()
# training_animation()
# training_animation()
