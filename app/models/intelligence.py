from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base


class GrantSuccessMetrics(Base):
    __tablename__ = "grant_success_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    grant_id = Column(Integer, ForeignKey("grants.id"))
    success_probability = Column(Float, nullable=False)
    confidence_score = Column(Float, nullable=False)
    prediction_features = Column(JSON, nullable=True)
    model_version = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships (temporarily commented out for migration)
    # grant = relationship("Grant", back_populates="success_metrics")


class FunderProfile(Base):
    __tablename__ = "funder_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    funder_name = Column(String, unique=True, index=True, nullable=False)
    mission_statement = Column(Text, nullable=True)
    sdg_alignment = Column(JSON, nullable=True)  # UN SDG goals alignment
    strategic_priorities = Column(JSON, nullable=True)
    success_patterns = Column(JSON, nullable=True)
    average_grant_amount = Column(Float, nullable=True)
    success_rate = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class SectorAnalytics(Base):
    __tablename__ = "sector_analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    sector_name = Column(String, index=True, nullable=False)
    total_grants = Column(Integer, default=0)
    total_funding = Column(Float, default=0.0)
    average_success_rate = Column(Float, default=0.0)
    seasonality_pattern = Column(JSON, nullable=True)
    trend_data = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class PredictiveModel(Base):
    __tablename__ = "predictive_models"
    
    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String, nullable=False)
    model_version = Column(String, nullable=False)
    model_type = Column(String, nullable=False)  # 'success_prediction', 'recommendation', etc.
    model_data = Column(JSON, nullable=True)  # Serialized model
    accuracy_score = Column(Float, nullable=True)
    feature_importance = Column(JSON, nullable=True)
    training_data_size = Column(Integer, nullable=True)
    last_trained = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) 