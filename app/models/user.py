from datetime import datetime

from app.db.base_class import Base
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.orm import relationship


class User(Base):
    """Model for users."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # New profile fields (all nullable to maintain backward compatibility)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String(500), nullable=True)
    job_title = Column(String(200), nullable=True)
    organisation = Column(String(200), nullable=True)
    phone = Column(String(50), nullable=True)
    location = Column(String(200), nullable=True)
    timezone = Column(String(50), nullable=True)
    current_status = Column(String(50), nullable=True, default="available")
    skills = Column(ARRAY(String), nullable=True, default=[])
    interests = Column(ARRAY(String), nullable=True, default=[])
    social_links = Column(JSONB, nullable=True, default={})
    is_intern = Column(Boolean, nullable=True, default=False)
    mentor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    preferences = Column(JSONB, nullable=True, default={})

    # Project relationships (using string references to avoid circular imports)
    owned_projects = relationship(
        "Project", back_populates="owner", cascade="all, delete-orphan"
    )
    team_memberships = relationship(
        "TeamMember", back_populates="user", cascade="all, delete-orphan"
    )

    # Task relationships (using string references)
    created_tasks = relationship(
        "Task", foreign_keys="[Task.creator_id]", back_populates="creator"
    )
    assigned_tasks = relationship(
        "Task", foreign_keys="[Task.assignee_id]", back_populates="assignee"
    )

    # Comment relationships (using string references)
    comments = relationship(
        "TaskComment", back_populates="user", cascade="all, delete-orphan"
    )
    reactions = relationship(
        "Reaction", back_populates="user", cascade="all, delete-orphan"
    )

    # Time tracking (using string references)
    time_entries = relationship(
        "TimeEntry", back_populates="user", cascade="all, delete-orphan"
    )

    # Mentorship relationships (using string references)
    mentor = relationship("User", remote_side=[id], backref="mentees")

    # Grant relationships
    # grants = relationship("Grant", back_populates="created_by", foreign_keys="[Grant.created_by_id]")  # Temporarily disabled
