#!/usr/bin/env python3
"""
Safe test script for live scraping functionality
"""

import requests
import json
import time

def test_scraper_endpoints():
    """Test the scraper endpoints safely."""
    
    base_url = "https://sge-dashboard.onrender.com"  # Update with your actual URL
    
    print("🔍 Testing Live Scraping Endpoints")
    print("=" * 50)
    
    # Test 1: Get available sources
    print("\n1. Testing /sources endpoint...")
    try:
        response = requests.get(f"{base_url}/api/v1/grants/sources")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Sources endpoint working")
            print(f"   Available sources: {len(data.get('sources', []))}")
            for source in data.get('sources', []):
                print(f"   - {source.get('id')}: {source.get('name')} ({'enabled' if source.get('enabled') else 'disabled'})")
        else:
            print(f"❌ Sources endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing sources: {e}")
    
    # Test 2: Test specific scraper (business_gov is usually safe)
    print("\n2. Testing specific scraper (business_gov)...")
    try:
        response = requests.post(f"{base_url}/api/v1/grants/scrape/business_gov")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Business.gov scraper started: {data.get('message')}")
        else:
            print(f"❌ Business.gov scraper failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Error testing business.gov scraper: {e}")
    
    # Test 3: Check current grants
    print("\n3. Checking current grants...")
    try:
        response = requests.get(f"{base_url}/api/v1/grants/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Current grants: {len(data.get('grants', []))}")
        else:
            print(f"❌ Grants endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error checking grants: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 Live Scraping Test Complete")
    print("=" * 50)

if __name__ == "__main__":
    test_scraper_endpoints() 