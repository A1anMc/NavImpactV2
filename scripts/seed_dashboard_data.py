#!/usr/bin/env python3
"""
Seed script to add sample dashboard data for the NavImpact Dashboard.
This will populate the database with realistic test data for demonstrations.
"""

import sys
import os
from datetime import datetime, timedelta
import random

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.db.session import get_session_local
from sqlalchemy import text


def create_sample_dashboard_data():
    """Create sample dashboard data."""
    
    SessionLocal = get_session_local()
    db = SessionLocal()
    
    try:
        # Check if we have users
        result = db.execute(text("SELECT COUNT(*) FROM users"))
        user_count = result.scalar()
        
        if user_count == 0:
            print("No users found. Please run the main seed script first.")
            return
        
        print(f"Found {user_count} users. Creating dashboard data...")
        
        # Get user ID
        users_result = db.execute(text("SELECT id FROM users LIMIT 1"))
        user_row = users_result.fetchone()
        user_id = user_row[0]
        
        # Create sample projects
        projects = [
            {
                "name": "Digital Media Innovation Project",
                "description": "Developing innovative digital media solutions for community engagement",
                "status": "active",
                "start_date": datetime.now() - timedelta(days=30),
                "end_date": datetime.now() + timedelta(days=90),
                "budget": 150000
            },
            {
                "name": "Youth Mental Health Initiative",
                "description": "Community-based mental health support program for young people",
                "status": "active",
                "start_date": datetime.now() - timedelta(days=15),
                "end_date": datetime.now() + timedelta(days=120),
                "budget": 300000
            },
            {
                "name": "Renewable Energy Research",
                "description": "Research and development of sustainable energy solutions",
                "status": "planning",
                "start_date": datetime.now() + timedelta(days=30),
                "end_date": datetime.now() + timedelta(days=180),
                "budget": 500000
            },
            {
                "name": "Indigenous Cultural Preservation",
                "description": "Preserving and promoting Indigenous cultural heritage through digital platforms",
                "status": "active",
                "start_date": datetime.now() - timedelta(days=45),
                "end_date": datetime.now() + timedelta(days=60),
                "budget": 200000
            },
            {
                "name": "Sustainable Agriculture Program",
                "description": "Supporting farmers to adopt sustainable practices and reduce environmental impact",
                "status": "completed",
                "start_date": datetime.now() - timedelta(days=120),
                "end_date": datetime.now() - timedelta(days=30),
                "budget": 400000
            }
        ]
        
        created_projects = []
        for project_data in projects:
            project_data["created_by_id"] = user_id
            project_data["created_at"] = datetime.now()
            project_data["updated_at"] = datetime.now()
            
            result = db.execute(text("""
                INSERT INTO projects 
                (name, description, status, start_date, end_date, budget, created_by_id, created_at, updated_at)
                VALUES (:name, :description, :status, :start_date, :end_date, :budget, :created_by_id, :created_at, :updated_at)
                RETURNING id
            """), project_data)
            
            project_id = result.scalar()
            created_projects.append(project_id)
            
            # Create tasks for each project
            if project_data["status"] == "active":
                tasks = [
                    {
                        "title": "Project Planning",
                        "description": "Develop detailed project plan and timeline",
                        "status": "completed",
                        "priority": "high",
                        "due_date": datetime.now() - timedelta(days=5)
                    },
                    {
                        "title": "Team Recruitment",
                        "description": "Hire and onboard project team members",
                        "status": "in_progress",
                        "priority": "high",
                        "due_date": datetime.now() + timedelta(days=10)
                    },
                    {
                        "title": "Stakeholder Engagement",
                        "description": "Engage with key stakeholders and partners",
                        "status": "pending",
                        "priority": "medium",
                        "due_date": datetime.now() + timedelta(days=20)
                    },
                    {
                        "title": "Resource Allocation",
                        "description": "Allocate budget and resources for project execution",
                        "status": "in_progress",
                        "priority": "high",
                        "due_date": datetime.now() + timedelta(days=7)
                    }
                ]
            elif project_data["status"] == "planning":
                tasks = [
                    {
                        "title": "Feasibility Study",
                        "description": "Conduct comprehensive feasibility analysis",
                        "status": "in_progress",
                        "priority": "high",
                        "due_date": datetime.now() + timedelta(days=15)
                    },
                    {
                        "title": "Market Research",
                        "description": "Research market conditions and competition",
                        "status": "pending",
                        "priority": "medium",
                        "due_date": datetime.now() + timedelta(days=25)
                    },
                    {
                        "title": "Budget Planning",
                        "description": "Develop detailed budget and financial projections",
                        "status": "pending",
                        "priority": "high",
                        "due_date": datetime.now() + timedelta(days=20)
                    }
                ]
            else:  # completed
                tasks = [
                    {
                        "title": "Final Report",
                        "description": "Complete final project report and documentation",
                        "status": "completed",
                        "priority": "high",
                        "due_date": datetime.now() - timedelta(days=5)
                    },
                    {
                        "title": "Project Evaluation",
                        "description": "Evaluate project outcomes and lessons learned",
                        "status": "completed",
                        "priority": "medium",
                        "due_date": datetime.now() - timedelta(days=10)
                    },
                    {
                        "title": "Stakeholder Feedback",
                        "description": "Collect and analyze stakeholder feedback",
                        "status": "completed",
                        "priority": "medium",
                        "due_date": datetime.now() - timedelta(days=15)
                    }
                ]
            
            for task_data in tasks:
                task_data["project_id"] = project_id
                task_data["assigned_to_id"] = user_id
                task_data["created_by_id"] = user_id
                task_data["created_at"] = datetime.now()
                task_data["updated_at"] = datetime.now()
                
                result = db.execute(text("""
                    INSERT INTO tasks 
                    (title, description, status, priority, due_date, project_id, assigned_to_id, created_by_id, created_at, updated_at)
                    VALUES (:title, :description, :status, :priority, :due_date, :project_id, :assigned_to_id, :created_by_id, :created_at, :updated_at)
                    RETURNING id
                """), task_data)
                
                task_id = result.scalar()
                
                # Add time entries for completed tasks
                if task_data["status"] == "completed":
                    # Add multiple time entries for completed tasks
                    for i in range(random.randint(2, 5)):
                        time_entry_data = {
                            "task_id": task_id,
                            "user_id": user_id,
                            "hours": round(random.uniform(2, 8), 2),
                            "date": task_data["due_date"] - timedelta(days=random.randint(1, 10)),
                            "description": f"Work on {task_data['title']} - Day {i+1}",
                            "created_at": datetime.now()
                        }
                        
                        db.execute(text("""
                            INSERT INTO time_entries 
                            (task_id, user_id, hours, date, description, created_at)
                            VALUES (:task_id, :user_id, :hours, :date, :description, :created_at)
                        """), time_entry_data)
                
                # Add some time entries for in_progress tasks
                elif task_data["status"] == "in_progress":
                    for i in range(random.randint(1, 3)):
                        time_entry_data = {
                            "task_id": task_id,
                            "user_id": user_id,
                            "hours": round(random.uniform(1, 6), 2),
                            "date": datetime.now() - timedelta(days=random.randint(1, 7)),
                            "description": f"Progress on {task_data['title']} - Day {i+1}",
                            "created_at": datetime.now()
                        }
                        
                        db.execute(text("""
                            INSERT INTO time_entries 
                            (task_id, user_id, hours, date, description, created_at)
                            VALUES (:task_id, :user_id, :hours, :date, :description, :created_at)
                        """), time_entry_data)
        
        # Create some additional time entries for today and recent days
        for i in range(10):
            # Get a random task
            task_result = db.execute(text("SELECT id FROM tasks ORDER BY RANDOM() LIMIT 1"))
            task_row = task_result.fetchone()
            if task_row:
                task_id = task_row[0]
                
                time_entry_data = {
                    "task_id": task_id,
                    "user_id": user_id,
                    "hours": round(random.uniform(1, 8), 2),
                    "date": datetime.now() - timedelta(days=random.randint(0, 14)),
                    "description": f"General project work - Day {i+1}",
                    "created_at": datetime.now()
                }
                
                db.execute(text("""
                    INSERT INTO time_entries 
                    (task_id, user_id, hours, date, description, created_at)
                    VALUES (:task_id, :user_id, :hours, :date, :description, :created_at)
                """), time_entry_data)
        
        # Create some metrics data
        metrics = [
            {
                "name": "Total Projects",
                "value": len(projects),
                "category": "projects",
                "period": "current"
            },
            {
                "name": "Active Projects",
                "value": len([p for p in projects if p["status"] == "active"]),
                "category": "projects",
                "period": "current"
            },
            {
                "name": "Total Tasks",
                "value": sum(len(tasks) for tasks in [p for p in projects if p["status"] == "active"]),
                "category": "tasks",
                "period": "current"
            },
            {
                "name": "Completed Tasks",
                "value": sum(len([t for t in tasks if t["status"] == "completed"]) for tasks in [p for p in projects if p["status"] == "active"]),
                "category": "tasks",
                "period": "current"
            }
        ]
        
        for metric_data in metrics:
            metric_data["created_at"] = datetime.now()
            metric_data["updated_at"] = datetime.now()
            
            db.execute(text("""
                INSERT INTO metrics 
                (name, value, category, period, created_at, updated_at)
                VALUES (:name, :value, :category, :period, :created_at, :updated_at)
            """), metric_data)
        
        db.commit()
        print("✅ Successfully created sample dashboard data!")
        print(f"   - {len(projects)} projects created")
        print(f"   - Multiple tasks per project")
        print(f"   - Time entries for completed and in-progress tasks")
        print(f"   - {len(metrics)} metrics created")
        print("\n🎯 Dashboard should now show:")
        print("   - Active projects with realistic data")
        print("   - Tasks with different statuses and priorities")
        print("   - Time tracking data")
        print("   - Project metrics and statistics")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating dashboard data: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("🌱 Seeding Dashboard Data for NavImpact...")
    create_sample_dashboard_data()
    print("🎉 Dashboard data seeding completed!") 