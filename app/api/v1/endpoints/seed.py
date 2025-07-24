"""Seeding endpoints for populating database with sample data."""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime, timedelta
from app.db.session import get_db
from app.core.security import get_password_hash
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/news")
async def seed_news(clear_existing: bool = False, db: Session = Depends(get_db)):
    """Seed industry news data"""
    try:
        # Check if news already exists
        result = db.execute(text("SELECT COUNT(*) FROM industry_news"))
        existing_count = result.scalar()
        
        if existing_count > 0 and not clear_existing:
            return {
                "status": "error",
                "message": f"Database already contains {existing_count} news items. Use clear_existing=true to override.",
                "existing_count": existing_count
            }
        
        if clear_existing:
            db.execute(text("DELETE FROM industry_news"))
            logger.info("Cleared existing news data")
        
        # Sample news data
        news_items = [
            {
                "title": "Major Healthcare Grant Program Launches",
                "content": "The government announces a $50M healthcare innovation grant program targeting rural communities.",
                "source": "Healthcare Innovation Weekly",
                "url": "https://example.com/healthcare-grant-2024",
                "sector": "healthcare",
                "relevance_score": 0.95,
                "summary": "New healthcare grants available for rural innovation projects",
                "published_at": datetime.now() - timedelta(days=1)
            },
            {
                "title": "Education Technology Funding Opportunity",
                "content": "EdTech startups can now apply for up to $100K in development grants for educational software.",
                "source": "EdTech Today",
                "url": "https://example.com/edtech-funding-2024",
                "sector": "education",
                "relevance_score": 0.88,
                "summary": "EdTech grants up to $100K for educational software development",
                "published_at": datetime.now() - timedelta(days=2)
            },
            {
                "title": "Environmental Conservation Grants Open",
                "content": "The Environmental Protection Agency opens applications for conservation grants focusing on biodiversity.",
                "source": "Green Future Magazine",
                "url": "https://example.com/environmental-grants-2024",
                "sector": "environment",
                "relevance_score": 0.92,
                "summary": "EPA conservation grants now accepting applications",
                "published_at": datetime.now() - timedelta(days=3)
            },
            {
                "title": "Tech Innovation Fund Announced",
                "content": "A new $200M fund for technology innovation has been established to support AI and machine learning research.",
                "source": "Tech Innovation Report",
                "url": "https://example.com/tech-innovation-fund-2024",
                "sector": "technology",
                "relevance_score": 0.90,
                "summary": "$200M fund for AI and machine learning research projects",
                "published_at": datetime.now() - timedelta(days=4)
            },
            {
                "title": "Community Development Grants Available",
                "content": "Local communities can apply for grants up to $75K for infrastructure and social development projects.",
                "source": "Community Development Weekly",
                "url": "https://example.com/community-grants-2024",
                "sector": "social-services",
                "relevance_score": 0.85,
                "summary": "Community grants up to $75K for infrastructure projects",
                "published_at": datetime.now() - timedelta(days=5)
            }
        ]
        
        for item in news_items:
            db.execute(text("""
                INSERT INTO industry_news 
                (title, content, source, url, sector, relevance_score, summary, published_at, created_at, updated_at)
                VALUES (:title, :content, :source, :url, :sector, :relevance_score, :summary, :published_at, NOW(), NOW())
            """), item)
        
        db.commit()
        
        return {
            "status": "success",
            "message": f"Successfully seeded {len(news_items)} news items",
            "items_created": len(news_items)
        }
        
    except Exception as e:
        logger.error(f"Failed to seed news: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to seed news: {str(e)}")

