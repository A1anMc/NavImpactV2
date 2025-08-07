"""SGE Media Module API Endpoints

This module contains all the API endpoints for the SGE Media Management module.
These endpoints provide CRUD operations and specialized functionality for media projects.
"""

from datetime import date, datetime
from typing import List, Optional

from app.core.deps import get_current_user, get_db
from app.models.sge_media import (SgeClientAccess, SgeDistributionLog,
                                  SgeImpactStory, SgeMediaProject,
                                  SgePerformanceMetrics)
from app.models.user import User
from app.schemas.sge_media import (MediaDashboardResponse,
                                   MediaImpactReportResponse,
                                   SgeClientAccessCreate,
                                   SgeClientAccessResponse,
                                   SgeDistributionLogCreate,
                                   SgeDistributionLogResponse,
                                   SgeImpactStoryCreate,
                                   SgeImpactStoryResponse,
                                   SgeMediaProjectCreate,
                                   SgeMediaProjectResponse,
                                   SgeMediaProjectUpdate,
                                   SgePerformanceMetricsCreate,
                                   SgePerformanceMetricsResponse)
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

router = APIRouter()


# Media Projects Endpoints
@router.post("/media-projects/", response_model=SgeMediaProjectResponse)
async def create_media_project(
    media_project: SgeMediaProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new SGE media project."""
    try:
        db_media_project = SgeMediaProject(**media_project.model_dump())
        db.add(db_media_project)
        db.commit()
        db.refresh(db_media_project)
        return db_media_project
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400, detail=f"Failed to create media project: {str(e)}"
        )


@router.get("/media-projects/", response_model=List[SgeMediaProjectResponse])
async def get_media_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    media_type: Optional[str] = Query(None),
    project_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all SGE media projects with optional filtering."""
    query = db.query(SgeMediaProject)

    if media_type:
        query = query.filter(SgeMediaProject.media_type == media_type)
    if project_id:
        query = query.filter(SgeMediaProject.project_id == project_id)

    media_projects = query.offset(skip).limit(limit).all()
    return media_projects


@router.get(
    "/media-projects/{media_project_id}", response_model=SgeMediaProjectResponse
)
async def get_media_project(
    media_project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific SGE media project by ID."""
    media_project = (
        db.query(SgeMediaProject).filter(SgeMediaProject.id == media_project_id).first()
    )
    if not media_project:
        raise HTTPException(status_code=404, detail="Media project not found")
    return media_project


@router.put(
    "/media-projects/{media_project_id}", response_model=SgeMediaProjectResponse
)
async def update_media_project(
    media_project_id: int,
    media_project_update: SgeMediaProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an SGE media project."""
    db_media_project = (
        db.query(SgeMediaProject).filter(SgeMediaProject.id == media_project_id).first()
    )
    if not db_media_project:
        raise HTTPException(status_code=404, detail="Media project not found")

    update_data = media_project_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_media_project, field, value)

    db_media_project.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_media_project)
    return db_media_project


@router.delete("/media-projects/{media_project_id}")
async def delete_media_project(
    media_project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete an SGE media project."""
    db_media_project = (
        db.query(SgeMediaProject).filter(SgeMediaProject.id == media_project_id).first()
    )
    if not db_media_project:
        raise HTTPException(status_code=404, detail="Media project not found")

    db.delete(db_media_project)
    db.commit()
    return {"message": "Media project deleted successfully"}


# Distribution Logs Endpoints
@router.post("/distribution-logs/", response_model=SgeDistributionLogResponse)
async def add_distribution_log(
    log: SgeDistributionLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Add a new distribution log entry."""
    try:
        db_log = SgeDistributionLog(**log.model_dump())
        db.add(db_log)
        db.commit()
        db.refresh(db_log)
        return db_log
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400, detail=f"Failed to create distribution log: {str(e)}"
        )


@router.get("/distribution-logs/", response_model=List[SgeDistributionLogResponse])
async def get_distribution_logs(
    media_project_id: Optional[int] = Query(None),
    platform: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get distribution logs with optional filtering."""
    query = db.query(SgeDistributionLog)

    if media_project_id:
        query = query.filter(SgeDistributionLog.media_project_id == media_project_id)
    if platform:
        query = query.filter(SgeDistributionLog.platform == platform)

    logs = query.offset(skip).limit(limit).all()
    return logs


# Performance Metrics Endpoints
@router.post("/performance-metrics/", response_model=SgePerformanceMetricsResponse)
async def add_performance_metrics(
    metrics: SgePerformanceMetricsCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Add performance metrics for a media project."""
    try:
        db_metrics = SgePerformanceMetrics(**metrics.model_dump())
        db.add(db_metrics)
        db.commit()
        db.refresh(db_metrics)
        return db_metrics
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400, detail=f"Failed to create performance metrics: {str(e)}"
        )


