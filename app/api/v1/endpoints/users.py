import logging
from typing import List

from app.core.deps import get_current_user, get_db
from app.core.security import get_password_hash
from app.models.user import User
from app.schemas.user import (InternProfile, SGETeamMember, UserMentorUpdate,
                              UserProfile, UserPublic, UserStatusUpdate,
                              UserUpdate)
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/")
async def list_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str = None,
    current_user: User = Depends(get_current_user),
):
    """List users with filtering and pagination."""
    query = db.query(User)

    # Apply search filter
    if search:
        query = query.filter(
            User.full_name.ilike(f"%{search}%") | User.email.ilike(f"%{search}%")
        )

    # Get total count
    total = query.count()

    # Apply pagination
    users = query.offset(skip).limit(limit).all()

    return {
        "items": users,
        "total": total,
        "page": (skip // limit) + 1,
        "size": limit,
        "has_next": skip + limit < total,
        "has_prev": skip > 0,
    }


# Temporary endpoint for creating SGE team members (placed first to avoid route conflicts)
@router.post("/setup-sge-team")
async def setup_sge_team(db: Session = Depends(get_db)):
    """Create SGE team members (temporary endpoint for setup)."""
    try:
        # SGE Team Members Data
        sge_team = [
            {
                "email": "ursula@shadowgoose.com",
                "full_name": "Ursula Searle",
                "job_title": "Managing Director",
                "organisation": "Shadow Goose Entertainment",
                "bio": "Strategic leader focused on sustainable media impact and organisational growth",
                "skills": [
                    "Strategic Planning",
                    "Leadership",
                    "Project Management",
                    "Business Development",
                ],
                "current_status": "available",
                "is_intern": False,
                "password": "SGE2024!",
            },
            {
                "email": "ash@shadowgoose.com",
                "full_name": "Ash Dorman",
                "job_title": "Managing Director",
                "organisation": "Shadow Goose Entertainment",
                "bio": "Business development and strategic partnerships specialist",
                "skills": [
                    "Strategic Planning",
                    "Leadership",
                    "Business Development",
                    "Partnerships",
                ],
                "current_status": "available",
                "is_intern": False,
                "password": "SGE2024!",
            },
            {
                "email": "shamita@shadowgoose.com",
                "full_name": "Shamita Siva",
                "job_title": "Creative Director",
                "organisation": "Shadow Goose Entertainment",
                "bio": "Creative visionary driving storytelling and media production excellence",
                "skills": [
                    "Creative Direction",
                    "Storytelling",
                    "Media Production",
                    "Content Strategy",
                ],
                "current_status": "available",
                "is_intern": False,
                "password": "SGE2024!",
            },
            {
                "email": "alan@navimpact.org",
                "full_name": "Alan McCarthy",
                "job_title": "Impact Director",
                "organisation": "Shadow Goose Entertainment",
                "bio": "Impact measurement and stakeholder engagement specialist",
                "skills": [
                    "Impact Measurement",
                    "Data Analysis",
                    "Stakeholder Engagement",
                    "Sustainability",
                ],
                "current_status": "available",
                "is_intern": False,
                "password": "SGE2024!",
            },
            {
                "email": "mish@shadowgoose.com",
                "full_name": "Mish Rep",
                "job_title": "Operations Officer",
                "organisation": "Shadow Goose Entertainment",
                "bio": "Operations management and process optimization expert",
                "skills": [
                    "Operations Management",
                    "Coordination",
                    "Process Improvement",
                    "Project Coordination",
                ],
                "current_status": "available",
                "is_intern": False,
                "password": "SGE2024!",
            },
            {
                "email": "kiara@shadowgoose.com",
                "full_name": "Kiara Holt",
                "job_title": "Intern",
                "organisation": "Shadow Goose Entertainment",
                "bio": "Learning media production and impact measurement",
                "skills": ["Research", "Content Creation", "Social Media", "Learning"],
                "current_status": "learning",
                "is_intern": True,
                "password": "SGE2024!",
            },
        ]

        created_users = []

        for member_data in sge_team:
            # Check if user already exists
            existing_user = (
                db.query(User).filter(User.email == member_data["email"]).first()
            )

            if existing_user:
                logger.info(f"User {member_data['email']} already exists, skipping...")
                created_users.append(existing_user)
                continue

            # Create new user
            user = User(
                email=member_data["email"],
                hashed_password=get_password_hash(member_data["password"]),
                full_name=member_data["full_name"],
                job_title=member_data["job_title"],
                organisation=member_data["organisation"],
                bio=member_data["bio"],
                skills=member_data["skills"],
                current_status=member_data["current_status"],
                is_intern=member_data["is_intern"],
                is_active=True,
            )

            db.add(user)
            created_users.append(user)
            logger.info(
                f"Created: {member_data['full_name']} ({member_data['job_title']})"
            )

        # Set up mentorship relationship (Shamita mentors Kiara)
        shamita = next(
            (u for u in created_users if u.email == "shamita@shadowgoose.com"), None
        )
        kiara = next(
            (u for u in created_users if u.email == "kiara@shadowgoose.com"), None
        )

        if shamita and kiara:
            kiara.mentor_id = shamita.id
            logger.info(f"Set up mentorship: {shamita.full_name} → {kiara.full_name}")

        # Commit all changes
        db.commit()

        return {
            "message": "SGE team created successfully",
            "created_count": len(created_users),
            "users": [
                {
                    "id": user.id,
                    "email": user.email,
                    "full_name": user.full_name,
                    "job_title": user.job_title,
                    "is_intern": user.is_intern,
                    "mentor_id": user.mentor_id,
                }
                for user in created_users
            ],
        }

    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error creating SGE team: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error creating SGE team: {str(e)}",
        )
    except Exception as e:
        logger.error(f"Error creating SGE team: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating SGE team: {str(e)}",
        )


