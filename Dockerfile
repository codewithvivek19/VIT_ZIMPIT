# Use the official lightweight Python image.
# https://hub.docker.com/_/python
FROM python:3.12-slim

# Allow statements and log messages to be immediately visible
ENV PYTHONUNBUFFERED True

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application
COPY . /app

WORKDIR /app

# Run the application
CMD ["python", "main.py"]
