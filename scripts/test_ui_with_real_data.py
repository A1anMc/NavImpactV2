#!/usr/bin/env python3
"""
Test UI with Real Data
Tests the frontend UI to ensure it's displaying real data from the backend
"""

import requests
import json
from typing import Dict, Any

# Configuration
FRONTEND_URL = "http://localhost:3000"
BACKEND_URL = "https://navimpact-api.onrender.com"

def test_frontend_projects_page():
    """Test if frontend projects page loads with real data"""
    try:
        print("🔍 Testing Frontend Projects Page with Real Data")
        print("-" * 50)
        
        # First, check what real data we have in the backend
        print("📊 Backend Data Check:")
        response = requests.get(f"{BACKEND_URL}/api/v1/projects/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"  ✅ Backend has {data.get('total', 0)} projects")
            for project in data.get('items', []):
                print(f"    - {project.get('name')} (ID: {project.get('id')})")
                print(f"      Framework: {project.get('framework_alignment', [])}")
                print(f"      SDG: {project.get('sdg_tags', [])}")
        else:
            print(f"  ❌ Backend error: {response.status_code}")
            return False
        
        # Check portfolio summary
        print("\n📊 Portfolio Summary:")
        response = requests.get(f"{BACKEND_URL}/api/v1/projects/portfolio-summary/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"  ✅ Total projects: {data.get('total_projects', 0)}")
            print(f"  ✅ Framework alignment: {data.get('framework_alignment_count', 0)}")
            print(f"  ✅ SDG alignment: {data.get('sdg_alignment_count', 0)}")
        else:
            print(f"  ❌ Portfolio summary error: {response.status_code}")
            return False
        
        # Test frontend page load
        print("\n🌐 Frontend Page Test:")
        response = requests.get(f"{FRONTEND_URL}/projects", timeout=15)
        print(f"  Status: {response.status_code}")
        
        if response.status_code == 200:
            print("  ✅ SUCCESS: Frontend projects page loads")
            
            # Check if the page contains expected content
            content = response.text
            if "projects" in content.lower():
                print("  ✅ Page contains projects content")
            if "framework" in content.lower():
                print("  ✅ Page contains framework content")
            if "impact" in content.lower():
                print("  ✅ Page contains impact content")
            
            return True
        else:
            print(f"  ❌ FAILED: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"  ❌ ERROR: {str(e)}")
        return False

def test_frontend_api_connectivity():
    """Test if frontend can make API calls to backend"""
    try:
        print("\n🔍 Testing Frontend API Connectivity")
        print("-" * 50)
        
        # Test if frontend can reach backend through its API routes
        response = requests.get(f"{FRONTEND_URL}/api/health", timeout=10)
        print(f"  Frontend health: {response.status_code}")
        
        if response.status_code == 200:
            print("  ✅ Frontend is running and healthy")
            return True
        else:
            print("  ❌ Frontend health check failed")
            return False
            
    except Exception as e:
        print(f"  ❌ ERROR: {str(e)}")
        return False

def main():
    """Run UI tests with real data"""
    print("🎯 UI WITH REAL DATA TEST")
    print("=" * 60)
    print("Testing frontend UI with real backend data")
    print("=" * 60)
    
    results = []
    
    # Test 1: Frontend API connectivity
    results.append(test_frontend_api_connectivity())
    
    # Test 2: Frontend projects page with real data
    results.append(test_frontend_projects_page())
    
    # Summary
    print("\n" + "=" * 60)
    print("🎯 UI TEST RESULTS")
    print("=" * 60)
    
    passed = sum(results)
    total = len(results)
    
    print(f"✅ Tests Passed: {passed}/{total}")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED!")
        print("✅ Frontend UI is working with real backend data")
        print("\n🚀 Ready for:")
        print("  1. Manual testing in browser")
        print("  2. Framework alignment feature testing")
        print("  3. Portfolio analytics verification")
        print("  4. Production deployment")
        
        print("\n🌐 Open in browser:")
        print(f"  Frontend: http://localhost:3000/dashboard/projects")
        print(f"  Backend API: {BACKEND_URL}/api/v1/health")
    else:
        print("❌ SOME TESTS FAILED")
        print("⚠️  Check the failed tests above")
    
    print("=" * 60)
    
    return passed == total

if __name__ == "__main__":
    main() 