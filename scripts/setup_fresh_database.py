#!/usr/bin/env python3
"""
Fresh Database Setup Script
Sets up a new database with clean migrations and imports data
"""

import os
import sys
import json
import subprocess
from datetime import datetime
import logging

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FreshDatabaseSetup:
    def __init__(self):
        self.export_file = None
        self.migration_script = None
        
    def find_latest_export(self):
        """Find the latest database export file"""
        export_files = [f for f in os.listdir('.') if f.startswith('database_export_') and f.endswith('.json')]
        if not export_files:
            logger.error("❌ No database export files found!")
            return None
        
        # Sort by timestamp and get the latest
        export_files.sort(reverse=True)
        self.export_file = export_files[0]
        logger.info(f"📄 Using export file: {self.export_file}")
        return self.export_file
    
    def find_latest_migration_script(self):
        """Find the latest migration script file"""
        migration_files = [f for f in os.listdir('.') if f.startswith('migration_script_') and f.endswith('.sql')]
        if not migration_files:
            logger.error("❌ No migration script files found!")
            return None
        
        # Sort by timestamp and get the latest
        migration_files.sort(reverse=True)
        self.migration_script = migration_files[0]
        logger.info(f"📝 Using migration script: {self.migration_script}")
        return self.migration_script
    
    def clean_migrations(self):
        """Clean up migration files to start fresh"""
        logger.info("🧹 Cleaning up migration files...")
        
        # Remove all migration files except the initial ones
        migrations_dir = "alembic/versions"
        if os.path.exists(migrations_dir):
            for file in os.listdir(migrations_dir):
                if file.endswith('.py') and not file.startswith('000_') and not file.startswith('001_'):
                    file_path = os.path.join(migrations_dir, file)
                    os.remove(file_path)
                    logger.info(f"🗑️  Removed: {file}")
        
        # Create a fresh initial migration
        self.create_fresh_migration()
    
    def create_fresh_migration(self):
        """Create a fresh initial migration with all current models"""
        logger.info("📝 Creating fresh migration...")
        
        try:
            # Run alembic revision --autogenerate
            result = subprocess.run([
                "alembic", "revision", "--autogenerate", "-m", "Fresh database setup with all models"
            ], capture_output=True, text=True, cwd=os.path.dirname(os.path.dirname(__file__)))
            
            if result.returncode == 0:
                logger.info("✅ Fresh migration created successfully")
                return True
            else:
                logger.error(f"❌ Failed to create migration: {result.stderr}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Error creating migration: {str(e)}")
            return False
    
    def setup_new_database(self, new_database_url):
        """Set up a new database with the fresh migration"""
        logger.info("🗄️  Setting up new database...")
        
        # Update the DATABASE_URL temporarily
        original_url = os.environ.get('DATABASE_URL')
        os.environ['DATABASE_URL'] = new_database_url
        
        try:
            # Run alembic upgrade head
            result = subprocess.run([
                "alembic", "upgrade", "head"
            ], capture_output=True, text=True, cwd=os.path.dirname(os.path.dirname(__file__)))
            
            if result.returncode == 0:
                logger.info("✅ Database schema created successfully")
                return True
            else:
                logger.error(f"❌ Failed to create schema: {result.stderr}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Error setting up database: {str(e)}")
            return False
        finally:
            # Restore original DATABASE_URL
            if original_url:
                os.environ['DATABASE_URL'] = original_url
            else:
                os.environ.pop('DATABASE_URL', None)
    
    def import_data(self, new_database_url):
        """Import data from the migration script"""
        if not self.migration_script:
            logger.error("❌ No migration script found!")
            return False
        
        logger.info(f"📥 Importing data from {self.migration_script}...")
        
        try:
            # Read the migration script
            with open(self.migration_script, 'r') as f:
                sql_commands = f.read()
            
            # Split into individual commands
            commands = [cmd.strip() for cmd in sql_commands.split(';') if cmd.strip()]
            
            # Execute each command
            import psycopg2
            from urllib.parse import urlparse
            
            # Parse the database URL
            parsed = urlparse(new_database_url)
            conn = psycopg2.connect(
                host=parsed.hostname,
                port=parsed.port,
                database=parsed.path[1:],  # Remove leading slash
                user=parsed.username,
                password=parsed.password
            )
            
            cursor = conn.cursor()
            
            for i, command in enumerate(commands):
                if command and not command.startswith('--'):
                    try:
                        cursor.execute(command)
                        logger.info(f"✅ Executed command {i+1}/{len(commands)}")
                    except Exception as e:
                        logger.warning(f"⚠️  Command {i+1} failed: {str(e)}")
                        # Continue with other commands
            
            conn.commit()
            cursor.close()
            conn.close()
            
            logger.info("✅ Data import completed")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error importing data: {str(e)}")
            return False
    
    def verify_setup(self, new_database_url):
        """Verify the new database setup"""
        logger.info("🔍 Verifying database setup...")
        
        try:
            import psycopg2
            from urllib.parse import urlparse
            
            # Parse the database URL
            parsed = urlparse(new_database_url)
            conn = psycopg2.connect(
                host=parsed.hostname,
                port=parsed.port,
                database=parsed.path[1:],
                user=parsed.username,
                password=parsed.password
            )
            
            cursor = conn.cursor()
            
            # Check tables
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_type = 'BASE TABLE'
                ORDER BY table_name
            """)
            tables = [row[0] for row in cursor.fetchall()]
            
            # Check row counts
            table_counts = {}
            for table in tables:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                table_counts[table] = count
            
            cursor.close()
            conn.close()
            
            logger.info(f"📊 Database verification:")
            logger.info(f"   Tables: {len(tables)}")
            for table, count in table_counts.items():
                logger.info(f"   - {table}: {count} rows")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Error verifying setup: {str(e)}")
            return False
    
    def generate_deployment_guide(self, new_database_url):
        """Generate a deployment guide for the new database"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        guide_file = f"deployment_guide_{timestamp}.md"
        
        try:
            with open(guide_file, 'w') as f:
                f.write("# NavImpact Fresh Database Deployment Guide\n\n")
                f.write(f"Generated: {datetime.now().isoformat()}\n\n")
                
                f.write("## 🚀 Deployment Steps\n\n")
                f.write("### 1. Create New Database\n")
                f.write(f"Create a new PostgreSQL database and update the DATABASE_URL:\n")
                f.write(f"```\nDATABASE_URL={new_database_url}\n```\n\n")
                
                f.write("### 2. Update Environment Variables\n")
                f.write("Update your environment variables with the new database URL:\n")
                f.write("- Render Dashboard → Environment Variables\n")
                f.write("- Update DATABASE_URL\n\n")
                
                f.write("### 3. Deploy Application\n")
                f.write("Deploy the application with the fresh migrations:\n")
                f.write("```bash\ngit add .\ngit commit -m 'Fresh database setup'\ngit push origin main\n```\n\n")
                
                f.write("### 4. Import Data\n")
                f.write(f"Import data using the migration script: `{self.migration_script}`\n\n")
                
                f.write("### 5. Verify Setup\n")
                f.write("Run the verification script to ensure everything is working.\n\n")
                
                f.write("## 📁 Generated Files\n")
                f.write(f"- Export: `{self.export_file}`\n")
                f.write(f"- Migration: `{self.migration_script}`\n")
                f.write(f"- Guide: `{guide_file}`\n\n")
                
                f.write("## 🔧 Troubleshooting\n")
                f.write("If you encounter issues:\n")
                f.write("1. Check database connection\n")
                f.write("2. Verify environment variables\n")
                f.write("3. Check migration logs\n")
                f.write("4. Restore from backup if needed\n")
            
            logger.info(f"📖 Deployment guide generated: {guide_file}")
            return guide_file
            
        except Exception as e:
            logger.error(f"❌ Error generating guide: {str(e)}")
            return None

