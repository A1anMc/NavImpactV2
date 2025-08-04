from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from enum import Enum

from app.db.base_class import Base


class SprintStatus(str, Enum):
    PLANNING = "planning"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class SprintPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class Sprint(Base):
    """Model for sprint management."""
    
    __tablename__ = "sprints"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String, nullable=False, default=SprintStatus.PLANNING)
    priority = Column(String, nullable=False, default=SprintPriority.MEDIUM)
    
    # Sprint lifecycle
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    planned_start = Column(DateTime, nullable=True)
    planned_end = Column(DateTime, nullable=True)
    
    # Sprint goals and metrics
    goals = Column(JSONB, nullable=True)  # List of sprint goals
    metrics = Column(JSONB, nullable=True)  # Sprint metrics and KPIs
    deliverables = Column(JSONB, nullable=True)  # Expected deliverables
    
    # Team and resources
    team_members = Column(JSONB, nullable=True)  # Assigned team members
    resources = Column(JSONB, nullable=True)  # Required resources
    
    # Progress tracking
    progress_percentage = Column(Integer, default=0)
    completed_tasks = Column(Integer, default=0)
    total_tasks = Column(Integer, default=0)
    
    # Strategic alignment
    strategic_objectives = Column(JSONB, nullable=True)  # Aligned strategic objectives
    impact_areas = Column(JSONB, nullable=True)  # Impact areas this sprint addresses
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    tasks = relationship("Task", back_populates="sprint", cascade="all, delete-orphan")
    project = relationship("Project", back_populates="sprints")
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    
    def __repr__(self):
        return f"<Sprint {self.name} ({self.status})>"
