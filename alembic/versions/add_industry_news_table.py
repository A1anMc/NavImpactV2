"""Add industry news table

Revision ID: add_industry_news_table
Revises: 04d7b4977e0c
Create Date: 2025-01-22 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_industry_news_table'
down_revision = '04d7b4977e0c'
branch_labels = None
depends_on = None


def upgrade():
    # Create industry_news table
    op.create_table('industry_news',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('sector', sa.String(length=100), nullable=False),
        sa.Column('title', sa.Text(), nullable=False),
        sa.Column('summary', sa.Text(), nullable=True),
        sa.Column('url', sa.Text(), nullable=False),
        sa.Column('url_hash', sa.String(length=32), nullable=False),
        sa.Column('source', sa.String(length=200), nullable=True),
        sa.Column('relevance_score', sa.DECIMAL(precision=3, scale=2), nullable=True),
        sa.Column('published_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes
    op.create_index(op.f('ix_industry_news_sector'), 'industry_news', ['sector'], unique=False)
    op.create_index(op.f('ix_industry_news_url_hash'), 'industry_news', ['url_hash'], unique=True)
    op.create_index('idx_industry_news_sector_published', 'industry_news', ['sector', 'published_at'], unique=False)
    op.create_index('idx_industry_news_relevance', 'industry_news', ['relevance_score'], unique=False)
    op.create_index('idx_industry_news_created', 'industry_news', ['created_at'], unique=False)


def downgrade():
    # Drop indexes
    op.drop_index('idx_industry_news_created', table_name='industry_news')
    op.drop_index('idx_industry_news_relevance', table_name='industry_news')
    op.drop_index('idx_industry_news_sector_published', table_name='industry_news')
    op.drop_index(op.f('ix_industry_news_url_hash'), table_name='industry_news')
    op.drop_index(op.f('ix_industry_news_sector'), table_name='industry_news')
    
    # Drop table
    op.drop_table('industry_news') 