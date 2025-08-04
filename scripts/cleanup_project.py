#!/usr/bin/env python3
"""
Safe Project Cleanup Script
Moves outdated files to ARCHIVE/outdated/ directory
"""

import os
import shutil
import sys
from pathlib import Path

class ProjectCleanup:
    def __init__(self):
        self.root_dir = Path.cwd()
        self.archive_dir = self.root_dir / "ARCHIVE" / "outdated"
        
    def print_header(self, title: str):
        """Print a formatted header."""
        print("\n" + "="*60)
        print(f"🧹 {title}")
        print("="*60)
    
    def create_archive_directory(self):
        """Create archive directory if it doesn't exist."""
        self.archive_dir.mkdir(parents=True, exist_ok=True)
        print(f"✅ Created archive directory: {self.archive_dir}")
    
    def move_file(self, filename: str, reason: str):
        """Safely move a file to archive."""
        source = self.root_dir / filename
        destination = self.archive_dir / filename
        
        if source.exists():
            try:
                shutil.move(str(source), str(destination))
                print(f"✅ Moved: {filename} - {reason}")
                return True
            except Exception as e:
                print(f"❌ Failed to move {filename}: {e}")
                return False
        else:
            print(f"⚠️  File not found: {filename}")
            return False
    
    def cleanup_outdated_files(self):
        """Move outdated files to archive."""
        self.print_header("MOVING OUTDATED FILES TO ARCHIVE")
        
        # Files to move with reasons
        files_to_move = [
            # Duplicate Test Files
            ("test_ai_bot.py", "Duplicate AI bot test"),
            ("test_ai_grants.py", "Duplicate grant test"),
            ("test_ai_grants_simple.py", "Duplicate simple test"),
            ("test_deployment_fixes.py", "Outdated deployment test"),
            ("render_mock_api.py", "Mock API replaced by real data"),
            ("mock_api.py", "Mock API replaced by real data"),
            
            # Outdated Documentation
            ("AI_BOT_STRATEGY.md", "Outdated AI strategy"),
            ("AI_GRANTS_IMPLEMENTATION_SUMMARY.md", "Outdated implementation"),
            ("OKR_GRANT_ACTION_PLAN.md", "Outdated action plan"),
            ("SGE_PRESENTATION_READY.md", "Outdated presentation"),
            ("SGE_PRESENTATION_SLIDES.md", "Outdated slides"),
            ("SGE_PITCH_DECK.md", "Outdated pitch deck"),
            ("SGE_LICENSE_AGREEMENT.md", "Outdated license"),
            
            # Outdated Status Reports
            ("FINAL_IMPLEMENTATION_STATUS.md", "Outdated status"),
            ("SGE_OPERATIONAL_STATUS.md", "Outdated status"),
            ("SGE_DEPLOYMENT_STATUS.md", "Outdated status"),
            ("SGE_DEPLOYMENT_SETTINGS_CHECK.md", "Outdated check"),
            ("SHADOW_GOOSE_DEPLOYMENT_STATUS.md", "Outdated status"),
            
            # Outdated Integration Docs
            ("INTEGRATION_API_SETUP.md", "Outdated API setup"),
            ("ANALYTICS_API_SETUP.md", "Outdated analytics setup"),
            ("GRANT_API_SETUP.md", "Outdated grant setup"),
            ("NOTION_SETUP_GUIDE.md", "Outdated Notion guide"),
            ("NOTION_INTEGRATION_IMPLEMENTATION.md", "Outdated implementation"),
            ("NOTION_INTEGRATION_PLAN.md", "Outdated plan"),
            
            # Outdated Deployment Docs
            ("RENDER_DEPLOYMENT_FIX_STEPS.md", "Outdated fix steps"),
            ("RENDER_DEPLOYMENT_FIX.md", "Outdated fix"),
            ("RENDER_DEPLOYMENT.md", "Outdated deployment"),
            ("DEPLOYMENT_QUICK_REFERENCE.md", "Outdated reference"),
            ("DEPLOYMENT_SAFETY_FRAMEWORK.md", "Outdated framework"),
            ("DEPLOYMENT_BUILD_PLAN.md", "Outdated build plan"),
            ("DEPLOYMENT_CHECKLIST.md", "Outdated checklist"),
            
            # Outdated Reports
            ("CEO_PROJECT_REPORT.md", "Outdated report"),
            ("CUSTOMER_HUB_VISUALIZATION.md", "Outdated visualization"),
            ("CLIENT_DASHBOARD_MANAGEMENT_GUIDE.md", "Outdated guide"),
            ("SGE_MEDIA_DEPLOYMENT_GUIDE.md", "Outdated guide"),
            ("SGE_MEDIA_MODULE_IMPLEMENTATION.md", "Outdated implementation"),
            
            # Outdated Baseline Docs
            ("PHASE1_BASELINE.md", "Outdated baseline"),
            ("CLEAN_BASELINE.md", "Outdated baseline"),
            ("BASELINE_STATUS.md", "Outdated status"),
            ("NAVIMPACT_BASELINE.md", "Outdated baseline"),
            ("STABLE_BASELINE_MARKER.md", "Outdated marker"),
            
            # Outdated Scraper Docs
            ("AUSTRALIAN_GRANTS_SCRAPER_INTEGRATION.md", "Outdated integration"),
            ("AUSTRALIAN_GRANTS_SCRAPER.md", "Outdated scraper"),
            
            # Outdated Test Results
            ("backend_api_test_results.json", "Outdated test results"),
            ("production_api_test_results.json", "Outdated test results"),
            ("grants_deployment_summary.json", "Outdated summary"),
            ("okr_grant_test_report.json", "Outdated report"),
            
            # Outdated Scripts
            ("sprint_migration.sql", "Outdated migration"),
            ("simple_sge_dashboard.html", "Outdated dashboard"),
            ("instagram_env_template.txt", "Outdated template"),
            ("frontend_consistency_fixes.md", "Outdated fixes"),
            
            # Outdated Security Docs
            ("SECURITY_HARDENING.md", "Outdated security"),
            ("NAVIMPACT_BRANDING_REPORT.md", "Outdated branding"),
        ]
        
        moved_count = 0
        total_count = len(files_to_move)
        
        for filename, reason in files_to_move:
            if self.move_file(filename, reason):
                moved_count += 1
        
        print(f"\n📊 Cleanup Summary:")
        print(f"✅ Moved: {moved_count} files")
        print(f"📁 Archive location: {self.archive_dir}")
        print(f"📋 Total files processed: {total_count}")
    
    def fix_deployment_config(self):
        """Fix the deployment configuration."""
        self.print_header("FIXING DEPLOYMENT CONFIGURATION")
        
        # Check current render.yaml
        current_render = self.root_dir / "render.yaml"
        navimpact_render = self.root_dir / "render.navimpact.yaml"
        
        if current_render.exists() and navimpact_render.exists():
            try:
                # Backup current render.yaml
                backup_render = self.root_dir / "render.yaml.backup"
                shutil.copy2(str(current_render), str(backup_render))
                print(f"✅ Backed up current render.yaml to render.yaml.backup")
                
                # Copy NavImpact config to render.yaml
                shutil.copy2(str(navimpact_render), str(current_render))
                print(f"✅ Updated render.yaml with NavImpact configuration")
                
                return True
            except Exception as e:
                print(f"❌ Failed to fix deployment config: {e}")
                return False
        else:
            print("⚠️  render.yaml or render.navimpact.yaml not found")
            return False
    
    def show_remaining_files(self):
        """Show what files remain after cleanup."""
        self.print_header("REMAINING ESSENTIAL FILES")
        
        essential_files = [
            "app/",
            "frontend/",
            "alembic/",
            "scripts/",
            "tests/",
            "docs/",
            "requirements.txt",
            "package-lock.json",
            "alembic.ini",
            ".envV2",
            ".gitignore",
            "README.md",
            "README.deploy.md",
            "README.dev.md",
            "LICENSE",
            "render.yaml",
            "render.navimpact.yaml",
            "render.sge.yaml",
            "env.production.template",
            "env.sge.template",
            "scripts/configure_real_data.py",
            "REAL_DATA_SETUP_PLAN.md",
            "QUICK_START_REAL_DATA.md",
            "REAL_DATA_SUMMARY.md",
            "CLEANUP_REPORT.md",
        ]
        
        print("📁 Essential files that remain:")
        for file in essential_files:
            if (self.root_dir / file).exists():
                print(f"✅ {file}")
            else:
                print(f"⚠️  {file} (not found)")
    
    def run_cleanup(self):
        """Run the complete cleanup process."""
        self.print_header("PROJECT CLEANUP WIZARD")
        
        print("This script will:")
        print("1. Create ARCHIVE/outdated/ directory")
        print("2. Move outdated files to archive")
        print("3. Fix deployment configuration")
        print("4. Show remaining essential files")
        
        response = input("\nDo you want to proceed? (y/N): ").strip().lower()
        
        if response == 'y':
            print("\n🚀 Starting cleanup process...")
            
            # Step 1: Create archive directory
            self.create_archive_directory()
            
            # Step 2: Move outdated files
            self.cleanup_outdated_files()
            
            # Step 3: Fix deployment config
            self.fix_deployment_config()
            
            # Step 4: Show remaining files
            self.show_remaining_files()
            
            print("\n🎉 Cleanup completed successfully!")
            print("📁 Check ARCHIVE/outdated/ for moved files")
            print("🔧 Deployment configuration has been fixed")
            
        else:
            print("❌ Cleanup cancelled")

def main():
    """Main function."""
    cleanup = ProjectCleanup()
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        if command == "fix-config":
            cleanup.fix_deployment_config()
        elif command == "show-files":
            cleanup.show_remaining_files()
        else:
            print("Usage: python cleanup_project.py [fix-config|show-files]")
    else:
        cleanup.run_cleanup()

if __name__ == "__main__":
    main() 