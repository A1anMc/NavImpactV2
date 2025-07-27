#!/bin/bash

# 🛡️ NavImpact Pre-Deployment Safety Check
# Purpose: Automated validation before deployment
# Usage: ./scripts/pre_deployment_check.sh

set -e  # Exit on any error

echo "🛡️  NavImpact Pre-Deployment Safety Check"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Function to print info
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

FAILED_CHECKS=0
TOTAL_CHECKS=0

echo "📋 Starting comprehensive pre-deployment checks..."
echo ""

# 1. Code Quality Checks
echo "🔍 1. Code Quality Checks"
echo "------------------------"

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -f "frontend/package.json" ]; then
    echo -e "${RED}❌ Not in project root directory${NC}"
    exit 1
fi

# Frontend checks
if [ -d "frontend" ]; then
    cd frontend
    
    print_info "Running frontend checks..."
    
    # Linting
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if npm run lint > /dev/null 2>&1; then
        print_status 0 "Linting passed"
    else
        print_status 1 "Linting failed"
        print_warning "Run 'npm run lint' to see details"
    fi
    
    # TypeScript check
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if npm run type-check > /dev/null 2>&1; then
        print_status 0 "TypeScript check passed"
    else
        print_status 1 "TypeScript check failed"
        print_warning "Run 'npm run type-check' to see details"
    fi
    
    # Build test
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if npm run build > /dev/null 2>&1; then
        print_status 0 "Build test passed"
    else
        print_status 1 "Build test failed"
        print_warning "Run 'npm run build' to see details"
    fi
    
    # Security audit
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if npm audit --audit-level=high > /dev/null 2>&1; then
        print_status 0 "Security audit passed"
    else
        print_status 1 "Security audit failed"
        print_warning "Run 'npm audit' to see details"
    fi
    
    cd ..
fi

# Backend checks
if [ -f "requirements.txt" ]; then
    print_info "Running backend checks..."
    
    # Python syntax check
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if python -m py_compile app/main.py > /dev/null 2>&1; then
        print_status 0 "Python syntax check passed"
    else
        print_status 1 "Python syntax check failed"
    fi
    
    # Import check
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if python -c "import app.main" > /dev/null 2>&1; then
        print_status 0 "Python imports check passed"
    else
        print_status 1 "Python imports check failed"
    fi
fi

echo ""

# 2. Database Safety
echo "🗄️  2. Database Safety"
echo "---------------------"

# Check for pending migrations
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if [ -f "alembic.ini" ]; then
    if alembic current > /dev/null 2>&1; then
        print_status 0 "Database migration status check passed"
    else
        print_status 1 "Database migration status check failed"
        print_warning "Check alembic status"
    fi
else
    print_warning "No alembic.ini found - skipping migration check"
fi

# Check database connection
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if python scripts/check_database_connection.py > /dev/null 2>&1; then
    print_status 0 "Database connection test passed"
else
    print_status 1 "Database connection test failed"
    print_warning "Check database configuration"
fi

echo ""

# 3. API Compatibility
echo "🔌 3. API Compatibility"
echo "----------------------"

# Test API endpoints
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if python scripts/test_backend_api.py > /dev/null 2>&1; then
    print_status 0 "API endpoint tests passed"
else
    print_status 1 "API endpoint tests failed"
    print_warning "Check API functionality"
fi

# Test frontend-backend integration
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if python scripts/test_frontend_backend_integration.py > /dev/null 2>&1; then
    print_status 0 "Frontend-backend integration tests passed"
else
    print_status 1 "Frontend-backend integration tests failed"
    print_warning "Check API connectivity"
fi

echo ""

# 4. Environment Validation
echo "🌍 4. Environment Validation"
echo "---------------------------"

# Check environment variables
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if [ -f ".env" ] || [ -f "env.production.template" ]; then
    print_status 0 "Environment configuration files found"
else
    print_status 1 "Environment configuration files missing"
    print_warning "Ensure environment variables are configured"
fi

# Check for hardcoded secrets
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if ! grep -r "password\|secret\|key" --include="*.py" --include="*.ts" --include="*.tsx" . | grep -v "TODO\|FIXME\|example" | grep -q .; then
    print_status 0 "No obvious hardcoded secrets found"
else
    print_status 1 "Potential hardcoded secrets detected"
    print_warning "Review code for hardcoded credentials"
fi

echo ""

# 5. Performance Checks
echo "⚡ 5. Performance Checks"
echo "----------------------"

# Check build size
if [ -d "frontend" ]; then
    cd frontend
    BUILD_SIZE=$(du -sh .next 2>/dev/null | cut -f1)
    if [ ! -z "$BUILD_SIZE" ]; then
        print_info "Build size: $BUILD_SIZE"
    fi
    cd ..
fi

# Check for large files
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
LARGE_FILES=$(find . -type f -size +10M -not -path "./node_modules/*" -not -path "./.git/*" 2>/dev/null | wc -l)
if [ $LARGE_FILES -eq 0 ]; then
    print_status 0 "No excessively large files detected"
else
    print_status 1 "$LARGE_FILES large files detected"
    print_warning "Consider optimizing large files"
fi

echo ""

# 6. Git Status
echo "📝 6. Git Status"
echo "---------------"

# Check for uncommitted changes
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if git diff-index --quiet HEAD --; then
    print_status 0 "No uncommitted changes"
else
    print_status 1 "Uncommitted changes detected"
    print_warning "Commit or stash changes before deployment"
fi

# Check branch status
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
    print_status 0 "On main branch"
else
    print_warning "Currently on branch: $CURRENT_BRANCH"
    print_info "Consider merging to main before deployment"
fi

echo ""

# Summary
echo "📊 Summary"
echo "----------"
echo "Total checks: $TOTAL_CHECKS"
echo "Passed: $((TOTAL_CHECKS - FAILED_CHECKS))"
echo "Failed: $FAILED_CHECKS"

if [ $FAILED_CHECKS -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All checks passed! Ready for deployment.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Review any warnings above"
    echo "2. Test on staging environment"
    echo "3. Deploy to production"
    exit 0
else
    echo ""
    echo -e "${RED}❌ $FAILED_CHECKS checks failed. Please fix issues before deployment.${NC}"
    echo ""
    echo "Recommended actions:"
    echo "1. Address all failed checks"
    echo "2. Review warnings"
    echo "3. Re-run this script"
    exit 1
fi 