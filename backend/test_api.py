import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_upload():
    """Test the upload endpoint."""
    file_path = "test_uploads/test.bin"
    
    with open(file_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(f"{BASE_URL}/upload", files=files)
    
    print("\nUpload Response:")
    print(json.dumps(response.json(), indent=2))
    return response.json()

def test_chat(log_id, message):
    """Test the chat endpoint."""
    response = requests.post(
        f"{BASE_URL}/chat/{log_id}",
        json={"message": message}
    )
    
    print("\nChat Response:")
    print(json.dumps(response.json(), indent=2))
    return response.json()

if __name__ == "__main__":
    # Test upload
    upload_response = test_upload()
    log_id = upload_response.get('log_id')
    
    if log_id:
        # Test some example questions
        questions = [
            "What was the highest altitude reached during the flight?",
            "When did the GPS signal first get lost?",
            "What was the maximum battery temperature?",
            "How long was the total flight time?",
            "List all critical errors that happened mid-flight."
        ]
        
        for question in questions:
            print(f"\n\nAsking: {question}")
            test_chat(log_id, question) 