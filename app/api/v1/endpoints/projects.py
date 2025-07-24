from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

from app.core.deps import get_db
from app.models.project import Project
from app.models.user import User
from app.models.team_member import TeamMember
from app.db.session import get_last_connection_error

router = APIRouter()

# Pydantic models for request/response
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    status: str = "planning"
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    # Temporarily comment out budget fields until migration is applied
    # budget: Optional[float] = None
    # budget_currency: str = "AUD"

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    # Temporarily comment out budget fields until migration is applied
    # budget: Optional[float] = None
    # budget_currency: Optional[str] = None

class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    status: str
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    # Temporarily comment out budget fields until migration is applied
    # budget: Optional[float]
    # budget_currency: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    owner_id: int
    team_size: int
    progress_percentage: float
    budget_utilised: float

@router.get("/")
async def list_projects(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    owner_id: Optional[int] = None
):
    """List projects endpoint with proper error handling."""
    try:
        query = db.query(Project)
        
        if status:
            query = query.filter(Project.status == status)
        
        if owner_id:
            query = query.filter(Project.owner_id == owner_id)
        
        total = query.count()
        projects = query.offset(skip).limit(limit).all()
        
        # Calculate additional metrics for each project
        project_list = []
        for project in projects:
            # Calculate team size
            team_size = db.query(TeamMember).filter(TeamMember.project_id == project.id).count()
            
            # Calculate progress (placeholder - will be enhanced with task completion)
            progress_percentage = 0.0  # TODO: Calculate based on completed tasks
            
            # Calculate budget utilisation (placeholder)
            budget_utilised = 0.0  # TODO: Calculate based on expenses
            
            # Handle budget fields gracefully (in case columns don't exist yet)
            try:
                budget = project.budget
                budget_currency = project.budget_currency
            except AttributeError:
                budget = None
                budget_currency = "AUD"
            
            project_list.append({
                "id": project.id,
                "name": project.name,
                "description": project.description,
                "status": project.status,
                "start_date": project.start_date.isoformat() if project.start_date else None,
                "end_date": project.end_date.isoformat() if project.end_date else None,
                "budget": None,  # Will be available after migration
                "budget_currency": "AUD",  # Will be available after migration
                "created_at": project.created_at.isoformat() if project.created_at else None,
                "updated_at": project.updated_at.isoformat() if project.updated_at else None,
                "owner_id": project.owner_id,
                "team_size": team_size,
                "progress_percentage": progress_percentage,
                "budget_utilised": budget_utilised
            })
        
        return {
            "items": project_list,
            "total": total,
            "page": skip // limit + 1,
            "size": limit,
            "has_next": skip + limit < total,
            "has_prev": skip > 0
        }
    except Exception as e:
        # Check for database connection issues
        conn_error = get_last_connection_error()
        if conn_error:
            raise HTTPException(
                status_code=503,
                detail={
                    "message": "Database connection error",
                    "error": str(conn_error.get("error")),
                    "last_attempt": datetime.fromtimestamp(conn_error.get("last_attempt", 0)).isoformat() if conn_error.get("last_attempt") else None
                }
            )
        
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching projects: {str(e)}"
        )

@router.post("/")
async def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db)
):
    """Create a new project."""
    try:
        # For now, use a default user ID (will be replaced with proper auth)
        owner_id = 1  # TODO: Get from current_user
        
        project = Project(
            name=project_data.name,
            description=project_data.description,
            status=project_data.status,
            start_date=project_data.start_date,
            end_date=project_data.end_date,
            # Temporarily remove budget fields until migration is applied
            # budget=project_data.budget,
            # budget_currency=project_data.budget_currency,
            owner_id=owner_id
        )
        
        db.add(project)
        db.commit()
        db.refresh(project)
        
        return {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "status": project.status,
            "start_date": project.start_date.isoformat() if project.start_date else None,
            "end_date": project.end_date.isoformat() if project.end_date else None,
            "budget": None,  # Will be available after migration
            "budget_currency": "AUD",  # Will be available after migration
            "created_at": project.created_at.isoformat() if project.created_at else None,
            "updated_at": project.updated_at.isoformat() if project.updated_at else None,
            "owner_id": project.owner_id,
            "team_size": 0,
            "progress_percentage": 0.0,
            "budget_utilised": 0.0
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error creating project: {str(e)}"
        )

