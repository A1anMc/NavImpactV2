"""Add user profile fields

Revision ID: 20250127_user_profile
Revises: 001_fresh_database_setup
Create Date: 2025-01-27 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '20250127_user_profile'
down_revision = '001_fresh_database_setup'
branch_labels = None
depends_on = None


def upgrade():
    """Add profile fields to users table."""
    # Add new profile columns with default values to avoid breaking existing data
    op.add_column('users', sa.Column('bio', sa.Text(), nullable=True))
    op.add_column('users', sa.Column('avatar_url', sa.String(length=500), nullable=True))
    op.add_column('users', sa.Column('job_title', sa.String(length=200), nullable=True))
    op.add_column('users', sa.Column('organisation', sa.String(length=200), nullable=True))
    op.add_column('users', sa.Column('phone', sa.String(length=50), nullable=True))
    op.add_column('users', sa.Column('location', sa.String(length=200), nullable=True))
    op.add_column('users', sa.Column('timezone', sa.String(length=50), nullable=True))
    op.add_column('users', sa.Column('current_status', sa.String(length=50), nullable=True, server_default='available'))
    op.add_column('users', sa.Column('skills', postgresql.ARRAY(sa.String()), nullable=True, server_default='{}'))
    op.add_column('users', sa.Column('interests', postgresql.ARRAY(sa.String()), nullable=True, server_default='{}'))
    op.add_column('users', sa.Column('social_links', postgresql.JSONB(), nullable=True, server_default='{}'))
    op.add_column('users', sa.Column('is_intern', sa.Boolean(), nullable=True, server_default='false'))
    op.add_column('users', sa.Column('mentor_id', sa.Integer(), nullable=True))
    op.add_column('users', sa.Column('preferences', postgresql.JSONB(), nullable=True, server_default='{}'))
    
    # Add foreign key constraint for mentor_id
    op.create_foreign_key(
        'fk_users_mentor_id_users',
        'users', 'users',
        ['mentor_id'], ['id'],
        ondelete='SET NULL'
    )


def downgrade():
    """Remove profile fields from users table."""
    # Remove foreign key constraint first
    op.drop_constraint('fk_users_mentor_id_users', 'users', type_='foreignkey')
    
    # Remove columns
    op.drop_column('users', 'preferences')
    op.drop_column('users', 'mentor_id')
    op.drop_column('users', 'is_intern')
    op.drop_column('users', 'social_links')
    op.drop_column('users', 'interests')
    op.drop_column('users', 'skills')
    op.drop_column('users', 'current_status')
    op.drop_column('users', 'timezone')
    op.drop_column('users', 'location')
    op.drop_column('users', 'phone')
    op.drop_column('users', 'organisation')
    op.drop_column('users', 'job_title')
    op.drop_column('users', 'avatar_url')
    op.drop_column('users', 'bio') 