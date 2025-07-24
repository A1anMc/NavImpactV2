#!/usr/bin/env python3
"""
Debug script to test news endpoint and identify the specific error
"""

import requests
import json

def test_news_endpoint():
    """Test the news endpoint and capture detailed error information"""
    
    print("🔍 Testing news endpoint for debugging...")
    
    # Test the basic news endpoint
    url = "https://navimpact-api.onrender.com/api/v1/news/?sectors=tech&limit=3"
    
    try:
        response = requests.get(url, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Found {len(data)} news items")
            for item in data:
                print(f"   - {item.get('sector', 'N/A')}: {item.get('title', 'N/A')}")
        else:
            print(f"❌ Error: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
    except json.JSONDecodeError as e:
        print(f"❌ JSON decode error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

def test_health_endpoint():
    """Test the health endpoint to compare"""
    
    print("\n🔍 Testing health endpoint for comparison...")
    
    url = "https://navimpact-api.onrender.com/health"
    
    try:
        response = requests.get(url, timeout=10)
        print(f"Health Status Code: {response.status_code}")
        print(f"Health Response: {response.text}")
        
    except Exception as e:
        print(f"❌ Health endpoint error: {e}")

def test_grants_endpoint():
    """Test the grants endpoint to compare"""
    
    print("\n🔍 Testing grants endpoint for comparison...")
    
    url = "https://navimpact-api.onrender.com/api/v1/grants/"
    
    try:
        response = requests.get(url, timeout=10)
        print(f"Grants Status Code: {response.status_code}")
        print(f"Grants Response: {response.text[:200]}...")
        
    except Exception as e:
        print(f"❌ Grants endpoint error: {e}")

if __name__ == "__main__":
    test_health_endpoint()
    test_grants_endpoint()
    test_news_endpoint() 