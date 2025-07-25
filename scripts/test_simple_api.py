#!/usr/bin/env python3
"""
Simple API test script to diagnose the backend issue
"""

import requests
import json
import sys

def test_endpoint(url, name):
    """Test a single endpoint and return detailed results"""
    try:
        print(f"Testing {name}...")
        response = requests.get(url, timeout=10)
        print(f"  Status: {response.status_code}")
        print(f"  Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"  Response: {json.dumps(data, indent=2)}")
                return True
            except json.JSONDecodeError:
                print(f"  Response (text): {response.text[:200]}...")
                return True
        else:
            print(f"  Error Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"  Request Error: {e}")
        return False
    except Exception as e:
        print(f"  Unexpected Error: {e}")
        return False

def main():
    base_url = "https://navimpact-api.onrender.com"
    
    print("🔍 Simple API Diagnostic Test")
    print("=" * 50)
    
    # Test health endpoint
    test_endpoint(f"{base_url}/health", "Health Endpoint")
    print()
    
    # Test database connection
    test_endpoint(f"{base_url}/api/v1/projects/test", "Database Connection Test")
    print()
    
    # Test projects endpoint
    test_endpoint(f"{base_url}/api/v1/projects/", "Projects Endpoint")
    print()
    
    # Test with different query parameters
    test_endpoint(f"{base_url}/api/v1/projects/?limit=1", "Projects with Limit")
    print()
    
    # Test portfolio summary
    test_endpoint(f"{base_url}/api/v1/projects/portfolio-summary/", "Portfolio Summary")
    print()

if __name__ == "__main__":
    main() 