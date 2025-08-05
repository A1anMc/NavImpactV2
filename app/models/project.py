from datetime import datetime

from app.db.base_class import Base
from app.models.project_tags import project_tags
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship


class Project(Base):
    """Model for projects."""

    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String, nullable=False, default="planning")
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Impact Context Fields
    outcome_text = Column(Text, nullable=True)
    impact_statement = Column(Text, nullable=True)
    impact_types = Column(JSONB, nullable=True)  # Using JSONB for lists
    sdg_tags = Column(JSONB, nullable=True)  # Using JSONB for lists
    framework_alignment = Column(JSONB, nullable=True)  # Victorian framework alignment
    evidence_sources = Column(Text, nullable=True)

    # Relationships
    owner = relationship("User", back_populates="owned_projects")
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    team_members = relationship(
        "TeamMember", back_populates="project", cascade="all, delete-orphan"
    )
    metrics = relationship(
        "Metric", back_populates="project", cascade="all, delete-orphan"
    )
    program_logic = relationship(
        "ProgramLogic", back_populates="project", cascade="all, delete-orphan"
    )
    tags = relationship("Tag", secondary=project_tags, back_populates="projects")

    # SGE Media Module Relationship
    sge_media_projects = relationship(
        "SgeMediaProject", back_populates="project", cascade="all, delete-orphan"
    )
