"""
Notion Integration API Endpoints
FastAPI endpoints for Notion integration functionality
"""

import logging
from datetime import datetime
from typing import Any, Dict, List, Optional

from app.core.config import settings
from app.db.session import get_db
from app.models.notion_integration import (
    NotionSyncLog,
    NotionSyncMapping,
    NotionWorkspace,
)
from app.models.sge_media import SgeMediaProject
from app.schemas.notion_integration import (
    EntityType,
    LogStatus,
    NotionConnectionRequest,
    NotionSyncDashboard,
    NotionSyncLogFilters,
    NotionSyncLogResponse,
    NotionSyncMappingCreate,
    NotionSyncMappingFilters,
    NotionSyncMappingResponse,
    NotionSyncMappingUpdate,
    NotionSyncRequest,
    NotionSyncStatus,
    NotionTemplateRequest,
    NotionWorkspaceCreate,
    NotionWorkspaceFilters,
    NotionWorkspaceResponse,
    NotionWorkspaceUpdate,
    OperationType,
    PaginatedNotionSyncLogs,
    PaginatedNotionSyncMappings,
    PaginatedNotionWorkspaces,
    SyncDirection,
    SyncStatus,
)
from app.services.notion_client import (
    NotionAPIClient,
    NotionAPIError,
    NotionSyncManager,
    NotionTemplateManager,
)
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

router = APIRouter()


# Helper functions
def log_sync_operation(
    db: Session,
    workspace_id: int,
    operation_type: OperationType,
    entity_type: EntityType,
    entity_id: str,
    status: LogStatus,
    error_message: Optional[str] = None,
    sync_duration_ms: Optional[int] = None,
) -> NotionSyncLog:
    """Log a sync operation."""
    sync_log = NotionSyncLog(
        workspace_id=workspace_id,
        operation_type=operation_type.value,
        entity_type=entity_type.value,
        entity_id=entity_id,
        status=status.value,
        error_message=error_message,
        sync_duration_ms=sync_duration_ms,
    )
    db.add(sync_log)
    db.commit()
    db.refresh(sync_log)
    return sync_log


# Workspace Management Endpoints
@router.post("/connect-workspace", response_model=NotionWorkspaceResponse)
async def connect_notion_workspace(
    connection_request: NotionConnectionRequest, db: Session = Depends(get_db)
):
    """Connect a Notion workspace via OAuth."""
    try:
        # TODO: Implement OAuth flow to get access token from code
        # For now, we'll use a placeholder implementation

        # Exchange code for access token (this would be the actual OAuth implementation)
        access_token = "placeholder_token"  # This would come from Notion OAuth

        # Get workspace info from Notion API
        notion_client = NotionAPIClient(access_token)
        workspace_info = notion_client.get_workspace_info()

        # Create workspace record
        workspace = NotionWorkspace(
            workspace_id=workspace_info.get("workspace_id", "unknown"),
            workspace_name=workspace_info.get("workspace_name", "Unknown Workspace"),
            access_token=access_token,
            bot_user_id=workspace_info.get("bot_id"),
            is_active=True,
        )

        db.add(workspace)
        db.commit()
        db.refresh(workspace)

        # Log successful connection
        log_sync_operation(
            db=db,
            workspace_id=workspace.id,
            operation_type=OperationType.CREATE_PAGE,
            entity_type=EntityType.MEDIA_PROJECT,
            entity_id="workspace_connection",
            status=LogStatus.SUCCESS,
        )

        return workspace

    except NotionAPIError as e:
        logger.error(f"Failed to connect Notion workspace: {e.message}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to connect Notion workspace: {e.message}",
        )
    except Exception as e:
        logger.error(f"Unexpected error connecting Notion workspace: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


@router.get("/workspaces", response_model=PaginatedNotionWorkspaces)
async def get_notion_workspaces(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    is_active: Optional[bool] = Query(None),
    workspace_name: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """Get all Notion workspaces with filtering and pagination."""
    query = db.query(NotionWorkspace)

    # Apply filters
    if is_active is not None:
        query = query.filter(NotionWorkspace.is_active == is_active)

    if workspace_name:
        query = query.filter(
            NotionWorkspace.workspace_name.ilike(f"%{workspace_name}%")
        )

    # Get total count
    total = query.count()

    # Apply pagination
    workspaces = query.offset(skip).limit(limit).all()

    # Calculate pagination info
    pages = (total + limit - 1) // limit
    page = (skip // limit) + 1

    return PaginatedNotionWorkspaces(
        items=workspaces, total=total, page=page, size=limit, pages=pages
    )


@router.get("/workspaces/{workspace_id}", response_model=NotionWorkspaceResponse)
async def get_notion_workspace(workspace_id: int, db: Session = Depends(get_db)):
    """Get a specific Notion workspace."""
    workspace = (
        db.query(NotionWorkspace).filter(NotionWorkspace.id == workspace_id).first()
    )
    if not workspace:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Notion workspace not found"
        )
    return workspace


@router.put("/workspaces/{workspace_id}", response_model=NotionWorkspaceResponse)
async def update_notion_workspace(
    workspace_id: int,
    workspace_update: NotionWorkspaceUpdate,
    db: Session = Depends(get_db),
):
    """Update a Notion workspace."""
    workspace = (
        db.query(NotionWorkspace).filter(NotionWorkspace.id == workspace_id).first()
    )
    if not workspace:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Notion workspace not found"
        )

    # Update fields
    update_data = workspace_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(workspace, field, value)

    workspace.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(workspace)

    return workspace


@router.delete("/workspaces/{workspace_id}")
async def delete_notion_workspace(workspace_id: int, db: Session = Depends(get_db)):
    """Delete a Notion workspace."""
    workspace = (
        db.query(NotionWorkspace).filter(NotionWorkspace.id == workspace_id).first()
    )
    if not workspace:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Notion workspace not found"
        )

    # Soft delete by setting is_active to False
    workspace.is_active = False
    workspace.updated_at = datetime.utcnow()
    db.commit()

    return {"message": "Notion workspace deleted successfully"}


