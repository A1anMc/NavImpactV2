#!/usr/bin/env python3
"""
Simple script to add basic test data to the database.
"""

import sys
import os
from datetime import datetime, timedelta
import random

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.db.session import get_session_local
from sqlalchemy import text


def add_basic_data():
    """Add basic test data to the database."""
    
    SessionLocal = get_session_local()
    db = SessionLocal()
    
    try:
        # Check if we have any data
        result = db.execute(text("SELECT COUNT(*) FROM grants"))
        grant_count = result.scalar()
        print(f"Found {grant_count} grants in database")
        
        # Add a simple user if none exists
        user_result = db.execute(text("SELECT COUNT(*) FROM users"))
        user_count = user_result.scalar()
        
        if user_count == 0:
            print("Creating a test user...")
            db.execute(text("""
                INSERT INTO users (email, hashed_password, is_active, full_name, created_at, updated_at)
                VALUES ('test@example.com', 'hashed_password_here', true, 'Test User', NOW(), NOW())
            """))
            db.commit()
            print("✅ Created test user")
        
        # Get user ID
        user_result = db.execute(text("SELECT id FROM users LIMIT 1"))
        user_row = user_result.fetchone()
        if user_row:
            user_id = user_row[0]
            print(f"Using user ID: {user_id}")
            
            # Add some simple projects
            projects = [
                ("Digital Innovation Project", "Developing innovative digital solutions", "active"),
                ("Community Health Initiative", "Supporting community health programs", "active"),
                ("Environmental Research", "Research on environmental sustainability", "planning"),
            ]
            
            for name, description, status in projects:
                db.execute(text("""
                    INSERT INTO projects (name, description, status, owner_id, created_at, updated_at)
                    VALUES (:name, :description, :status, :user_id, NOW(), NOW())
                """), {"name": name, "description": description, "status": status, "user_id": user_id})
            
            db.commit()
            print("✅ Added sample projects")
            
            # Get a project ID to associate tasks with
            project_result = db.execute(text("SELECT id FROM projects LIMIT 1"))
            project_row = project_result.fetchone()
            if project_row:
                project_id = project_row[0]
                
                # Add some simple tasks
                tasks = [
                    ("Project Planning", "Develop project plan", "COMPLETED", "HIGH"),
                    ("Team Setup", "Assemble project team", "IN_PROGRESS", "HIGH"),
                    ("Research Phase", "Conduct initial research", "PENDING", "MEDIUM"),
                    ("Stakeholder Meeting", "Meet with stakeholders", "PENDING", "MEDIUM"),
                ]
                
                for title, description, status, priority in tasks:
                    # Add actual_hours for all tasks
                    actual_hours = 8.0 if status == "COMPLETED" else 4.0
                    db.execute(text("""
                        INSERT INTO tasks (title, description, status, priority, actual_hours, project_id, assignee_id, creator_id, created_at, updated_at)
                        VALUES (:title, :description, :status, :priority, :actual_hours, :project_id, :user_id, :user_id, NOW(), NOW())
                    """), {"title": title, "description": description, "status": status, "priority": priority, "actual_hours": actual_hours, "project_id": project_id, "user_id": user_id})
            
            db.commit()
            print("✅ Added sample tasks")
            
            # Get a task ID to associate time entries with
            task_result = db.execute(text("SELECT id FROM tasks LIMIT 1"))
            task_row = task_result.fetchone()
            if task_row:
                task_id = task_row[0]
                
                # Add some time entries
                for i in range(5):
                    duration_minutes = random.randint(120, 480)  # 2-8 hours in minutes
                    started_at = datetime.now() - timedelta(days=random.randint(1, 7), hours=random.randint(0, 8))
                    ended_at = started_at + timedelta(minutes=duration_minutes)
                    
                    db.execute(text("""
                        INSERT INTO time_entries (user_id, task_id, duration_minutes, started_at, ended_at, description, created_at)
                        VALUES (:user_id, :task_id, :duration_minutes, :started_at, :ended_at, :description, NOW())
                    """), {
                        "user_id": user_id,
                        "task_id": task_id,
                        "duration_minutes": duration_minutes,
                        "started_at": started_at,
                        "ended_at": ended_at,
                        "description": f"General project work - Day {i+1}"
                    })
            
            db.commit()
            print("✅ Added sample time entries")
            
        else:
            print("No user found to associate data with")
        
        print("\n🎉 Basic data added successfully!")
        print("The dashboard should now show more realistic data.")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error adding basic data: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("🌱 Adding Basic Test Data...")
    add_basic_data()
    print("✅ Done!") 