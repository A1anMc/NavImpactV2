#!/bin/bash

# NavImpact V2 - Database Fix and System Test Script
# This script fixes database migration issues and tests the entire system

echo "🔧 NAVIMPACT V2 - DATABASE FIX AND SYSTEM TEST"
echo "==============================================="
echo ""

# Step 1: Fix the backend start command
echo "📋 STEP 1: FIXING DATABASE MIGRATION ISSUE"
echo "=========================================="
echo ""

echo "❌ CURRENT ISSUE:"
echo "Backend start command says 'Starting application without migrations'"
echo "This means NO DATABASE TABLES EXIST!"
echo ""

echo "✅ REQUIRED FIX:"
echo "Change start command to run 'alembic upgrade heads'"
echo ""

echo "🔧 MANUAL FIX REQUIRED:"
echo "1. Go to: https://dashboard.render.com"
echo "2. Find: navimpact-api-staging service"
echo "3. Go to: Settings → Build & Deploy"
echo "4. Find: Start Command field"
echo "5. Change FROM:"
echo "   echo 'Starting application without migrations...'"
echo "6. Change TO:"
echo "   echo 'Running database migrations...' && alembic upgrade heads"
echo "7. Save and redeploy"
echo ""

# Step 2: Test current system status
echo "📊 STEP 2: TESTING CURRENT SYSTEM STATUS"
echo "========================================"
echo ""

echo "Testing frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://navimpact-web-staging.onrender.com)
echo "Frontend Status: $FRONTEND_STATUS"

echo "Testing backend..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://navimpact-api-staging.onrender.com/health)
echo "Backend Status: $BACKEND_STATUS"

echo ""

# Step 3: Check what database tables should exist
echo "📋 STEP 3: DATABASE TABLES THAT SHOULD EXIST"
echo "============================================"
echo ""

echo "Required tables (from migrations):"
echo "✅ users - User accounts and authentication"
echo "✅ projects - Project management"
echo "✅ tasks - Task management"
echo "✅ time_entries - Time tracking"
echo "✅ grants - Grant opportunities"
echo "✅ task_comments - Task discussions"
echo "✅ reactions - User reactions"
echo ""

# Step 4: Test API endpoints (will fail until database is fixed)
echo "🔍 STEP 4: TESTING API ENDPOINTS"
echo "================================"
echo ""

echo "Testing API endpoints (will fail until database is fixed):"
echo ""

echo "1. Health check:"
curl -s https://navimpact-api-staging.onrender.com/health
echo ""
echo ""

echo "2. Users endpoint:"
curl -s https://navimpact-api-staging.onrender.com/api/v1/users
echo ""
echo ""

echo "3. Projects endpoint:"
curl -s https://navimpact-api-staging.onrender.com/api/v1/projects
echo ""
echo ""

# Step 5: Provide comprehensive fix instructions
echo "🎯 STEP 5: COMPREHENSIVE FIX INSTRUCTIONS"
echo "=========================================="
echo ""

echo "🚨 CRITICAL FIX REQUIRED:"
echo "========================="
echo ""
echo "The backend needs database migrations to create tables."
echo ""
echo "MANUAL FIX STEPS:"
echo "================="
echo ""
echo "1. Go to Render Dashboard: https://dashboard.render.com"
echo "2. Find 'navimpact-api-staging' service"
echo "3. Click on the service"
echo "4. Go to 'Settings' tab"
echo "5. Scroll to 'Build & Deploy' section"
echo "6. Find 'Start Command' field"
echo "7. Replace the entire start command with:"
echo ""
echo "echo 'Starting STAGING backend deployment...' && echo 'Database URL: $DATABASE_URL' && echo 'Running database migrations...' && alembic upgrade heads && echo 'Starting application...' && gunicorn app.main:app --bind 0.0.0.0:\$PORT --workers 2 --worker-class uvicorn.workers.UvicornWorker --timeout 300 --preload"
echo ""
echo "8. Click 'Save Changes'"
echo "9. Go to 'Manual Deploy' section"
echo "10. Click 'Deploy latest commit'"
echo ""
echo "EXPECTED TIMELINE:"
echo "=================="
echo "• Database migration: 2-3 minutes"
echo "• Backend redeployment: 5-8 minutes"
echo "• Full system test: 10-15 minutes"
echo ""
echo "SUCCESS INDICATORS:"
echo "=================="
echo "✅ Backend returns 200 OK (not 400)"
echo "✅ API endpoints return data (not errors)"
echo "✅ Frontend can communicate with backend"
echo "✅ All database tables exist"
echo ""

# Step 6: Monitor and test after fix
echo "🔍 STEP 6: POST-FIX TESTING"
echo "==========================="
echo ""

echo "After applying the database fix, run these tests:"
echo ""
echo "1. Backend health:"
echo "   curl https://navimpact-api-staging.onrender.com/health"
echo ""
echo "2. Test API endpoints:"
echo "   curl https://navimpact-api-staging.onrender.com/api/v1/users"
echo "   curl https://navimpact-api-staging.onrender.com/api/v1/projects"
echo "   curl https://navimpact-api-staging.onrender.com/api/v1/tasks"
echo ""
echo "3. Test frontend integration:"
echo "   Visit: https://navimpact-web-staging.onrender.com"
echo ""

echo ""
echo "✅ FIX AND TEST SCRIPT COMPLETE"
echo "==============================="
echo ""
echo "Next action: Apply the database migration fix in Render dashboard"
echo "" 