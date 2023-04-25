#!/bin/bash

# run celery worker
celery -A celery_tasks worker --loglevel=INFO --pool=eventlet