@router.post("/all")
async def seed_all_data(clear_existing: bool = False, db: Session = Depends(get_db)):
    """Seed all test data: users, projects, tasks, grants, and news"""
    try:
        logger.info("🌱 Starting comprehensive data seeding...")
        
        if clear_existing:
            logger.info("🧹 Clearing existing data...")
            # Clear in reverse dependency order
            db.execute(text("DELETE FROM task_comments"))
            db.execute(text("DELETE FROM time_entries"))
            db.execute(text("DELETE FROM team_members"))
            db.execute(text("DELETE FROM tasks"))
            db.execute(text("DELETE FROM projects"))
            db.execute(text("DELETE FROM industry_news"))
            db.execute(text("DELETE FROM grants"))
            db.execute(text("DELETE FROM users WHERE email LIKE '%@navimpact.test'"))
            db.commit()
            logger.info("✅ Cleared existing test data")
        
        # 1. Create test users
        logger.info("👤 Creating test users...")
        test_users = [
            {
                "email": "admin@navimpact.test",
                "username": "admin",
                "full_name": "Admin User",
                "hashed_password": get_password_hash("admin123"),
                "is_active": True,
                "is_superuser": True
            },
            {
                "email": "demo@navimpact.test", 
                "username": "demo",
                "full_name": "Demo User",
                "hashed_password": get_password_hash("demo123"),
                "is_active": True,
                "is_superuser": False
            },
            {
                "email": "project.manager@navimpact.test",
                "username": "pmgr",
                "full_name": "Project Manager",
                "hashed_password": get_password_hash("pm123"),
                "is_active": True,
                "is_superuser": False
            }
        ]
        
        user_ids = []
        for user_data in test_users:
            # Check if user already exists
            result = db.execute(text("SELECT id FROM users WHERE email = :email"), {"email": user_data["email"]})
            existing_user = result.fetchone()
            
            if existing_user:
                user_ids.append(existing_user[0])
                logger.info(f"✅ User {user_data['email']} already exists")
            else:
                result = db.execute(text("""
                    INSERT INTO users (email, username, full_name, hashed_password, is_active, is_superuser, created_at, updated_at)
                    VALUES (:email, :username, :full_name, :hashed_password, :is_active, :is_superuser, NOW(), NOW())
                    RETURNING id
                """), user_data)
                user_id = result.scalar()
                user_ids.append(user_id)
                logger.info(f"✅ Created user: {user_data['email']}")
        
        db.commit()
        
        # 2. Create test projects
        logger.info("📁 Creating test projects...")
        sample_projects = [
            {
                "name": "Community Health Initiative",
                "description": "A comprehensive health program targeting underserved communities with mobile clinics and health education workshops.",
                "status": "active",
                "start_date": datetime.now() - timedelta(days=30),
                "end_date": datetime.now() + timedelta(days=90),
                "budget": 75000.0,
                "budget_currency": "AUD",
                "owner_id": user_ids[0]
            },
            {
                "name": "Youth Education Program",
                "description": "After-school tutoring and mentorship program for at-risk youth in urban areas.",
                "status": "planning",
                "start_date": datetime.now() + timedelta(days=15),
                "end_date": datetime.now() + timedelta(days=120),
                "budget": 45000.0,
                "budget_currency": "AUD",
                "owner_id": user_ids[1]
            },
            {
                "name": "Environmental Conservation Project",
                "description": "Local ecosystem restoration and community awareness campaign for coastal preservation.",
                "status": "active",
                "start_date": datetime.now() - timedelta(days=15),
                "end_date": datetime.now() + timedelta(days=75),
                "budget": 60000.0,
                "budget_currency": "AUD",
                "owner_id": user_ids[2]
            },
            {
                "name": "Digital Literacy Workshop",
                "description": "Computer skills training for seniors and low-income families to bridge the digital divide.",
                "status": "completed",
                "start_date": datetime.now() - timedelta(days=120),
                "end_date": datetime.now() - timedelta(days=30),
                "budget": 30000.0,
                "budget_currency": "AUD",
                "owner_id": user_ids[0]
            },
            {
                "name": "Food Security Initiative",
                "description": "Community garden development and sustainable agriculture training for local families.",
                "status": "on-hold",
                "start_date": datetime.now() + timedelta(days=30),
                "end_date": datetime.now() + timedelta(days=150),
                "budget": 55000.0,
                "budget_currency": "AUD",
                "owner_id": user_ids[1]
            }
        ]
        
        project_ids = []
        for project_data in sample_projects:
            result = db.execute(text("""
                INSERT INTO projects 
                (name, description, status, start_date, end_date, budget, budget_currency, owner_id, created_at, updated_at)
                VALUES (:name, :description, :status, :start_date, :end_date, :budget, :budget_currency, :owner_id, NOW(), NOW())
                RETURNING id
            """), project_data)
            project_id = result.scalar()
            project_ids.append(project_id)
            logger.info(f"✅ Created project: {project_data['name']}")
        
        db.commit()
        
        # 3. Create test tasks
        logger.info("📋 Creating test tasks...")
        task_templates = [
            ("Project Planning", "Develop detailed project plan and timeline", "COMPLETED", "HIGH"),
            ("Team Recruitment", "Hire and onboard project team members", "IN_PROGRESS", "HIGH"),
            ("Stakeholder Engagement", "Engage with key stakeholders and partners", "PENDING", "MEDIUM"),
            ("Budget Review", "Review and approve project budget allocation", "COMPLETED", "HIGH"),
            ("Risk Assessment", "Identify and mitigate project risks", "IN_PROGRESS", "MEDIUM"),
            ("Progress Reporting", "Prepare monthly progress reports", "PENDING", "LOW")
        ]
        
        tasks_created = 0
        for project_id in project_ids:
            for i, (title, description, status, priority) in enumerate(task_templates[:4]):  # 4 tasks per project
                due_date = datetime.now() + timedelta(days=(i * 7))
                estimated_hours = 8.0 + (i * 4.0)
                actual_hours = estimated_hours if status == "COMPLETED" else (estimated_hours * 0.5 if status == "IN_PROGRESS" else 0.0)
                
                db.execute(text("""
                    INSERT INTO tasks 
                    (title, description, status, priority, due_date, estimated_hours, actual_hours, 
                     project_id, assignee_id, creator_id, created_at, updated_at)
                    VALUES (:title, :description, :status, :priority, :due_date, :estimated_hours, :actual_hours,
                            :project_id, :assignee_id, :creator_id, NOW(), NOW())
                """), {
                    "title": title,
                    "description": description,
                    "status": status,
                    "priority": priority,
                    "due_date": due_date,
                    "estimated_hours": estimated_hours,
                    "actual_hours": actual_hours,
                    "project_id": project_id,
                    "assignee_id": user_ids[i % len(user_ids)],
                    "creator_id": user_ids[0]
                })
                tasks_created += 1
        
        db.commit()
        logger.info(f"✅ Created {tasks_created} tasks")
        
        # 4. Create test grants
        logger.info("💰 Creating test grants...")
        sample_grants = [
            {
                "title": "Healthcare Innovation Grant 2024",
                "description": "Funding for innovative healthcare solutions in rural communities",
                "funding_body": "Department of Health",
                "amount": 100000.0,
                "currency": "AUD",
                "deadline": datetime.now() + timedelta(days=45),
                "status": "open",
                "eligibility_criteria": "Healthcare organizations, NGOs, research institutions",
                "application_url": "https://health.gov.au/grants/healthcare-innovation",
                "sector": "healthcare",
                "location": "Australia"
            },
            {
                "title": "Education Technology Development Fund",
                "description": "Support for developing educational technology solutions",
                "funding_body": "Department of Education",
                "amount": 75000.0,
                "currency": "AUD",
                "deadline": datetime.now() + timedelta(days=60),
                "status": "open",
                "eligibility_criteria": "Educational institutions, EdTech startups",
                "application_url": "https://education.gov.au/grants/edtech-fund",
                "sector": "education",
                "location": "Australia"
            },
            {
                "title": "Environmental Conservation Grant",
                "description": "Funding for environmental protection and conservation projects",
                "funding_body": "Environmental Protection Agency",
                "amount": 150000.0,
                "currency": "AUD",
                "deadline": datetime.now() + timedelta(days=30),
                "status": "open",
                "eligibility_criteria": "Environmental organizations, research institutions",
                "application_url": "https://epa.gov.au/grants/conservation",
                "sector": "environment",
                "location": "Australia"
            }
        ]
        
        for grant_data in sample_grants:
            db.execute(text("""
                INSERT INTO grants 
                (title, description, funding_body, amount, currency, deadline, status, 
                 eligibility_criteria, application_url, sector, location, created_at, updated_at)
                VALUES (:title, :description, :funding_body, :amount, :currency, :deadline, :status,
                        :eligibility_criteria, :application_url, :sector, :location, NOW(), NOW())
            """), grant_data)
            logger.info(f"✅ Created grant: {grant_data['title']}")
        
        db.commit()
        
        # 5. Seed news (reuse existing function)
        await seed_news(clear_existing=True, db=db)
        
        # Get final counts
        users_count = db.execute(text("SELECT COUNT(*) FROM users WHERE email LIKE '%@navimpact.test'")).scalar()
        projects_count = db.execute(text("SELECT COUNT(*) FROM projects")).scalar()
        tasks_count = db.execute(text("SELECT COUNT(*) FROM tasks")).scalar()
        grants_count = db.execute(text("SELECT COUNT(*) FROM grants")).scalar()
        news_count = db.execute(text("SELECT COUNT(*) FROM industry_news")).scalar()
        
        logger.info("🎉 Data seeding completed successfully!")
        
        return {
            "status": "success",
            "message": "Successfully seeded all test data",
            "data_created": {
                "users": users_count,
                "projects": projects_count,
                "tasks": tasks_count,
                "grants": grants_count,
                "news": news_count
            },
            "test_credentials": {
                "admin": {"email": "admin@navimpact.test", "password": "admin123"},
                "demo": {"email": "demo@navimpact.test", "password": "demo123"},
                "project_manager": {"email": "project.manager@navimpact.test", "password": "pm123"}
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to seed all data: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to seed data: {str(e)}")

@router.get("/status")
async def get_seed_status(db: Session = Depends(get_db)):
    """Check current database seeding status"""
    try:
        counts = {}
        tables = ["users", "projects", "tasks", "grants", "industry_news", "team_members", "task_comments", "time_entries"]
        
        for table in tables:
            result = db.execute(text(f"SELECT COUNT(*) FROM {table}"))
            counts[table] = result.scalar()
        
        return {
            "status": "success",
            "database_status": "connected",
            "table_counts": counts,
            "is_seeded": counts["projects"] > 0 and counts["users"] > 0
        }
        
    except Exception as e:
        logger.error(f"Failed to get seed status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get status: {str(e)}") 