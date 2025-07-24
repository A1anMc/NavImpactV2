#!/usr/bin/env python3
"""
Deploy script to create the industry_news table in production
This script should be run on Render or with production environment
"""

import os
import sys
import subprocess
from pathlib import Path

def deploy_news_table():
    """Deploy the news table to production"""
    
    print("🚀 Deploying news table to production...")
    
    # Check if we're in production environment
    if os.getenv("RENDER", "false").lower() != "true":
        print("⚠️  This script should be run in production environment")
        print("   Set RENDER=true or run on Render platform")
        return False
    
    # Get the SQL file path
    sql_file = Path(__file__).parent / "create_news_table.sql"
    
    if not sql_file.exists():
        print(f"❌ SQL file not found: {sql_file}")
        return False
    
    # Read the SQL content
    with open(sql_file, 'r') as f:
        sql_content = f.read()
    
    print("📝 SQL content to execute:")
    print("=" * 50)
    print(sql_content)
    print("=" * 50)
    
    # For now, just show what would be executed
    print("\n✅ SQL script ready for execution")
    print("📋 To execute this on production:")
    print("   1. Access the production database")
    print("   2. Run the SQL commands from create_news_table.sql")
    print("   3. Or use a database management tool")
    
    return True

if __name__ == "__main__":
    success = deploy_news_table()
    if not success:
        sys.exit(1) 