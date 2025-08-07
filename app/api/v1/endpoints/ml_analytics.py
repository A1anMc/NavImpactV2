"""
ML Analytics API Endpoints
Provides predictive analytics, grant recommendations, and impact analysis
"""


from app.core.deps import get_current_user, get_db
from app.models.project import Project
from app.models.user import User
from app.services.ml_service import MLService
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/insights")
async def get_ml_insights(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Get comprehensive ML insights and analytics."""
    try:
        ml_service = MLService(db)
        insights = ml_service.get_ml_insights()

        return {
            "status": "success",
            "data": insights,
            "message": "ML insights retrieved successfully",
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving ML insights: {str(e)}",
        )


@router.post("/train-grant-recommendation")
async def train_grant_recommendation_model(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Train the grant recommendation model."""
    try:
        ml_service = MLService(db)
        result = ml_service.train_grant_recommendation_model()

        if result["success"]:
            return {
                "status": "success",
                "data": result,
                "message": "Grant recommendation model trained successfully",
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=result["message"]
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error training model: {str(e)}",
        )


@router.get("/grant-recommendations/{project_id}")
async def get_grant_recommendations(
    project_id: int,
    top_k: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get grant recommendations for a specific project."""
    try:
        # Verify project exists and user has access
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
            )

        ml_service = MLService(db)
        recommendations = ml_service.predict_grant_recommendations(project_id, top_k)

        return {
            "status": "success",
            "data": {
                "project_id": project_id,
                "recommendations": recommendations,
                "total_recommendations": len(recommendations),
            },
            "message": f"Found {len(recommendations)} grant recommendations",
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting grant recommendations: {str(e)}",
        )


@router.get("/impact-trends")
async def get_impact_trends(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Get impact trends and analysis."""
    try:
        ml_service = MLService(db)
        trends = ml_service.analyze_impact_trends()

        if trends["success"]:
            return {
                "status": "success",
                "data": trends,
                "message": "Impact trends analyzed successfully",
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=trends["message"]
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing impact trends: {str(e)}",
        )


@router.get("/project-success/{project_id}")
async def predict_project_success(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Predict the likelihood of project success."""
    try:
        # Verify project exists
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
            )

        ml_service = MLService(db)
        prediction = ml_service.predict_project_success(project_id)

        if prediction["success"]:
            return {
                "status": "success",
                "data": prediction,
                "message": "Project success prediction generated",
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=prediction["message"]
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error predicting project success: {str(e)}",
        )


@router.get("/data-quality")
async def get_data_quality_report(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Get data quality report for ML models."""
    try:
        ml_service = MLService(db)
        data_summary = ml_service._get_data_summary()

        # Calculate data quality metrics
        quality_metrics = {
            "total_records": sum(data_summary.values()),
            "data_completeness": (
                "good" if data_summary.get("grants", 0) > 10 else "needs_improvement"
            ),
            "model_readiness": (
                "ready" if data_summary.get("grants", 0) > 20 else "needs_more_data"
            ),
            "recommendations": ml_service._generate_recommendations(),
        }

        return {
            "status": "success",
            "data": {"summary": data_summary, "quality_metrics": quality_metrics},
            "message": "Data quality report generated",
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating data quality report: {str(e)}",
        )


@router.get("/recommendations")
async def get_ai_recommendations(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Get AI-powered recommendations for the organization."""
    try:
        ml_service = MLService(db)
        insights = ml_service.get_ml_insights()

        # Generate personalized recommendations
        recommendations = {
            "immediate_actions": [],
            "strategic_recommendations": [],
            "data_improvements": [],
        }

        # Immediate actions based on current data
        if insights.get("data_summary", {}).get("grants", 0) < 10:
            recommendations["immediate_actions"].append(
                "Add more grants to improve recommendation accuracy"
            )

        if insights.get("data_summary", {}).get("projects", 0) < 5:
            recommendations["immediate_actions"].append(
                "Create more projects to enable better impact analysis"
            )

        # Strategic recommendations
        if insights.get("grant_recommendations", {}).get("model_trained"):
            recommendations["strategic_recommendations"].append(
                "Use grant recommendations to optimize funding opportunities"
            )

        # Data improvements
        recommendations["data_improvements"] = insights.get("recommendations", [])

        return {
            "status": "success",
            "data": {"recommendations": recommendations, "insights": insights},
            "message": "AI recommendations generated successfully",
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating AI recommendations: {str(e)}",
        )
