from sqlmodel import Session, select
from typing import List, Optional
from ..models.task import Task
from ..models.user import User

def create_task(session: Session, user_id: int, title: str, description: Optional[str] = None) -> Task:
    task = Task(user_id=user_id, title=title, description=description)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

def get_tasks_by_user(session: Session, user_id: int) -> List[Task]:
    statement = select(Task).where(Task.user_id == user_id)
    tasks = session.exec(statement).all()
    return tasks

def get_task_by_id(session: Session, task_id: int, user_id: int) -> Optional[Task]:
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = session.exec(statement).first()
    return task

def update_task(session: Session, task_id: int, user_id: int, title: Optional[str] = None, 
                description: Optional[str] = None, completed: Optional[bool] = None) -> Optional[Task]:
    task = get_task_by_id(session, task_id, user_id)
    if not task:
        return None
    
    if title is not None:
        task.title = title
    if description is not None:
        task.description = description
    if completed is not None:
        task.completed = completed
    
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

def delete_task(session: Session, task_id: int, user_id: int) -> bool:
    task = get_task_by_id(session, task_id, user_id)
    if not task:
        return False
    
    session.delete(task)
    session.commit()
    return True

def update_task_completion(session: Session, task_id: int, user_id: int, completed: bool) -> Optional[Task]:
    task = get_task_by_id(session, task_id, user_id)
    if not task:
        return None
    
    task.completed = completed
    session.add(task)
    session.commit()
    session.refresh(task)
    return task