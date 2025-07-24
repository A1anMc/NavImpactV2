#!/usr/bin/env python3
"""
Script to apply budget fields migration to production database.
This will add the missing budget and budget_currency columns to the projects table.
"""

import os
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def apply_budget_migration():
    """Apply budget fields migration to production database."""
    
    # Get production database URL from environment
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("❌ DATABASE_URL environment variable not set")
        return False
    
    try:
        # Connect to database
        print("🔌 Connecting to production database...")
        conn = psycopg2.connect(database_url)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if columns already exist
        print("🔍 Checking if budget columns already exist...")
        cursor.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'projects' AND column_name IN ('budget', 'budget_currency')
        """)
        existing_columns = [row[0] for row in cursor.fetchall()]
        
        if 'budget' in existing_columns and 'budget_currency' in existing_columns:
            print("✅ Budget columns already exist in projects table")
            return True
        
        # Add budget column
        if 'budget' not in existing_columns:
            print("➕ Adding budget column...")
            cursor.execute("ALTER TABLE projects ADD COLUMN budget FLOAT")
            print("✅ Added budget column")
        
        # Add budget_currency column
        if 'budget_currency' not in existing_columns:
            print("➕ Adding budget_currency column...")
            cursor.execute("ALTER TABLE projects ADD COLUMN budget_currency VARCHAR(3) NOT NULL DEFAULT 'AUD'")
            print("✅ Added budget_currency column")
        
        # Update alembic_version table
        print("📝 Updating alembic version...")
        cursor.execute("UPDATE alembic_version SET version_num = 'ea804a9513f2'")
        print("✅ Updated alembic version to ea804a9513f2")
        
        # Verify the changes
        print("🔍 Verifying changes...")
        cursor.execute("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'projects' AND column_name IN ('budget', 'budget_currency')
            ORDER BY column_name
        """)
        
        columns = cursor.fetchall()
        print("📋 Budget columns in projects table:")
        for col in columns:
            print(f"   - {col[0]}: {col[1]} (nullable: {col[2]}, default: {col[3]})")
        
        cursor.close()
        conn.close()
        
        print("✅ Budget fields migration applied successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error applying migration: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Applying budget fields migration to production database...")
    success = apply_budget_migration()
    
    if success:
        print("🎉 Migration completed successfully!")
        sys.exit(0)
    else:
        print("💥 Migration failed!")
        sys.exit(1) 