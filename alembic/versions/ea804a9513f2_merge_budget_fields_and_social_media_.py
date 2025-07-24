"""Merge budget fields and social media fields

Revision ID: ea804a9513f2
Revises: add_budget_fields, add_social_media_fields
Create Date: 2025-07-24 13:41:52.782295

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ea804a9513f2'
down_revision: Union[str, None] = ('add_budget_fields', 'add_social_media_fields')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
