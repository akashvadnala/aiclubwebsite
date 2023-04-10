from celery import Celery
import os
from db_utils import *
from time import sleep
print("starting celery worker")
import importlib

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
    teamId = submission["team"]
    competeId = submission["compete"]
    url = submission["googleDrivePath"]
    localpath = submission["localFilePath"]
    key = url.split("=")[-1]
    downloadFile(key,localpath)
    deleteGdriveFile(key)
    compete = get_competition(db, competeId)
    evaluation = get_evaluation(db, compete["evaluation"])
    privateDatalocalpath = compete["privateDataSetPath"]
    publicDatalocalpath = compete["publicDataSetPath"]
    publicScore, privateScore = evaluate_submissions(evaluation["name"],localpath, privateDatalocalpath, publicDatalocalpath)
    saveScores(db, submission_id,competeId,teamId,publicScore, privateScore)
    deleteLocalFile(localpath)

def evaluate_submissions(evaluationFuncName,submissionPath, privateDataPath, publicDataPath):
    MODULE_NAME = "celery_tasks.EvaluationFiles."+str(evaluationFuncName)
    func = importlib.import_module(MODULE_NAME,".")
    # submissionPath = "../" + submissionPath
    # privateDataPath = "../" + privateDataPath
    # publicDataPath = "../" + publicDataPath
    publicScore, privateScore = func.evaluate(submissionPath,privateDataPath,publicDataPath)
    return publicScore, privateScore

@app.task(name="tasks.generateFile")
def generateFile(evaluationId):
    db = connect_to_db(DATABASE)
    evaluation = get_evaluation(db, evaluationId)
    localpath = evaluation["localFilePath"]
    basedir = os.path.join(*localpath.split("/")[:-1]) + "/"
    try:
        if not os.path.exists(basedir):
            os.mkdir(basedir)
    except Exception:
        os.mkdir(basedir)
    localpath = os.path.join(*localpath.split("/")[1:])
    f = open(localpath, "w")
    f.write(evaluation["code"])
    f.close()
    
@app.task(name="tasks.privateDataSet")
def privateDataSet(competeid):
    db = connect_to_db(DATABASE)
    compete = get_competition(db, competeid)
    url = compete["privateDataSetUrl"]
    localpath = compete["privateDataSetPath"]
    key = url.split("=")[-1]
    downloadFile(key,localpath)
    deleteGdriveFile(key)
    
@app.task(name="tasks.publicDataSet")
def publicDataSet(competeid):
    db = connect_to_db(DATABASE)
    compete = get_competition(db, competeid)
    url = compete["publicDataSetUrl"]
    localpath = compete["publicDataSetPath"]
    key = url.split("=")[-1]
    downloadFile(key,localpath)
    deleteGdriveFile(key)