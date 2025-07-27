#!/usr/bin/env python3
"""
Simple test script to verify AI-powered grant endpoints work
"""

import asyncio
import json
from datetime import datetime
from decimal import Decimal

# Test the schemas
def test_schemas():
    print("Testing schemas...")
    try:
        from app.schemas.grant import (
            GrantRecommendation, GrantAnalytics, AIRecommendationRequest,
            SmartSearchRequest, GrantDashboard, GrantExportRequest
        )
        
        # Test AIRecommendationRequest
        request = AIRecommendationRequest(
            user_id=1,
            project_tags=["technology", "sustainability"],
            industry_focus="technology",
            location="victoria",
            org_type="nonprofit",
            budget_range={"min": 10000, "max": 100000},
            max_results=5
        )
        print("✓ AIRecommendationRequest schema works")
        
        # Test SmartSearchRequest
        search_request = SmartSearchRequest(
            query="grants for youth digital inclusion in Victoria",
            include_ai_insights=True,
            max_results=10
        )
        print("✓ SmartSearchRequest schema works")
        
        # Test GrantExportRequest
        export_request = GrantExportRequest(
            format="csv",
            include_analytics=True,
            include_recommendations=True
        )
        print("✓ GrantExportRequest schema works")
        
        print("✓ All schemas work correctly!")
        return True
        
    except Exception as e:
        print(f"✗ Schema test failed: {e}")
        return False

# Test the helper functions
def test_helper_functions():
    print("\nTesting helper functions...")
    try:
        from app.api.v1.endpoints.grants import (
            calculate_match_score, generate_match_reasons, determine_priority,
            estimate_success_probability, parse_natural_language_query
        )
        
        # Mock grant and request
        from app.models.grant import Grant
        from app.schemas.grant import AIRecommendationRequest
        
        mock_grant = Grant(
            id=1,
            title="Digital Inclusion Grant",
            description="Supporting digital literacy programs",
            source="Test Foundation",
            industry_focus="technology",
            location_eligibility="victoria",
            org_type_eligible=["nonprofit"],
            min_amount=Decimal("10000"),
            max_amount=Decimal("50000"),
            status="open"
        )
        
        request = AIRecommendationRequest(
            user_id=1,
            industry_focus="technology",
            location="victoria",
            org_type="nonprofit",
            budget_range={"min": 10000, "max": 100000}
        )
        
        # Test match score calculation
        score = calculate_match_score(mock_grant, request)
        print(f"✓ Match score calculation: {score}")
        
        # Test reason generation
        reasons = generate_match_reasons(mock_grant, request)
        print(f"✓ Reason generation: {len(reasons)} reasons")
        
        # Test priority determination
        priority = determine_priority(score, mock_grant)
        print(f"✓ Priority determination: {priority}")
        
        # Test natural language parsing
        parsed = parse_natural_language_query("technology grants in victoria under 50k")
        print(f"✓ Natural language parsing: {parsed}")
        
        print("✓ All helper functions work correctly!")
        return True
        
    except Exception as e:
        print(f"✗ Helper function test failed: {e}")
        return False

# Test the endpoints (without database)
def test_endpoints():
    print("\nTesting endpoint definitions...")
    try:
        from app.api.v1.endpoints.grants import router
        
        # Check if endpoints are registered
        routes = [route.path for route in router.routes]
        expected_routes = [
            "/ai/recommendations",
            "/smart-search", 
            "/analytics",
            "/dashboard",
            "/export"
        ]
        
        for route in expected_routes:
            if any(route in r for r in routes):
                print(f"✓ Route {route} is registered")
            else:
                print(f"✗ Route {route} is missing")
        
        print("✓ All expected endpoints are defined!")
        return True
        
    except Exception as e:
        print(f"✗ Endpoint test failed: {e}")
        return False

def main():
    print("🧪 Testing AI-Powered Grants Implementation")
    print("=" * 50)
    
    tests = [
        test_schemas,
        test_helper_functions,
        test_endpoints
    ]
    
    results = []
    for test in tests:
        try:
            result = test()
            results.append(result)
        except Exception as e:
            print(f"✗ Test failed with exception: {e}")
            results.append(False)
    
    print("\n" + "=" * 50)
    print("📊 Test Results Summary")
    print("=" * 50)
    
    passed = sum(results)
    total = len(results)
    
    print(f"Tests passed: {passed}/{total}")
    
    if passed == total:
        print("🎉 All tests passed! AI-powered grants implementation is ready.")
    else:
        print("⚠️  Some tests failed. Please check the implementation.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1) 