from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import logging
from app.schemas.notion import (
    NotionConnection, 
    NotionUpdate, 
    NotionSync, 
    NotionHealthStatus,
    NotionConnectionCreate,
    NotionConnectionUpdate
)

logger = logging.getLogger(__name__)

class NotionService:
    def __init__(self, db: Session):
        self.db = db

    def get_connections(self) -> List[NotionConnection]:
        """
        Get all Notion connections for SGE
        """
        # Mock data for now - replace with actual database queries
        connections = [
            {
                "id": 1,
                "name": "SGE Production Hub",
                "type": "database",
                "status": "connected",
                "database_id": "prod_hub_123",
                "workspace_id": "sge_workspace",
                "description": "Main production database with scripts, schedules, and team info",
                "items_count": 156,
                "last_sync": datetime.now() - timedelta(minutes=2),
                "created_at": datetime.now() - timedelta(days=30),
                "updated_at": datetime.now() - timedelta(minutes=2),
            },
            {
                "id": 2,
                "name": "Wild Hearts Project",
                "type": "page",
                "status": "connected",
                "database_id": "wild_hearts_456",
                "workspace_id": "sge_workspace",
                "description": "Project-specific page with script drafts and production notes",
                "items_count": 23,
                "last_sync": datetime.now() - timedelta(minutes=5),
                "created_at": datetime.now() - timedelta(days=15),
                "updated_at": datetime.now() - timedelta(minutes=5),
            },
            {
                "id": 3,
                "name": "Around the Table Series",
                "type": "database",
                "status": "connected",
                "database_id": "around_table_789",
                "workspace_id": "sge_workspace",
                "description": "Series development database with episode outlines and character development",
                "items_count": 89,
                "last_sync": datetime.now() - timedelta(hours=1),
                "created_at": datetime.now() - timedelta(days=20),
                "updated_at": datetime.now() - timedelta(hours=1),
            },
            {
                "id": 4,
                "name": "Impact Measurement",
                "type": "database",
                "status": "pending",
                "database_id": "impact_measurement_101",
                "workspace_id": "sge_workspace",
                "description": "Impact tracking and measurement data",
                "items_count": 0,
                "last_sync": None,
                "created_at": datetime.now() - timedelta(days=5),
                "updated_at": datetime.now() - timedelta(days=5),
            },
        ]
        
        return [NotionConnection(**conn) for conn in connections]

    def connect_database(self, database_id: str, database_name: str) -> NotionConnection:
        """
        Connect a new Notion database to SGE
        """
        # Mock implementation - replace with actual Notion API integration
        connection = {
            "id": len(self.get_connections()) + 1,
            "name": database_name,
            "type": "database",
            "status": "connected",
            "database_id": database_id,
            "workspace_id": "sge_workspace",
            "description": f"Connected Notion database: {database_name}",
            "items_count": 0,
            "last_sync": datetime.now(),
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
        }
        
        logger.info(f"Connected Notion database: {database_name} (ID: {database_id})")
        return NotionConnection(**connection)

    def sync_connection(self, connection_id: int) -> NotionSync:
        """
        Sync a specific Notion connection
        """
        # Mock implementation - replace with actual Notion API sync
        sync_result = {
            "connection_id": connection_id,
            "items_synced": 25,
            "sync_time": datetime.now(),
            "status": "success",
            "errors": [],
        }
        
        logger.info(f"Synced Notion connection {connection_id}: {sync_result['items_synced']} items")
        return NotionSync(**sync_result)

    def get_recent_updates(self) -> List[NotionUpdate]:
        """
        Get recent updates from Notion
        """
        # Mock data - replace with actual Notion API calls
        updates = [
            {
                "id": 1,
                "title": "Wild Hearts - Scene 12 Revision",
                "type": "update",
                "database_name": "SGE Production Hub",
                "user_name": "Shamita Siva",
                "timestamp": datetime.now() - timedelta(minutes=2),
                "description": "Updated scene 12 with new dialogue and blocking",
            },
            {
                "id": 2,
                "title": "Around the Table - Episode 3 Outline",
                "type": "create",
                "database_name": "Around the Table Series",
                "user_name": "Ash Dorman",
                "timestamp": datetime.now() - timedelta(minutes=15),
                "description": "Created new episode outline with character development",
            },
            {
                "id": 3,
                "title": "Production Schedule - Q2 2025",
                "type": "update",
                "database_name": "SGE Production Hub",
                "user_name": "Mish Rep",
                "timestamp": datetime.now() - timedelta(hours=1),
                "description": "Updated production schedule with new timelines",
            },
            {
                "id": 4,
                "title": "Client Feedback - The Last Line",
                "type": "comment",
                "database_name": "SGE Production Hub",
                "user_name": "Ursula Searle",
                "timestamp": datetime.now() - timedelta(hours=3),
                "description": "Added client feedback notes for The Last Line project",
            },
        ]
        
        return [NotionUpdate(**update) for update in updates]

    def disconnect_database(self, connection_id: int) -> bool:
        """
        Disconnect a Notion database
        """
        # Mock implementation - replace with actual database operations
        logger.info(f"Disconnected Notion database: {connection_id}")
        return True

    def health_check(self) -> NotionHealthStatus:
        """
        Health check for Notion integration
        """
        connections = self.get_connections()
        connected_count = len([c for c in connections if c.status == "connected"])
        total_items = sum(c.items_count for c in connections)
        
        health_status = {
            "status": "healthy" if connected_count > 0 else "unhealthy",
            "connected_databases": connected_count,
            "total_items": total_items,
            "last_sync": datetime.now() if connected_count > 0 else None,
            "errors": [],
        }
        
        return NotionHealthStatus(**health_status)

    def create_connection(self, connection_data: NotionConnectionCreate) -> NotionConnection:
        """
        Create a new Notion connection
        """
        # Mock implementation - replace with actual database operations
        connection = {
            "id": len(self.get_connections()) + 1,
            "name": connection_data.name,
            "type": connection_data.type,
            "status": "pending",
            "database_id": connection_data.database_id,
            "workspace_id": connection_data.workspace_id,
            "description": connection_data.description,
            "items_count": 0,
            "last_sync": None,
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
        }
        
        logger.info(f"Created new Notion connection: {connection_data.name}")
        return NotionConnection(**connection)

    def update_connection(self, connection_id: int, update_data: NotionConnectionUpdate) -> NotionConnection:
        """
        Update an existing Notion connection
        """
        # Mock implementation - replace with actual database operations
        connections = self.get_connections()
        connection = next((c for c in connections if c.id == connection_id), None)
        
        if not connection:
            raise ValueError(f"Connection {connection_id} not found")
        
        # Update fields
        if update_data.name:
            connection.name = update_data.name
        if update_data.description:
            connection.description = update_data.description
        if update_data.status:
            connection.status = update_data.status
        
        connection.updated_at = datetime.now()
        
        logger.info(f"Updated Notion connection: {connection_id}")
        return connection 