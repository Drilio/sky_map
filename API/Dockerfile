FROM python:3.14.2-alpine3.23

WORKDIR /usr/src/app

RUN pip install --upgrade pip
COPY ./app/requirements.txt .
RUN pip install -r requirements.txt

EXPOSE 8000

# optional for dev; will be overridden by the bind mount anyway
COPY ./app .

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
