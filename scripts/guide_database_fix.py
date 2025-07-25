#!/usr/bin/env python3
"""
Guide for fixing the database schema issue
"""

import time

def print_step(step_num, title, description, commands=None):
    """Print a formatted step"""
    print(f"\n{'='*60}")
    print(f"STEP {step_num}: {title}")
    print(f"{'='*60}")
    print(description)
    if commands:
        print(f"\n📝 Commands to run:")
        for i, cmd in enumerate(commands, 1):
            print(f"   {i}. {cmd}")
    print()

def main():
    """Main guide function"""
    print("🔧 Database Schema Fix Guide")
    print("=" * 60)
    print("This guide will help you fix the framework_alignment column issue.")
    print("Follow each step carefully.\n")
    
    # Step 1: Connect to Render
    print_step(
        1, 
        "Connect to Render Database Console",
        "You need to access the Render database console to run SQL commands.",
        [
            "Go to https://dashboard.render.com",
            "Find your database: NavImpact-dbV2",
            "Click 'Connect' → 'Connect with psql'",
            "Wait for the console to load"
        ]
    )
    
    input("Press Enter when you're connected to the psql console...")
    
    # Step 2: Check current state
    print_step(
        2,
        "Check Current Table Structure",
        "First, let's see what columns currently exist in the projects table.",
        [
            "\\d+ projects;"
        ]
    )
    
    input("Press Enter after running the command and reviewing the output...")
    
    # Step 3: Add the column
    print_step(
        3,
        "Add framework_alignment Column",
        "Add the missing column safely. This command won't duplicate the column if it already exists.",
        [
            "ALTER TABLE projects ADD COLUMN IF NOT EXISTS framework_alignment JSONB;"
        ]
    )
    
    input("Press Enter after running the command...")
    
    # Step 4: Verify the column
    print_step(
        4,
        "Verify Column Was Added",
        "Check that the framework_alignment column now appears in the table structure.",
        [
            "\\d+ projects;"
        ]
    )
    
    input("Press Enter after running the command and confirming the column exists...")
    
    # Step 5: Check for duplicates
    print_step(
        5,
        "Check for Duplicate Data",
        "Let's check if there are any duplicate projects that need to be cleaned up.",
        [
            "SELECT name, COUNT(*) as count FROM projects GROUP BY LOWER(name) HAVING COUNT(*) > 1 ORDER BY count DESC;"
        ]
    )
    
    input("Press Enter after running the command...")
    
    # Step 6: Test the API
    print_step(
        6,
        "Test the API",
        "Now let's test if the API is working properly.",
        [
            "Exit the psql console (type '\\q' and press Enter)",
            "Come back here and press Enter to test the API"
        ]
    )
    
    input("Press Enter when you're ready to test the API...")
    
    print("\n" + "="*60)
    print("TESTING API...")
    print("="*60)
    
    # Import and run the test
    try:
        import requests
        
        print("Testing projects endpoint...")
        response = requests.get("https://navimpact-api.onrender.com/api/v1/projects/", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            projects = data.get('items', [])
            print(f"✅ SUCCESS! API is working!")
            print(f"📊 Found {len(projects)} projects")
            
            if projects:
                first_project = projects[0]
                if 'framework_alignment' in first_project:
                    print(f"✅ framework_alignment field is present")
                    print(f"   Value: {first_project.get('framework_alignment')}")
                else:
                    print(f"⚠️  framework_alignment field is missing from response")
            
            print("\n🎉 CONGRATULATIONS! The fix worked!")
            print("The framework alignment features should now be fully functional.")
            
        else:
            print(f"❌ API still not working: {response.status_code}")
            print(f"   Response: {response.text}")
            print("\n🔧 The issue might need additional troubleshooting.")
            
    except Exception as e:
        print(f"❌ Error testing API: {e}")
        print("\n🔧 Please check the database connection and try again.")

if __name__ == "__main__":
    main() 