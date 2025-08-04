#!/usr/bin/env python3
"""
Proper script to seed Render database with grants matching the GrantCreate schema
"""

import os
import sys
import requests
import json
import time
from datetime import datetime
from decimal import Decimal

# Render API URL
RENDER_API_URL = "https://shadow-goose-api.onrender.com"

# Additional grants to add (matching GrantCreate schema)
ADDITIONAL_GRANTS = [
    {
        "title": "Netflix Documentary Fund",
        "description": "Funding for documentary projects with global appeal and innovative storytelling approaches.",
        "source": "Netflix",
        "source_url": "https://netflix.com/funding",
        "application_url": "https://netflix.com/apply",
        "contact_email": "funding@netflix.com",
        "min_amount": Decimal("100000"),
        "max_amount": Decimal("500000"),
        "deadline": datetime(2025, 3, 15),
        "industry_focus": "media",
        "location_eligibility": "international",
        "org_type_eligible": ["startup", "sme", "enterprise"],
        "funding_purpose": ["production", "development"],
        "audience_tags": ["global", "documentary"],
        "status": "open",
        "notes": "High-profile documentary funding opportunity"
    },
    {
        "title": "ABC Pitch Initiative",
        "description": "Support for innovative television content with diverse representation and Australian stories.",
        "source": "ABC",
        "source_url": "https://abc.net.au/funding",
        "application_url": "https://abc.net.au/apply",
        "contact_email": "pitch@abc.net.au",
        "min_amount": Decimal("25000"),
        "max_amount": Decimal("100000"),
        "deadline": datetime(2025, 2, 28),
        "industry_focus": "media",
        "location_eligibility": "national",
        "org_type_eligible": ["startup", "sme", "enterprise"],
        "funding_purpose": ["development", "production"],
        "audience_tags": ["australian", "television"],
        "status": "open",
        "notes": "Australian content development"
    },
    {
        "title": "SBS Content Fund",
        "description": "Funding for multicultural content that reflects Australia's diverse communities.",
        "source": "SBS",
        "source_url": "https://sbs.com.au/funding",
        "application_url": "https://sbs.com.au/apply",
        "contact_email": "content@sbs.com.au",
        "min_amount": Decimal("15000"),
        "max_amount": Decimal("75000"),
        "deadline": datetime(2025, 4, 30),
        "industry_focus": "media",
        "location_eligibility": "national",
        "org_type_eligible": ["startup", "sme", "enterprise"],
        "funding_purpose": ["production", "development"],
        "audience_tags": ["multicultural", "diversity"],
        "status": "open",
        "notes": "Multicultural content focus"
    },
    {
        "title": "Film Victoria Production",
        "description": "Support for Victorian film and television production with strong local content.",
        "source": "Film Victoria",
        "source_url": "https://film.vic.gov.au/funding",
        "application_url": "https://film.vic.gov.au/apply",
        "contact_email": "funding@film.vic.gov.au",
        "min_amount": Decimal("50000"),
        "max_amount": Decimal("200000"),
        "deadline": datetime(2025, 5, 15),
        "industry_focus": "media",
        "location_eligibility": "victoria",
        "org_type_eligible": ["startup", "sme", "enterprise"],
        "funding_purpose": ["production", "development"],
        "audience_tags": ["victorian", "local"],
        "status": "open",
        "notes": "Victorian production support"
    },
    {
        "title": "YouTube Creator Fund",
        "description": "Funding for digital content creators with innovative storytelling and strong audience engagement.",
        "source": "YouTube",
        "source_url": "https://youtube.com/funding",
        "application_url": "https://youtube.com/apply",
        "contact_email": "creator@youtube.com",
        "min_amount": Decimal("10000"),
        "max_amount": Decimal("50000"),
        "deadline": datetime(2025, 6, 30),
        "industry_focus": "media",
        "location_eligibility": "international",
        "org_type_eligible": ["startup", "sme", "enterprise"],
        "funding_purpose": ["production", "development"],
        "audience_tags": ["digital", "creator"],
        "status": "open",
        "notes": "Digital content creation"
    },
    {
        "title": "TikTok Creator Fund",
        "description": "Support for short-form video content with viral potential and cultural impact.",
        "source": "TikTok",
        "source_url": "https://tiktok.com/funding",
        "application_url": "https://tiktok.com/apply",
        "contact_email": "creator@tiktok.com",
        "min_amount": Decimal("5000"),
        "max_amount": Decimal("25000"),
        "deadline": datetime(2025, 7, 15),
        "industry_focus": "media",
        "location_eligibility": "international",
        "org_type_eligible": ["startup", "sme", "enterprise"],
        "funding_purpose": ["production", "development"],
        "audience_tags": ["short-form", "viral"],
        "status": "open",
        "notes": "Short-form video content"
    },
    {
        "title": "Instagram Creator Fund",
        "description": "Funding for visual storytelling and influencer content with authentic engagement.",
        "source": "Instagram",
        "source_url": "https://instagram.com/funding",
        "application_url": "https://instagram.com/apply",
        "contact_email": "creator@instagram.com",
        "min_amount": Decimal("3000"),
        "max_amount": Decimal("15000"),
        "deadline": datetime(2025, 8, 30),
        "industry_focus": "media",
        "location_eligibility": "international",
        "org_type_eligible": ["startup", "sme", "enterprise"],
        "funding_purpose": ["production", "development"],
        "audience_tags": ["visual", "influencer"],
        "status": "open",
        "notes": "Visual storytelling focus"
    },
    {
        "title": "LinkedIn Creator Fund",
        "description": "Support for professional content creators with business and career focus.",
        "source": "LinkedIn",
        "source_url": "https://linkedin.com/funding",
        "application_url": "https://linkedin.com/apply",
        "contact_email": "creator@linkedin.com",
        "min_amount": Decimal("2000"),
        "max_amount": Decimal("10000"),
        "deadline": datetime(2025, 9, 15),
        "industry_focus": "media",
        "location_eligibility": "international",
        "org_type_eligible": ["startup", "sme", "enterprise"],
        "funding_purpose": ["production", "development"],
        "audience_tags": ["professional", "business"],
        "status": "open",
        "notes": "Professional content creation"
    }
]

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
        # Convert datetime and Decimal objects to strings for JSON serialization
        grant_payload = grant_data.copy()
        if grant_payload.get('deadline'):
            grant_payload['deadline'] = grant_payload['deadline'].isoformat()
        if grant_payload.get('min_amount'):
            grant_payload['min_amount'] = str(grant_payload['min_amount'])
        if grant_payload.get('max_amount'):
            grant_payload['max_amount'] = str(grant_payload['max_amount'])
        
        response = requests.post(
            f"{RENDER_API_URL}/api/v1/grants/",
            json=grant_payload,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        if response.status_code == 200:
            print(f"✅ Added: {grant_data['title']}")
            return True
        else:
            print(f"❌ Failed to add {grant_data['title']}: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error adding {grant_data['title']}: {e}")
        return False

def main():
    print("🚀 Seeding Render Database with Proper Grant Schema")
    print("=" * 50)
    
    # Check API health
    if not check_api_health():
        print("\n❌ Cannot proceed - Render API is not available")
        return
    
    # Get current grant count
    current_count = get_current_grants()
    print(f"\n📊 Current grants in database: {current_count}")
    
    if current_count >= 11:
        print("✅ Database already has sufficient grants")
        return
    
    # Add additional grants
    print(f"\n📝 Adding {len(ADDITIONAL_GRANTS)} additional grants...")
    success_count = 0
    
    for grant in ADDITIONAL_GRANTS:
        if add_grant(grant):
            success_count += 1
        time.sleep(1)  # Rate limiting
    
    # Final check
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