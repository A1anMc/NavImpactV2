#!/usr/bin/env python3
"""
Script to connect to Render database and check exact column state
"""

import psycopg2
import json
from datetime import datetime
import sys

# Database connection details from Render
DB_CONFIG = {
    'host': 'dpg-d1vj88juibrs739e05dg-a.oregon-postgresql.render.com',
    'port': 5432,
    'database': 'navimpact',
    'user': 'navimpact',
    'password': 'g1eSzQIQfN7GiGEE1TX1cZddSQv2yYyE'
}

def connect_to_database():
    """Connect to the Render database"""
    try:
        print("🔌 Connecting to Render Database...")
        connection = psycopg2.connect(**DB_CONFIG)
        print("✅ Database connection successful!")
        return connection
    except Exception as e:
        print(f"❌ Failed to connect to database: {e}")
        return None

def check_table_schema(connection):
    """Check the projects table schema"""
    print("\n📋 Checking Projects Table Schema")
    print("=" * 50)
    
    try:
        cursor = connection.cursor()
        
        # Get table information
        cursor.execute("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'projects' 
            ORDER BY ordinal_position;
        """)
        
        columns = cursor.fetchall()
        
        print(f"📊 Found {len(columns)} columns in projects table:")
        print()
        
        for col in columns:
            name, data_type, nullable, default = col
            nullable_str = "NULL" if nullable == "YES" else "NOT NULL"
            default_str = f" DEFAULT {default}" if default else ""
            print(f"  • {name:<25} {data_type:<15} {nullable_str}{default_str}")
        
        # Check specifically for framework_alignment
        framework_col = next((col for col in columns if col[0] == 'framework_alignment'), None)
        
        if framework_col:
            print(f"\n✅ framework_alignment column found:")
            print(f"   Type: {framework_col[1]}")
            print(f"   Nullable: {framework_col[2]}")
            print(f"   Default: {framework_col[3]}")
        else:
            print(f"\n❌ framework_alignment column NOT found")
        
        cursor.close()
        return columns
        
    except Exception as e:
        print(f"❌ Error checking schema: {e}")
        return None

def check_table_data(connection):
    """Check the projects table data"""
    print("\n📊 Checking Projects Table Data")
    print("=" * 50)
    
    try:
        cursor = connection.cursor()
        
        # Count total projects
        cursor.execute("SELECT COUNT(*) FROM projects;")
        total_count = cursor.fetchone()[0]
        print(f"📈 Total projects: {total_count}")
        
        # Check for projects with framework_alignment data
        cursor.execute("""
            SELECT COUNT(*) 
            FROM projects 
            WHERE framework_alignment IS NOT NULL 
            AND framework_alignment != '[]'::jsonb;
        """)
        framework_count = cursor.fetchone()[0]
        print(f"🎯 Projects with framework_alignment: {framework_count}")
        
        # Sample some projects
        cursor.execute("""
            SELECT id, name, created_at, framework_alignment 
            FROM projects 
            ORDER BY created_at DESC 
            LIMIT 5;
        """)
        
        projects = cursor.fetchall()
        print(f"\n📝 Recent projects (last 5):")
        for project in projects:
            project_id, name, created_at, framework_alignment = project
            framework_str = str(framework_alignment) if framework_alignment else "NULL"
            print(f"  • ID {project_id}: {name}")
            print(f"    Created: {created_at}")
            print(f"    Framework: {framework_str}")
            print()
        
        cursor.close()
        return total_count
        
    except Exception as e:
        print(f"❌ Error checking data: {e}")
        return None

def check_migration_state(connection):
    """Check Alembic migration state"""
    print("\n🔄 Checking Alembic Migration State")
    print("=" * 50)
    
    try:
        cursor = connection.cursor()
        
        # Check if alembic_version table exists
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'alembic_version'
            );
        """)
        
        table_exists = cursor.fetchone()[0]
        
        if table_exists:
            cursor.execute("SELECT version_num FROM alembic_version;")
            current_version = cursor.fetchone()[0]
            print(f"✅ Alembic version table exists")
            print(f"📋 Current migration version: {current_version}")
        else:
            print("❌ Alembic version table does not exist")
            print("   This means migrations haven't been run yet")
        
        cursor.close()
        return table_exists
        
    except Exception as e:
        print(f"❌ Error checking migration state: {e}")
        return False

def check_for_duplicates(connection):
    """Check for duplicate data"""
    print("\n🔍 Checking for Duplicate Data")
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
        
        name_duplicates = cursor.fetchall()
        
        if name_duplicates:
            print(f"🚨 Found {len(name_duplicates)} duplicate name groups:")
            for name, count in name_duplicates:
                print(f"   • '{name}' appears {count} times")
        else:
            print("✅ No duplicate project names found")
        
        # Check for duplicate descriptions
        cursor.execute("""
            SELECT description, COUNT(*) as count
            FROM projects 
            WHERE description IS NOT NULL 
            AND LENGTH(description) > 10
            GROUP BY LOWER(description)
            HAVING COUNT(*) > 1
            ORDER BY count DESC;
        """)
        
        desc_duplicates = cursor.fetchall()
        
        if desc_duplicates:
            print(f"\n🚨 Found {len(desc_duplicates)} duplicate description groups:")
            for desc, count in desc_duplicates:
                desc_preview = desc[:50] + "..." if len(desc) > 50 else desc
                print(f"   • '{desc_preview}' appears {count} times")
        else:
            print("✅ No duplicate descriptions found")
        
        cursor.close()
        
    except Exception as e:
        print(f"❌ Error checking duplicates: {e}")

def suggest_fixes(columns, total_projects, migration_table_exists):
    """Suggest fixes based on current state"""
    print("\n🛠️  Suggested Fixes")
    print("=" * 50)
    
    framework_col = next((col for col in columns if col[0] == 'framework_alignment'), None)
    
    if framework_col:
        print("✅ framework_alignment column exists")
        
        if framework_col[1] != 'jsonb':
            print(f"⚠️  Column type is {framework_col[1]}, should be jsonb")
            print("   Fix: ALTER TABLE projects ALTER COLUMN framework_alignment TYPE jsonb;")
        
        if not migration_table_exists:
            print("⚠️  Alembic migrations not initialized")
            print("   Fix: Run 'alembic init alembic' and apply migrations")
        else:
            print("✅ Migration system is set up")
            
    else:
        print("❌ framework_alignment column missing")
        print("   Fix: ALTER TABLE projects ADD COLUMN framework_alignment jsonb;")
    
    print(f"\n📊 Database Summary:")
    print(f"   • Total projects: {total_projects}")
    print(f"   • Columns: {len(columns)}")
    print(f"   • Migration system: {'✅' if migration_table_exists else '❌'}")

def main():
    """Main function"""
    print("🔍 Render Database Inspector")
    print("=" * 50)
    
    # Connect to database
    connection = connect_to_database()
    if not connection:
        return
    
    try:
        # Check schema
        columns = check_table_schema(connection)
        
        # Check data
        total_projects = check_table_data(connection)
        
        # Check migration state
        migration_table_exists = check_migration_state(connection)
        
        # Check for duplicates
        check_for_duplicates(connection)
        
        # Suggest fixes
        if columns and total_projects is not None:
            suggest_fixes(columns, total_projects, migration_table_exists)
        
    finally:
        connection.close()
        print("\n🔌 Database connection closed")

if __name__ == "__main__":
    main() 