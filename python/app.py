import os
import re
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
   CORSMiddleware,
   allow_origins=["*"],
   allow_methods=["*"],
   allow_headers=["*"],
)

class InputText(BaseModel):
   text: str

def clean_text(text: str) -> str:
   text = re.sub(r"[\r\n\t]+", " ", text)
   text = re.sub(r"\s{2,}", " ", text)
   text = text.strip()
   return text

@app.post("/summarize")
async def summarize(input: InputText):
   cleaned_input = clean_text(input.text)
   prompt = f"summarize: {cleaned_input}"

   temp_tokenizer = AutoTokenizer.from_pretrained("sshleifer/distilbart-cnn-12-6")
   input_length = len(temp_tokenizer(prompt)["input_ids"])

   if input_length < 512:
       model_name = "sshleifer/distilbart-cnn-12-6"
   else:
       model_name = "pszemraj/led-large-book-summary"

   tokenizer = AutoTokenizer.from_pretrained(model_name)
   model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

   inputs = tokenizer(
      prompt,
      return_tensors="pt",
      max_length=16384,
      truncation=True,
   )

   summary_ids = model.generate(
      inputs["input_ids"],
      max_length=1024,
      min_length=50,
      length_penalty=2.0,
      num_beams=4,
      early_stopping=True,
   )

   summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
   return summary
