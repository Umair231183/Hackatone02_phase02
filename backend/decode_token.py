import jwt
import os
from datetime import datetime, timedelta

# Decode a sample JWT to see its structure
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

# Sample token from the registration test
sample_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwidXNlcl9pZCI6MywiZXhwIjoxNzY3NzEwMjM0fQ.YRUZmOln8bUImwUviP1sHqKxlwOgg1_VsB8vrAJwndU"

try:
    payload = jwt.decode(sample_token, SECRET_KEY, algorithms=[ALGORITHM])
    print("Decoded JWT payload:")
    print(payload)
    print(f"\nUser ID: {payload.get('user_id')}")
    print(f"Email (sub): {payload.get('sub')}")
    print(f"Expiration: {datetime.fromtimestamp(payload.get('exp'))}")
except jwt.ExpiredSignatureError:
    print("Token has expired")
except jwt.JWTError as e:
    print(f"JWT Error: {e}")