"""
Notion Integration Schemas
Pydantic models for Notion integration API requests and responses
"""

from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class SyncDirection(str, Enum):
    """Sync direction options."""

    NAVIMPACT_TO_NOTION = "navimpact_to_notion"
    NOTION_TO_NAVIMPACT = "notion_to_navimpact"
    BIDIRECTIONAL = "bidirectional"


class SyncStatus(str, Enum):
    """Sync status options."""

    PENDING = "pending"
    SYNCING = "syncing"
    COMPLETED = "completed"
    FAILED = "failed"


class OperationType(str, Enum):
    """Operation type options."""

    CREATE_PAGE = "create_page"
    UPDATE_PAGE = "update_page"
    DELETE_PAGE = "delete_page"
    SYNC_PROJECT = "sync_project"
    SYNC_DISTRIBUTION = "sync_distribution"
    SYNC_PERFORMANCE = "sync_performance"
    SYNC_IMPACT_STORY = "sync_impact_story"


class EntityType(str, Enum):
    """Entity type options."""

    MEDIA_PROJECT = "media_project"
    DISTRIBUTION_LOG = "distribution_log"
    PERFORMANCE_METRICS = "performance_metrics"
    IMPACT_STORY = "impact_story"
    CLIENT_ACCESS = "client_access"


class LogStatus(str, Enum):
    """Log status options."""

    SUCCESS = "success"
    FAILED = "failed"
    PARTIAL = "partial"


# Base Models
class NotionWorkspaceBase(BaseModel):
    """Base Notion workspace model."""

    workspace_id: str = Field(..., description="Notion workspace ID")
    workspace_name: str = Field(..., description="Notion workspace name")
    bot_user_id: Optional[str] = Field(None, description="Notion bot user ID")
    is_active: bool = Field(True, description="Whether the workspace is active")


class NotionSyncMappingBase(BaseModel):
    """Base Notion sync mapping model."""

    notion_page_id: str = Field(..., description="Notion page ID")
    notion_database_id: Optional[str] = Field(None, description="Notion database ID")
    sync_direction: SyncDirection = Field(
        SyncDirection.BIDIRECTIONAL, description="Sync direction"
    )
    sync_status: SyncStatus = Field(
        SyncStatus.PENDING, description="Current sync status"
    )


class NotionSyncLogBase(BaseModel):
    """Base Notion sync log model."""

    operation_type: OperationType = Field(..., description="Type of operation")
    entity_type: EntityType = Field(..., description="Type of entity")
    entity_id: Optional[str] = Field(None, description="Entity ID")
    status: LogStatus = Field(..., description="Operation status")
    error_message: Optional[str] = Field(None, description="Error message if failed")
    sync_duration_ms: Optional[int] = Field(
        None, description="Sync duration in milliseconds"
    )


# Create Models
class NotionWorkspaceCreate(NotionWorkspaceBase):
    """Create Notion workspace model."""

    access_token: str = Field(..., description="Notion access token")


class NotionSyncMappingCreate(NotionSyncMappingBase):
    """Create Notion sync mapping model."""

    media_project_id: Optional[int] = Field(None, description="SGE Media Project ID")


class NotionSyncLogCreate(NotionSyncLogBase):
    """Create Notion sync log model."""

    workspace_id: Optional[int] = Field(None, description="Notion workspace ID")


# Update Models
class NotionWorkspaceUpdate(BaseModel):
    """Update Notion workspace model."""

    workspace_name: Optional[str] = Field(None, description="Notion workspace name")
    access_token: Optional[str] = Field(None, description="Notion access token")
    bot_user_id: Optional[str] = Field(None, description="Notion bot user ID")
    is_active: Optional[bool] = Field(
        None, description="Whether the workspace is active"
    )


class NotionSyncMappingUpdate(BaseModel):
    """Update Notion sync mapping model."""

    notion_database_id: Optional[str] = Field(None, description="Notion database ID")
    sync_direction: Optional[SyncDirection] = Field(None, description="Sync direction")
    sync_status: Optional[SyncStatus] = Field(None, description="Current sync status")


