#!/usr/bin/env python3
"""
Simple test script for scrapers
"""

import asyncio
import sys
import os
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

async def test_scraper():
    """Test a scraper directly."""
    try:
        from app.db.session import get_db
        from app.services.scrapers.australian_grants_scraper import AustralianGrantsScraper
        
        print("🔍 Testing Australian Grants Scraper")
        print("=" * 40)
        
        # Get database session
        db = next(get_db())
        
        try:
            # Initialize scraper
            scraper = AustralianGrantsScraper(db)
            print("✅ Scraper initialized successfully")
            
            # Test the scrape method
            print("🔄 Starting scrape...")
            results = await scraper.scrape()
            
            print(f"✅ Scrape completed: {len(results)} grants found")
            
            # Show some results
            for i, grant in enumerate(results[:3]):  # Show first 3
                print(f"  {i+1}. {grant.get('title', 'No title')}")
                print(f"     Amount: {grant.get('min_amount', 'N/A')} - {grant.get('max_amount', 'N/A')}")
                print(f"     Source: {grant.get('source_url', 'N/A')}")
                print()
                
        except Exception as e:
            print(f"❌ Scraper error: {e}")
            import traceback
            traceback.print_exc()
            
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ Setup error: {e}")

if __name__ == "__main__":
    asyncio.run(test_scraper()) 