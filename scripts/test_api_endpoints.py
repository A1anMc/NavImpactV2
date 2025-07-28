#!/usr/bin/env python3
"""
Comprehensive API endpoint test script
"""

import requests
import json
import time

def test_api_endpoints():
    """Test all the API endpoints."""
    
    base_url = "http://localhost:8000"
    
    print("🔍 Testing Live Scraping API Endpoints")
    print("=" * 50)
    
    # Test 1: Sources endpoint
    print("\n1. Testing /sources endpoint...")
    try:
        response = requests.get(f"{base_url}/api/v1/grants/sources")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Sources endpoint working")
            print(f"   Available sources: {len(data.get('sources', []))}")
            for source in data.get('sources', []):
                status = "enabled" if source.get('enabled') else "disabled"
                print(f"   - {source.get('id')}: {status}")
        else:
            print(f"❌ Sources endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing sources: {e}")
    
    # Test 2: Australian scraper
    print("\n2. Testing Australian scraper...")
    try:
        response = requests.post(f"{base_url}/api/v1/grants/scrape/australian_grants")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Australian scraper working: {data.get('message')}")
        else:
            print(f"❌ Australian scraper failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing Australian scraper: {e}")
    
    # Test 3: Media investment scraper
    print("\n3. Testing Media investment scraper...")
    try:
        response = requests.post(f"{base_url}/api/v1/grants/scrape/media_investment")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Media investment scraper working: {data.get('message')}")
        else:
            print(f"❌ Media investment scraper failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing media investment scraper: {e}")
    
    # Test 4: Business.gov.au scraper
    print("\n4. Testing Business.gov.au scraper...")
    try:
        response = requests.post(f"{base_url}/api/v1/grants/scrape/business.gov.au")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Business.gov.au scraper working: {data.get('message')}")
        else:
            print(f"❌ Business.gov.au scraper failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Error testing business.gov.au scraper: {e}")
    
    # Test 5: General scrape endpoint
    print("\n5. Testing general scrape endpoint...")
    try:
        response = requests.post(f"{base_url}/api/v1/grants/scrape")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ General scrape working: {data.get('message')}")
            print(f"   Started sources: {data.get('started_sources', [])}")
        else:
            print(f"❌ General scrape failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing general scrape: {e}")
    
    # Test 6: Current grants
    print("\n6. Testing current grants endpoint...")
    try:
        response = requests.get(f"{base_url}/api/v1/grants/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Grants endpoint working: {len(data.get('grants', []))} grants found")
        else:
            print(f"❌ Grants endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing grants endpoint: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 API Endpoints Test Complete")
    print("=" * 50)

if __name__ == "__main__":
    test_api_endpoints() 