# Simple test endpoint to create one user
@router.post("/test-create-user")
async def test_create_user(db: Session = Depends(get_db)):
    """Test creating a single user to isolate database issues."""
    try:
        # Check if user already exists
        existing_user = (
            db.query(User).filter(User.email == "test@shadowgoose.com").first()
        )

        if existing_user:
            return {
                "message": "Test user already exists",
                "user": {
                    "id": existing_user.id,
                    "email": existing_user.email,
                    "full_name": existing_user.full_name,
                },
            }

        # Create simple test user
        user = User(
            email="test@shadowgoose.com",
            hashed_password=get_password_hash("test123"),
            full_name="Test User",
            job_title="Test Role",
            organisation="Shadow Goose Entertainment",
            is_active=True,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return {
            "message": "Test user created successfully",
            "user": {"id": user.id, "email": user.email, "full_name": user.full_name},
        }

    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error creating test user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )
    except Exception as e:
        logger.error(f"Error creating test user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {str(e)}"
        )


# Minimal endpoint to create one SGE user
@router.post("/create-ursula")
async def create_ursula(db: Session = Depends(get_db)):
    """Create just Ursula to test user creation."""
    try:
        # Check if user already exists
        existing_user = (
            db.query(User).filter(User.email == "ursula@shadowgoose.com").first()
        )

        if existing_user:
            return {
                "message": "Ursula already exists",
                "user": {
                    "id": existing_user.id,
                    "email": existing_user.email,
                    "full_name": existing_user.full_name,
                    "job_title": existing_user.job_title,
                },
            }

        # Create Ursula
        user = User(
            email="ursula@shadowgoose.com",
            hashed_password=get_password_hash("SGE2024!"),
            full_name="Ursula Searle",
            job_title="Managing Director",
            organisation="Shadow Goose Entertainment",
            bio="Strategic leader focused on sustainable media impact and organisational growth",
            skills=[
                "Strategic Planning",
                "Leadership",
                "Project Management",
                "Business Development",
            ],
            current_status="available",
            is_intern=False,
            is_active=True,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return {
            "message": "Ursula created successfully",
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "job_title": user.job_title,
            },
        }

    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error creating Ursula: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )
    except Exception as e:
        logger.error(f"Error creating Ursula: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {str(e)}"
        )


# Health check endpoint that creates missing user profile columns
@router.get("/user-profile-health")
async def user_profile_health_check(db: Session = Depends(get_db)):
    """Check if user profile columns exist and create them if missing."""
    try:
        # Check if bio column exists
        result = db.execute(
            text(
                """
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'users'
            AND column_name = 'bio'
        """
            )
        )

        if result.fetchone():
            return {
                "status": "healthy",
                "message": "User profile columns exist",
                "columns": [
                    "bio",
                    "avatar_url",
                    "job_title",
                    "organisation",
                    "phone",
                    "location",
                    "timezone",
                    "current_status",
                    "skills",
                    "interests",
                    "social_links",
                    "is_intern",
                    "mentor_id",
                    "preferences",
                ],
            }
        else:
            # Create missing columns (simplified - no foreign key constraint for now)
            db.execute(
                text(
                    """
                ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
                ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
                ALTER TABLE users ADD COLUMN IF NOT EXISTS job_title VARCHAR(200);
                ALTER TABLE users ADD COLUMN IF NOT EXISTS organisation VARCHAR(200);
                ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
                ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(200);
                ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone VARCHAR(50);
                ALTER TABLE users ADD COLUMN IF NOT EXISTS current_status VARCHAR(50) DEFAULT 'available';
                ALTER TABLE users ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';
                ALTER TABLE users ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}';
                ALTER TABLE users ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}';
                ALTER TABLE users ADD COLUMN IF NOT EXISTS is_intern BOOLEAN DEFAULT FALSE;
                ALTER TABLE users ADD COLUMN IF NOT EXISTS mentor_id INTEGER;
                ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';
            """
                )
            )

            db.commit()

            return {
                "status": "created",
                "message": "User profile columns created successfully (without foreign key constraint)",
                "columns": [
                    "bio",
                    "avatar_url",
                    "job_title",
                    "organisation",
                    "phone",
                    "location",
                    "timezone",
                    "current_status",
                    "skills",
                    "interests",
                    "social_links",
                    "is_intern",
                    "mentor_id",
                    "preferences",
                ],
            }

    except Exception as e:
        db.rollback()
        return {
            "status": "error",
            "message": f"Failed to create user profile columns: {str(e)}",
            "columns": [],
        }


