#!/bin/bash

# 🚀 NavImpact Deployment Script
# Ensures proper deployment order: Backend → Migration → Frontend

set -e  # Exit on any error

echo "🚀 Starting NavImpact Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="https://navimpact-api.onrender.com"
FRONTEND_URL="https://navimpact-web.onrender.com"
HEALTH_ENDPOINT="/health"
MIGRATION_ENDPOINT="/api/v1/migrations/budget-migration"

# Function to check if service is healthy
check_health() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${BLUE}🔍 Checking ${service_name} health...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f "${url}${HEALTH_ENDPOINT}" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ ${service_name} is healthy!${NC}"
            return 0
        else
            echo -e "${YELLOW}⏳ ${service_name} not ready yet (attempt ${attempt}/${max_attempts})...${NC}"
            sleep 10
            ((attempt++))
        fi
    done
    
    echo -e "${RED}❌ ${service_name} failed to become healthy after ${max_attempts} attempts${NC}"
    return 1
}

# Function to trigger migration
trigger_migration() {
    echo -e "${BLUE}🔧 Triggering budget migration...${NC}"
    
    # Check if migration endpoint exists
    if curl -s -f "${BACKEND_URL}${MIGRATION_ENDPOINT}" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Migration endpoint is available${NC}"
        
        # Trigger migration (requires admin token)
        echo -e "${YELLOW}⚠️  Migration requires admin token - please run manually:${NC}"
        echo "curl -X POST '${BACKEND_URL}${MIGRATION_ENDPOINT}' \\"
        echo "  -H 'Authorization: Bearer YOUR_ADMIN_TOKEN'"
    else
        echo -e "${YELLOW}⚠️  Migration endpoint not ready yet${NC}"
    fi
}

# Function to deploy backend
deploy_backend() {
    echo -e "${BLUE}🔧 Deploying Backend API...${NC}"
    
    # Push to trigger backend deployment
    git push origin main
    
    echo -e "${YELLOW}⏳ Waiting for backend deployment...${NC}"
    sleep 30
    
    # Check backend health
    if check_health "${BACKEND_URL}" "Backend API"; then
        echo -e "${GREEN}✅ Backend deployment successful!${NC}"
        return 0
    else
        echo -e "${RED}❌ Backend deployment failed${NC}"
        return 1
    fi
}

# Function to deploy frontend
deploy_frontend() {
    echo -e "${BLUE}🔧 Deploying Frontend...${NC}"
    
    # Trigger frontend deployment manually
    echo -e "${YELLOW}⚠️  Please manually deploy frontend from Render dashboard${NC}"
    echo "Or wait for auto-deployment if enabled"
    
    # Check frontend health
    if check_health "${FRONTEND_URL}" "Frontend Web"; then
        echo -e "${GREEN}✅ Frontend deployment successful!${NC}"
        return 0
    else
        echo -e "${RED}❌ Frontend deployment failed${NC}"
        return 1
    fi
}

# Main deployment flow
main() {
    echo -e "${BLUE}🎯 NavImpact Deployment Process${NC}"
    echo "=================================="
    
    # Step 1: Deploy Backend
    if deploy_backend; then
        echo -e "${GREEN}✅ Backend deployment completed${NC}"
    else
        echo -e "${RED}❌ Backend deployment failed - stopping${NC}"
        exit 1
    fi
    
    # Step 2: Trigger Migration
    trigger_migration
    
    # Step 3: Deploy Frontend
    if deploy_frontend; then
        echo -e "${GREEN}✅ Frontend deployment completed${NC}"
    else
        echo -e "${RED}❌ Frontend deployment failed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo -e "${BLUE}📊 Services:${NC}"
    echo "  Backend: ${BACKEND_URL}"
    echo "  Frontend: ${FRONTEND_URL}"
}

# Run deployment
main "$@" 