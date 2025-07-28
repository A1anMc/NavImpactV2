#!/usr/bin/env python3
"""
Verify Notion Setup and Test Database Access
"""

import requests
import json

# Notion credentials
NOTION_CONFIG = {
    "NOTION_API_TOKEN": "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",
    "NOTION_WORKSPACE_ID": "aed25e99-0cdf-4ca9-8529-e9b2689e2f79",
    "NOTION_PROJECTS_DATABASE_ID": "224714ddbb9c80b59021f7557f9fffa2",
}

def test_database_access():
    """Test different database ID formats"""
    headers = {
        "Authorization": f"Bearer {NOTION_CONFIG['NOTION_API_TOKEN']}",
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
    }
    
    # Test different database ID formats
    database_ids = [
        "224714ddbb9c80b59021f7557f9fffa2",  # Original
        "224714dd-bb9c-80b5-9021-f7557f9fffa2",  # With hyphens
        "224714dd-bb9c-80b5-9021-f7557f9fffa2",  # Proper UUID format
    ]
    
    print("🧪 TESTING DATABASE ACCESS")
    print("=" * 50)
    
    for i, db_id in enumerate(database_ids, 1):
        print(f"\nTest {i}: Database ID: {db_id}")
        
        url = f"https://api.notion.com/v1/databases/{db_id}"
        
        try:
            response = requests.get(url, headers=headers)
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                print("✅ SUCCESS! Database found and accessible")
                data = response.json()
                title = data.get('title', [{}])[0].get('plain_text', 'Unknown')
                print(f"📊 Database Name: {title}")
                return db_id
            else:
                print(f"❌ Failed: {response.status_code}")
                error_data = response.json()
                print(f"Error: {error_data.get('message', 'Unknown error')}")
                
        except Exception as e:
            print(f"❌ Error: {e}")
    
    return None

def list_accessible_databases():
    """List all databases accessible to the integration"""
    print("\n📋 LISTING ACCESSIBLE DATABASES")
    print("=" * 50)
    
    headers = {
        "Authorization": f"Bearer {NOTION_CONFIG['NOTION_API_TOKEN']}",
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
    }
    
    url = "https://api.notion.com/v1/search"
    payload = {
        "filter": {
            "value": "database",
            "property": "object"
        }
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code == 200:
            data = response.json()
            databases = data.get('results', [])
            
            if databases:
                print(f"✅ Found {len(databases)} accessible databases:")
                for db in databases:
                    db_id = db.get('id', 'Unknown')
                    title = db.get('title', [{}])[0].get('plain_text', 'Untitled')
                    print(f"📊 {title} (ID: {db_id})")
            else:
                print("❌ No databases found. Make sure to share databases with your integration.")
        else:
            print(f"❌ Failed to list databases: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error listing databases: {e}")

def test_integration_permissions():
    """Test if the integration has proper permissions"""
    print("\n🔐 TESTING INTEGRATION PERMISSIONS")
    print("=" * 50)
    
    headers = {
        "Authorization": f"Bearer {NOTION_CONFIG['NOTION_API_TOKEN']}",
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
    }
    
    # Test basic API access
    url = "https://api.notion.com/v1/users/me"
    
    try:
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            print("✅ Integration token is valid")
            data = response.json()
            print(f"👤 Integration Name: {data.get('name', 'Unknown')}")
            print(f"🆔 Integration ID: {data.get('id', 'Unknown')}")
        else:
            print(f"❌ Integration token invalid: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error testing integration: {e}")

if __name__ == "__main__":
    print("🎬 NOTION SETUP VERIFICATION")
    print("=" * 50)
    
    test_integration_permissions()
    list_accessible_databases()
    working_db_id = test_database_access()
    
    if working_db_id:
        print(f"\n✅ WORKING DATABASE ID: {working_db_id}")
        print("Use this ID in your environment variables!")
    else:
        print("\n❌ No working database ID found.")
        print("Please make sure to:")
        print("1. Share your database with the integration")
        print("2. Give the integration 'Can edit' permissions")
        print("3. Check that the database ID is correct") 