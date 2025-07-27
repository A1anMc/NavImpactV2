from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.sustainability import (
    SustainabilityMetric, SustainabilityPolicy, ActionPlan, 
    PerformanceTarget, AssuranceLog
)
from app.schemas.sustainability import (
    SustainabilityMetricCreate, SustainabilityMetricUpdate, SustainabilityMetric,
    SustainabilityPolicyCreate, SustainabilityPolicyUpdate, SustainabilityPolicy,
    ActionPlanCreate, ActionPlanUpdate, ActionPlan,
    PerformanceTargetCreate, PerformanceTargetUpdate, PerformanceTarget,
    AssuranceLogCreate, AssuranceLogUpdate, AssuranceLog,
    SustainabilityOverview, ESRSDashboard, SustainabilityExport
)
from datetime import datetime

router = APIRouter()


# Sustainability Metrics endpoints
@router.get("/metrics", response_model=List[SustainabilityMetric])
def get_sustainability_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    metric_type: Optional[str] = Query(None, description="Filter by ESRS topic"),
    reporting_period: Optional[str] = Query(None, description="Filter by reporting period"),
    project_id: Optional[int] = Query(None, description="Filter by project ID")
):
    """Get sustainability metrics for the organisation"""
    query = db.query(SustainabilityMetric).filter(
        SustainabilityMetric.organisation_id == current_user.id
    )
    
    if metric_type:
        query = query.filter(SustainabilityMetric.metric_type == metric_type)
    if reporting_period:
        query = query.filter(SustainabilityMetric.reporting_period == reporting_period)
    if project_id:
        query = query.filter(SustainabilityMetric.project_id == project_id)
    
    return query.all()


