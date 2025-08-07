#!/bin/bash

# NavImpact V2 - Fix Multiple Heads Error
# This script fixes the "Multiple heads are present" error during migrations

echo "🔧 FIXING MULTIPLE HEADS ERROR"
echo "=============================="
echo ""

echo "✅ PROGRESS: Database connection working, stamping process running"
echo "❌ NEW ISSUE: Multiple migration heads detected"
echo ""

echo "🔧 SOLUTION: Use specific revision instead of 'heads'"
echo ""

echo "📋 LATEST MIGRATION REVISION:"
echo "============================="
echo "20250127_add_sustainability_governance_tables"
echo ""

echo "🔧 MANUAL FIX REQUIRED:"
echo "======================="
echo ""
echo "1. Go to: https://dashboard.render.com"
echo "2. Find: navimpact-api-staging service"
echo "3. Go to: Settings → Build & Deploy"
echo "4. Find: Start Command field"
echo "5. Replace with this FIXED command:"
echo ""
echo "echo 'Starting STAGING backend deployment...' && echo 'Database URL: $DATABASE_URL' && echo 'Stamping database head...' && alembic stamp 20250127_add_sustainability_governance_tables && echo 'Running database migrations...' && alembic upgrade 20250127_add_sustainability_governance_tables && echo 'Starting application...' && gunicorn app.main:app --bind 0.0.0.0:\$PORT --workers 2 --worker-class uvicorn.workers.UvicornWorker --timeout 300 --preload"
echo ""
echo "6. Click 'Save Changes'"
echo "7. Go to 'Manual Deploy' section"
echo "8. Click 'Deploy latest commit'"
echo ""

echo "🔍 WHAT THIS FIXES:"
echo "==================="
echo "• Uses specific revision instead of 'heads'"
echo "• Avoids multiple heads conflict"
echo "• Ensures consistent migration path"
echo ""

echo "⏱️ EXPECTED TIMELINE:"
echo "====================="
echo "• Database stamping: 30 seconds"
echo "• Migration completion: 2-3 minutes"
echo "• Backend redeployment: 5-8 minutes"
echo ""

echo "✅ SUCCESS INDICATORS:"
echo "====================="
echo "• No 'Multiple heads' errors in logs"
echo "• All tables created successfully"
echo "• Backend returns 200 OK"
echo "• API endpoints work properly"
echo ""

echo "🎯 NEXT STEPS:"
echo "=============="
echo "1. Apply the fixed start command above"
echo "2. Monitor deployment logs"
echo "3. Test API endpoints after deployment"
echo "4. Verify all tables exist"
echo "" 