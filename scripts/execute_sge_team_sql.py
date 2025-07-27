#!/usr/bin/env python3
"""
Script to execute the SGE team creation SQL on the production database.
"""

import os
import sys
import psycopg2
from datetime import datetime
from urllib.parse import urlparse

# Production database URL
DATABASE_URL = "postgresql://navimpact_dbv3_user:EY0Vd5QcTEoY7ZM0CrKCWfsFVHcYIZ8V@dpg-d21hvsvfte5s73fkk140-a/navimpact_dbv3"

def parse_database_url(url):
    """Parse the database URL to extract connection details."""
    parsed = urlparse(url)
    return {
        'host': parsed.hostname,
        'database': parsed.path[1:],  # Remove leading slash
        'user': parsed.username,
        'password': parsed.password,
        'port': parsed.port or 5432
    }

def execute_sql_script():
    """Execute the SGE team creation SQL script."""
    
    # Parse the database URL
    db_config = parse_database_url(DATABASE_URL)
    
    print("🚀 Executing SGE Team Creation SQL...")
    print("=" * 50)
    print(f"Timestamp: {datetime.now().isoformat()}")
    print(f"Database: {db_config['database']}")
    print(f"Host: {db_config['host']}")
    print(f"User: {db_config['user']}")
    
    try:
        # Read the SQL script
        script_path = os.path.join(os.path.dirname(__file__), 'create_sge_team_sql.sql')
        with open(script_path, 'r') as f:
            sql_script = f.read()
        
        print("✅ SQL script loaded successfully")
        
        # Connect to the database
        print("🔌 Connecting to production database...")
        conn = psycopg2.connect(**db_config)
        conn.autocommit = False  # We'll handle transactions manually
        
        cursor = conn.cursor()
        print("✅ Connected to database")
        
        # Execute the SQL script
        print("📝 Executing SQL script...")
        cursor.execute(sql_script)
        
        # Commit the transaction
        conn.commit()
        print("✅ SQL script executed successfully")
        
        # Fetch and display results
        print("\n📊 Results:")
        print("-" * 30)
        
        # Get the results from the last SELECT statements
        cursor.execute("""
            SELECT 
                id,
                email,
                full_name,
                job_title,
                organisation,
                current_status,
                is_intern,
                mentor_id,
                created_at
            FROM users 
            WHERE organisation = 'Shadow Goose Entertainment'
            ORDER BY 
                CASE 
                    WHEN job_title LIKE '%Director%' THEN 1
                    WHEN job_title = 'Operations Officer' THEN 2
                    WHEN job_title = 'Intern' THEN 3
                    ELSE 4
                END,
                full_name;
        """)
        
        users = cursor.fetchall()
        
        if users:
            print(f"✅ Created {len(users)} SGE team members:")
            print()
            for user in users:
                user_id, email, full_name, job_title, org, status, is_intern, mentor_id, created = user
                intern_badge = " (Intern)" if is_intern else ""
                print(f"   • {full_name} - {job_title}{intern_badge}")
                print(f"     Email: {email}")
                print(f"     Status: {status}")
                if mentor_id:
                    print(f"     Mentor ID: {mentor_id}")
                print()
        else:
            print("⚠️  No SGE team members found")
        
        # Show mentorship relationships
        cursor.execute("""
            SELECT 
                m.full_name as mentor,
                i.full_name as intern,
                i.email as intern_email
            FROM users m
            JOIN users i ON m.id = i.mentor_id
            WHERE m.organisation = 'Shadow Goose Entertainment' 
            AND i.organisation = 'Shadow Goose Entertainment';
        """)
        
        mentorships = cursor.fetchall()
        
        if mentorships:
            print("🎓 Mentorship Relationships:")
            for mentor, intern, intern_email in mentorships:
                print(f"   • {mentor} → {intern} ({intern_email})")
        else:
            print("🎓 No mentorship relationships found")
        
        cursor.close()
        conn.close()
        
        print("\n" + "=" * 50)
        print("🎉 SGE Team Creation Complete!")
        print("\n🔐 Login Credentials:")
        print("   Email: [member-email]")
        print("   Password: SGE2024!")
        print("\n⚠️  Note: Users should change their passwords after first login")
        
        return True
        
    except FileNotFoundError:
        print(f"❌ SQL script not found: {script_path}")
        return False
    except psycopg2.Error as e:
        print(f"❌ Database error: {str(e)}")
        if 'conn' in locals():
            conn.rollback()
            conn.close()
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        if 'conn' in locals():
            conn.rollback()
            conn.close()
        return False

def main():
    """Main function."""
    try:
        success = execute_sql_script()
        return 0 if success else 1
    except Exception as e:
        print(f"❌ Failed to execute SQL script: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 