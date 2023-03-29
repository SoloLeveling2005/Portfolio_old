from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer
from chatterbot.storage import SQLStorageAdapter




# Создание экземпляра бота
chatbot = ChatBot('my_bot', storage_adapter='chatterbot.storage.SQLStorageAdapter',
              database_uri='postgresql://username:password@localhost:5432/portfolio_ai')


trainer = ListTrainer(chatbot)
trainer.train([
    "Hi",
    "Welcome, friend 🤗",
])


print('end learning')