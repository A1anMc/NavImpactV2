#!/usr/bin/env python3
"""
Script to manually apply SGE Media migration and check for errors.
"""

import os
import sys
import logging
from sqlalchemy import create_engine, text
from alembic import command
from alembic.config import Config

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_database_connection():
    """Check if we can connect to the database."""
    try:
        database_url = os.getenv('DATABASE_URL')
        if not database_url:
            logger.error("DATABASE_URL not set")
            return False
            
        engine = create_engine(database_url)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            logger.info("Database connection successful")
            return True
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return False

def check_current_migration():
    """Check current migration status."""
    try:
        alembic_cfg = Config("alembic.ini")
        from alembic.script import ScriptDirectory
        script = ScriptDirectory.from_config(alembic_cfg)
        
        # Get current revision
        from alembic.runtime.migration import MigrationContext
        engine = create_engine(os.getenv('DATABASE_URL'))
        with engine.connect() as conn:
            context = MigrationContext.configure(conn)
            current_rev = context.get_current_revision()
            logger.info(f"Current migration revision: {current_rev}")
            return current_rev
    except Exception as e:
        logger.error(f"Failed to check migration status: {e}")
        return None

def apply_migration():
    """Apply the SGE Media migration."""
    try:
        alembic_cfg = Config("alembic.ini")
        logger.info("Applying migration...")
        command.upgrade(alembic_cfg, "head")
        logger.info("Migration applied successfully")
        return True
    except Exception as e:
        logger.error(f"Migration failed: {e}")
        return False

def check_sge_tables():
    """Check if SGE tables exist."""
    try:
        engine = create_engine(os.getenv('DATABASE_URL'))
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name LIKE 'sge_%'
                ORDER BY table_name
            """))
            
            tables = [row[0] for row in result.fetchall()]
            logger.info(f"SGE tables found: {tables}")
            return tables
    except Exception as e:
        logger.error(f"Failed to check SGE tables: {e}")
        return []

def main():
    """Main function."""
    logger.info("Starting SGE Media migration check...")
    
    # Check database connection
    if not check_database_connection():
        sys.exit(1)
    
    # Check current migration
    current_rev = check_current_migration()
    
    # Check existing SGE tables
    existing_tables = check_sge_tables()
    
    if existing_tables:
        logger.info("SGE tables already exist")
        return
    
    # Apply migration
    if apply_migration():
        # Check tables again
        new_tables = check_sge_tables()
        if new_tables:
            logger.info("Migration successful - SGE tables created")
        else:
            logger.error("Migration completed but no SGE tables found")
    else:
        logger.error("Migration failed")

if __name__ == "__main__":
    main() 