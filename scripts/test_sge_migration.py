#!/usr/bin/env python3
"""
Simple test script to check SGE Media migration status.
"""

import os
import sys
from sqlalchemy import create_engine, text

def test_database():
    """Test database connection and check tables."""
    try:
        # Use the production database URL
        database_url = "postgresql://navimpact_dbv3_user:EY0Vd5QcTEoY7ZM0CrKCWfsFVHcYIZ8V@dpg-d21hvsvfte5s73fkk140-a/navimpact_dbv3"
        engine = create_engine(database_url)
        
        with engine.connect() as conn:
            # Check if projects table exists
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'projects'
            """))
            
            projects_exists = result.fetchone() is not None
            print(f"Projects table exists: {projects_exists}")
            
            # Check if SGE tables exist
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name LIKE 'sge_%'
                ORDER BY table_name
            """))
            
            sge_tables = [row[0] for row in result.fetchall()]
            print(f"SGE tables found: {sge_tables}")
            
            # Check alembic version table
            result = conn.execute(text("""
                SELECT version_num 
                FROM alembic_version
            """))
            
            current_version = result.fetchone()
            print(f"Current alembic version: {current_version[0] if current_version else 'None'}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_database() 