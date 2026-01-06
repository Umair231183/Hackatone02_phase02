import requests
import json

# Test creating and retrieving tasks
def test_tasks():
    # First, register a user to get a token
    register_url = "http://localhost:8000/api/register"
    register_data = {
        "email": "tasktest@example.com",
        "password": "testpassword",
        "name": "Task Test User"
    }
    
    try:
        register_response = requests.post(register_url, 
                                       headers={"Content-Type": "application/json"}, 
                                       data=json.dumps(register_data))
        
        if register_response.status_code != 200:
            print(f"Registration failed: {register_response.status_code}, {register_response.text}")
            return
        
        token_data = register_response.json()
        access_token = token_data['access_token']
        print(f"Registration successful. Token: {access_token[:20]}...")
        
        # Create a task
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        # Get the user ID from the token (we know from the previous test that user_id is in the payload)
        import jwt
        import os
        SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key-change-in-production")
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload['user_id']
        print(f"User ID extracted from token: {user_id}")
        
        # Create a task
        task_url = f"http://localhost:8000/api/{user_id}/tasks"
        task_data = {
            "title": "Test Task",
            "description": "This is a test task"
        }
        
        create_response = requests.post(task_url, headers=headers, data=json.dumps(task_data))
        if create_response.status_code != 200:
            print(f"Task creation failed: {create_response.status_code}, {create_response.text}")
            return
        
        created_task = create_response.json()
        print(f"Task created successfully: {created_task}")
        
        # Get all tasks
        get_tasks_response = requests.get(task_url, headers=headers)
        if get_tasks_response.status_code != 200:
            print(f"Getting tasks failed: {get_tasks_response.status_code}, {get_tasks_response.text}")
            return
        
        tasks = get_tasks_response.json()
        print(f"Retrieved {len(tasks)} tasks: {tasks}")
        
        print("All tests passed successfully!")
        
    except Exception as e:
        print(f"Error during testing: {e}")

if __name__ == "__main__":
    test_tasks()