# pull official base image
FROM python:3.14.2-alpine3.23

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip
COPY ./app/requirements.txt .
RUN pip install -r requirements.txt

# expose api port 
EXPOSE 8000

# copy project
COPY ./app .

# launch django server 
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]

