from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from sqlalchemy import text

from app.core.deps import get_db  # Use consistent database dependency
# Temporarily remove all model imports since we're using raw SQL
# from app.models.project import Project
# from app.models.user import User
# from app.models.team_member import TeamMember
from app.db.session import get_last_connection_error

# Create a separate router to avoid SQLAlchemy model conflicts
router = APIRouter(prefix="/projects", tags=["projects"])

# Pydantic models for request/response
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    status: str = "planning"
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    # Temporarily remove budget fields until migration is applied
    # budget: Optional[float] = None
    # budget_currency: str = "AUD"

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    # Temporarily remove budget fields until migration is applied
    # budget: Optional[float] = None
    # budget_currency: Optional[str] = None

class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    status: str
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    # Temporarily remove budget fields until migration is applied
    # budget: Optional[float]
    # budget_currency: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    owner_id: int
    team_size: int
    progress_percentage: float
    budget_utilised: float

@router.get("/debug")
async def debug_projects_schema(db: Session = Depends(get_db)):
    """Debug endpoint to check database schema."""
    try:
        # Check table structure
        result = db.execute(text("""
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'projects' 
            ORDER BY ordinal_position
        """))
        columns = [dict(row) for row in result]
        
        # Check if table exists
        result = db.execute(text("""
            SELECT COUNT(*) as count 
            FROM projects
        """))
        count = result.scalar()
        
        return {
            "table_exists": True,
            "column_count": len(columns),
            "columns": columns,
            "project_count": count
        }
    except Exception as e:
        return {
            "error": str(e),
            "table_exists": False
        }

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
        # Use raw SQL to avoid SQLAlchemy model issues
        query = """
            SELECT id, name, description, status, start_date, end_date, 
                   created_at, updated_at, owner_id
            FROM projects
        """
        params = []
        
        if status:
            query += " WHERE status = %s"
            params.append(status)
        
        if owner_id:
            if status:
                query += " AND owner_id = %s"
            else:
                query += " WHERE owner_id = %s"
            params.append(owner_id)
        
        # Get total count
        count_query = f"SELECT COUNT(*) FROM ({query}) as subquery"
        count_result = db.execute(text(count_query), params)
        total = count_result.scalar()
        
        # Get paginated results
        query += " ORDER BY created_at DESC LIMIT %s OFFSET %s"
        params.extend([limit, skip])
        
        result = db.execute(text(query), params)
        projects = [dict(row) for row in result]
        
        # Calculate additional metrics for each project
        project_list = []
        for project in projects:
            # Calculate team size
            team_result = db.execute(
                text("SELECT COUNT(*) FROM team_members WHERE project_id = %s"),
                [project['id']]
            )
            team_size = team_result.scalar()
            
            # Calculate progress (placeholder - will be enhanced with task completion)
            progress_percentage = 0.0  # TODO: Calculate based on completed tasks
            
            # Calculate budget utilisation (placeholder)
            budget_utilised = 0.0  # TODO: Calculate based on expenses
            
            project_list.append({
                "id": project['id'],
                "name": project['name'],
                "description": project['description'],
                "status": project['status'],
                "start_date": project['start_date'].isoformat() if project['start_date'] else None,
                "end_date": project['end_date'].isoformat() if project['end_date'] else None,
                # Temporarily remove budget fields until migration is applied
                # "budget": getattr(project, 'budget', None),
                # "budget_currency": getattr(project, 'budget_currency', 'AUD'),
                "created_at": project['created_at'].isoformat() if project['created_at'] else None,
                "updated_at": project['updated_at'].isoformat() if project['updated_at'] else None,
                "owner_id": project['owner_id'],
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
        
        # Use raw SQL to avoid SQLAlchemy model issues
        query = """
            INSERT INTO projects (name, description, status, start_date, end_date, owner_id, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW())
            RETURNING id, name, description, status, start_date, end_date, created_at, updated_at, owner_id
        """
        
        result = db.execute(text(query), [
            project_data.name,
            project_data.description,
            project_data.status,
            project_data.start_date,
            project_data.end_date,
            owner_id
        ])
        
        project = dict(result.fetchone())
        db.commit()
        
        return {
            "id": project['id'],
            "name": project['name'],
            "description": project['description'],
            "status": project['status'],
            "start_date": project['start_date'].isoformat() if project['start_date'] else None,
            "end_date": project['end_date'].isoformat() if project['end_date'] else None,
            # Temporarily remove budget fields until migration is applied
            # "budget": project.budget,
            # "budget_currency": project.budget_currency,
            "created_at": project['created_at'].isoformat() if project['created_at'] else None,
            "updated_at": project['updated_at'].isoformat() if project['updated_at'] else None,
            "owner_id": project['owner_id'],
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
        # Use raw SQL to avoid SQLAlchemy model issues
        result = db.execute(text("""
            SELECT id, name, description, status, start_date, end_date, 
                   created_at, updated_at, owner_id
            FROM projects 
            WHERE id = %s
        """), [project_id])
        
        project_row = result.fetchone()
        if not project_row:
            raise HTTPException(
                status_code=404,
                detail=f"Project {project_id} not found"
            )
        
        project = dict(project_row)
        
        # Calculate team size
        team_result = db.execute(
            text("SELECT COUNT(*) FROM team_members WHERE project_id = %s"),
            [project_id]
        )
        team_size = team_result.scalar()
        
        # Calculate progress (placeholder)
        progress_percentage = 0.0
        
        # Calculate budget utilisation (placeholder)
        budget_utilised = 0.0
        
        return {
            "id": project['id'],
            "name": project['name'],
            "description": project['description'],
            "status": project['status'],
            "start_date": project['start_date'].isoformat() if project['start_date'] else None,
            "end_date": project['end_date'].isoformat() if project['end_date'] else None,
            # Temporarily remove budget fields until migration is applied
            # "budget": getattr(project, 'budget', None),
            # "budget_currency": getattr(project, 'budget_currency', 'AUD'),
            "created_at": project['created_at'].isoformat() if project['created_at'] else None,
            "updated_at": project['updated_at'].isoformat() if project['updated_at'] else None,
            "owner_id": project['owner_id'],
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
        # Check if project exists
        result = db.execute(text("SELECT id FROM projects WHERE id = %s"), [project_id])
        if not result.fetchone():
            raise HTTPException(
                status_code=404,
                detail=f"Project {project_id} not found"
            )
        
        # Build update query dynamically
        update_fields = []
        params = []
        
        if project_data.name is not None:
            update_fields.append("name = %s")
            params.append(project_data.name)
        if project_data.description is not None:
            update_fields.append("description = %s")
            params.append(project_data.description)
        if project_data.status is not None:
            update_fields.append("status = %s")
            params.append(project_data.status)
        if project_data.start_date is not None:
            update_fields.append("start_date = %s")
            params.append(project_data.start_date)
        if project_data.end_date is not None:
            update_fields.append("end_date = %s")
            params.append(project_data.end_date)
        
        if update_fields:
            update_fields.append("updated_at = NOW()")
            params.append(project_id)
            
            query = f"UPDATE projects SET {', '.join(update_fields)} WHERE id = %s"
            db.execute(text(query), params)
            db.commit()
        
        # Get updated project
        result = db.execute(text("""
            SELECT id, name, description, status, start_date, end_date, 
                   created_at, updated_at, owner_id
            FROM projects 
            WHERE id = %s
        """), [project_id])
        
        project = dict(result.fetchone())
        
        # Calculate team size
        team_result = db.execute(
            text("SELECT COUNT(*) FROM team_members WHERE project_id = %s"),
            [project_id]
        )
        team_size = team_result.scalar()
        
        return {
            "id": project['id'],
            "name": project['name'],
            "description": project['description'],
            "status": project['status'],
            "start_date": project['start_date'].isoformat() if project['start_date'] else None,
            "end_date": project['end_date'].isoformat() if project['end_date'] else None,
            # Temporarily remove budget fields until migration is applied
            # "budget": getattr(project, 'budget', None),
            # "budget_currency": getattr(project, 'budget_currency', 'AUD'),
            "created_at": project['created_at'].isoformat() if project['created_at'] else None,
            "updated_at": project['updated_at'].isoformat() if project['updated_at'] else None,
            "owner_id": project['owner_id'],
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
        # Check if project exists
        result = db.execute(text("SELECT id FROM projects WHERE id = %s"), [project_id])
        if not result.fetchone():
            raise HTTPException(
                status_code=404,
                detail=f"Project {project_id} not found"
            )
        
        db.execute(text("DELETE FROM projects WHERE id = %s"), [project_id])
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
        # Check if project exists
        result = db.execute(text("SELECT id FROM projects WHERE id = %s"), [project_id])
        if not result.fetchone():
            raise HTTPException(
                status_code=404,
                detail=f"Project {project_id} not found"
            )
        
        team_result = db.execute(text("""
            SELECT tm.id, tm.user_id, tm.role, tm.joined_at, u.email as user_name
            FROM team_members tm
            LEFT JOIN users u ON tm.user_id = u.id
            WHERE tm.project_id = %s
        """), [project_id])
        
        team_members = [dict(row) for row in team_result]
        
        team_data = []
        for member in team_members:
            team_data.append({
                "id": member['id'],
                "user_id": member['user_id'],
                "user_name": member['user_name'] or "Unknown User",
                "role": member['role'],
                "joined_at": member['joined_at'].isoformat() if member['joined_at'] else None
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