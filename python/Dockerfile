FROM python:3.12-slim

RUN apt-get update && apt-get install -y git

RUN mkdir -p /data/huggingface && chmod -R 777 /data/huggingface
ENV HF_HOME=/data/huggingface

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