# Sync Management Endpoints
@router.post("/sync-project/{project_id}")
async def sync_media_project_to_notion(
    project_id: int, sync_request: NotionSyncRequest, db: Session = Depends(get_db)
):
    """Sync a media project to Notion."""
    start_time = datetime.utcnow()

    try:
        # Get the media project
        project = (
            db.query(SgeMediaProject).filter(SgeMediaProject.id == project_id).first()
        )
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Media project not found"
            )

        # Get active workspace
        workspace = (
            db.query(NotionWorkspace).filter(NotionWorkspace.is_active == True).first()
        )
        if not workspace:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No active Notion workspace found",
            )

        # Get or create sync mapping
        mapping = (
            db.query(NotionSyncMapping)
            .filter(NotionSyncMapping.media_project_id == project_id)
            .first()
        )

        if not mapping:
            # Create new mapping and page
            notion_client = NotionAPIClient(workspace.access_token)
            template_manager = NotionTemplateManager(notion_client)

            # Convert project to dict for template
            project_data = {
                "id": project.id,
                "title": project.title,
                "description": project.description,
                "project_type": project.project_type,
                "status": project.status,
                "start_date": (
                    project.start_date.isoformat() if project.start_date else None
                ),
                "end_date": project.end_date.isoformat() if project.end_date else None,
                "budget": project.budget,
                "target_audience": project.target_audience,
                "team_members": [],  # TODO: Get from related data
                "distribution_channels": [],  # TODO: Get from related data
            }

            # Create page in Notion (you'll need a parent page ID)
            parent_page_id = "your_parent_page_id"  # This should be configurable
            notion_page = template_manager.create_media_project_template(
                parent_page_id, project_data
            )

            # Create mapping
            mapping = NotionSyncMapping(
                media_project_id=project_id,
                notion_page_id=notion_page["id"],
                sync_direction=sync_request.sync_direction
                or SyncDirection.BIDIRECTIONAL,
                sync_status=SyncStatus.COMPLETED,
            )
            db.add(mapping)
        else:
            # Update existing page
            notion_client = NotionAPIClient(workspace.access_token)
            sync_manager = NotionSyncManager(
                notion_client, NotionTemplateManager(notion_client)
            )

            project_data = {
                "id": project.id,
                "title": project.title,
                "description": project.description,
                "project_type": project.project_type,
                "status": project.status,
                "start_date": (
                    project.start_date.isoformat() if project.start_date else None
                ),
                "end_date": project.end_date.isoformat() if project.end_date else None,
                "budget": project.budget,
                "target_audience": project.target_audience,
            }

            sync_manager.sync_media_project(project_data, mapping.notion_page_id)
            mapping.sync_status = SyncStatus.COMPLETED

        mapping.last_sync_at = datetime.utcnow()
        db.commit()

        # Calculate sync duration
        sync_duration = int((datetime.utcnow() - start_time).total_seconds() * 1000)

        # Log successful sync
        log_sync_operation(
            db=db,
            workspace_id=workspace.id,
            operation_type=OperationType.SYNC_PROJECT,
            entity_type=EntityType.MEDIA_PROJECT,
            entity_id=str(project_id),
            status=LogStatus.SUCCESS,
            sync_duration_ms=sync_duration,
        )

        return {
            "message": "Project synced successfully",
            "project_id": project_id,
            "notion_page_id": mapping.notion_page_id,
            "sync_duration_ms": sync_duration,
        }

    except NotionAPIError as e:
        # Log failed sync
        sync_duration = int((datetime.utcnow() - start_time).total_seconds() * 1000)
        log_sync_operation(
            db=db,
            workspace_id=workspace.id if "workspace" in locals() else None,
            operation_type=OperationType.SYNC_PROJECT,
            entity_type=EntityType.MEDIA_PROJECT,
            entity_id=str(project_id),
            status=LogStatus.FAILED,
            error_message=e.message,
            sync_duration_ms=sync_duration,
        )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to sync project: {e.message}",
        )
    except Exception as e:
        logger.error(f"Unexpected error syncing project {project_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


@router.get("/sync-status", response_model=NotionSyncStatus)
async def get_notion_sync_status(db: Session = Depends(get_db)):
    """Get overall Notion sync status."""
    # Get active workspace
    workspace = (
        db.query(NotionWorkspace).filter(NotionWorkspace.is_active == True).first()
    )
    if not workspace:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active Notion workspace found",
        )

    # Get sync statistics
    total_mappings = db.query(NotionSyncMapping).count()
    pending_mappings = (
        db.query(NotionSyncMapping)
        .filter(NotionSyncMapping.sync_status == SyncStatus.PENDING)
        .count()
    )
    failed_mappings = (
        db.query(NotionSyncMapping)
        .filter(NotionSyncMapping.sync_status == SyncStatus.FAILED)
        .count()
    )

    # Get recent errors
    recent_errors = (
        db.query(NotionSyncLog)
        .filter(
            and_(
                NotionSyncLog.workspace_id == workspace.id,
                NotionSyncLog.status == LogStatus.FAILED,
            )
        )
        .order_by(NotionSyncLog.created_at.desc())
        .limit(5)
        .all()
    )

    recent_error_messages = [
        log.error_message for log in recent_errors if log.error_message
    ]

    # Get last sync time
    last_sync = (
        db.query(NotionSyncMapping)
        .filter(NotionSyncMapping.last_sync_at.isnot(None))
        .order_by(NotionSyncMapping.last_sync_at.desc())
        .first()
    )

    return NotionSyncStatus(
        workspace_id=workspace.id,
        workspace_name=workspace.workspace_name,
        is_connected=True,
        last_sync_at=last_sync.last_sync_at if last_sync else None,
        sync_status=(
            SyncStatus.COMPLETED if pending_mappings == 0 else SyncStatus.SYNCING
        ),
        total_mappings=total_mappings,
        pending_mappings=pending_mappings,
        failed_mappings=failed_mappings,
        recent_errors=recent_error_messages,
    )


