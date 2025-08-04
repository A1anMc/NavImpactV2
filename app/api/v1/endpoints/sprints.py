"""
Professional Sprint Tracking API Endpoints
Provides comprehensive sprint management with real-time tracking,
error handling, validation, and database integration.
"""

import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, validator
from sqlalchemy.orm import Session
import asyncio
import json

from app.core.config import settings
from app.core.security import get_current_user
from app.models.user import User
from app.db.session import get_db
from app.models.sprint import Sprint, SprintStatus, SprintPriority
from app.schemas.sprint import SprintCreate, SprintUpdate, SprintResponse

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter()

# Pydantic models for type safety
class SprintCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Sprint name")
    theme: str = Field(..., min_length=1, max_length=255, description="Sprint theme")
    start_date: datetime = Field(..., description="Sprint start date")
    end_date: datetime = Field(..., description="Sprint end date")
    stakeholder_value: str = Field(..., description="Stakeholder value statement")
    frameworks: List[str] = Field(default=[], description="Framework alignments")
    team_members: List[str] = Field(default=[], description="Team member IDs")
    priority: SprintPriority = Field(default=SprintPriority.MEDIUM, description="Sprint priority")
    
    @validator('end_date')
    def validate_end_date(cls, v, values):
        if 'start_date' in values and v <= values['start_date']:
            raise ValueError('End date must be after start date')
        return v

class SprintUpdateRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    theme: Optional[str] = Field(None, min_length=1, max_length=255)
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    stakeholder_value: Optional[str] = None
    frameworks: Optional[List[str]] = None
    team_members: Optional[List[str]] = None
    priority: Optional[SprintPriority] = None
    status: Optional[SprintStatus] = None
    completion_rate: Optional[float] = Field(None, ge=0, le=100)
    
    @validator('completion_rate')
    def validate_completion_rate(cls, v):
        if v is not None and (v < 0 or v > 100):
            raise ValueError('Completion rate must be between 0 and 100')
        return v

class SprintResponse(BaseModel):
    id: int
    name: str
    theme: str
    start_date: datetime
    end_date: datetime
    stakeholder_value: str
    frameworks: List[str]
    team_members: List[str]
    priority: SprintPriority
    status: SprintStatus
    completion_rate: float
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Professional Sprint Service
class SprintService:
    def __init__(self, db: Session):
        self.db = db

    async def create_sprint(self, sprint_data: SprintCreateRequest, user_id: int) -> Sprint:
        """Create a new sprint with comprehensive validation."""
        try:
            # Validate sprint dates
            if sprint_data.end_date <= sprint_data.start_date:
                raise ValueError("End date must be after start date")
            
            # Check for overlapping sprints
            overlapping_sprints = self.db.query(Sprint).filter(
                Sprint.start_date <= sprint_data.end_date,
                Sprint.end_date >= sprint_data.start_date,
                Sprint.status != SprintStatus.COMPLETED
            ).count()
            
            if overlapping_sprints > 0:
                raise ValueError("Sprint dates overlap with existing sprints")
            
            # Create sprint
            sprint = Sprint(
                name=sprint_data.name,
                theme=sprint_data.theme,
                start_date=sprint_data.start_date,
                end_date=sprint_data.end_date,
                stakeholder_value=sprint_data.stakeholder_value,
                frameworks=sprint_data.frameworks,
                team_members=sprint_data.team_members,
                priority=sprint_data.priority,
                status=SprintStatus.ACTIVE,
                completion_rate=0.0,
                created_by=user_id,
                updated_by=user_id
            )
            
            self.db.add(sprint)
            self.db.commit()
            self.db.refresh(sprint)
            
            logger.info(f"Sprint created successfully: {sprint.id}")
            return sprint
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Sprint creation error: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail=f"Failed to create sprint: {str(e)}"
            )

    async def get_sprint(self, sprint_id: int) -> Optional[Sprint]:
        """Get a sprint by ID with error handling."""
        try:
            sprint = self.db.query(Sprint).filter(Sprint.id == sprint_id).first()
            if not sprint:
                raise HTTPException(
                    status_code=404,
                    detail="Sprint not found"
                )
            return sprint
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Sprint retrieval error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Failed to retrieve sprint"
            )

    async def get_all_sprints(self, status: Optional[SprintStatus] = None) -> List[Sprint]:
        """Get all sprints with optional status filter."""
        try:
            query = self.db.query(Sprint)
            if status:
                query = query.filter(Sprint.status == status)
            
            sprints = query.order_by(Sprint.start_date.desc()).all()
            return sprints
            
        except Exception as e:
            logger.error(f"Sprint retrieval error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Failed to retrieve sprints"
            )

    async def update_sprint(self, sprint_id: int, sprint_data: SprintUpdateRequest, user_id: int) -> Sprint:
        """Update a sprint with comprehensive validation."""
        try:
            sprint = await self.get_sprint(sprint_id)
            
            # Update fields
            update_data = sprint_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(sprint, field, value)
            
            sprint.updated_by = user_id
            sprint.updated_at = datetime.now()
            
            self.db.commit()
            self.db.refresh(sprint)
            
            logger.info(f"Sprint updated successfully: {sprint_id}")
            return sprint
            
        except HTTPException:
            raise
        except Exception as e:
            self.db.rollback()
            logger.error(f"Sprint update error: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail=f"Failed to update sprint: {str(e)}"
            )

    async def delete_sprint(self, sprint_id: int) -> bool:
        """Delete a sprint with validation."""
        try:
            sprint = await self.get_sprint(sprint_id)
            
            # Check if sprint can be deleted
            if sprint.status == SprintStatus.ACTIVE:
                raise HTTPException(
                    status_code=400,
                    detail="Cannot delete active sprint"
                )
            
            self.db.delete(sprint)
            self.db.commit()
            
            logger.info(f"Sprint deleted successfully: {sprint_id}")
            return True
            
        except HTTPException:
            raise
        except Exception as e:
            self.db.rollback()
            logger.error(f"Sprint deletion error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Failed to delete sprint"
            )

    async def calculate_completion_rate(self, sprint_id: int) -> float:
        """Calculate sprint completion rate based on tasks."""
        try:
            sprint = await self.get_sprint(sprint_id)
            
            # Get all tasks for this sprint
            from app.models.task import Task, TaskStatus
            tasks = self.db.query(Task).filter(Task.sprint_id == sprint_id).all()
            
            if not tasks:
                return 0.0
            
            completed_tasks = sum(1 for task in tasks if task.status == TaskStatus.COMPLETED)
            completion_rate = (completed_tasks / len(tasks)) * 100
            
            # Update sprint completion rate
            sprint.completion_rate = completion_rate
            self.db.commit()
            
            return completion_rate
            
        except Exception as e:
            logger.error(f"Completion rate calculation error: {str(e)}")
            return 0.0

