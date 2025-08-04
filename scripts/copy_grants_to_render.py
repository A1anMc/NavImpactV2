#!/usr/bin/env python3
"""
Script to copy grants from local database to Render API
"""

import os
import sys
import requests
import json
import time
from datetime import datetime

# URLs
LOCAL_API_URL = "http://localhost:8000"
RENDER_API_URL = "https://shadow-goose-api.onrender.com"

def get_local_grants():
    """Get grants from local API"""
    try:
        response = requests.get(f"{LOCAL_API_URL}/api/v1/grants/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, dict) and 'items' in data:
                return data['items']
            elif isinstance(data, list):
                return data
            else:
                return []
        else:
            print(f"❌ Failed to get local grants: {response.status_code}")
            return []
    except Exception as e:
        print(f"❌ Error getting local grants: {e}")
        return []

def check_render_api():
    """Check if Render API is responding"""
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

def get_render_grants():
    """Get current grants from Render API"""
    try:
        response = requests.get(f"{RENDER_API_URL}/api/v1/grants/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, dict) and 'items' in data:
                return len(data['items'])
            elif isinstance(data, list):
                return len(data)
            else:
                return 0
        else:
            print(f"❌ Failed to get Render grants: {response.status_code}")
            return 0
    except Exception as e:
        print(f"❌ Error getting Render grants: {e}")
        return 0

def add_grant_to_render(grant_data):
    """Add a single grant to Render API"""
    try:
        # Remove fields that might cause issues
        grant_payload = {
            "title": grant_data.get("title"),
            "description": grant_data.get("description"),
            "source": grant_data.get("source"),
            "source_url": grant_data.get("source_url"),
            "application_url": grant_data.get("application_url"),
            "contact_email": grant_data.get("contact_email"),
            "min_amount": grant_data.get("min_amount"),
            "max_amount": grant_data.get("max_amount"),
            "deadline": grant_data.get("deadline"),
            "industry_focus": grant_data.get("industry_focus"),
            "location_eligibility": grant_data.get("location_eligibility"),
            "org_type_eligible": grant_data.get("org_type_eligible", []),
            "funding_purpose": grant_data.get("funding_purpose", []),
            "audience_tags": grant_data.get("audience_tags", []),
            "status": grant_data.get("status", "open"),
            "notes": grant_data.get("notes", "")
        }
        
        response = requests.post(
            f"{RENDER_API_URL}/api/v1/grants/",
            json=grant_payload,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        if response.status_code == 200:
            print(f"✅ Added: {grant_data.get('title', 'Unknown')}")
            return True
        else:
            print(f"❌ Failed to add {grant_data.get('title', 'Unknown')}: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error adding {grant_data.get('title', 'Unknown')}: {e}")
        return False

def main():
    print("🚀 Copying Grants from Local to Render")
    print("=" * 50)
    
    # Check Render API
    if not check_render_api():
        print("\n❌ Cannot proceed - Render API is not available")
        return
    
    # Get local grants
    print("\n📥 Getting grants from local API...")
    local_grants = get_local_grants()
    print(f"📊 Found {len(local_grants)} grants in local database")
    
    if not local_grants:
        print("❌ No grants found in local database")
        return
    
    # Check current Render grants
    render_count = get_render_grants()
    print(f"📊 Current grants in Render: {render_count}")
    
    if render_count >= len(local_grants):
        print("✅ Render already has sufficient grants")
        return
    
    # Add grants to Render
    print(f"\n📝 Adding {len(local_grants)} grants to Render...")
    success_count = 0
    
    for grant in local_grants:
        if add_grant_to_render(grant):
            success_count += 1
        time.sleep(1)  # Rate limiting
    
    # Final check
    final_count = get_render_grants()
    print(f"\n📊 Final grant count in Render: {final_count}")
    print(f"✅ Successfully added {success_count} grants")
    
    if final_count >= len(local_grants):
        print("🎉 Grants copied successfully! Frontend should now show grants.")
        print("🌐 Check: https://shadow-goose-dashboard.onrender.com/grants/match/")
    else:
        print("⚠️  Some grants may not have been added successfully.")

if __name__ == "__main__":
    main() 