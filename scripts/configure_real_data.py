#!/usr/bin/env python3
"""
Real Data Configuration Script for SGE Dashboard
This script helps configure real data integrations step by step.
"""

import os
import sys
import json
import requests
from typing import Dict, List, Optional
import subprocess

class RealDataConfigurator:
    def __init__(self):
        self.api_base_url = "https://shadow-goose-api.onrender.com"
        self.current_config = {}
        
    def print_header(self, title: str):
        """Print a formatted header."""
        print("\n" + "="*60)
        print(f"🚀 {title}")
        print("="*60)
    
    def print_step(self, step: int, description: str):
        """Print a formatted step."""
        print(f"\n📋 Step {step}: {description}")
        print("-" * 40)
    
    def test_api_connection(self) -> bool:
        """Test connection to the SGE API."""
        try:
            response = requests.get(f"{self.api_base_url}/health", timeout=10)
            if response.status_code == 200:
                print("✅ API connection successful")
                return True
            else:
                print(f"❌ API connection failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ API connection error: {e}")
            return False
    
    def get_current_config(self) -> Dict:
        """Get current configuration status."""
        config = {
            "google_analytics": {
                "enabled": bool(os.getenv("GOOGLE_ANALYTICS_PROPERTY_ID")),
                "property_id": os.getenv("GOOGLE_ANALYTICS_PROPERTY_ID", "Not configured"),
                "status": "Configured" if os.getenv("GOOGLE_ANALYTICS_PROPERTY_ID") else "Not configured"
            },
            "instagram": {
                "enabled": bool(os.getenv("INSTAGRAM_ACCESS_TOKEN")),
                "access_token": "Configured" if os.getenv("INSTAGRAM_ACCESS_TOKEN") else "Not configured",
                "status": "Configured" if os.getenv("INSTAGRAM_ACCESS_TOKEN") else "Not configured"
            },
            "notion": {
                "enabled": bool(os.getenv("NOTION_API_KEY")),
                "api_key": "Configured" if os.getenv("NOTION_API_KEY") else "Not configured",
                "status": "Configured" if os.getenv("NOTION_API_KEY") else "Not configured"
            },
            "grants": {
                "enabled": bool(os.getenv("SCREEN_AUSTRALIA_API_KEY")),
                "api_keys": "Configured" if os.getenv("SCREEN_AUSTRALIA_API_KEY") else "Not configured",
                "status": "Configured" if os.getenv("SCREEN_AUSTRALIA_API_KEY") else "Not configured"
            }
        }
        return config
    
    def display_current_status(self):
        """Display current configuration status."""
        self.print_header("CURRENT REAL DATA STATUS")
        
        config = self.get_current_config()
        
        for service, details in config.items():
            status_icon = "✅" if details["enabled"] else "❌"
            print(f"{status_icon} {service.replace('_', ' ').title()}: {details['status']}")
    
    def configure_google_analytics(self):
        """Guide through Google Analytics configuration."""
        self.print_header("CONFIGURING GOOGLE ANALYTICS")
        
        print("📊 Google Analytics Setup Guide:")
        print("\n1. Go to Google Cloud Console: https://console.cloud.google.com/")
        print("2. Create a new project or select existing")
        print("3. Enable Google Analytics API")
        print("4. Create a service account")
        print("5. Download the JSON key file")
        print("6. Add service account email to GA property")
        print("7. Get property ID from GA admin")
        
        print("\n📝 Required Environment Variables:")
        print("GOOGLE_ANALYTICS_PROPERTY_ID=your-ga-property-id")
        print("GOOGLE_ANALYTICS_PRIVATE_KEY_ID=your-private-key-id")
        print("GOOGLE_ANALYTICS_PRIVATE_KEY=your-private-key")
        print("GOOGLE_ANALYTICS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com")
        print("GOOGLE_ANALYTICS_CLIENT_ID=your-client-id")
        
        print("\n🔗 Helpful Links:")
        print("- Google Analytics API: https://developers.google.com/analytics")
        print("- Service Account Setup: https://cloud.google.com/iam/docs/service-accounts")
        
        input("\nPress Enter when you have your Google Analytics credentials ready...")
    
    def configure_instagram(self):
        """Guide through Instagram configuration."""
        self.print_header("CONFIGURING INSTAGRAM API")
        
        print("📱 Instagram API Setup Guide:")
        print("\n1. Go to Facebook Developers: https://developers.facebook.com/")
        print("2. Create a new app")
        print("3. Add Instagram Basic Display product")
        print("4. Configure app settings")
        print("5. Set up Instagram Basic Display")
        print("6. Configure redirect URIs")
        print("7. Generate access token")
        
        print("\n📝 Required Environment Variables:")
        print("INSTAGRAM_ACCESS_TOKEN=your-long-lived-access-token")
        print("INSTAGRAM_APP_ID=your-facebook-app-id")
        print("INSTAGRAM_APP_SECRET=your-facebook-app-secret")
        print("INSTAGRAM_BUSINESS_ACCOUNT_ID=your-business-account-id")
        
        print("\n🔗 Helpful Links:")
        print("- Instagram Basic Display: https://developers.facebook.com/docs/instagram-basic-display-api")
        print("- Facebook App Setup: https://developers.facebook.com/docs/apps")
        
        input("\nPress Enter when you have your Instagram credentials ready...")
    
    def configure_notion(self):
        """Guide through Notion configuration."""
        self.print_header("CONFIGURING NOTION API")
        
        print("📋 Notion API Setup Guide:")
        print("\n1. Go to Notion Integrations: https://www.notion.so/my-integrations")
        print("2. Create new integration")
        print("3. Get API key")
        print("4. Open your Notion database")
        print("5. Share with integration")
        print("6. Get database ID from URL")
        
        print("\n📝 Required Environment Variables:")
        print("NOTION_API_KEY=secret_your-notion-api-key-here")
        print("NOTION_DATABASE_ID=your-database-id-here")
        print("NOTION_WORKSPACE_ID=your-workspace-id-here")
        
        print("\n🔗 Helpful Links:")
        print("- Notion API: https://developers.notion.com/")
        print("- Integration Setup: https://developers.notion.com/docs/create-a-notion-integration")
        
        input("\nPress Enter when you have your Notion credentials ready...")
    
    def configure_grants(self):
        """Guide through Grant APIs configuration."""
        self.print_header("CONFIGURING GRANT APIS")
        
        print("💰 Grant APIs Setup Guide:")
        print("\nAvailable Grant Sources:")
        print("1. Screen Australia API - Film/media grants")
        print("2. Business.gov.au API - Government grants")
        print("3. GrantConnect API - Australian grants")
        print("4. Philanthropic APIs - Foundation funding")
        
        print("\n📝 Required Environment Variables:")
        print("SCREEN_AUSTRALIA_API_KEY=your-screen-au-api-key")
        print("BUSINESS_GOV_API_KEY=your-business-gov-api-key")
        print("GRANT_CONNECT_API_KEY=your-grantconnect-api-key")
        
        print("\n🔗 Helpful Links:")
        print("- Screen Australia: https://www.screenaustralia.gov.au/")
        print("- Business.gov.au: https://business.gov.au/")
        print("- GrantConnect: https://www.grants.gov.au/")
        
        input("\nPress Enter when you have your Grant API credentials ready...")
    
    def test_real_data_endpoints(self):
        """Test real data endpoints."""
        self.print_header("TESTING REAL DATA ENDPOINTS")
        
        endpoints = [
            ("Google Analytics", "/api/v1/analytics/ga/users"),
            ("Instagram", "/api/v1/social/instagram/followers"),
            ("Notion", "/api/v1/notion/status"),
            ("Grants", "/api/v1/grants")
        ]
        
        for name, endpoint in endpoints:
            try:
                response = requests.get(f"{self.api_base_url}{endpoint}", timeout=10)
                if response.status_code == 200:
                    print(f"✅ {name}: Working")
                else:
                    print(f"❌ {name}: Failed ({response.status_code})")
            except Exception as e:
                print(f"❌ {name}: Error ({e})")
    
    def generate_render_commands(self):
        """Generate commands for Render deployment."""
        self.print_header("RENDER DEPLOYMENT COMMANDS")
        
        print("🔧 To add environment variables to Render:")
        print("\n1. Go to Render Dashboard")
        print("2. Navigate to shadow-goose-api service")
        print("3. Go to Environment tab")
        print("4. Add the following variables:")
        
        print("\n📝 Environment Variables to Add:")
        env_vars = [
            "GOOGLE_ANALYTICS_PROPERTY_ID",
            "GOOGLE_ANALYTICS_PRIVATE_KEY_ID", 
            "GOOGLE_ANALYTICS_PRIVATE_KEY",
            "GOOGLE_ANALYTICS_CLIENT_EMAIL",
            "GOOGLE_ANALYTICS_CLIENT_ID",
            "INSTAGRAM_ACCESS_TOKEN",
            "INSTAGRAM_APP_ID",
            "INSTAGRAM_APP_SECRET",
            "INSTAGRAM_BUSINESS_ACCOUNT_ID",
            "NOTION_API_KEY",
            "NOTION_DATABASE_ID",
            "NOTION_WORKSPACE_ID",
            "SCREEN_AUSTRALIA_API_KEY",
            "BUSINESS_GOV_API_KEY",
            "GRANT_CONNECT_API_KEY"
        ]
        
        for var in env_vars:
            print(f"   {var}=your-value-here")
        
        print("\n5. Save and redeploy the service")
    
    def run_interactive_setup(self):
        """Run interactive setup process."""
        self.print_header("REAL DATA CONFIGURATION WIZARD")
        
        if not self.test_api_connection():
            print("❌ Cannot connect to SGE API. Please check the deployment.")
            return
        
        self.display_current_status()
        
        print("\n🎯 Choose which real data to configure:")
        print("1. Google Analytics (Website analytics)")
        print("2. Instagram (Social media metrics)")
        print("3. Notion (Project management)")
        print("4. Grant APIs (Funding opportunities)")
        print("5. Test all endpoints")
        print("6. Show Render deployment commands")
        print("7. Exit")
        
        while True:
            choice = input("\nEnter your choice (1-7): ").strip()
            
            if choice == "1":
                self.configure_google_analytics()
            elif choice == "2":
                self.configure_instagram()
            elif choice == "3":
                self.configure_notion()
            elif choice == "4":
                self.configure_grants()
            elif choice == "5":
                self.test_real_data_endpoints()
            elif choice == "6":
                self.generate_render_commands()
            elif choice == "7":
                print("👋 Goodbye!")
                break
            else:
                print("❌ Invalid choice. Please enter 1-7.")
            
            input("\nPress Enter to continue...")

def main():
    """Main function."""
    configurator = RealDataConfigurator()
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        if command == "status":
            configurator.display_current_status()
        elif command == "test":
            configurator.test_real_data_endpoints()
        elif command == "render":
            configurator.generate_render_commands()
        else:
            print("Usage: python configure_real_data.py [status|test|render]")
    else:
        configurator.run_interactive_setup()

if __name__ == "__main__":
    main() 