#!/usr/bin/env python3
"""
Mock API Server for SGE Presentation
This provides a working API without database dependencies.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from datetime import datetime
import json

app = FastAPI(
    title="SGE Mock API",
    description="Mock API for SGE Presentation",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock data
SGE_TEAM = [
    {
        "id": 1,
        "email": "ursula.searle@shadowgoose.com",
        "full_name": "Ursula Searle",
        "job_title": "Managing Director",
        "organisation": "Shadow Goose Entertainment",
        "bio": "Strategic leader focused on sustainable media impact and organisational growth",
        "skills": ["Strategic Planning", "Leadership", "Project Management", "Business Development"],
        "current_status": "available",
        "is_intern": False,
        "is_active": True,
        "avatar_url": None
    },
    {
        "id": 2,
        "email": "ash.dorman@shadowgoose.com",
        "full_name": "Ash Dorman",
        "job_title": "Managing Director",
        "organisation": "Shadow Goose Entertainment",
        "bio": "Creative visionary driving innovative media solutions and strategic partnerships",
        "skills": ["Creative Direction", "Strategic Planning", "Partnership Development"],
        "current_status": "available",
        "is_intern": False,
        "is_active": True,
        "avatar_url": None
    },
    {
        "id": 3,
        "email": "shamita.siva@shadowgoose.com",
        "full_name": "Shamita Siva",
        "job_title": "Creative Director",
        "organisation": "Shadow Goose Entertainment",
        "bio": "Creative powerhouse driving visual storytelling and brand innovation",
        "skills": ["Creative Direction", "Visual Design", "Brand Strategy", "Storytelling"],
        "current_status": "busy",
        "is_intern": False,
        "is_active": True,
        "avatar_url": None
    },
    {
        "id": 4,
        "email": "alan.mccarthy@shadowgoose.com",
        "full_name": "Alan McCarthy",
        "job_title": "Impact Director",
        "organisation": "Shadow Goose Entertainment",
        "bio": "Impact measurement specialist focused on sustainable outcomes and social change",
        "skills": ["Impact Measurement", "Sustainability", "Data Analysis", "Project Management"],
        "current_status": "available",
        "is_intern": False,
        "is_active": True,
        "avatar_url": None
    },
    {
        "id": 5,
        "email": "mish.rep@shadowgoose.com",
        "full_name": "Mish Rep",
        "job_title": "Operations Officer",
        "organisation": "Shadow Goose Entertainment",
        "bio": "Operations expert ensuring smooth project delivery and team coordination",
        "skills": ["Operations Management", "Project Coordination", "Team Leadership"],
        "current_status": "available",
        "is_intern": False,
        "is_active": True,
        "avatar_url": None
    },
    {
        "id": 6,
        "email": "kiara.holt@shadowgoose.com",
        "full_name": "Kiara Holt",
        "job_title": "Intern",
        "organisation": "Shadow Goose Entertainment",
        "bio": "Emerging talent learning the ropes of media production and impact measurement",
        "skills": ["Media Production", "Research", "Social Media"],
        "current_status": "available",
        "is_intern": True,
        "is_active": True,
        "avatar_url": None
    }
]

MOCK_PROJECTS = [
    {
        "id": 1,
        "title": "Wild Hearts Documentary",
        "description": "Feature documentary exploring environmental conservation",
        "status": "in_progress",
        "progress": 75,
        "team": ["Ursula Searle", "Shamita Siva", "Kiara Holt"],
        "impact_score": 85
    },
    {
        "id": 2,
        "title": "Around the Table Series",
        "description": "Community-focused storytelling platform",
        "status": "planning",
        "progress": 25,
        "team": ["Ash Dorman", "Alan McCarthy"],
        "impact_score": 92
    }
]

MOCK_GRANTS = [
    {
        "id": 1,
        "title": "Environmental Media Grant",
        "amount": 50000,
        "deadline": "2024-12-31",
        "status": "applied",
        "organisation": "Green Media Foundation"
    },
    {
        "id": 2,
        "title": "Community Impact Fund",
        "amount": 75000,
        "deadline": "2024-11-15",
        "status": "shortlisted",
        "organisation": "Social Innovation Trust"
    }
]

# Pydantic models
class UserProfile(BaseModel):
    id: int
    email: str
    full_name: str
    job_title: str
    organisation: str
    bio: str
    skills: List[str]
    current_status: str
    is_intern: bool
    is_active: bool
    avatar_url: Optional[str] = None

class Project(BaseModel):
    id: int
    title: str
    description: str
    status: str
    progress: int
    team: List[str]
    impact_score: int

class Grant(BaseModel):
    id: int
    title: str
    amount: int
    deadline: str
    status: str
    organisation: str

# Health endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "SGE Mock API is running",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/v1/health")
async def api_health():
    return {
        "status": "healthy",
        "message": "SGE Mock API v1 is running",
        "version": "1.0.0"
    }

# Team endpoints
@app.get("/api/v1/users/sge-team", response_model=List[UserProfile])
async def get_sge_team():
    """Get SGE team members."""
    return SGE_TEAM

@app.get("/api/v1/users/team", response_model=List[UserProfile])
async def get_team_members():
    """Get all team members."""
    return SGE_TEAM

@app.get("/api/v1/users/interns", response_model=List[UserProfile])
async def get_interns():
    """Get intern team members."""
    return [member for member in SGE_TEAM if member["is_intern"]]

# Projects endpoints
@app.get("/api/v1/projects", response_model=List[Project])
async def get_projects():
    """Get all projects."""
    return MOCK_PROJECTS

@app.get("/api/v1/projects/{project_id}", response_model=Project)
async def get_project(project_id: int):
    """Get specific project."""
    for project in MOCK_PROJECTS:
        if project["id"] == project_id:
            return project
    raise HTTPException(status_code=404, detail="Project not found")

# Grants endpoints
@app.get("/api/v1/grants", response_model=List[Grant])
async def get_grants():
    """Get all grants."""
    return MOCK_GRANTS

@app.get("/api/v1/grants/{grant_id}", response_model=Grant)
async def get_grant(grant_id: int):
    """Get specific grant."""
    for grant in MOCK_GRANTS:
        if grant["id"] == grant_id:
            return grant
    raise HTTPException(status_code=404, detail="Grant not found")

# User profile endpoints
@app.get("/api/v1/users/profile", response_model=UserProfile)
async def get_current_user_profile():
    """Get current user profile (mock - returns Alan)."""
    return next(member for member in SGE_TEAM if member["email"] == "alan.mccarthy@shadowgoose.com")

@app.put("/api/v1/users/status")
async def update_user_status():
    """Update user status."""
    return {"message": "Status updated successfully"}

# Impact endpoints
@app.get("/api/v1/impact/metrics")
async def get_impact_metrics():
    """Get impact metrics."""
    return {
        "total_projects": len(MOCK_PROJECTS),
        "total_grants": len(MOCK_GRANTS),
        "average_impact_score": 88.5,
        "team_members": len(SGE_TEAM),
        "active_projects": 2
    }

# Tasks endpoints
@app.get("/api/v1/tasks")
async def get_tasks():
    """Get all tasks."""
    return {
        "tasks": [
            {
                "id": 1,
                "title": "Review grant applications",
                "status": "in_progress",
                "assigned_to": "Ursula Searle",
                "due_date": "2024-08-15"
            },
            {
                "id": 2,
                "title": "Edit Wild Hearts footage",
                "status": "pending",
                "assigned_to": "Shamita Siva",
                "due_date": "2024-08-20"
            }
        ]
    }

if __name__ == "__main__":
    print("🚀 Starting SGE Mock API Server...")
    print("📍 API will be available at: http://localhost:8000")
    print("📊 Health check: http://localhost:8000/health")
    print("👥 Team data: http://localhost:8000/api/v1/users/sge-team")
    print("📁 Projects: http://localhost:8000/api/v1/projects")
    print("💰 Grants: http://localhost:8000/api/v1/grants")
    print("\n🎯 Perfect for SGE presentation!")
    
    uvicorn.run(app, host="127.0.0.1", port=8000) 