import logging
from typing import List, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.services.impact_measurement import ImpactMeasurementService

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/impact/baseline/{project_id}")
async def establish_baseline(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Establish baseline impact metrics for a project."""
    try:
        impact_service = ImpactMeasurementService(db)
        baseline = impact_service.establish_baseline(project_id)
        return baseline
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error establishing baseline: {e}")
        raise HTTPException(status_code=500, detail="Failed to establish baseline")

@router.post("/impact/measure/{project_id}")
async def measure_impact(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Measure current impact metrics for a project."""
    try:
        impact_service = ImpactMeasurementService(db)
        current_metrics = impact_service.measure_current_impact(project_id)
        return current_metrics
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error measuring impact: {e}")
        raise HTTPException(status_code=500, detail="Failed to measure impact")

@router.get("/impact/gap/{project_id}")
async def get_impact_gap(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get impact gap analysis for a project."""
    try:
        impact_service = ImpactMeasurementService(db)
        gap_analysis = impact_service.calculate_impact_gap(project_id)
        return gap_analysis
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error calculating impact gap: {e}")
        raise HTTPException(status_code=500, detail="Failed to calculate impact gap")

@router.get("/impact/forecast/{project_id}")
async def get_impact_forecast(
    project_id: int,
    months_ahead: int = 6,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get impact forecast for a project."""
    try:
        impact_service = ImpactMeasurementService(db)
        forecast = impact_service.predict_impact_forecast(project_id, months_ahead)
        return forecast
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error generating forecast: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate forecast")

@router.get("/impact/report/{project_id}")
async def get_impact_report(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get comprehensive impact report for a project."""
    try:
        impact_service = ImpactMeasurementService(db)
        report = impact_service.generate_impact_report(project_id)
        return report
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error generating report: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate report")

@router.get("/impact/dashboard")
async def get_impact_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get impact dashboard overview."""
    try:
        impact_service = ImpactMeasurementService(db)
        
        # Get all projects for current user
        projects = db.query(Project).filter(Project.owner_id == current_user.id).all()
        
        dashboard_data = {
            "total_projects": len(projects),
            "projects_with_baseline": 0,
            "projects_with_current_metrics": 0,
            "average_impact_score": 0.0,
            "top_impact_areas": [],
            "recent_improvements": []
        }
        
        total_impact_score = 0
        impact_areas = []
        
        for project in projects:
            try:
                # Check if baseline exists
                if project.id in impact_service.baseline_metrics:
                    dashboard_data["projects_with_baseline"] += 1
                    
                # Check if current metrics exist
                if project.id in impact_service.current_metrics:
                    dashboard_data["projects_with_current_metrics"] += 1
                    current = impact_service.current_metrics[project.id]
                    
                    # Calculate average impact score
                    avg_score = sum(current["metrics"].values()) / len(current["metrics"])
                    total_impact_score += avg_score
                    
                    # Collect impact areas
                    if project.impact_types:
                        impact_areas.extend(project.impact_types)
                        
            except Exception as e:
                logger.error(f"Error processing project {project.id}: {e}")
                continue
                
        if dashboard_data["projects_with_current_metrics"] > 0:
            dashboard_data["average_impact_score"] = total_impact_score / dashboard_data["projects_with_current_metrics"]
            
        # Get top impact areas
        from collections import Counter
        if impact_areas:
            area_counts = Counter(impact_areas)
            dashboard_data["top_impact_areas"] = [area for area, count in area_counts.most_common(5)]
            
        return dashboard_data
        
    except Exception as e:
        logger.error(f"Error generating dashboard: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate dashboard")
