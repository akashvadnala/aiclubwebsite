FROM python:3.8.3

ENV PYTHONWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# set working directory to /app/
WORKDIR /app

# add requirements.txt to the image
ADD requirements.txt requirements.txt

# install python dependencies
RUN pip install -r requirements.txt

# copy 
COPY . ./

RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