# Response Models
class NotionWorkspaceResponse(NotionWorkspaceBase):
    """Notion workspace response model."""

    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class NotionSyncMappingResponse(NotionSyncMappingBase):
    """Notion sync mapping response model."""

    id: int
    media_project_id: Optional[int]
    last_sync_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class NotionSyncLogResponse(NotionSyncLogBase):
    """Notion sync log response model."""

    id: int
    workspace_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


# Specialized Models
class NotionConnectionRequest(BaseModel):
    """Notion connection request model."""

    code: str = Field(..., description="Authorization code from Notion OAuth")
    state: Optional[str] = Field(None, description="State parameter for security")


class NotionSyncRequest(BaseModel):
    """Notion sync request model."""

    project_id: int = Field(..., description="SGE Media Project ID to sync")
    force_sync: bool = Field(False, description="Force sync even if recently synced")
    sync_direction: Optional[SyncDirection] = Field(
        None, description="Override sync direction"
    )


class NotionTemplateRequest(BaseModel):
    """Notion template request model."""

    template_name: str = Field(..., description="Name of the template to create")
    parent_page_id: str = Field(
        ..., description="Parent page ID where template will be created"
    )
    project_data: Optional[Dict[str, Any]] = Field(
        None, description="Project data to populate template"
    )


class NotionSyncStatus(BaseModel):
    """Notion sync status response model."""

    workspace_id: int
    workspace_name: str
    is_connected: bool
    last_sync_at: Optional[datetime]
    sync_status: SyncStatus
    total_mappings: int
    pending_mappings: int
    failed_mappings: int
    recent_errors: List[str] = Field(default_factory=list)


class NotionSyncDashboard(BaseModel):
    """Notion sync dashboard response model."""

    workspaces: List[NotionWorkspaceResponse]
    sync_status: NotionSyncStatus
    recent_logs: List[NotionSyncLogResponse]
    sync_analytics: Dict[str, Any] = Field(default_factory=dict)


# Filter Models
class NotionWorkspaceFilters(BaseModel):
    """Notion workspace filters."""

    is_active: Optional[bool] = Field(None, description="Filter by active status")
    workspace_name: Optional[str] = Field(None, description="Filter by workspace name")


class NotionSyncMappingFilters(BaseModel):
    """Notion sync mapping filters."""

    media_project_id: Optional[int] = Field(
        None, description="Filter by media project ID"
    )
    sync_status: Optional[SyncStatus] = Field(None, description="Filter by sync status")
    sync_direction: Optional[SyncDirection] = Field(
        None, description="Filter by sync direction"
    )


class NotionSyncLogFilters(BaseModel):
    """Notion sync log filters."""

    workspace_id: Optional[int] = Field(None, description="Filter by workspace ID")
    operation_type: Optional[OperationType] = Field(
        None, description="Filter by operation type"
    )
    entity_type: Optional[EntityType] = Field(None, description="Filter by entity type")
    status: Optional[LogStatus] = Field(None, description="Filter by status")
    start_date: Optional[datetime] = Field(None, description="Filter by start date")
    end_date: Optional[datetime] = Field(None, description="Filter by end date")


# Pagination Models
class PaginatedNotionWorkspaces(BaseModel):
    """Paginated Notion workspaces response."""

    items: List[NotionWorkspaceResponse]
    total: int
    page: int
    size: int
    pages: int


class PaginatedNotionSyncMappings(BaseModel):
    """Paginated Notion sync mappings response."""

    items: List[NotionSyncMappingResponse]
    total: int
    page: int
    size: int
    pages: int


class PaginatedNotionSyncLogs(BaseModel):
    """Paginated Notion sync logs response."""

    items: List[NotionSyncLogResponse]
    total: int
    page: int
    size: int
    pages: int