@router.post("/metrics", response_model=SustainabilityMetric)
def create_sustainability_metric(
    metric: SustainabilityMetricCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new sustainability metric"""
    db_metric = SustainabilityMetric(
        **metric.dict(),
        organisation_id=current_user.id
    )
    db.add(db_metric)
    db.commit()
    db.refresh(db_metric)
    return db_metric


@router.put("/metrics/{metric_id}", response_model=SustainabilityMetric)
def update_sustainability_metric(
    metric_id: int,
    metric_update: SustainabilityMetricUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a sustainability metric"""
    db_metric = db.query(SustainabilityMetric).filter(
        SustainabilityMetric.id == metric_id,
        SustainabilityMetric.organisation_id == current_user.id
    ).first()
    
    if not db_metric:
        raise HTTPException(status_code=404, detail="Metric not found")
    
    for field, value in metric_update.dict(exclude_unset=True).items():
        setattr(db_metric, field, value)
    
    db.commit()
    db.refresh(db_metric)
    return db_metric


# Sustainability Policies endpoints
@router.get("/policies", response_model=List[SustainabilityPolicy])
def get_sustainability_policies(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    policy_type: Optional[str] = Query(None, description="Filter by ESRS topic")
):
    """Get sustainability policies for the organisation"""
    query = db.query(SustainabilityPolicy).filter(
        SustainabilityPolicy.organisation_id == current_user.id
    )
    
    if policy_type:
        query = query.filter(SustainabilityPolicy.policy_type == policy_type)
    
    return query.all()


@router.post("/policies", response_model=SustainabilityPolicy)
def create_sustainability_policy(
    policy: SustainabilityPolicyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new sustainability policy"""
    db_policy = SustainabilityPolicy(
        **policy.dict(),
        organisation_id=current_user.id
    )
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy


@router.put("/policies/{policy_id}", response_model=SustainabilityPolicy)
def update_sustainability_policy(
    policy_id: int,
    policy_update: SustainabilityPolicyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a sustainability policy"""
    db_policy = db.query(SustainabilityPolicy).filter(
        SustainabilityPolicy.id == policy_id,
        SustainabilityPolicy.organisation_id == current_user.id
    ).first()
    
    if not db_policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    
    for field, value in policy_update.dict(exclude_unset=True).items():
        setattr(db_policy, field, value)
    
    db.commit()
    db.refresh(db_policy)
    return db_policy


# Action Plans endpoints
@router.get("/action-plans", response_model=List[ActionPlan])
def get_action_plans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    plan_type: Optional[str] = Query(None, description="Filter by ESRS topic"),
    status: Optional[str] = Query(None, description="Filter by status")
):
    """Get action plans for the organisation"""
    query = db.query(ActionPlan).filter(
        ActionPlan.organisation_id == current_user.id
    )
    
    if plan_type:
        query = query.filter(ActionPlan.plan_type == plan_type)
    if status:
        query = query.filter(ActionPlan.status == status)
    
    return query.all()


@router.post("/action-plans", response_model=ActionPlan)
def create_action_plan(
    plan: ActionPlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new action plan"""
    db_plan = ActionPlan(
        **plan.dict(),
        organisation_id=current_user.id
    )
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan


@router.put("/action-plans/{plan_id}", response_model=ActionPlan)
def update_action_plan(
    plan_id: int,
    plan_update: ActionPlanUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an action plan"""
    db_plan = db.query(ActionPlan).filter(
        ActionPlan.id == plan_id,
        ActionPlan.organisation_id == current_user.id
    ).first()
    
    if not db_plan:
        raise HTTPException(status_code=404, detail="Action plan not found")
    
    for field, value in plan_update.dict(exclude_unset=True).items():
        setattr(db_plan, field, value)
    
    db.commit()
    db.refresh(db_plan)
    return db_plan


# Performance Targets endpoints
@router.get("/targets", response_model=List[PerformanceTarget])
def get_performance_targets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    target_type: Optional[str] = Query(None, description="Filter by ESRS topic"),
    status: Optional[str] = Query(None, description="Filter by status")
):
    """Get performance targets for the organisation"""
    query = db.query(PerformanceTarget).filter(
        PerformanceTarget.organisation_id == current_user.id
    )
    
    if target_type:
        query = query.filter(PerformanceTarget.target_type == target_type)
    if status:
        query = query.filter(PerformanceTarget.status == status)
    
    return query.all()


@router.post("/targets", response_model=PerformanceTarget)
def create_performance_target(
    target: PerformanceTargetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new performance target"""
    db_target = PerformanceTarget(
        **target.dict(),
        organisation_id=current_user.id
    )
    db.add(db_target)
    db.commit()
    db.refresh(db_target)
    return db_target


@router.put("/targets/{target_id}", response_model=PerformanceTarget)
def update_performance_target(
    target_id: int,
    target_update: PerformanceTargetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a performance target"""
    db_target = db.query(PerformanceTarget).filter(
        PerformanceTarget.id == target_id,
        PerformanceTarget.organisation_id == current_user.id
    ).first()
    
    if not db_target:
        raise HTTPException(status_code=404, detail="Performance target not found")
    
    for field, value in target_update.dict(exclude_unset=True).items():
        setattr(db_target, field, value)
    
    db.commit()
    db.refresh(db_target)
    return db_target


# Assurance Logs endpoints
@router.get("/assurance", response_model=List[AssuranceLog])
def get_assurance_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    assurance_type: Optional[str] = Query(None, description="Filter by assurance type")
):
    """Get assurance logs for the organisation"""
    query = db.query(AssuranceLog).filter(
        AssuranceLog.organisation_id == current_user.id
    )
    
    if assurance_type:
        query = query.filter(AssuranceLog.assurance_type == assurance_type)
    
    return query.order_by(AssuranceLog.assurance_date.desc()).all()


@router.post("/assurance", response_model=AssuranceLog)
def create_assurance_log(
    assurance: AssuranceLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new assurance log"""
    db_assurance = AssuranceLog(
        **assurance.dict(),
        organisation_id=current_user.id
    )
    db.add(db_assurance)
    db.commit()
    db.refresh(db_assurance)
    return db_assurance


# Dashboard endpoints
@router.get("/overview", response_model=SustainabilityOverview)
def get_sustainability_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get sustainability overview dashboard data"""
    total_metrics = db.query(SustainabilityMetric).filter(
        SustainabilityMetric.organisation_id == current_user.id
    ).count()
    
    verified_metrics = db.query(SustainabilityMetric).filter(
        SustainabilityMetric.organisation_id == current_user.id,
        SustainabilityMetric.verification_status == "verified"
    ).count()
    
    total_policies = db.query(SustainabilityPolicy).filter(
        SustainabilityPolicy.organisation_id == current_user.id
    ).count()
    
    approved_policies = db.query(SustainabilityPolicy).filter(
        SustainabilityPolicy.organisation_id == current_user.id,
        SustainabilityPolicy.approval_status == "approved"
    ).count()
    
    total_action_plans = db.query(ActionPlan).filter(
        ActionPlan.organisation_id == current_user.id
    ).count()
    
    completed_plans = db.query(ActionPlan).filter(
        ActionPlan.organisation_id == current_user.id,
        ActionPlan.status == "completed"
    ).count()
    
    total_targets = db.query(PerformanceTarget).filter(
        PerformanceTarget.organisation_id == current_user.id
    ).count()
    
    achieved_targets = db.query(PerformanceTarget).filter(
        PerformanceTarget.organisation_id == current_user.id,
        PerformanceTarget.status == "achieved"
    ).count()
    
    recent_assurance = db.query(AssuranceLog).filter(
        AssuranceLog.organisation_id == current_user.id
    ).order_by(AssuranceLog.assurance_date.desc()).first()
    
    return SustainabilityOverview(
        total_metrics=total_metrics,
        verified_metrics=verified_metrics,
        total_policies=total_policies,
        approved_policies=approved_policies,
        total_action_plans=total_action_plans,
        completed_plans=completed_plans,
        total_targets=total_targets,
        achieved_targets=achieved_targets,
        recent_assurance=recent_assurance
    )


@router.get("/esrs-dashboard", response_model=ESRSDashboard)
def get_esrs_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get ESRS-aligned dashboard data"""
    # Environment (E1-E5)
    environment = {}
    for topic in ['E1', 'E2', 'E3', 'E4', 'E5']:
        metrics = db.query(SustainabilityMetric).filter(
            SustainabilityMetric.organisation_id == current_user.id,
            SustainabilityMetric.metric_type == topic
        ).count()
        policies = db.query(SustainabilityPolicy).filter(
            SustainabilityPolicy.organisation_id == current_user.id,
            SustainabilityPolicy.policy_type == topic
        ).count()
        action_plans = db.query(ActionPlan).filter(
            ActionPlan.organisation_id == current_user.id,
            ActionPlan.plan_type == topic
        ).count()
        targets = db.query(PerformanceTarget).filter(
            PerformanceTarget.organisation_id == current_user.id,
            PerformanceTarget.target_type == topic
        ).count()
        
        environment[topic] = {
            'metrics': metrics,
            'policies': policies,
            'action_plans': action_plans,
            'targets': targets
        }
    
    # Social (S1-S4)
    social = {}
    for topic in ['S1', 'S2', 'S3', 'S4']:
        metrics = db.query(SustainabilityMetric).filter(
            SustainabilityMetric.organisation_id == current_user.id,
            SustainabilityMetric.metric_type == topic
        ).count()
        policies = db.query(SustainabilityPolicy).filter(
            SustainabilityPolicy.organisation_id == current_user.id,
            SustainabilityPolicy.policy_type == topic
        ).count()
        action_plans = db.query(ActionPlan).filter(
            ActionPlan.organisation_id == current_user.id,
            ActionPlan.plan_type == topic
        ).count()
        targets = db.query(PerformanceTarget).filter(
            PerformanceTarget.organisation_id == current_user.id,
            PerformanceTarget.target_type == topic
        ).count()
        
        social[topic] = {
            'metrics': metrics,
            'policies': policies,
            'action_plans': action_plans,
            'targets': targets
        }
    
    # Governance (G1-G3)
    governance = {}
    for topic in ['G1', 'G2', 'G3']:
        metrics = db.query(SustainabilityMetric).filter(
            SustainabilityMetric.organisation_id == current_user.id,
            SustainabilityMetric.metric_type == topic
        ).count()
        policies = db.query(SustainabilityPolicy).filter(
            SustainabilityPolicy.organisation_id == current_user.id,
            SustainabilityPolicy.policy_type == topic
        ).count()
        action_plans = db.query(ActionPlan).filter(
            ActionPlan.organisation_id == current_user.id,
            ActionPlan.plan_type == topic
        ).count()
        targets = db.query(PerformanceTarget).filter(
            PerformanceTarget.organisation_id == current_user.id,
            PerformanceTarget.target_type == topic
        ).count()
        
        governance[topic] = {
            'metrics': metrics,
            'policies': policies,
            'action_plans': action_plans,
            'targets': targets
        }
    
    return ESRSDashboard(
        environment=environment,
        social=social,
        governance=governance
    )


# Export endpoint
@router.get("/export", response_model=SustainabilityExport)
def export_sustainability_data(
    format: str = Query("xhtml", description="Export format: xhtml, json, csv"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Export sustainability data in specified format"""
    metrics = db.query(SustainabilityMetric).filter(
        SustainabilityMetric.organisation_id == current_user.id
    ).all()
    
    policies = db.query(SustainabilityPolicy).filter(
        SustainabilityPolicy.organisation_id == current_user.id
    ).all()
    
    action_plans = db.query(ActionPlan).filter(
        ActionPlan.organisation_id == current_user.id
    ).all()
    
    performance_targets = db.query(PerformanceTarget).filter(
        PerformanceTarget.organisation_id == current_user.id
    ).all()
    
    assurance_logs = db.query(AssuranceLog).filter(
        AssuranceLog.organisation_id == current_user.id
    ).all()
    
    return SustainabilityExport(
        organisation_name=current_user.organisation_name or "Unknown",
        reporting_period="2024",
        metrics=metrics,
        policies=policies,
        action_plans=action_plans,
        performance_targets=performance_targets,
        assurance_logs=assurance_logs,
        export_date=datetime.now(),
        export_format=format
    ) 