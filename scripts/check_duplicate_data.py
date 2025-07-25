#!/usr/bin/env python3
"""
Script to check for duplicate data in the projects table
"""

import requests
import json
from collections import defaultdict

def check_duplicates():
    """Check for duplicate projects based on name and description"""
    
    # Since the API is currently returning 503, let's check what we can infer
    print("🔍 Checking for Duplicate Data")
    print("=" * 50)
    
    # Test the database connection first
    try:
        response = requests.get("https://navimpact-api.onrender.com/api/v1/projects/test", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Database connection successful")
            print(f"📊 Total projects: {data.get('project_count', 'Unknown')}")
        else:
            print(f"❌ Database connection failed: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Error connecting to API: {e}")
        return
    
    # Try to get projects list
    try:
        response = requests.get("https://navimpact-api.onrender.com/api/v1/projects/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            projects = data.get('items', [])
            
            print(f"\n📋 Found {len(projects)} projects")
            
            # Check for duplicates by name
            name_counts = defaultdict(list)
            for i, project in enumerate(projects):
                name = project.get('name', '').strip().lower()
                if name:
                    name_counts[name].append(i)
            
            # Report duplicates
            duplicates_found = False
            for name, indices in name_counts.items():
                if len(indices) > 1:
                    duplicates_found = True
                    print(f"\n🚨 DUPLICATE FOUND: '{name}' appears {len(indices)} times")
                    for idx in indices:
                        project = projects[idx]
                        print(f"   - ID: {project.get('id')}, Created: {project.get('created_at')}")
            
            if not duplicates_found:
                print("\n✅ No duplicate project names found")
            
            # Check for similar descriptions
            desc_counts = defaultdict(list)
            for i, project in enumerate(projects):
                desc = project.get('description', '').strip().lower()
                if desc and len(desc) > 10:  # Only check substantial descriptions
                    desc_counts[desc].append(i)
            
            # Report description duplicates
            desc_duplicates = False
            for desc, indices in desc_counts.items():
                if len(indices) > 1:
                    desc_duplicates = True
                    print(f"\n🚨 DUPLICATE DESCRIPTION: '{desc[:50]}...' appears {len(indices)} times")
                    for idx in indices:
                        project = projects[idx]
                        print(f"   - ID: {project.get('id')}, Name: {project.get('name')}")
            
            if not desc_duplicates:
                print("\n✅ No duplicate descriptions found")
                
        else:
            print(f"❌ Failed to get projects: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error checking projects: {e}")

if __name__ == "__main__":
    check_duplicates() 