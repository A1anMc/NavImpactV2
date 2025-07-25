#!/usr/bin/env python3
"""
Frontend-Backend Connectivity Test
Phase 1: Smoke test API calls that frontend will make
"""

import requests
import json

# API base URL (same as frontend config)
BASE_URL = "https://navimpact-api.onrender.com/api/v1"

def test_health_endpoint():
    """Test GET /api/v1/health - Should return 200 OK"""
    
    print("🔍 Testing Health Endpoint")
    print("=" * 40)
    
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=30)
        
        print(f"Status: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ SUCCESS: Health endpoint working")
            print(f"  Status: {data.get('status')}")
            print(f"  Database: {data.get('database')}")
            print(f"  Environment: {data.get('environment')}")
            return True
        else:
            print(f"❌ FAILED: Health endpoint returned {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

def test_projects_endpoint():
    """Test GET /api/v1/projects/ - Should return [] (empty)"""
    
    print("\n🔍 Testing Projects Endpoint")
    print("=" * 40)
    
    try:
        response = requests.get(f"{BASE_URL}/projects/", timeout=30)
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ SUCCESS: Projects endpoint working")
            print(f"  Total projects: {data.get('total', 0)}")
            print(f"  Items: {len(data.get('items', []))}")
            
            if data.get('total') == 0:
                print("  🎯 Expected: Empty project list (fresh database)")
            else:
                print(f"  ⚠️  Unexpected: {data.get('total')} projects found")
                
            return True
        else:
            print(f"❌ FAILED: Projects endpoint returned {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

def test_portfolio_summary_endpoint():
    """Test GET /api/v1/projects/portfolio-summary/ - Should return empty analytics"""
    
    print("\n🔍 Testing Portfolio Summary Endpoint")
    print("=" * 40)
    
    try:
        response = requests.get(f"{BASE_URL}/projects/portfolio-summary/", timeout=30)
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ SUCCESS: Portfolio summary endpoint working")
            print(f"  Total projects: {data.get('total_projects', 0)}")
            print(f"  Framework alignment count: {data.get('framework_alignment_count', 0)}")
            print(f"  SDG alignment count: {data.get('sdg_alignment_count', 0)}")
            
            # Check for Victorian frameworks in breakdown
            framework_breakdown = data.get('framework_breakdown', {})
            victorian_frameworks = [
                'plan_for_victoria',
                'melbourne_2030',
                'activity_centres_program',
                'greenfields_housing_plan',
                'clean_economy_workforce_strategy',
                'victorian_aboriginal_affairs_framework'
            ]
            
            frameworks_found = [f for f in victorian_frameworks if f in framework_breakdown]
            print(f"  Victorian frameworks present: {len(frameworks_found)}/{len(victorian_frameworks)}")
            
            if len(frameworks_found) == len(victorian_frameworks):
                print("  🎯 All Victorian frameworks available for filtering")
            else:
                print("  ⚠️  Missing some Victorian frameworks")
                
            return True
        else:
            print(f"❌ FAILED: Portfolio summary returned {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

def test_framework_filtering():
    """Test framework filtering - Should work even with no projects"""
    
    print("\n🔍 Testing Framework Filtering")
    print("=" * 40)
    
    frameworks_to_test = [
        "Plan for Victoria",
        "Melbourne 2030",
        "Activity Centres Program",
        "Greenfields Housing Plan",
        "Clean Economy Workforce Strategy",
        "Victorian Aboriginal Affairs Framework"
    ]
    
    all_working = True
    
    for framework in frameworks_to_test:
        try:
            response = requests.get(
                f"{BASE_URL}/projects/",
                params={"framework_alignment": framework},
                timeout=30
            )
            
            print(f"Filter '{framework}' - Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"  ✅ Found {data.get('total', 0)} projects")
            else:
                print(f"  ❌ Failed: {response.text}")
                all_working = False
                
        except Exception as e:
            print(f"  ❌ Error: {e}")
            all_working = False
    
    return all_working

def test_sdg_filtering():
    """Test SDG filtering - Should work even with no projects"""
    
    print("\n🔍 Testing SDG Filtering")
    print("=" * 40)
    
    sdgs_to_test = ["SDG 4", "SDG 11", "SDG 13"]
    
    all_working = True
    
    for sdg in sdgs_to_test:
        try:
            response = requests.get(
                f"{BASE_URL}/projects/",
                params={"sdg_tags": sdg},
                timeout=30
            )
            
            print(f"Filter '{sdg}' - Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"  ✅ Found {data.get('total', 0)} projects")
            else:
                print(f"  ❌ Failed: {response.text}")
                all_working = False
                
        except Exception as e:
            print(f"  ❌ Error: {e}")
            all_working = False
    
    return all_working

def main():
    """Main test function"""
    
    print("🎯 FRONTEND-BACKEND CONNECTIVITY TEST")
    print("=" * 60)
    print("Phase 1: Smoke test API calls that frontend will make")
    print("=" * 60)
    
    # Test 1: Health endpoint
    health_ok = test_health_endpoint()
    
    # Test 2: Projects endpoint
    projects_ok = test_projects_endpoint()
    
    # Test 3: Portfolio summary endpoint
    portfolio_ok = test_portfolio_summary_endpoint()
    
    # Test 4: Framework filtering
    framework_ok = test_framework_filtering()
    
    # Test 5: SDG filtering
    sdg_ok = test_sdg_filtering()
    
    print("\n" + "=" * 60)
    print("🎯 CONNECTIVITY TEST RESULTS")
    print("=" * 60)
    
    if health_ok:
        print("✅ Health endpoint: WORKING")
    else:
        print("❌ Health endpoint: FAILED")
    
    if projects_ok:
        print("✅ Projects endpoint: WORKING")
    else:
        print("❌ Projects endpoint: FAILED")
    
    if portfolio_ok:
        print("✅ Portfolio summary: WORKING")
    else:
        print("❌ Portfolio summary: FAILED")
    
    if framework_ok:
        print("✅ Framework filtering: WORKING")
    else:
        print("❌ Framework filtering: FAILED")
    
    if sdg_ok:
        print("✅ SDG filtering: WORKING")
    else:
        print("❌ SDG filtering: FAILED")
    
    # Overall result
    all_tests_passed = health_ok and projects_ok and portfolio_ok and framework_ok and sdg_ok
    
    print("\n" + "=" * 60)
    if all_tests_passed:
        print("🎉 ALL TESTS PASSED!")
        print("✅ Frontend can connect to backend successfully")
        print("✅ All required endpoints are working")
        print("✅ Framework filtering is functional")
        print("✅ Ready for frontend integration")
    else:
        print("❌ SOME TESTS FAILED")
        print("⚠️  Check the failed endpoints above")
        print("⚠️  Frontend integration may have issues")
    
    print("\n🚀 Next: Phase 2 - Seed demo data for testing")

if __name__ == "__main__":
    main() 