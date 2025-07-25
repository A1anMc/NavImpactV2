#!/usr/bin/env python3
"""
Simple Framework Alignment Test
Tests framework alignment functionality directly
"""

import requests
import json

# API base URL
BASE_URL = "https://navimpact-api.onrender.com/api/v1"

def test_framework_alignment_features():
    """Test framework alignment features"""
    
    print("🧪 Testing Framework Alignment Features")
    print("=" * 50)
    
    # Test 1: Portfolio Summary
    print("\n📊 Test 1: Portfolio Summary")
    try:
        response = requests.get(f"{BASE_URL}/projects/portfolio-summary/", timeout=30)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Portfolio summary working!")
            print(f"  Total projects: {result.get('total_projects')}")
            print(f"  Framework alignment count: {result.get('framework_alignment_count')}")
            print(f"  Framework breakdown: {result.get('framework_breakdown')}")
        else:
            print(f"❌ Failed: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 2: Framework Filtering
    print("\n🔍 Test 2: Framework Filtering")
    try:
        response = requests.get(
            f"{BASE_URL}/projects/",
            params={"framework_alignment": "Plan for Victoria"},
            timeout=30
        )
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Framework filtering working!")
            print(f"  Found {result.get('total', 0)} projects with Plan for Victoria")
        else:
            print(f"❌ Failed: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 3: Projects List with Framework Fields
    print("\n📋 Test 3: Projects List with Framework Fields")
    try:
        response = requests.get(f"{BASE_URL}/projects/", timeout=30)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Projects list working!")
            print(f"  Total projects: {result.get('total', 0)}")
            
            if result.get('items'):
                project = result['items'][0]
                print(f"  Sample project has framework_alignment field: {'framework_alignment' in project}")
                print(f"  Framework alignment: {project.get('framework_alignment')}")
        else:
            print(f"❌ Failed: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 4: Health Check
    print("\n🏥 Test 4: Health Check")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=30)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Health check working!")
            print(f"  Database: {result.get('database')}")
            print(f"  Environment: {result.get('environment')}")
        else:
            print(f"❌ Failed: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n🎉 Framework alignment test completed!")

if __name__ == "__main__":
    test_framework_alignment_features() 