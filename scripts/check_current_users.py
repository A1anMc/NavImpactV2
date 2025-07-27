#!/usr/bin/env python3
"""
Script to check current users in the database.
"""

import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from sqlalchemy.orm import Session
from app.db.session import get_session_local
from app.db.base import Base
from app.models.user import User

def check_current_users():
    """Check what users currently exist in the database."""
    
    # Get database session
    SessionLocal = get_session_local()
    db = SessionLocal()
    
    try:
        print("🔍 Checking Current Users in Database...")
        print("=" * 50)
        
        # Get all users
        users = db.query(User).all()
        
        if not users:
            print("❌ No users found in database")
            return []
        
        print(f"✅ Found {len(users)} users in database:")
        print()
        
        for user in users:
            print(f"👤 User ID: {user.id}")
            print(f"   Email: {user.email}")
            print(f"   Name: {user.full_name or 'Not set'}")
            print(f"   Job Title: {user.job_title or 'Not set'}")
            print(f"   Organisation: {user.organisation or 'Not set'}")
            print(f"   Is Intern: {user.is_intern or False}")
            print(f"   Current Status: {user.current_status or 'Not set'}")
            print(f"   Skills: {user.skills or []}")
            print(f"   Mentor ID: {user.mentor_id or 'None'}")
            print(f"   Active: {user.is_active}")
            print(f"   Created: {user.created_at}")
            print("-" * 30)
        
        # Check for SGE team members specifically
        sge_users = [u for u in users if u.organisation == "Shadow Goose Entertainment"]
        if sge_users:
            print(f"\n🎬 SGE Team Members: {len(sge_users)}")
            for user in sge_users:
                print(f"   • {user.full_name} ({user.job_title})")
        else:
            print("\n🎬 No SGE team members found")
        
        # Check for interns
        interns = [u for u in users if u.is_intern]
        if interns:
            print(f"\n🎓 Interns: {len(interns)}")
            for user in interns:
                print(f"   • {user.full_name} (Mentor: {user.mentor_id or 'None'})")
        else:
            print("\n🎓 No interns found")
        
        return users
        
    except Exception as e:
        print(f"❌ Error checking users: {str(e)}")
        raise
    finally:
        db.close()

def main():
    """Main function."""
    try:
        check_current_users()
        return 0
    except Exception as e:
        print(f"❌ Failed to check users: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 