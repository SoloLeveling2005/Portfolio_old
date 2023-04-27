import json
import requests

API_TOKEN = "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"


def query(payload='', parameters=None, options={'use_cache': False}):
    API_URL = "https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B"
    headers = {"Authorization": f"Bearer {API_TOKEN}"}
    body = {"inputs": payload, 'parameters': parameters, 'options': options}
    response = requests.request("POST", API_URL, headers=headers, data=json.dumps(body))
    try:
        response.raise_for_status()
    except requests.exceptions.HTTPError:
        return "Error:" + " ".join(response.json()['error'])
    else:
        return response.json()[0]['generated_text']


parameters = {
    'max_new_tokens': 50,  # number of generated tokens
    'temperature': 0.7,  # controlling the randomness of generations
    'end_sequence': "###"  # stopping sequence for generation
}
prompt = """
H: Hello.
B: Hello.
###
H: How are you?
B: I'm all good. And you?
###
H: What do you do?
B: I'm a writer.
###
H: That's cool. How old are you?
"""  # few-shot prompt

data = query(prompt, parameters)
print(data)