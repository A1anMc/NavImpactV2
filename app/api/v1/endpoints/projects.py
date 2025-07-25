from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional
from datetime import datetime
import json
from pydantic import BaseModel

from app.core.deps import get_db  # Use consistent database dependency
from app.models.project import Project
from app.db.session import get_last_connection_error

router = APIRouter()

# Pydantic models for request/response
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    status: str = "planning"
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    outcome_text: Optional[str] = None
    impact_statement: Optional[str] = None
    impact_types: Optional[List[str]] = []
    sdg_tags: Optional[List[str]] = []
    framework_alignment: Optional[List[str]] = []
    evidence_sources: Optional[str] = None
    owner_id: int

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    outcome_text: Optional[str] = None
    impact_statement: Optional[str] = None
    impact_types: Optional[List[str]] = None
    sdg_tags: Optional[List[str]] = None
    framework_alignment: Optional[List[str]] = None
    evidence_sources: Optional[str] = None

@router.get("/test")
async def test_db_connection(db: Session = Depends(get_db)):
    """Test database connection."""
    try:
        # Simple test query
        from sqlalchemy import text
        result = db.execute(text("SELECT COUNT(*) FROM projects"))
        count = result.scalar()
        return {"message": "Database connection successful", "project_count": count}
    except Exception as e:
        return {"message": "Database connection failed", "error": str(e)}

@router.post("/")
async def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db)
):
    """Create a new project with framework alignment support."""
    try:
        project = Project(
            name=project_data.name,
            description=project_data.description,
            status=project_data.status,
            start_date=project_data.start_date,
            end_date=project_data.end_date,
            outcome_text=project_data.outcome_text,
            impact_statement=project_data.impact_statement,
            impact_types=project_data.impact_types,
            sdg_tags=project_data.sdg_tags,
            framework_alignment=project_data.framework_alignment,
            evidence_sources=project_data.evidence_sources,
            owner_id=project_data.owner_id
        )
        
        db.add(project)
        db.commit()
        db.refresh(project)
        
        return {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "status": project.status,
            "outcome_text": project.outcome_text,
            "impact_statement": project.impact_statement,
            "impact_types": project.impact_types,
            "sdg_tags": project.sdg_tags,
            "framework_alignment": project.framework_alignment,
            "evidence_sources": project.evidence_sources,
            "created_at": project.created_at.isoformat() if project.created_at else None,
            "message": "Project created successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error creating project: {str(e)}"
        )

