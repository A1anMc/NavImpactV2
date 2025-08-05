from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, Field


# Base schemas
class SustainabilityMetricBase(BaseModel):
    metric_type: str = Field(
        ..., description="ESRS topic: E1, E2, E3, E4, E5, S1, S2, S3, S4, G1, G2, G3"
    )
    metric_name: str = Field(..., description="Name of the metric")
    metric_value: Optional[float] = Field(
        None, description="Numeric value of the metric"
    )
    unit: Optional[str] = Field(None, description="Unit of measurement")
    reporting_period: str = Field(..., description="Reporting period (e.g., 2024)")
    scope: Optional[str] = Field(None, description="Scope for emissions (1, 2, 3)")
    data_source: Optional[str] = Field(None, description="Source of the data")
    verification_status: Optional[str] = Field(None, description="verification status")


class SustainabilityPolicyBase(BaseModel):
    policy_type: str = Field(
        ..., description="ESRS topic: E1, E2, E3, E4, E5, S1, S2, S3, S4, G1, G2, G3"
    )
    policy_name: str = Field(..., description="Name of the policy")
    policy_description: Optional[str] = Field(
        None, description="Description of the policy"
    )
    policy_content: Optional[str] = Field(None, description="Content of the policy")
    document_url: Optional[str] = Field(None, description="URL to policy document")
    effective_date: Optional[date] = Field(
        None, description="Effective date of the policy"
    )
    review_date: Optional[date] = Field(None, description="Next review date")
    approval_status: Optional[str] = Field(
        None, description="draft, approved, under_review"
    )
    version: Optional[str] = Field(None, description="Policy version")


class ActionPlanBase(BaseModel):
    plan_type: str = Field(
        ..., description="ESRS topic: E1, E2, E3, E4, E5, S1, S2, S3, S4, G1, G2, G3"
    )
    plan_name: str = Field(..., description="Name of the action plan")
    plan_description: Optional[str] = Field(None, description="Description of the plan")
    target_value: Optional[float] = Field(None, description="Target value")
    target_year: Optional[int] = Field(None, description="Target year")
    baseline_value: Optional[float] = Field(None, description="Baseline value")
    baseline_year: Optional[int] = Field(None, description="Baseline year")
    progress_percentage: Optional[float] = Field(
        None, description="Progress percentage"
    )
    status: Optional[str] = Field(
        None, description="not_started, in_progress, completed, delayed"
    )
    responsible_party: Optional[str] = Field(None, description="Responsible party")
    budget: Optional[float] = Field(None, description="Budget allocated")


class PerformanceTargetBase(BaseModel):
    target_type: str = Field(
        ..., description="ESRS topic: E1, E2, E3, E4, E5, S1, S2, S3, S4, G1, G2, G3"
    )
    target_name: str = Field(..., description="Name of the target")
    target_description: Optional[str] = Field(
        None, description="Description of the target"
    )
    target_value: Optional[float] = Field(None, description="Target value")
    target_year: Optional[int] = Field(None, description="Target year")
    current_value: Optional[float] = Field(None, description="Current value")
    unit: Optional[str] = Field(None, description="Unit of measurement")
    status: Optional[str] = Field(
        None, description="on_track, at_risk, off_track, achieved"
    )


class AssuranceLogBase(BaseModel):
    assurance_type: str = Field(
        ..., description="internal_audit, external_audit, verification"
    )
    assurance_scope: Optional[str] = Field(None, description="ESRS topic scope")
    assurance_date: Optional[date] = Field(None, description="Date of assurance")
    assurance_provider: Optional[str] = Field(None, description="Assurance provider")
    assurance_standard: Optional[str] = Field(
        None, description="Assurance standard used"
    )
    assurance_opinion: Optional[str] = Field(
        None, description="reasonable_assurance, limited_assurance, qualified"
    )
    assurance_report_url: Optional[str] = Field(
        None, description="URL to assurance report"
    )


# Create schemas
class SustainabilityMetricCreate(SustainabilityMetricBase):
    project_id: Optional[int] = Field(None, description="Associated project ID")
    organisation_id: Optional[int] = Field(None, description="Organisation ID")


class SustainabilityPolicyCreate(SustainabilityPolicyBase):
    organisation_id: int = Field(..., description="Organisation ID")


class ActionPlanCreate(ActionPlanBase):
    organisation_id: int = Field(..., description="Organisation ID")


class PerformanceTargetCreate(PerformanceTargetBase):
    organisation_id: int = Field(..., description="Organisation ID")


class AssuranceLogCreate(AssuranceLogBase):
    organisation_id: int = Field(..., description="Organisation ID")


# Update schemas
class SustainabilityMetricUpdate(BaseModel):
    metric_value: Optional[float] = None
    unit: Optional[str] = None
    data_source: Optional[str] = None
    verification_status: Optional[str] = None


class SustainabilityPolicyUpdate(BaseModel):
    policy_description: Optional[str] = None
    policy_content: Optional[str] = None
    document_url: Optional[str] = None
    effective_date: Optional[date] = None
    review_date: Optional[date] = None
    approval_status: Optional[str] = None
    version: Optional[str] = None


class ActionPlanUpdate(BaseModel):
    plan_description: Optional[str] = None
    target_value: Optional[float] = None
    target_year: Optional[int] = None
    progress_percentage: Optional[float] = None
    status: Optional[str] = None
    responsible_party: Optional[str] = None
    budget: Optional[float] = None


class PerformanceTargetUpdate(BaseModel):
    target_description: Optional[str] = None
    target_value: Optional[float] = None
    target_year: Optional[int] = None
    current_value: Optional[float] = None
    unit: Optional[str] = None
    status: Optional[str] = None


class AssuranceLogUpdate(BaseModel):
    assurance_scope: Optional[str] = None
    assurance_date: Optional[date] = None
    assurance_provider: Optional[str] = None
    assurance_standard: Optional[str] = None
    assurance_opinion: Optional[str] = None
    assurance_report_url: Optional[str] = None


# Response schemas
class SustainabilityMetric(SustainabilityMetricBase):
    id: int
    project_id: Optional[int]
    organisation_id: Optional[int]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SustainabilityPolicy(SustainabilityPolicyBase):
    id: int
    organisation_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ActionPlan(ActionPlanBase):
    id: int
    organisation_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PerformanceTarget(PerformanceTargetBase):
    id: int
    organisation_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AssuranceLog(AssuranceLogBase):
    id: int
    organisation_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Dashboard schemas
class SustainabilityOverview(BaseModel):
    total_metrics: int
    verified_metrics: int
    total_policies: int
    approved_policies: int
    total_action_plans: int
    completed_plans: int
    total_targets: int
    achieved_targets: int
    recent_assurance: Optional[AssuranceLog] = None


class ESRSDashboard(BaseModel):
    environment: dict = Field(..., description="E1-E5 metrics and status")
    social: dict = Field(..., description="S1-S4 metrics and status")
    governance: dict = Field(..., description="G1-G3 metrics and status")


# Export schemas
class SustainabilityExport(BaseModel):
    organisation_name: str
    reporting_period: str
    metrics: List[SustainabilityMetric]
    policies: List[SustainabilityPolicy]
    action_plans: List[ActionPlan]
    performance_targets: List[PerformanceTarget]
    assurance_logs: List[AssuranceLog]
    export_date: datetime
    export_format: str = Field(..., description="xhtml, json, csv")
