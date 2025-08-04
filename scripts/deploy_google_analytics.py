#!/usr/bin/env python3
"""
Google Analytics Deployment Script for Shadow Goose
Deploys the complete Google Analytics configuration to Render
"""

import os
import sys
import subprocess
import json

def print_header():
    print("=" * 60)
    print("🚀 GOOGLE ANALYTICS DEPLOYMENT FOR SHADOW GOOSE")
    print("=" * 60)

def print_config():
    print("\n📊 YOUR CONFIGURATION:")
    print("-" * 40)
    config = {
        "Property ID": "G-W5J0946RGP",
        "Stream ID": "11847705981",
        "Website": "https://www.shadow-goose.com",
        "Service Account": "navimpact-analytics-access@navimpact-analytics-access.iam.gserviceaccount.com"
    }
    
    for key, value in config.items():
        print(f"✅ {key}: {value}")

def generate_env_vars():
    print("\n📝 ENVIRONMENT VARIABLES TO ADD TO RENDER:")
    print("-" * 50)
    
    env_vars = {
        "GOOGLE_ANALYTICS_PROPERTY_ID": "G-W5J0946RGP",
        "GOOGLE_ANALYTICS_STREAM_ID": "11847705981",
        "GOOGLE_ANALYTICS_STREAM_NAME": "Shadow Goose Ent",
        "GOOGLE_ANALYTICS_STREAM_URL": "https://www.shadow-goose.com",
        "GOOGLE_ANALYTICS_PRIVATE_KEY_ID": "9eb429a5851e89388f0893afad9cf157753497a4",
        "GOOGLE_ANALYTICS_PRIVATE_KEY": "-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCO0OrL6VOTrFR6\\n5a0Z0AlKAs7FlvdFqsqXEgeO49HkduTyTTJbppPEDQplS/SPnOyJzBu7xIiapsnU\\n1dU5AAw4dmI8gmGDw40fbxnJPrk9YUdGgh6WDAW7NYJ51twReBzG0uIndDMd/5EM\\nh+2PDlTs8iVsfiDU5gculV/nbkZrmOS3H3nA50P6wdU6+DSS5lp/DA+YKW8ht7H3\\ndCoFUBzePEkN9orbz8DC2vcIqzWaXzwtvecsBvk3tGEydbuKK2plEYIVCkwLoAz1\\n6V1UR3HFfOvs58bDvWOmhCXT5ZE+dvkw9cOMo66i0GKqL3PzgLvVehLjqBRqvmVw\\n/gZX5Rl3AgMBAAECggEAAUy8jzIU3flpwL8/QWMbTvrnj7vn/t7DfpOW/D3tqGza\\nzeRkMAwDKnvT5iup5+g/e0w7zUU59XyUcMU2w5C0i8RWRd+YHkSmrCU7JfVHvBSb\\nAlhgXuKNICKZ3kdVbPNGc1Nyq3WyYWYtl1JFXzVDEmFsc/2nNCxgNFtwjcf7JPox\\n+6Zd4W/HjB9lPVfYWFHa9lQ1f3wzGU4Yxzu+/iCpNhNDDq6by6H5hHe4J8oDMmrQ\\nFHGXFTyh02eShnJxFcLxuTuXTROKRLaJvcXAx3bvlNoZ9OJllgtN6eTl1DOHE9ky\\nhdB9DNnqqSgC02kYnEuik89gJ2dmRy4uMwHxgXFqgQKBgQDFrTh/9bIcx/D+4EK5\\n8L3GxS2CLkOAkcqEHXriA0wzUcsFryH+n7ZG+niCpIoiDMwgYO9Pzz0Y117Qz302\\nOdfLAYQ/DBvIhL8QmOezSlgB2VUxVe8jSvkD4+Yq3JkGo8tGFYVuim7FtvBQHK6t\\nX6nQcc7cRvYUTE4gzPDauFjqaQKBgQC49AFoIzLSu9qNvT9v4U86XwqxN5JqGee0\\n6TNFS8wc1UzqBfvs8SJUTJ9r079FKC51xr+5cI8kpxQRbW3ZKTVSb8S8EmUQ9lFv\\nQiK3D2YeLW+VotZizjoXVEuw3GRQf9intEfOVEuhBW9XSKwRtkL98MGMNwVnW3nJ\\nSAs7uDyo3wKBgG8I2Y+mpqFb/ZZsyY5AF5kq8GELM4doXOTQ2lFRoN/CtdM/iEzJ\\n0U0VK9PWMHDn11DoogOmWJ83el637ZEj9H5nH616U7DSP7BG8v7WZ5DCTwQjTOv6\\nFN2GiabRunLsViXLuONahtYv59RYCBYCghQ/mP5KLbdBFTF/bFqu6eLhAoGBAJ29\\nTW3Zh0D/gjicjPwIdx/bay0VrkPbcCh1M4sISD7XFFALZn8AcTzgVJ8L6vc6e9Vq\\n+p1XiF3EOXNblvI9GQMD3BBix9udmHqBN0ZVVcyrB53hUWLXa+f1ttBSRyP4xXjS\\nYuNwNUhRcFJK4qYAgkY+DXRegLdT5xxp21rFmMaVAoGAdL3/8n/X8R5j4BddN8Xm\\n1faJQ92VV7oDznZWMDYxo3oky2oOKyOpLNdCa0jr6mJpgr3QiGh9Y/us/jR6hbK/\\n/PknZ+h3+6Q8PPvuoSttjp17zS106UyIaCkHhGQQllKXTHF8cGs2q35L1DFCp/oA\\nFEEELtIe5juPbVngj3HVBUY=\\n-----END PRIVATE KEY-----\\n",
        "GOOGLE_ANALYTICS_CLIENT_EMAIL": "navimpact-analytics-access@navimpact-analytics-access.iam.gserviceaccount.com",
        "GOOGLE_ANALYTICS_CLIENT_ID": "105729216126104949624"
    }
    
    for key, value in env_vars.items():
        print(f"{key}={value}")
    
    return env_vars