@router.put("/{project_id}")
async def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing project with framework alignment support."""
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
        if project_data.outcome_text is not None:
            project.outcome_text = project_data.outcome_text
        if project_data.impact_statement is not None:
            project.impact_statement = project_data.impact_statement
        if project_data.impact_types is not None:
            project.impact_types = project_data.impact_types
        if project_data.sdg_tags is not None:
            project.sdg_tags = project_data.sdg_tags
        if project_data.framework_alignment is not None:
            project.framework_alignment = project_data.framework_alignment
        if project_data.evidence_sources is not None:
            project.evidence_sources = project_data.evidence_sources
        
        project.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(project)
        
        return {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "status": project.status,
            "outcome_text": project.outcome_text,
            "impact_statement": project.impact_statement,
            "impact_types": project.impact_types,
            "sdg_tags": project.sdg_tags,
            "framework_alignment": project.framework_alignment,
            "evidence_sources": project.evidence_sources,
            "updated_at": project.updated_at.isoformat() if project.updated_at else None,
            "message": "Project updated successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error updating project {project_id}: {str(e)}"
        )

@router.get("/")
async def list_projects(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    search: Optional[str] = None,
    impact_types: Optional[str] = None,
    sdg_tags: Optional[str] = None,
    framework_alignment: Optional[str] = None
):
    """List projects endpoint with enhanced filtering capabilities."""
    try:
        query = db.query(Project)
        
        # Status filter
        if status:
            query = query.filter(Project.status == status)
        
        # Search filter
        if search:
            search_filter = or_(
                Project.name.ilike(f"%{search}%"),
                Project.description.ilike(f"%{search}%")
            )
            query = query.filter(search_filter)
        
        # Impact types filter
        if impact_types:
            impact_types_list = [t.strip() for t in impact_types.split(',')]
            # Filter projects that have any of the specified impact types
            for impact_type in impact_types_list:
                query = query.filter(Project.impact_types.contains([impact_type]))
        
        # SDG tags filter
        if sdg_tags:
            sdg_list = [s.strip() for s in sdg_tags.split(',')]
            # Filter projects that have any of the specified SDGs
            for sdg in sdg_list:
                query = query.filter(Project.sdg_tags.contains([sdg]))
        
        # Framework alignment filter - temporarily disabled due to column issues
        # if framework_alignment:
        #     framework_list = [f.strip() for f in framework_alignment.split(',')]
        #     # Filter projects that have any of the specified frameworks
        #     for framework in framework_list:
        #         query = query.filter(Project.framework_alignment.contains([framework]))
        
        total = query.count()
        projects = query.offset(skip).limit(limit).all()
        
        return {
            "items": [
                {
                    "id": project.id,
                    "name": project.name,
                    "description": project.description,
                    "created_at": project.created_at.isoformat() if project.created_at else None,
                    "updated_at": project.updated_at.isoformat() if project.updated_at else None,
                    "status": getattr(project, 'status', 'active'),
                    "team_size": getattr(project, 'team_size', 0),
                    # Impact fields
                    "outcome_text": getattr(project, 'outcome_text', None),
                    "impact_statement": getattr(project, 'impact_statement', None),
                    "impact_types": getattr(project, 'impact_types', []),
                    "sdg_tags": getattr(project, 'sdg_tags', []),
                    "framework_alignment": [],  # Temporarily disabled due to column issues
                    "evidence_sources": getattr(project, 'evidence_sources', None),
                }
                for project in projects
            ],
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
        
        return {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "created_at": project.created_at.isoformat() if project.created_at else None,
            "updated_at": project.updated_at.isoformat() if project.updated_at else None,
            "status": getattr(project, 'status', 'active'),
            "team_size": getattr(project, 'team_size', 0),
            # Impact fields
            "outcome_text": getattr(project, 'outcome_text', None),
            "impact_statement": getattr(project, 'impact_statement', None),
            "impact_types": getattr(project, 'impact_types', []),
            "sdg_tags": getattr(project, 'sdg_tags', []),
            "framework_alignment": [],  # Temporarily disabled due to column issues
            "evidence_sources": getattr(project, 'evidence_sources', None),
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

@router.get("/portfolio-summary/")
async def get_portfolio_summary(db: Session = Depends(get_db)):
    """Get portfolio summary with framework alignment statistics."""
    try:
        # Get basic counts
        total_projects = db.query(Project).count()
        
        # Get projects with framework alignment - temporarily disabled
        projects_with_frameworks = 0  # Temporarily disabled due to column issues
        
        # Get projects with SDG alignment
        projects_with_sdgs = db.query(Project).filter(
            Project.sdg_tags.isnot(None)
        ).filter(Project.sdg_tags != []).count()
        
        # Calculate framework breakdown
        framework_breakdown = {
            "plan_for_victoria": 0,
            "melbourne_2030": 0,
            "activity_centres_program": 0,
            "greenfields_housing_plan": 0,
            "clean_economy_workforce_strategy": 0,
            "victorian_aboriginal_affairs_framework": 0,
        }
        
        # Get all projects with framework alignment - temporarily disabled
        # projects = db.query(Project).filter(
        #     Project.framework_alignment.isnot(None)
        # ).filter(Project.framework_alignment != []).all()
        
        # for project in projects:
        #     if project.framework_alignment:
        #         for framework in project.framework_alignment:
        #             if framework in framework_breakdown:
        #                 framework_breakdown[framework] += 1
        
        # Calculate impact type breakdown
        impact_type_breakdown = {"social": 0, "environmental": 0, "community": 0}
        projects_with_impact = db.query(Project).filter(
            Project.impact_types.isnot(None)
        ).filter(Project.impact_types != []).all()
        
        for project in projects_with_impact:
            if project.impact_types:
                for impact_type in project.impact_types:
                    if impact_type in impact_type_breakdown:
                        impact_type_breakdown[impact_type] += 1
        
        # Calculate status breakdown
        status_breakdown = {
            "planning": 0,
            "active": 0,
            "completed": 0,
            "paused": 0,
            "cancelled": 0,
        }
        
        for status in status_breakdown.keys():
            count = db.query(Project).filter(Project.status == status).count()
            status_breakdown[status] = count
        
        return {
            "total_projects": total_projects,
            "total_reach": 0,  # Placeholder - would need reach_count field
            "sdg_alignment_count": projects_with_sdgs,
            "framework_alignment_count": projects_with_frameworks,
            "impact_type_breakdown": impact_type_breakdown,
            "status_breakdown": status_breakdown,
            "framework_breakdown": framework_breakdown,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching portfolio summary: {str(e)}"
        ) 