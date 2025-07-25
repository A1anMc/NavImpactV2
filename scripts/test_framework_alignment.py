#!/usr/bin/env python3
"""
Test script to create a project with framework_alignment data
"""

import requests
import json

# API base URL
BASE_URL = "https://navimpact-api.onrender.com/api/v1"

def test_create_project_with_framework():
    """Test creating a project with framework_alignment data"""
    
    # Test data with framework_alignment
    project_data = {
        "name": "Test Framework Project",
        "description": "Testing framework alignment functionality",
        "status": "active",
        "impact_types": ["social", "environmental"],
        "framework_alignment": ["Plan for Victoria", "Melbourne 2030", "SDG 4"],
        "owner_id": 1
    }
    
    print("🔍 Testing Project Creation with Framework Alignment")
    print("=" * 50)
    print(f"Creating project: {project_data['name']}")
    print(f"Framework alignment: {project_data['framework_alignment']}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/projects/",
            json=project_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"\nStatus: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("✅ SUCCESS: Project created with framework alignment!")
            result = response.json()
            print(f"Created project ID: {result.get('id')}")
            print(f"Framework alignment: {result.get('framework_alignment')}")
        else:
            print(f"❌ ERROR: {response.status_code}")
            try:
                error_detail = response.json()
                print(f"Error detail: {json.dumps(error_detail, indent=2)}")
            except:
                print(f"Error text: {response.text}")
                
    except requests.exceptions.RequestException as e:
        print(f"❌ REQUEST ERROR: {e}")

def test_get_projects_simple():
    """Test getting projects with minimal query"""
    
    print("\n🔍 Testing Simple Projects Query")
    print("=" * 30)
    
    try:
        response = requests.get(
            f"{BASE_URL}/projects/",
            params={"limit": 1},
            timeout=30
        )
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ SUCCESS: Projects retrieved!")
            result = response.json()
            print(f"Total projects: {result.get('total', 0)}")
            if result.get('items'):
                project = result['items'][0]
                print(f"First project: {project.get('name')}")
                print(f"Framework alignment: {project.get('framework_alignment')}")
        else:
            print(f"❌ ERROR: {response.status_code}")
            try:
                error_detail = response.json()
                print(f"Error detail: {json.dumps(error_detail, indent=2)}")
            except:
                print(f"Error text: {response.text}")
                
    except requests.exceptions.RequestException as e:
        print(f"❌ REQUEST ERROR: {e}")

if __name__ == "__main__":
    test_get_projects_simple()
    test_create_project_with_framework() 