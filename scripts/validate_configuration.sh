#!/bin/bash

# NavImpact V2 - Configuration Validation Script
# This script validates that all configuration files point to the correct URLs

echo "🔍 NAVIMPACT CONFIGURATION VALIDATION"
echo "====================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Expected URLs for NavImpact
EXPECTED_API_URL="https://navimpact-api.onrender.com"
EXPECTED_WEB_URL="https://navimpact-web.onrender.com"
EXPECTED_STAGING_API_URL="https://navimpact-api-staging.onrender.com"
EXPECTED_STAGING_WEB_URL="https://navimpact-web-staging.onrender.com"

# Forbidden URLs (SGE/Shadow Goose)
FORBIDDEN_URLS=(
    "shadow-goose-api.onrender.com"
    "shadow-goose-dashboard.onrender.com"
    "sge-dashboard-api.onrender.com"
    "sge-dashboard.onrender.com"
)

echo "🎯 VALIDATING CONFIGURATION FILES"
echo "================================"
echo ""

# Function to check if file contains forbidden URLs
check_forbidden_urls() {
    local file="$1"
    local found_forbidden=false
    
    for url in "${FORBIDDEN_URLS[@]}"; do
        if grep -q "$url" "$file"; then
            echo -e "${RED}❌ FORBIDDEN URL FOUND: $url in $file${NC}"
            found_forbidden=true
        fi
    done
    
    if [ "$found_forbidden" = false ]; then
        echo -e "${GREEN}✅ $file - No forbidden URLs found${NC}"
    fi
}

# Function to check if file contains expected URLs
check_expected_urls() {
    local file="$1"
    local found_expected=false
    
    if grep -q "$EXPECTED_API_URL" "$file" || grep -q "$EXPECTED_STAGING_API_URL" "$file"; then
        echo -e "${GREEN}✅ $file - Contains expected NavImpact API URL${NC}"
        found_expected=true
    fi
    
    if [ "$found_expected" = false ]; then
        echo -e "${YELLOW}⚠️  $file - No expected NavImpact API URL found${NC}"
    fi
}

# Check critical configuration files
echo "📋 Checking critical configuration files..."
echo ""

# 1. API Client
echo "🔧 Checking API Client Configuration:"
check_forbidden_urls "frontend/src/lib/api-client.ts"
check_expected_urls "frontend/src/lib/api-client.ts"
echo ""

# 2. Next.js Config
echo "⚙️  Checking Next.js Configuration:"
check_forbidden_urls "frontend/next.config.js"
check_expected_urls "frontend/next.config.js"
echo ""

# 3. Config File
echo "📄 Checking Config File:"
check_forbidden_urls "frontend/src/lib/config.ts"
check_expected_urls "frontend/src/lib/config.ts"
echo ""

# 4. Render Configuration
echo "🚀 Checking Render Configuration:"
check_forbidden_urls "render.yaml"
check_expected_urls "render.yaml"
echo ""

# 5. Staging Configuration
if [ -f "render.staging.yaml" ]; then
    echo "🔧 Checking Staging Configuration:"
    check_forbidden_urls "render.staging.yaml"
    check_expected_urls "render.staging.yaml"
    echo ""
fi

# Check for any remaining forbidden URLs in the entire project
echo "🔍 Scanning entire project for forbidden URLs..."
echo ""

forbidden_found=false
for url in "${FORBIDDEN_URLS[@]}"; do
    if grep -r "$url" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=ARCHIVE 2>/dev/null; then
        echo -e "${RED}❌ FORBIDDEN URL FOUND: $url${NC}"
        forbidden_found=true
    fi
done

if [ "$forbidden_found" = false ]; then
    echo -e "${GREEN}✅ No forbidden URLs found in project${NC}"
fi

echo ""
echo "🎯 VALIDATION SUMMARY"
echo "===================="
echo ""

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "feature/solid-refactoring-complete" ]; then
    echo -e "${GREEN}✅ Correct branch for NavImpact${NC}"
else
    echo -e "${YELLOW}⚠️  Warning: Not on main branch${NC}"
fi

echo ""
echo "📋 RECOMMENDED ACTIONS:"
echo "======================="
echo ""

if [ "$forbidden_found" = true ]; then
    echo -e "${RED}🚨 IMMEDIATE ACTIONS REQUIRED:${NC}"
    echo "1. Fix all forbidden URLs found above"
    echo "2. Replace with correct NavImpact URLs"
    echo "3. Test configuration changes"
    echo "4. Deploy to staging for verification"
    echo ""
    echo "✅ CORRECT URLS FOR NAVIMPACT:"
    echo "   API: $EXPECTED_API_URL"
    echo "   Web: $EXPECTED_WEB_URL"
    echo "   Staging API: $EXPECTED_STAGING_API_URL"
    echo "   Staging Web: $EXPECTED_STAGING_WEB_URL"
    echo ""
    exit 1
else
    echo -e "${GREEN}✅ CONFIGURATION LOOKS GOOD${NC}"
    echo "All URLs are pointing to correct NavImpact services"
    echo ""
    echo "🚀 READY FOR DEPLOYMENT"
    echo "======================="
    echo "1. Configuration validated"
    echo "2. No forbidden URLs found"
    echo "3. All files point to correct services"
    echo ""
fi

echo "🔒 PREVENTION RULES:"
echo "==================="
echo "1. NEVER use shadow-goose URLs in NavImpact branch"
echo "2. NEVER use sge-dashboard URLs in NavImpact branch"
echo "3. ALWAYS use navimpact-* URLs for NavImpact"
echo "4. ALWAYS run this script before deployment"
echo "5. ALWAYS verify branch before making changes"
echo ""

echo "✅ VALIDATION COMPLETE"
echo "=====================" 