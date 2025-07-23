#!/usr/bin/env python3
"""
Seed script to add sample intelligence data for the Impact & Analysis Dashboard.
This will populate the database with realistic test data for demonstrations.
"""

import sys
import os
import asyncio
from datetime import datetime, timedelta
import random
import json

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.db.session import get_session_local
from sqlalchemy import text


def create_sample_intelligence_data():
    """Create sample intelligence data for the dashboard."""
    
    SessionLocal = get_session_local()
    db = SessionLocal()
    
    try:
        # Check if we have grants
        result = db.execute(text("SELECT COUNT(*) FROM grants"))
        grant_count = result.scalar()
        
        if grant_count == 0:
            print("No grants found. Please run the main seed script first.")
            return
        
        print(f"Found {grant_count} grants. Creating intelligence data...")
        
        # Get grant IDs
        grants_result = db.execute(text("SELECT id FROM grants"))
        grant_ids = [row[0] for row in grants_result.fetchall()]
        
        # Create sample success metrics for each grant
        for grant_id in grant_ids:
            success_metrics_data = {
                "grant_id": grant_id,
                "success_probability": round(random.uniform(0.3, 0.95), 3),
                "confidence_score": round(random.uniform(0.7, 0.98), 3),
                "prediction_features": json.dumps({
                    "organization_size": random.choice(["small", "medium", "large"]),
                    "previous_grants": random.randint(0, 10),
                    "sector_match": round(random.uniform(0.5, 1.0), 2),
                    "location_match": round(random.uniform(0.6, 1.0), 2),
                    "funding_amount_match": round(random.uniform(0.4, 1.0), 2)
                }),
                "model_version": "v1.0",
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            }
            
            db.execute(text("""
                INSERT INTO grant_success_metrics 
                (grant_id, success_probability, confidence_score, prediction_features, model_version, created_at, updated_at)
                VALUES (:grant_id, :success_probability, :confidence_score, :prediction_features, :model_version, :created_at, :updated_at)
            """), success_metrics_data)
        
        # Create funder profiles
        funders = [
            {
                "name": "Creative Australia",
                "mission": "Supporting Australia's creative sector through funding and development programs",
                "sdg_alignment": json.dumps(["8", "9", "11"]),
                "strategic_priorities": json.dumps(["Digital Innovation", "Cultural Diversity", "Regional Development"]),
                "success_patterns": json.dumps({
                    "avg_grant_amount": 125000,
                    "success_rate": 0.68,
                    "preferred_sectors": ["technology", "arts", "media"]
                }),
                "average_grant_amount": 125000,
                "success_rate": 0.68
            },
            {
                "name": "Department of Health",
                "mission": "Improving health outcomes for all Australians",
                "sdg_alignment": json.dumps(["3", "10", "11"]),
                "strategic_priorities": json.dumps(["Mental Health", "Preventive Care", "Health Equity"]),
                "success_patterns": json.dumps({
                    "avg_grant_amount": 275000,
                    "success_rate": 0.72,
                    "preferred_sectors": ["healthcare", "education", "social_services"]
                }),
                "average_grant_amount": 275000,
                "success_rate": 0.72
            },
            {
                "name": "Australian Renewable Energy Agency",
                "mission": "Accelerating Australia's transition to renewable energy",
                "sdg_alignment": json.dumps(["7", "13", "9"]),
                "strategic_priorities": json.dumps(["Clean Energy", "Innovation", "Climate Action"]),
                "success_patterns": json.dumps({
                    "avg_grant_amount": 1050000,
                    "success_rate": 0.65,
                    "preferred_sectors": ["technology", "manufacturing", "research"]
                }),
                "average_grant_amount": 1050000,
                "success_rate": 0.65
            }
        ]
        
        for funder_data in funders:
            funder_data["created_at"] = datetime.now()
            funder_data["updated_at"] = datetime.now()
            
            db.execute(text("""
                INSERT INTO funder_profiles 
                (funder_name, mission_statement, sdg_alignment, strategic_priorities, success_patterns, 
                 average_grant_amount, success_rate, created_at, updated_at)
                VALUES (:name, :mission, :sdg_alignment, :strategic_priorities, :success_patterns, 
                        :average_grant_amount, :success_rate, :created_at, :updated_at)
            """), funder_data)
        
        # Create sector analytics
        sectors = [
            {
                "name": "technology",
                "total_grants": 15,
                "total_funding": 2500000,
                "average_success_rate": 0.71,
                "seasonality_pattern": json.dumps({
                    "Q1": 0.25, "Q2": 0.30, "Q3": 0.25, "Q4": 0.20
                }),
                "trend_data": json.dumps({
                    "2023": {"grants": 12, "funding": 1800000},
                    "2024": {"grants": 15, "funding": 2500000}
                })
            },
            {
                "name": "healthcare",
                "total_grants": 22,
                "total_funding": 4800000,
                "average_success_rate": 0.68,
                "seasonality_pattern": json.dumps({
                    "Q1": 0.20, "Q2": 0.25, "Q3": 0.30, "Q4": 0.25
                }),
                "trend_data": json.dumps({
                    "2023": {"grants": 18, "funding": 3800000},
                    "2024": {"grants": 22, "funding": 4800000}
                })
            },
            {
                "name": "environment",
                "total_grants": 8,
                "total_funding": 1200000,
                "average_success_rate": 0.75,
                "seasonality_pattern": json.dumps({
                    "Q1": 0.30, "Q2": 0.25, "Q3": 0.25, "Q4": 0.20
                }),
                "trend_data": json.dumps({
                    "2023": {"grants": 6, "funding": 900000},
                    "2024": {"grants": 8, "funding": 1200000}
                })
            }
        ]
        
        for sector_data in sectors:
            sector_data["created_at"] = datetime.now()
            sector_data["updated_at"] = datetime.now()
            
            db.execute(text("""
                INSERT INTO sector_analytics 
                (sector_name, total_grants, total_funding, average_success_rate, seasonality_pattern, 
                 trend_data, created_at, updated_at)
                VALUES (:name, :total_grants, :total_funding, :average_success_rate, :seasonality_pattern, 
                        :trend_data, :created_at, :updated_at)
            """), sector_data)
        
        # Create predictive models
        models = [
            {
                "name": "Grant Success Predictor",
                "version": "v1.0",
                "type": "success_prediction",
                "accuracy_score": 0.78,
                "feature_importance": json.dumps({
                    "organization_size": 0.15,
                    "previous_grants": 0.20,
                    "sector_match": 0.25,
                    "location_match": 0.18,
                    "funding_amount_match": 0.22
                }),
                "training_data_size": 1500,
                "last_trained": datetime.now() - timedelta(days=7),
                "is_active": True
            },
            {
                "name": "Grant Recommendation Engine",
                "version": "v1.0",
                "type": "recommendation",
                "accuracy_score": 0.82,
                "feature_importance": json.dumps({
                    "user_preferences": 0.30,
                    "historical_success": 0.25,
                    "sector_alignment": 0.20,
                    "timing": 0.15,
                    "competition_level": 0.10
                }),
                "training_data_size": 2000,
                "last_trained": datetime.now() - timedelta(days=3),
                "is_active": True
            }
        ]
        
        for model_data in models:
            model_data["created_at"] = datetime.now()
            
            db.execute(text("""
                INSERT INTO predictive_models 
                (model_name, model_version, model_type, accuracy_score, feature_importance, 
                 training_data_size, last_trained, is_active, created_at)
                VALUES (:name, :version, :type, :accuracy_score, :feature_importance, 
                        :training_data_size, :last_trained, :is_active, :created_at)
            """), model_data)
        
        # Create sample projects and tasks
        users_result = db.execute(text("SELECT id FROM users LIMIT 1"))
        user_row = users_result.fetchone()
        
        if user_row:
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
                }
            ]
            
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
                
                # Create tasks for each project
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
                        time_entry_data = {
                            "task_id": task_id,
                            "user_id": user_id,
                            "hours": round(random.uniform(2, 8), 2),
                            "date": task_data["due_date"] - timedelta(days=1),
                            "description": f"Completed {task_data['title']}",
                            "created_at": datetime.now()
                        }
                        
                        db.execute(text("""
                            INSERT INTO time_entries 
                            (task_id, user_id, hours, date, description, created_at)
                            VALUES (:task_id, :user_id, :hours, :date, :description, :created_at)
                        """), time_entry_data)
        
        db.commit()
        print("✅ Successfully created sample intelligence data!")
        print(f"   - {len(grant_ids)} grant success metrics")
        print(f"   - {len(funders)} funder profiles")
        print(f"   - {len(sectors)} sector analytics")
        print(f"   - {len(models)} predictive models")
        print(f"   - {len(projects)} sample projects with tasks and time entries")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating intelligence data: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("🌱 Seeding Intelligence Data for NavImpact Dashboard...")
    create_sample_intelligence_data()
    print("🎉 Intelligence data seeding completed!") 