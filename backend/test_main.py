from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_chat_endpoint_security():
    # Test valid chat
    response = client.post(
        "/api/chat",
        json={
            "message": "Hello",
            "history": [],
            "context": {"examMode": False}
        }
    )
    assert response.status_code == 200
    assert "response" in response.json()

def test_insights_endpoint():
    # Test insights generation
    response = client.post(
        "/api/insights",
        json={"examMode": True}
    )
    assert response.status_code == 200
    assert "currentStatus" in response.json()
