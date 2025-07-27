"""Add comprehensive sustainability and governance tables

Revision ID: 20250127_sustainability
Revises: cb5f20225865
Create Date: 2025-01-27 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '20250127_sustainability'
down_revision = 'cb5f20225865'
branch_labels = None
depends_on = None


def upgrade():
    # Create sustainability_metrics table
    op.create_table('sustainability_metrics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('project_id', sa.Integer(), nullable=True),
        sa.Column('organisation_id', sa.Integer(), nullable=True),
        sa.Column('metric_type', sa.String(), nullable=False),  # E1, E2, E3, E4, E5, S1, S2, S3, S4, G1, G2, G3
        sa.Column('metric_name', sa.String(), nullable=False),
        sa.Column('metric_value', sa.Float(), nullable=True),
        sa.Column('unit', sa.String(), nullable=True),
        sa.Column('reporting_period', sa.String(), nullable=False),  # 2024, 2023, etc.
        sa.Column('scope', sa.String(), nullable=True),  # 1, 2, 3 for emissions
        sa.Column('data_source', sa.String(), nullable=True),
        sa.Column('verification_status', sa.String(), nullable=True),  # verified, pending, unverified
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ),
        sa.ForeignKeyConstraint(['organisation_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create sustainability_policies table
    op.create_table('sustainability_policies',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('organisation_id', sa.Integer(), nullable=False),
        sa.Column('policy_type', sa.String(), nullable=False),  # E1, E2, E3, E4, E5, S1, S2, S3, S4, G1, G2, G3
        sa.Column('policy_name', sa.String(), nullable=False),
        sa.Column('policy_description', sa.Text(), nullable=True),
        sa.Column('policy_content', sa.Text(), nullable=True),
        sa.Column('document_url', sa.String(), nullable=True),
        sa.Column('effective_date', sa.Date(), nullable=True),
        sa.Column('review_date', sa.Date(), nullable=True),
        sa.Column('approval_status', sa.String(), nullable=True),  # draft, approved, under_review
        sa.Column('version', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['organisation_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create action_plans table
    op.create_table('action_plans',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('organisation_id', sa.Integer(), nullable=False),
        sa.Column('plan_type', sa.String(), nullable=False),  # E1, E2, E3, E4, E5, S1, S2, S3, S4, G1, G2, G3
        sa.Column('plan_name', sa.String(), nullable=False),
        sa.Column('plan_description', sa.Text(), nullable=True),
        sa.Column('target_value', sa.Float(), nullable=True),
        sa.Column('target_year', sa.Integer(), nullable=True),
        sa.Column('baseline_value', sa.Float(), nullable=True),
        sa.Column('baseline_year', sa.Integer(), nullable=True),
        sa.Column('progress_percentage', sa.Float(), nullable=True),
        sa.Column('status', sa.String(), nullable=True),  # not_started, in_progress, completed, delayed
        sa.Column('responsible_party', sa.String(), nullable=True),
        sa.Column('budget', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['organisation_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create performance_targets table
    op.create_table('performance_targets',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('organisation_id', sa.Integer(), nullable=False),
        sa.Column('target_type', sa.String(), nullable=False),  # E1, E2, E3, E4, E5, S1, S2, S3, S4, G1, G2, G3
        sa.Column('target_name', sa.String(), nullable=False),
        sa.Column('target_description', sa.Text(), nullable=True),
        sa.Column('target_value', sa.Float(), nullable=True),
        sa.Column('target_year', sa.Integer(), nullable=True),
        sa.Column('current_value', sa.Float(), nullable=True),
        sa.Column('unit', sa.String(), nullable=True),
        sa.Column('status', sa.String(), nullable=True),  # on_track, at_risk, off_track, achieved
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['organisation_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create assurance_logs table
    op.create_table('assurance_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('organisation_id', sa.Integer(), nullable=False),
        sa.Column('assurance_type', sa.String(), nullable=False),  # internal_audit, external_audit, verification
        sa.Column('assurance_scope', sa.String(), nullable=True),  # E1, E2, E3, E4, E5, S1, S2, S3, S4, G1, G2, G3
        sa.Column('assurance_date', sa.Date(), nullable=True),
        sa.Column('assurance_provider', sa.String(), nullable=True),
        sa.Column('assurance_standard', sa.String(), nullable=True),  # ISAE 3000, AA1000, etc.
        sa.Column('assurance_opinion', sa.String(), nullable=True),  # reasonable_assurance, limited_assurance, qualified
        sa.Column('assurance_report_url', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['organisation_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes for better performance
    op.create_index('ix_sustainability_metrics_project_id', 'sustainability_metrics', ['project_id'])
    op.create_index('ix_sustainability_metrics_organisation_id', 'sustainability_metrics', ['organisation_id'])
    op.create_index('ix_sustainability_metrics_metric_type', 'sustainability_metrics', ['metric_type'])
    op.create_index('ix_sustainability_metrics_reporting_period', 'sustainability_metrics', ['reporting_period'])
    
    op.create_index('ix_sustainability_policies_organisation_id', 'sustainability_policies', ['organisation_id'])
    op.create_index('ix_sustainability_policies_policy_type', 'sustainability_policies', ['policy_type'])
    
    op.create_index('ix_action_plans_organisation_id', 'action_plans', ['organisation_id'])
    op.create_index('ix_action_plans_plan_type', 'action_plans', ['plan_type'])
    
    op.create_index('ix_performance_targets_organisation_id', 'performance_targets', ['organisation_id'])
    op.create_index('ix_performance_targets_target_type', 'performance_targets', ['target_type'])
    
    op.create_index('ix_assurance_logs_organisation_id', 'assurance_logs', ['organisation_id'])
    op.create_index('ix_assurance_logs_assurance_type', 'assurance_logs', ['assurance_type'])


def downgrade():
    # Drop indexes
    op.drop_index('ix_assurance_logs_assurance_type', 'assurance_logs')
    op.drop_index('ix_assurance_logs_organisation_id', 'assurance_logs')
    op.drop_index('ix_performance_targets_target_type', 'performance_targets')
    op.drop_index('ix_performance_targets_organisation_id', 'performance_targets')
    op.drop_index('ix_action_plans_plan_type', 'action_plans')
    op.drop_index('ix_action_plans_organisation_id', 'action_plans')
    op.drop_index('ix_sustainability_policies_policy_type', 'sustainability_policies')
    op.drop_index('ix_sustainability_policies_organisation_id', 'sustainability_policies')
    op.drop_index('ix_sustainability_metrics_reporting_period', 'sustainability_metrics')
    op.drop_index('ix_sustainability_metrics_metric_type', 'sustainability_metrics')
    op.drop_index('ix_sustainability_metrics_organisation_id', 'sustainability_metrics')
    op.drop_index('ix_sustainability_metrics_project_id', 'sustainability_metrics')
    
    # Drop tables
    op.drop_table('assurance_logs')
    op.drop_table('performance_targets')
    op.drop_table('action_plans')
    op.drop_table('sustainability_policies')
    op.drop_table('sustainability_metrics') 