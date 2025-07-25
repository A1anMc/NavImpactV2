#!/usr/bin/env python3
"""
Seed Demo Projects Directly
Phase 2: Direct database seeding to bypass authentication requirements
"""

import psycopg2
import json
from datetime import datetime
import os

# Database connection details (from render.yaml)
DB_CONFIG = {
    "host": "dpg-d21hvsvfte5s73fkk140-a",
    "database": "navimpact_dbv3",
    "user": "navimpact_dbv3_user",
    "password": "EY0Vd5QcTEoY7ZM0CrKCWfsFVHcYIZ8V"
}

# Demo projects with realistic Victorian + SDG alignment
DEMO_PROJECTS = [
    {
        "name": "Greenfields Housing Renewal",
        "description": "Pilot housing renewal project aligned with Melbourne 2030",
        "status": "active",
        "impact_types": ["social", "environmental"],
        "framework_alignment": [
            "greenfields_housing_plan",
            "melbourne_2030",
            "SDG 11"
        ],
        "sdg_tags": ["SDG 11", "SDG 3"],
        "outcome_text": "Improved housing sustainability & community resilience",
        "impact_statement": "This project reduces housing stress while enhancing local green spaces",
        "evidence_sources": "Victorian Housing Authority reports"
    },
    {
        "name": "Digital Literacy for Underserved Communities",
        "description": "Comprehensive digital skills program for disadvantaged communities",
        "status": "active",
        "impact_types": ["social", "community"],
        "framework_alignment": [
            "plan_for_victoria",
            "clean_economy_workforce_strategy",
            "SDG 4"
        ],
        "sdg_tags": ["SDG 4", "SDG 10"],
        "outcome_text": "500+ participants gained digital literacy skills",
        "impact_statement": "Empowering communities through digital skills development",
        "evidence_sources": "Participant surveys, skills assessments, employment outcomes"
    },
    {
        "name": "Indigenous Cultural Heritage Preservation",
        "description": "Preservation and celebration of Victorian Aboriginal cultural heritage",
        "status": "active",
        "impact_types": ["social", "community"],
        "framework_alignment": [
            "victorian_aboriginal_affairs_framework",
            "plan_for_victoria",
            "SDG 11"
        ],
        "sdg_tags": ["SDG 11", "SDG 10"],
        "outcome_text": "Enhanced cultural awareness and heritage preservation",
        "impact_statement": "Strengthening community connections through cultural heritage",
        "evidence_sources": "Community feedback, cultural impact assessments"
    }
]

def connect_to_database():
    """Connect to the database"""
    
    print("🔌 Connecting to Database V3")
    print("=" * 40)
    
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        print("✅ Database connection successful")
        return conn
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return None

def create_demo_user(conn):
    """Create a demo user for project ownership"""
    
    print("\n👤 Creating Demo User")
    print("=" * 30)
    
    try:
        cursor = conn.cursor()
        
        # Check if demo user already exists
        cursor.execute("SELECT id FROM users WHERE username = 'demo_user'")
        existing_user = cursor.fetchone()
        
        if existing_user:
            user_id = existing_user[0]
            print(f"✅ Demo user already exists (ID: {user_id})")
            return user_id
        
        # Create demo user
        cursor.execute("""
            INSERT INTO users (username, email, full_name, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        """, (
            'demo_user',
            'demo@navimpact.com',
            'Demo User',
            datetime.now(),
            datetime.now()
        ))
        
        user_id = cursor.fetchone()[0]
        conn.commit()
        
        print(f"✅ Demo user created (ID: {user_id})")
        return user_id
        
    except Exception as e:
        print(f"❌ Error creating demo user: {e}")
        conn.rollback()
        return None

