#!/usr/bin/env python3
"""
Test script for business.gov.au scraper known grants
"""

import asyncio
import sys
import os
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

async def test_business_gov_known_grants():
    """Test the business.gov.au scraper with known grants."""
    try:
        from app.db.session import get_db
        from app.services.scrapers.business_gov import BusinessGovScraper
        
        print("🔍 Testing Business.gov.au Known Grants")
        print("=" * 40)
        
        # Get database session
        db = next(get_db())
        
        try:
            # Initialize scraper
            scraper = BusinessGovScraper(db)
            print("✅ Scraper initialized successfully")
            
            # Test the known grants processing
            print("🔄 Processing known grants...")
            results = await scraper._process_known_grants()
            
            print(f"✅ Known grants processed: {len(results)} grants found")
            
            # Show some results
            for i, grant in enumerate(results[:3]):  # Show first 3
                print(f"  {i+1}. {grant.get('title', 'No title')}")
                print(f"     Amount: {grant.get('min_amount', 'N/A')} - {grant.get('max_amount', 'N/A')}")
                print(f"     Source: {grant.get('source_url', 'N/A')}")
                print()
                
            # Test saving to database
            print("🔄 Testing database save...")
            try:
                # This will test if the grant data can be saved
                for grant_data in results[:2]:  # Test first 2
                    grant = scraper._create_grant_from_data(grant_data)
                    if grant:
                        print(f"✅ Grant '{grant.title}' can be saved to database")
                    else:
                        print(f"❌ Failed to create grant from data")
            except Exception as e:
                print(f"❌ Database save test error: {e}")
                
        except Exception as e:
            print(f"❌ Scraper error: {e}")
            import traceback
            traceback.print_exc()
            
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ Setup error: {e}")

if __name__ == "__main__":
    asyncio.run(test_business_gov_known_grants()) 