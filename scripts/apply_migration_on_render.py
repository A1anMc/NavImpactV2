#!/usr/bin/env python3
"""
Script to apply Alembic migration on Render
"""

import requests
import json
import subprocess
import sys

def check_migration_status():
    """Check current migration status"""
    print("🔍 Checking Migration Status")
    print("=" * 50)
    
    try:
        # Check if we can access the migration info
        response = requests.get("https://navimpact-api.onrender.com/health", timeout=10)
        if response.status_code == 200:
            print("✅ API is accessible")
        else:
            print(f"❌ API not accessible: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error checking API: {e}")
        return False
    
    return True

def apply_migration():
    """Apply the framework_alignment migration"""
    print("\n🚀 Applying Migration")
    print("=" * 50)
    
    # Since we can't run Alembic directly on Render, we need to:
    # 1. Check if the column exists
    # 2. If not, we need to apply it manually
    
    print("📝 Migration Strategy:")
    print("1. The framework_alignment column was manually added to the database")
    print("2. We need to sync Alembic's migration history with this change")
    print("3. The API is failing because SQLAlchemy can't access the column properly")
    
    print("\n💡 Next Steps:")
    print("1. Connect to Render database console")
    print("2. Run: ALTER TABLE projects ADD COLUMN IF NOT EXISTS framework_alignment JSONB;")
    print("3. Check column exists: \\d+ projects;")
    print("4. If column exists, we need to mark the migration as applied")
    
    return True

def check_column_exists():
    """Check if framework_alignment column exists"""
    print("\n🔍 Checking Column Status")
    print("=" * 50)
    
    # Try to create a project with framework_alignment to see if it works
    test_data = {
        "name": "Test Project",
        "description": "Testing framework alignment",
        "status": "planning",
        "framework_alignment": ["plan_for_victoria"],
        "owner_id": 1
    }
    
    try:
        response = requests.post(
            "https://navimpact-api.onrender.com/api/v1/projects/",
            json=test_data,
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ Column exists and works!")
            return True
        elif response.status_code == 503:
            print("❌ Column doesn't exist or has issues")
            return False
        else:
            print(f"⚠️  Unexpected response: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing column: {e}")
        return False

def main():
    """Main function"""
    print("🔄 Migration Application Tool")
    print("=" * 50)
    
    # Check migration status
    if not check_migration_status():
        return
    
    # Check if column exists
    if check_column_exists():
        print("\n✅ Migration appears to be applied successfully!")
        print("   The framework_alignment column is working.")
    else:
        print("\n❌ Migration needs to be applied")
        apply_migration()

if __name__ == "__main__":
    main() 