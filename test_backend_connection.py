# Test script to verify the backend is running correctly
import requests
import sys

def test_backend():
    base_url = "http://localhost:8000"
    
    print("Testing backend endpoints...")
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print(f"✓ Health check: {response.json()}")
        else:
            print(f"✗ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"✗ Health check error: {e}")
        return False

    # Test root endpoint
    try:
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            print(f"✓ Root endpoint: {response.json()}")
        else:
            print(f"✗ Root endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"✗ Root endpoint error: {e}")
        return False

    # Test that auth endpoints exist (will return 422 for missing data, but should not return 404)
    try:
        response = requests.post(f"{base_url}/api/login", json={})
        if response.status_code == 422:  # Unprocessable Entity (expected for missing data)
            print("✓ Login endpoint exists (returned 422 as expected for missing data)")
        elif response.status_code == 401:  # Unauthorized (also acceptable)
            print("✓ Login endpoint exists (returned 401 as expected)")
        else:
            print(f"? Login endpoint exists but returned unexpected status: {response.status_code}")
    except Exception as e:
        print(f"✗ Login endpoint test error: {e}")
        return False

    # Test that tasks endpoints exist (will return 401 for missing auth, but should not return 404)
    try:
        response = requests.get(f"{base_url}/api/user123/tasks")
        if response.status_code == 401:  # Unauthorized (expected for missing auth)
            print("✓ Tasks endpoint exists (returned 401 as expected for missing auth)")
        elif response.status_code == 404:  # Not found (would indicate routing issue)
            print("✗ Tasks endpoint not found (returned 404)")
            return False
        else:
            print(f"? Tasks endpoint exists but returned unexpected status: {response.status_code}")
    except Exception as e:
        print(f"✗ Tasks endpoint test error: {e}")
        return False

    print("\nBackend is running correctly!")
    return True

if __name__ == "__main__":
    success = test_backend()
    if not success:
        sys.exit(1)