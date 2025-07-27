"""Add Notion Integration Tables

Revision ID: 20250127_add_notion_integration
Revises: 20250127_add_sge_media_module
Create Date: 2025-01-27 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '20250127_add_notion_integration'
down_revision = '20250127_sge_media'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create notion_workspaces table
    op.create_table('notion_workspaces',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('workspace_id', sa.String(length=255), nullable=False),
        sa.Column('workspace_name', sa.String(length=255), nullable=False),
        sa.Column('access_token', sa.Text(), nullable=False),
        sa.Column('bot_user_id', sa.String(length=255), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('workspace_id')
    )
    
    # Create notion_sync_mappings table
    op.create_table('notion_sync_mappings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('media_project_id', sa.Integer(), nullable=True),
        sa.Column('notion_page_id', sa.String(length=255), nullable=False),
        sa.Column('notion_database_id', sa.String(length=255), nullable=True),
        sa.Column('sync_direction', sa.String(length=20), nullable=False, default='bidirectional'),
        sa.Column('last_sync_at', sa.DateTime(), nullable=True),
        sa.Column('sync_status', sa.String(length=50), nullable=False, default='pending'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['media_project_id'], ['sge_media_projects.id'], ondelete='CASCADE')
    )
    
    # Create notion_sync_logs table
    op.create_table('notion_sync_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('workspace_id', sa.Integer(), nullable=True),
        sa.Column('operation_type', sa.String(length=50), nullable=False),
        sa.Column('entity_type', sa.String(length=50), nullable=False),
        sa.Column('entity_id', sa.String(length=255), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('sync_duration_ms', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['workspace_id'], ['notion_workspaces.id'], ondelete='CASCADE')
    )
    
    # Create indexes for better performance
    op.create_index('ix_notion_workspaces_workspace_id', 'notion_workspaces', ['workspace_id'])
    op.create_index('ix_notion_workspaces_is_active', 'notion_workspaces', ['is_active'])
    op.create_index('ix_notion_sync_mappings_media_project_id', 'notion_sync_mappings', ['media_project_id'])
    op.create_index('ix_notion_sync_mappings_notion_page_id', 'notion_sync_mappings', ['notion_page_id'])
    op.create_index('ix_notion_sync_mappings_sync_status', 'notion_sync_mappings', ['sync_status'])
    op.create_index('ix_notion_sync_logs_workspace_id', 'notion_sync_logs', ['workspace_id'])
    op.create_index('ix_notion_sync_logs_created_at', 'notion_sync_logs', ['created_at'])
    op.create_index('ix_notion_sync_logs_status', 'notion_sync_logs', ['status'])


def downgrade() -> None:
    # Drop indexes
    op.drop_index('ix_notion_sync_logs_status', table_name='notion_sync_logs')
    op.drop_index('ix_notion_sync_logs_created_at', table_name='notion_sync_logs')
    op.drop_index('ix_notion_sync_logs_workspace_id', table_name='notion_sync_logs')
    op.drop_index('ix_notion_sync_mappings_sync_status', table_name='notion_sync_mappings')
    op.drop_index('ix_notion_sync_mappings_notion_page_id', table_name='notion_sync_mappings')
    op.drop_index('ix_notion_sync_mappings_media_project_id', table_name='notion_sync_mappings')
    op.drop_index('ix_notion_workspaces_is_active', table_name='notion_workspaces')
    op.drop_index('ix_notion_workspaces_workspace_id', table_name='notion_workspaces')
    
    # Drop tables
    op.drop_table('notion_sync_logs')
    op.drop_table('notion_sync_mappings')
    op.drop_table('notion_workspaces') 