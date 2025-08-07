#!/bin/bash

# NavImpact V2 - Pre-Commit Validation Hook
# This script runs before every commit to prevent configuration mistakes

echo "🔒 PRE-COMMIT VALIDATION"
echo "========================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Forbidden URLs (SGE/Shadow Goose)
FORBIDDEN_URLS=(
    "shadow-goose-api.onrender.com"
    "shadow-goose-dashboard.onrender.com"
    "sge-dashboard-api.onrender.com"
    "sge-dashboard.onrender.com"
)

# Critical files to check
CRITICAL_FILES=(
    "frontend/src/lib/api-client.ts"
    "frontend/src/lib/config.ts"
    "frontend/next.config.js"
    "render.yaml"
    "render.staging.yaml"
)

echo "🎯 Checking for forbidden URLs in critical files..."
echo ""

forbidden_found=false

# Check each critical file
for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        for url in "${FORBIDDEN_URLS[@]}"; do
            if grep -q "$url" "$file"; then
                echo -e "${RED}❌ FORBIDDEN URL FOUND: $url in $file${NC}"
                forbidden_found=true
            fi
        done
    fi
done

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)

if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "feature/solid-refactoring-complete" ]; then
    echo -e "${GREEN}✅ Correct branch: $CURRENT_BRANCH${NC}"
else
    echo -e "${YELLOW}⚠️  Warning: Not on main branch ($CURRENT_BRANCH)${NC}"
fi

echo ""

if [ "$forbidden_found" = true ]; then
    echo -e "${RED}🚨 COMMIT BLOCKED${NC}"
    echo "=================================="
    echo ""
    echo "❌ Forbidden URLs found in critical files!"
    echo ""
    echo "🔧 REQUIRED ACTIONS:"
    echo "1. Fix all forbidden URLs listed above"
    echo "2. Replace with correct NavImpact URLs:"
    echo "   - https://navimpact-api.onrender.com"
    echo "   - https://navimpact-web.onrender.com"
    echo "   - https://navimpact-api-staging.onrender.com"
    echo "   - https://navimpact-web-staging.onrender.com"
    echo ""
    echo "3. Run validation script: ./scripts/validate_configuration.sh"
    echo "4. Test your changes"
    echo "5. Try committing again"
    echo ""
    echo "🔒 PREVENTION RULES:"
    echo "==================="
    echo "• NEVER use shadow-goose URLs in NavImpact branch"
    echo "• NEVER use sge-dashboard URLs in NavImpact branch"
    echo "• ALWAYS use navimpact-* URLs for NavImpact"
    echo "• ALWAYS run validation before committing"
    echo ""
    exit 1
else
    echo -e "${GREEN}✅ VALIDATION PASSED${NC}"
    echo "=================================="
    echo ""
    echo "✅ No forbidden URLs found"
    echo "✅ Configuration looks correct"
    echo "✅ Ready to commit"
    echo ""
    echo "🚀 Proceeding with commit..."
    echo ""
fi 