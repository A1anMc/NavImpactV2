"""add_budget_fields_to_projects

Revision ID: 40819d945340
Revises: ea804a9513f2
Create Date: 2025-07-24 15:33:44.131269

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '40819d945340'
down_revision: Union[str, None] = 'ea804a9513f2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add budget column
    op.add_column('projects', sa.Column('budget', sa.Float(), nullable=True))
    
    # Add budget_currency column with default value
    op.add_column('projects', sa.Column('budget_currency', sa.String(3), nullable=False, server_default='AUD'))


def downgrade() -> None:
    # Remove budget_currency column
    op.drop_column('projects', 'budget_currency')
    
    # Remove budget column
    op.drop_column('projects', 'budget')
