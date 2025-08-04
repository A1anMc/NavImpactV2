from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func, desc
from datetime import datetime, timedelta
import logging

from app.core.deps import get_db, get_current_user
from app.models.sprint import Sprint, SprintStatus, SprintPriority
from app.models.user import User
from app.schemas.sprint import (
    SprintCreateRequest, SprintUpdateRequest, SprintResponse, SprintListResponse,
    SprintAnalytics, SprintImpactContribution
)

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/", response_model=SprintListResponse)
def get_sprints(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = Query(None, enum=["planning", "active", "completed", "cancelled"]),
    priority: Optional[str] = Query(None, enum=["low", "medium", "high", "critical"]),
    project_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get list of sprints with optional filtering."""
    try:
        query = db.query(Sprint)
        
        if status:
            query = query.filter(Sprint.status == status)
        
        if priority:
            query = query.filter(Sprint.priority == priority)
            
        if project_id:
            query = query.filter(Sprint.project_id == project_id)
        
        total = query.count()
        sprints = query.offset(skip).limit(limit).all()
        
        sprint_responses = []
        for sprint in sprints:
            sprint_responses.append(SprintResponse(
                id=sprint.id,
                name=sprint.name,
                description=sprint.description,
                status=sprint.status,
                priority=sprint.priority,
                planned_start=sprint.planned_start,
                planned_end=sprint.planned_end,
                start_date=sprint.start_date,
                end_date=sprint.end_date,
                goals=sprint.goals,
                metrics=sprint.metrics,
                deliverables=sprint.deliverables,
                team_members=sprint.team_members,
                resources=sprint.resources,
                strategic_objectives=sprint.strategic_objectives,
                impact_areas=sprint.impact_areas,
                progress_percentage=sprint.progress_percentage,
                completed_tasks=sprint.completed_tasks,
                total_tasks=sprint.total_tasks,
                created_at=sprint.created_at,
                updated_at=sprint.updated_at,
                created_by=sprint.created_by,
                project_id=sprint.project_id
            ))
        
        return SprintListResponse(
            sprints=sprint_responses,
            total=total,
            page=skip // limit + 1,
            size=limit
        )
    except Exception as e:
        logger.error(f"Error fetching sprints: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch sprints")


@router.get("/{sprint_id}", response_model=SprintResponse)
def get_sprint(sprint_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get a specific sprint by ID."""
    try:
        sprint = db.query(Sprint).filter(Sprint.id == sprint_id).first()
        if not sprint:
            raise HTTPException(status_code=404, detail="Sprint not found")
        
        return SprintResponse(
            id=sprint.id,
            name=sprint.name,
            description=sprint.description,
            status=sprint.status,
            priority=sprint.priority,
            planned_start=sprint.planned_start,
            planned_end=sprint.planned_end,
            start_date=sprint.start_date,
            end_date=sprint.end_date,
            goals=sprint.goals,
            metrics=sprint.metrics,
            deliverables=sprint.deliverables,
            team_members=sprint.team_members,
            resources=sprint.resources,
            strategic_objectives=sprint.strategic_objectives,
            impact_areas=sprint.impact_areas,
            progress_percentage=sprint.progress_percentage,
            completed_tasks=sprint.completed_tasks,
            total_tasks=sprint.total_tasks,
            created_at=sprint.created_at,
            updated_at=sprint.updated_at,
            created_by=sprint.created_by,
            project_id=sprint.project_id
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching sprint {sprint_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch sprint")


@router.post("/", response_model=SprintResponse)
def create_sprint(
    sprint_data: SprintCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new sprint."""
    try:
        sprint = Sprint(
            name=sprint_data.name,
            description=sprint_data.description,
            status=sprint_data.status,
            priority=sprint_data.priority,
            planned_start=sprint_data.planned_start,
            planned_end=sprint_data.planned_end,
            goals=sprint_data.goals,
            metrics=sprint_data.metrics,
            deliverables=sprint_data.deliverables,
            team_members=sprint_data.team_members,
            resources=sprint_data.resources,
            strategic_objectives=sprint_data.strategic_objectives,
            impact_areas=sprint_data.impact_areas,
            project_id=sprint_data.project_id,
            created_by=current_user.id
        )
        
        db.add(sprint)
        db.commit()
        db.refresh(sprint)
        
        return SprintResponse(
            id=sprint.id,
            name=sprint.name,
            description=sprint.description,
            status=sprint.status,
            priority=sprint.priority,
            planned_start=sprint.planned_start,
            planned_end=sprint.planned_end,
            start_date=sprint.start_date,
            end_date=sprint.end_date,
            goals=sprint.goals,
            metrics=sprint.metrics,
            deliverables=sprint.deliverables,
            team_members=sprint.team_members,
            resources=sprint.resources,
            strategic_objectives=sprint.strategic_objectives,
            impact_areas=sprint.impact_areas,
            progress_percentage=sprint.progress_percentage,
            completed_tasks=sprint.completed_tasks,
            total_tasks=sprint.total_tasks,
            created_at=sprint.created_at,
            updated_at=sprint.updated_at,
            created_by=sprint.created_by,
            project_id=sprint.project_id
        )
    except Exception as e:
        logger.error(f"Error creating sprint: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create sprint")


@router.put("/{sprint_id}", response_model=SprintResponse)
def update_sprint(
    sprint_id: int,
    sprint_data: SprintUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an existing sprint."""
    try:
        sprint = db.query(Sprint).filter(Sprint.id == sprint_id).first()
        if not sprint:
            raise HTTPException(status_code=404, detail="Sprint not found")
        
        # Update fields if provided
        update_data = sprint_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(sprint, field, value)
        
        sprint.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(sprint)
        
        return SprintResponse(
            id=sprint.id,
            name=sprint.name,
            description=sprint.description,
            status=sprint.status,
            priority=sprint.priority,
            planned_start=sprint.planned_start,
            planned_end=sprint.planned_end,
            start_date=sprint.start_date,
            end_date=sprint.end_date,
            goals=sprint.goals,
            metrics=sprint.metrics,
            deliverables=sprint.deliverables,
            team_members=sprint.team_members,
            resources=sprint.resources,
            strategic_objectives=sprint.strategic_objectives,
            impact_areas=sprint.impact_areas,
            progress_percentage=sprint.progress_percentage,
            completed_tasks=sprint.completed_tasks,
            total_tasks=sprint.total_tasks,
            created_at=sprint.created_at,
            updated_at=sprint.updated_at,
            created_by=sprint.created_by,
            project_id=sprint.project_id
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating sprint {sprint_id}: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update sprint")


@router.delete("/{sprint_id}")
def delete_sprint(sprint_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Delete a sprint."""
    try:
        sprint = db.query(Sprint).filter(Sprint.id == sprint_id).first()
        if not sprint:
            raise HTTPException(status_code=404, detail="Sprint not found")
        
        db.delete(sprint)
        db.commit()
        
        return {"message": "Sprint deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting sprint {sprint_id}: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete sprint")


@router.get("/analytics/overview", response_model=SprintAnalytics)
def get_sprint_analytics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get sprint analytics overview."""
    try:
        total_sprints = db.query(Sprint).count()
        active_sprints = db.query(Sprint).filter(Sprint.status == SprintStatus.ACTIVE).count()
        completed_sprints = db.query(Sprint).filter(Sprint.status == SprintStatus.COMPLETED).count()
        
        # Calculate average progress
        avg_progress = db.query(func.avg(Sprint.progress_percentage)).scalar() or 0
        
        # Calculate sprint velocity (completed tasks per sprint)
        total_completed_tasks = db.query(func.sum(Sprint.completed_tasks)).scalar() or 0
        velocity = total_completed_tasks / max(completed_sprints, 1)
        
        # Team performance (mock data for now)
        team_performance = {
            "Ursula": 85.0,
            "Ash": 92.0,
            "Shamita": 78.0,
            "Alan": 88.0,
            "Mish": 90.0,
            "Kiara": 75.0
        }
        
        # Impact contribution (mock data for now)
        impact_contribution = {
            "environmental": 35.0,
            "social": 28.0,
            "economic": 22.0,
            "cultural": 15.0
        }
        
        return SprintAnalytics(
            total_sprints=total_sprints,
            active_sprints=active_sprints,
            completed_sprints=completed_sprints,
            average_progress=float(avg_progress),
            sprint_velocity=float(velocity),
            team_performance=team_performance,
            impact_contribution=impact_contribution
        )
    except Exception as e:
        logger.error(f"Error fetching sprint analytics: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch sprint analytics")


@router.get("/active", response_model=List[SprintResponse])
def get_active_sprints(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get all active sprints."""
    try:
        sprints = db.query(Sprint).filter(Sprint.status == SprintStatus.ACTIVE).all()
        
        sprint_responses = []
        for sprint in sprints:
            sprint_responses.append(SprintResponse(
                id=sprint.id,
                name=sprint.name,
                description=sprint.description,
                status=sprint.status,
                priority=sprint.priority,
                planned_start=sprint.planned_start,
                planned_end=sprint.planned_end,
                start_date=sprint.start_date,
                end_date=sprint.end_date,
                goals=sprint.goals,
                metrics=sprint.metrics,
                deliverables=sprint.deliverables,
                team_members=sprint.team_members,
                resources=sprint.resources,
                strategic_objectives=sprint.strategic_objectives,
                impact_areas=sprint.impact_areas,
                progress_percentage=sprint.progress_percentage,
                completed_tasks=sprint.completed_tasks,
                total_tasks=sprint.total_tasks,
                created_at=sprint.created_at,
                updated_at=sprint.updated_at,
                created_by=sprint.created_by,
                project_id=sprint.project_id
            ))
        
        return sprint_responses
    except Exception as e:
        logger.error(f"Error fetching active sprints: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch active sprints")
