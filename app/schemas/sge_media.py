"""SGE Media Module Pydantic Schemas

This module contains all the Pydantic schemas for the SGE Media Management module.
These schemas handle request/response validation for the media-specific API endpoints.
"""

from datetime import date, datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, Field


# Base Schemas
class SgeMediaProjectBase(BaseModel):
    """Base schema for SGE media projects."""

    media_type: str = Field(
        ..., description="Type of media: video, photo, transcript, mixed"
    )
    duration: Optional[str] = Field(
        None, description="Duration in format '15:30' or '2:30:15'"
    )
    release_date: Optional[date] = Field(None, description="Release date of the media")
    target_audience: Optional[List[str]] = Field(
        None, description="Target audience list"
    )
    contributors: Optional[List[str]] = Field(None, description="List of contributors")
    production_budget: Optional[Decimal] = Field(None, description="Production budget")
    thumbnail_url: Optional[str] = Field(None, description="URL to thumbnail image")


class SgeDistributionLogBase(BaseModel):
    """Base schema for distribution logs."""

    platform: str = Field(..., description="Platform where content is distributed")
    url: Optional[str] = Field(None, description="URL to the distributed content")
    publish_date: Optional[date] = Field(
        None, description="Date when content was published"
    )
    views: Optional[int] = Field(0, description="Number of views")
    reach: Optional[int] = Field(0, description="Number of people reached")
    engagement_rate: Optional[Decimal] = Field(
        None, description="Engagement rate percentage"
    )
    notes: Optional[str] = Field(None, description="Additional notes")


class SgePerformanceMetricsBase(BaseModel):
    """Base schema for performance metrics."""

    metric_date: date = Field(..., description="Date of the metrics")
    views: Optional[int] = Field(0, description="Number of views")
    unique_viewers: Optional[int] = Field(0, description="Number of unique viewers")
    watch_time_minutes: Optional[int] = Field(
        0, description="Total watch time in minutes"
    )
    engagement_rate: Optional[Decimal] = Field(
        None, description="Engagement rate percentage"
    )
    shares: Optional[int] = Field(0, description="Number of shares")
    comments: Optional[int] = Field(0, description="Number of comments")


class SgeImpactStoryBase(BaseModel):
    """Base schema for impact stories."""

    story_type: Optional[str] = Field(
        None,
        description="Type of story: testimonial, policy_change, funding_unlocked, community_action",
    )
    title: str = Field(..., description="Title of the impact story")
    description: Optional[str] = Field(None, description="Description of the impact")
    stakeholder_name: Optional[str] = Field(None, description="Name of the stakeholder")
    stakeholder_organisation: Optional[str] = Field(
        None, description="Organisation of the stakeholder"
    )
    impact_date: Optional[date] = Field(None, description="Date when impact occurred")
    quantifiable_outcome: Optional[str] = Field(
        None, description="Quantifiable outcome of the impact"
    )


class SgeClientAccessBase(BaseModel):
    """Base schema for client access."""

    client_name: str = Field(..., description="Name of the client")
    client_email: str = Field(..., description="Email of the client")
    access_level: Optional[str] = Field(
        "viewer", description="Access level: viewer, analyst, admin"
    )
    allowed_projects: Optional[List[int]] = Field(
        None, description="List of project IDs the client can access"
    )
    is_active: Optional[bool] = Field(
        True, description="Whether the client access is active"
    )


# Create Schemas
class SgeMediaProjectCreate(SgeMediaProjectBase):
    """Schema for creating a new SGE media project."""

    project_id: int = Field(..., description="ID of the associated project")


class SgeDistributionLogCreate(SgeDistributionLogBase):
    """Schema for creating a new distribution log."""

    media_project_id: int = Field(..., description="ID of the associated media project")


class SgePerformanceMetricsCreate(SgePerformanceMetricsBase):
    """Schema for creating new performance metrics."""

    media_project_id: int = Field(..., description="ID of the associated media project")


class SgeImpactStoryCreate(SgeImpactStoryBase):
    """Schema for creating a new impact story."""

    media_project_id: int = Field(..., description="ID of the associated media project")


class SgeClientAccessCreate(SgeClientAccessBase):
    """Schema for creating new client access."""

    pass


# Update Schemas
class SgeMediaProjectUpdate(BaseModel):
    """Schema for updating an SGE media project."""

    media_type: Optional[str] = None
    duration: Optional[str] = None
    release_date: Optional[date] = None
    target_audience: Optional[List[str]] = None
    contributors: Optional[List[str]] = None
    production_budget: Optional[Decimal] = None
    thumbnail_url: Optional[str] = None


class SgeDistributionLogUpdate(BaseModel):
    """Schema for updating a distribution log."""

    platform: Optional[str] = None
    url: Optional[str] = None
    publish_date: Optional[date] = None
    views: Optional[int] = None
    reach: Optional[int] = None
    engagement_rate: Optional[Decimal] = None
    notes: Optional[str] = None


class SgePerformanceMetricsUpdate(BaseModel):
    """Schema for updating performance metrics."""

    metric_date: Optional[date] = None
    views: Optional[int] = None
    unique_viewers: Optional[int] = None
    watch_time_minutes: Optional[int] = None
    engagement_rate: Optional[Decimal] = None
    shares: Optional[int] = None
    comments: Optional[int] = None


class SgeImpactStoryUpdate(BaseModel):
    """Schema for updating an impact story."""

    story_type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    stakeholder_name: Optional[str] = None
    stakeholder_organisation: Optional[str] = None
    impact_date: Optional[date] = None
    quantifiable_outcome: Optional[str] = None


class SgeClientAccessUpdate(BaseModel):
    """Schema for updating client access."""

    client_name: Optional[str] = None
    client_email: Optional[str] = None
    access_level: Optional[str] = None
    allowed_projects: Optional[List[int]] = None
    is_active: Optional[bool] = None


# Response Schemas
class SgeMediaProjectResponse(SgeMediaProjectBase):
    """Schema for SGE media project responses."""

    id: int
    project_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SgeDistributionLogResponse(SgeDistributionLogBase):
    """Schema for distribution log responses."""

    id: int
    media_project_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class SgePerformanceMetricsResponse(SgePerformanceMetricsBase):
    """Schema for performance metrics responses."""

    id: int
    media_project_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class SgeImpactStoryResponse(SgeImpactStoryBase):
    """Schema for impact story responses."""

    id: int
    media_project_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class SgeClientAccessResponse(SgeClientAccessBase):
    """Schema for client access responses."""

    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Dashboard and Report Schemas
class MediaDashboardResponse(BaseModel):
    """Schema for media dashboard data."""

    total_projects: int
    total_views: int
    active_distributions: int
    impact_stories: int
    recent_projects: List[SgeMediaProjectResponse]
    distribution_data: dict
    performance_data: dict
    recent_stories: List[SgeImpactStoryResponse]

    class Config:
        from_attributes = True


class MediaImpactReportResponse(BaseModel):
    """Schema for media impact report."""

    project_id: int
    project_name: str
    media_projects: List[SgeMediaProjectResponse]
    total_views: int
    total_engagement: Decimal
    distribution_summary: dict
    performance_summary: dict
    impact_stories: List[SgeImpactStoryResponse]
    funding_impact: Optional[str]

    class Config:
        from_attributes = True
