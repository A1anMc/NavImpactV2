"""Add SGE Media Module Tables

Revision ID: sge_media_v1
Revises: 001_fresh_database_setup
Create Date: 2025-01-27 13:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "sge_media_v1"
down_revision = "001_fresh_database_setup"
branch_labels = None
depends_on = None


def upgrade():
    # Create SGE Media Projects table
    op.create_table("sge_media_projects",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("project_id", sa.Integer(), nullable=True),
        sa.Column("media_type", sa.String(length=50), nullable=False),
        sa.Column("duration", sa.String(length=20), nullable=True),
        sa.Column("release_date", sa.Date(), nullable=True),
        sa.Column("target_audience", postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column("contributors", postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column("production_budget", sa.Numeric(precision=10, scale=2), nullable=True),
        sa.Column("thumbnail_url", sa.String(length=500), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id")
    )
    
    # Create Distribution Tracking table
    op.create_table("sge_distribution_logs",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("media_project_id", sa.Integer(), nullable=False),
        sa.Column("platform", sa.String(length=100), nullable=False),
        sa.Column("url", sa.Text(), nullable=True),
        sa.Column("publish_date", sa.Date(), nullable=True),
        sa.Column("views", sa.Integer(), nullable=True),
        sa.Column("reach", sa.Integer(), nullable=True),
        sa.Column("engagement_rate", sa.Numeric(precision=5, scale=2), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id")
    )
    
    # Create Performance Metrics table
    op.create_table("sge_performance_metrics",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("media_project_id", sa.Integer(), nullable=False),
        sa.Column("metric_date", sa.Date(), nullable=False),
        sa.Column("views", sa.Integer(), nullable=True),
        sa.Column("unique_viewers", sa.Integer(), nullable=True),
        sa.Column("watch_time_minutes", sa.Integer(), nullable=True),
        sa.Column("engagement_rate", sa.Numeric(precision=5, scale=2), nullable=True),
        sa.Column("shares", sa.Integer(), nullable=True),
        sa.Column("comments", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id")
    )
    
    # Create Impact Stories table
    op.create_table("sge_impact_stories",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("media_project_id", sa.Integer(), nullable=False),
        sa.Column("story_type", sa.String(length=50), nullable=True),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("stakeholder_name", sa.String(length=200), nullable=True),
        sa.Column("stakeholder_organisation", sa.String(length=200), nullable=True),
        sa.Column("impact_date", sa.Date(), nullable=True),
        sa.Column("quantifiable_outcome", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id")
    )
    
    # Create Client Access table
    op.create_table("sge_client_access",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("client_name", sa.String(length=200), nullable=False),
        sa.Column("client_email", sa.String(length=200), nullable=False),
        sa.Column("access_level", sa.String(length=50), nullable=True),
        sa.Column("allowed_projects", postgresql.ARRAY(sa.Integer()), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("client_email")
    )


def downgrade():
    op.drop_table("sge_client_access")
    op.drop_table("sge_impact_stories")
    op.drop_table("sge_performance_metrics")
    op.drop_table("sge_distribution_logs")
    op.drop_table("sge_media_projects")

