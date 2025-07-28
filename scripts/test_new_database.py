#!/usr/bin/env python3
"""
Test the new database ID from the URL
"""

import requests
import json

# New database ID from the URL
NEW_DATABASE_ID = "224714ddbb9c8015889eecea68b8ab20"

# Notion credentials
NOTION_CONFIG = {
    "NOTION_API_TOKEN": "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",
    "NOTION_WORKSPACE_ID": "aed25e99-0cdf-4ca9-8529-e9b2689e2f79",
    "NOTION_PROJECTS_DATABASE_ID": NEW_DATABASE_ID,
}

def test_new_database():
    """Test the new database ID"""
    print("🧪 TESTING NEW DATABASE")
    print("=" * 50)
    print(f"Database ID: {NEW_DATABASE_ID}")
    
    headers = {
        "Authorization": f"Bearer {NOTION_CONFIG['NOTION_API_TOKEN']}",
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
    }
    
    # Test database access
    url = f"https://api.notion.com/v1/databases/{NEW_DATABASE_ID}"
    
    try:
        response = requests.get(url, headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ SUCCESS! Database found and accessible")
            data = response.json()
            title = data.get('title', [{}])[0].get('plain_text', 'Unknown')
            print(f"📊 Database Name: {title}")
            
            # Print properties
            properties = data.get('properties', {})
            print(f"📋 Database Properties:")
            for prop_name, prop_data in properties.items():
                prop_type = prop_data.get('type', 'unknown')
                print(f"  - {prop_name}: {prop_type}")
            
            return True
        else:
            print(f"❌ Failed: {response.status_code}")
            error_data = response.json()
            print(f"Error: {error_data.get('message', 'Unknown error')}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def create_sample_project():
    """Create a sample project in the database"""
    print("\n📝 CREATING SAMPLE PROJECT")
    print("=" * 50)
    
    headers = {
        "Authorization": f"Bearer {NOTION_CONFIG['NOTION_API_TOKEN']}",
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
    }
    
    # Sample project data
    sample_project = {
        "parent": {"database_id": NEW_DATABASE_ID},
        "properties": {
            "Name": {
                "title": [
                    {
                        "text": {
                            "content": "Wild Hearts - Documentary"
                        }
                    }
                ]
            }
        }
    }
    
    try:
        url = "https://api.notion.com/v1/pages"
        response = requests.post(url, headers=headers, json=sample_project)
        
        if response.status_code == 200:
            print("✅ Sample project created successfully!")
            print("📋 Check your Notion database for the new entry")
            return True
        else:
            print(f"❌ Failed to create sample data: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        return False

def print_environment_variables():
    """Print the updated environment variables"""
    print("\n🔧 UPDATED ENVIRONMENT VARIABLES")
    print("=" * 50)
    print("Add these to your Shadow Goose API environment variables on Render:")
    print()
    
    env_vars = {
        "NOTION_API_TOKEN": NOTION_CONFIG["NOTION_API_TOKEN"],
        "NOTION_WORKSPACE_ID": NOTION_CONFIG["NOTION_WORKSPACE_ID"],
        "NOTION_PROJECTS_DATABASE_ID": NEW_DATABASE_ID,
        "NOTION_TASKS_DATABASE_ID": NEW_DATABASE_ID,  # Using same for now
    }
    
    for key, value in env_vars.items():
        print(f"{key}={value}")
    
    print()
    print("📋 MANUAL SETUP INSTRUCTIONS:")
    print("1. Go to your Render dashboard")
    print("2. Select 'shadow-goose-api' service")
    print("3. Go to 'Environment' tab")
    print("4. Add each variable above")
    print("5. Click 'Save Changes'")
    print("6. Redeploy the service")

if __name__ == "__main__":
    print("🎬 TESTING NEW NOTION DATABASE")
    print("=" * 50)
    
    success = test_new_database()
    
    if success:
        create_sample_project()
        print_environment_variables()
        
        print("\n🎉 SETUP COMPLETE!")
        print("Your Notion integration is ready!")
        print("Add the environment variables to Render and redeploy.")
    else:
        print("\n❌ DATABASE NOT ACCESSIBLE")
        print("Please make sure to:")
        print("1. Share the database with your integration")
        print("2. Give the integration 'Can edit' permissions")
        print("3. Check that the database ID is correct") 