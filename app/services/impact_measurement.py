import asyncio
import logging
from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.grant import Grant
from app.models.sprint import Sprint
from app.models.task import Task
from app.models.project import Project

logger = logging.getLogger(__name__)

class ImpactMeasurementService:
    """Professional impact measurement and analytics service."""
    
    def __init__(self, db_session: Session):
        self.db = db_session
        self.baseline_metrics = {}
        self.current_metrics = {}
        self.impact_areas = [
            'environmental', 'social', 'economic', 'cultural', 
            'educational', 'health', 'community', 'innovation'
        ]
        
    def establish_baseline(self, project_id: int) -> Dict[str, Any]:
        """Establish baseline impact metrics for a project."""
        project = self.db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise ValueError(f"Project {project_id} not found")
            
        baseline = {
            "project_id": project_id,
            "established_at": datetime.utcnow().isoformat(),
            "metrics": {
                "awareness_level": 0,
                "engagement_rate": 0,
                "community_reach": 0,
                "policy_influence": 0,
                "behavior_change": 0,
                "knowledge_transfer": 0,
                "economic_impact": 0,
                "environmental_impact": 0
            },
            "impact_areas": project.impact_types or [],
            "strategic_objectives": project.framework_alignment or []
        }
        
        self.baseline_metrics[project_id] = baseline
        return baseline
        
    def measure_current_impact(self, project_id: int) -> Dict[str, Any]:
        """Measure current impact metrics for a project."""
        # Get project data
        project = self.db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise ValueError(f"Project {project_id} not found")
            
        # Get related sprints
        sprints = self.db.query(Sprint).filter(Sprint.project_id == project_id).all()
        
        # Get related tasks
        tasks = self.db.query(Task).filter(Task.project_id == project_id).all()
        
        # Calculate current metrics
        current_metrics = {
            "project_id": project_id,
            "measured_at": datetime.utcnow().isoformat(),
            "metrics": {
                "awareness_level": self._calculate_awareness_level(project, sprints),
                "engagement_rate": self._calculate_engagement_rate(project, sprints),
                "community_reach": self._calculate_community_reach(project, sprints),
                "policy_influence": self._calculate_policy_influence(project, sprints),
                "behavior_change": self._calculate_behavior_change(project, sprints),
                "knowledge_transfer": self._calculate_knowledge_transfer(project, sprints),
                "economic_impact": self._calculate_economic_impact(project, sprints),
                "environmental_impact": self._calculate_environmental_impact(project, sprints)
            },
            "sprint_contributions": self._analyze_sprint_contributions(sprints),
            "task_contributions": self._analyze_task_contributions(tasks),
            "grant_contributions": self._analyze_grant_contributions(project_id)
        }
        
        self.current_metrics[project_id] = current_metrics
        return current_metrics
        
    def calculate_impact_gap(self, project_id: int) -> Dict[str, Any]:
        """Calculate the gap between baseline and current impact."""
        baseline = self.baseline_metrics.get(project_id)
        current = self.current_metrics.get(project_id)
        
        if not baseline or not current:
            raise ValueError(f"Missing baseline or current metrics for project {project_id}")
            
        gap_analysis = {
            "project_id": project_id,
            "baseline_date": baseline["established_at"],
            "current_date": current["measured_at"],
            "gaps": {},
            "improvements": {},
            "recommendations": []
        }
        
        for metric in baseline["metrics"]:
            baseline_value = baseline["metrics"][metric]
            current_value = current["metrics"][metric]
            gap = current_value - baseline_value
            
            gap_analysis["gaps"][metric] = gap
            gap_analysis["improvements"][metric] = gap > 0
            
            if gap < 0:
                gap_analysis["recommendations"].append(
                    f"Focus on improving {metric.replace('_', ' ')} metrics"
                )
                
        return gap_analysis
        
    def predict_impact_forecast(self, project_id: int, months_ahead: int = 6) -> Dict[str, Any]:
        """Predict future impact based on current trends."""
        current = self.current_metrics.get(project_id)
        if not current:
            raise ValueError(f"No current metrics for project {project_id}")
            
        # Simple linear prediction (in real implementation, use ML models)
        forecast = {
            "project_id": project_id,
            "forecast_period": f"{months_ahead} months",
            "predicted_metrics": {},
            "confidence_level": 0.85,
            "key_drivers": []
        }
        
        for metric, current_value in current["metrics"].items():
            # Simple growth prediction (5-15% monthly growth)
            growth_rate = 0.10  # 10% monthly growth
            predicted_value = current_value * (1 + growth_rate * months_ahead)
            
            forecast["predicted_metrics"][metric] = round(predicted_value, 2)
            
        forecast["key_drivers"] = [
            "Content quality and reach",
            "Stakeholder engagement",
            "Strategic alignment",
            "Resource allocation"
        ]
        
        return forecast
        
    def generate_impact_report(self, project_id: int) -> Dict[str, Any]:
        """Generate comprehensive impact report."""
        baseline = self.baseline_metrics.get(project_id)
        current = self.current_metrics.get(project_id)
        gap = self.calculate_impact_gap(project_id)
        forecast = self.predict_impact_forecast(project_id)
        
        report = {
            "project_id": project_id,
            "report_generated": datetime.utcnow().isoformat(),
            "executive_summary": self._generate_executive_summary(baseline, current, gap),
            "detailed_analysis": {
                "baseline": baseline,
                "current": current,
                "gap_analysis": gap,
                "forecast": forecast
            },
            "recommendations": self._generate_recommendations(gap, forecast),
            "next_steps": self._generate_next_steps(gap, forecast)
        }
        
        return report
        
    # Private helper methods
    def _calculate_awareness_level(self, project: Project, sprints: List[Sprint]) -> float:
        """Calculate awareness level based on project reach and engagement."""
        # Mock calculation - in real implementation, use actual data
        base_level = 15.0  # Starting awareness level
        sprint_boost = len([s for s in sprints if s.status == 'completed']) * 5.0
        return min(100.0, base_level + sprint_boost)
        
    def _calculate_engagement_rate(self, project: Project, sprints: List[Sprint]) -> float:
        """Calculate engagement rate based on audience interaction."""
        # Mock calculation
        base_rate = 2.3
        completed_sprints = len([s for s in sprints if s.status == 'completed'])
        return min(20.0, base_rate + (completed_sprints * 1.2))
        
    def _calculate_community_reach(self, project: Project, sprints: List[Sprint]) -> float:
        """Calculate community reach based on project activities."""
        # Mock calculation
        base_reach = 5.0
        active_sprints = len([s for s in sprints if s.status == 'active'])
        return min(100.0, base_reach + (active_sprints * 8.0))
        
    def _calculate_policy_influence(self, project: Project, sprints: List[Sprint]) -> float:
        """Calculate policy influence based on strategic alignment."""
        # Mock calculation
        base_influence = 0.0
        strategic_sprints = len([s for s in sprints if s.strategic_objectives])
        return min(10.0, base_influence + (strategic_sprints * 2.0))
        
    def _calculate_behavior_change(self, project: Project, sprints: List[Sprint]) -> float:
        """Calculate behavior change impact."""
        # Mock calculation
        base_change = 0.0
        impact_sprints = len([s for s in sprints if s.impact_areas])
        return min(25.0, base_change + (impact_sprints * 3.0))
        
    def _calculate_knowledge_transfer(self, project: Project, sprints: List[Sprint]) -> float:
        """Calculate knowledge transfer impact."""
        # Mock calculation
        base_transfer = 10.0
        completed_sprints = len([s for s in sprints if s.status == 'completed'])
        return min(100.0, base_transfer + (completed_sprints * 7.0))
        
    def _calculate_economic_impact(self, project: Project, sprints: List[Sprint]) -> float:
        """Calculate economic impact."""
        # Mock calculation
        base_impact = 0.0
        economic_sprints = len([s for s in sprints if 'economic' in (s.impact_areas or [])])
        return min(50.0, base_impact + (economic_sprints * 5.0))
        
    def _calculate_environmental_impact(self, project: Project, sprints: List[Sprint]) -> float:
        """Calculate environmental impact."""
        # Mock calculation
        base_impact = 0.0
        environmental_sprints = len([s for s in sprints if 'environmental' in (s.impact_areas or [])])
        return min(30.0, base_impact + (environmental_sprints * 4.0))
        
    def _analyze_sprint_contributions(self, sprints: List[Sprint]) -> Dict[str, Any]:
        """Analyze how sprints contribute to impact."""
        return {
            "total_sprints": len(sprints),
            "active_sprints": len([s for s in sprints if s.status == 'active']),
            "completed_sprints": len([s for s in sprints if s.status == 'completed']),
            "average_progress": sum(s.progress_percentage for s in sprints) / max(len(sprints), 1),
            "impact_areas_covered": list(set([area for s in sprints for area in (s.impact_areas or [])]))
        }
        
    def _analyze_task_contributions(self, tasks: List[Task]) -> Dict[str, Any]:
        """Analyze how tasks contribute to impact."""
        return {
            "total_tasks": len(tasks),
            "completed_tasks": len([t for t in tasks if t.status == 'completed']),
            "in_progress_tasks": len([t for t in tasks if t.status == 'in_progress']),
            "total_time_spent": sum(t.time_spent or 0 for t in tasks),
            "task_types": list(set([t.task_type for t in tasks if t.task_type]))
        }
        
    def _analyze_grant_contributions(self, project_id: int) -> Dict[str, Any]:
        """Analyze how grants contribute to impact."""
        # This would analyze grant applications and funding received
        return {
            "grants_applied": 0,
            "grants_received": 0,
            "total_funding": 0,
            "funding_utilization": 0.0
        }
        
    def _generate_executive_summary(self, baseline: Dict, current: Dict, gap: Dict) -> str:
        """Generate executive summary of impact."""
        improvements = sum(1 for improvement in gap["improvements"].values() if improvement)
        total_metrics = len(gap["improvements"])
        
        return f"Impact measurement shows {improvements}/{total_metrics} metrics improving. Key areas of progress include engagement and community reach."
        
    def _generate_recommendations(self, gap: Dict, forecast: Dict) -> List[str]:
        """Generate recommendations based on gap analysis and forecast."""
        recommendations = []
        
        for metric, gap_value in gap["gaps"].items():
            if gap_value < 0:
                recommendations.append(f"Focus on improving {metric.replace('_', ' ')} metrics")
                
        recommendations.extend([
            "Continue current successful strategies",
            "Increase stakeholder engagement",
            "Monitor and adjust based on forecast trends"
        ])
        
        return recommendations
        
    def _generate_next_steps(self, gap: Dict, forecast: Dict) -> List[str]:
        """Generate next steps for impact improvement."""
        return [
            "Implement recommended strategies",
            "Set up regular impact monitoring",
            "Engage stakeholders for feedback",
            "Plan for forecasted growth"
        ]
