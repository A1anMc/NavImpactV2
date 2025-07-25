"""add_framework_alignment_to_projects

Revision ID: 79e689dd04bc
Revises: a22c34952d55
Create Date: 2025-07-25 15:22:12.328011

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '79e689dd04bc'
down_revision: Union[str, None] = 'a22c34952d55'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add framework_alignment column to projects table
    op.add_column('projects', sa.Column('framework_alignment', sa.JSON(), nullable=True))


def downgrade() -> None:
    # Remove framework_alignment column from projects table
    op.drop_column('projects', 'framework_alignment')
