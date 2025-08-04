#!/usr/bin/env python3
"""
Test Deployment Script
Checks if the real data environment variables are working
"""

import requests
import json
import time

def test_api_endpoints():
    """Test various API endpoints to check deployment status."""
    
    base_url = "https://shadow-goose-api.onrender.com"
    
    print("=" * 60)
    print("🧪 TESTING DEPLOYMENT STATUS")
    print("=" * 60)
    
    # Test 1: Health check
    print("\n1. Testing Health Check...")
    try:
        response = requests.get(f"{base_url}/health", timeout=10)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Message: {data.get('message', 'No message')}")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test 2: Instagram endpoints
    print("\n2. Testing Instagram Endpoints...")
    instagram_endpoints = [
        "/api/v1/instagram/account",
        "/api/v1/instagram/followers", 
        "/api/v1/instagram/metrics",
        "/api/v1/social-media/status"
    ]
    
    for endpoint in instagram_endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=10)
            print(f"   {endpoint}: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"     Data: {json.dumps(data, indent=2)[:200]}...")
            elif response.status_code == 503:
                print(f"     Service Unavailable - Environment variables may not be configured")
            elif response.status_code == 404:
                print(f"     Not Found - Endpoint may not exist")
        except Exception as e:
            print(f"   {endpoint}: Error - {e}")
    
    # Test 3: Google Analytics endpoints
    print("\n3. Testing Google Analytics Endpoints...")
    ga_endpoints = [
        "/api/v1/analytics/ga/users",
        "/api/v1/analytics/ga/sessions",
        "/api/v1/analytics/ga/pageviews"
    ]
    
    for endpoint in ga_endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=10)
            print(f"   {endpoint}: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"     Data: {json.dumps(data, indent=2)[:200]}...")
            elif response.status_code == 503:
                print(f"     Service Unavailable - Environment variables may not be configured")
            elif response.status_code == 404:
                print(f"     Not Found - Endpoint may not exist")
        except Exception as e:
            print(f"   {endpoint}: Error - {e}")
    
    print("\n" + "=" * 60)
    print("📊 DEPLOYMENT ANALYSIS")
    print("=" * 60)
    print("\nIf you see 'Service Unavailable' errors:")
    print("✅ Environment variables are being read")
    print("❌ API credentials may need to be verified")
    print("\nIf you see 'Not Found' errors:")
    print("❌ Endpoints may not be implemented yet")
    print("\nIf you see successful responses:")
    print("✅ Real data is working!")

if __name__ == "__main__":
    test_api_endpoints() 