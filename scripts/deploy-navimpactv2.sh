#!/bin/bash

# NavImpactV2 Deployment Script
# Updates Render deployment to use NavImpactV2 repository

echo "🚀 NavImpactV2 Deployment Script"
echo "=================================="

# Check if render CLI is installed
if ! command -v render &> /dev/null; then
    echo "❌ Render CLI not found. Please install it first:"
    echo "   brew install render"
    echo ""
    echo "📋 Manual Steps:"
    echo "1. Go to: https://dashboard.render.com"
    echo "2. Find your NavImpact services"
    echo "3. Update repository URL to: https://github.com/A1anMc/NavImpactV2.git"
    echo "4. Trigger manual deployment"
    exit 1
fi

echo "✅ Render CLI found"

# Check if logged in
if ! render whoami &> /dev/null; then
    echo "❌ Not logged into Render. Please run:"
    echo "   render login"
    exit 1
fi

echo "✅ Logged into Render"

# List current services
echo ""
echo "📋 Current Render Services:"
render services list

echo ""
echo "🔄 Updating services to NavImpactV2..."

# Update backend service
echo "📡 Updating navimpact-api..."
render service update navimpact-api --repo https://github.com/A1anMc/NavImpactV2.git

# Update frontend service  
echo "🎨 Updating navimpact-frontend..."
render service update navimpact-frontend --repo https://github.com/A1anMc/NavImpactV2.git

echo ""
echo "✅ Deployment update complete!"
echo ""
echo "🌐 Your NavImpactV2 services:"
echo "   Frontend: https://navimpact-frontend.onrender.com"
echo "   Backend:  https://navimpact-api.onrender.com"
echo ""
echo "📊 Monitor deployment at: https://dashboard.render.com" 