#!/usr/bin/env python3
"""
Fix the industry_news table by recreating it with all required columns
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.config import settings

def fix_news_table():
    """Recreate the industry_news table with all required columns"""
    
    # Create database engine
    engine = create_engine(settings.DATABASE_URL)
    
    # SQL to drop and recreate the table with all required fields
    recreate_table_sql = """
    -- Drop existing table if it exists
    DROP TABLE IF EXISTS industry_news CASCADE;
    
    -- Create table with all required fields
    CREATE TABLE industry_news (
        id SERIAL PRIMARY KEY,
        sector VARCHAR(100) NOT NULL,
        title TEXT NOT NULL,
        summary TEXT,
        url TEXT NOT NULL,
        url_hash VARCHAR(32) NOT NULL,
        source VARCHAR(200),
        platform VARCHAR(50),
        platform_icon VARCHAR(50),
        relevance_score DECIMAL(3,2),
        published_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """
    
    # SQL to create all indexes
    create_indexes_sql = """
    -- Create indexes for better performance
    CREATE INDEX ix_industry_news_sector ON industry_news (sector);
    CREATE UNIQUE INDEX ix_industry_news_url_hash ON industry_news (url_hash);
    CREATE INDEX idx_industry_news_sector_published ON industry_news (sector, published_at);
    CREATE INDEX idx_industry_news_relevance ON industry_news (relevance_score);
    CREATE INDEX idx_industry_news_created ON industry_news (created_at);
    CREATE INDEX idx_industry_news_platform ON industry_news (platform);
    """
    
    try:
        with engine.connect() as conn:
            print("🔧 Dropping and recreating industry_news table...")
            conn.execute(text(recreate_table_sql))
            conn.commit()
            print("✅ Table recreated successfully!")
            
            print("🔧 Creating indexes...")
            conn.execute(text(create_indexes_sql))
            conn.commit()
            print("✅ Indexes created successfully!")
            
            # Verify table exists and has correct structure
            result = conn.execute(text("SELECT COUNT(*) FROM industry_news"))
            count = result.scalar()
            print(f"✅ Table verification: {count} rows found")
            
            # Check columns
            columns_result = conn.execute(text("""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'industry_news' 
                ORDER BY ordinal_position
            """))
            columns = columns_result.fetchall()
            print("✅ Table columns:")
            for col in columns:
                print(f"   - {col[0]}: {col[1]}")
            
            print("\n🎉 industry_news table fixed successfully!")
            return True
            
    except SQLAlchemyError as e:
        print(f"❌ Error fixing table: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Fixing industry_news table...")
    success = fix_news_table()
    
    if success:
        print("\n✅ SUCCESS: News table is ready for use!")
        print("📝 Next steps:")
        print("   1. Test the news endpoints")
        print("   2. Seed the table with sample data")
        print("   3. Verify frontend integration")
    else:
        print("\n❌ FAILED: Table fix failed")
        sys.exit(1) 