def seed_demo_projects(conn, user_id):
    """Seed demo projects directly into database"""
    
    print("\n🌱 Seeding Demo Projects")
    print("=" * 40)
    
    created_projects = []
    
    try:
        cursor = conn.cursor()
        
        for i, project_data in enumerate(DEMO_PROJECTS, 1):
            print(f"\n📋 Creating Project {i}: {project_data['name']}")
            print(f"  Framework alignment: {project_data['framework_alignment']}")
            print(f"  SDG tags: {project_data['sdg_tags']}")
            
            # Insert project
            cursor.execute("""
                INSERT INTO projects (
                    name, description, status, impact_types, framework_alignment, 
                    sdg_tags, outcome_text, impact_statement, evidence_sources,
                    owner_id, created_at, updated_at
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                project_data['name'],
                project_data['description'],
                project_data['status'],
                json.dumps(project_data['impact_types']),
                json.dumps(project_data['framework_alignment']),
                json.dumps(project_data['sdg_tags']),
                project_data['outcome_text'],
                project_data['impact_statement'],
                project_data['evidence_sources'],
                user_id,
                datetime.now(),
                datetime.now()
            ))
            
            project_id = cursor.fetchone()[0]
            print(f"✅ Project created (ID: {project_id})")
            created_projects.append(project_id)
        
        conn.commit()
        print(f"\n✅ All {len(created_projects)} projects created successfully")
        
    except Exception as e:
        print(f"❌ Error seeding projects: {e}")
        conn.rollback()
    
    return created_projects

def verify_seeded_data(conn):
    """Verify the seeded data"""
    
    print("\n🔍 Verifying Seeded Data")
    print("=" * 40)
    
    try:
        cursor = conn.cursor()
        
        # Check total projects
        cursor.execute("SELECT COUNT(*) FROM projects")
        total_projects = cursor.fetchone()[0]
        print(f"✅ Total projects: {total_projects}")
        
        if total_projects > 0:
            # Show project details
            cursor.execute("""
                SELECT id, name, framework_alignment, sdg_tags 
                FROM projects 
                ORDER BY id
            """)
            
            projects = cursor.fetchall()
            print("  Projects found:")
            for project in projects:
                project_id, name, framework_alignment, sdg_tags = project
                print(f"    - {name} (ID: {project_id})")
                print(f"      Framework: {framework_alignment}")
                print(f"      SDG: {sdg_tags}")
        
        # Check framework breakdown
        cursor.execute("""
            SELECT 
                COUNT(*) as total_projects,
                COUNT(CASE WHEN framework_alignment IS NOT NULL AND framework_alignment != '[]' THEN 1 END) as framework_aligned,
                COUNT(CASE WHEN sdg_tags IS NOT NULL AND sdg_tags != '[]' THEN 1 END) as sdg_aligned
            FROM projects
        """)
        
        stats = cursor.fetchone()
        total, framework_aligned, sdg_aligned = stats
        
        print(f"\n✅ Portfolio Summary:")
        print(f"  Total projects: {total}")
        print(f"  Framework aligned: {framework_aligned}")
        print(f"  SDG aligned: {sdg_aligned}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error verifying data: {e}")
        return False

def main():
    """Main seeding function"""
    
    print("🎯 DIRECT DEMO PROJECT SEEDING")
    print("=" * 60)
    print("Phase 2: Direct database seeding to bypass authentication")
    print("=" * 60)
    
    # Step 1: Connect to database
    conn = connect_to_database()
    if not conn:
        print("❌ Cannot proceed without database connection")
        return
    
    try:
        # Step 2: Create demo user
        user_id = create_demo_user(conn)
        if not user_id:
            print("❌ Cannot proceed without demo user")
            return
        
        # Step 3: Seed demo projects
        created_projects = seed_demo_projects(conn, user_id)
        
        # Step 4: Verify seeded data
        verification_ok = verify_seeded_data(conn)
        
        print("\n" + "=" * 60)
        print("🎯 SEEDING RESULTS")
        print("=" * 60)
        
        print(f"Projects created: {len(created_projects)}/{len(DEMO_PROJECTS)}")
        
        if len(created_projects) > 0:
            print("✅ Demo data seeded successfully")
            print("✅ Framework alignment working")
            print("✅ Ready for frontend testing")
        else:
            print("❌ No projects were created")
            print("⚠️  Check the error messages above")
        
        if verification_ok:
            print("✅ Data verification successful")
        else:
            print("❌ Data verification failed")
        
        print("\n🚀 Next: Test frontend with seeded data")
        
    finally:
        conn.close()
        print("\n🔌 Database connection closed")

if __name__ == "__main__":
    main() 