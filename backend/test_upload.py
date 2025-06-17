import requests
import os

def test_upload():
    # File path
    file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '1980-01-08 09-44-08.bin')
    
    # Check if file exists
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return
    
    # Prepare the file for upload
    files = {'file': ('1980-01-08 09-44-08.bin', open(file_path, 'rb'))}
    
    # Make the POST request
    response = requests.post('http://localhost:8001/api/upload', files=files)
    
    # Print the response
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

if __name__ == "__main__":
    test_upload() 