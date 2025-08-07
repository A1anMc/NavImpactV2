"""
Machine Learning Service for NavImpact V2
Provides predictive analytics, grant recommendations, and impact analysis
"""

import logging
import os
from datetime import datetime
from typing import Any, Dict, List, Optional

import joblib
import numpy as np
import pandas as pd
from app.models.grant import Grant
from app.models.metric import Metric
from app.models.project import Project
from app.models.task import Task, TaskStatus
from app.models.user import User
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)


class MLService:
    """Machine Learning service for predictive analytics and recommendations."""

    def __init__(self, db_session: Session):
        self.db = db_session
        self.models_dir = "app/ml_models"
        self._ensure_models_directory()
        self.scalers = {}
        self.encoders = {}
        self.models = {}

    def _ensure_models_directory(self):
        """Ensure the models directory exists."""
        if not os.path.exists(self.models_dir):
            os.makedirs(self.models_dir)

    def prepare_grant_data(self) -> pd.DataFrame:
        """Prepare grant data for ML analysis."""
        try:
            # Fetch grants with related data
            grants = self.db.query(Grant).all()

            data = []
            for grant in grants:
                grant_dict = {
                    "id": grant.id,
                    "title": grant.title,
                    "description": grant.description,
                    "amount": grant.amount or 0,
                    "deadline": grant.deadline,
                    "status": grant.status,
                    "source": grant.source,
                    "created_at": grant.created_at,
                    "updated_at": grant.updated_at,
                    "has_description": 1 if grant.description else 0,
                    "has_amount": 1 if grant.amount else 0,
                    "days_to_deadline": (
                        (grant.deadline - datetime.utcnow()).days
                        if grant.deadline
                        else 0
                    ),
                    "is_active": 1 if grant.status == "active" else 0,
                    "amount_category": self._categorize_amount(grant.amount),
                    "text_length": len(grant.title + (grant.description or "")),
                }
                data.append(grant_dict)

            return pd.DataFrame(data)
        except Exception as e:
            logger.error(f"Error preparing grant data: {e}")
            return pd.DataFrame()

    def prepare_project_data(self) -> pd.DataFrame:
        """Prepare project data for ML analysis."""
        try:
            projects = self.db.query(Project).all()

            data = []
            for project in projects:
                # Get related metrics
                metrics = (
                    self.db.query(Metric).filter(Metric.project_id == project.id).all()
                )
                total_impact = sum(m.value for m in metrics if m.value)

                project_dict = {
                    "id": project.id,
                    "name": project.name,
                    "description": project.description,
                    "owner_id": project.owner_id,
                    "created_at": project.created_at,
                    "updated_at": project.updated_at,
                    "has_description": 1 if project.description else 0,
                    "text_length": len(project.name + (project.description or "")),
                    "total_impact": total_impact,
                    "impact_category": self._categorize_impact(total_impact),
                    "days_since_creation": (
                        datetime.utcnow() - project.created_at
                    ).days,
                }
                data.append(project_dict)

            return pd.DataFrame(data)
        except Exception as e:
            logger.error(f"Error preparing project data: {e}")
            return pd.DataFrame()

    def _categorize_amount(self, amount: Optional[float]) -> str:
        """Categorize grant amounts."""
        if not amount:
            return "unknown"
        elif amount < 10000:
            return "small"
        elif amount < 100000:
            return "medium"
        elif amount < 1000000:
            return "large"
        else:
            return "very_large"

    def _categorize_impact(self, impact: float) -> str:
        """Categorize project impact."""
        if impact < 10:
            return "low"
        elif impact < 50:
            return "medium"
        elif impact < 100:
            return "high"
        else:
            return "very_high"

    def train_grant_recommendation_model(self) -> Dict[str, Any]:
        """Train a model to recommend grants based on project characteristics."""
        try:
            # Prepare data
            grants_df = self.prepare_grant_data()
            projects_df = self.prepare_project_data()

            if grants_df.empty or projects_df.empty:
                return {"success": False, "message": "Insufficient data for training"}

            # Create features for grant-project matching
            features = []
            labels = []

            # For each project, create features based on grant characteristics
            for _, project in projects_df.iterrows():
                for _, grant in grants_df.iterrows():
                    # Create matching features
                    feature_vector = [
                        project["text_length"],
                        project["total_impact"],
                        grant["amount"] or 0,
                        grant["text_length"],
                        grant["has_description"],
                        grant["has_amount"],
                        grant["days_to_deadline"],
                        grant["is_active"],
                    ]

                    # Simple matching logic (can be enhanced)
                    match_score = self._calculate_match_score(project, grant)
                    features.append(feature_vector)
                    labels.append(1 if match_score > 0.5 else 0)

            if not features:
                return {"success": False, "message": "No features generated"}

            # Convert to numpy arrays
            X = np.array(features)
            y = np.array(labels)

            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )

            # Scale features
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)

            # Train model
            model = RandomForestClassifier(n_estimators=100, random_state=42)
            model.fit(X_train_scaled, y_train)

            # Evaluate
            y_pred = model.predict(X_test_scaled)
            accuracy = accuracy_score(y_test, y_pred)

            # Save model and scaler
            model_path = os.path.join(self.models_dir, "grant_recommendation_model.pkl")
            scaler_path = os.path.join(
                self.models_dir, "grant_recommendation_scaler.pkl"
            )

            joblib.dump(model, model_path)
            joblib.dump(scaler, scaler_path)

            self.models["grant_recommendation"] = model
            self.scalers["grant_recommendation"] = scaler

            return {
                "success": True,
                "accuracy": accuracy,
                "model_path": model_path,
                "scaler_path": scaler_path,
                "features_used": len(features[0]) if features else 0,
                "training_samples": len(features),
            }

        except Exception as e:
            logger.error(f"Error training grant recommendation model: {e}")
            return {"success": False, "message": str(e)}

    def _calculate_match_score(self, project: pd.Series, grant: pd.Series) -> float:
        """Calculate a simple match score between project and grant."""
        score = 0.0

        # Amount compatibility
        if grant["amount"] and project["total_impact"]:
            amount_ratio = min(grant["amount"], project["total_impact"]) / max(
                grant["amount"], project["total_impact"]
            )
            score += amount_ratio * 0.3

        # Text similarity (simple length-based)
        text_similarity = 1 - abs(project["text_length"] - grant["text_length"]) / max(
            project["text_length"], grant["text_length"], 1
        )
        score += text_similarity * 0.2

        # Active grants preferred
        score += grant["is_active"] * 0.3

        # Recent grants preferred
        if grant["days_to_deadline"] > 0:
            score += 0.2

        return min(score, 1.0)

    def predict_grant_recommendations(
        self, project_id: int, top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """Predict grant recommendations for a specific project."""
        try:
            # Load model if not already loaded
            if "grant_recommendation" not in self.models:
                model_path = os.path.join(
                    self.models_dir, "grant_recommendation_model.pkl"
                )
                scaler_path = os.path.join(
                    self.models_dir, "grant_recommendation_scaler.pkl"
                )

                if not os.path.exists(model_path):
                    return []

                self.models["grant_recommendation"] = joblib.load(model_path)
                self.scalers["grant_recommendation"] = joblib.load(scaler_path)

            # Get project data
            project = self.db.query(Project).filter(Project.id == project_id).first()
            if not project:
                return []

            # Get all grants
            grants = self.db.query(Grant).filter(Grant.status == "active").all()

            recommendations = []
            for grant in grants:
                # Create feature vector
                project_metrics = (
                    self.db.query(Metric).filter(Metric.project_id == project.id).all()
                )
                total_impact = sum(m.value for m in project_metrics if m.value)

                feature_vector = [
                    len(project.name + (project.description or "")),
                    total_impact,
                    grant.amount or 0,
                    len(grant.title + (grant.description or "")),
                    1 if grant.description else 0,
                    1 if grant.amount else 0,
                    (grant.deadline - datetime.utcnow()).days if grant.deadline else 0,
                    1 if grant.status == "active" else 0,
                ]

                # Scale features
                X_scaled = self.scalers["grant_recommendation"].transform(
                    [feature_vector]
                )

                # Predict
                prediction = self.models["grant_recommendation"].predict_proba(
                    X_scaled
                )[0]
                match_probability = prediction[1]  # Probability of good match

                recommendations.append(
                    {
                        "grant_id": grant.id,
                        "grant_title": grant.title,
                        "grant_amount": grant.amount,
                        "grant_deadline": grant.deadline,
                        "match_probability": match_probability,
                        "match_score": self._calculate_match_score(
                            pd.Series(
                                {
                                    "text_length": len(
                                        project.name + (project.description or "")
                                    ),
                                    "total_impact": total_impact,
                                }
                            ),
                            pd.Series(
                                {
                                    "amount": grant.amount,
                                    "text_length": len(
                                        grant.title + (grant.description or "")
                                    ),
                                    "is_active": 1 if grant.status == "active" else 0,
                                    "days_to_deadline": (
                                        (grant.deadline - datetime.utcnow()).days
                                        if grant.deadline
                                        else 0
                                    ),
                                }
                            ),
                        ),
                    }
                )

            # Sort by match probability and return top_k
            recommendations.sort(key=lambda x: x["match_probability"], reverse=True)
            return recommendations[:top_k]

        except Exception as e:
            logger.error(f"Error predicting grant recommendations: {e}")
            return []

    def analyze_impact_trends(self) -> Dict[str, Any]:
        """Analyze impact trends and patterns."""
        try:
            # Get all metrics with timestamps
            metrics = self.db.query(Metric).all()

            if not metrics:
                return {"success": False, "message": "No metrics data available"}

            # Prepare data
            data = []
            for metric in metrics:
                data.append(
                    {
                        "project_id": metric.project_id,
                        "value": metric.value,
                        "created_at": metric.created_at,
                        "metric_type": metric.metric_type,
                    }
                )

            df = pd.DataFrame(data)

            # Time series analysis
            df["date"] = pd.to_datetime(df["created_at"])
            df["month"] = df["date"].dt.to_period("M")

            monthly_impact = df.groupby("month")["value"].sum().reset_index()
            monthly_impact["month"] = monthly_impact["month"].astype(str)

            # Trend analysis
            if len(monthly_impact) > 1:
                trend_slope = np.polyfit(
                    range(len(monthly_impact)), monthly_impact["value"], 1
                )[0]
                trend_direction = "increasing" if trend_slope > 0 else "decreasing"
            else:
                trend_direction = "stable"

            # Project impact distribution
            project_impact = df.groupby("project_id")["value"].sum()
            impact_stats = {
                "mean": project_impact.mean(),
                "median": project_impact.median(),
                "std": project_impact.std(),
                "total_projects": len(project_impact),
            }

            return {
                "success": True,
                "monthly_impact": monthly_impact.to_dict("records"),
                "trend_direction": trend_direction,
                "impact_statistics": impact_stats,
                "total_metrics": len(metrics),
                "date_range": {
                    "start": df["date"].min().isoformat(),
                    "end": df["date"].max().isoformat(),
                },
            }

        except Exception as e:
            logger.error(f"Error analyzing impact trends: {e}")
            return {"success": False, "message": str(e)}

    def predict_project_success(self, project_id: int) -> Dict[str, Any]:
        """Predict the likelihood of project success."""
        try:
            project = self.db.query(Project).filter(Project.id == project_id).first()
            if not project:
                return {"success": False, "message": "Project not found"}

            # Get project metrics
            metrics = (
                self.db.query(Metric).filter(Metric.project_id == project_id).all()
            )
            total_impact = sum(m.value for m in metrics if m.value)

            # Get project tasks
            tasks = self.db.query(Task).filter(Task.project_id == project_id).all()
            completed_tasks = sum(1 for t in tasks if t.status == TaskStatus.COMPLETED)
            total_tasks = len(tasks)

            # Calculate success indicators
            completion_rate = completed_tasks / total_tasks if total_tasks > 0 else 0
            impact_score = min(total_impact / 100, 1.0)  # Normalize impact
            time_efficiency = 1.0  # Placeholder for time-based efficiency

            # Simple success prediction (can be enhanced with ML)
            success_probability = (
                completion_rate * 0.4 + impact_score * 0.4 + time_efficiency * 0.2
            )

            return {
                "success": True,
                "project_id": project_id,
                "success_probability": success_probability,
                "completion_rate": completion_rate,
                "impact_score": impact_score,
                "total_tasks": total_tasks,
                "completed_tasks": completed_tasks,
                "total_impact": total_impact,
                "confidence_level": (
                    "medium" if 0.3 < success_probability < 0.7 else "high"
                ),
            }

        except Exception as e:
            logger.error(f"Error predicting project success: {e}")
            return {"success": False, "message": str(e)}

    def get_ml_insights(self) -> Dict[str, Any]:
        """Get comprehensive ML insights and analytics."""
        try:
            insights = {
                "grant_recommendations": {
                    "model_trained": os.path.exists(
                        os.path.join(self.models_dir, "grant_recommendation_model.pkl")
                    ),
                    "last_training": self._get_last_training_time(),
                },
                "impact_analysis": self.analyze_impact_trends(),
                "data_summary": self._get_data_summary(),
                "recommendations": self._generate_recommendations(),
            }

            return insights

        except Exception as e:
            logger.error(f"Error getting ML insights: {e}")
            return {"success": False, "message": str(e)}

    def _get_last_training_time(self) -> Optional[str]:
        """Get the last training time for models."""
        model_path = os.path.join(self.models_dir, "grant_recommendation_model.pkl")
        if os.path.exists(model_path):
            return datetime.fromtimestamp(os.path.getmtime(model_path)).isoformat()
        return None

    def _get_data_summary(self) -> Dict[str, Any]:
        """Get summary of available data."""
        try:
            grants_count = self.db.query(Grant).count()
            projects_count = self.db.query(Project).count()
            metrics_count = self.db.query(Metric).count()
            users_count = self.db.query(User).count()

            return {
                "grants": grants_count,
                "projects": projects_count,
                "metrics": metrics_count,
                "users": users_count,
                "data_quality": (
                    "good"
                    if grants_count > 10 and projects_count > 5
                    else "needs_more_data"
                ),
            }
        except Exception as e:
            logger.error(f"Error getting data summary: {e}")
            return {}

    def _generate_recommendations(self) -> List[str]:
        """Generate actionable recommendations based on data analysis."""
        recommendations = []

        try:
            # Check data quality
            data_summary = self._get_data_summary()

            if data_summary.get("data_quality") == "needs_more_data":
                recommendations.append(
                    "Add more projects and grants to improve ML model accuracy"
                )

            # Check model status
            if not os.path.exists(
                os.path.join(self.models_dir, "grant_recommendation_model.pkl")
            ):
                recommendations.append(
                    "Train the grant recommendation model for better matching"
                )

            # Check for active grants
            active_grants = (
                self.db.query(Grant).filter(Grant.status == "active").count()
            )
            if active_grants < 5:
                recommendations.append(
                    "Add more active grants to improve recommendation quality"
                )

            # Check project completion rates
            projects = self.db.query(Project).all()
            if projects:
                avg_completion = sum(
                    1
                    for p in projects
                    if self.db.query(Task)
                    .filter(
                        Task.project_id == p.id, Task.status == TaskStatus.COMPLETED
                    )
                    .count()
                    > 0
                ) / len(projects)

                if avg_completion < 0.5:
                    recommendations.append(
                        "Focus on completing more projects to improve success prediction"
                    )

            return recommendations

        except Exception as e:
            logger.error(f"Error generating recommendations: {e}")
            return ["Enable data collection to generate personalized recommendations"]
