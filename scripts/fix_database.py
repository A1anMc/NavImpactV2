#!/usr/bin/env python3
"""
Script to fix the database schema by adding the framework_alignment column
"""

import psycopg2
import json
from datetime import datetime

# Database connection details from Render dashboard
DB_URL = "postgresql://navimpact:g1eSzQIQfN7GiGEE1TX1cZddSQv2yYyE@dpg-d1vj88juibrs739e05dg-a.oregon-postgresql.render.com/navimpact"

def run_sql_command(connection, command, description):
    """Run a SQL command and display results"""
    try:
        print(f"\n🔧 {description}")
        print("-" * 50)
        
        cursor = connection.cursor()
        cursor.execute(command)
        
        if command.strip().upper().startswith('SELECT'):
            # For SELECT queries, fetch and display results
            results = cursor.fetchall()
            if results:
                print(f"✅ Found {len(results)} results:")
                for row in results:
                    print(f"   {row}")
            else:
                print("✅ No results found")
        else:
            # For other commands, just confirm success
            print("✅ Command executed successfully")
        
        cursor.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def check_table_structure(connection):
    """Check the current projects table structure"""
    print("\n📋 Checking Projects Table Structure")
    print("=" * 50)
    
    try:
        cursor = connection.cursor()
        
        # Get table information
        cursor.execute("""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'projects' 
            ORDER BY ordinal_position;
        """)
        
        columns = cursor.fetchall()
        
        print(f"📊 Found {len(columns)} columns in projects table:")
        print()
        
        framework_exists = False
        for col in columns:
            name, data_type, nullable = col
            nullable_str = "NULL" if nullable == "YES" else "NOT NULL"
            print(f"  • {name:<25} {data_type:<15} {nullable_str}")
            
            if name == 'framework_alignment':
                framework_exists = True
        
        cursor.close()
        
        if framework_exists:
            print(f"\n✅ framework_alignment column already exists!")
            return True
        else:
            print(f"\n❌ framework_alignment column is missing")
            return False
            
    except Exception as e:
        print(f"❌ Error checking structure: {e}")
        return False

def add_framework_column(connection):
    """Add the framework_alignment column"""
    print("\n🔧 Adding framework_alignment Column")
    print("=" * 50)
    
    try:
        cursor = connection.cursor()
        
        # Add the column safely
        cursor.execute("ALTER TABLE projects ADD COLUMN IF NOT EXISTS framework_alignment JSONB;")
        
        print("✅ Column added successfully (or already existed)")
        
        cursor.close()
        return True
        
    except Exception as e:
        print(f"❌ Error adding column: {e}")
        return False

def check_for_duplicates(connection):
    """Check for duplicate projects"""
    print("\n🔍 Checking for Duplicate Projects")
    print("=" * 50)
    
    try:
        cursor = connection.cursor()
        
        # Check for duplicate names
        cursor.execute("""
            SELECT name, COUNT(*) as count
            FROM projects 
            GROUP BY LOWER(name)
            HAVING COUNT(*) > 1
            ORDER BY count DESC;
        """)
        
        duplicates = cursor.fetchall()
        
        if duplicates:
            print(f"🚨 Found {len(duplicates)} duplicate name groups:")
            for name, count in duplicates:
                print(f"   • '{name}' appears {count} times")
        else:
            print("✅ No duplicate project names found")
        
        cursor.close()
        
    except Exception as e:
        print(f"❌ Error checking duplicates: {e}")

def main():
    """Main function to fix the database"""
    print("🔧 NavImpact Database Schema Fix")
    print("=" * 50)
    
    try:
        print("🔌 Connecting to Render database...")
        connection = psycopg2.connect(DB_URL)
        print("✅ Connected successfully!")
        
        # Check current structure
        framework_exists = check_table_structure(connection)
        
        # Add column if needed
        if not framework_exists:
            add_framework_column(connection)
            
            # Verify it was added
            print("\n🔍 Verifying column was added...")
            check_table_structure(connection)
        
        # Check for duplicates
        check_for_duplicates(connection)
        
        # Test the API
        print("\n🧪 Testing API...")
        test_api()
        
        connection.close()
        print("\n✅ Database fix completed!")
        
    except Exception as e:
        print(f"❌ Failed to connect to database: {e}")
        print("\n💡 Alternative: Use the Render web console")
        print("   1. Go to https://dashboard.render.com")
        print("   2. Find NavImpact-dbV2 database")
        print("   3. Click 'Connect' → 'Connect with psql'")
        print("   4. Run: ALTER TABLE projects ADD COLUMN IF NOT EXISTS framework_alignment JSONB;")

def test_api():
    """Test if the API is working after the fix"""
    try:
        import requests
        
        response = requests.get("https://navimpact-api.onrender.com/api/v1/projects/", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            projects = data.get('items', [])
            print(f"✅ API is working! Found {len(projects)} projects")
            
            if projects:
                first_project = projects[0]
                if 'framework_alignment' in first_project:
                    print(f"✅ framework_alignment field is present")
                else:
                    print(f"⚠️  framework_alignment field missing from API response")
            
        else:
            print(f"❌ API still not working: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error testing API: {e}")

if __name__ == "__main__":
    main() 