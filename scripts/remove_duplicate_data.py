#!/usr/bin/env python3
"""
Script to identify and remove duplicate data from the projects table
"""

import requests
import json
from collections import defaultdict
from datetime import datetime

def find_duplicates():
    """Find duplicate projects based on name and description"""
    
    print("🔍 Finding Duplicate Data")
    print("=" * 50)
    
    try:
        response = requests.get("https://navimpact-api.onrender.com/api/v1/projects/", timeout=10)
        if response.status_code != 200:
            print(f"❌ Failed to get projects: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
            
        data = response.json()
        projects = data.get('items', [])
        
        print(f"📋 Found {len(projects)} projects")
        
        # Group by name (case-insensitive)
        name_groups = defaultdict(list)
        for project in projects:
            name = project.get('name', '').strip().lower()
            if name:
                name_groups[name].append(project)
        
        # Find duplicates
        duplicates = []
        for name, project_list in name_groups.items():
            if len(project_list) > 1:
                duplicates.append({
                    'name': name,
                    'projects': project_list,
                    'type': 'name'
                })
        
        # Group by description (case-insensitive)
        desc_groups = defaultdict(list)
        for project in projects:
            desc = project.get('description', '').strip().lower()
            if desc and len(desc) > 10:  # Only substantial descriptions
                desc_groups[desc].append(project)
        
        # Find description duplicates
        for desc, project_list in desc_groups.items():
            if len(project_list) > 1:
                duplicates.append({
                    'description': desc[:50] + '...',
                    'projects': project_list,
                    'type': 'description'
                })
        
        return duplicates
        
    except Exception as e:
        print(f"❌ Error finding duplicates: {e}")
        return None

def analyze_duplicates(duplicates):
    """Analyze duplicates and suggest which to keep"""
    
    if not duplicates:
        print("✅ No duplicates found!")
        return
    
    print(f"\n🚨 Found {len(duplicates)} duplicate groups:")
    
    for i, dup_group in enumerate(duplicates, 1):
        print(f"\n{i}. {dup_group['type'].upper()} DUPLICATE:")
        
        if dup_group['type'] == 'name':
            print(f"   Name: '{dup_group['name']}'")
        else:
            print(f"   Description: '{dup_group['description']}'")
        
        projects = dup_group['projects']
        print(f"   Found {len(projects)} instances:")
        
        for j, project in enumerate(projects, 1):
            created = project.get('created_at', 'Unknown')
            if created != 'Unknown':
                try:
                    created_dt = datetime.fromisoformat(created.replace('Z', '+00:00'))
                    created = created_dt.strftime('%Y-%m-%d %H:%M')
                except:
                    pass
            
            print(f"     {j}. ID: {project.get('id')} | Created: {created}")
            if project.get('description'):
                desc = project.get('description', '')[:60]
                print(f"        Description: {desc}...")
        
        # Suggest which to keep (usually the oldest)
        if projects:
            oldest = min(projects, key=lambda p: p.get('created_at', '9999'))
            print(f"   💡 SUGGESTION: Keep ID {oldest.get('id')} (oldest)")

def remove_duplicates(duplicates):
    """Remove duplicate projects, keeping the oldest one"""
    
    if not duplicates:
        print("✅ No duplicates to remove!")
        return
    
    print(f"\n🗑️  Removing Duplicates")
    print("=" * 50)
    
    removed_count = 0
    
    for dup_group in duplicates:
        projects = dup_group['projects']
        
        # Keep the oldest project
        oldest = min(projects, key=lambda p: p.get('created_at', '9999'))
        to_remove = [p for p in projects if p.get('id') != oldest.get('id')]
        
        print(f"\n📝 {dup_group['type'].title()} Duplicate Group:")
        if dup_group['type'] == 'name':
            print(f"   Name: '{dup_group['name']}'")
        else:
            print(f"   Description: '{dup_group['description']}'")
        
        print(f"   Keeping: ID {oldest.get('id')} (oldest)")
        
        # Remove duplicates
        for project in to_remove:
            project_id = project.get('id')
            try:
                # Note: This would require a DELETE endpoint in the API
                # For now, just report what would be removed
                print(f"   Would remove: ID {project_id}")
                removed_count += 1
            except Exception as e:
                print(f"   ❌ Failed to remove ID {project_id}: {e}")
    
    print(f"\n📊 Summary: Would remove {removed_count} duplicate projects")
    print("💡 Note: DELETE endpoint not implemented - manual removal required")

def main():
    """Main function to find and analyze duplicates"""
    
    print("🧹 Duplicate Data Cleanup Tool")
    print("=" * 50)
    
    # Find duplicates
    duplicates = find_duplicates()
    
    if duplicates is None:
        print("❌ Could not retrieve projects data")
        return
    
    # Analyze duplicates
    analyze_duplicates(duplicates)
    
    # Ask user if they want to remove duplicates
    if duplicates:
        print(f"\n❓ Do you want to remove {len(duplicates)} duplicate groups?")
        print("   (This will keep the oldest project in each group)")
        print("   Note: Manual removal required - DELETE endpoint not implemented")
        
        # For now, just show what would be removed
        remove_duplicates(duplicates)

if __name__ == "__main__":
    main() 