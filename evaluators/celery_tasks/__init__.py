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
        
@app.task(bind=True,autoretry_for=(Exception,),retry_kwargs={"max_retries":7,"countdown":5}, name="tasks.run_preprocess")
def run_preprocess(application_id):
    print("application_id",application_id)
    
@app.task(name="tasks.privateDataSet")
def privateDataSet(competeid):
    print('compete',competeid)
    
@app.task(name="tasks.publicDataSet")
def publicDataSet(competeid):
    print('compete',competeid)