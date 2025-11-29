from fastapi.testclient import TestClient
from app.main import app
import time

print("Initializing TestClient...")
start = time.time()
try:
    with TestClient(app) as client:
        print(f"Startup took {time.time() - start:.2f}s")
        response = client.get("/")
        print("Response:", response.json())
except Exception as e:
    print(f"Error: {e}")
