#!/bin/bash

# NavImpact V2 - Fix Revision ID Error
# This script fixes the "Can't locate revision" error with correct revision ID

echo "🔧 FIXING REVISION ID ERROR"
echo "==========================="
echo ""

echo "✅ PROGRESS: Database connection working, stamping process running"
echo "❌ NEW ISSUE: Wrong revision ID used"
echo ""

echo "🔧 SOLUTION: Use correct revision ID '20250127_sustainability'"
echo ""

echo "📋 CORRECT REVISION ID:"
echo "======================="
echo "20250127_sustainability"
echo ""

echo "🔧 MANUAL FIX REQUIRED:"
echo "======================="
echo ""
echo "1. Go to: https://dashboard.render.com"
echo "2. Find: navimpact-api-staging service"
echo "3. Go to: Settings → Build & Deploy"
echo "4. Find: Start Command field"
echo "5. Replace with this CORRECTED command:"
echo ""
echo "echo 'Starting STAGING backend deployment...' && echo 'Database URL: $DATABASE_URL' && echo 'Stamping database head...' && alembic stamp 20250127_sustainability && echo 'Running database migrations...' && alembic upgrade 20250127_sustainability && echo 'Starting application...' && gunicorn app.main:app --bind 0.0.0.0:\$PORT --workers 2 --worker-class uvicorn.workers.UvicornWorker --timeout 300 --preload"
echo ""
echo "6. Click 'Save Changes'"
echo "7. Go to 'Manual Deploy' section"
echo "8. Click 'Deploy latest commit'"
echo ""

echo "🔍 WHAT THIS FIXES:"
echo "==================="
echo "• Uses correct revision ID '20250127_sustainability'"
echo "• Locates the actual migration file"
echo "• Avoids 'Can't locate revision' error"
echo ""

echo "⏱️ EXPECTED TIMELINE:"
echo "====================="
echo "• Database stamping: 30 seconds"
echo "• Migration completion: 2-3 minutes"
echo "• Backend redeployment: 5-8 minutes"
echo ""

echo "✅ SUCCESS INDICATORS:"
echo "====================="
echo "• No 'Can't locate revision' errors in logs"
echo "• All tables created successfully"
echo "• Backend returns 200 OK"
echo "• API endpoints work properly"
echo ""

echo "🎯 NEXT STEPS:"
echo "=============="
echo "1. Apply the corrected start command above"
echo "2. Monitor deployment logs"
echo "3. Test API endpoints after deployment"
echo "4. Verify all tables exist"
echo "" 