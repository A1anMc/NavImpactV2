#!/usr/bin/env python3
"""
Test script to run after database fix
"""

import requests
import json

def test_api_after_fix():
    """Test the API after the database fix"""
    
    print("🧪 Testing API After Database Fix")
    print("=" * 50)
    
    # Test projects endpoint
    try:
        response = requests.get("https://navimpact-api.onrender.com/api/v1/projects/", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            projects = data.get('items', [])
            
            print(f"✅ API is working!")
            print(f"📊 Found {len(projects)} projects")
            
            # Check for framework_alignment field
            if projects:
                first_project = projects[0]
                if 'framework_alignment' in first_project:
                    print(f"✅ framework_alignment field is present")
                    print(f"   Value: {first_project.get('framework_alignment')}")
                else:
                    print(f"❌ framework_alignment field is missing")
            
            # Test creating a project with framework_alignment
            test_data = {
                "name": "Test Framework Project",
                "description": "Testing framework alignment",
                "status": "planning",
                "framework_alignment": ["plan_for_victoria", "melbourne_2030"],
                "owner_id": 1
            }
            
            create_response = requests.post(
                "https://navimpact-api.onrender.com/api/v1/projects/",
                json=test_data,
                timeout=10
            )
            
            if create_response.status_code == 200:
                print(f"✅ Can create projects with framework_alignment")
            else:
                print(f"❌ Cannot create projects with framework_alignment: {create_response.status_code}")
                print(f"   Response: {create_response.text}")
            
        else:
            print(f"❌ API still not working: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error testing API: {e}")

if __name__ == "__main__":
    test_api_after_fix() 