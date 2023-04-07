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
    print('ok')
        
@app.task(name="tasks.run_preprocess")
def run_preprocess(application_id):
    print(application_id)