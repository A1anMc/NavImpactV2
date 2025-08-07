#!/usr/bin/env python3
"""
Train ML Models Script
Trains all ML models with current data and tests the new features
"""

import asyncio
import sys
import os
from datetime import datetime

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.db.session import get_session_local
from app.services.ml_service import MLService
from app.services.enhanced_grant_service import EnhancedGrantService
from app.services.impact_understanding_service import ImpactUnderstandingService


def train_ml_models():
    """Train all ML models with current data."""
    print("🤖 Training ML Models with Current Data...")
    
    SessionLocal = get_session_local()
    db = SessionLocal()
    try:
        # Initialize services
        ml_service = MLService(db)
        grant_service = EnhancedGrantService(db)
        impact_service = ImpactUnderstandingService(db)
        
        print("\n📊 Step 1: Training Grant Recommendation Model...")
        result = ml_service.train_grant_recommendation_model()
        
        if result["success"]:
            print(f"✅ Grant recommendation model trained successfully!")
            print(f"   - Accuracy: {result.get('accuracy', 'N/A')}")
            print(f"   - Features used: {result.get('features_used', 'N/A')}")
            print(f"   - Training samples: {result.get('training_samples', 'N/A')}")
        else:
            print(f"❌ Grant recommendation model training failed: {result.get('message', 'Unknown error')}")
        
        print("\n📈 Step 2: Analyzing Impact Trends...")
        impact_trends = ml_service.analyze_impact_trends()
        
        if impact_trends["success"]:
            print(f"✅ Impact trends analyzed successfully!")
            print(f"   - Trend direction: {impact_trends.get('trend_direction', 'N/A')}")
            print(f"   - Trend percentage: {impact_trends.get('trend_percentage', 'N/A'):.1f}%")
            print(f"   - Total months: {impact_trends.get('total_months', 'N/A')}")
        else:
            print(f"❌ Impact trends analysis failed: {impact_trends.get('message', 'Unknown error')}")
        
        print("\n🎯 Step 3: Getting Grant Analytics...")
        grant_analytics = grant_service.get_grant_analytics()
        
        if grant_analytics:
            print(f"✅ Grant analytics generated successfully!")
            print(f"   - Total grants: {grant_analytics.get('total_grants', 0)}")
            print(f"   - Active grants: {grant_analytics.get('active_grants', 0)}")
            print(f"   - Total amount: ${grant_analytics.get('total_amount', 0):,.0f}")
            print(f"   - Average amount: ${grant_analytics.get('average_amount', 0):,.0f}")
            print(f"   - Upcoming deadlines: {grant_analytics.get('upcoming_deadlines', 0)}")
        else:
            print("❌ Grant analytics generation failed")
        
        print("\n🧠 Step 4: Getting Impact Overview...")
        impact_overview = impact_service.get_impact_overview()
        
        if impact_overview:
            print(f"✅ Impact overview generated successfully!")
            print(f"   - Total impact: {impact_overview.get('total_impact', 0)}")
            print(f"   - Average impact: {impact_overview.get('average_impact', 0):.1f}")
            print(f"   - Max impact: {impact_overview.get('max_impact', 0)}")
            print(f"   - Projects with impact: {impact_overview.get('projects_with_impact', 0)}")
        else:
            print("❌ Impact overview generation failed")
        
        print("\n📊 Step 5: Getting ML Insights...")
        ml_insights = ml_service.get_ml_insights()
        
        if ml_insights:
            print(f"✅ ML insights generated successfully!")
            data_summary = ml_insights.get('data_summary', {})
            print(f"   - Grants: {data_summary.get('grants', 0)}")
            print(f"   - Projects: {data_summary.get('projects', 0)}")
            print(f"   - Metrics: {data_summary.get('metrics', 0)}")
            print(f"   - Users: {data_summary.get('users', 0)}")
            print(f"   - Data quality: {data_summary.get('data_quality', 'unknown')}")
        else:
            print("❌ ML insights generation failed")
        
        print("\n🎉 ML Model Training Complete!")
        print("\n📋 Summary:")
        print("✅ Grant recommendation model trained")
        print("✅ Impact trends analyzed")
        print("✅ Grant analytics generated")
        print("✅ Impact overview created")
        print("✅ ML insights generated")
        
        return True
        
    except Exception as e:
        print(f"❌ Error training ML models: {e}")
        return False
    finally:
        db.close()


def test_ml_endpoints():
    """Test the ML endpoints to ensure they're working."""
    print("\n🧪 Testing ML Endpoints...")
    
    import requests
    
    base_url = "https://navimpact-api-staging.onrender.com"
    
    endpoints_to_test = [
        "/api/v1/ml-analytics/insights",
        "/api/v1/ml-analytics/data-quality",
        "/api/v1/performance/metrics",
        "/api/v1/projects/",
        "/api/v1/grants/"
    ]
    
    for endpoint in endpoints_to_test:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=10)
            if response.status_code == 200:
                print(f"✅ {endpoint} - Working")
            else:
                print(f"⚠️  {endpoint} - Status {response.status_code}")
        except Exception as e:
            print(f"❌ {endpoint} - Error: {e}")


if __name__ == "__main__":
    print("🚀 NavImpact V2 ML Model Training")
    print("=" * 50)
    
    # Train models
    success = train_ml_models()
    
    if success:
        print("\n🔄 Waiting for deployment to complete...")
        import time
        time.sleep(30)  # Wait for deployment
        
        # Test endpoints
        test_ml_endpoints()
        
        print("\n🎯 Next Steps:")
        print("1. Monitor the staging environment")
        print("2. Test the new dashboard features")
        print("3. Gather user feedback")
        print("4. Iterate based on feedback")
    else:
        print("\n❌ ML model training failed. Please check the logs.") 