def test_current_status():
    print("\n🧪 TESTING CURRENT STATUS:")
    print("-" * 30)
    
    try:
        # Test the API endpoint
        import requests
        response = requests.get("https://shadow-goose-api.onrender.com/api/v1/analytics/ga/users", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ API is responding")
            print(f"📊 Current data: {data}")
        else:
            print(f"⚠️ API responded with status {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error testing API: {e}")

def show_deployment_steps():
    print("\n🚀 DEPLOYMENT STEPS:")
    print("-" * 25)
    steps = [
        "1. Go to https://dashboard.render.com/",
        "2. Navigate to 'shadow-goose-api' service",
        "3. Go to 'Environment' tab",
        "4. Add ALL environment variables (copy from above)",
        "5. Save changes",
        "6. Wait for deployment to complete",
        "7. Test the integration"
    ]
    
    for step in steps:
        print(f"   {step}")

def show_test_commands():
    print("\n🧪 TEST COMMANDS:")
    print("-" * 20)
    commands = [
        "curl https://shadow-goose-api.onrender.com/api/v1/analytics/ga/users",
        "python scripts/configure_real_data.py test",
        "python scripts/configure_real_data.py status"
    ]
    
    for cmd in commands:
        print(f"   {cmd}")

def main():
    print_header()
    print_config()
    env_vars = generate_env_vars()
    test_current_status()
    show_deployment_steps()
    show_test_commands()
    
    print("\n" + "=" * 60)
    print("✅ READY TO DEPLOY!")
    print("=" * 60)
    print("\nCopy the environment variables above and add them to Render.")
    print("Your Shadow Goose website will then have real analytics data!")

if __name__ == "__main__":
    main() 