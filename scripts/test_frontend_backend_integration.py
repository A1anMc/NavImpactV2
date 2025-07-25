#!/usr/bin/env python3
"""
Frontend-Backend Integration Test
Tests the actual API calls that the frontend would make to the backend
"""

import requests
import json
from typing import Dict, Any

# Configuration
BACKEND_URL = "https://navimpact-api.onrender.com"

def test_backend_api_endpoints():
    """Test all the API endpoints that the frontend uses"""
    print("🎯 FRONTEND-BACKEND INTEGRATION TEST")
    print("=" * 60)
    print("Testing API endpoints that frontend will call")
    print("=" * 60)
    
    results = []
    
    # Test 1: Health endpoint
    print("\n🔍 Test 1: Health Endpoint")
    print("-" * 40)
    try:
        response = requests.get(f"{BACKEND_URL}/api/v1/health", timeout=10)
        print(f"  Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"  ✅ SUCCESS: Backend healthy")
            print(f"  Database: {data.get('database')}")
            print(f"  Environment: {data.get('environment')}")
            results.append(True)
        else:
            print(f"  ❌ FAILED: {response.status_code}")
            results.append(False)
    except Exception as e:
        print(f"  ❌ ERROR: {str(e)}")
        results.append(False)
    
    # Test 2: Projects endpoint
    print("\n🔍 Test 2: Projects Endpoint")
    print("-" * 40)
    try:
        response = requests.get(f"{BACKEND_URL}/api/v1/projects/", timeout=10)
        print(f"  Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"  ✅ SUCCESS: Projects endpoint working")
            print(f"  Total projects: {data.get('total', 0)}")
            print(f"  Items returned: {len(data.get('items', []))}")
            results.append(True)
        else:
            print(f"  ❌ FAILED: {response.status_code}")
            results.append(False)
    except Exception as e:
        print(f"  ❌ ERROR: {str(e)}")
        results.append(False)
    
    # Test 3: Portfolio Summary
    print("\n🔍 Test 3: Portfolio Summary")
    print("-" * 40)
    try:
        response = requests.get(f"{BACKEND_URL}/api/v1/projects/portfolio-summary/", timeout=10)
        print(f"  Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"  ✅ SUCCESS: Portfolio summary working")
            print(f"  Total projects: {data.get('total_projects', 0)}")
            print(f"  Framework alignment: {data.get('framework_alignment_count', 0)}")
            print(f"  SDG alignment: {data.get('sdg_alignment_count', 0)}")
            results.append(True)
        else:
            print(f"  ❌ FAILED: {response.status_code}")
            results.append(False)
    except Exception as e:
        print(f"  ❌ ERROR: {str(e)}")
        results.append(False)
    
    # Test 4: Framework Filtering
    print("\n🔍 Test 4: Framework Filtering")
    print("-" * 40)
    try:
        response = requests.get(f"{BACKEND_URL}/api/v1/projects/?framework_alignment=melbourne_2030", timeout=10)
        print(f"  Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"  ✅ SUCCESS: Framework filtering working")
            print(f"  Projects with Melbourne 2030: {data.get('total', 0)}")
            results.append(True)
        else:
            print(f"  ❌ FAILED: {response.status_code}")
            results.append(False)
    except Exception as e:
        print(f"  ❌ ERROR: {str(e)}")
        results.append(False)
    
    # Test 5: SDG Filtering
    print("\n🔍 Test 5: SDG Filtering")
    print("-" * 40)
    try:
        response = requests.get(f"{BACKEND_URL}/api/v1/projects/?sdg_tags=SDG%2011", timeout=10)
        print(f"  Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"  ✅ SUCCESS: SDG filtering working")
            print(f"  Projects with SDG 11: {data.get('total', 0)}")
            results.append(True)
        else:
            print(f"  ❌ FAILED: {response.status_code}")
            results.append(False)
    except Exception as e:
        print(f"  ❌ ERROR: {str(e)}")
        results.append(False)
    
    # Test 6: Project Creation (without auth)
    print("\n🔍 Test 6: Project Creation (No Auth)")
    print("-" * 40)
    try:
        project_data = {
            "name": "Frontend Integration Test Project",
            "description": "Testing frontend-backend integration",
            "status": "active",
            "impact_types": ["social"],
            "framework_alignment": ["melbourne_2030"],
            "sdg_tags": ["SDG 4"]
        }
        response = requests.post(f"{BACKEND_URL}/api/v1/projects/", json=project_data, timeout=10)
        print(f"  Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"  ✅ SUCCESS: Project creation working")
            print(f"  Created project ID: {data.get('id')}")
            print(f"  Name: {data.get('name')}")
            results.append(True)
        else:
            print(f"  ❌ FAILED: {response.status_code}")
            if response.status_code == 422:
                error_data = response.json()
                print(f"  Validation error: {error_data}")
            results.append(False)
    except Exception as e:
        print(f"  ❌ ERROR: {str(e)}")
        results.append(False)
    
    # Summary
    print("\n" + "=" * 60)
    print("🎯 INTEGRATION TEST RESULTS")
    print("=" * 60)
    
    passed = sum(results)
    total = len(results)
    
    print(f"✅ Tests Passed: {passed}/{total}")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED!")
        print("✅ Frontend-Backend integration is working perfectly")
        print("\n🚀 Ready for:")
        print("  1. Frontend deployment")
        print("  2. Framework alignment features")
        print("  3. Portfolio analytics")
        print("  4. Project creation from frontend")
    else:
        print("❌ SOME TESTS FAILED")
        print("⚠️  Check the failed tests above")
    
    print("=" * 60)
    
    return passed == total

if __name__ == "__main__":
    test_backend_api_endpoints() 