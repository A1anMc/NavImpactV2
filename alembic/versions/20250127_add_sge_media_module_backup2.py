"""Add SGE Media Module (Simplified)

Revision ID: 20250127_sge_media_simple
Revises: 001_fresh_database_setup
Create Date: 2025-01-27 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '20250127_sge_media'
down_revision = '001_fresh_database_setup'
branch_labels = None
depends_on = None


def upgrade():
    print("Starting SGE Media Module migration...")
    # Create SGE Media Projects table (without foreign key initially)
    op.create_table('sge_media_projects',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('project_id', sa.Integer(), nullable=True),  # Make nullable initially
        sa.Column('media_type', sa.String(length=50), nullable=False),
        sa.Column('duration', sa.String(length=20), nullable=True),
        sa.Column('release_date', sa.Date(), nullable=True),
        sa.Column('target_audience', postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column('contributors', postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column('production_budget', sa.Numeric(precision=10, scale=2), nullable=True),
        sa.Column('thumbnail_url', sa.String(length=500), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create Distribution Tracking table
    op.create_table('sge_distribution_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('media_project_id', sa.Integer(), nullable=False),
        sa.Column('platform', sa.String(length=100), nullable=False),
        sa.Column('url', sa.Text(), nullable=True),
        sa.Column('publish_date', sa.Date(), nullable=True),
        sa.Column('views', sa.Integer(), nullable=True),
        sa.Column('reach', sa.Integer(), nullable=True),
        sa.Column('engagement_rate', sa.Numeric(precision=5, scale=2), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create Performance Metrics table
    op.create_table('sge_performance_metrics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('media_project_id', sa.Integer(), nullable=False),
        sa.Column('metric_date', sa.Date(), nullable=False),
        sa.Column('views', sa.Integer(), nullable=True),
        sa.Column('unique_viewers', sa.Integer(), nullable=True),
        sa.Column('watch_time_minutes', sa.Integer(), nullable=True),
        sa.Column('engagement_rate', sa.Numeric(precision=5, scale=2), nullable=True),
        sa.Column('shares', sa.Integer(), nullable=True),
        sa.Column('comments', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create Impact Stories table
    op.create_table('sge_impact_stories',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('media_project_id', sa.Integer(), nullable=False),
        sa.Column('story_type', sa.String(length=50), nullable=True),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('stakeholder_name', sa.String(length=200), nullable=True),
        sa.Column('stakeholder_organisation', sa.String(length=200), nullable=True),
        sa.Column('impact_date', sa.Date(), nullable=True),
        sa.Column('quantifiable_outcome', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create Client Access table
    op.create_table('sge_client_access',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('client_name', sa.String(length=200), nullable=False),
        sa.Column('client_email', sa.String(length=200), nullable=False),
        sa.Column('access_level', sa.String(length=50), nullable=True),
        sa.Column('allowed_projects', postgresql.ARRAY(sa.Integer()), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('client_email')
    )
    
    # Create indexes for better performance
    op.create_index(op.f('ix_sge_media_projects_project_id'), 'sge_media_projects', ['project_id'], unique=False)
    op.create_index(op.f('ix_sge_media_projects_media_type'), 'sge_media_projects', ['media_type'], unique=False)
    op.create_index(op.f('ix_sge_distribution_logs_media_project_id'), 'sge_distribution_logs', ['media_project_id'], unique=False)
    op.create_index(op.f('ix_sge_distribution_logs_platform'), 'sge_distribution_logs', ['platform'], unique=False)
    op.create_index(op.f('ix_sge_performance_metrics_media_project_id'), 'sge_performance_metrics', ['media_project_id'], unique=False)
    op.create_index(op.f('ix_sge_performance_metrics_metric_date'), 'sge_performance_metrics', ['metric_date'], unique=False)
    op.create_index(op.f('ix_sge_impact_stories_media_project_id'), 'sge_impact_stories', ['media_project_id'], unique=False)
    op.create_index(op.f('ix_sge_impact_stories_story_type'), 'sge_impact_stories', ['story_type'], unique=False)
    
    print("SGE Media Module migration completed successfully!")


def downgrade():
    # Drop indexes
    op.drop_index(op.f('ix_sge_impact_stories_story_type'), table_name='sge_impact_stories')
    op.drop_index(op.f('ix_sge_impact_stories_media_project_id'), table_name='sge_impact_stories')
    op.drop_index(op.f('ix_sge_performance_metrics_metric_date'), table_name='sge_performance_metrics')
    op.drop_index(op.f('ix_sge_performance_metrics_media_project_id'), table_name='sge_performance_metrics')
    op.drop_index(op.f('ix_sge_distribution_logs_platform'), table_name='sge_distribution_logs')
    op.drop_index(op.f('ix_sge_distribution_logs_media_project_id'), table_name='sge_distribution_logs')
    op.drop_index(op.f('ix_sge_media_projects_media_type'), table_name='sge_media_projects')
    op.drop_index(op.f('ix_sge_media_projects_project_id'), table_name='sge_media_projects')
    
    # Drop tables
    op.drop_table('sge_client_access')
    op.drop_table('sge_impact_stories')
    op.drop_table('sge_performance_metrics')
    op.drop_table('sge_distribution_logs')
    op.drop_table('sge_media_projects') 