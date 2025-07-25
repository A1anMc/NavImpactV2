"""add impact fields to existing projects table

Revision ID: 04099c36d06e
Revises: a12cd859af35
Create Date: 2025-07-25 13:58:18.968042

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '04099c36d06e'
down_revision: Union[str, None] = '78a037b8fda0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add impact fields to existing projects table
    op.add_column('projects', sa.Column('outcome_text', sa.Text(), nullable=True))
    op.add_column('projects', sa.Column('impact_statement', sa.Text(), nullable=True))
    op.add_column('projects', sa.Column('impact_types', postgresql.JSONB(), nullable=True))
    op.add_column('projects', sa.Column('sdg_tags', postgresql.JSONB(), nullable=True))
    op.add_column('projects', sa.Column('evidence_sources', sa.Text(), nullable=True))


def downgrade() -> None:
    # Remove impact fields from projects table
    op.drop_column('projects', 'evidence_sources')
    op.drop_column('projects', 'sdg_tags')
    op.drop_column('projects', 'impact_types')
    op.drop_column('projects', 'impact_statement')
    op.drop_column('projects', 'outcome_text')
