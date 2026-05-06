# Use the official lightweight Python image
FROM python:3.11-slim

# Set the working directory to /app
WORKDIR /app

# Copy the backend code and requirements
COPY backend/ /app/

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 8080 (Cloud Run / Vertex AI Agent Engine requirement)
EXPOSE 8080

# Run the FastAPI server via Uvicorn using the PORT environment variable
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]
