"""add_framework_alignment_to_projects

Revision ID: a22c34952d55
Revises: 04099c36d06e
Create Date: 2025-07-25 14:53:49.638337

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'a22c34952d55'
down_revision: Union[str, None] = '04099c36d06e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add framework_alignment column to projects table
    op.add_column('projects', sa.Column('framework_alignment', postgresql.JSONB(), nullable=True))


def downgrade() -> None:
    # Remove framework_alignment column from projects table
    op.drop_column('projects', 'framework_alignment')
