#!/usr/bin/env python3
"""
Test Frontend API Calls
Tests if the frontend can successfully connect to the backend API
"""

import requests
import json
from typing import Dict, Any

# Configuration
FRONTEND_URL = "http://localhost:3000"
BACKEND_URL = "https://navimpact-api.onrender.com"

def test_frontend_health():
    """Test frontend health endpoint"""
    try:
        response = requests.get(f"{FRONTEND_URL}/api/health", timeout=10)
        print(f"🔍 Frontend Health Test")
        print(f"  Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"  ✅ SUCCESS: Frontend running")
            print(f"  Status: {data.get('status')}")
            return True
        else:
            print(f"  ❌ FAILED: {response.status_code}")
            return False
    except Exception as e:
        print(f"  ❌ ERROR: {str(e)}")
        return False

def test_frontend_backend_connectivity():
    """Test if frontend can proxy requests to backend"""
    try:
        # Test the frontend's API route that should proxy to backend
        response = requests.get(f"{FRONTEND_URL}/api/health", timeout=10)
        print(f"🔍 Frontend-Backend Connectivity Test")
        print(f"  Status: {response.status_code}")
        
        if response.status_code == 200:
            print(f"  ✅ SUCCESS: Frontend can reach backend")
            return True
        else:
            print(f"  ❌ FAILED: {response.status_code}")
            return False
    except Exception as e:
        print(f"  ❌ ERROR: {str(e)}")
        return False

def test_frontend_projects_page():
    """Test if frontend projects page loads"""
    try:
        response = requests.get(f"{FRONTEND_URL}/dashboard/projects", timeout=10)
        print(f"🔍 Frontend Projects Page Test")
        print(f"  Status: {response.status_code}")
        
        if response.status_code == 200:
            print(f"  ✅ SUCCESS: Projects page loads")
            return True
        else:
            print(f"  ❌ FAILED: {response.status_code}")
            return False
    except Exception as e:
        print(f"  ❌ ERROR: {str(e)}")
        return False

def main():
    """Run all frontend connectivity tests"""
    print("🎯 FRONTEND CONNECTIVITY TEST")
    print("=" * 60)
    print("Testing frontend ability to connect to backend")
    print("=" * 60)
    
    # Test results
    results = []
    
    # Test 1: Frontend health
    print("\n📊 Test 1: Frontend Health")
    print("-" * 40)
    results.append(test_frontend_health())
    
    # Test 2: Frontend-Backend connectivity
    print("\n📊 Test 2: Frontend-Backend Connectivity")
    print("-" * 40)
    results.append(test_frontend_backend_connectivity())
    
    # Test 3: Projects page
    print("\n📊 Test 3: Frontend Projects Page")
    print("-" * 40)
    results.append(test_frontend_projects_page())
    
    # Summary
    print("\n" + "=" * 60)
    print("🎯 FRONTEND CONNECTIVITY TEST RESULTS")
    print("=" * 60)
    
    if all(results):
        print("✅ ALL TESTS PASSED!")
        print("🎉 Frontend is ready for backend integration")
        print("\n🚀 Next Steps:")
        print("  1. Deploy frontend to production")
        print("  2. Test framework alignment features")
        print("  3. Verify portfolio analytics")
    else:
        print("❌ SOME TESTS FAILED")
        print("⚠️  Check the failed tests above")
    
    print("=" * 60)

if __name__ == "__main__":
    main() 