@router.get("/{project_id}")
async def get_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    """Get project by ID endpoint with proper error handling."""
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(
                status_code=404,
                detail=f"Project {project_id} not found"
            )
        
        # Calculate team size
        team_size = db.query(TeamMember).filter(TeamMember.project_id == project.id).count()
        
        # Calculate progress (placeholder)
        progress_percentage = 0.0
        
        # Calculate budget utilisation (placeholder)
        budget_utilised = 0.0
        
        return {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "status": project.status,
            "start_date": project.start_date.isoformat() if project.start_date else None,
            "end_date": project.end_date.isoformat() if project.end_date else None,
            "budget": None,  # Will be available after migration
            "budget_currency": "AUD",  # Will be available after migration
            "created_at": project.created_at.isoformat() if project.created_at else None,
            "updated_at": project.updated_at.isoformat() if project.updated_at else None,
            "owner_id": project.owner_id,
            "team_size": team_size,
            "progress_percentage": progress_percentage,
            "budget_utilised": budget_utilised
        }
    except HTTPException:
        raise
    except Exception as e:
        # Check for database connection issues
        conn_error = get_last_connection_error()
        if conn_error:
            raise HTTPException(
                status_code=503,
                detail={
                    "message": "Database connection error",
                    "error": str(conn_error.get("error")),
                    "last_attempt": datetime.fromtimestamp(conn_error.get("last_attempt", 0)).isoformat() if conn_error.get("last_attempt") else None
                }
            )
        
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching project {project_id}: {str(e)}"
        )

@router.put("/{project_id}")
async def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db)
):
    """Update project by ID."""
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(
                status_code=404,
                detail=f"Project {project_id} not found"
            )
        
        # Update fields if provided
        if project_data.name is not None:
            project.name = project_data.name
        if project_data.description is not None:
            project.description = project_data.description
        if project_data.status is not None:
            project.status = project_data.status
        if project_data.start_date is not None:
            project.start_date = project_data.start_date
        if project_data.end_date is not None:
            project.end_date = project_data.end_date
        # Temporarily remove budget fields until migration is applied
        # if project_data.budget is not None:
        #     project.budget = project_data.budget
        # if project_data.budget_currency is not None:
        #     project.budget_currency = project_data.budget_currency
        
        project.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(project)
        
        # Calculate team size
        team_size = db.query(TeamMember).filter(TeamMember.project_id == project.id).count()
        
        return {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "status": project.status,
            "start_date": project.start_date.isoformat() if project.start_date else None,
            "end_date": project.end_date.isoformat() if project.end_date else None,
            "budget": None,  # Will be available after migration
            "budget_currency": "AUD",  # Will be available after migration
            "created_at": project.created_at.isoformat() if project.created_at else None,
            "updated_at": project.updated_at.isoformat() if project.updated_at else None,
            "owner_id": project.owner_id,
            "team_size": team_size,
            "progress_percentage": 0.0,
            "budget_utilised": 0.0
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error updating project {project_id}: {str(e)}"
        )

@router.delete("/{project_id}")
async def delete_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    """Delete project by ID."""
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(
                status_code=404,
                detail=f"Project {project_id} not found"
            )
        
        db.delete(project)
        db.commit()
        
        return {"message": f"Project {project_id} deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting project {project_id}: {str(e)}"
        )

@router.get("/{project_id}/team")
async def get_project_team(
    project_id: int,
    db: Session = Depends(get_db)
):
    """Get team members for a project."""
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(
                status_code=404,
                detail=f"Project {project_id} not found"
            )
        
        team_members = db.query(TeamMember).filter(TeamMember.project_id == project_id).all()
        
        team_data = []
        for member in team_members:
            user = db.query(User).filter(User.id == member.user_id).first()
            team_data.append({
                "id": member.id,
                "user_id": member.user_id,
                "user_name": user.email if user else "Unknown User",  # TODO: Add proper user name field
                "role": member.role,
                "joined_at": member.joined_at.isoformat() if member.joined_at else None
            })
        
        return {
            "project_id": project_id,
            "team_members": team_data,
            "total_members": len(team_data)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching team for project {project_id}: {str(e)}"
        ) 