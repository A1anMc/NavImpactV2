#!/usr/bin/env python3
"""
Test script to check production database connection and industry_news table
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

# Set production environment
os.environ["ENVIRONMENT"] = "production"
os.environ["RENDER"] = "true"

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.config import settings

def test_production_db():
    """Test production database connection and industry_news table"""
    
    print("🔍 Testing production database connection...")
    
    # Create database engine
    engine = create_engine(settings.DATABASE_URL)
    
    try:
        with engine.connect() as conn:
            print("✅ Database connection successful!")
            
            # Test basic query
            result = conn.execute(text("SELECT 1 as test"))
            print(f"✅ Basic query test: {result.scalar()}")
            
            # Test if industry_news table exists
            result = conn.execute(text("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'industry_news'
                )
            """))
            table_exists = result.scalar()
            print(f"✅ industry_news table exists: {table_exists}")
            
            if table_exists:
                # Test querying the table
                result = conn.execute(text("SELECT COUNT(*) FROM industry_news"))
                count = result.scalar()
                print(f"✅ industry_news table has {count} records")
                
                # Test a simple query with the model structure
                result = conn.execute(text("""
                    SELECT id, sector, title, url, published_at 
                    FROM industry_news 
                    WHERE sector = 'tech' 
                    LIMIT 3
                """))
                rows = result.fetchall()
                print(f"✅ Found {len(rows)} tech news records")
                
                for row in rows:
                    print(f"   - {row[1]}: {row[2]}")
            
            return True
            
    except SQLAlchemyError as e:
        print(f"❌ Database error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    success = test_production_db()
    if not success:
        sys.exit(1) 