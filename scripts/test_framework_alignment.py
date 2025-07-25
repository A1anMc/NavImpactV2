#!/usr/bin/env python3
"""
Framework Alignment Testing Script
Tests the new Victorian framework alignment features
"""

import requests
import json
import time
from typing import Dict, List, Any

class FrameworkAlignmentTester:
    def __init__(self, base_url: str = "http://localhost:3000"):
        self.base_url = base_url
        self.session = requests.Session()
        self.test_results = []
    
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   {details}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": time.time()
        })
    
    def test_homepage_load(self) -> bool:
        """Test if homepage loads successfully"""
        try:
            response = self.session.get(f"{self.base_url}/")
            success = response.status_code == 200
            self.log_test("Homepage Load", success, f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.log_test("Homepage Load", False, f"Error: {str(e)}")
            return False
    
    def test_projects_page_load(self) -> bool:
        """Test if projects page loads successfully"""
        try:
            response = self.session.get(f"{self.base_url}/projects")
            success = response.status_code == 200
            self.log_test("Projects Page Load", success, f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.log_test("Projects Page Load", False, f"Error: {str(e)}")
            return False
    
    def test_dashboard_page_load(self) -> bool:
        """Test if dashboard page loads successfully"""
        try:
            response = self.session.get(f"{self.base_url}/")
            success = response.status_code == 200
            self.log_test("Dashboard Page Load", success, f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.log_test("Dashboard Page Load", False, f"Error: {str(e)}")
            return False
    
    def test_settings_page_load(self) -> bool:
        """Test if settings page loads successfully"""
        try:
            response = self.session.get(f"{self.base_url}/settings")
            success = response.status_code == 200
            self.log_test("Settings Page Load", success, f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.log_test("Settings Page Load", False, f"Error: {str(e)}")
            return False
    
    def test_framework_content(self) -> bool:
        """Test if framework alignment content is present"""
        try:
            response = self.session.get(f"{self.base_url}/projects")
            content = response.text.lower()
            
            # Check for Victorian framework references
            framework_indicators = [
                "plan for victoria",
                "melbourne 2030",
                "activity centres",
                "greenfields",
                "clean economy",
                "aboriginal affairs"
            ]
            
            found_frameworks = [f for f in framework_indicators if f in content]
            success = len(found_frameworks) > 0
            
            self.log_test("Framework Content Present", success, 
                         f"Found frameworks: {found_frameworks}")
            return success
        except Exception as e:
            self.log_test("Framework Content Present", False, f"Error: {str(e)}")
            return False
    
    def test_sdg_content(self) -> bool:
        """Test if SDG content is present"""
        try:
            response = self.session.get(f"{self.base_url}/projects")
            content = response.text.lower()
            
            # Check for SDG references
            sdg_indicators = ["sdg-", "sustainable development", "un sdg"]
            found_sdgs = [s for s in sdg_indicators if s in content]
            success = len(found_sdgs) > 0
            
            self.log_test("SDG Content Present", success, 
                         f"Found SDG indicators: {found_sdgs}")
            return success
        except Exception as e:
            self.log_test("SDG Content Present", False, f"Error: {str(e)}")
            return False
    
    def test_api_health(self) -> bool:
        """Test API health endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/health")
            success = response.status_code == 200
            self.log_test("API Health Check", success, f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.log_test("API Health Check", False, f"Error: {str(e)}")
            return False
    
    def test_responsive_design(self) -> bool:
        """Test if pages are responsive (basic check)"""
        try:
            # Test with different user agents
            headers = {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
            }
            response = self.session.get(f"{self.base_url}/projects", headers=headers)
            success = response.status_code == 200
            self.log_test("Responsive Design (Mobile)", success, f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.log_test("Responsive Design (Mobile)", False, f"Error: {str(e)}")
            return False
    
    def test_performance(self) -> bool:
        """Test basic performance metrics"""
        try:
            start_time = time.time()
            response = self.session.get(f"{self.base_url}/projects")
            load_time = time.time() - start_time
            
            success = load_time < 5.0  # Should load within 5 seconds
            self.log_test("Performance Test", success, f"Load time: {load_time:.2f}s")
            return success
        except Exception as e:
            self.log_test("Performance Test", False, f"Error: {str(e)}")
            return False
    
    def run_all_tests(self) -> Dict[str, Any]:
        """Run all tests and return results"""
        print("🧪 Starting Framework Alignment Tests")
        print("=" * 50)
        
        tests = [
            self.test_homepage_load,
            self.test_projects_page_load,
            self.test_dashboard_page_load,
            self.test_settings_page_load,
            self.test_framework_content,
            self.test_sdg_content,
            self.test_api_health,
            self.test_responsive_design,
            self.test_performance,
        ]
        
        for test in tests:
            try:
                test()
                time.sleep(0.5)  # Small delay between tests
            except Exception as e:
                self.log_test(test.__name__, False, f"Test failed: {str(e)}")
        
        # Calculate summary
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print("\n" + "=" * 50)
        print("📊 Test Summary")
        print("=" * 50)
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": (passed_tests/total_tests)*100,
            "results": self.test_results
        }
    
    def save_results(self, filename: str = "framework_alignment_test_results.json"):
        """Save test results to file"""
        with open(filename, 'w') as f:
            json.dump({
                "timestamp": time.time(),
                "summary": {
                    "total_tests": len(self.test_results),
                    "passed_tests": sum(1 for r in self.test_results if r["success"]),
                    "failed_tests": sum(1 for r in self.test_results if not r["success"])
                },
                "results": self.test_results
            }, f, indent=2)
        print(f"📄 Test results saved to {filename}")

def main():
    """Main testing function"""
    print("🚀 NavImpact Framework Alignment Testing")
    print("=" * 50)
    
    # Test local development server
    tester = FrameworkAlignmentTester("http://localhost:3000")
    results = tester.run_all_tests()
    
    # Save results
    tester.save_results()
    
    # Exit with appropriate code
    if results["failed_tests"] == 0:
        print("\n🎉 All tests passed! Framework alignment implementation is working correctly.")
        exit(0)
    else:
        print(f"\n⚠️  {results['failed_tests']} tests failed. Please review the implementation.")
        exit(1)

if __name__ == "__main__":
    main() 