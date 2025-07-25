#!/usr/bin/env python3
"""
Debug Projects Page
Detailed debugging of the projects page to identify specific issues
"""

import requests
import json
from typing import Dict, Any

# Configuration
FRONTEND_URL = "https://navimpact-web.onrender.com"
BACKEND_URL = "https://navimpact-api.onrender.com"

def debug_projects_page():
    """Debug the projects page for specific issues"""
    print("🔍 DEBUGGING PROJECTS PAGE")
    print("=" * 60)
    
    # Test 1: Check if projects page loads
    print("\n🔍 Test 1: Projects Page Load")
    print("-" * 40)
    try:
        response = requests.get(f"{FRONTEND_URL}/projects", timeout=30)
        print(f"  Status: {response.status_code}")
        print(f"  Content Length: {len(response.text)} characters")
        
        if response.status_code == 200:
            content = response.text
            
            # Check for key content
            checks = [
                ("projects", "projects" in content.lower()),
                ("framework", "framework" in content.lower()),
                ("impact", "impact" in content.lower()),
                ("victorian", "victorian" in content.lower()),
                ("badgeLabel", "badgeLabel" in content),
                ("VICTORIAN_FRAMEWORKS", "VICTORIAN_FRAMEWORKS" in content),
                ("displayProjects", "displayProjects" in content),
                ("displaySummary", "displaySummary" in content),
            ]
            
            print("  Content Checks:")
            for check_name, result in checks:
                status = "✅" if result else "❌"
                print(f"    {status} {check_name}: {result}")
            
            # Check for potential error indicators
            error_indicators = [
                "error",
                "undefined",
                "null",
                "exception",
                "failed",
                "broken",
                "cannot read",
                "typeerror"
            ]
            
            print("\n  Error Indicators:")
            for indicator in error_indicators:
                if indicator in content.lower():
                    print(f"    ⚠️  Found '{indicator}' in content")
            
            return True
        else:
            print(f"  ❌ FAILED: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"  ❌ ERROR: {str(e)}")
        return False

def check_backend_data():
    """Check the backend data that the frontend should be using"""
    print("\n🔍 Test 2: Backend Data Check")
    print("-" * 40)
    
    try:
        # Check projects
        response = requests.get(f"{BACKEND_URL}/api/v1/projects/", timeout=15)
        if response.status_code == 200:
            data = response.json()
            print(f"  ✅ Projects endpoint working")
            print(f"  Total projects: {data.get('total', 0)}")
            
            for project in data.get('items', []):
                print(f"    - {project.get('name')} (ID: {project.get('id')})")
                print(f"      Framework: {project.get('framework_alignment', [])}")
                print(f"      SDG: {project.get('sdg_tags', [])}")
                print(f"      Status: {project.get('status')}")
        else:
            print(f"  ❌ Projects endpoint error: {response.status_code}")
            return False
        
        # Check portfolio summary
        response = requests.get(f"{BACKEND_URL}/api/v1/projects/portfolio-summary/", timeout=15)
        if response.status_code == 200:
            data = response.json()
            print(f"\n  ✅ Portfolio summary working")
            print(f"  Total projects: {data.get('total_projects', 0)}")
            print(f"  Framework alignment: {data.get('framework_alignment_count', 0)}")
            print(f"  Framework breakdown: {data.get('framework_breakdown', {})}")
        else:
            print(f"  ❌ Portfolio summary error: {response.status_code}")
            return False
            
        return True
        
    except Exception as e:
        print(f"  ❌ ERROR: {str(e)}")
        return False

def check_frontend_api_calls():
    """Check if frontend can make API calls to backend"""
    print("\n🔍 Test 3: Frontend API Connectivity")
    print("-" * 40)
    
    try:
        # Test if frontend has API routes
        response = requests.get(f"{FRONTEND_URL}/api/health", timeout=15)
        print(f"  Frontend API health: {response.status_code}")
        
        if response.status_code == 200:
            print("  ✅ Frontend API routes working")
            return True
        else:
            print("  ❌ Frontend API routes not working")
            return False
            
    except Exception as e:
        print(f"  ❌ ERROR: {str(e)}")
        return False

def main():
    """Run all debugging tests"""
    print("🎯 PROJECTS PAGE DEBUGGING")
    print("=" * 60)
    
    results = []
    
    # Run tests
    results.append(debug_projects_page())
    results.append(check_backend_data())
    results.append(check_frontend_api_calls())
    
    # Summary
    print("\n" + "=" * 60)
    print("🎯 DEBUGGING RESULTS")
    print("=" * 60)
    
    passed = sum(results)
    total = len(results)
    
    print(f"✅ Tests Passed: {passed}/{total}")
    
    if passed == total:
        print("🎉 All debugging tests passed!")
        print("✅ The projects page should be working correctly")
        print("\n🔍 If you're still seeing issues, check:")
        print("  1. Browser console for JavaScript errors")
        print("  2. Network tab for failed API calls")
        print("  3. Browser cache (try hard refresh)")
        print("  4. Different browser or incognito mode")
    else:
        print("❌ Some debugging tests failed")
        print("⚠️  Check the failed tests above for specific issues")
    
    print("\n🌐 URLs to test:")
    print(f"  Frontend: {FRONTEND_URL}/projects")
    print(f"  Backend: {BACKEND_URL}/api/v1/projects/")
    
    print("=" * 60)

if __name__ == "__main__":
    main() 