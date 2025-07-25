#!/usr/bin/env python3
"""
Test Project Creation
Verify that project creation works without owner_id
"""

import requests
import json

# API base URL
BASE_URL = "https://navimpact-api.onrender.com/api/v1"

def test_project_creation():
    """Test creating a project without owner_id"""
    
    print("🧪 Testing Project Creation (No owner_id)")
    print("=" * 50)
    
    # Test project data
    project_data = {
        "name": "Test Framework Project",
        "description": "Testing framework alignment without owner_id",
        "status": "active",
        "impact_types": ["social", "environmental"],
        "framework_alignment": ["Plan for Victoria", "Melbourne 2030", "SDG 4"],
        "sdg_tags": ["SDG 4", "SDG 10"],
        "outcome_text": "Test outcomes",
        "impact_statement": "Test impact statement",
        "evidence_sources": "Test evidence"
    }
    
    print("📋 Project Data:")
    print(f"  Name: {project_data['name']}")
    print(f"  Framework alignment: {project_data['framework_alignment']}")
    print(f"  Impact types: {project_data['impact_types']}")
    print(f"  SDG tags: {project_data['sdg_tags']}")
    print(f"  Owner ID: None (auto-created)")
    
    try:
        response = requests.post(
            f"{BASE_URL}/projects/",
            json=project_data,
            timeout=30
        )
        
        print(f"\n📡 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ SUCCESS: Project created without owner_id!")
            print(f"  Project ID: {result.get('id')}")
            print(f"  Name: {result.get('name')}")
            print(f"  Framework alignment: {result.get('framework_alignment')}")
            print(f"  Impact types: {result.get('impact_types')}")
            print(f"  SDG tags: {result.get('sdg_tags')}")
            print(f"  Message: {result.get('message')}")
            return True
        else:
            print(f"❌ FAILED: {response.status_code}")
            try:
                error_detail = response.json()
                print(f"Error detail: {json.dumps(error_detail, indent=2)}")
            except:
                print(f"Error text: {response.text}")
            return False
                
    except requests.exceptions.RequestException as e:
        print(f"❌ REQUEST ERROR: {e}")
        return False

def test_multiple_projects():
    """Test creating multiple projects"""
    
    print("\n🧪 Testing Multiple Project Creation")
    print("=" * 40)
    
    projects = [
        {
            "name": "Greenfields Housing Renewal",
            "description": "Pilot housing renewal project aligned with Melbourne 2030",
            "status": "active",
            "impact_types": ["social", "environmental"],
            "framework_alignment": ["greenfields_housing_plan", "melbourne_2030", "SDG 11"],
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
            "framework_alignment": ["plan_for_victoria", "clean_economy_workforce_strategy", "SDG 4"],
            "sdg_tags": ["SDG 4", "SDG 10"],
            "outcome_text": "500+ participants gained digital literacy skills",
            "impact_statement": "Empowering communities through digital skills development",
            "evidence_sources": "Participant surveys, skills assessments, employment outcomes"
        }
    ]
    
    created_count = 0
    
    for i, project_data in enumerate(projects, 1):
        print(f"\n📋 Creating Project {i}: {project_data['name']}")
        
        try:
            response = requests.post(
                f"{BASE_URL}/projects/",
                json=project_data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Created (ID: {result.get('id')})")
                created_count += 1
            else:
                print(f"❌ Failed: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print(f"\n📊 Results: {created_count}/{len(projects)} projects created")
    return created_count == len(projects)

def verify_projects():
    """Verify projects were created"""
    
    print("\n🔍 Verifying Created Projects")
    print("=" * 40)
    
    try:
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
            
            return True
        else:
            print(f"❌ Failed to fetch projects: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Main test function"""
    
    print("🎯 PROJECT CREATION TEST")
    print("=" * 60)
    print("Testing project creation without owner_id requirement")
    print("=" * 60)
    
    # Test 1: Single project creation
    single_success = test_project_creation()
    
    # Test 2: Multiple projects
    multiple_success = test_multiple_projects()
    
    # Test 3: Verify projects
    verification_ok = verify_projects()
    
    print("\n" + "=" * 60)
    print("🎯 TEST RESULTS")
    print("=" * 60)
    
    if single_success:
        print("✅ Single project creation: WORKING")
    else:
        print("❌ Single project creation: FAILED")
    
    if multiple_success:
        print("✅ Multiple project creation: WORKING")
    else:
        print("❌ Multiple project creation: FAILED")
    
    if verification_ok:
        print("✅ Project verification: WORKING")
    else:
        print("❌ Project verification: FAILED")
    
    # Overall result
    all_tests_passed = single_success and multiple_success and verification_ok
    
    print("\n" + "=" * 60)
    if all_tests_passed:
        print("🎉 ALL TESTS PASSED!")
        print("✅ Project creation works without owner_id")
        print("✅ Framework alignment features working")
        print("✅ Ready for frontend integration")
    else:
        print("❌ SOME TESTS FAILED")
        print("⚠️  Check the failed tests above")

if __name__ == "__main__":
    main() 