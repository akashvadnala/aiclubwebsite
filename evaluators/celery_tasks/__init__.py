from celery import Celery
import os
from db_utils import *
from time import sleep
print("starting celery worker")

BROKER_URL = os.environ.get("BROKER_URL", "amqp://localhost")
DATABASE = os.environ.get("DATABASE", 'mongodb://localhost:27017/')

app = Celery(
    "tasks",
    broker=BROKER_URL,
)
        
@app.task(name="tasks.run_preprocess")
def run_preprocess(submission_id):
    db = connect_to_db(DATABASE)
    submission = get_submission(db, submission_id)
    url = submission["googleDrivePath"]
    localpath = submission["localFilePath"]
    key = url.split("=")[-1]
    downloadFile(key,localpath)
    deleteGdriveFile(key)
    
@app.task(name="tasks.privateDataSet")
def privateDataSet(competeid):
    db = connect_to_db(DATABASE)
    compete = get_dataset(db, competeid)
    url = compete["privateDataSetUrl"]
    localpath = compete["privateDataSetPath"]
    key = url.split("=")[-1]
    downloadFile(key,localpath)
    deleteGdriveFile(key)
    
@app.task(name="tasks.publicDataSet")
def publicDataSet(competeid):
    db = connect_to_db(DATABASE)
    compete = get_dataset(db, competeid)
    url = compete["publicDataSetUrl"]
    localpath = compete["publicDataSetPath"]
    key = url.split("=")[-1]
    downloadFile(key,localpath)
    deleteGdriveFile(key)