def main():
    """Main setup function"""
    print("🗄️  NavImpact Fresh Database Setup")
    print("=" * 50)
    
    setup = FreshDatabaseSetup()
    
    # Find export files
    if not setup.find_latest_export():
        return 1
    
    if not setup.find_latest_migration_script():
        return 1
    
    print("\n📋 Setup Options:")
    print("1. Clean migrations and prepare for new database")
    print("2. Set up new database (requires DATABASE_URL)")
    print("3. Import data to new database")
    print("4. Verify setup")
    print("5. Generate deployment guide")
    
    choice = input("\nEnter your choice (1-5): ").strip()
    
    if choice == "1":
        setup.clean_migrations()
        print("✅ Migrations cleaned. Ready for new database setup.")
        
    elif choice == "2":
        new_url = input("Enter new DATABASE_URL: ").strip()
        if new_url:
            setup.setup_new_database(new_url)
        else:
            print("❌ No DATABASE_URL provided")
            
    elif choice == "3":
        new_url = input("Enter new DATABASE_URL: ").strip()
        if new_url:
            setup.import_data(new_url)
        else:
            print("❌ No DATABASE_URL provided")
            
    elif choice == "4":
        new_url = input("Enter DATABASE_URL to verify: ").strip()
        if new_url:
            setup.verify_setup(new_url)
        else:
            print("❌ No DATABASE_URL provided")
            
    elif choice == "5":
        new_url = input("Enter new DATABASE_URL for guide: ").strip()
        if new_url:
            setup.generate_deployment_guide(new_url)
        else:
            print("❌ No DATABASE_URL provided")
            
    else:
        print("❌ Invalid choice")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main()) 