from app.db.base_class import Base
from sqlalchemy import (Column, Date, DateTime, Float, ForeignKey, Index,
                        Integer, String, Text)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class SustainabilityMetric(Base):
    __tablename__ = "sustainability_metrics"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    organisation_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    metric_type = Column(
        String, nullable=False
    )  # E1, E2, E3, E4, E5, S1, S2, S3, S4, G1, G2, G3
    metric_name = Column(String, nullable=False)
    metric_value = Column(Float, nullable=True)
    unit = Column(String, nullable=True)
    reporting_period = Column(String, nullable=False)  # 2024, 2023, etc.
    scope = Column(String, nullable=True)  # 1, 2, 3 for emissions
    data_source = Column(String, nullable=True)
    verification_status = Column(String, nullable=True)  # verified, pending, unverified
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    project = relationship("Project", back_populates="sustainability_metrics")
    organisation = relationship("User", back_populates="sustainability_metrics")

    __table_args__ = (
        Index("ix_sustainability_metrics_project_id", "project_id"),
        Index("ix_sustainability_metrics_organisation_id", "organisation_id"),
        Index("ix_sustainability_metrics_metric_type", "metric_type"),
        Index("ix_sustainability_metrics_reporting_period", "reporting_period"),
    )


class SustainabilityPolicy(Base):
    __tablename__ = "sustainability_policies"

    id = Column(Integer, primary_key=True, index=True)
    organisation_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    policy_type = Column(
        String, nullable=False
    )  # E1, E2, E3, E4, E5, S1, S2, S3, S4, G1, G2, G3
    policy_name = Column(String, nullable=False)
    policy_description = Column(Text, nullable=True)
    policy_content = Column(Text, nullable=True)
    document_url = Column(String, nullable=True)
    effective_date = Column(Date, nullable=True)
    review_date = Column(Date, nullable=True)
    approval_status = Column(String, nullable=True)  # draft, approved, under_review
    version = Column(String, nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    organisation = relationship("User", back_populates="sustainability_policies")

    __table_args__ = (
        Index("ix_sustainability_policies_organisation_id", "organisation_id"),
        Index("ix_sustainability_policies_policy_type", "policy_type"),
    )


class ActionPlan(Base):
    __tablename__ = "action_plans"

    id = Column(Integer, primary_key=True, index=True)
    organisation_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_type = Column(
        String, nullable=False
    )  # E1, E2, E3, E4, E5, S1, S2, S3, S4, G1, G2, G3
    plan_name = Column(String, nullable=False)
    plan_description = Column(Text, nullable=True)
    target_value = Column(Float, nullable=True)
    target_year = Column(Integer, nullable=True)
    baseline_value = Column(Float, nullable=True)
    baseline_year = Column(Integer, nullable=True)
    progress_percentage = Column(Float, nullable=True)
    status = Column(
        String, nullable=True
    )  # not_started, in_progress, completed, delayed
    responsible_party = Column(String, nullable=True)
    budget = Column(Float, nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    organisation = relationship("User", back_populates="action_plans")

    __table_args__ = (
        Index("ix_action_plans_organisation_id", "organisation_id"),
        Index("ix_action_plans_plan_type", "plan_type"),
    )


class PerformanceTarget(Base):
    __tablename__ = "performance_targets"

    id = Column(Integer, primary_key=True, index=True)
    organisation_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_type = Column(
        String, nullable=False
    )  # E1, E2, E3, E4, E5, S1, S2, S3, S4, G1, G2, G3
    target_name = Column(String, nullable=False)
    target_description = Column(Text, nullable=True)
    target_value = Column(Float, nullable=True)
    target_year = Column(Integer, nullable=True)
    current_value = Column(Float, nullable=True)
    unit = Column(String, nullable=True)
    status = Column(String, nullable=True)  # on_track, at_risk, off_track, achieved
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    organisation = relationship("User", back_populates="performance_targets")

    __table_args__ = (
        Index("ix_performance_targets_organisation_id", "organisation_id"),
        Index("ix_performance_targets_target_type", "target_type"),
    )


class AssuranceLog(Base):
    __tablename__ = "assurance_logs"

    id = Column(Integer, primary_key=True, index=True)
    organisation_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assurance_type = Column(
        String, nullable=False
    )  # internal_audit, external_audit, verification
    assurance_scope = Column(
        String, nullable=True
    )  # E1, E2, E3, E4, E5, S1, S2, S3, S4, G1, G2, G3
    assurance_date = Column(Date, nullable=True)
    assurance_provider = Column(String, nullable=True)
    assurance_standard = Column(String, nullable=True)  # ISAE 3000, AA1000, etc.
    assurance_opinion = Column(
        String, nullable=True
    )  # reasonable_assurance, limited_assurance, qualified
    assurance_report_url = Column(String, nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    organisation = relationship("User", back_populates="assurance_logs")

    __table_args__ = (
        Index("ix_assurance_logs_organisation_id", "organisation_id"),
        Index("ix_assurance_logs_assurance_type", "assurance_type"),
    )
