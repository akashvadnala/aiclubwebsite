from celery import Celery
import os
from time import sleep
print("starting celery worker")

BROKER_URL = os.environ.get("BROKER_URL", "amqp://localhost")

app = Celery(
    "tasks",
    broker=BROKER_URL,
)

@app.task
def add(task):
    for i in range(10):
        sleep(10)
        print(i, f" :Task-{task}")
