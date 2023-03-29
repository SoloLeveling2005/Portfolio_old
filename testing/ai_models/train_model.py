from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer

chatbot = ChatBot("Chatpot")

trainer = ListTrainer(chatbot)
exit_conditions = (":q", "quit", "exit")
while True:
    query = input("> ")
    if query in exit_conditions:
        break
    else:
        print(f"🪴 {chatbot.get_response(query)}")



from transformers import pipeline

# Создание экземпляра модели DistilBERT
model = pipeline('text2text-generation', model='distilbert')

# Пример использования модели для рассчета насколько промпт похож на вопрос
# prompt = "What is the capital of France?"
# question = "What is the largest city in Europe?"
# response = model(prompt, question, max_length=1)['generated_text']
# similarity = float(response.strip())
# print(similarity)