# backend/src/middleware/user_isolation.py
"""
Middleware to enforce user isolation by ensuring that users can only access their own data.
"""
from fastapi import Request, HTTPException, status
from jose import jwt, JWTError
from ..services.auth_service import SECRET_KEY, ALGORITHM
import os

def verify_user_owns_resource(request: Request, user_id_in_path: str) -> bool:
    """
    Verify that the authenticated user owns the resource they're trying to access.
    Extracts user ID from JWT token and compares with user ID in the path.
    """
    # Get the authorization header
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = auth_header[7:]  # Remove "Bearer " prefix
    
    try:
        # Decode the JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # In a real implementation, you would fetch the user ID from the database
    # For now, we'll assume the email is the user ID
    current_user_id = email
    
    # Compare the user ID from the token with the user ID in the path
    if current_user_id != user_id_in_path:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource"
        )
    
    return True