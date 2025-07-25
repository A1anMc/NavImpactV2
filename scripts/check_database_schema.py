#!/usr/bin/env python3
"""
Database Schema Check Script
Safely checks the current database schema without making changes
"""

import requests
import json
import time
from typing import Dict, Any

class DatabaseSchemaChecker:
    def __init__(self, base_url: str = "https://navimpact-api.onrender.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.check_results = []
    
    def log_check(self, check_name: str, success: bool, details: str = ""):
        """Log check results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {check_name}")
        if details:
            print(f"   {details}")
        
        self.check_results.append({
            "check": check_name,
            "success": success,
            "details": details,
            "timestamp": time.time()
        })
    
    def check_database_connection(self) -> bool:
        """Check if database connection is working"""
        try:
            response = self.session.get(f"{self.base_url}/api/v1/projects/test", timeout=10)
            success = response.status_code == 200
            self.log_check("Database Connection", success, f"Status: {response.status_code}")
            
            if success:
                data = response.json()
                project_count = data.get('project_count', 'Unknown')
                self.log_check("Project Count", True, f"Found {project_count} projects in database")
            
            return success
        except Exception as e:
            self.log_check("Database Connection", False, f"Error: {str(e)}")
            return False
    
    def check_projects_table_structure(self) -> bool:
        """Check if projects table has the expected structure"""
        try:
            # Try to get a single project to see what fields are available
            response = self.session.get(f"{self.base_url}/api/v1/projects/?limit=1", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('items'):
                    project = data['items'][0]
                    
                    # Check for existing fields
                    expected_fields = [
                        'id', 'name', 'description', 'status', 'created_at', 'updated_at',
                        'outcome_text', 'impact_statement', 'impact_types', 'sdg_tags', 'evidence_sources'
                    ]
                    
                    missing_fields = []
                    present_fields = []
                    
                    for field in expected_fields:
                        if field in project:
                            present_fields.append(field)
                        else:
                            missing_fields.append(field)
                    
                    self.log_check("Existing Fields", True, f"Present: {', '.join(present_fields)}")
                    
                    if missing_fields:
                        self.log_check("Missing Fields", False, f"Missing: {', '.join(missing_fields)}")
                    
                    # Check specifically for framework_alignment
                    has_framework_field = 'framework_alignment' in project
                    self.log_check("Framework Alignment Field", has_framework_field, 
                                 f"framework_alignment field present: {has_framework_field}")
                    
                    return True
                else:
                    self.log_check("Projects Table Structure", False, "No projects found to analyze")
                    return False
            else:
                self.log_check("Projects Table Structure", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_check("Projects Table Structure", False, f"Error: {str(e)}")
            return False
    
    def check_api_error_details(self) -> bool:
        """Get detailed error information from the API"""
        try:
            response = self.session.get(f"{self.base_url}/api/v1/projects/", timeout=10)
            
            if response.status_code == 503:
                error_data = response.json()
                error_detail = error_data.get('detail', 'Unknown error')
                self.log_check("API Error Details", False, f"Error: {error_detail}")
                
                # Check if it's a database migration issue
                if 'database' in error_detail.lower() or 'migration' in error_detail.lower():
                    self.log_check("Migration Issue Detected", True, "Database migration appears to be needed")
                
                return False
            else:
                self.log_check("API Error Details", True, f"Status: {response.status_code}")
                return True
                
        except Exception as e:
            self.log_check("API Error Details", False, f"Error: {str(e)}")
            return False
    
    def check_health_endpoint_details(self) -> bool:
        """Get detailed health information"""
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                self.log_check("Health Endpoint Details", True, f"Status: {response.status_code}")
                
                # Log any additional health information
                if 'database' in data:
                    db_status = data['database']
                    self.log_check("Database Health", True, f"Database status: {db_status}")
                
                return True
            else:
                self.log_check("Health Endpoint Details", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_check("Health Endpoint Details", False, f"Error: {str(e)}")
            return False
    
    def run_all_checks(self) -> Dict[str, Any]:
        """Run all schema checks and return results"""
        print("🔍 Starting Database Schema Checks")
        print("=" * 50)
        
        checks = [
            self.check_health_endpoint_details,
            self.check_database_connection,
            self.check_api_error_details,
            self.check_projects_table_structure,
        ]
        
        for check in checks:
            try:
                check()
                time.sleep(1)  # Small delay between checks
            except Exception as e:
                self.log_check(check.__name__, False, f"Check failed: {str(e)}")
        
        # Calculate summary
        total_checks = len(self.check_results)
        passed_checks = sum(1 for result in self.check_results if result["success"])
        failed_checks = total_checks - passed_checks
        
        print("\n" + "=" * 50)
        print("📊 Database Schema Check Summary")
        print("=" * 50)
        print(f"Total Checks: {total_checks}")
        print(f"Passed: {passed_checks}")
        print(f"Failed: {failed_checks}")
        print(f"Success Rate: {(passed_checks/total_checks)*100:.1f}%")
        
        return {
            "total_checks": total_checks,
            "passed_checks": passed_checks,
            "failed_checks": failed_checks,
            "success_rate": (passed_checks/total_checks)*100,
            "results": self.check_results
        }
    
    def save_results(self, filename: str = "database_schema_check_results.json"):
        """Save check results to file"""
        with open(filename, 'w') as f:
            json.dump({
                "timestamp": time.time(),
                "summary": {
                    "total_checks": len(self.check_results),
                    "passed_checks": sum(1 for r in self.check_results if r["success"]),
                    "failed_checks": sum(1 for r in self.check_results if not r["success"])
                },
                "results": self.check_results
            }, f, indent=2)
        print(f"📄 Database schema check results saved to {filename}")

def main():
    """Main checking function"""
    print("🔍 NavImpact Database Schema Check")
    print("=" * 50)
    
    # Check database schema
    checker = DatabaseSchemaChecker("https://navimpact-api.onrender.com")
    results = checker.run_all_checks()
    
    # Save results
    checker.save_results()
    
    # Provide recommendations
    print("\n" + "=" * 50)
    print("💡 Recommendations")
    print("=" * 50)
    
    if results["failed_checks"] > 0:
        print("⚠️  Database issues detected. Recommended actions:")
        print("1. Check Render dashboard for database service status")
        print("2. Verify database connection string is correct")
        print("3. Apply database migration if needed")
        print("4. Check if database service is running")
    else:
        print("✅ Database appears to be working correctly")
    
    print("\nNext steps:")
    print("- Review the detailed results above")
    print("- Check Render dashboard for database status")
    print("- Apply migration if framework_alignment column is missing")

if __name__ == "__main__":
    main() 