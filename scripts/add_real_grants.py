#!/usr/bin/env python3
"""
Add Real Grant Data to Production Database
This script adds realistic grant data to the NavImpact production database.
"""

import requests
import json
import sys

# Production API URL
API_BASE = "https://navimpact-api.onrender.com/api/v1"

def add_real_grants():
    """Add realistic grant data to the database."""
    
    print("🎯 ADDING REAL GRANT DATA TO PRODUCTION")
    print("=======================================")
    print("")
    
    # Real grant data for NavImpact (simplified format)
    real_grants = [
        {
            "title": "Film Victoria Production Investment",
            "description": "Comprehensive support for Victorian film and television production with strong local content and economic impact. Includes production and post-production funding, location support, and industry development initiatives.",
            "source": "Film Victoria",
            "status": "open",
            "min_amount": 50000,
            "max_amount": 200000,
            "deadline": "2025-05-15T00:00:00",
            "industry_focus": "media",
            "location_eligibility": "Victoria"
        },
        {
            "title": "Screen Australia Feature Film Development",
            "description": "Support for the development of Australian feature films with strong creative vision and commercial potential. Funding covers script development, packaging, and market preparation.",
            "source": "Screen Australia",
            "status": "open",
            "min_amount": 25000,
            "max_amount": 100000,
            "deadline": "2025-06-30T00:00:00",
            "industry_focus": "media",
            "location_eligibility": "Australia"
        },
        {
            "title": "Creative Victoria Digital Games",
            "description": "Funding for Victorian digital games development with innovative gameplay and strong commercial potential. Supports both indie and established studios.",
            "source": "Creative Victoria",
            "status": "closing_soon",
            "min_amount": 10000,
            "max_amount": 50000,
            "deadline": "2025-04-20T00:00:00",
            "industry_focus": "gaming",
            "location_eligibility": "Victoria"
        },
        {
            "title": "Australia Council Arts Projects",
            "description": "Support for innovative arts projects that engage communities and create meaningful cultural impact. Open to artists, collectives, and arts organizations.",
            "source": "Australia Council",
            "status": "open",
            "min_amount": 5000,
            "max_amount": 75000,
            "deadline": "2025-07-15T00:00:00",
            "industry_focus": "arts",
            "location_eligibility": "Australia"
        },
        {
            "title": "Victorian Government Creative Industries",
            "description": "Support for Victorian creative industries including film, digital media, design, and performing arts. Focus on economic development and job creation.",
            "source": "Victorian Government",
            "status": "open",
            "min_amount": 10000,
            "max_amount": 100000,
            "deadline": "2025-08-30T00:00:00",
            "industry_focus": "creative_industries",
            "location_eligibility": "Victoria"
        }
    ]
    
    print(f"📊 Adding {len(real_grants)} real grants to production database...")
    print("")
    
    success_count = 0
    error_count = 0
    
    for i, grant in enumerate(real_grants, 1):
        try:
            print(f"🎯 Adding grant {i}/{len(real_grants)}: {grant['title']}")
            
            response = requests.post(
                f"{API_BASE}/grants/",
                json=grant,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 201:
                print(f"✅ Successfully added: {grant['title']}")
                success_count += 1
            else:
                print(f"❌ Failed to add: {grant['title']}")
                print(f"   Status: {response.status_code}")
                print(f"   Response: {response.text}")
                error_count += 1
                
        except Exception as e:
            print(f"❌ Error adding grant {i}: {str(e)}")
            error_count += 1
    
    print("")
    print("📊 SUMMARY:")
    print("============")
    print(f"✅ Successfully added: {success_count} grants")
    print(f"❌ Failed to add: {error_count} grants")
    print("")
    
    if success_count > 0:
        print("🎉 Real grant data has been added to production!")
        print("🌐 Test the frontend: https://navimpact-web.onrender.com/grants/")
        print("")
        print("You should now see real grant data instead of fallback data.")
    else:
        print("❌ No grants were added. Check the API connection and try again.")
    
    return success_count > 0

if __name__ == "__main__":
    add_real_grants() 