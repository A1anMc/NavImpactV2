#!/usr/bin/env python3
"""
Performance Monitoring Script
Monitors API performance, user engagement, and system health
"""

import requests
import time
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any


class PerformanceMonitor:
    """Monitor NavImpact V2 performance and engagement."""
    
    def __init__(self, base_url: str = "https://navimpact-api-staging.onrender.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.timeout = 10
    
    def test_endpoint_performance(self, endpoint: str, method: str = "GET") -> Dict[str, Any]:
        """Test endpoint performance and response time."""
        start_time = time.time()
        
        try:
            if method == "GET":
                response = self.session.get(f"{self.base_url}{endpoint}")
            elif method == "POST":
                response = self.session.post(f"{self.base_url}{endpoint}")
            else:
                return {"error": f"Unsupported method: {method}"}
            
            end_time = time.time()
            response_time = (end_time - start_time) * 1000  # Convert to milliseconds
            
            return {
                "endpoint": endpoint,
                "method": method,
                "status_code": response.status_code,
                "response_time_ms": round(response_time, 2),
                "success": response.status_code < 400,
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except requests.exceptions.Timeout:
            return {
                "endpoint": endpoint,
                "method": method,
                "status_code": None,
                "response_time_ms": None,
                "success": False,
                "error": "Timeout",
                "timestamp": datetime.utcnow().isoformat()
            }
        except Exception as e:
            return {
                "endpoint": endpoint,
                "method": method,
                "status_code": None,
                "response_time_ms": None,
                "success": False,
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
    
    def test_all_endpoints(self) -> List[Dict[str, Any]]:
        """Test all critical endpoints."""
        endpoints = [
            "/health",
            "/api/v1/projects/",
            "/api/v1/grants/",
            "/api/v1/tasks/",
            "/api/v1/tags/",
            "/api/v1/users/",
            "/api/v1/ml-analytics/insights",
            "/api/v1/ml-analytics/data-quality",
            "/api/v1/performance/metrics",
            "/api/v1/grants/opportunities",
            "/api/v1/grants/analytics"
        ]
        
        results = []
        print(f"🧪 Testing {len(endpoints)} endpoints...")
        
        for endpoint in endpoints:
            result = self.test_endpoint_performance(endpoint)
            results.append(result)
            
            status_icon = "✅" if result["success"] else "❌"
            response_time = f"{result['response_time_ms']}ms" if result.get('response_time_ms') else "N/A"
            
            print(f"{status_icon} {endpoint} - {result['status_code']} - {response_time}")
        
        return results
    
    def analyze_performance(self, results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze performance results."""
        successful_tests = [r for r in results if r["success"]]
        failed_tests = [r for r in results if not r["success"]]
        
        response_times = [r["response_time_ms"] for r in successful_tests if r.get("response_time_ms")]
        
        analysis = {
            "total_endpoints": len(results),
            "successful_endpoints": len(successful_tests),
            "failed_endpoints": len(failed_tests),
            "success_rate": len(successful_tests) / len(results) * 100 if results else 0,
            "average_response_time": sum(response_times) / len(response_times) if response_times else 0,
            "min_response_time": min(response_times) if response_times else 0,
            "max_response_time": max(response_times) if response_times else 0,
            "failed_endpoints_list": [r["endpoint"] for r in failed_tests]
        }
        
        return analysis
    
    def check_system_health(self) -> Dict[str, Any]:
        """Check overall system health."""
        try:
            response = self.session.get(f"{self.base_url}/health")
            health_data = response.json()
            
            return {
                "status": "healthy" if response.status_code == 200 else "unhealthy",
                "database": health_data.get("database", "unknown"),
                "environment": health_data.get("environment", "unknown"),
                "version": health_data.get("version", "unknown"),
                "timestamp": health_data.get("timestamp", datetime.utcnow().isoformat())
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
    
    def generate_report(self) -> Dict[str, Any]:
        """Generate comprehensive performance report."""
        print("📊 Generating Performance Report...")
        
        # Test all endpoints
        endpoint_results = self.test_all_endpoints()
        
        # Analyze performance
        performance_analysis = self.analyze_performance(endpoint_results)
        
        # Check system health
        system_health = self.check_system_health()
        
        # Generate recommendations
        recommendations = self.generate_recommendations(performance_analysis, system_health)
        
        report = {
            "timestamp": datetime.utcnow().isoformat(),
            "system_health": system_health,
            "performance_analysis": performance_analysis,
            "endpoint_results": endpoint_results,
            "recommendations": recommendations
        }
        
        return report
    
    def generate_recommendations(self, performance: Dict[str, Any], health: Dict[str, Any]) -> List[str]:
        """Generate recommendations based on performance and health data."""
        recommendations = []
        
        # Performance recommendations
        if performance["success_rate"] < 90:
            recommendations.append("🔧 Fix failed endpoints to improve reliability")
        
        if performance["average_response_time"] > 1000:
            recommendations.append("⚡ Optimize slow endpoints for better user experience")
        
        if performance["max_response_time"] > 5000:
            recommendations.append("🚨 Investigate extremely slow endpoints")
        
        # Health recommendations
        if health["status"] != "healthy":
            recommendations.append("🏥 Address system health issues")
        
        if health["database"] != "connected":
            recommendations.append("🗄️ Check database connectivity")
        
        # General recommendations
        if len(performance["failed_endpoints_list"]) > 0:
            recommendations.append(f"🔍 Review {len(performance['failed_endpoints_list'])} failed endpoints")
        
        if not recommendations:
            recommendations.append("✅ System is performing well")
        
        return recommendations


def main():
    """Main monitoring function."""
    print("🚀 NavImpact V2 Performance Monitoring")
    print("=" * 50)
    
    monitor = PerformanceMonitor()
    
    # Generate comprehensive report
    report = monitor.generate_report()
    
    # Print summary
    print("\n📋 Performance Summary:")
    print(f"   Total Endpoints: {report['performance_analysis']['total_endpoints']}")
    print(f"   Successful: {report['performance_analysis']['successful_endpoints']}")
    print(f"   Failed: {report['performance_analysis']['failed_endpoints']}")
    print(f"   Success Rate: {report['performance_analysis']['success_rate']:.1f}%")
    print(f"   Avg Response Time: {report['performance_analysis']['average_response_time']:.1f}ms")
    print(f"   System Status: {report['system_health']['status']}")
    
    # Print recommendations
    print("\n💡 Recommendations:")
    for rec in report['recommendations']:
        print(f"   {rec}")
    
    # Save report to file
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    filename = f"performance_report_{timestamp}.json"
    
    with open(filename, 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"\n📄 Report saved to: {filename}")
    
    # Return exit code based on performance
    if report['performance_analysis']['success_rate'] < 80:
        print("\n⚠️  Performance issues detected!")
        return 1
    else:
        print("\n✅ Performance is acceptable")
        return 0


if __name__ == "__main__":
    exit(main()) 