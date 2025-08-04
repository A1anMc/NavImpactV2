from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum


class SprintStatusEnum(str, Enum):
    PLANNING = "planning"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class SprintPriorityEnum(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


# Base Sprint Schema
class SprintBase(BaseModel):
    name: str = Field(..., description="Sprint name")
    description: Optional[str] = Field(None, description="Sprint description")
    status: SprintStatusEnum = Field(SprintStatusEnum.PLANNING, description="Sprint status")
    priority: SprintPriorityEnum = Field(SprintPriorityEnum.MEDIUM, description="Sprint priority")
    
    # Sprint lifecycle
    planned_start: Optional[datetime] = Field(None, description="Planned start date")
    planned_end: Optional[datetime] = Field(None, description="Planned end date")
    
    # Sprint goals and metrics
    goals: Optional[List[str]] = Field(None, description="Sprint goals")
    metrics: Optional[Dict[str, Any]] = Field(None, description="Sprint metrics")
    deliverables: Optional[List[str]] = Field(None, description="Expected deliverables")
    
    # Team and resources
    team_members: Optional[List[int]] = Field(None, description="Assigned team member IDs")
    resources: Optional[Dict[str, Any]] = Field(None, description="Required resources")
    
    # Strategic alignment
    strategic_objectives: Optional[List[str]] = Field(None, description="Aligned strategic objectives")
    impact_areas: Optional[List[str]] = Field(None, description="Impact areas this sprint addresses")
    
    # Project association
    project_id: Optional[int] = Field(None, description="Associated project ID")


# Create Sprint Request
class SprintCreateRequest(SprintBase):
    pass


# Update Sprint Request
class SprintUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[SprintStatusEnum] = None
    priority: Optional[SprintPriorityEnum] = None
    planned_start: Optional[datetime] = None
    planned_end: Optional[datetime] = None
    goals: Optional[List[str]] = None
    metrics: Optional[Dict[str, Any]] = None
    deliverables: Optional[List[str]] = None
    team_members: Optional[List[int]] = None
    resources: Optional[Dict[str, Any]] = None
    strategic_objectives: Optional[List[str]] = None
    impact_areas: Optional[List[str]] = None
    project_id: Optional[int] = None


# Sprint Response
class SprintResponse(SprintBase):
    id: int
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    progress_percentage: int = 0
    completed_tasks: int = 0
    total_tasks: int = 0
    created_at: datetime
    updated_at: datetime
    created_by: int
    
    class Config:
        from_attributes = True


# Sprint List Response
class SprintListResponse(BaseModel):
    sprints: List[SprintResponse]
    total: int
    page: int
    size: int


# Sprint Analytics
class SprintAnalytics(BaseModel):
    total_sprints: int
    active_sprints: int
    completed_sprints: int
    average_progress: float
    sprint_velocity: float
    team_performance: Dict[str, float]
    impact_contribution: Dict[str, float]


# Sprint Impact Contribution
class SprintImpactContribution(BaseModel):
    sprint_id: int
    sprint_name: str
    impact_areas: List[str]
    contribution_score: float
    metrics_achieved: Dict[str, float]
    strategic_alignment: float
