import pytest
from fastapi import UploadFile
import os
import json

def test_root_endpoint(client):
    """Test the root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to UAV Log Viewer API"}

def test_upload_invalid_file(client):
    """Test uploading an invalid file."""
    response = client.post(
        "/api/upload",
        files={"file": ("test.txt", b"test content", "text/plain")}
    )
    assert response.status_code == 400
    assert "Only .bin files are supported" in response.json()["detail"]

def test_upload_valid_file(client, sample_bin_file):
    """Test uploading a valid .bin file."""
    with open(sample_bin_file, "rb") as f:
        response = client.post(
            "/api/upload",
            files={"file": ("test.bin", f, "application/octet-stream")}
        )
    assert response.status_code == 200
    data = response.json()
    assert "log_id" in data
    assert "message" in data
    assert "summary" in data

def test_chat_without_log(client):
    """Test chat endpoint with non-existent log."""
    response = client.post(
        "/api/chat/nonexistent",
        json={"message": "What was the max altitude?"}
    )
    assert response.status_code == 404
    assert "Log file not found" in response.json()["detail"]

def test_chat_with_log(client, sample_bin_file):
    """Test chat endpoint with valid log."""
    # First upload a log file
    with open(sample_bin_file, "rb") as f:
        upload_response = client.post(
            "/api/upload",
            files={"file": ("test.bin", f, "application/octet-stream")}
        )
    log_id = upload_response.json()["log_id"]
    
    # Then try to chat
    response = client.post(
        f"/api/chat/{log_id}",
        json={"message": "What was the max altitude?"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "conversation_id" in data
    assert "response" in data

def test_clear_chat(client, sample_bin_file):
    """Test clearing chat history."""
    # First upload a log file
    with open(sample_bin_file, "rb") as f:
        upload_response = client.post(
            "/api/upload",
            files={"file": ("test.bin", f, "application/octet-stream")}
        )
    log_id = upload_response.json()["log_id"]
    
    # Start a conversation
    chat_response = client.post(
        f"/api/chat/{log_id}",
        json={"message": "Hello"}
    )
    conversation_id = chat_response.json()["conversation_id"]
    
    # Clear the chat
    response = client.delete(
        f"/api/chat/{log_id}",
        params={"conversation_id": conversation_id}
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Chat history cleared successfully" 