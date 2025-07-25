#!/usr/bin/env python3
"""
Simple script to check Render database using connection string
"""

import psycopg2
import sys

# Full connection string from Render
CONNECTION_STRING = "postgresql://navimpact:g1eSzQIQfN7GiGEE1TX1cZddSQv2yYyE@dpg-d1vj88juibrs739e05dg-a.oregon-postgresql.render.com/navimpact"

def main():
    print("🔍 Simple Database Check")
    print("=" * 50)
    
    try:
        print("🔌 Connecting to database...")
        connection = psycopg2.connect(CONNECTION_STRING)
        print("✅ Connected successfully!")
        
        cursor = connection.cursor()
        
        # Check if projects table exists
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'projects'
            );
        """)
        
        table_exists = cursor.fetchone()[0]
        print(f"📋 Projects table exists: {table_exists}")
        
        if table_exists:
            # Get column info
            cursor.execute("""
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns 
                WHERE table_name = 'projects' 
                ORDER BY ordinal_position;
            """)
            
            columns = cursor.fetchall()
            print(f"\n📊 Found {len(columns)} columns:")
            
            for col in columns:
                name, data_type, nullable = col
                print(f"  • {name:<25} {data_type:<15} {'NULL' if nullable == 'YES' else 'NOT NULL'}")
            
            # Check for framework_alignment specifically
            framework_col = next((col for col in columns if col[0] == 'framework_alignment'), None)
            if framework_col:
                print(f"\n✅ framework_alignment column found!")
                print(f"   Type: {framework_col[1]}")
                print(f"   Nullable: {framework_col[2]}")
            else:
                print(f"\n❌ framework_alignment column NOT found")
            
            # Count projects
            cursor.execute("SELECT COUNT(*) FROM projects;")
            count = cursor.fetchone()[0]
            print(f"\n📈 Total projects: {count}")
            
            # Check for duplicates
            cursor.execute("""
                SELECT name, COUNT(*) as count
                FROM projects 
                GROUP BY LOWER(name)
                HAVING COUNT(*) > 1;
            """)
            
            duplicates = cursor.fetchall()
            if duplicates:
                print(f"\n🚨 Found {len(duplicates)} duplicate names:")
                for name, count in duplicates:
                    print(f"   • '{name}' appears {count} times")
            else:
                print(f"\n✅ No duplicate project names found")
        
        cursor.close()
        connection.close()
        print("\n🔌 Connection closed")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print(f"   Error type: {type(e).__name__}")

if __name__ == "__main__":
    main() 