#!/usr/bin/env python3
"""
Instagram API Setup Script
Helps configure Instagram Graph API access for OKR tracking
"""

import os
import sys
import asyncio
import aiohttp
from typing import Dict, Any

def print_header():
    print("=" * 60)
    print("🎯 Instagram API Setup for OKR 4.1 Tracking")
    print("=" * 60)

def print_steps():
    print("\n📋 Setup Steps:")
    print("1. Create Facebook App (if you don't have one)")
    print("2. Add Instagram Basic Display to your app")
    print("3. Generate Instagram Access Token")
    print("4. Get Instagram Business Account ID")
    print("5. Configure environment variables")
    print("6. Test the connection")

def get_facebook_app_instructions():
    print("\n🔧 Step 1: Create Facebook App")
    print("- Go to: https://developers.facebook.com/")
    print("- Click 'Create App'")
    print("- Choose 'Business' type")
    print("- Fill in app details")
    print("- Note down your App ID and App Secret")

def get_instagram_setup_instructions():
    print("\n📱 Step 2: Add Instagram Basic Display")
    print("- In your Facebook App dashboard")
    print("- Go to 'Add Product'")
    print("- Add 'Instagram Basic Display'")
    print("- Configure OAuth redirect URIs")
    print("- Add your Instagram account as a test user")

def get_access_token_instructions():
    print("\n🔑 Step 3: Generate Access Token")
    print("- Go to Instagram Basic Display settings")
    print("- Click 'Generate Token'")
    print("- Authorize your Instagram account")
    print("- Copy the access token (it expires in 60 days)")

def get_business_account_instructions():
    print("\n🏢 Step 4: Get Business Account ID")
    print("- Convert your Instagram account to Business/Creator")
    print("- Connect it to your Facebook Page")
    print("- Use Graph API Explorer to get account ID:")
    print("  https://developers.facebook.com/tools/explorer/")
    print("- Query: /me/accounts?fields=instagram_business_account")
    print("- Note the Instagram Business Account ID")

def create_env_template():
    env_content = """# Instagram API Configuration
# Add these to your .env file or environment variables

# Instagram Graph API
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token_here
INSTAGRAM_APP_ID=your_facebook_app_id_here
INSTAGRAM_APP_SECRET=your_facebook_app_secret_here
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_instagram_business_account_id_here

# Social Media Features
SOCIAL_MEDIA_ENABLED=true
SOCIAL_METRICS_CACHE_DURATION=3600

# Optional: Instagram API Settings
INSTAGRAM_API_BASE_URL=https://graph.instagram.com/v18.0
INSTAGRAM_API_TIMEOUT=30
INSTAGRAM_RATE_LIMIT=200
"""
    
    with open("instagram_env_template.txt", "w") as f:
        f.write(env_content)
    
    print(f"\n📄 Environment template saved to: instagram_env_template.txt")
    print("Copy these variables to your .env file or Render environment variables")

async def test_instagram_connection(access_token: str, business_account_id: str):
    """Test Instagram API connection with provided credentials."""
    print(f"\n🧪 Testing Instagram API Connection...")
    
    # Test basic account info
    url = f"https://graph.instagram.com/v18.0/{business_account_id}"
    params = {
        "access_token": access_token,
        "fields": "id,username,followers_count,media_count"
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"✅ Connection successful!")
                    print(f"   Username: {data.get('username', 'N/A')}")
                    print(f"   Followers: {data.get('followers_count', 'N/A'):,}")
                    print(f"   Media Count: {data.get('media_count', 'N/A'):,}")
                    return True
                else:
                    error_text = await response.text()
                    print(f"❌ Connection failed: {response.status}")
                    print(f"   Error: {error_text}")
                    return False
    except Exception as e:
        print(f"❌ Connection error: {str(e)}")
        return False

def validate_credentials():
    """Validate that required credentials are provided."""
    access_token = os.getenv("INSTAGRAM_ACCESS_TOKEN")
    business_account_id = os.getenv("INSTAGRAM_BUSINESS_ACCOUNT_ID")
    
    if not access_token:
        print("❌ INSTAGRAM_ACCESS_TOKEN not found in environment")
        return False
    
    if not business_account_id:
        print("❌ INSTAGRAM_BUSINESS_ACCOUNT_ID not found in environment")
        return False
    
    print("✅ Instagram credentials found in environment")
    return True

async def main():
    print_header()
    
    # Check if credentials are already configured
    if validate_credentials():
        print("\n🔍 Testing existing configuration...")
        access_token = os.getenv("INSTAGRAM_ACCESS_TOKEN")
        business_account_id = os.getenv("INSTAGRAM_BUSINESS_ACCOUNT_ID")
        
        success = await test_instagram_connection(access_token, business_account_id)
        
        if success:
            print("\n🎉 Instagram API is ready for OKR tracking!")
            print("You can now use the dashboard to track real Instagram metrics.")
        else:
            print("\n⚠️  Configuration test failed. Please check your credentials.")
    else:
        print_steps()
        get_facebook_app_instructions()
        get_instagram_setup_instructions()
        get_access_token_instructions()
        get_business_account_instructions()
        create_env_template()
        
        print("\n💡 Next Steps:")
        print("1. Follow the setup steps above")
        print("2. Add the environment variables to your .env file")
        print("3. Run this script again to test the connection")
        print("4. Update your OKR dashboard to use real Instagram data")

if __name__ == "__main__":
    asyncio.run(main()) 