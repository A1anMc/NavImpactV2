"""
Sprint Database Model
Provides comprehensive sprint tracking with proper relationships,
enums, and database constraints.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Index
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum

from app.db.base_class import Base


class SprintStatus(str, Enum):
    """Sprint status enumeration."""
    PLANNING = "planning"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    ON_HOLD = "on_hold"


class SprintPriority(str, Enum):
    """Sprint priority enumeration."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class Sprint(Base):
    """Sprint model for tracking project sprints."""
    
    __tablename__ = "sprints"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    theme = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Dates
    start_date = Column(DateTime, nullable=False, index=True)
    end_date = Column(DateTime, nullable=False, index=True)
    
    # Status and priority
    status = Column(String(50), nullable=False, default=SprintStatus.PLANNING, index=True)
    priority = Column(String(50), nullable=False, default=SprintPriority.MEDIUM, index=True)
    
    # Progress tracking
    completion_rate = Column(Float, nullable=False, default=0.0)
    stakeholder_value = Column(Text, nullable=True)
    
    # Framework alignment
    frameworks = Column(JSONB, nullable=True)  # List of framework alignments
    team_members = Column(JSONB, nullable=True)  # List of team member IDs
    
    # Audit fields
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    creator = relationship("User", foreign_keys=[created_by], back_populates="created_sprints")
    updater = relationship("User", foreign_keys=[updated_by], back_populates="updated_sprints")
    
    # Sprint-task relationships
    tasks = relationship("Task", back_populates="sprint", cascade="all, delete-orphan")
    
    # Sprint-project relationships
    projects = relationship("Project", back_populates="sprint", cascade="all, delete-orphan")
    
    # Sprint-grant relationships
    grants = relationship("Grant", back_populates="sprint", cascade="all, delete-orphan")
    
    # Sprint-team member relationships
    sprint_team_members = relationship("SprintTeamMember", back_populates="sprint", cascade="all, delete-orphan")
    
    # Sprint metrics
    metrics = relationship("SprintMetric", back_populates="sprint", cascade="all, delete-orphan")
    
    __table_args__ = (
        # Indexes for performance
        Index('ix_sprints_status_start_date', 'status', 'start_date'),
        Index('ix_sprints_priority_status', 'priority', 'status'),
        Index('ix_sprints_completion_rate', 'completion_rate'),
        Index('ix_sprints_created_by', 'created_by'),
        Index('ix_sprints_updated_by', 'updated_by'),
    )


class SprintTeamMember(Base):
    """Sprint team member relationship model."""
    
    __tablename__ = "sprint_team_members"
    
    id = Column(Integer, primary_key=True, index=True)
    sprint_id = Column(Integer, ForeignKey("sprints.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String(100), nullable=True)  # e.g., "Developer", "Designer", "Lead"
    hours_allocated = Column(Float, nullable=True)  # Hours allocated to this sprint
    hours_spent = Column(Float, nullable=True)  # Hours actually spent
    
    # Audit fields
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    sprint = relationship("Sprint", back_populates="sprint_team_members")
    user = relationship("User", back_populates="sprint_team_memberships")
    
    __table_args__ = (
        # Unique constraint to prevent duplicate assignments
        Index('ix_sprint_team_members_unique', 'sprint_id', 'user_id', unique=True),
        Index('ix_sprint_team_members_sprint_id', 'sprint_id'),
        Index('ix_sprint_team_members_user_id', 'user_id'),
    )


class SprintMetric(Base):
    """Sprint metrics tracking model."""
    
    __tablename__ = "sprint_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    sprint_id = Column(Integer, ForeignKey("sprints.id"), nullable=False)
    
    # Metric details
    metric_name = Column(String(255), nullable=False)  # e.g., "velocity", "burndown", "quality"
    metric_value = Column(Float, nullable=False)
    metric_unit = Column(String(50), nullable=True)  # e.g., "story_points", "hours", "percentage"
    metric_date = Column(DateTime, nullable=False, index=True)
    
    # Additional context
    context = Column(JSONB, nullable=True)  # Additional metric context
    notes = Column(Text, nullable=True)
    
    # Audit fields
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    sprint = relationship("Sprint", back_populates="metrics")
    creator = relationship("User", back_populates="created_sprint_metrics")
    
    __table_args__ = (
        Index('ix_sprint_metrics_sprint_id_metric_name', 'sprint_id', 'metric_name'),
        Index('ix_sprint_metrics_metric_date', 'metric_date'),
        Index('ix_sprint_metrics_created_by', 'created_by'),
    )


class SprintGoal(Base):
    """Sprint goals tracking model."""
    
    __tablename__ = "sprint_goals"
    
    id = Column(Integer, primary_key=True, index=True)
    sprint_id = Column(Integer, ForeignKey("sprints.id"), nullable=False)
    
    # Goal details
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    goal_type = Column(String(100), nullable=False)  # e.g., "feature", "bug_fix", "improvement"
    priority = Column(String(50), nullable=False, default=SprintPriority.MEDIUM)
    
    # Progress tracking
    status = Column(String(50), nullable=False, default="pending")  # pending, in_progress, completed, blocked
    completion_rate = Column(Float, nullable=False, default=0.0)
    
    # Estimates
    story_points = Column(Float, nullable=True)
    estimated_hours = Column(Float, nullable=True)
    actual_hours = Column(Float, nullable=True)
    
    # Audit fields
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    sprint = relationship("Sprint", back_populates="goals")
    creator = relationship("User", foreign_keys=[created_by], back_populates="created_sprint_goals")
    assignee = relationship("User", foreign_keys=[assigned_to], back_populates="assigned_sprint_goals")
    
    __table_args__ = (
        Index('ix_sprint_goals_sprint_id_status', 'sprint_id', 'status'),
        Index('ix_sprint_goals_assigned_to', 'assigned_to'),
        Index('ix_sprint_goals_created_by', 'created_by'),
    )


class SprintRetrospective(Base):
    """Sprint retrospective model."""
    
    __tablename__ = "sprint_retrospectives"
    
    id = Column(Integer, primary_key=True, index=True)
    sprint_id = Column(Integer, ForeignKey("sprints.id"), nullable=False)
    
    # Retrospective details
    title = Column(String(255), nullable=False)
    notes = Column(Text, nullable=True)
    
    # Categories
    what_went_well = Column(JSONB, nullable=True)  # List of positive items
    what_could_be_improved = Column(JSONB, nullable=True)  # List of improvement items
    action_items = Column(JSONB, nullable=True)  # List of action items
    
    # Metrics
    team_satisfaction = Column(Float, nullable=True)  # 1-10 scale
    sprint_effectiveness = Column(Float, nullable=True)  # 1-10 scale
    
    # Audit fields
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    sprint = relationship("Sprint", back_populates="retrospectives")
    creator = relationship("User", back_populates="created_sprint_retrospectives")
    
    __table_args__ = (
        Index('ix_sprint_retrospectives_sprint_id', 'sprint_id'),
        Index('ix_sprint_retrospectives_created_by', 'created_by'),
    ) 