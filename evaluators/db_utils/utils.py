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


def get_dataset(db_conn, competionId):
    competition = db_conn.competitions.find_one({"_id": ObjectId(competionId)})
    if competition is None:
        raise ValueError(
            "Could not find an application with the given application_id")
    return competition

def get_submission(db_conn, usersubmissionId):
    submission = db_conn.usersubmissions.find_one({"_id": ObjectId(usersubmissionId)})
    if submission is None:
        raise ValueError(
            "Could not find an application with the given application_id")
    return submission


def deleteGdriveFile(key):
    info = json.loads(GOOGLE_KEY)
    credentials = service_account.Credentials.from_service_account_info(info)
    DRIVE = build('drive', 'v3', credentials=credentials)
    file = DRIVE.files().delete(fileId=key).execute()
    print("File deleted from Gdrive successfully")


def downloadFile(file_id, fileDir):
    basedir = fileDir.split("/")[0] + "/"
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


def delete_resume_local(path):
    if os.path.exists(path):

        if os.path.isdir(path):
            os.rmdir(path)

        elif os.path.isfile(path):
            os.remove(path)
        print("Local copy of data deleted from {}".format(path))
    else:
        raise FileNotFoundError(
            "The File/Folder you are trying to remove does not exist! Please try a different path!"
        )
    pass
