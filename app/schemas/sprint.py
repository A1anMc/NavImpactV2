"""
Sprint Pydantic Schemas
Provides comprehensive validation and serialization for sprint tracking.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, validator
from enum import Enum

from app.models.sprint import SprintStatus, SprintPriority


class SprintStatusEnum(str, Enum):
    """Sprint status enumeration for API."""
    PLANNING = "planning"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    ON_HOLD = "on_hold"


class SprintPriorityEnum(str, Enum):
    """Sprint priority enumeration for API."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


# Base Sprint Schema
class SprintBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Sprint name")
    theme: str = Field(..., min_length=1, max_length=255, description="Sprint theme")
    description: Optional[str] = Field(None, description="Sprint description")
    start_date: datetime = Field(..., description="Sprint start date")
    end_date: datetime = Field(..., description="Sprint end date")
    stakeholder_value: Optional[str] = Field(None, description="Stakeholder value statement")
    frameworks: Optional[List[str]] = Field(default=[], description="Framework alignments")
    team_members: Optional[List[str]] = Field(default=[], description="Team member IDs")
    priority: SprintPriorityEnum = Field(default=SprintPriorityEnum.MEDIUM, description="Sprint priority")
    
    @validator('end_date')
    def validate_end_date(cls, v, values):
        if 'start_date' in values and v <= values['start_date']:
            raise ValueError('End date must be after start date')
        return v


# Create Sprint Schema
class SprintCreate(SprintBase):
    """Schema for creating a new sprint."""
    pass


