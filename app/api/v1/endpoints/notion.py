import logging
from typing import List, Optional

from app.db.session import get_db
from app.schemas.notion import NotionConnection, NotionSync, NotionUpdate
from app.services.notion_service import NotionService
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/connections", response_model=List[NotionConnection])
async def get_notion_connections(db: Session = Depends(get_db)):
    """
    Get all Notion connections for SGE
    """
    try:
        notion_service = NotionService(db)
        connections = notion_service.get_connections()
        return connections
    except Exception as e:
        logger.error(f"Error fetching Notion connections: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch Notion connections",
        )


@router.post("/connect", response_model=NotionConnection)
async def connect_notion_database(
    database_id: str, database_name: str, db: Session = Depends(get_db)
):
    """
    Connect a new Notion database to SGE
    """
    try:
        notion_service = NotionService(db)
        connection = notion_service.connect_database(database_id, database_name)
        return connection
    except Exception as e:
        logger.error(f"Error connecting Notion database: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect Notion database",
        )


@router.get("/sync/{connection_id}", response_model=NotionSync)
async def sync_notion_connection(connection_id: int, db: Session = Depends(get_db)):
    """
    Sync a specific Notion connection
    """
    try:
        notion_service = NotionService(db)
        sync_result = notion_service.sync_connection(connection_id)
        return sync_result
    except Exception as e:
        logger.error(f"Error syncing Notion connection: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to sync Notion connection",
        )


@router.get("/updates", response_model=List[NotionUpdate])
async def get_recent_updates(db: Session = Depends(get_db)):
    """
    Get recent updates from Notion
    """
    try:
        notion_service = NotionService(db)
        updates = notion_service.get_recent_updates()
        return updates
    except Exception as e:
        logger.error(f"Error fetching Notion updates: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch Notion updates",
        )


@router.delete("/disconnect/{connection_id}")
async def disconnect_notion(connection_id: int, db: Session = Depends(get_db)):
    """
    Disconnect a Notion database
    """
    try:
        notion_service = NotionService(db)
        notion_service.disconnect_database(connection_id)
        return {"message": "Notion database disconnected successfully"}
    except Exception as e:
        logger.error(f"Error disconnecting Notion database: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to disconnect Notion database",
        )


@router.get("/health")
async def notion_health_check(db: Session = Depends(get_db)):
    """
    Health check for Notion integration
    """
    try:
        notion_service = NotionService(db)
        health_status = notion_service.health_check()
        return health_status
    except Exception as e:
        logger.error(f"Error checking Notion health: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Notion integration health check failed",
        )
