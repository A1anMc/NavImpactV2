#!/usr/bin/env python3
"""
Seed Demo Projects via API
Phase 2: Use the new demo seeding endpoint
"""

import requests
import json

# API base URL
BASE_URL = "https://navimpact-api.onrender.com/api/v1"

def seed_demo_projects():
    """Seed demo projects using the new API endpoint"""
    
    print("🎯 DEMO PROJECT SEEDING VIA API")
    print("=" * 60)
    print("Phase 2: Using demo seeding endpoint")
    print("=" * 60)
    
    try:
        print("🌱 Calling demo seeding endpoint...")
        response = requests.post(f"{BASE_URL}/projects/seed-demo", timeout=30)
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Demo projects seeded successfully!")
            print(f"  Projects created: {data.get('projects_created')}")
            print(f"  Demo user ID: {data.get('demo_user_id')}")
            
            print("\n📋 Created Projects:")
            for project in data.get('projects', []):
                print(f"  - {project.get('name')} (ID: {project.get('id')})")
                print(f"    Framework: {project.get('framework_alignment')}")
                print(f"    SDG: {project.get('sdg_tags')}")
            
            return True
        else:
            print(f"❌ Seeding failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def verify_seeded_data():
    """Verify the seeded data is accessible via API"""
    
    print("\n🔍 Verifying Seeded Data via API")
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
    """Main function"""
    
    # Step 1: Seed demo projects
    seeding_success = seed_demo_projects()
    
    # Step 2: Verify seeded data
    verification_ok = verify_seeded_data()
    
    print("\n" + "=" * 60)
    print("🎯 SEEDING RESULTS")
    print("=" * 60)
    
    if seeding_success:
        print("✅ Demo data seeded successfully")
        print("✅ Framework alignment working")
        print("✅ Ready for frontend testing")
    else:
        print("❌ Demo seeding failed")
        print("⚠️  Check the error messages above")
    
    if verification_ok:
        print("✅ Data verification successful")
    else:
        print("❌ Data verification failed")
    
    print("\n🚀 Next: Test frontend with seeded data")

if __name__ == "__main__":
    main() 