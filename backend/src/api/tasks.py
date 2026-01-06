from fastapi import APIRouter, Depends, HTTPException, status, Path
from fastapi import Header
from sqlmodel import Session
from ..database.database import get_session
from ..services.task_service import (
    create_task, get_tasks_by_user, get_task_by_id,
    update_task, delete_task, update_task_completion
)
from ..services.auth_service import SECRET_KEY, ALGORITHM
from jose import jwt, JWTError
from pydantic import BaseModel
from typing import List, Optional
import os

router = APIRouter()

# Pydantic models for request/response
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class TaskComplete(BaseModel):
    completed: bool

def get_token_header(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return authorization[7:]  # Remove "Bearer " prefix

# Helper function to extract user_id from JWT
def get_user_id_from_token(token: str = Depends(get_token_header)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.get("/{user_id}/tasks")
def get_tasks(user_id: int, current_user_id: int = Depends(get_user_id_from_token), session: Session = Depends(get_session)):
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access these tasks"
        )
    tasks = get_tasks_by_user(session, user_id)
    return tasks

@router.post("/{user_id}/tasks")
def create_new_task(user_id: int, task_data: TaskCreate, current_user_id: int = Depends(get_user_id_from_token), session: Session = Depends(get_session)):
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create tasks for this user"
        )
    if not task_data.title.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Task title is required"
        )
    task = create_task(session, user_id, task_data.title, task_data.description)
    return task

@router.get("/{user_id}/tasks/{id}")
def get_task(user_id: int, id: int = Path(alias="id"), current_user_id: int = Depends(get_user_id_from_token), session: Session = Depends(get_session)):
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )
    task = get_task_by_id(session, id, user_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task

@router.put("/{user_id}/tasks/{id}")
def update_existing_task(user_id: int, task_data: TaskUpdate, id: int = Path(alias="id"), current_user_id: int = Depends(get_user_id_from_token), session: Session = Depends(get_session)):
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )
    task = update_task(session, id, user_id, task_data.title, task_data.description)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task

@router.delete("/{user_id}/tasks/{id}")
def delete_existing_task(user_id: int, id: int = Path(alias="id"), current_user_id: int = Depends(get_user_id_from_token), session: Session = Depends(get_session)):
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this task"
        )
    success = delete_task(session, id, user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return {"message": "Task deleted successfully"}

@router.patch("/{user_id}/tasks/{id}/complete")
def update_task_completion_status(user_id: int, task_data: TaskComplete, id: int = Path(alias="id"), current_user_id: int = Depends(get_user_id_from_token), session: Session = Depends(get_session)):
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )
    task = update_task_completion(session, id, user_id, task_data.completed)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task