#!/usr/bin/env python3
"""
Simple script to create a user directly in the database
This bypasses the API authentication issues
"""

import os
import sys
from datetime import datetime

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.db.session import get_session_local
from app.models.user import User

def create_user_direct():
    """Create a user directly in the database"""
    SessionLocal = get_session_local()
    db = SessionLocal()
    
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == "test@example.com").first()
        if existing_user:
            print(f"✅ User already exists: {existing_user.email}")
            return existing_user
        
        # Create new user
        new_user = User(
            email="test@example.com",
            full_name="Test User",
            hashed_password="",  # No password for development
            is_active=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        print(f"✅ User created successfully: {new_user.email}")
        print(f"   ID: {new_user.id}")
        print(f"   Name: {new_user.full_name}")
        print(f"   Active: {new_user.is_active}")
        
        return new_user
        
    except Exception as e:
        print(f"❌ Error creating user: {e}")
        db.rollback()
        return None
    finally:
        db.close()

def list_users():
    """List all users in the database"""
    SessionLocal = get_session_local()
    db = SessionLocal()
    
    try:
        users = db.query(User).all()
        print(f"\n📋 Found {len(users)} users:")
        for user in users:
            print(f"   - {user.email} (ID: {user.id}, Active: {user.is_active})")
        return users
    except Exception as e:
        print(f"❌ Error listing users: {e}")
        return []
    finally:
        db.close()

if __name__ == "__main__":
    print("🔧 Creating user directly in database...")
    user = create_user_direct()
    
    print("\n📋 Current users:")
    list_users() 