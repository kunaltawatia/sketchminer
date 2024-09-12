FROM node:20-alpine AS frontend

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .

RUN npm run build

FROM python:3.11-slim

WORKDIR /app

# cv2 dependencies
RUN apt-get update && apt-get install libgl1-mesa-glx libglib2.0-0 -y

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY image_processing ./image_processing
COPY backend ./backend
COPY --from=frontend /app/build /app/backend/build

EXPOSE 8000

CMD ["gunicorn", "-b", "0.0.0.0:8000", "backend.server:app"]
