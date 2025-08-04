#!/usr/bin/env python3
"""
Comprehensive script to deploy backend and seed grants database
"""

import os
import sys
import requests
import json
import time
from datetime import datetime

# Render API URL
RENDER_API_URL = "https://shadow-goose-api.onrender.com"

# Additional grants to add
ADDITIONAL_GRANTS = [
    {
        "title": "Netflix Documentary Fund",
        "description": "Funding for documentary projects with global appeal and innovative storytelling approaches.",
        "source": "Netflix",
        "source_url": "https://netflix.com/funding",
        "min_amount": 100000,
        "max_amount": 500000,
        "deadline": "2025-03-15",
        "industry_focus": "media",
        "status": "open"
    },
    {
        "title": "ABC Pitch Initiative",
        "description": "Support for innovative television content with diverse representation and Australian stories.",
        "source": "ABC",
        "source_url": "https://abc.net.au/funding",
        "min_amount": 25000,
        "max_amount": 100000,
        "deadline": "2025-02-28",
        "industry_focus": "media",
        "status": "open"
    },
    {
        "title": "SBS Content Fund",
        "description": "Funding for multicultural content that reflects Australia's diverse communities.",
        "source": "SBS",
        "source_url": "https://sbs.com.au/funding",
        "min_amount": 15000,
        "max_amount": 75000,
        "deadline": "2025-04-30",
        "industry_focus": "media",
        "status": "open"
    },
    {
        "title": "Film Victoria Production",
        "description": "Support for Victorian film and television production with strong local content.",
        "source": "Film Victoria",
        "source_url": "https://film.vic.gov.au/funding",
        "min_amount": 50000,
        "max_amount": 200000,
        "deadline": "2025-05-15",
        "industry_focus": "media",
        "status": "open"
    },
    {
        "title": "YouTube Creator Fund",
        "description": "Funding for digital content creators with innovative storytelling and strong audience engagement.",
        "source": "YouTube",
        "source_url": "https://youtube.com/funding",
        "min_amount": 10000,
        "max_amount": 50000,
        "deadline": "2025-06-30",
        "industry_focus": "media",
        "status": "open"
    },
    {
        "title": "TikTok Creator Fund",
        "description": "Support for short-form video content with viral potential and cultural impact.",
        "source": "TikTok",
        "source_url": "https://tiktok.com/funding",
        "min_amount": 5000,
        "max_amount": 25000,
        "deadline": "2025-07-15",
        "industry_focus": "media",
        "status": "open"
    },
    {
        "title": "Instagram Creator Fund",
        "description": "Funding for visual storytelling and influencer content with authentic engagement.",
        "source": "Instagram",
        "source_url": "https://instagram.com/funding",
        "min_amount": 3000,
        "max_amount": 15000,
        "deadline": "2025-08-30",
        "industry_focus": "media",
        "status": "open"
    },
    {
        "title": "LinkedIn Creator Fund",
        "description": "Support for professional content creators with business and career focus.",
        "source": "LinkedIn",
        "source_url": "https://linkedin.com/funding",
        "min_amount": 2000,
        "max_amount": 10000,
        "deadline": "2025-09-15",
        "industry_focus": "media",
        "status": "open"
    }
]

def wait_for_deployment(max_wait=300):
    """Wait for the deployment to complete"""
    print("⏳ Waiting for deployment to complete...")
    start_time = time.time()
    
    while time.time() - start_time < max_wait:
        try:
            response = requests.get(f"{RENDER_API_URL}/health", timeout=5)
            if response.status_code == 200:
                print("✅ Deployment complete! API is responding.")
                return True
        except:
            pass
        
        print("⏳ Still waiting... (API not responding yet)")
        time.sleep(10)
    
    print("❌ Deployment timeout - API may still be deploying")
    return False

def check_api_health():
    """Check if the Render API is responding"""
    try:
        response = requests.get(f"{RENDER_API_URL}/health", timeout=10)
        if response.status_code == 200:
            print("✅ Render API is responding")
            return True
        else:
            print(f"❌ Render API returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Render API is not responding: {e}")
        return False

def get_current_grants():
    """Get current grants from Render API"""
    try:
        response = requests.get(f"{RENDER_API_URL}/api/v1/grants/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                return len(data)
            elif isinstance(data, dict):
                return data.get('total', 0)
            else:
                return 0
        else:
            print(f"❌ Failed to get grants: {response.status_code}")
            return 0
    except Exception as e:
        print(f"❌ Error getting grants: {e}")
        return 0

def add_grant(grant_data):
    """Add a single grant to the Render API"""
    try:
        response = requests.post(
            f"{RENDER_API_URL}/api/v1/grants/",
            json=grant_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        if response.status_code == 200:
            print(f"✅ Added: {grant_data['title']}")
            return True
        else:
            print(f"❌ Failed to add {grant_data['title']}: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error adding {grant_data['title']}: {e}")
        return False

def main():
    print("🚀 Deploying and Seeding Grants System")
    print("=" * 50)
    
    # Step 1: Wait for deployment
    if not wait_for_deployment():
        print("\n❌ Deployment may still be in progress. Please check Render dashboard.")
        return
    
    # Step 2: Check API health
    if not check_api_health():
        print("\n❌ Cannot proceed - Render API is not available")
        return
    
    # Step 3: Get current grant count
    current_count = get_current_grants()
    print(f"\n📊 Current grants in database: {current_count}")
    
    if current_count >= 11:
        print("✅ Database already has sufficient grants")
        return
    
    # Step 4: Add additional grants
    print(f"\n📝 Adding {len(ADDITIONAL_GRANTS)} additional grants...")
    success_count = 0
    
    for grant in ADDITIONAL_GRANTS:
        if add_grant(grant):
            success_count += 1
        time.sleep(1)  # Rate limiting
    
    # Step 5: Final check
    final_count = get_current_grants()
    print(f"\n📊 Final grant count: {final_count}")
    print(f"✅ Successfully added {success_count} grants")
    
    if final_count >= 11:
        print("🎉 Database seeding complete! Frontend should now show grants.")
        print("🌐 Check: https://shadow-goose-dashboard.onrender.com/grants/match/")
    else:
        print("⚠️  Some grants may not have been added successfully.")
        print("🔧 You may need to manually add grants through the API.")

if __name__ == "__main__":
    main() 