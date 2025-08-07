"""
OKR Alignment Service
Provides comprehensive OKR tracking, alignment analysis, and strategic insights
"""

import logging
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func, desc
from app.models.project import Project
from app.models.metric import Metric
from app.models.task import Task, TaskStatus
from app.models.user import User

logger = logging.getLogger(__name__)


class OKRAlignmentService:
    """Service for OKR tracking, alignment analysis, and strategic insights."""
    
    def __init__(self, db_session: Session):
        self.db = db_session
    
    def create_okr(self, okr_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new OKR with objectives and key results."""
        try:
            # This would typically save to a database
            # For now, we'll return the structured OKR
            okr = {
                "id": okr_data.get("id", f"okr_{datetime.utcnow().timestamp()}"),
                "title": okr_data.get("title", ""),
                "objective": okr_data.get("objective", ""),
                "key_results": okr_data.get("key_results", []),
                "owner": okr_data.get("owner", ""),
                "start_date": okr_data.get("start_date", datetime.utcnow()),
                "end_date": okr_data.get("end_date"),
                "status": okr_data.get("status", "active"),
                "progress": 0,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            return {"success": True, "okr": okr}
            
        except Exception as e:
            logger.error(f"Error creating OKR: {e}")
            return {"success": False, "error": str(e)}
    
    def track_okr_progress(self, okr_id: str, metrics: Dict[str, Any]) -> Dict[str, Any]:
        """Track progress for a specific OKR."""
        try:
            # Calculate progress based on key results
            total_progress = 0
            key_results_progress = []
            
            for kr in metrics.get("key_results", []):
                current_value = kr.get("current_value", 0)
                target_value = kr.get("target_value", 1)
                
                if target_value > 0:
                    progress = min((current_value / target_value) * 100, 100)
                else:
                    progress = 0
                
                total_progress += progress
                key_results_progress.append({
                    "id": kr.get("id"),
                    "title": kr.get("title"),
                    "current_value": current_value,
                    "target_value": target_value,
                    "progress": progress,
                    "status": "on_track" if progress >= 80 else "at_risk" if progress >= 50 else "behind"
                })
            
            avg_progress = total_progress / len(key_results_progress) if key_results_progress else 0
            
            return {
                "success": True,
                "okr_id": okr_id,
                "overall_progress": avg_progress,
                "key_results": key_results_progress,
                "status": "on_track" if avg_progress >= 80 else "at_risk" if avg_progress >= 50 else "behind",
                "updated_at": datetime.utcnow()
            }
            
        except Exception as e:
            logger.error(f"Error tracking OKR progress: {e}")
            return {"success": False, "error": str(e)}
    
    def analyze_project_okr_alignment(self, project_id: int) -> Dict[str, Any]:
        """Analyze how a project aligns with organizational OKRs."""
        try:
            project = self.db.query(Project).filter(Project.id == project_id).first()
            if not project:
                return {"success": False, "error": "Project not found"}
            
            # Get project metrics
            metrics = self.db.query(Metric).filter(Metric.project_id == project_id).all()
            total_impact = sum(m.value for m in metrics if m.value)
            
            # Get project tasks
            tasks = self.db.query(Task).filter(Task.project_id == project_id).all()
            completed_tasks = sum(1 for t in tasks if t.status == TaskStatus.COMPLETED)
            total_tasks = len(tasks)
            
            # Analyze alignment with common OKR categories
            alignment_analysis = {
                "project_id": project_id,
                "project_name": project.name,
                "okr_alignment": {
                    "impact_measurement": {
                        "score": min(total_impact / 100, 1) * 100,
                        "description": "Project's contribution to impact measurement OKRs"
                    },
                    "efficiency_improvement": {
                        "score": (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0,
                        "description": "Project's contribution to efficiency OKRs"
                    },
                    "innovation": {
                        "score": 75,  # Placeholder - would be calculated based on innovation metrics
                        "description": "Project's contribution to innovation OKRs"
                    },
                    "sustainability": {
                        "score": 80,  # Placeholder - would be calculated based on sustainability metrics
                        "description": "Project's contribution to sustainability OKRs"
                    }
                },
                "overall_alignment_score": 0,
                "recommendations": []
            }
            
            # Calculate overall alignment score
            alignment_scores = [kr["score"] for kr in alignment_analysis["okr_alignment"].values()]
            alignment_analysis["overall_alignment_score"] = sum(alignment_scores) / len(alignment_scores)
            
            # Generate recommendations
            if alignment_analysis["overall_alignment_score"] < 70:
                alignment_analysis["recommendations"].append("Focus on improving alignment with organizational OKRs")
            
            if alignment_analysis["okr_alignment"]["impact_measurement"]["score"] < 60:
                alignment_analysis["recommendations"].append("Increase impact measurement and reporting")
            
            if alignment_analysis["okr_alignment"]["efficiency_improvement"]["score"] < 60:
                alignment_analysis["recommendations"].append("Improve project efficiency and task completion")
            
            return {"success": True, "analysis": alignment_analysis}
            
        except Exception as e:
            logger.error(f"Error analyzing project OKR alignment: {e}")
            return {"success": False, "error": str(e)}
    
    def get_portfolio_okr_alignment(self) -> Dict[str, Any]:
        """Get OKR alignment across the entire project portfolio."""
        try:
            projects = self.db.query(Project).all()
            
            portfolio_analysis = {
                "total_projects": len(projects),
                "okr_categories": {
                    "impact_measurement": {"projects": 0, "avg_score": 0},
                    "efficiency_improvement": {"projects": 0, "avg_score": 0},
                    "innovation": {"projects": 0, "avg_score": 0},
                    "sustainability": {"projects": 0, "avg_score": 0}
                },
                "overall_portfolio_score": 0,
                "top_aligned_projects": [],
                "needs_attention_projects": []
            }
            
            project_scores = []
            
            for project in projects:
                alignment = self.analyze_project_okr_alignment(project.id)
                if alignment["success"]:
                    analysis = alignment["analysis"]
                    project_scores.append({
                        "project_id": project.id,
                        "project_name": project.name,
                        "alignment_score": analysis["overall_alignment_score"]
                    })
                    
                    # Update category scores
                    for category, data in analysis["okr_alignment"].items():
                        if data["score"] > 0:
                            portfolio_analysis["okr_categories"][category]["projects"] += 1
                            portfolio_analysis["okr_categories"][category]["avg_score"] += data["score"]
            
            # Calculate averages
            for category in portfolio_analysis["okr_categories"]:
                if portfolio_analysis["okr_categories"][category]["projects"] > 0:
                    portfolio_analysis["okr_categories"][category]["avg_score"] /= portfolio_analysis["okr_categories"][category]["projects"]
            
            # Calculate overall portfolio score
            if project_scores:
                portfolio_analysis["overall_portfolio_score"] = sum(p["alignment_score"] for p in project_scores) / len(project_scores)
            
            # Sort projects by alignment score
            project_scores.sort(key=lambda x: x["alignment_score"], reverse=True)
            
            portfolio_analysis["top_aligned_projects"] = project_scores[:5]
            portfolio_analysis["needs_attention_projects"] = [p for p in project_scores if p["alignment_score"] < 60]
            
            return {"success": True, "portfolio_analysis": portfolio_analysis}
            
        except Exception as e:
            logger.error(f"Error getting portfolio OKR alignment: {e}")
            return {"success": False, "error": str(e)}
    
    def generate_okr_insights(self) -> Dict[str, Any]:
        """Generate insights and recommendations for OKR achievement."""
        try:
            portfolio = self.get_portfolio_okr_alignment()
            if not portfolio["success"]:
                return portfolio
            
            portfolio_analysis = portfolio["portfolio_analysis"]
            
            insights = {
                "portfolio_score": portfolio_analysis["overall_portfolio_score"],
                "strengths": [],
                "weaknesses": [],
                "opportunities": [],
                "threats": [],
                "recommendations": []
            }
            
            # Analyze strengths
            if portfolio_analysis["overall_portfolio_score"] > 80:
                insights["strengths"].append("Strong overall OKR alignment across portfolio")
            
            for category, data in portfolio_analysis["okr_categories"].items():
                if data["avg_score"] > 80:
                    insights["strengths"].append(f"Strong performance in {category.replace('_', ' ')}")
                elif data["avg_score"] < 60:
                    insights["weaknesses"].append(f"Need improvement in {category.replace('_', ' ')}")
            
            # Analyze opportunities
            if len(portfolio_analysis["needs_attention_projects"]) > 0:
                insights["opportunities"].append(f"Focus on {len(portfolio_analysis['needs_attention_projects'])} projects needing attention")
            
            # Generate recommendations
            if portfolio_analysis["overall_portfolio_score"] < 70:
                insights["recommendations"].append("Implement OKR alignment training for project teams")
            
            if len(portfolio_analysis["needs_attention_projects"]) > 0:
                insights["recommendations"].append("Develop action plans for low-alignment projects")
            
            insights["recommendations"].append("Regular OKR progress reviews and adjustments")
            
            return {"success": True, "insights": insights}
            
        except Exception as e:
            logger.error(f"Error generating OKR insights: {e}")
            return {"success": False, "error": str(e)}
    
    def get_okr_dashboard_data(self) -> Dict[str, Any]:
        """Get comprehensive data for OKR dashboard."""
        try:
            # Get portfolio alignment
            portfolio = self.get_portfolio_okr_alignment()
            
            # Get insights
            insights = self.generate_okr_insights()
            
            # Get project count by alignment level
            projects = self.db.query(Project).all()
            alignment_levels = {
                "high": 0,    # 80-100%
                "medium": 0,  # 60-79%
                "low": 0      # 0-59%
            }
            
            for project in projects:
                alignment = self.analyze_project_okr_alignment(project.id)
                if alignment["success"]:
                    score = alignment["analysis"]["overall_alignment_score"]
                    if score >= 80:
                        alignment_levels["high"] += 1
                    elif score >= 60:
                        alignment_levels["medium"] += 1
                    else:
                        alignment_levels["low"] += 1
            
            dashboard_data = {
                "portfolio_alignment": portfolio.get("portfolio_analysis", {}),
                "insights": insights.get("insights", {}),
                "alignment_distribution": alignment_levels,
                "total_projects": len(projects),
                "last_updated": datetime.utcnow().isoformat()
            }
            
            return {"success": True, "dashboard_data": dashboard_data}
            
        except Exception as e:
            logger.error(f"Error getting OKR dashboard data: {e}")
            return {"success": False, "error": str(e)} 