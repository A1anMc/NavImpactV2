"""Add budget fields to projects table

Revision ID: add_budget_fields
Revises: 8eac3573d2af
Create Date: 2025-07-24 03:45:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_budget_fields'
down_revision = '8eac3573d2af'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add budget fields to projects table
    op.add_column('projects', sa.Column('budget', sa.Float(), nullable=True))
    op.add_column('projects', sa.Column('budget_currency', sa.String(3), nullable=False, server_default='AUD'))


def downgrade() -> None:
    # Remove budget fields from projects table
    op.drop_column('projects', 'budget_currency')
    op.drop_column('projects', 'budget') 