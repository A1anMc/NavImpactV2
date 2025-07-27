"""SGE Media Module Models

This module contains all the database models for the SGE Media Management module.
These models extend the existing NavImpact system without modifying core functionality.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Date, ForeignKey, Numeric, Boolean, Index
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base_class import Base


class SgeMediaProject(Base):
    """Model for SGE media projects that extend existing projects."""
    
    __tablename__ = "sge_media_projects"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    media_type = Column(String(50), nullable=False)  # 'video', 'photo', 'transcript', 'mixed'
    duration = Column(String(20), nullable=True)  # '15:30', '2:30:15'
    release_date = Column(Date, nullable=True)
    target_audience = Column(ARRAY(String), nullable=True)
    contributors = Column(ARRAY(String), nullable=True)
    production_budget = Column(Numeric(10, 2), nullable=True)
    thumbnail_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    project = relationship("Project", back_populates="sge_media_projects")
    distribution_logs = relationship("SgeDistributionLog", back_populates="media_project", cascade="all, delete-orphan")
    performance_metrics = relationship("SgePerformanceMetrics", back_populates="media_project", cascade="all, delete-orphan")
    impact_stories = relationship("SgeImpactStory", back_populates="media_project", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('ix_sge_media_projects_project_id', 'project_id'),
        Index('ix_sge_media_projects_media_type', 'media_type'),
    )


class SgeDistributionLog(Base):
    """Model for tracking where media content is distributed."""
    
    __tablename__ = "sge_distribution_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    media_project_id = Column(Integer, ForeignKey("sge_media_projects.id", ondelete="CASCADE"), nullable=False)
    platform = Column(String(100), nullable=False)  # 'YouTube', 'Vimeo', 'Festival', 'Social Media'
    url = Column(Text, nullable=True)
    publish_date = Column(Date, nullable=True)
    views = Column(Integer, nullable=True, default=0)
    reach = Column(Integer, nullable=True, default=0)
    engagement_rate = Column(Numeric(5, 2), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    media_project = relationship("SgeMediaProject", back_populates="distribution_logs")
    
    __table_args__ = (
        Index('ix_sge_distribution_logs_media_project_id', 'media_project_id'),
        Index('ix_sge_distribution_logs_platform', 'platform'),
    )


class SgePerformanceMetrics(Base):
    """Model for storing performance data (views, watch time, engagement)."""
    
    __tablename__ = "sge_performance_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    media_project_id = Column(Integer, ForeignKey("sge_media_projects.id", ondelete="CASCADE"), nullable=False)
    metric_date = Column(Date, nullable=False)
    views = Column(Integer, nullable=True, default=0)
    unique_viewers = Column(Integer, nullable=True, default=0)
    watch_time_minutes = Column(Integer, nullable=True, default=0)
    engagement_rate = Column(Numeric(5, 2), nullable=True)
    shares = Column(Integer, nullable=True, default=0)
    comments = Column(Integer, nullable=True, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    media_project = relationship("SgeMediaProject", back_populates="performance_metrics")
    
    __table_args__ = (
        Index('ix_sge_performance_metrics_media_project_id', 'media_project_id'),
        Index('ix_sge_performance_metrics_metric_date', 'metric_date'),
    )


class SgeImpactStory(Base):
    """Model for capturing qualitative impact stories and testimonials."""
    
    __tablename__ = "sge_impact_stories"
    
    id = Column(Integer, primary_key=True, index=True)
    media_project_id = Column(Integer, ForeignKey("sge_media_projects.id", ondelete="CASCADE"), nullable=False)
    story_type = Column(String(50), nullable=True)  # 'testimonial', 'policy_change', 'funding_unlocked', 'community_action'
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    stakeholder_name = Column(String(200), nullable=True)
    stakeholder_organisation = Column(String(200), nullable=True)
    impact_date = Column(Date, nullable=True)
    quantifiable_outcome = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    media_project = relationship("SgeMediaProject", back_populates="impact_stories")
    
    __table_args__ = (
        Index('ix_sge_impact_stories_media_project_id', 'media_project_id'),
        Index('ix_sge_impact_stories_story_type', 'story_type'),
    )


class SgeClientAccess(Base):
    """Model for managing access for SGE's clients to specific projects."""
    
    __tablename__ = "sge_client_access"
    
    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String(200), nullable=False)
    client_email = Column(String(200), nullable=False, unique=True)
    access_level = Column(String(50), nullable=True, default='viewer')  # 'viewer', 'analyst', 'admin'
    allowed_projects = Column(ARRAY(Integer), nullable=True)  # Array of project IDs they can access
    is_active = Column(Boolean, nullable=True, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
