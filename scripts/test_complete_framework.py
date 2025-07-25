#!/usr/bin/env python3
"""
Complete Framework Alignment Test
Creates a user and tests framework alignment functionality
"""

import requests
import json

# API base URL
BASE_URL = "https://navimpact-api.onrender.com/api/v1"

def create_test_user():
    """Create a test user"""
    
    user_data = {
        "email": "test@navimpact.com",
        "password": "testpassword123",
        "is_active": True,
        "is_superuser": True
    }
    
    print("👤 Creating test user...")
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json=user_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ User created: ID {result.get('id')}")
            return result.get('id')
        else:
            print(f"❌ User creation failed: {response.status_code}")
            print(f"Error: {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request error: {e}")
        return None

def create_project_with_framework(user_id):
    """Create a project with framework alignment data"""
    
    project_data = {
        "name": "Digital Literacy Program",
        "description": "A comprehensive digital literacy program for underserved communities",
        "status": "active",
        "impact_types": ["social", "community"],
        "framework_alignment": ["Plan for Victoria", "Melbourne 2030", "SDG 4 Quality Education"],
        "sdg_tags": ["SDG 4", "SDG 10"],
        "outcome_text": "Increased digital literacy among 500+ participants",
        "impact_statement": "Empowering communities through digital skills development",
        "evidence_sources": "Participant surveys, skills assessments, employment outcomes",
        "owner_id": user_id
    }
    
    print("\n📋 Creating project with framework alignment...")
    print(f"Framework alignment: {project_data['framework_alignment']}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/projects/",
            json=project_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ SUCCESS: Project created with framework alignment!")
            result = response.json()
            print(f"Project ID: {result.get('id')}")
            print(f"Framework alignment: {result.get('framework_alignment')}")
            return result.get('id')
        else:
            print(f"❌ ERROR: {response.status_code}")
            try:
                error_detail = response.json()
                print(f"Error detail: {json.dumps(error_detail, indent=2)}")
            except:
                print(f"Error text: {response.text}")
            return None
                
    except requests.exceptions.RequestException as e:
        print(f"❌ REQUEST ERROR: {e}")
        return None

def test_framework_filtering():
    """Test filtering projects by framework alignment"""
    
    print("\n🔍 Testing framework alignment filtering...")
    
    try:
        # Test filter by Plan for Victoria
        response = requests.get(
            f"{BASE_URL}/projects/",
            params={"framework_alignment": "Plan for Victoria"},
            timeout=30
        )
        
        print(f"Filter by 'Plan for Victoria' - Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"Found {result.get('total', 0)} projects aligned with Plan for Victoria")
            
            if result.get('items'):
                project = result['items'][0]
                print(f"Project: {project.get('name')}")
                print(f"Framework alignment: {project.get('framework_alignment')}")
        else:
            print(f"❌ Filter failed: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ REQUEST ERROR: {e}")

def test_portfolio_summary():
    """Test portfolio summary with framework alignment"""
    
    print("\n📊 Testing portfolio summary...")
    
    try:
        response = requests.get(
            f"{BASE_URL}/projects/portfolio-summary/",
            timeout=30
        )
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Portfolio summary retrieved!")
            print(f"Total projects: {result.get('total_projects')}")
            print(f"Framework alignment count: {result.get('framework_alignment_count')}")
            print(f"Framework breakdown: {result.get('framework_breakdown')}")
        else:
            print(f"❌ Portfolio summary failed: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ REQUEST ERROR: {e}")

def get_all_projects():
    """Get all projects to verify data"""
    
    print("\n📋 Getting all projects...")
    
    try:
        response = requests.get(
            f"{BASE_URL}/projects/",
            timeout=30
        )
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Found {result.get('total', 0)} projects")
            
            for project in result.get('items', []):
                print(f"\nProject: {project.get('name')}")
                print(f"  Status: {project.get('status')}")
                print(f"  Impact types: {project.get('impact_types')}")
                print(f"  Framework alignment: {project.get('framework_alignment')}")
                print(f"  SDG tags: {project.get('sdg_tags')}")
        else:
            print(f"❌ Failed to get projects: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ REQUEST ERROR: {e}")

def main():
    """Main test function"""
    print("🧪 Complete Framework Alignment Test")
    print("=" * 50)
    
    # Create user
    user_id = create_test_user()
    if not user_id:
        print("❌ Cannot proceed without user")
        return
    
    # Create project with framework alignment
    project_id = create_project_with_framework(user_id)
    if not project_id:
        print("❌ Cannot proceed without project")
        return
    
    # Test framework filtering
    test_framework_filtering()
    
    # Test portfolio summary
    test_portfolio_summary()
    
    # Get all projects
    get_all_projects()
    
    print("\n🎉 Framework alignment test completed!")

if __name__ == "__main__":
    main() 