"""
Impact Understanding Service
Connects impact measurement with understanding and provides insights for decision-making
"""

import logging
from typing import Any, Dict

from app.models.metric import Metric
from app.models.project import Project
from app.models.task import Task, TaskStatus
from app.services.ml_service import MLService
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)


class ImpactUnderstandingService:
    """Service for understanding and analyzing impact data."""

    def __init__(self, db_session: Session):
        self.db = db_session
        self.ml_service = MLService(db_session)

    def get_impact_overview(self) -> Dict[str, Any]:
        """Get comprehensive impact overview."""
        try:
            # Get all projects with their metrics
            projects = self.db.query(Project).all()

            total_impact = 0
            project_impacts = []

            for project in projects:
                metrics = (
                    self.db.query(Metric).filter(Metric.project_id == project.id).all()
                )
                project_impact = sum(m.value for m in metrics if m.value)
                total_impact += project_impact

                project_impacts.append(
                    {
                        "project_id": project.id,
                        "project_name": project.name,
                        "impact": project_impact,
                        "metric_count": len(metrics),
                    }
                )

            # Calculate impact statistics
            impact_values = [p["impact"] for p in project_impacts if p["impact"] > 0]
            avg_impact = sum(impact_values) / len(impact_values) if impact_values else 0
            max_impact = max(impact_values) if impact_values else 0

            return {
                "total_impact": total_impact,
                "average_impact": avg_impact,
                "max_impact": max_impact,
                "project_count": len(projects),
                "projects_with_impact": len(
                    [p for p in project_impacts if p["impact"] > 0]
                ),
                "project_impacts": sorted(
                    project_impacts, key=lambda x: x["impact"], reverse=True
                ),
            }

        except Exception as e:
            logger.error(f"Error getting impact overview: {e}")
            return {}

    def analyze_impact_trends(self) -> Dict[str, Any]:
        """Analyze impact trends over time."""
        try:
            # Get metrics with timestamps
            metrics = self.db.query(Metric).all()

            if not metrics:
                return {"success": False, "message": "No metrics data available"}

            # Group by month
            monthly_data = {}
            for metric in metrics:
                month_key = metric.created_at.strftime("%Y-%m")
                if month_key not in monthly_data:
                    monthly_data[month_key] = []
                monthly_data[month_key].append(metric.value or 0)

            # Calculate monthly totals and averages
            monthly_trends = []
            for month, values in monthly_data.items():
                monthly_trends.append(
                    {
                        "month": month,
                        "total_impact": sum(values),
                        "average_impact": sum(values) / len(values),
                        "metric_count": len(values),
                    }
                )

            # Sort by month
            monthly_trends.sort(key=lambda x: x["month"])

            # Calculate trend direction
            if len(monthly_trends) > 1:
                recent_impact = monthly_trends[-1]["total_impact"]
                previous_impact = monthly_trends[-2]["total_impact"]
                trend_direction = (
                    "increasing" if recent_impact > previous_impact else "decreasing"
                )
                trend_percentage = (
                    ((recent_impact - previous_impact) / previous_impact * 100)
                    if previous_impact > 0
                    else 0
                )
            else:
                trend_direction = "stable"
                trend_percentage = 0

            return {
                "success": True,
                "monthly_trends": monthly_trends,
                "trend_direction": trend_direction,
                "trend_percentage": trend_percentage,
                "total_months": len(monthly_trends),
            }

        except Exception as e:
            logger.error(f"Error analyzing impact trends: {e}")
            return {"success": False, "message": str(e)}

    def get_impact_insights(self) -> Dict[str, Any]:
        """Get insights about impact patterns and correlations."""
        try:
            insights = {
                "high_impact_projects": [],
                "impact_correlations": {},
                "recommendations": [],
            }

            # Get projects with their impact data
            projects = self.db.query(Project).all()

            for project in projects:
                metrics = (
                    self.db.query(Metric).filter(Metric.project_id == project.id).all()
                )
                project_impact = sum(m.value for m in metrics if m.value)

                # Get project tasks
                tasks = self.db.query(Task).filter(Task.project_id == project.id).all()
                completed_tasks = sum(
                    1 for t in tasks if t.status == TaskStatus.COMPLETED
                )
                total_tasks = len(tasks)

                # Calculate project efficiency
                efficiency = completed_tasks / total_tasks if total_tasks > 0 else 0

                if project_impact > 50:  # High impact threshold
                    insights["high_impact_projects"].append(
                        {
                            "project_id": project.id,
                            "project_name": project.name,
                            "impact": project_impact,
                            "efficiency": efficiency,
                            "task_completion": f"{completed_tasks}/{total_tasks}",
                        }
                    )

            # Analyze correlations
            if insights["high_impact_projects"]:
                avg_efficiency = sum(
                    p["efficiency"] for p in insights["high_impact_projects"]
                ) / len(insights["high_impact_projects"])
                insights["impact_correlations"] = {
                    "efficiency_impact_correlation": avg_efficiency,
                    "high_impact_count": len(insights["high_impact_projects"]),
                }

            # Generate recommendations
            if insights["high_impact_projects"]:
                insights["recommendations"].append(
                    "Focus on high-impact projects for maximum ROI"
                )
                insights["recommendations"].append(
                    "Replicate successful project patterns"
                )

            if avg_efficiency > 0.8:
                insights["recommendations"].append(
                    "Maintain high task completion rates"
                )
            else:
                insights["recommendations"].append(
                    "Improve task completion rates to boost impact"
                )

            return insights

        except Exception as e:
            logger.error(f"Error getting impact insights: {e}")
            return {}

    def get_impact_prediction(self, project_id: int) -> Dict[str, Any]:
        """Predict future impact for a specific project."""
        try:
            project = self.db.query(Project).filter(Project.id == project_id).first()
            if not project:
                return {"success": False, "message": "Project not found"}

            # Get current metrics
            metrics = (
                self.db.query(Metric).filter(Metric.project_id == project_id).all()
            )
            current_impact = sum(m.value for m in metrics if m.value)

            # Get project tasks
            tasks = self.db.query(Task).filter(Task.project_id == project_id).all()
            completed_tasks = sum(1 for t in tasks if t.status == TaskStatus.COMPLETED)
            total_tasks = len(tasks)

            # Calculate completion rate
            completion_rate = completed_tasks / total_tasks if total_tasks > 0 else 0

            # Simple impact prediction based on completion rate and current impact
            predicted_impact = current_impact * (1 + completion_rate)

            # Get ML-based prediction if available
            ml_prediction = None
            try:
                ml_result = self.ml_service.predict_project_success(project_id)
                if ml_result["success"]:
                    ml_prediction = ml_result
            except Exception as e:
                logger.warning(f"ML prediction failed: {e}")

            return {
                "success": True,
                "project_id": project_id,
                "current_impact": current_impact,
                "predicted_impact": predicted_impact,
                "completion_rate": completion_rate,
                "ml_prediction": ml_prediction,
                "confidence_level": (
                    "high"
                    if completion_rate > 0.7
                    else "medium" if completion_rate > 0.4 else "low"
                ),
            }

        except Exception as e:
            logger.error(f"Error predicting impact: {e}")
            return {"success": False, "message": str(e)}

    def get_impact_optimization_recommendations(self) -> Dict[str, Any]:
        """Get recommendations for optimizing impact."""
        try:
            recommendations = {
                "immediate_actions": [],
                "strategic_recommendations": [],
                "data_improvements": [],
            }

            # Get impact overview
            overview = self.get_impact_overview()

            # Immediate actions based on current state
            if (
                overview.get("projects_with_impact", 0)
                < overview.get("project_count", 0) * 0.5
            ):
                recommendations["immediate_actions"].append(
                    "Add impact metrics to more projects"
                )

            if overview.get("average_impact", 0) < 25:
                recommendations["immediate_actions"].append(
                    "Focus on high-impact activities"
                )

            # Strategic recommendations
            recommendations["strategic_recommendations"].extend(
                [
                    "Implement automated impact tracking",
                    "Establish impact measurement standards",
                    "Create impact-based project prioritization",
                    "Develop impact forecasting models",
                ]
            )

            # Data improvements
            recommendations["data_improvements"].extend(
                [
                    "Add more granular impact metrics",
                    "Implement real-time impact tracking",
                    "Create impact attribution models",
                    "Establish impact baseline measurements",
                ]
            )

            return {"overview": overview, "recommendations": recommendations}

        except Exception as e:
            logger.error(f"Error getting optimization recommendations: {e}")
            return {}

    def get_impact_storytelling_data(self) -> Dict[str, Any]:
        """Get data for impact storytelling and reporting."""
        try:
            # Get impact overview
            overview = self.get_impact_overview()

            # Get trend analysis
            trends = self.analyze_impact_trends()

            # Get insights
            insights = self.get_impact_insights()

            # Create storytelling narrative
            narrative = {
                "total_impact": overview.get("total_impact", 0),
                "project_count": overview.get("project_count", 0),
                "trend_direction": trends.get("trend_direction", "stable"),
                "trend_percentage": trends.get("trend_percentage", 0),
                "high_impact_projects": len(insights.get("high_impact_projects", [])),
                "key_achievements": [],
                "impact_highlights": [],
            }

            # Generate key achievements
            if overview.get("total_impact", 0) > 100:
                narrative["key_achievements"].append(
                    f"Achieved {overview['total_impact']} total impact points"
                )

            if overview.get("projects_with_impact", 0) > 0:
                narrative["key_achievements"].append(
                    f"Generated impact across {overview['projects_with_impact']} projects"
                )

            if trends.get("trend_direction") == "increasing":
                narrative["key_achievements"].append(
                    f"Impact increased by {trends.get('trend_percentage', 0):.1f}%"
                )

            # Generate impact highlights
            if insights.get("high_impact_projects"):
                top_project = insights["high_impact_projects"][0]
                narrative["impact_highlights"].append(
                    f"Top project '{top_project['project_name']}' achieved {top_project['impact']} impact points"
                )

            return {
                "narrative": narrative,
                "overview": overview,
                "trends": trends,
                "insights": insights,
            }

        except Exception as e:
            logger.error(f"Error getting storytelling data: {e}")
            return {}

    def get_impact_roi_analysis(self) -> Dict[str, Any]:
        """Analyze ROI of impact-generating activities."""
        try:
            # Get projects with impact and associated costs (simplified)
            projects = self.db.query(Project).all()

            roi_data = []
            total_cost = 0
            total_impact = 0

            for project in projects:
                metrics = (
                    self.db.query(Metric).filter(Metric.project_id == project.id).all()
                )
                project_impact = sum(m.value for m in metrics if m.value)

                # Simplified cost calculation (in real system, you'd have actual cost data)
                estimated_cost = len(metrics) * 100  # Assume $100 per metric
                total_cost += estimated_cost
                total_impact += project_impact

                if project_impact > 0:
                    roi = (
                        (project_impact / estimated_cost * 100)
                        if estimated_cost > 0
                        else 0
                    )
                    roi_data.append(
                        {
                            "project_id": project.id,
                            "project_name": project.name,
                            "impact": project_impact,
                            "estimated_cost": estimated_cost,
                            "roi": roi,
                        }
                    )

            # Calculate overall ROI
            overall_roi = (total_impact / total_cost * 100) if total_cost > 0 else 0

            return {
                "overall_roi": overall_roi,
                "total_impact": total_impact,
                "total_cost": total_cost,
                "project_roi": sorted(roi_data, key=lambda x: x["roi"], reverse=True),
                "average_roi": (
                    sum(p["roi"] for p in roi_data) / len(roi_data) if roi_data else 0
                ),
            }

        except Exception as e:
            logger.error(f"Error analyzing ROI: {e}")
            return {}
