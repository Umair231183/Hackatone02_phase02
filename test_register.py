# Test script to verify backend connection
import requests
import json

def test_register():
    url = "http://localhost:8000/api/register"
    
    # Sample registration data
    data = {
        "email": "test@example.com",
        "password": "testpassword",
        "name": "Test User"
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the backend. Make sure your FastAPI server is running on http://localhost:8000")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_register()