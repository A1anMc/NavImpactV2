#!/usr/bin/env python3
"""
Script to create SGE team members in the database.
"""

import sys
import os
from datetime import datetime

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from sqlalchemy.orm import Session
from app.db.session import get_session_local
from app.db.base import Base  # Import base to ensure all models are registered
from app.models.user import User
from app.core.security import get_password_hash

def create_sge_team_members():
    """Create the 7 SGE team members."""
    
    # SGE Team Members Data
    sge_team = [
        {
            "email": "ursula@shadowgoose.com",
            "full_name": "Ursula Searle",
            "job_title": "Managing Director",
            "organisation": "Shadow Goose Entertainment",
            "bio": "Strategic leader focused on sustainable media impact and organisational growth",
            "skills": ["Strategic Planning", "Leadership", "Project Management", "Business Development"],
            "current_status": "available",
            "is_intern": False,
            "password": "SGE2024!"  # Temporary password
        },
        {
            "email": "ash@shadowgoose.com",
            "full_name": "Ash Dorman",
            "job_title": "Managing Director",
            "organisation": "Shadow Goose Entertainment",
            "bio": "Business development and strategic partnerships specialist",
            "skills": ["Strategic Planning", "Leadership", "Business Development", "Partnerships"],
            "current_status": "available",
            "is_intern": False,
            "password": "SGE2024!"
        },
        {
            "email": "shamita@shadowgoose.com",
            "full_name": "Shamita Siva",
            "job_title": "Creative Director",
            "organisation": "Shadow Goose Entertainment",
            "bio": "Creative visionary driving storytelling and media production excellence",
            "skills": ["Creative Direction", "Storytelling", "Media Production", "Content Strategy"],
            "current_status": "available",
            "is_intern": False,
            "password": "SGE2024!"
        },
        {
            "email": "alan@navimpact.org",
            "full_name": "Alan McCarthy",
            "job_title": "Impact Director",
            "organisation": "Shadow Goose Entertainment",
            "bio": "Impact measurement and stakeholder engagement specialist",
            "skills": ["Impact Measurement", "Data Analysis", "Stakeholder Engagement", "Sustainability"],
            "current_status": "available",
            "is_intern": False,
            "password": "SGE2024!"
        },
        {
            "email": "mish@shadowgoose.com",
            "full_name": "Mish Rep",
            "job_title": "Operations Officer",
            "organisation": "Shadow Goose Entertainment",
            "bio": "Operations management and process optimization expert",
            "skills": ["Operations Management", "Coordination", "Process Improvement", "Project Coordination"],
            "current_status": "available",
            "is_intern": False,
            "password": "SGE2024!"
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
            "password": "SGE2024!"
        }
    ]
    
    # Get database session
    SessionLocal = get_session_local()
    db = SessionLocal()
    
    try:
        print("🚀 Creating SGE Team Members...")
        print("=" * 50)
        
        created_users = []
        
        for member_data in sge_team:
            # Check if user already exists
            existing_user = db.query(User).filter(User.email == member_data["email"]).first()
            
            if existing_user:
                print(f"⚠️  User {member_data['email']} already exists, skipping...")
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
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            
            db.add(user)
            created_users.append(user)
            print(f"✅ Created: {member_data['full_name']} ({member_data['job_title']})")
        
        # Set up mentorship relationship (Shamita mentors Kiara)
        shamita = next((u for u in created_users if u.email == "shamita@shadowgoose.com"), None)
        kiara = next((u for u in created_users if u.email == "kiara@shadowgoose.com"), None)
        
        if shamita and kiara:
            kiara.mentor_id = shamita.id
            print(f"✅ Set up mentorship: {shamita.full_name} → {kiara.full_name}")
        
        # Commit all changes
        db.commit()
        
        print("\n" + "=" * 50)
        print("🎉 SGE Team Creation Complete!")
        print(f"✅ Created {len(created_users)} team members")
        print("\n📋 Team Members:")
        for user in created_users:
            intern_badge = " (Intern)" if user.is_intern else ""
            print(f"   • {user.full_name} - {user.job_title}{intern_badge}")
        
        print("\n🔐 Login Credentials:")
        print("   Email: [member-email]")
        print("   Password: SGE2024!")
        print("\n⚠️  Note: Users should change their passwords after first login")
        
        return created_users
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating SGE team: {str(e)}")
        raise
    finally:
        db.close()

def main():
    """Main function."""
    try:
        create_sge_team_members()
        return 0
    except Exception as e:
        print(f"❌ Failed to create SGE team: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 