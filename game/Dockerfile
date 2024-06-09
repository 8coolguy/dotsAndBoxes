FROM python:3.10-slim-buster
COPY requirements.txt requirements.txt
COPY . .

# RUN pip install --upgrade pip
RUN pip --no-cache-dir install -r requirements.txt

CMD ["flask", "run", "--host", "0.0.0.0"]
EXPOSE 5000
