FROM python:3.11-slim

WORKDIR /app

COPY services/element-145/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY services/element-145 ./

EXPOSE 8145
ENV E145_ENV=production
ENV E145_HOST=0.0.0.0
ENV E145_PORT=8145

CMD ["uvicorn", "element145.main:app", "--host", "0.0.0.0", "--port", "8145"]
