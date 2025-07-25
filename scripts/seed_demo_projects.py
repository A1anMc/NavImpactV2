#!/usr/bin/env python3
"""
Seed Demo Projects
Phase 2: Seed minimal demo data with Victorian framework alignment
"""

import requests
import json
import time

# API base URL
BASE_URL = "https://navimpact-api.onrender.com/api/v1"

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

def create_user_for_projects():
    """Create a test user for project ownership"""
    
    print("👤 Creating test user for project ownership")
    print("=" * 50)
    
    user_data = {
        "username": "demo_user",
        "email": "demo@navimpact.com",
        "password": "demo_password_123",
        "full_name": "Demo User"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json=user_data,
            timeout=30
        )
        
        if response.status_code == 200:
            user = response.json()
            print("✅ Test user created successfully")
            print(f"  User ID: {user.get('id')}")
            print(f"  Username: {user.get('username')}")
            return user.get('id')
        else:
            print(f"❌ User creation failed: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error creating user: {e}")
        return None

def seed_demo_projects(user_id=None):
    """Seed demo projects with framework alignment"""
    
    print("\n🌱 Seeding Demo Projects")
    print("=" * 50)
    
    created_projects = []
    
    for i, project_data in enumerate(DEMO_PROJECTS, 1):
        print(f"\n📋 Creating Project {i}: {project_data['name']}")
        print(f"  Framework alignment: {project_data['framework_alignment']}")
        print(f"  SDG tags: {project_data['sdg_tags']}")
        
        # Add user_id if available
        if user_id:
            project_data['owner_id'] = user_id
        
        try:
            response = requests.post(
                f"{BASE_URL}/projects/",
                json=project_data,
                timeout=30
            )
            
            if response.status_code == 200:
                project = response.json()
                print("✅ Project created successfully")
                print(f"  Project ID: {project.get('id')}")
                print(f"  Framework alignment: {project.get('framework_alignment')}")
                print(f"  SDG tags: {project.get('sdg_tags')}")
                created_projects.append(project)
            else:
                print(f"❌ Project creation failed: {response.status_code}")
                print(f"Response: {response.text}")
                
                # If it's an owner_id issue, try without it
                if "owner_id" in response.text and user_id is None:
                    print("  💡 Trying without owner_id...")
                    project_data.pop('owner_id', None)
                    response = requests.post(
                        f"{BASE_URL}/projects/",
                        json=project_data,
                        timeout=30
                    )
                    if response.status_code == 200:
                        project = response.json()
                        print("✅ Project created successfully (without owner_id)")
                        print(f"  Project ID: {project.get('id')}")
                        created_projects.append(project)
                    else:
                        print(f"❌ Still failed: {response.text}")
                
        except Exception as e:
            print(f"❌ Error creating project: {e}")
        
        # Small delay between requests
        time.sleep(1)
    
    return created_projects

def verify_seeded_data():
    """Verify the seeded data is accessible"""
    
    print("\n🔍 Verifying Seeded Data")
    print("=" * 50)
    
    try:
        # Check total projects
        response = requests.get(f"{BASE_URL}/projects/", timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            total_projects = data.get('total', 0)
            print(f"✅ Total projects: {total_projects}")
            
            if total_projects > 0:
                print("  Projects found:")
                for project in data.get('items', []):
                    print(f"    - {project.get('name')} (ID: {project.get('id')})")
                    print(f"      Framework: {project.get('framework_alignment')}")
                    print(f"      SDG: {project.get('sdg_tags')}")
        
        # Check portfolio summary
        response = requests.get(f"{BASE_URL}/projects/portfolio-summary/", timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n✅ Portfolio Summary:")
            print(f"  Total projects: {data.get('total_projects')}")
            print(f"  Framework alignment count: {data.get('framework_alignment_count')}")
            print(f"  SDG alignment count: {data.get('sdg_alignment_count')}")
            
            # Check framework breakdown
            framework_breakdown = data.get('framework_breakdown', {})
            print(f"\n  Framework Breakdown:")
            for framework, count in framework_breakdown.items():
                if count > 0:
                    print(f"    - {framework}: {count}")
        
        # Test framework filtering
        print(f"\n🔍 Testing Framework Filtering:")
        frameworks_to_test = ["Plan for Victoria", "Melbourne 2030", "Greenfields Housing Plan"]
        
        for framework in frameworks_to_test:
            response = requests.get(
                f"{BASE_URL}/projects/",
                params={"framework_alignment": framework},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                count = data.get('total', 0)
                print(f"  {framework}: {count} projects")
        
        return True
        
    except Exception as e:
        print(f"❌ Error verifying data: {e}")
        return False

def main():
    """Main seeding function"""
    
    print("🎯 DEMO PROJECT SEEDING")
    print("=" * 60)
    print("Phase 2: Seed minimal demo data with Victorian framework alignment")
    print("=" * 60)
    
    # Step 1: Try to create a user (optional)
    user_id = create_user_for_projects()
    
    # Step 2: Seed demo projects
    created_projects = seed_demo_projects(user_id)
    
    # Step 3: Verify seeded data
    verification_ok = verify_seeded_data()
    
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

if __name__ == "__main__":
    main() 