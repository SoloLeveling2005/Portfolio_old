# instantiate sentence fusion model
from transformers import EncoderDecoderModel, AutoTokenizer

sentence_fuser = EncoderDecoderModel.from_pretrained("google/roberta2roberta_L-24_discofuse", c)
tokenizer = AutoTokenizer.from_pretrained("google/roberta2roberta_L-24_discofuse", c)

input_ids = tokenizer(
    "This is the first sentence. This is the second sentence.", add_special_tokens=False, return_tensors="pt"
).input_ids

outputs = sentence_fuser.generate(input_ids)

print(tokenizer.decode(outputs[0]))