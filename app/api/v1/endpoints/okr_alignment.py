"""
OKR Alignment API Endpoints
Provides OKR tracking, alignment analysis, and strategic insights
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional

from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.models.project import Project
from app.services.okr_alignment_service import OKRAlignmentService

router = APIRouter()


@router.get("/dashboard")
async def get_okr_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get comprehensive OKR dashboard data."""
    try:
        okr_service = OKRAlignmentService(db)
        result = okr_service.get_okr_dashboard_data()
        
        if result["success"]:
            return {
                "status": "success",
                "data": result["dashboard_data"],
                "message": "OKR dashboard data retrieved successfully"
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["error"]
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving OKR dashboard: {str(e)}"
        )


@router.get("/portfolio-alignment")
async def get_portfolio_okr_alignment(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get OKR alignment across the entire project portfolio."""
    try:
        okr_service = OKRAlignmentService(db)
        result = okr_service.get_portfolio_okr_alignment()
        
        if result["success"]:
            return {
                "status": "success",
                "data": result["portfolio_analysis"],
                "message": "Portfolio OKR alignment retrieved successfully"
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["error"]
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving portfolio OKR alignment: {str(e)}"
        )


@router.get("/project-alignment/{project_id}")
async def get_project_okr_alignment(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get OKR alignment analysis for a specific project."""
    try:
        # Verify project exists
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        okr_service = OKRAlignmentService(db)
        result = okr_service.analyze_project_okr_alignment(project_id)
        
        if result["success"]:
            return {
                "status": "success",
                "data": result["analysis"],
                "message": "Project OKR alignment analysis retrieved successfully"
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["error"]
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing project OKR alignment: {str(e)}"
        )


@router.get("/insights")
async def get_okr_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get OKR insights and recommendations."""
    try:
        okr_service = OKRAlignmentService(db)
        result = okr_service.generate_okr_insights()
        
        if result["success"]:
            return {
                "status": "success",
                "data": result["insights"],
                "message": "OKR insights retrieved successfully"
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["error"]
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving OKR insights: {str(e)}"
        )


@router.post("/create")
async def create_okr(
    okr_data: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new OKR."""
    try:
        okr_service = OKRAlignmentService(db)
        result = okr_service.create_okr(okr_data)
        
        if result["success"]:
            return {
                "status": "success",
                "data": result["okr"],
                "message": "OKR created successfully"
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["error"]
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating OKR: {str(e)}"
        )


@router.post("/track-progress/{okr_id}")
async def track_okr_progress(
    okr_id: str,
    metrics: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Track progress for a specific OKR."""
    try:
        okr_service = OKRAlignmentService(db)
        result = okr_service.track_okr_progress(okr_id, metrics)
        
        if result["success"]:
            return {
                "status": "success",
                "data": result,
                "message": "OKR progress tracked successfully"
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["error"]
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error tracking OKR progress: {str(e)}"
        )


@router.get("/alignment-summary")
async def get_okr_alignment_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a summary of OKR alignment across the organization."""
    try:
        okr_service = OKRAlignmentService(db)
        
        # Get portfolio alignment
        portfolio_result = okr_service.get_portfolio_okr_alignment()
        insights_result = okr_service.generate_okr_insights()
        
        if portfolio_result["success"] and insights_result["success"]:
            summary = {
                "portfolio_score": portfolio_result["portfolio_analysis"]["overall_portfolio_score"],
                "total_projects": portfolio_result["portfolio_analysis"]["total_projects"],
                "top_aligned_projects": len(portfolio_result["portfolio_analysis"]["top_aligned_projects"]),
                "needs_attention_projects": len(portfolio_result["portfolio_analysis"]["needs_attention_projects"]),
                "key_insights": insights_result["insights"]["recommendations"][:3],  # Top 3 recommendations
                "status": "excellent" if portfolio_result["portfolio_analysis"]["overall_portfolio_score"] > 80 else "good" if portfolio_result["portfolio_analysis"]["overall_portfolio_score"] > 60 else "needs_improvement"
            }
            
            return {
                "status": "success",
                "data": summary,
                "message": "OKR alignment summary retrieved successfully"
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error generating alignment summary"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving OKR alignment summary: {str(e)}"
        ) 