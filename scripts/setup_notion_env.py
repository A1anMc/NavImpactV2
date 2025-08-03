#!/usr/bin/env python3
"""
Notion Environment Variables Setup Script
Adds Notion integration credentials to Render environment variables
"""

import os
import requests
import json

# Notion credentials
NOTION_CONFIG = {
    "NOTION_API_TOKEN": "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",
    "NOTION_WORKSPACE_ID": "aed25e99-0cdf-4ca9-8529-e9b2689e2f79",
    "NOTION_PROJECTS_DATABASE_ID": "224714ddbb9c80b59021f7557f9fffa2",
    "NOTION_TASKS_DATABASE_ID": "224714ddbb9c80b59021f7557f9fffa2",  # Using same for now
}

def print_environment_variables():
    """Print the environment variables to add to Render"""
    print("🔧 NOTION ENVIRONMENT VARIABLES")
    print("=" * 50)
    print("Add these to your Shadow Goose API environment variables on Render:")
    print()
    
    for key, value in NOTION_CONFIG.items():
        print(f"{key}={value}")
    
    print()
    print("📋 MANUAL SETUP INSTRUCTIONS:")
    print("1. Go to your Render dashboard")
    print("2. Select 'shadow-goose-api' service")
    print("3. Go to 'Environment' tab")
    print("4. Add each variable above")
    print("5. Click 'Save Changes'")
    print("6. Redeploy the service")

def test_notion_connection():
    """Test the Notion API connection"""
    print("\n🧪 TESTING NOTION CONNECTION")
    print("=" * 50)
    
    headers = {
        "Authorization": f"Bearer {NOTION_CONFIG['NOTION_API_TOKEN']}",
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
    }
    
    # Test database access
    url = f"https://api.notion.com/v1/databases/{NOTION_CONFIG['NOTION_PROJECTS_DATABASE_ID']}"
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            print("✅ Notion API connection successful!")
            data = response.json()
            print(f"📊 Database: {data.get('title', [{}])[0].get('plain_text', 'Unknown')}")
            print(f"🔗 Database ID: {NOTION_CONFIG['NOTION_PROJECTS_DATABASE_ID']}")
        else:
            print(f"❌ Connection failed: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Error testing connection: {e}")

def create_sample_data():
    """Create sample data in Notion database"""
    print("\n📝 CREATING SAMPLE DATA")
    print("=" * 50)
    
    headers = {
        "Authorization": f"Bearer {NOTION_CONFIG['NOTION_API_TOKEN']}",
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
    }
    
    # Sample project data
    sample_project = {
        "parent": {"database_id": NOTION_CONFIG['NOTION_PROJECTS_DATABASE_ID']},
        "properties": {
            "Title": {
                "title": [
                    {
                        "text": {
                            "content": "Wild Hearts - Documentary"
                        }
                    }
                ]
            },
            "Status": {
                "select": {
                    "name": "In Progress"
                }
            },
            "Priority": {
                "select": {
                    "name": "High"
                }
            },
            "Description": {
                "rich_text": [
                    {
                        "text": {
                            "content": "Environmental conservation documentary focusing on wildlife preservation."
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
        else:
            print(f"❌ Failed to create sample data: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")

if __name__ == "__main__":
    print("🎬 SGE NOTION INTEGRATION SETUP")
    print("=" * 50)
    
    print_environment_variables()
    test_notion_connection()
    create_sample_data()
    
    print("\n🎉 SETUP COMPLETE!")
    print("Next steps:")
    print("1. Add environment variables to Render")
    print("2. Redeploy your API service")
    print("3. Test the integration in your SGE dashboard") 