import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
from typing import Dict, List, Optional, Tuple
import logging
from datetime import datetime

from app.db.session import get_db
from app.models.grant import Grant
from app.models.intelligence import GrantSuccessMetrics, PredictiveModel

logger = logging.getLogger(__name__)

class MLService:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.model_versions = {}
    
    def prepare_training_data(self, db) -> Tuple[pd.DataFrame, pd.Series]:
        """Prepare training data from existing grants"""
        try:
            # Get all grants with success metrics
            grants = db.query(Grant).all()
            
            features = []
            labels = []
            
            for grant in grants:
                # Extract features
                grant_features = {
                    'amount': grant.max_amount or 0,
                    'sector_count': len(grant.sector_tags or []),
                    'has_deadline': 1 if grant.deadline else 0,
                    'days_to_deadline': (grant.deadline - datetime.now()).days if grant.deadline else 365,
                    'is_active': 1 if grant.status == 'open' else 0,
                }
                
                # Add sector-specific features
                if grant.sector_tags:
                    for sector in grant.sector_tags:
                        grant_features[f'sector_{sector.lower().replace(" ", "_")}'] = 1
                
                features.append(grant_features)
                
                # For now, use a simple heuristic for success
                # In real implementation, this would come from actual application data
                success = 1 if grant.status == 'open' and grant.max_amount > 100000 else 0
                labels.append(success)
            
            return pd.DataFrame(features), pd.Series(labels)
            
        except Exception as e:
            logger.error(f"Error preparing training data: {e}")
            return pd.DataFrame(), pd.Series()
    
    def train_success_prediction_model(self, db) -> Dict:
        """Train a basic success prediction model"""
        try:
            # Prepare data
            X, y = self.prepare_training_data(db)
            
            if X.empty or len(X) < 10:
                logger.warning("Insufficient data for training")
                return {"success": False, "message": "Insufficient data"}
            
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
            
            # Save model
            model_version = f"v1.0_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            
            # Store in database
            model_record = PredictiveModel(
                model_name="grant_success_prediction",
                model_version=model_version,
                model_type="success_prediction",
                model_data={
                    "feature_names": list(X.columns),
                    "model_params": model.get_params()
                },
                accuracy_score=accuracy,
                feature_importance=dict(zip(X.columns, model.feature_importances_)),
                training_data_size=len(X),
                last_trained=datetime.now(),
                is_active=True
            )
            
            db.add(model_record)
            db.commit()
            
            # Store in memory
            self.models["success_prediction"] = model
            self.scalers["success_prediction"] = scaler
            self.model_versions["success_prediction"] = model_version
            
            logger.info(f"Success prediction model trained with accuracy: {accuracy:.3f}")
            
            return {
                "success": True,
                "accuracy": accuracy,
                "model_version": model_version,
                "feature_importance": dict(zip(X.columns, model.feature_importances_))
            }
            
        except Exception as e:
            logger.error(f"Error training success prediction model: {e}")
            return {"success": False, "error": str(e)}
    
    def predict_grant_success(self, grant: Grant, db) -> Dict:
        """Predict success probability for a specific grant"""
        try:
            if "success_prediction" not in self.models:
                # Load latest model from database
                latest_model = db.query(PredictiveModel).filter(
                    PredictiveModel.model_name == "grant_success_prediction",
                    PredictiveModel.is_active == True
                ).order_by(PredictiveModel.last_trained.desc()).first()
                
                if not latest_model:
                    return self._simple_success_prediction(grant)
            
            # Prepare grant features
            features = {
                'amount': grant.max_amount or 0,
                'sector_count': len(grant.sector_tags or []),
                'has_deadline': 1 if grant.deadline else 0,
                'days_to_deadline': (grant.deadline - datetime.now()).days if grant.deadline else 365,
                'is_active': 1 if grant.status == 'open' else 0,
            }
            
            # Add sector features
            if grant.sector_tags:
                for sector in grant.sector_tags:
                    features[f'sector_{sector.lower().replace(" ", "_")}'] = 1
            
            # Convert to DataFrame
            X = pd.DataFrame([features])
            
            # Scale features
            X_scaled = self.scalers["success_prediction"].transform(X)
            
            # Predict
            success_prob = self.models["success_prediction"].predict_proba(X_scaled)[0][1]
            
            return {
                "success": True,
                "success_probability": float(success_prob),
                "confidence_score": 0.8,  # Placeholder
                "model_version": self.model_versions["success_prediction"]
            }
            
        except Exception as e:
            logger.error(f"Error predicting grant success: {e}")
            return self._simple_success_prediction(grant)
    
    def _simple_success_prediction(self, grant: Grant) -> Dict:
        """Simple heuristic-based success prediction"""
        try:
            # Simple scoring based on grant characteristics
            score = 0.5  # Base score
            
            # Amount factor
            if grant.max_amount:
                if grant.max_amount > 500000:
                    score += 0.2
                elif grant.max_amount > 100000:
                    score += 0.1
                else:
                    score -= 0.1
            
            # Status factor
            if grant.status == 'open':
                score += 0.1
            
            # Deadline factor
            if grant.deadline:
                days_to_deadline = (grant.deadline - datetime.now()).days
                if 30 <= days_to_deadline <= 90:
                    score += 0.1
                elif days_to_deadline < 30:
                    score -= 0.1
            
            # Sector factor
            if grant.sector_tags:
                score += min(len(grant.sector_tags) * 0.05, 0.2)
            
            # Normalize to 0-1
            score = max(0.0, min(1.0, score))
            
            return {
                "success": True,
                "success_probability": score,
                "confidence_score": 0.6,  # Lower confidence for simple model
                "model_version": "simple_heuristic_v1.0"
            }
            
        except Exception as e:
            logger.error(f"Error in simple success prediction: {e}")
            return {"success": False, "error": str(e)}

# Global ML service instance
ml_service = MLService() 