@router.get("/sync-mappings", response_model=PaginatedNotionSyncMappings)
async def get_notion_sync_mappings(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    media_project_id: Optional[int] = Query(None),
    sync_status: Optional[SyncStatus] = Query(None),
    sync_direction: Optional[SyncDirection] = Query(None),
    db: Session = Depends(get_db),
):
    """Get Notion sync mappings with filtering and pagination."""
    query = db.query(NotionSyncMapping)

    # Apply filters
    if media_project_id is not None:
        query = query.filter(NotionSyncMapping.media_project_id == media_project_id)

    if sync_status is not None:
        query = query.filter(NotionSyncMapping.sync_status == sync_status.value)

    if sync_direction is not None:
        query = query.filter(NotionSyncMapping.sync_direction == sync_direction.value)

    # Get total count
    total = query.count()

    # Apply pagination
    mappings = query.offset(skip).limit(limit).all()

    # Calculate pagination info
    pages = (total + limit - 1) // limit
    page = (skip // limit) + 1

    return PaginatedNotionSyncMappings(
        items=mappings, total=total, page=page, size=limit, pages=pages
    )


@router.get("/sync-logs", response_model=PaginatedNotionSyncLogs)
async def get_notion_sync_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    workspace_id: Optional[int] = Query(None),
    operation_type: Optional[OperationType] = Query(None),
    entity_type: Optional[EntityType] = Query(None),
    status: Optional[LogStatus] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
):
    """Get Notion sync logs with filtering and pagination."""
    query = db.query(NotionSyncLog)

    # Apply filters
    if workspace_id is not None:
        query = query.filter(NotionSyncLog.workspace_id == workspace_id)

    if operation_type is not None:
        query = query.filter(NotionSyncLog.operation_type == operation_type.value)

    if entity_type is not None:
        query = query.filter(NotionSyncLog.entity_type == entity_type.value)

    if status is not None:
        query = query.filter(NotionSyncLog.status == status.value)

    if start_date is not None:
        query = query.filter(NotionSyncLog.created_at >= start_date)

    if end_date is not None:
        query = query.filter(NotionSyncLog.created_at <= end_date)

    # Get total count
    total = query.count()

    # Apply pagination and ordering
    logs = (
        query.order_by(NotionSyncLog.created_at.desc()).offset(skip).limit(limit).all()
    )

    # Calculate pagination info
    pages = (total + limit - 1) // limit
    page = (skip // limit) + 1

    return PaginatedNotionSyncLogs(
        items=logs, total=total, page=page, size=limit, pages=pages
    )


# Template Management Endpoints
@router.post("/create-template")
async def create_notion_template(
    template_request: NotionTemplateRequest, db: Session = Depends(get_db)
):
    """Create a Notion template for media projects."""
    try:
        # Get active workspace
        workspace = (
            db.query(NotionWorkspace).filter(NotionWorkspace.is_active == True).first()
        )
        if not workspace:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No active Notion workspace found",
            )

        # Create template using Notion API
        notion_client = NotionAPIClient(workspace.access_token)
        template_manager = NotionTemplateManager(notion_client)

        if template_request.template_name == "media_project":
            result = template_manager.create_media_project_template(
                template_request.parent_page_id, template_request.project_data or {}
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unknown template type: {template_request.template_name}",
            )

        # Log template creation
        log_sync_operation(
            db=db,
            workspace_id=workspace.id,
            operation_type=OperationType.CREATE_PAGE,
            entity_type=EntityType.MEDIA_PROJECT,
            entity_id=result["id"],
            status=LogStatus.SUCCESS,
        )

        return {
            "message": "Template created successfully",
            "template_id": result["id"],
            "template_url": result.get("url"),
        }

    except NotionAPIError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create template: {e.message}",
        )
    except Exception as e:
        logger.error(f"Unexpected error creating template: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


# Dashboard Endpoint
@router.get("/dashboard", response_model=NotionSyncDashboard)
async def get_notion_dashboard(db: Session = Depends(get_db)):
    """Get comprehensive Notion integration dashboard."""
    # Get active workspace
    workspace = (
        db.query(NotionWorkspace).filter(NotionWorkspace.is_active == True).first()
    )
    if not workspace:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active Notion workspace found",
        )

    # Get sync status
    sync_status = await get_notion_sync_status(db)

    # Get recent logs
    recent_logs = (
        db.query(NotionSyncLog)
        .filter(NotionSyncLog.workspace_id == workspace.id)
        .order_by(NotionSyncLog.created_at.desc())
        .limit(10)
        .all()
    )

    # Calculate sync analytics
    total_syncs = (
        db.query(NotionSyncLog)
        .filter(NotionSyncLog.workspace_id == workspace.id)
        .count()
    )

    successful_syncs = (
        db.query(NotionSyncLog)
        .filter(
            and_(
                NotionSyncLog.workspace_id == workspace.id,
                NotionSyncLog.status == LogStatus.SUCCESS,
            )
        )
        .count()
    )

    failed_syncs = (
        db.query(NotionSyncLog)
        .filter(
            and_(
                NotionSyncLog.workspace_id == workspace.id,
                NotionSyncLog.status == LogStatus.FAILED,
            )
        )
        .count()
    )

    success_rate = (successful_syncs / total_syncs * 100) if total_syncs > 0 else 0

    sync_analytics = {
        "total_syncs": total_syncs,
        "successful_syncs": successful_syncs,
        "failed_syncs": failed_syncs,
        "success_rate": round(success_rate, 2),
        "average_sync_duration_ms": 0,  # TODO: Calculate from logs
    }

    return NotionSyncDashboard(
        workspaces=[workspace],
        sync_status=sync_status,
        recent_logs=recent_logs,
        sync_analytics=sync_analytics,
    )
