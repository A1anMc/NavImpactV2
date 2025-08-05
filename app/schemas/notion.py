from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class NotionConnectionType(str, Enum):
    DATABASE = "database"
    PAGE = "page"
    WORKSPACE = "workspace"


class NotionConnectionStatus(str, Enum):
    CONNECTED = "connected"
    PENDING = "pending"
    DISCONNECTED = "disconnected"
    ERROR = "error"


class NotionUpdateType(str, Enum):
    CREATE = "create"
    UPDATE = "update"
    DELETE = "delete"
    COMMENT = "comment"


class NotionConnection(BaseModel):
    id: int
    name: str
    type: NotionConnectionType
    status: NotionConnectionStatus
    database_id: Optional[str] = None
    workspace_id: Optional[str] = None
    description: Optional[str] = None
    items_count: int = 0
    last_sync: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class NotionUpdate(BaseModel):
    id: int
    title: str
    type: NotionUpdateType
    database_name: str
    user_name: str
    timestamp: datetime
    description: Optional[str] = None

    class Config:
        from_attributes = True


class NotionSync(BaseModel):
    connection_id: int
    items_synced: int
    sync_time: datetime
    status: str
    errors: List[str] = []

    class Config:
        from_attributes = True


class NotionConnectionCreate(BaseModel):
    name: str = Field(..., description="Name of the Notion connection")
    type: NotionConnectionType
    database_id: Optional[str] = Field(None, description="Notion database ID")
    workspace_id: Optional[str] = Field(None, description="Notion workspace ID")
    description: Optional[str] = Field(
        None, description="Description of the connection"
    )


class NotionConnectionUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[NotionConnectionStatus] = None


class NotionHealthStatus(BaseModel):
    status: str
    connected_databases: int
    total_items: int
    last_sync: Optional[datetime] = None
    errors: List[str] = []
