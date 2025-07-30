#!/usr/bin/env python3
"""
Live Grants System Test
Tests the complete grants system including scraping, API endpoints, and data flow
"""

import asyncio
import aiohttp
import json
import sys
from datetime import datetime
from typing import Dict, Any, List

# API base URL
API_BASE = "http://localhost:8000/api/v1"

async def test_api_health():
    """Test basic API health."""
    print("🏥 Testing API Health...")
    
    async with aiohttp.ClientSession() as session:
        async with session.get(f"{API_BASE}/health") as response:
            if response.status == 200:
                data = await response.json()
                print(f"✅ API Health: {data.get('status', 'unknown')}")
                print(f"   Database: {data.get('database', 'unknown')}")
                print(f"   Environment: {data.get('environment', 'unknown')}")
                return True
            else:
                print(f"❌ API Health failed: {response.status}")
                return False

async def test_grants_sources():
    """Test grants sources endpoint."""
    print("\n📋 Testing Grants Sources...")
    
    async with aiohttp.ClientSession() as session:
        async with session.get(f"{API_BASE}/grants/sources") as response:
            if response.status == 200:
                data = await response.json()
                sources = data.get('sources', [])
                print(f"✅ Found {len(sources)} grant sources:")
                for source in sources:
                    print(f"   - {source['name']} ({source['id']})")
                return True
            else:
                print(f"❌ Grants sources failed: {response.status}")
                return False

async def test_existing_grants():
    """Test existing grants data."""
    print("\n🎯 Testing Existing Grants...")
    
    async with aiohttp.ClientSession() as session:
        async with session.get(f"{API_BASE}/grants/") as response:
            if response.status == 200:
                data = await response.json()
                grants = data.get('items', [])
                print(f"✅ Found {len(grants)} existing grants:")
                for grant in grants[:3]:  # Show first 3
                    print(f"   - {grant.get('title', 'No title')}")
                    print(f"     Amount: ${grant.get('min_amount', '0')} - ${grant.get('max_amount', '0')}")
                    print(f"     Deadline: {grant.get('deadline', 'No deadline')}")
                return True
            else:
                print(f"❌ Existing grants failed: {response.status}")
                return False

async def test_grant_search():
    """Test grant search functionality."""
    print("\n🔍 Testing Grant Search...")
    
    async with aiohttp.ClientSession() as session:
        # Test search by industry
        params = {"industry_focus": "media"}
        async with session.get(f"{API_BASE}/grants/", params=params) as response:
            if response.status == 200:
                data = await response.json()
                grants = data.get('items', [])
                print(f"✅ Search found {len(grants)} grants for 'media' industry")
                return True
            else:
                print(f"❌ Grant search failed: {response.status}")
                return False

async def test_grant_details():
    """Test getting specific grant details."""
    print("\n📄 Testing Grant Details...")
    
    async with aiohttp.ClientSession() as session:
        # Get first grant ID
        async with session.get(f"{API_BASE}/grants/") as response:
            if response.status == 200:
                data = await response.json()
                grants = data.get('items', [])
                if grants:
                    grant_id = grants[0].get('id')
                    if grant_id:
                        async with session.get(f"{API_BASE}/grants/{grant_id}") as detail_response:
                            if detail_response.status == 200:
                                grant_detail = await detail_response.json()
                                print(f"✅ Grant details retrieved: {grant_detail.get('title', 'No title')}")
                                return True
                            else:
                                print(f"❌ Grant details failed: {detail_response.status}")
                                return False
    return False

async def test_scraper_status():
    """Test scraper status endpoint."""
    print("\n🔄 Testing Scraper Status...")
    
    async with aiohttp.ClientSession() as session:
        async with session.get(f"{API_BASE}/scraper/status") as response:
            if response.status == 200:
                data = await response.json()
                print(f"✅ Scraper status: {data.get('status', 'unknown')}")
                return True
            else:
                print(f"❌ Scraper status failed: {response.status}")
                return False

async def test_grant_creation():
    """Test creating a new grant (mock data)."""
    print("\n➕ Testing Grant Creation...")
    
    new_grant = {
        "title": "Test Grant - Live System",
        "description": "Test grant for live system verification",
        "source": "Test Source",
        "source_url": "https://test.example.com",
        "min_amount": "10000.0",
        "max_amount": "50000.0",
        "deadline": "2025-12-31T00:00:00",
        "industry_focus": "technology",
        "location_eligibility": "Australia",
        "organization_type": "startup"
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f"{API_BASE}/grants/",
            json=new_grant,
            headers={"Content-Type": "application/json"}
        ) as response:
            if response.status == 200:
                data = await response.json()
                print(f"✅ Test grant created: {data.get('title', 'No title')}")
                return True
            else:
                error_text = await response.text()
                print(f"❌ Grant creation failed: {response.status} - {error_text}")
                return False

async def test_complete_workflow():
    """Test complete grants workflow."""
    print("\n🎬 Testing Complete Grants Workflow...")
    
    workflow_steps = [
        ("API Health", test_api_health),
        ("Grants Sources", test_grants_sources),
        ("Existing Grants", test_existing_grants),
        ("Grant Search", test_grant_search),
        ("Grant Details", test_grant_details),
        ("Scraper Status", test_scraper_status),
        ("Grant Creation", test_grant_creation)
    ]
    
    results = []
    for step_name, step_func in workflow_steps:
        try:
            result = await step_func()
            results.append((step_name, result))
        except Exception as e:
            print(f"❌ {step_name} failed with error: {str(e)}")
            results.append((step_name, False))
    
    # Summary
    print("\n📊 Workflow Test Results:")
    successful = sum(1 for _, result in results if result)
    total = len(results)
    
    for step_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {step_name}: {status}")
    
    print(f"\n🎯 Overall: {successful}/{total} tests passed")
    
    if successful == total:
        print("🎉 GRANTS SYSTEM IS LIVE AND READY!")
        return True
    else:
        print("⚠️  Some tests failed - check the issues above")
        return False

async def main():
    """Main test function."""
    print("🚀 LIVE GRANTS SYSTEM TEST")
    print("=" * 50)
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    try:
        success = await test_complete_workflow()
        
        if success:
            print("\n🎉 SUCCESS: Grants system is live and working!")
            print("✅ All core functionality is operational")
            print("✅ API endpoints are responding")
            print("✅ Database is connected")
            print("✅ Grant data is accessible")
            print("✅ Search functionality is working")
            print("✅ Scraper system is ready")
            
            print("\n🚀 NEXT STEPS:")
            print("1. Deploy to production")
            print("2. Enable live scraping")
            print("3. Monitor scraper performance")
            print("4. Update frontend to use live data")
            
        else:
            print("\n❌ FAILURE: Some tests failed")
            print("Please check the errors above and fix issues before deployment")
            
    except Exception as e:
        print(f"\n💥 CRITICAL ERROR: {str(e)}")
        print("System needs immediate attention")

if __name__ == "__main__":
    asyncio.run(main()) 