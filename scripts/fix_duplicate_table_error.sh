#!/bin/bash

# NavImpact V2 - Fix Duplicate Table Error
# This script fixes the "relation already exists" error during migrations

echo "🔧 FIXING DUPLICATE TABLE ERROR"
echo "==============================="
echo ""

echo "✅ GOOD NEWS: Database migrations are now running!"
echo "❌ ISSUE: Some tables already exist (users table)"
echo ""

echo "🔧 SOLUTION: Use 'alembic stamp head' then 'alembic upgrade heads'"
echo ""

echo "📋 MANUAL FIX REQUIRED:"
echo "======================="
echo ""
echo "1. Go to: https://dashboard.render.com"
echo "2. Find: navimpact-api-staging service"
echo "3. Go to: Settings → Build & Deploy"
echo "4. Find: Start Command field"
echo "5. Replace with this FIXED command:"
echo ""
echo "echo 'Starting STAGING backend deployment...' && echo 'Database URL: $DATABASE_URL' && echo 'Stamping database head...' && alembic stamp head && echo 'Running database migrations...' && alembic upgrade heads && echo 'Starting application...' && gunicorn app.main:app --bind 0.0.0.0:\$PORT --workers 2 --worker-class uvicorn.workers.UvicornWorker --timeout 300 --preload"
echo ""
echo "6. Click 'Save Changes'"
echo "7. Go to 'Manual Deploy' section"
echo "8. Click 'Deploy latest commit'"
echo ""

echo "🔍 WHAT THIS FIXES:"
echo "==================="
echo "• 'alembic stamp head' - Marks existing tables as migrated"
echo "• 'alembic upgrade heads' - Creates missing tables only"
echo "• Prevents 'DuplicateTable' errors"
echo ""

echo "⏱️ EXPECTED TIMELINE:"
echo "====================="
echo "• Database stamping: 30 seconds"
echo "• Migration completion: 2-3 minutes"
echo "• Backend redeployment: 5-8 minutes"
echo ""

echo "✅ SUCCESS INDICATORS:"
echo "====================="
echo "• No 'DuplicateTable' errors in logs"
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