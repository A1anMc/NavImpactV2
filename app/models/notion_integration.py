"""
Notion Integration Models
Handles workspace connections, sync mappings, and sync logs for Notion integration
"""

from app.db.base_class import Base
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class NotionWorkspace(Base):
    """Notion workspace connection model."""

    __tablename__ = "notion_workspaces"

    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(String(255), unique=True, nullable=False, index=True)
    workspace_name = Column(String(255), nullable=False)
    access_token = Column(Text, nullable=False)  # Encrypted in production
    bot_user_id = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    sync_mappings = relationship("NotionSyncMapping", back_populates="workspace")
    sync_logs = relationship("NotionSyncLog", back_populates="workspace")

    def __repr__(self):
        return f"<NotionWorkspace(id={self.id}, workspace_id='{self.workspace_id}', name='{self.workspace_name}')>"


class NotionSyncMapping(Base):
    """Mapping between NavImpact entities and Notion pages/databases."""

    __tablename__ = "notion_sync_mappings"

    id = Column(Integer, primary_key=True, index=True)
    media_project_id = Column(
        Integer,
        ForeignKey("sge_media_projects.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    notion_page_id = Column(String(255), nullable=False, index=True)
    notion_database_id = Column(String(255), nullable=True)
    sync_direction = Column(
        String(20), default="bidirectional", nullable=False
    )  # 'navimpact_to_notion', 'notion_to_navimpact', 'bidirectional'
    last_sync_at = Column(DateTime(timezone=True), nullable=True)
    sync_status = Column(
        String(50), default="pending", nullable=False, index=True
    )  # 'pending', 'syncing', 'completed', 'failed'
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    workspace = relationship("NotionWorkspace", back_populates="sync_mappings")
    media_project = relationship("SgeMediaProject", backref="notion_mappings")

    def __repr__(self):
        return f"<NotionSyncMapping(id={self.id}, project_id={self.media_project_id}, notion_page_id='{self.notion_page_id}')>"


class NotionSyncLog(Base):
    """Log of sync operations for monitoring and debugging."""

    __tablename__ = "notion_sync_logs"

    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(
        Integer,
        ForeignKey("notion_workspaces.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    operation_type = Column(
        String(50), nullable=False
    )  # 'create_page', 'update_page', 'delete_page', 'sync_project', etc.
    entity_type = Column(
        String(50), nullable=False
    )  # 'media_project', 'distribution_log', 'performance_metrics', etc.
    entity_id = Column(String(255), nullable=True)
    status = Column(
        String(50), nullable=False, index=True
    )  # 'success', 'failed', 'partial'
    error_message = Column(Text, nullable=True)
    sync_duration_ms = Column(Integer, nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, index=True
    )

    # Relationships
    workspace = relationship("NotionWorkspace", back_populates="sync_logs")

    def __repr__(self):
        return f"<NotionSyncLog(id={self.id}, operation='{self.operation_type}', status='{self.status}')>"


# Create indexes for better performance
Index("ix_notion_workspaces_workspace_id", NotionWorkspace.workspace_id)
Index("ix_notion_workspaces_is_active", NotionWorkspace.is_active)
Index("ix_notion_sync_mappings_media_project_id", NotionSyncMapping.media_project_id)
Index("ix_notion_sync_mappings_notion_page_id", NotionSyncMapping.notion_page_id)
Index("ix_notion_sync_mappings_sync_status", NotionSyncMapping.sync_status)
Index("ix_notion_sync_logs_workspace_id", NotionSyncLog.workspace_id)
Index("ix_notion_sync_logs_created_at", NotionSyncLog.created_at)
Index("ix_notion_sync_logs_status", NotionSyncLog.status)
