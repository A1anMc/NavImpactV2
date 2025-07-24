#!/usr/bin/env python3
"""
Script to apply budget migration to production database
Run this on Render to add budget fields to projects table
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

def apply_budget_migration():
    """Apply budget migration to projects table"""
    
    # Get database URL from environment
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("❌ DATABASE_URL not found in environment")
        sys.exit(1)
    
    print("🔧 Applying Budget Migration to Projects Table")
    print("=" * 50)
    
    try:
        # Create database engine
        engine = create_engine(database_url)
        
        with engine.connect() as conn:
            # Check if columns already exist
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'projects' 
                AND column_name IN ('budget', 'budget_currency')
            """))
            
            existing_columns = [row[0] for row in result]
            print(f"📋 Existing budget columns: {existing_columns}")
            
            # Add budget column if it doesn't exist
            if 'budget' not in existing_columns:
                print("🔧 Step 1: Adding budget column...")
                conn.execute(text("ALTER TABLE projects ADD COLUMN budget FLOAT"))
                conn.commit()
                print("✅ Budget column added successfully")
            else:
                print("✅ Budget column already exists")
            
            # Add budget_currency column if it doesn't exist
            if 'budget_currency' not in existing_columns:
                print("🔧 Step 2: Adding budget_currency column...")
                conn.execute(text("ALTER TABLE projects ADD COLUMN budget_currency VARCHAR(3) NOT NULL DEFAULT 'AUD'"))
                conn.commit()
                print("✅ Budget currency column added successfully")
            else:
                print("✅ Budget currency column already exists")
            
            # Verify the changes
            print("🔧 Step 3: Verifying changes...")
            result = conn.execute(text("""
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns 
                WHERE table_name = 'projects' 
                AND column_name IN ('budget', 'budget_currency')
                ORDER BY column_name
            """))
            
            print("📋 Final schema:")
            for row in result:
                print(f"  - {row[0]}: {row[1]} (nullable: {row[2]}, default: {row[3]})")
            
            # Test the API
            print("🔧 Step 4: Testing API...")
            import requests
            try:
                response = requests.get("https://navimpact-api.onrender.com/api/v1/projects/", timeout=10)
                if response.status_code == 200:
                    print("✅ API test successful - projects endpoint working")
                else:
                    print(f"⚠️ API test returned status {response.status_code}")
            except Exception as e:
                print(f"⚠️ API test failed: {e}")
            
    except SQLAlchemyError as e:
        print(f"❌ Database error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)
    
    print("=" * 50)
    print("🎉 Budget migration completed successfully!")
    print("✅ Projects table now has budget and budget_currency columns")
    print("✅ API should be working properly")

if __name__ == "__main__":
    apply_budget_migration() 