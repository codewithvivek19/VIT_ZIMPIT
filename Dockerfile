# Use the official Node image to build the React app
FROM node:16 AS build

WORKDIR /app

# Copy the frontend source files
COPY frontend/package*.json ./
COPY frontend/ ./

# Install dependencies and build the frontend
RUN npm install
RUN npm run build

# Use the official Python image for the backend
FROM python:3.12-slim

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the built frontend files to the backend static folder
COPY --from=build /app/build /app/frontend/build

# Copy the backend source files
COPY backend /app/backend

WORKDIR /app/backend

# Run the backend
CMD ["python", "main.py"]