@router.get("/performance-metrics/", response_model=List[SgePerformanceMetricsResponse])
async def get_performance_metrics(
    media_project_id: Optional[int] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get performance metrics with optional filtering."""
    query = db.query(SgePerformanceMetrics)

    if media_project_id:
        query = query.filter(SgePerformanceMetrics.media_project_id == media_project_id)
    if start_date:
        query = query.filter(SgePerformanceMetrics.metric_date >= start_date)
    if end_date:
        query = query.filter(SgePerformanceMetrics.metric_date <= end_date)

    metrics = query.offset(skip).limit(limit).all()
    return metrics


# Impact Stories Endpoints
@router.post("/impact-stories/", response_model=SgeImpactStoryResponse)
async def add_impact_story(
    story: SgeImpactStoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Add an impact story for a media project."""
    try:
        db_story = SgeImpactStory(**story.model_dump())
        db.add(db_story)
        db.commit()
        db.refresh(db_story)
        return db_story
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400, detail=f"Failed to create impact story: {str(e)}"
        )


@router.get("/impact-stories/", response_model=List[SgeImpactStoryResponse])
async def get_impact_stories(
    media_project_id: Optional[int] = Query(None),
    story_type: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get impact stories with optional filtering."""
    query = db.query(SgeImpactStory)

    if media_project_id:
        query = query.filter(SgeImpactStory.media_project_id == media_project_id)
    if story_type:
        query = query.filter(SgeImpactStory.story_type == story_type)

    stories = query.offset(skip).limit(limit).all()
    return stories


# Client Access Endpoints
@router.post("/client-access/", response_model=SgeClientAccessResponse)
async def create_client_access(
    client_access: SgeClientAccessCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create new client access."""
    try:
        db_client_access = SgeClientAccess(**client_access.model_dump())
        db.add(db_client_access)
        db.commit()
        db.refresh(db_client_access)
        return db_client_access
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400, detail=f"Failed to create client access: {str(e)}"
        )


@router.get("/client-access/", response_model=List[SgeClientAccessResponse])
async def get_client_access(
    is_active: Optional[bool] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get client access records with optional filtering."""
    query = db.query(SgeClientAccess)

    if is_active is not None:
        query = query.filter(SgeClientAccess.is_active == is_active)

    client_access = query.offset(skip).limit(limit).all()
    return client_access


# Dashboard and Reports Endpoints
@router.get("/dashboard/", response_model=MediaDashboardResponse)
async def get_media_dashboard(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Get SGE media dashboard data."""
    try:
        # Get basic counts
        total_projects = db.query(SgeMediaProject).count()
        total_views = (
            db.query(SgePerformanceMetrics.views)
            .filter(SgePerformanceMetrics.views.isnot(None))
            .scalar()
            or 0
        )
        active_distributions = db.query(SgeDistributionLog).count()
        impact_stories = db.query(SgeImpactStory).count()

        # Get recent projects
        recent_projects = (
            db.query(SgeMediaProject)
            .order_by(SgeMediaProject.created_at.desc())
            .limit(5)
            .all()
        )

        # Get recent stories
        recent_stories = (
            db.query(SgeImpactStory)
            .order_by(SgeImpactStory.created_at.desc())
            .limit(5)
            .all()
        )

        # Placeholder for chart data (would be implemented with actual aggregation queries)
        distribution_data = {
            "platforms": ["YouTube", "Vimeo", "Social"],
            "counts": [10, 5, 8],
        }
        performance_data = {"dates": ["2025-01-01", "2025-01-02"], "views": [100, 150]}

        return MediaDashboardResponse(
            total_projects=total_projects,
            total_views=total_views,
            active_distributions=active_distributions,
            impact_stories=impact_stories,
            recent_projects=recent_projects,
            distribution_data=distribution_data,
            performance_data=performance_data,
            recent_stories=recent_stories,
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get dashboard data: {str(e)}"
        )


@router.get("/impact-report/{project_id}", response_model=MediaImpactReportResponse)
async def get_media_impact_report(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Generate impact report for a specific media project."""
    try:
        # Get project details
        from app.models.project import Project

        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        # Get media projects for this project
        media_projects = (
            db.query(SgeMediaProject)
            .filter(SgeMediaProject.project_id == project_id)
            .all()
        )

        # Calculate totals
        total_views = 0
        total_engagement = 0
        for mp in media_projects:
            metrics = (
                db.query(SgePerformanceMetrics)
                .filter(SgePerformanceMetrics.media_project_id == mp.id)
                .all()
            )
            for metric in metrics:
                total_views += metric.views or 0
                total_engagement += metric.engagement_rate or 0

        # Get impact stories
        impact_stories = []
        for mp in media_projects:
            stories = (
                db.query(SgeImpactStory)
                .filter(SgeImpactStory.media_project_id == mp.id)
                .all()
            )
            impact_stories.extend(stories)

        # Placeholder data for summaries
        distribution_summary = {"platforms": 3, "total_distributions": 15}
        performance_summary = {
            "avg_views": total_views // len(media_projects) if media_projects else 0
        }

        return MediaImpactReportResponse(
            project_id=project_id,
            project_name=project.name,
            media_projects=media_projects,
            total_views=total_views,
            total_engagement=total_engagement,
            distribution_summary=distribution_summary,
            performance_summary=performance_summary,
            impact_stories=impact_stories,
            funding_impact="Generated $50,000 in additional funding opportunities",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate impact report: {str(e)}"
        )
