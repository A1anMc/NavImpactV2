"""Sync framework_alignment column - NOOP

Revision ID: 1ffe76cfe5a3
Revises: 79e689dd04bc
Create Date: 2025-07-25 15:35:12.072871

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1ffe76cfe5a3'
down_revision: Union[str, None] = '79e689dd04bc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
