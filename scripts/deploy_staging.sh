#!/bin/bash

# NavImpact V2 Staging Deployment Script
# This script helps trigger and monitor the staging deployment

echo "🚀 NAVIMPACT V2 STAGING DEPLOYMENT"
echo "=================================="
echo ""

# Check current branch
echo "📋 Current Status:"
echo "Branch: $(git branch --show-current)"
echo "Last Commit: $(git log --oneline -1)"
echo ""

# Check if we're on the correct branch
if [ "$(git branch --show-current)" != "feature/solid-refactoring-complete" ]; then
    echo "❌ ERROR: Not on feature/solid-refactoring-complete branch"
    echo "Please switch to the correct branch:"
    echo "git checkout feature/solid-refactoring-complete"
    exit 1
fi

echo "✅ Branch check passed"

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  WARNING: There are uncommitted changes"
    echo "Changes:"
    git status --short
    echo ""
    read -p "Do you want to commit these changes? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "Auto-commit before deployment"
        git push origin feature/solid-refactoring-complete
    fi
fi

# Force push to ensure Render picks up changes
echo "🔄 Force pushing to trigger deployment..."
git push origin feature/solid-refactoring-complete --force

echo ""
echo "📊 Deployment URLs:"
echo "Frontend: https://navimpact-web-staging.onrender.com"
echo "Backend: https://navimpact-api-staging.onrender.com"
echo "Dashboard: https://dashboard.render.com"
echo ""

echo "⏱️  Expected Timeline:"
echo "• Build detection: 2-5 minutes"
echo "• Backend deployment: 8-12 minutes"
echo "• Frontend deployment: 5-8 minutes"
echo "• Total: 15-25 minutes"
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
echo "✅ Deployment monitoring complete!" 