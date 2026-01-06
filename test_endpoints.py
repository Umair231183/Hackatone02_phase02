# Simple test to verify backend endpoints
import requests

# Test the backend endpoints
BASE_URL = "http://localhost:8000"

# Test health endpoint
try:
    response = requests.get(f"{BASE_URL}/health")
    print(f"Health check: {response.status_code} - {response.json()}")
except Exception as e:
    print(f"Health check failed: {e}")

# Test root endpoint
try:
    response = requests.get(f"{BASE_URL}/")
    print(f"Root endpoint: {response.status_code} - {response.json()}")
except Exception as e:
    print(f"Root endpoint failed: {e}")

# Test that auth endpoints exist (will return 422 for missing data, but should not return 404)
try:
    response = requests.post(f"{BASE_URL}/api/login", json={})
    print(f"Login endpoint exists: {response.status_code} (expected 422 for missing data)")
except Exception as e:
    print(f"Login endpoint test failed: {e}")

# Test that tasks endpoints exist (will return 401 for missing auth, but should not return 404)
try:
    response = requests.get(f"{BASE_URL}/api/user123/tasks")
    print(f"Tasks endpoint exists: {response.status_code} (expected 401 for missing auth)")
except Exception as e:
    print(f"Tasks endpoint test failed: {e}")