# Update Sprint Schema
class SprintUpdate(BaseModel):
    """Schema for updating a sprint."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    theme: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    stakeholder_value: Optional[str] = None
    frameworks: Optional[List[str]] = None
    team_members: Optional[List[str]] = None
    priority: Optional[SprintPriorityEnum] = None
    status: Optional[SprintStatusEnum] = None
    completion_rate: Optional[float] = Field(None, ge=0, le=100)
    
    @validator('completion_rate')
    def validate_completion_rate(cls, v):
        if v is not None and (v < 0 or v > 100):
            raise ValueError('Completion rate must be between 0 and 100')
        return v
    
    @validator('end_date')
    def validate_end_date(cls, v, values):
        if v is not None and 'start_date' in values and values['start_date'] is not None:
            if v <= values['start_date']:
                raise ValueError('End date must be after start date')
        return v


# Sprint Response Schema
class SprintResponse(SprintBase):
    """Schema for sprint response."""
    id: int
    status: SprintStatusEnum
    completion_rate: float = Field(..., ge=0, le=100)
    created_by: int
    updated_by: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Sprint Team Member Schema
class SprintTeamMemberBase(BaseModel):
    """Base schema for sprint team member."""
    role: Optional[str] = Field(None, max_length=100, description="Team member role")
    hours_allocated: Optional[float] = Field(None, ge=0, description="Hours allocated")
    hours_spent: Optional[float] = Field(None, ge=0, description="Hours actually spent")


class SprintTeamMemberCreate(SprintTeamMemberBase):
    """Schema for creating a sprint team member."""
    user_id: int = Field(..., description="User ID")
    sprint_id: int = Field(..., description="Sprint ID")


class SprintTeamMemberUpdate(SprintTeamMemberBase):
    """Schema for updating a sprint team member."""
    role: Optional[str] = None
    hours_allocated: Optional[float] = None
    hours_spent: Optional[float] = None


class SprintTeamMemberResponse(SprintTeamMemberBase):
    """Schema for sprint team member response."""
    id: int
    sprint_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Sprint Metric Schema
class SprintMetricBase(BaseModel):
    """Base schema for sprint metric."""
    metric_name: str = Field(..., max_length=255, description="Metric name")
    metric_value: float = Field(..., description="Metric value")
    metric_unit: Optional[str] = Field(None, max_length=50, description="Metric unit")
    metric_date: datetime = Field(..., description="Metric date")
    context: Optional[Dict[str, Any]] = Field(None, description="Additional context")
    notes: Optional[str] = Field(None, description="Additional notes")


class SprintMetricCreate(SprintMetricBase):
    """Schema for creating a sprint metric."""
    sprint_id: int = Field(..., description="Sprint ID")


class SprintMetricUpdate(BaseModel):
    """Schema for updating a sprint metric."""
    metric_name: Optional[str] = None
    metric_value: Optional[float] = None
    metric_unit: Optional[str] = None
    metric_date: Optional[datetime] = None
    context: Optional[Dict[str, Any]] = None
    notes: Optional[str] = None


class SprintMetricResponse(SprintMetricBase):
    """Schema for sprint metric response."""
    id: int
    sprint_id: int
    created_by: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Sprint Goal Schema
class SprintGoalBase(BaseModel):
    """Base schema for sprint goal."""
    title: str = Field(..., max_length=255, description="Goal title")
    description: Optional[str] = Field(None, description="Goal description")
    goal_type: str = Field(..., max_length=100, description="Goal type")
    priority: SprintPriorityEnum = Field(default=SprintPriorityEnum.MEDIUM, description="Goal priority")
    story_points: Optional[float] = Field(None, ge=0, description="Story points")
    estimated_hours: Optional[float] = Field(None, ge=0, description="Estimated hours")
    actual_hours: Optional[float] = Field(None, ge=0, description="Actual hours")


class SprintGoalCreate(SprintGoalBase):
    """Schema for creating a sprint goal."""
    sprint_id: int = Field(..., description="Sprint ID")
    assigned_to: Optional[int] = Field(None, description="Assigned user ID")


class SprintGoalUpdate(BaseModel):
    """Schema for updating a sprint goal."""
    title: Optional[str] = None
    description: Optional[str] = None
    goal_type: Optional[str] = None
    priority: Optional[SprintPriorityEnum] = None
    status: Optional[str] = None
    completion_rate: Optional[float] = Field(None, ge=0, le=100)
    story_points: Optional[float] = None
    estimated_hours: Optional[float] = None
    actual_hours: Optional[float] = None
    assigned_to: Optional[int] = None
    
    @validator('completion_rate')
    def validate_completion_rate(cls, v):
        if v is not None and (v < 0 or v > 100):
            raise ValueError('Completion rate must be between 0 and 100')
        return v


class SprintGoalResponse(SprintGoalBase):
    """Schema for sprint goal response."""
    id: int
    sprint_id: int
    status: str
    completion_rate: float = Field(..., ge=0, le=100)
    created_by: int
    assigned_to: Optional[int]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Sprint Retrospective Schema
class SprintRetrospectiveBase(BaseModel):
    """Base schema for sprint retrospective."""
    title: str = Field(..., max_length=255, description="Retrospective title")
    notes: Optional[str] = Field(None, description="Retrospective notes")
    what_went_well: Optional[List[str]] = Field(None, description="What went well")
    what_could_be_improved: Optional[List[str]] = Field(None, description="What could be improved")
    action_items: Optional[List[str]] = Field(None, description="Action items")
    team_satisfaction: Optional[float] = Field(None, ge=1, le=10, description="Team satisfaction (1-10)")
    sprint_effectiveness: Optional[float] = Field(None, ge=1, le=10, description="Sprint effectiveness (1-10)")


class SprintRetrospectiveCreate(SprintRetrospectiveBase):
    """Schema for creating a sprint retrospective."""
    sprint_id: int = Field(..., description="Sprint ID")


class SprintRetrospectiveUpdate(BaseModel):
    """Schema for updating a sprint retrospective."""
    title: Optional[str] = None
    notes: Optional[str] = None
    what_went_well: Optional[List[str]] = None
    what_could_be_improved: Optional[List[str]] = None
    action_items: Optional[List[str]] = None
    team_satisfaction: Optional[float] = Field(None, ge=1, le=10)
    sprint_effectiveness: Optional[float] = Field(None, ge=1, le=10)


class SprintRetrospectiveResponse(SprintRetrospectiveBase):
    """Schema for sprint retrospective response."""
    id: int
    sprint_id: int
    created_by: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Comprehensive Sprint Response Schema
class SprintDetailResponse(SprintResponse):
    """Comprehensive sprint response with all related data."""
    team_members: List[SprintTeamMemberResponse] = []
    metrics: List[SprintMetricResponse] = []
    goals: List[SprintGoalResponse] = []
    retrospectives: List[SprintRetrospectiveResponse] = []
    
    class Config:
        from_attributes = True


# Sprint Summary Schema
class SprintSummary(BaseModel):
    """Schema for sprint summary data."""
    id: int
    name: str
    theme: str
    status: SprintStatusEnum
    completion_rate: float
    start_date: datetime
    end_date: datetime
    priority: SprintPriorityEnum
    team_member_count: int
    goal_count: int
    completed_goals: int
    total_hours_spent: float
    total_hours_allocated: float
    
    class Config:
        from_attributes = True


# Sprint Statistics Schema
class SprintStatistics(BaseModel):
    """Schema for sprint statistics."""
    total_sprints: int
    active_sprints: int
    completed_sprints: int
    average_completion_rate: float
    total_team_members: int
    total_hours_spent: float
    total_hours_allocated: float
    sprint_velocity: float  # Average story points per sprint
    team_satisfaction_average: float
    sprint_effectiveness_average: float 