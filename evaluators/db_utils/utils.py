import pymongo
from bson.objectid import ObjectId
import json
import requests
import json
import os
import io
import zipfile
import filetype
from dotenv import dotenv_values
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload


config = dotenv_values(".env")
GOOGLE_KEY = config["GOOGLE_KEY"]
try:
    SERVER_URL = config["SERVER_URL"]
except:
    SERVER_URL = "http://localhost:5000"


def connect_to_db(url):
    try:
        conn = pymongo.MongoClient(url)
        db = conn.aiclub
        print("DB Connected Successfully")
    except Exception as e:
        print("DB Connected failed due to ", e)
    return db


def get_competition(db_conn, competionId):
    competition = db_conn.competitions.find_one({"_id": ObjectId(competionId)})
    if competition is None:
        raise ValueError(
            "Could not find an application with the given application_id")
    return competition


def get_submission(db_conn, usersubmissionId):
    submission = db_conn.usersubmissions.find_one(
        {"_id": ObjectId(usersubmissionId)})
    if submission is None:
        raise ValueError(
            "Could not find an application with the given application_id")
    return submission


def get_evaluation(db_conn, evaluationId):
    evaluation = db_conn.evaluations.find_one({"_id": ObjectId(evaluationId)})
    if evaluation is None:
        raise ValueError(
            "Could not find an application with the given application_id")
    return evaluation

def updateCompetition(db_conn, competeId, data):
    compete = db_conn.competitions
    compete.find_one_and_update(
        {"_id": ObjectId(competeId)}, {
            "$set": data}
    )

def saveScores(db_conn, usersubmissionId, competeId, teamId, publicScore, privateScore):
    submission = db_conn.usersubmissions
    submission.find_one_and_update(
        {"_id": ObjectId(usersubmissionId)}, {
            "$set": {"publicScore": publicScore, "privateScore": privateScore}}
    )
    allUserSubmissions = db_conn.usersubmissions.find(
        {"compete": ObjectId(competeId), "team": ObjectId(teamId)})
    publicScoreList = []
    privateScoreList = []
    for userSubmission in allUserSubmissions:
        publicScoreList.append(float(userSubmission["publicScore"]))
        privateScoreList.append(float(userSubmission["privateScore"]))
    maxPublicScore = max(publicScoreList)
    maxPrivateScore = max(privateScoreList)
    db_conn.leaderboards.find_one_and_update(
        {"compete": ObjectId(competeId), "team": ObjectId(teamId)}, {
            "$set": {"maxPublicScore": maxPublicScore, "maxPrivateScore": maxPrivateScore}}
    )


def deleteGdriveFile(key):
    info = json.loads(GOOGLE_KEY)
    credentials = service_account.Credentials.from_service_account_info(info)
    DRIVE = build('drive', 'v3', credentials=credentials)
    file = DRIVE.files().delete(fileId=key).execute()
    print("File deleted from Gdrive successfully")


def downloadFile(file_id, fileDir):
    basedir = os.path.join(*fileDir.split("/")[:-1]) + "/"
    try:
        if not os.path.exists(basedir):
            os.mkdir(basedir)
    except Exception:
        os.mkdir(basedir)
    info = json.loads(GOOGLE_KEY)
    credentials = service_account.Credentials.from_service_account_info(info)
    DRIVE = build('drive', 'v3', credentials=credentials)
    request = DRIVE.files().get_media(fileId=file_id)
    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    while done is False:
        status, done = downloader.next_chunk()
        print("Download %d%%." % int(status.progress() * 100))
    fh.seek(0)
    with open(fileDir, 'wb') as f:
        f.write(fh.read())
    print("{} saved to {}".format(fileDir.split("/")[-1], fileDir))


def extract_zip(path, r_path="sample/"):
    try:
        if not os.path.exists(r_path):
            os.mkdir(r_path)
    except Exception:
        os.mkdir(r_path)

    print("Extracting Content!")

    zip = zipfile.ZipFile(path, "r")
    zip.extractall(r_path)

    print("Files extracted successfully")

    files = filter(lambda f: f.endswith(".pdf"), zip.namelist())

    files = [
        os.path.join(r_path, f)
        for f in files
        if filetype.guess(os.path.join(r_path, f)) == filetype.types[49]
    ]

    return files


def deleteLocalFile(path):
    if os.path.exists(path):
        if os.path.isdir(path):
            os.rmdir(path)

        elif os.path.isfile(path):
            os.remove(path)
        print("Local data deleted from {}".format(path))
    else:
        raise FileNotFoundError(
            "The File/Folder you are trying to remove does not exist! Please try a different path!"
        )
