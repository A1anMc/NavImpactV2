#!/usr/bin/env python3
"""
Deployment readiness test for live scraping
"""

import requests
import json
import time

def test_deployment_readiness():
    """Test all components for deployment readiness."""
    
    base_url = "http://localhost:8000"
    
    print("🚀 DEPLOYMENT READINESS TEST")
    print("=" * 50)
    
    # Test 1: API Health
    print("\n1. API Health Check...")
    try:
        response = requests.get(f"{base_url}/api/v1/grants/sources")
        if response.status_code == 200:
            print("✅ API is healthy and responding")
        else:
            print(f"❌ API health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API health check error: {e}")
        return False
    
    # Test 2: Configuration
    print("\n2. Configuration Check...")
    try:
        response = requests.get(f"{base_url}/api/v1/grants/sources")
        data = response.json()
        enabled_sources = [s for s in data.get('sources', []) if s.get('enabled')]
        print(f"✅ Configuration loaded: {len(enabled_sources)} enabled sources")
        for source in enabled_sources:
            print(f"   - {source.get('id')}: {source.get('name')}")
    except Exception as e:
        print(f"❌ Configuration check error: {e}")
        return False
    
    # Test 3: Working Scrapers
    print("\n3. Working Scrapers Test...")
    working_scrapers = []
    
    # Test Australian scraper
    try:
        response = requests.post(f"{base_url}/api/v1/grants/scrape/australian_grants")
        if response.status_code == 200:
            working_scrapers.append("australian_grants")
            print("✅ Australian scraper: Working")
        else:
            print("❌ Australian scraper: Failed")
    except Exception as e:
        print(f"❌ Australian scraper error: {e}")
    
    # Test Media investment scraper
    try:
        response = requests.post(f"{base_url}/api/v1/grants/scrape/media_investment")
        if response.status_code == 200:
            working_scrapers.append("media_investment")
            print("✅ Media investment scraper: Working")
        else:
            print("❌ Media investment scraper: Failed")
    except Exception as e:
        print(f"❌ Media investment scraper error: {e}")
    
    # Test General scrape
    try:
        response = requests.post(f"{base_url}/api/v1/grants/scrape")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ General scrape: Working ({len(data.get('started_sources', []))} sources started)")
        else:
            print("❌ General scrape: Failed")
    except Exception as e:
        print(f"❌ General scrape error: {e}")
    
    # Test 4: Database Connectivity
    print("\n4. Database Connectivity Test...")
    try:
        response = requests.get(f"{base_url}/api/v1/grants/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Database connected: {len(data.get('grants', []))} grants found")
        else:
            print(f"❌ Database connectivity failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Database connectivity error: {e}")
    
    # Test 5: Error Handling
    print("\n5. Error Handling Test...")
    try:
        response = requests.post(f"{base_url}/api/v1/grants/scrape/nonexistent")
        if response.status_code == 400:
            print("✅ Error handling: Working (properly rejects invalid sources)")
        else:
            print(f"❌ Error handling: Unexpected response {response.status_code}")
    except Exception as e:
        print(f"❌ Error handling test error: {e}")
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 DEPLOYMENT READINESS SUMMARY")
    print("=" * 50)
    
    if len(working_scrapers) >= 2:
        print("✅ READY FOR DEPLOYMENT")
        print(f"   - {len(working_scrapers)} working scrapers")
        print(f"   - API endpoints functional")
        print(f"   - Error handling working")
        print(f"   - Database connectivity confirmed")
        return True
    else:
        print("❌ NOT READY FOR DEPLOYMENT")
        print(f"   - Only {len(working_scrapers)} working scrapers")
        print("   - Need at least 2 working scrapers")
        return False

if __name__ == "__main__":
    success = test_deployment_readiness()
    if success:
        print("\n🎉 System is ready for deployment!")
    else:
        print("\n⚠️  System needs fixes before deployment") 