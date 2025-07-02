from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified
from datetime import datetime

from app.core.deps import get_db, get_current_user
from app.models.task import Task, TaskComment, TimeEntry
from app.models.user import User
from app.schemas.task import (
    TaskCreate,
    TaskUpdate,
    TaskResponse,
    CommentCreate,
    CommentUpdate,
    CommentResponse,
    ReactionUpdate
)
from app.core.email import send_task_assignment_email, send_task_update_email

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/", response_model=TaskResponse)
async def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new task"""
    db_task = Task(**task.model_dump(), creator_id=current_user.id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    
    # Send email if task is assigned
    if db_task.assignee_id:
        assignee = db.query(User).filter(User.id == db_task.assignee_id).first()
        if assignee:
            await send_task_assignment_email(
                [assignee.email],
                db_task.title,
                db_task.description,
                assignee.full_name
            )
    
    return db_task

@router.get("/", response_model=List[TaskResponse])
def get_tasks(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    assignee_id: Optional[int] = None,
    project_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get all tasks with optional filters"""
    query = db.query(Task)
    
    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)
    if assignee_id:
        query = query.filter(Task.assignee_id == assignee_id)
    if project_id:
        query = query.filter(Task.project_id == project_id)
    
    return query.all()

@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    """Get a specific task by ID"""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a task"""
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Store old assignee for email notification
    old_assignee_id = db_task.assignee_id
    
    # Update task fields
    for field, value in task_update.model_dump(exclude_unset=True).items():
        setattr(db_task, field, value)
    
    db_task.updated_at = datetime.utcnow()
    
    # Set completed_at if status changed to done
    if task_update.status == "done" and db_task.status != "done":
        db_task.completed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_task)
    
    # Send email notifications
    if task_update.assignee_id and task_update.assignee_id != old_assignee_id:
        new_assignee = db.query(User).filter(User.id == task_update.assignee_id).first()
        if new_assignee:
            await send_task_assignment_email(
                [new_assignee.email],
                db_task.title,
                db_task.description,
                new_assignee.full_name
            )
    
    return db_task

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """Delete a task"""
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted successfully"}

# Comment endpoints
@router.post("/comments", response_model=CommentResponse)
def create_comment(
    comment: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new comment"""
    # Check if task exists
    task = db.query(Task).filter(Task.id == comment.task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Create comment
    comment_data = comment.model_dump()
    comment_data.update({
        "user_id": current_user.id,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "reactions": {}
    })
    
    db_comment = TaskComment(**comment_data)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    
    return db_comment

@router.get("/comments/task/{task_id}", response_model=List[CommentResponse])
def get_task_comments(task_id: int, db: Session = Depends(get_db)):
    """Get all comments for a task"""
    # Get only top-level comments (no parent_id)
    comments = db.query(TaskComment).filter(
        TaskComment.task_id == task_id,
        TaskComment.parent_id.is_(None)
    ).all()
    
    return comments

@router.put("/comments/{comment_id}", response_model=CommentResponse)
def update_comment(
    comment_id: int,
    comment_update: CommentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a comment"""
    db_comment = db.query(TaskComment).filter(TaskComment.id == comment_id).first()
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    if db_comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this comment")
    
    for field, value in comment_update.model_dump(exclude_unset=True).items():
        setattr(db_comment, field, value)
    
    db_comment.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_comment)
    
    return db_comment

@router.delete("/comments/{comment_id}")
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a comment"""
    db_comment = db.query(TaskComment).filter(TaskComment.id == comment_id).first()
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    if db_comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")
    
    db.delete(db_comment)
    db.commit()
    return {"message": "Comment deleted successfully"}

@router.post("/comments/{comment_id}/reaction", response_model=CommentResponse)
async def update_reaction(
    comment_id: int,
    reaction: ReactionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add or remove a reaction to a comment"""
    db_comment = db.query(TaskComment).filter(TaskComment.id == comment_id).first()
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Initialize reactions if None or empty
    if not db_comment.reactions:
        db_comment.reactions = {}
    
    if reaction.action == "add":
        # Initialize emoji list if not present
        if reaction.emoji not in db_comment.reactions:
            db_comment.reactions[reaction.emoji] = []
        
        # Add user to reaction list if not already present
        if current_user.id not in db_comment.reactions[reaction.emoji]:
            db_comment.reactions[reaction.emoji].append(current_user.id)
            
        # Mark the reactions field as modified
        flag_modified(db_comment, "reactions")
    else:  # remove
        # Remove user from reaction list if present
        if reaction.emoji in db_comment.reactions:
            if current_user.id in db_comment.reactions[reaction.emoji]:
                db_comment.reactions[reaction.emoji].remove(current_user.id)
                # Remove emoji key if no users have reacted with it
                if not db_comment.reactions[reaction.emoji]:
                    del db_comment.reactions[reaction.emoji]
                    
                # Mark the reactions field as modified
                flag_modified(db_comment, "reactions")
    
    db.commit()
    db.refresh(db_comment)
    
    return db_comment

 