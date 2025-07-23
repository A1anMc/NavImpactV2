"""Add social media platform fields to industry_news table

Revision ID: add_social_media_fields
Revises: add_industry_news_table
Create Date: 2025-01-23 07:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_social_media_fields'
down_revision = 'add_industry_news_table'
branch_labels = None
depends_on = None


def upgrade():
    # Add social media platform fields
    op.add_column('industry_news', sa.Column('platform', sa.String(50), nullable=True))
    op.add_column('industry_news', sa.Column('platform_icon', sa.String(50), nullable=True))
    
    # Create index on platform field
    op.create_index('idx_industry_news_platform', 'industry_news', ['platform'])


def downgrade():
    # Remove index
    op.drop_index('idx_industry_news_platform', table_name='industry_news')
    
    # Remove columns
    op.drop_column('industry_news', 'platform_icon')
    op.drop_column('industry_news', 'platform') 