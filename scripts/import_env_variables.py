#!/usr/bin/env python3
"""
Environment Variables Import Script
Helps you import the real data environment variables
"""

import os
import sys

def print_header():
    print("=" * 60)
    print("🚀 ENVIRONMENT VARIABLES IMPORT")
    print("=" * 60)

def show_instructions():
    print("\n📝 INSTRUCTIONS:")
    print("-" * 30)
    steps = [
        "1. Open env.real_data.txt",
        "2. Copy all the variables",
        "3. Go to Render Dashboard",
        "4. Navigate to shadow-goose-api service",
        "5. Go to Environment tab",
        "6. Paste each variable",
        "7. Save and deploy"
    ]
    
    for step in steps:
        print(f"   {step}")

def show_variables():
    print("\n📋 ENVIRONMENT VARIABLES TO ADD:")
    print("-" * 40)
    
    variables = [
        "GOOGLE_ANALYTICS_PROPERTY_ID=G-W5J0946RGP",
        "GOOGLE_ANALYTICS_STREAM_ID=11847705981",
        "GOOGLE_ANALYTICS_STREAM_NAME=Shadow Goose Ent",
        "GOOGLE_ANALYTICS_STREAM_URL=https://www.shadow-goose.com",
        "GOOGLE_ANALYTICS_PRIVATE_KEY_ID=9eb429a5851e89388f0893afad9cf157753497a4",
        "GOOGLE_ANALYTICS_PRIVATE_KEY=[LONG_PRIVATE_KEY]",
        "GOOGLE_ANALYTICS_CLIENT_EMAIL=navimpact-analytics-access@navimpact-analytics-access.iam.gserviceaccount.com",
        "GOOGLE_ANALYTICS_CLIENT_ID=105729216126104949624",
        "INSTAGRAM_APP_ID=750807407546453",
        "INSTAGRAM_APP_SECRET=b1bb9291aa6dff3eefeb1d32ac7874ae",
        "INSTAGRAM_ACCESS_TOKEN=[LONG_ACCESS_TOKEN]",
        "INSTAGRAM_BUSINESS_ACCOUNT_ID=17841470067685584",
        "INSTAGRAM_API_BASE_URL=https://graph.facebook.com/v18.0",
        "INSTAGRAM_API_TIMEOUT=30"
    ]
    
    for var in variables:
        print(f"   {var}")

def show_test_commands():
    print("\n🧪 TEST COMMANDS:")
    print("-" * 20)
    commands = [
        "curl https://shadow-goose-api.onrender.com/api/v1/analytics/ga/users",
        "curl https://shadow-goose-api.onrender.com/api/v1/analytics/instagram/profile",
        "python scripts/configure_real_data.py status"
    ]
    
    for cmd in commands:
        print(f"   {cmd}")

def show_file_location():
    print("\n📁 FILE LOCATION:")
    print("-" * 20)
    print("   Complete variables: env.real_data.txt")
    print("   Copy from this file to Render")

def main():
    print_header()
    show_instructions()
    show_variables()
    show_test_commands()
    show_file_location()
    
    print("\n" + "=" * 60)
    print("✅ READY TO IMPORT!")
    print("=" * 60)
    print("\nOpen env.real_data.txt and copy all variables to Render.")

if __name__ == "__main__":
    main() 