# API Endpoints
@router.post("/sprints", response_model=SprintResponse)
async def create_sprint(
    sprint_data: SprintCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new sprint with comprehensive validation.
    
    Args:
        sprint_data: Sprint creation data
        current_user: Current authenticated user
        db: Database session
    
    Returns:
        SprintResponse: Created sprint data
    """
    try:
        sprint_service = SprintService(db)
        sprint = await sprint_service.create_sprint(sprint_data, current_user.id)
        return SprintResponse.from_orm(sprint)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Sprint creation endpoint error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to create sprint"
        )

@router.get("/sprints/{sprint_id}", response_model=SprintResponse)
async def get_sprint(
    sprint_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a sprint by ID.
    
    Args:
        sprint_id: Sprint ID
        current_user: Current authenticated user
        db: Database session
    
    Returns:
        SprintResponse: Sprint data
    """
    try:
        sprint_service = SprintService(db)
        sprint = await sprint_service.get_sprint(sprint_id)
        return SprintResponse.from_orm(sprint)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Sprint retrieval endpoint error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve sprint"
        )

@router.get("/sprints", response_model=List[SprintResponse])
async def get_all_sprints(
    status: Optional[SprintStatus] = Query(None, description="Filter by sprint status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all sprints with optional status filter.
    
    Args:
        status: Optional status filter
        current_user: Current authenticated user
        db: Database session
    
    Returns:
        List[SprintResponse]: List of sprints
    """
    try:
        sprint_service = SprintService(db)
        sprints = await sprint_service.get_all_sprints(status)
        return [SprintResponse.from_orm(sprint) for sprint in sprints]
        
    except Exception as e:
        logger.error(f"Sprint list endpoint error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve sprints"
        )

@router.put("/sprints/{sprint_id}", response_model=SprintResponse)
async def update_sprint(
    sprint_id: int,
    sprint_data: SprintUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a sprint.
    
    Args:
        sprint_id: Sprint ID
        sprint_data: Sprint update data
        current_user: Current authenticated user
        db: Database session
    
    Returns:
        SprintResponse: Updated sprint data
    """
    try:
        sprint_service = SprintService(db)
        sprint = await sprint_service.update_sprint(sprint_id, sprint_data, current_user.id)
        return SprintResponse.from_orm(sprint)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Sprint update endpoint error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to update sprint"
        )

@router.delete("/sprints/{sprint_id}")
async def delete_sprint(
    sprint_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a sprint.
    
    Args:
        sprint_id: Sprint ID
        current_user: Current authenticated user
        db: Database session
    
    Returns:
        Dict: Success message
    """
    try:
        sprint_service = SprintService(db)
        await sprint_service.delete_sprint(sprint_id)
        return {"message": "Sprint deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Sprint deletion endpoint error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to delete sprint"
        )

@router.get("/sprints/{sprint_id}/completion-rate")
async def get_sprint_completion_rate(
    sprint_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get sprint completion rate.
    
    Args:
        sprint_id: Sprint ID
        current_user: Current authenticated user
        db: Database session
    
    Returns:
        Dict: Completion rate data
    """
    try:
        sprint_service = SprintService(db)
        completion_rate = await sprint_service.calculate_completion_rate(sprint_id)
        return {
            "sprint_id": sprint_id,
            "completion_rate": completion_rate,
            "last_calculated": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Completion rate endpoint error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to calculate completion rate"
        )

@router.get("/sprints/active")
async def get_active_sprints(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all active sprints.
    
    Args:
        current_user: Current authenticated user
        db: Database session
    
    Returns:
        List[SprintResponse]: List of active sprints
    """
    try:
        sprint_service = SprintService(db)
        sprints = await sprint_service.get_all_sprints(SprintStatus.ACTIVE)
        return [SprintResponse.from_orm(sprint) for sprint in sprints]
        
    except Exception as e:
        logger.error(f"Active sprints endpoint error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve active sprints"
        ) 