import os
from .utils import *

DB_URL = os.environ.get("DB_URL", "mongodb://localhost:27017/")

if __name__ == "__main__":
    resume_id = sys.argv[1]

    db = connect_to_db(DB_URL)

    resume_url = get_resume_url(db, resume_id)

    resume_path = download_resume("<gdrive file id>")

    jobDescription = (
        '<dict:{"skills_required":[string], "experience":[string]} from recruiter>'
    )
    data = preprocess(resume_path, jobDescription)

    save_preprocessing_data(db, resume_id, data)

    data = fetch_preprocessing_data(db, resume_id)

    print(resume_url)
    print(data)

    delete_resume_local("sample/local.pdf")
