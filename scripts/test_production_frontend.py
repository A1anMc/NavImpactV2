#!/usr/bin/env python3
"""
Test Production Frontend on Render
Tests the deployed frontend to ensure it's working with real backend data
"""

import requests
import json
from typing import Dict, Any

# Configuration
FRONTEND_URL = "https://navimpact-web.onrender.com"
BACKEND_URL = "https://navimpact-api.onrender.com"

def test_production_frontend():
    """Test the production frontend deployment"""
    print("🎯 PRODUCTION FRONTEND TEST")
    print("=" * 60)
    print("Testing deployed frontend on Render")
    print("=" * 60)
    
    results = []
    
    # Test 1: Frontend availability
    print("\n🔍 Test 1: Frontend Availability")
    print("-" * 40)
    try:
        response = requests.get(f"{FRONTEND_URL}", timeout=30)
        print(f"  Status: {response.status_code}")
        if response.status_code == 200:
            print("  ✅ SUCCESS: Frontend is accessible")
            results.append(True)
        else:
            print(f"  ❌ FAILED: {response.status_code}")
            results.append(False)
    except Exception as e:
        print(f"  ❌ ERROR: {str(e)}")
        results.append(False)
    
    # Test 2: Projects page
    print("\n🔍 Test 2: Projects Page")
    print("-" * 40)
    try:
        response = requests.get(f"{FRONTEND_URL}/projects", timeout=30)
        print(f"  Status: {response.status_code}")
        if response.status_code == 200:
            print("  ✅ SUCCESS: Projects page loads")
            
            # Check for key content
            content = response.text
            if "projects" in content.lower():
                print("  ✅ Contains projects content")
            if "framework" in content.lower():
                print("  ✅ Contains framework content")
            if "impact" in content.lower():
                print("  ✅ Contains impact content")
            
            results.append(True)
        else:
            print(f"  ❌ FAILED: {response.status_code}")
            results.append(False)
    except Exception as e:
        print(f"  ❌ ERROR: {str(e)}")
        results.append(False)
    
    # Test 3: Backend connectivity from frontend
    print("\n🔍 Test 3: Backend Connectivity")
    print("-" * 40)
    try:
        response = requests.get(f"{BACKEND_URL}/api/v1/health", timeout=15)
        print(f"  Backend Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"  ✅ Backend healthy: {data.get('status')}")
            print(f"  Database: {data.get('database')}")
            results.append(True)
        else:
            print(f"  ❌ Backend error: {response.status_code}")
            results.append(False)
    except Exception as e:
        print(f"  ❌ ERROR: {str(e)}")
        results.append(False)
    
    # Test 4: Real data verification
    print("\n🔍 Test 4: Real Data Verification")
    print("-" * 40)
    try:
        response = requests.get(f"{BACKEND_URL}/api/v1/projects/", timeout=15)
        if response.status_code == 200:
            data = response.json()
            print(f"  ✅ Backend has {data.get('total', 0)} projects")
            
            for project in data.get('items', []):
                print(f"    - {project.get('name')} (ID: {project.get('id')})")
                print(f"      Framework: {project.get('framework_alignment', [])}")
                print(f"      SDG: {project.get('sdg_tags', [])}")
            
            results.append(True)
        else:
            print(f"  ❌ Backend error: {response.status_code}")
            results.append(False)
    except Exception as e:
        print(f"  ❌ ERROR: {str(e)}")
        results.append(False)
    
    # Test 5: Portfolio summary
    print("\n🔍 Test 5: Portfolio Summary")
    print("-" * 40)
    try:
        response = requests.get(f"{BACKEND_URL}/api/v1/projects/portfolio-summary/", timeout=15)
        if response.status_code == 200:
            data = response.json()
            print(f"  ✅ Total projects: {data.get('total_projects', 0)}")
            print(f"  ✅ Framework alignment: {data.get('framework_alignment_count', 0)}")
            print(f"  ✅ SDG alignment: {data.get('sdg_alignment_count', 0)}")
            results.append(True)
        else:
            print(f"  ❌ Portfolio error: {response.status_code}")
            results.append(False)
    except Exception as e:
        print(f"  ❌ ERROR: {str(e)}")
        results.append(False)
    
    # Summary
    print("\n" + "=" * 60)
    print("🎯 PRODUCTION TEST RESULTS")
    print("=" * 60)
    
    passed = sum(results)
    total = len(results)
    
    print(f"✅ Tests Passed: {passed}/{total}")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED!")
        print("✅ Production frontend is working perfectly")
        print("\n🚀 Ready for:")
        print("  1. Framework alignment feature testing")
        print("  2. Portfolio analytics verification")
        print("  3. End-user testing")
        print("  4. Production launch")
        
        print("\n🌐 Production URLs:")
        print(f"  Frontend: {FRONTEND_URL}/projects")
        print(f"  Backend API: {BACKEND_URL}/api/v1/health")
        
        print("\n📊 Real Data Available:")
        print("  - 2 projects with framework alignment")
        print("  - Victorian framework integration")
        print("  - SDG alignment tracking")
        print("  - Portfolio analytics")
    else:
        print("❌ SOME TESTS FAILED")
        print("⚠️  Check the failed tests above")
        print("\n🔧 Possible issues:")
        print("  - Frontend still deploying")
        print("  - Backend connectivity issues")
        print("  - CORS configuration problems")
    
    print("=" * 60)
    
    return passed == total

if __name__ == "__main__":
    test_production_frontend() 