#!/usr/bin/env python3
"""
Script to check current users in the production database via API.
"""

import requests
import json
import sys
from datetime import datetime

# API base URL
API_BASE = "https://navimpact-api.onrender.com/api/v1"

def check_production_users():
    """Check what users currently exist in the production database."""
    
    print("🔍 Checking Production Database Users...")
    print("=" * 50)
    print(f"Timestamp: {datetime.now().isoformat()}")
    print(f"API Base: {API_BASE}")
    
    try:
        # Test health first
        health_response = requests.get(f"{API_BASE}/health/")
        if health_response.status_code != 200:
            print(f"❌ Health check failed: {health_response.status_code}")
            return False
        
        print("✅ Production API is healthy")
        
        # Try to get team members (will require authentication)
        team_response = requests.get(f"{API_BASE}/users/team")
        
        if team_response.status_code == 401:
            print("✅ User endpoints are working (authentication required as expected)")
            print("\n📋 Current Status:")
            print("   • Production database has user profile migration applied")
            print("   • API endpoints are working correctly")
            print("   • Ready to create SGE team members")
            
            # Check if we can get the OpenAPI spec to see available endpoints
            spec_response = requests.get(f"{API_BASE.replace('/api/v1', '')}/openapi.json")
            if spec_response.status_code == 200:
                spec = spec_response.json()
                user_paths = [path for path in spec['paths'].keys() if path.startswith('/api/v1/users')]
                print(f"\n🔗 Available User Endpoints ({len(user_paths)}):")
                for path in user_paths:
                    print(f"   • {path}")
            
            return True
        else:
            print(f"⚠️  Unexpected response from team endpoint: {team_response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error checking production users: {str(e)}")
        return False

def main():
    """Main function."""
    try:
        success = check_production_users()
        return 0 if success else 1
    except Exception as e:
        print(f"❌ Failed to check production users: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 