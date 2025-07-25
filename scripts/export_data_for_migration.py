#!/usr/bin/env python3
"""
Data Export Script for Database Migration
Exports all data from current database for migration to new database
"""

import json
import os
import sys
from datetime import datetime
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import logging

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataExporter:
    def __init__(self):
        self.engine = None
        self.session = None
        self.export_data = {}
        
    def connect_to_database(self):
        """Connect to the current database"""
        try:
            database_url = settings.DATABASE_URL
            if not database_url:
                if settings.ENV == "production":
                    database_url = "postgresql://navimpact:g1eSzQIQfN7GiGEElTXlcZddSQv2yYyE@dpg-d1vj88juibrs739eo5dg-a/navimpact"
                else:
                    database_url = "postgresql://navimpact:g1eSzQIQfN7GiGEElTXlcZddSQv2yYyE@dpg-d1vj88juibrs739eo5dg-a/navimpact"
            
            self.engine = create_engine(database_url)
            SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
            self.session = SessionLocal()
            
            # Test connection
            result = self.session.execute(text("SELECT 1"))
            logger.info("✅ Database connection successful")
            return True
            
        except Exception as e:
            logger.error(f"❌ Database connection failed: {str(e)}")
            return False
    
    def get_table_list(self):
        """Get list of all tables in the database"""
        try:
            result = self.session.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_type = 'BASE TABLE'
                ORDER BY table_name
            """))
            tables = [row[0] for row in result.fetchall()]
            logger.info(f"📋 Found {len(tables)} tables: {tables}")
            return tables
        except Exception as e:
            logger.error(f"❌ Error getting table list: {str(e)}")
            return []
    
    def export_table_data(self, table_name):
        """Export data from a specific table"""
        try:
            # Get table structure
            result = self.session.execute(text(f"""
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns 
                WHERE table_name = '{table_name}' 
                AND table_schema = 'public'
                ORDER BY ordinal_position
            """))
            columns = [row[0] for row in result.fetchall()]
            
            # Get table data
            result = self.session.execute(text(f"SELECT * FROM {table_name}"))
            rows = []
            for row in result.fetchall():
                row_dict = {}
                for i, value in enumerate(row):
                    if isinstance(value, datetime):
                        row_dict[columns[i]] = value.isoformat()
                    else:
                        row_dict[columns[i]] = value
                rows.append(row_dict)
            
            table_data = {
                "table_name": table_name,
                "columns": columns,
                "row_count": len(rows),
                "data": rows,
                "exported_at": datetime.now().isoformat()
            }
            
            logger.info(f"📊 Exported {len(rows)} rows from {table_name}")
            return table_data
            
        except Exception as e:
            logger.error(f"❌ Error exporting table {table_name}: {str(e)}")
            return None
    
    def export_all_data(self):
        """Export all data from all tables"""
        if not self.connect_to_database():
            return False
        
        tables = self.get_table_list()
        if not tables:
            return False
        
        self.export_data = {
            "export_info": {
                "exported_at": datetime.now().isoformat(),
                "database_url": settings.DATABASE_URL if settings.DATABASE_URL else "postgresql://navimpact:g1eSzQIQfN7GiGEElTXlcZddSQv2yYyE@dpg-d1vj88juibrs739eo5dg-a/navimpact",
                "environment": settings.ENV,
                "total_tables": len(tables)
            },
            "tables": {}
        }
        
        for table_name in tables:
            table_data = self.export_table_data(table_name)
            if table_data:
                self.export_data["tables"][table_name] = table_data
        
        return True
    
    def save_export(self, filename=None):
        """Save exported data to JSON file"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"database_export_{timestamp}.json"
        
        try:
            with open(filename, 'w') as f:
                json.dump(self.export_data, f, indent=2, default=str)
            
            logger.info(f"💾 Data exported to {filename}")
            return filename
        except Exception as e:
            logger.error(f"❌ Error saving export: {str(e)}")
            return None
    
    def generate_migration_script(self, filename=None):
        """Generate SQL migration script for new database"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"migration_script_{timestamp}.sql"
        
        try:
            with open(filename, 'w') as f:
                f.write("-- NavImpact Database Migration Script\n")
                f.write(f"-- Generated: {datetime.now().isoformat()}\n")
                f.write("-- This script will recreate all data in a new database\n\n")
                
                for table_name, table_data in self.export_data["tables"].items():
                    if not table_data["data"]:
                        continue
                    
                    f.write(f"\n-- Table: {table_name}\n")
                    f.write(f"-- Rows: {table_data['row_count']}\n")
                    
                    for row in table_data["data"]:
                        columns = list(row.keys())
                        values = []
                        
                        for col in columns:
                            value = row[col]
                            if value is None:
                                values.append("NULL")
                            elif isinstance(value, str):
                                # Escape single quotes
                                escaped_value = value.replace("'", "''")
                                values.append(f"'{escaped_value}'")
                            elif isinstance(value, bool):
                                values.append("true" if value else "false")
                            else:
                                values.append(str(value))
                        
                        f.write(f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(values)});\n")
                    
                    f.write(f"\n-- End of table {table_name}\n")
            
            logger.info(f"📝 Migration script generated: {filename}")
            return filename
        except Exception as e:
            logger.error(f"❌ Error generating migration script: {str(e)}")
            return None
    
    def close(self):
        """Close database connection"""
        if self.session:
            self.session.close()
        if self.engine:
            self.engine.dispose()

def main():
    """Main export function"""
    print("🗄️  NavImpact Database Export for Migration")
    print("=" * 50)
    
    exporter = DataExporter()
    
    try:
        # Export all data
        if exporter.export_all_data():
            # Save JSON export
            json_file = exporter.save_export()
            
            # Generate SQL migration script
            sql_file = exporter.generate_migration_script()
            
            print("\n✅ Export completed successfully!")
            print(f"📄 JSON Export: {json_file}")
            print(f"📝 SQL Migration: {sql_file}")
            
            # Show summary
            total_rows = sum(table["row_count"] for table in exporter.export_data["tables"].values())
            print(f"\n📊 Summary:")
            print(f"   Tables: {len(exporter.export_data['tables'])}")
            print(f"   Total Rows: {total_rows}")
            
            for table_name, table_data in exporter.export_data["tables"].items():
                print(f"   - {table_name}: {table_data['row_count']} rows")
            
        else:
            print("❌ Export failed!")
            return 1
            
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        return 1
    finally:
        exporter.close()
    
    return 0

if __name__ == "__main__":
    exit(main()) 