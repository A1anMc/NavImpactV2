#!/usr/bin/env python3
"""
Manual script to create the industry_news table in production
This bypasses migration issues and creates the table directly
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.config import settings

def create_news_table():
    """Create the industry_news table manually"""
    
    # Create database engine
    engine = create_engine(settings.DATABASE_URL)
    
    # SQL to create the table with all required fields
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS industry_news (
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
    
    # SQL to create indexes
    create_indexes_sql = """
    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS ix_industry_news_sector ON industry_news (sector);
    CREATE UNIQUE INDEX IF NOT EXISTS ix_industry_news_url_hash ON industry_news (url_hash);
    CREATE INDEX IF NOT EXISTS idx_industry_news_sector_published ON industry_news (sector, published_at);
    CREATE INDEX IF NOT EXISTS idx_industry_news_relevance ON industry_news (relevance_score);
    CREATE INDEX IF NOT EXISTS idx_industry_news_created ON industry_news (created_at);
    CREATE INDEX IF NOT EXISTS idx_industry_news_platform ON industry_news (platform);
    """
    
    try:
        with engine.connect() as conn:
            print("🔧 Creating industry_news table...")
            conn.execute(text(create_table_sql))
            conn.commit()
            print("✅ Table created successfully!")
            
            print("🔧 Creating indexes...")
            conn.execute(text(create_indexes_sql))
            conn.commit()
            print("✅ Indexes created successfully!")
            
            # Verify table exists
            result = conn.execute(text("SELECT COUNT(*) FROM industry_news"))
            count = result.scalar()
            print(f"✅ Table verification: {count} rows found")
            
            print("\n🎉 industry_news table created successfully!")
            return True
            
    except SQLAlchemyError as e:
        print(f"❌ Error creating table: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Creating industry_news table manually...")
    success = create_news_table()
    
    if success:
        print("\n✅ SUCCESS: News table is ready for use!")
        print("📝 Next steps:")
        print("   1. Test the news endpoints")
        print("   2. Seed the table with sample data")
        print("   3. Verify frontend integration")
    else:
        print("\n❌ FAILED: Table creation failed")
        sys.exit(1) 