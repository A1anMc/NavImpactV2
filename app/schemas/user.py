from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    """Base user schema with common fields."""

    email: EmailStr
    full_name: Optional[str] = None
    is_active: bool = True


class UserProfileBase(BaseModel):
    """Base profile schema with new profile fields."""

    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    job_title: Optional[str] = None
    organisation: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    timezone: Optional[str] = None
    current_status: Optional[str] = "available"
    skills: Optional[List[str]] = []
    interests: Optional[List[str]] = []
    social_links: Optional[Dict[str, Any]] = {}
    is_intern: Optional[bool] = False
    mentor_id: Optional[int] = None
    preferences: Optional[Dict[str, Any]] = {}


class UserCreate(UserBase):
    """Schema for creating a new user."""

    hashed_password: str


class UserUpdate(BaseModel):
    """Schema for updating user profile."""

    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    job_title: Optional[str] = None
    organisation: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    timezone: Optional[str] = None
    current_status: Optional[str] = None
    skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    social_links: Optional[Dict[str, Any]] = None
    is_intern: Optional[bool] = None
    mentor_id: Optional[int] = None
    preferences: Optional[Dict[str, Any]] = None


class UserInDB(UserBase, UserProfileBase):
    """Schema for user in database."""

    id: int
    hashed_password: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserProfile(UserBase, UserProfileBase):
    """Schema for user profile (public view)."""

    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserPublic(BaseModel):
    """Schema for public user information."""

    id: int
    full_name: Optional[str] = None
    job_title: Optional[str] = None
    organisation: Optional[str] = None
    avatar_url: Optional[str] = None
    current_status: Optional[str] = None
    skills: Optional[List[str]] = []
    is_intern: bool = False
    mentor_id: Optional[int] = None

    class Config:
        from_attributes = True


class UserStatusUpdate(BaseModel):
    """Schema for updating user status."""

    current_status: str


class UserMentorUpdate(BaseModel):
    """Schema for updating user mentor."""

    mentor_id: Optional[int] = None


class SGETeamMember(UserPublic):
    """Schema for SGE team member with additional fields."""

    bio: Optional[str] = None
    location: Optional[str] = None
    timezone: Optional[str] = None
    interests: Optional[List[str]] = []
    social_links: Optional[Dict[str, Any]] = {}
    projects_assigned: Optional[List[str]] = []


class InternProfile(SGETeamMember):
    """Schema for intern profile with learning progress."""

    mentor_name: Optional[str] = None
    learning_goals: Optional[List[str]] = []
    skills_learning: Optional[List[str]] = []
    projects_involved: Optional[List[str]] = []