@router.get("/profile", response_model=UserProfile)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get current user's full profile."""
    try:
        return current_user
    except Exception as e:
        logger.error(f"Error fetching user profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching user profile",
        )


@router.put("/profile", response_model=UserProfile)
async def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update current user's profile."""
    try:
        # Update only provided fields
        update_data = user_update.dict(exclude_unset=True)

        for field, value in update_data.items():
            if hasattr(current_user, field):
                setattr(current_user, field, value)

        db.commit()
        db.refresh(current_user)

        return current_user
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error updating user profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error updating profile",
        )
    except Exception as e:
        logger.error(f"Error updating user profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating profile",
        )


@router.put("/status", response_model=UserPublic)
async def update_user_status(
    status_update: UserStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update current user's status."""
    try:
        current_user.current_status = status_update.current_status
        db.commit()
        db.refresh(current_user)

        return current_user
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error updating user status: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error updating status",
        )


@router.get("/team", response_model=List[UserPublic])
async def get_team_members(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Get all team members (public information only)."""
    try:
        users = db.query(User).filter(User.is_active == True).all()
        return users
    except SQLAlchemyError as e:
        logger.error(f"Database error fetching team members: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error fetching team",
        )


@router.get("/sge-team", response_model=List[SGETeamMember])
async def get_sge_team(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Get SGE team members specifically."""
    try:
        # Get users from Shadow Goose Entertainment
        sge_users = (
            db.query(User)
            .filter(
                User.organisation == "Shadow Goose Entertainment",
                User.is_active == True,
            )
            .all()
        )

        # Convert to SGETeamMember format with additional fields
        team_members = []
        for user in sge_users:
            member_data = SGETeamMember.from_orm(user)
            # Add projects_assigned (placeholder for now)
            member_data.projects_assigned = []
            team_members.append(member_data)

        return team_members
    except SQLAlchemyError as e:
        logger.error(f"Database error fetching SGE team: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error fetching SGE team",
        )


@router.get("/interns", response_model=List[InternProfile])
async def get_interns(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Get all interns with their progress information."""
    try:
        interns = (
            db.query(User).filter(User.is_intern == True, User.is_active == True).all()
        )

        intern_profiles = []
        for intern in interns:
            profile_data = InternProfile.from_orm(intern)

            # Get mentor name if mentor_id exists
            if intern.mentor_id:
                mentor = db.query(User).filter(User.id == intern.mentor_id).first()
                if mentor:
                    profile_data.mentor_name = mentor.full_name

            # Add placeholder learning data (will be enhanced later)
            profile_data.learning_goals = [
                "Learn media production",
                "Understand impact measurement",
            ]
            profile_data.skills_learning = intern.skills or []
            profile_data.projects_involved = []

            intern_profiles.append(profile_data)

        return intern_profiles
    except SQLAlchemyError as e:
        logger.error(f"Database error fetching interns: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error fetching interns",
        )


@router.get("/{user_id}/public", response_model=UserPublic)
async def get_public_user_profile(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get public profile of a specific user."""
    try:
        user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
        return user
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        logger.error(f"Database error fetching user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error fetching user",
        )


@router.put("/{user_id}/mentor", response_model=UserPublic)
async def update_user_mentor(
    user_id: int,
    mentor_update: UserMentorUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a user's mentor (admin only for now)."""
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

        # Validate mentor exists if provided
        if mentor_update.mentor_id:
            mentor = db.query(User).filter(User.id == mentor_update.mentor_id).first()
            if not mentor:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="Mentor not found"
                )

        user.mentor_id = mentor_update.mentor_id
        db.commit()
        db.refresh(user)

        return user
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error updating mentor: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error updating mentor",
        )
