#!/usr/bin/env python3
"""
Safe test script for real grants functions - minimal dependencies only
"""

import sys
import os
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

def test_configuration():
    """Test 1: Configuration setup"""
    print("🔍 STEP 1: Testing Configuration")
    print("=" * 50)
    
    try:
        from app.core.config import settings
        print("✅ Configuration imported successfully")
        
        # Check for ALLOWED_SCRAPER_SOURCES
        if hasattr(settings, 'ALLOWED_SCRAPER_SOURCES'):
            print("✅ ALLOWED_SCRAPER_SOURCES found")
            sources = settings.ALLOWED_SCRAPER_SOURCES
            print(f"   Sources: {list(sources.keys())}")
            return True
        else:
            print("❌ ALLOWED_SCRAPER_SOURCES missing")
            return False
            
    except Exception as e:
        print(f"❌ Configuration test failed: {e}")
        return False

def test_scraper_imports():
    """Test 2: Scraper imports"""
    print("\n STEP 2: Testing Scraper Imports")
    print("=" * 50)
    
    try:
        from app.services.scrapers.base_scraper import BaseScraper
        print("✅ BaseScraper imported")
        
        from app.services.scrapers.australian_grants_scraper import AustralianGrantsScraper
        print("✅ AustralianGrantsScraper imported")
        
        from app.services.scrapers.business_gov import BusinessGovScraper
        print("✅ BusinessGovScraper imported")
        
        from app.services.scrapers.media_investment_scraper import MediaInvestmentScraper
        print("✅ MediaInvestmentScraper imported")
        
        return True
        
    except Exception as e:
        print(f"❌ Scraper imports failed: {e}")
        return False

def test_database():
    """Test 3: Database connectivity"""
    print("\n🔍 STEP 3: Testing Database")
    print("=" * 50)
    
    try:
        from app.db.session import get_db
        from app.models.grant import Grant
        print("✅ Database components imported")
        
        db = next(get_db())
        grant_count = db.query(Grant).count()
        print(f"✅ Database connected, {grant_count} grants found")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        return False

def test_api_endpoints():
    """Test 4: API endpoints"""
    print("\n🔍 STEP 4: Testing API Endpoints")
    print("=" * 50)
    
    try:
        from app.api.v1.endpoints.grants import router
        print("✅ Grants API router imported")
        
        routes = [route.path for route in router.routes]
        print(f"✅ Found {len(routes)} API routes")
        
        return True
        
    except Exception as e:
        print(f"❌ API endpoints test failed: {e}")
        return False

def main():
    """Run all tests safely"""
    print("🚀 SAFE REAL GRANTS FUNCTIONS TEST")
    print("=" * 60)
    print("Testing with minimal dependencies only")
    print("=" * 60)
    
    tests = [
        ("Configuration", test_configuration),
        ("Scraper Imports", test_scraper_imports),
        ("Database", test_database),
        ("API Endpoints", test_api_endpoints),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} crashed: {e}")
            results.append((test_name, False))
    
    # Summary
    print(f"\n{'='*60}")
    print(" TEST SUMMARY")
    print(f"{'='*60}")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\n Result: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
    else:
        print("⚠️  Some tests failed - configuration fixes needed")
    
    return passed == total

if __name__ == "__main__":
    main() 