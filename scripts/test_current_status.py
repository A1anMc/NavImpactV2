#!/usr/bin/env python3
"""
Comprehensive status check for NavImpact system.
"""

import requests
import json
import sys
from datetime import datetime

API_BASE = "https://navimpact-api.onrender.com/api/v1"

def test_health_endpoint():
    """Test the health endpoint."""
    print("🔍 Testing Health Endpoint...")
    try:
        response = requests.get(f"{API_BASE}/health/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health: {data.get('status', 'unknown')}")
            print(f"   Database: {data.get('database', 'unknown')}")
            print(f"   Environment: {data.get('environment', 'unknown')}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {str(e)}")
        return False

def test_user_profile_health():
    """Test and trigger user profile health check."""
    print("\n🔍 Testing User Profile Health Check...")
    try:
        response = requests.get(f"{API_BASE}/users/user-profile-health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ User Profile Health: {data.get('status', 'unknown')}")
            print(f"   Message: {data.get('message', 'No message')}")
            print(f"   Columns: {len(data.get('columns', []))} columns found")
            return data.get('status') == 'healthy'
        else:
            print(f"❌ User profile health check failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ User profile health check error: {str(e)}")
        return False

def test_user_endpoints():
    """Test user-related endpoints."""
    print("\n🔍 Testing User Endpoints...")
    
    # Test endpoints that should exist
    endpoints = [
        ("GET", "/users/profile"),
        ("GET", "/users/team"),
        ("GET", "/users/sge-team"),
        ("GET", "/users/interns"),
        ("POST", "/users/setup-sge-team"),  # Our SGE team endpoint
        ("POST", "/users/create-ursula"),   # Single user test endpoint
    ]
    
    for method, endpoint in endpoints:
        try:
            url = f"{API_BASE}{endpoint}"
            if method == "GET":
                response = requests.get(url)
            else:
                response = requests.post(url)
            
            if response.status_code == 401:
                print(f"✅ {method} {endpoint}: Authentication required (expected)")
            elif response.status_code == 200:
                print(f"✅ {method} {endpoint}: Success")
                if method == "POST":
                    print(f"   Response: {response.json()}")
            elif response.status_code == 404:
                print(f"❌ {method} {endpoint}: Not Found")
            else:
                print(f"⚠️  {method} {endpoint}: {response.status_code}")
                if method == "POST":
                    print(f"   Response: {response.text}")
                
        except Exception as e:
            print(f"❌ {method} {endpoint}: Error - {str(e)}")

def test_openapi_spec():
    """Test OpenAPI specification."""
    print("\n🔍 Testing OpenAPI Specification...")
    try:
        response = requests.get("https://navimpact-api.onrender.com/openapi.json")
        if response.status_code == 200:
            spec = response.json()
            paths = spec.get('paths', {})
            
            # Check for user endpoints
            user_paths = [path for path in paths.keys() if path.startswith('/api/v1/users/')]
            print(f"✅ Found {len(user_paths)} user endpoints:")
            
            for path in sorted(user_paths):
                methods = list(paths[path].keys())
                print(f"   {path}: {', '.join(methods)}")
            
            # Check specifically for create-sge-team
            create_sge_team_path = '/api/v1/users/create-sge-team'
            if create_sge_team_path in paths:
                print(f"✅ {create_sge_team_path} endpoint found in OpenAPI spec")
            else:
                print(f"❌ {create_sge_team_path} endpoint NOT found in OpenAPI spec")
                
        else:
            print(f"❌ Failed to get OpenAPI spec: {response.status_code}")
            
    except Exception as e:
        print(f"❌ OpenAPI spec error: {str(e)}")

def test_database_schema():
    """Test database schema via health endpoint."""
    print("\n🔍 Testing Database Schema...")
    try:
        response = requests.get(f"{API_BASE}/health/")
        if response.status_code == 200:
            data = response.json()
            if data.get('database') == 'connected':
                print("✅ Database connection: Connected")
                
                # Try to get SGE team to see if user profile fields exist
                response = requests.get(f"{API_BASE}/users/sge-team")
                if response.status_code == 401:
                    print("✅ User profile fields: Present (authentication required)")
                elif response.status_code == 500:
                    print("❌ User profile fields: Error (might be missing)")
                else:
                    print(f"⚠️  User profile fields: {response.status_code}")
            else:
                print(f"❌ Database connection: {data.get('database', 'unknown')}")
        else:
            print("❌ Cannot check database schema")
            
    except Exception as e:
        print(f"❌ Database schema check error: {str(e)}")

def main():
    """Main function."""
    print("🚀 NavImpact System Status Check")
    print("=" * 50)
    print(f"Timestamp: {datetime.now().isoformat()}")
    print(f"API Base: {API_BASE}")
    
    # Run all tests
    health_ok = test_health_endpoint()
    test_user_profile_health() # Added this line
    test_user_endpoints()
    test_openapi_spec()
    test_database_schema()
    
    print("\n" + "=" * 50)
    if health_ok:
        print("✅ System is running")
    else:
        print("❌ System has issues")
    
    print("\n📋 Summary:")
    print("• If create-sge-team endpoint is missing, the deployment may not have updated")
    print("• If user profile fields are missing, the migration may not have run")
    print("• All endpoints should require authentication (401 status)")

if __name__ == "__main__":
    main() 