"""
Enhanced Grant Service
Provides advanced grant management, matching, and impact tracking
"""

import logging
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

from app.models.grant import Grant
from app.models.metric import Metric
from app.models.project import Project
from app.services.ml_service import MLService
from sqlalchemy import and_, func
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)


class EnhancedGrantService:
    """Enhanced grant service with advanced features."""

    def __init__(self, db_session: Session):
        self.db = db_session
        self.ml_service = MLService(db_session)

    def get_grant_opportunities(
        self, project_id: Optional[int] = None, filters: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """Get grant opportunities with enhanced filtering and scoring."""
        try:
            query = self.db.query(Grant).filter(Grant.status == "active")

            # Apply filters
            if filters:
                if filters.get("min_amount"):
                    query = query.filter(Grant.amount >= filters["min_amount"])
                if filters.get("max_amount"):
                    query = query.filter(Grant.amount <= filters["max_amount"])
                if filters.get("deadline_soon"):
                    query = query.filter(
                        Grant.deadline <= datetime.utcnow() + timedelta(days=30)
                    )
                if filters.get("source"):
                    query = query.filter(Grant.source == filters["source"])

            grants = query.all()

            # Enhance with scoring and recommendations
            enhanced_grants = []
            for grant in grants:
                grant_data = {
                    "id": grant.id,
                    "title": grant.title,
                    "description": grant.description,
                    "amount": grant.amount,
                    "deadline": grant.deadline,
                    "source": grant.source,
                    "status": grant.status,
                    "created_at": grant.created_at,
                    "updated_at": grant.updated_at,
                    "days_to_deadline": (
                        (grant.deadline - datetime.utcnow()).days
                        if grant.deadline
                        else None
                    ),
                    "urgency_score": self._calculate_urgency_score(grant),
                    "compatibility_score": (
                        self._calculate_compatibility_score(grant, project_id)
                        if project_id
                        else None
                    ),
                    "impact_potential": self._calculate_impact_potential(grant),
                    "recommendations": self._generate_grant_recommendations(grant),
                }
                enhanced_grants.append(grant_data)

            # Sort by relevance score
            enhanced_grants.sort(
                key=lambda x: x.get("compatibility_score", 0) or 0, reverse=True
            )

            return enhanced_grants

        except Exception as e:
            logger.error(f"Error getting grant opportunities: {e}")
            return []

    def _calculate_urgency_score(self, grant: Grant) -> float:
        """Calculate urgency score based on deadline and amount."""
        if not grant.deadline:
            return 0.5

        days_to_deadline = (grant.deadline - datetime.utcnow()).days

        if days_to_deadline <= 0:
            return 1.0  # Expired
        elif days_to_deadline <= 7:
            return 0.9  # Very urgent
        elif days_to_deadline <= 30:
            return 0.7  # Urgent
        elif days_to_deadline <= 90:
            return 0.5  # Moderate
        else:
            return 0.3  # Low urgency

    def _calculate_compatibility_score(self, grant: Grant, project_id: int) -> float:
        """Calculate compatibility score between grant and project."""
        try:
            project = self.db.query(Project).filter(Project.id == project_id).first()
            if not project:
                return 0.0

            # Get project metrics for impact assessment
            project_metrics = (
                self.db.query(Metric).filter(Metric.project_id == project_id).all()
            )
            total_impact = sum(m.value for m in project_metrics if m.value)

            score = 0.0

            # Amount compatibility
            if grant.amount and total_impact:
                amount_ratio = min(grant.amount, total_impact) / max(
                    grant.amount, total_impact
                )
                score += amount_ratio * 0.4

            # Text similarity (simple length-based)
            project_text = project.name + (project.description or "")
            grant_text = grant.title + (grant.description or "")

            text_similarity = 1 - abs(len(project_text) - len(grant_text)) / max(
                len(project_text), len(grant_text), 1
            )
            score += text_similarity * 0.3

            # Deadline urgency
            urgency_score = self._calculate_urgency_score(grant)
            score += urgency_score * 0.3

            return min(score, 1.0)

        except Exception as e:
            logger.error(f"Error calculating compatibility score: {e}")
            return 0.0

    def _calculate_impact_potential(self, grant: Grant) -> Dict[str, Any]:
        """Calculate potential impact of the grant."""
        try:
            # Analyze grant characteristics
            has_amount = 1 if grant.amount else 0
            has_description = 1 if grant.description else 0
            text_length = len(grant.title + (grant.description or ""))

            # Calculate impact potential based on grant characteristics
            impact_score = (
                has_amount * 0.4
                + has_description * 0.3
                + min(text_length / 1000, 1) * 0.3
            )

            return {
                "score": impact_score,
                "has_amount": has_amount,
                "has_description": has_description,
                "text_completeness": min(text_length / 1000, 1),
                "category": (
                    "high"
                    if impact_score > 0.7
                    else "medium" if impact_score > 0.4 else "low"
                ),
            }

        except Exception as e:
            logger.error(f"Error calculating impact potential: {e}")
            return {"score": 0.0, "category": "unknown"}

    def _generate_grant_recommendations(self, grant: Grant) -> List[str]:
        """Generate recommendations for grant application."""
        recommendations = []

        try:
            # Check if grant has amount
            if not grant.amount:
                recommendations.append("Add grant amount for better matching")

            # Check if grant has description
            if not grant.description:
                recommendations.append(
                    "Add detailed description for better project matching"
                )

            # Check deadline urgency
            if grant.deadline:
                days_to_deadline = (grant.deadline - datetime.utcnow()).days
                if days_to_deadline <= 7:
                    recommendations.append("Apply immediately - deadline approaching")
                elif days_to_deadline <= 30:
                    recommendations.append(
                        "Plan application strategy - deadline within 30 days"
                    )

            # Check grant amount
            if grant.amount:
                if grant.amount > 100000:
                    recommendations.append("Large grant - consider team collaboration")
                elif grant.amount < 10000:
                    recommendations.append("Small grant - suitable for pilot projects")

            # Add general recommendations
            recommendations.append("Review eligibility criteria carefully")
            recommendations.append("Prepare supporting documentation")

            return recommendations

        except Exception as e:
            logger.error(f"Error generating grant recommendations: {e}")
            return ["Review grant details and requirements"]

    def get_grant_analytics(self) -> Dict[str, Any]:
        """Get comprehensive grant analytics."""
        try:
            # Basic statistics
            total_grants = self.db.query(Grant).count()
            active_grants = (
                self.db.query(Grant).filter(Grant.status == "active").count()
            )
            expired_grants = (
                self.db.query(Grant)
                .filter(
                    and_(Grant.deadline < datetime.utcnow(), Grant.status == "active")
                )
                .count()
            )

            # Amount statistics
            grants_with_amount = (
                self.db.query(Grant).filter(Grant.amount.isnot(None)).all()
            )
            total_amount = sum(g.amount for g in grants_with_amount if g.amount)
            avg_amount = (
                total_amount / len(grants_with_amount) if grants_with_amount else 0
            )

            # Source distribution
            source_stats = (
                self.db.query(Grant.source, func.count(Grant.id))
                .group_by(Grant.source)
                .all()
            )

            # Deadline analysis
            upcoming_deadlines = (
                self.db.query(Grant)
                .filter(
                    and_(
                        Grant.deadline >= datetime.utcnow(),
                        Grant.deadline <= datetime.utcnow() + timedelta(days=30),
                        Grant.status == "active",
                    )
                )
                .count()
            )

            return {
                "total_grants": total_grants,
                "active_grants": active_grants,
                "expired_grants": expired_grants,
                "total_amount": total_amount,
                "average_amount": avg_amount,
                "upcoming_deadlines": upcoming_deadlines,
                "source_distribution": dict(source_stats),
                "utilization_rate": (
                    (active_grants / total_grants * 100) if total_grants > 0 else 0
                ),
            }

        except Exception as e:
            logger.error(f"Error getting grant analytics: {e}")
            return {}

    def match_grants_to_projects(self, project_id: int) -> List[Dict[str, Any]]:
        """Match grants to a specific project using ML and heuristics."""
        try:
            # Get project details
            project = self.db.query(Project).filter(Project.id == project_id).first()
            if not project:
                return []

            # Get all active grants
            grants = self.db.query(Grant).filter(Grant.status == "active").all()

            matches = []
            for grant in grants:
                # Calculate compatibility score
                compatibility_score = self._calculate_compatibility_score(
                    grant, project_id
                )

                # Get ML-based recommendation if available
                ml_recommendation = None
                try:
                    ml_recommendations = self.ml_service.predict_grant_recommendations(
                        project_id, 1
                    )
                    if (
                        ml_recommendations
                        and ml_recommendations[0]["grant_id"] == grant.id
                    ):
                        ml_recommendation = ml_recommendations[0]
                except Exception as e:
                    logger.warning(f"ML recommendation failed: {e}")

                match_data = {
                    "grant_id": grant.id,
                    "grant_title": grant.title,
                    "grant_amount": grant.amount,
                    "grant_deadline": grant.deadline,
                    "compatibility_score": compatibility_score,
                    "urgency_score": self._calculate_urgency_score(grant),
                    "impact_potential": self._calculate_impact_potential(grant),
                    "ml_recommendation": ml_recommendation,
                    "recommendations": self._generate_grant_recommendations(grant),
                }

                matches.append(match_data)

            # Sort by overall score (compatibility + urgency)
            matches.sort(
                key=lambda x: x["compatibility_score"] + x["urgency_score"],
                reverse=True,
            )

            return matches

        except Exception as e:
            logger.error(f"Error matching grants to projects: {e}")
            return []

    def get_grant_impact_tracking(self, grant_id: int) -> Dict[str, Any]:
        """Track the impact of a specific grant."""
        try:
            grant = self.db.query(Grant).filter(Grant.id == grant_id).first()
            if not grant:
                return {}

            # Find projects that might be related to this grant
            # This is a simplified approach - in a real system, you'd have explicit grant-project relationships
            related_projects = (
                self.db.query(Project)
                .filter(Project.name.ilike(f"%{grant.title.split()[0]}%"))
                .all()
            )

            total_impact = 0
            project_impacts = []

            for project in related_projects:
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
                    }
                )

            return {
                "grant_id": grant_id,
                "grant_title": grant.title,
                "grant_amount": grant.amount,
                "total_impact": total_impact,
                "roi": (total_impact / grant.amount * 100) if grant.amount else 0,
                "related_projects": project_impacts,
                "project_count": len(related_projects),
            }

        except Exception as e:
            logger.error(f"Error tracking grant impact: {e}")
            return {}

    def get_grant_workflow_recommendations(self) -> Dict[str, Any]:
        """Get recommendations for improving grant workflow."""
        try:
            analytics = self.get_grant_analytics()

            recommendations = {
                "immediate_actions": [],
                "process_improvements": [],
                "strategic_recommendations": [],
            }

            # Immediate actions
            if analytics.get("expired_grants", 0) > 0:
                recommendations["immediate_actions"].append(
                    f"Review {analytics['expired_grants']} expired grants"
                )

            if analytics.get("upcoming_deadlines", 0) > 5:
                recommendations["immediate_actions"].append(
                    f"Prioritize applications for {analytics['upcoming_deadlines']} upcoming deadlines"
                )

            # Process improvements
            if analytics.get("utilization_rate", 0) < 50:
                recommendations["process_improvements"].append(
                    "Improve grant application success rate"
                )

            if analytics.get("average_amount", 0) < 50000:
                recommendations["process_improvements"].append(
                    "Focus on larger grant opportunities"
                )

            # Strategic recommendations
            recommendations["strategic_recommendations"].extend(
                [
                    "Implement automated grant matching system",
                    "Establish grant application templates",
                    "Create grant success tracking metrics",
                    "Develop grant pipeline management",
                ]
            )

            return {"analytics": analytics, "recommendations": recommendations}

        except Exception as e:
            logger.error(f"Error getting workflow recommendations: {e}")
            return {"analytics": {}, "recommendations": {}}
