#!/usr/bin/env python3
"""
AI Bot Testing Script
Tests all AI bot endpoints and functionality
"""

import asyncio
import aiohttp
import json
from datetime import datetime

async def test_ai_endpoints():
    """Test all AI bot endpoints"""
    print("🤖 AI BOT TESTING STARTED")
    print("=" * 50)
    
    async with aiohttp.ClientSession() as session:
        base_url = "http://localhost:8000"
        
        # Test 1: AI Bot Test Endpoint
        print("\n1️⃣ Testing AI Bot Test Endpoint...")
        try:
            async with session.get(f'{base_url}/ai-grants/test') as response:
                if response.status == 200:
                    data = await response.json()
                    print("✅ AI Bot Test Endpoint Working")
                    print(f"📊 Sample Grant: {data['sample_grant']['title']}")
                    print(f"🤖 AI Capabilities: {len(data['ai_capabilities'])} features")
                    print(f"📡 Data Sources: {len(data['data_sources'])} sources")
                else:
                    print(f"❌ AI Bot Test Failed: {response.status}")
        except Exception as e:
            print(f"❌ AI Bot Test Error: {e}")
        
        # Test 2: AI Bot Status Endpoint
        print("\n2️⃣ Testing AI Bot Status Endpoint...")
        try:
            async with session.get(f'{base_url}/ai-grants/status') as response:
                if response.status == 200:
                    data = await response.json()
                    print("✅ AI Bot Status Endpoint Working")
                    print(f"🤖 Status: {data['status']}")
                    print(f"📊 Sources Monitored: {data['sources_monitored']}")
                    print(f"🔍 Discovery Method: {data['discovery_method']}")
                    print(f"⚡ Rate Limiting: {data['rate_limiting']}")
                    print(f"📈 Data Quality: {data['data_quality']}")
                    print(f"🧠 AI Features: {len(data['ai_features'])} capabilities")
                else:
                    print(f"❌ AI Bot Status Failed: {response.status}")
        except Exception as e:
            print(f"❌ AI Bot Status Error: {e}")
        
        # Test 3: AI Bot Sources Endpoint
        print("\n3️⃣ Testing AI Bot Sources Endpoint...")
        try:
            async with session.get(f'{base_url}/ai-grants/sources') as response:
                if response.status == 200:
                    data = await response.json()
                    print("✅ AI Bot Sources Endpoint Working")
                    print(f"📡 Sources: {len(data)} sources")
                    for source in data:
                        print(f"   - {source['name']}: {source['description']} ({source['status']})")
                else:
                    print(f"❌ AI Bot Sources Failed: {response.status}")
        except Exception as e:
            print(f"❌ AI Bot Sources Error: {e}")
        
        # Test 4: AI Bot Insights Endpoint
        print("\n4️⃣ Testing AI Bot Insights Endpoint...")
        try:
            async with session.get(f'{base_url}/ai-grants/insights') as response:
                if response.status == 200:
                    data = await response.json()
                    print("✅ AI Bot Insights Endpoint Working")
                    print(f"📊 Total Opportunities: {data['total_opportunities']}")
                    print(f"🏷️ Top Categories: {len(data['top_categories'])} categories")
                    print(f"🎯 Success Factors: {len(data['success_factors'])} factors")
                    print(f"💡 AI Recommendations: {len(data['ai_recommendations'])} recommendations")
                    print(f"📈 Trends: {len(data['trends'])} trends")
                else:
                    print(f"❌ AI Bot Insights Failed: {response.status}")
        except Exception as e:
            print(f"❌ AI Bot Insights Error: {e}")
        
        # Test 5: AI Bot Discover Endpoint
        print("\n5️⃣ Testing AI Bot Discover Endpoint...")
        try:
            async with session.get(f'{base_url}/ai-grants/discover') as response:
                if response.status == 200:
                    data = await response.json()
                    print("✅ AI Bot Discover Endpoint Working")
                    print(f"🎯 Discovered Grants: {len(data)} grants")
                    if data:
                        print(f"📊 First Grant: {data[0]['title']}")
                        print(f"🤖 Success Probability: {data[0]['success_probability']}")
                        print(f"📈 Match Score: {data[0]['match_score']}%")
                else:
                    print(f"❌ AI Bot Discover Failed: {response.status}")
        except Exception as e:
            print(f"❌ AI Bot Discover Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 AI BOT TESTING COMPLETED")
    print(f"⏰ Test completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    asyncio.run(test_ai_endpoints()) 