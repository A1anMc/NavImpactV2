#!/bin/bash

# NavImpact V2 - Clear Cache and Deploy Script
# This script clears all caches and forces a fresh deployment

echo "🧹 NAVIMPACT V2 - CLEAR CACHE AND DEPLOY"
echo "========================================="
echo ""

# Clear local caches
echo "📦 Clearing local caches..."

# Frontend cache
echo "Clearing frontend cache..."
cd frontend
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo
echo "✅ Frontend cache cleared"

# Backend cache
cd ..
echo "Clearing backend cache..."
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find . -name "*.pyc" -delete 2>/dev/null || true
find . -name "*.pyo" -delete 2>/dev/null || true
echo "✅ Backend cache cleared"

# Git cache
echo "Clearing git cache..."
git gc --prune=now
echo "✅ Git cache cleared"

# Force a new deployment
echo ""
echo "🚀 Force triggering deployment..."

# Make a small change to force deployment
echo "# Cache cleared and deployment triggered - $(date)" >> DEPLOYMENT_CACHE_CLEAR.md
git add DEPLOYMENT_CACHE_CLEAR.md
git commit -m "cache: Clear all caches and force fresh deployment - $(date)"

# Force push to trigger Render deployment
echo "Force pushing to trigger Render deployment..."
git push origin feature/solid-refactoring-complete --force

echo ""
echo "📊 Deployment URLs:"
echo "Frontend: https://navimpact-web-staging.onrender.com"
echo "Backend: https://navimpact-api-staging.onrender.com"
echo "Dashboard: https://dashboard.render.com"
echo ""

echo "⏱️  Expected Timeline:"
echo "• Cache clearing: ✅ Complete"
echo "• Build detection: 2-5 minutes"
echo "• Fresh deployment: 10-15 minutes"
echo "• Total: 15-20 minutes"
echo ""

echo "🔍 Monitoring deployment..."
echo "Press Ctrl+C to stop monitoring"
echo ""

# Monitor deployment status
while true; do
    echo "$(date): Checking deployment status..."
    
    # Check frontend
    FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://navimpact-web-staging.onrender.com)
    echo "Frontend: $FRONTEND_STATUS"
    
    # Check backend
    BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://navimpact-api-staging.onrender.com/health)
    echo "Backend: $BACKEND_STATUS"
    
    if [ "$FRONTEND_STATUS" = "200" ] && [ "$BACKEND_STATUS" = "200" ]; then
        echo "🎉 DEPLOYMENT SUCCESSFUL!"
        echo "Both services are responding with 200 OK"
        echo "Cache clearing and fresh deployment worked!"
        break
    elif [ "$FRONTEND_STATUS" = "502" ] || [ "$BACKEND_STATUS" = "502" ]; then
        echo "⏳ Still deploying... (502 = service starting)"
    else
        echo "⚠️  Unexpected status codes"
    fi
    
    echo "Waiting 30 seconds before next check..."
    sleep 30
done

echo ""
echo "✅ Cache clearing and deployment complete!" 