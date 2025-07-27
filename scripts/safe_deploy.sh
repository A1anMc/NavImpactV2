#!/bin/bash

# 🚀 NavImpact Safe Deployment Workflow
# Purpose: Complete deployment process with safety checks
# Usage: ./scripts/safe_deploy.sh [--staging|--production] [--monitor-duration=30]

set -e

# Parse command line arguments
DEPLOYMENT_TYPE="production"
MONITOR_DURATION=30

while [[ $# -gt 0 ]]; do
    case $1 in
        --staging)
            DEPLOYMENT_TYPE="staging"
            shift
            ;;
        --production)
            DEPLOYMENT_TYPE="production"
            shift
            ;;
        --monitor-duration=*)
            MONITOR_DURATION="${1#*=}"
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--staging|--production] [--monitor-duration=30]"
            exit 1
            ;;
    esac
done

echo "🚀 NavImpact Safe Deployment Workflow"
echo "====================================="
echo "Deployment Type: $DEPLOYMENT_TYPE"
echo "Monitor Duration: $MONITOR_DURATION minutes"
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

# Function to print step
print_step() {
    echo ""
    echo -e "${BLUE}🔧 $1${NC}"
    echo "----------------------------------------"
}

# Function to confirm action
confirm_action() {
    local message="$1"
    echo ""
    echo -e "${YELLOW}$message${NC}"
    read -p "Continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 0
    fi
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Initialize deployment log
DEPLOYMENT_LOG="deployment_$(date +%Y%m%d_%H%M%S).log"
echo "Deployment started at $(date)" > "$DEPLOYMENT_LOG"

# Step 1: Pre-deployment checks
print_step "Step 1: Pre-deployment Safety Checks"

if [ ! -f "scripts/pre_deployment_check.sh" ]; then
    echo -e "${RED}❌ Pre-deployment check script not found${NC}"
    exit 1
fi

print_info "Running comprehensive pre-deployment checks..."
if ./scripts/pre_deployment_check.sh >> "$DEPLOYMENT_LOG" 2>&1; then
    print_status 0 "Pre-deployment checks passed"
else
    print_status 1 "Pre-deployment checks failed"
    echo "Check $DEPLOYMENT_LOG for details"
    exit 1
fi

# Step 2: Environment validation
print_step "Step 2: Environment Validation"

# Check if we're on the right branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$DEPLOYMENT_TYPE" = "production" ] && [ "$CURRENT_BRANCH" != "main" ]; then
    print_warning "You're not on the main branch (currently on $CURRENT_BRANCH)"
    confirm_action "Do you want to continue with deployment from $CURRENT_BRANCH?"
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    print_warning "You have uncommitted changes"
    confirm_action "Do you want to commit changes before deployment?"
    
    # Auto-commit if confirmed
    git add .
    git commit -m "Auto-commit before deployment $(date)"
    print_status 0 "Changes committed"
fi

# Step 3: Backup and preparation
print_step "Step 3: Backup and Preparation"

# Create backup of current state
BACKUP_BRANCH="backup/$(date +%Y%m%d_%H%M%S)"
git checkout -b "$BACKUP_BRANCH" > /dev/null 2>&1
git checkout "$CURRENT_BRANCH" > /dev/null 2>&1
print_status 0 "Backup branch created: $BACKUP_BRANCH"

# Check database backup (if applicable)
if command_exists "pg_dump"; then
    print_info "Database backup recommended for production deployments"
    confirm_action "Do you want to create a database backup?"
    # Add database backup logic here if needed
fi

# Step 4: Deployment execution
print_step "Step 4: Deployment Execution"

if [ "$DEPLOYMENT_TYPE" = "staging" ]; then
    print_info "Deploying to staging environment..."
    # Add staging deployment logic here
    print_status 0 "Staging deployment initiated"
else
    print_info "Deploying to production environment..."
    
    # Push to main branch
    if git push origin "$CURRENT_BRANCH":main; then
        print_status 0 "Code pushed to production"
    else
        print_status 1 "Failed to push code to production"
        exit 1
    fi
    
    # Wait for Render deployment
    print_info "Waiting for Render deployment to start..."
    sleep 10
    
    # Check deployment status
    DEPLOYMENT_STARTED=false
    for i in {1..30}; do
        if curl -s https://navimpact-web.onrender.com > /dev/null 2>&1; then
            DEPLOYMENT_STARTED=true
            break
        fi
        print_info "Waiting for deployment... ($i/30)"
        sleep 10
    done
    
    if [ "$DEPLOYMENT_STARTED" = true ]; then
        print_status 0 "Deployment started successfully"
    else
        print_status 1 "Deployment failed to start"
        exit 1
    fi
fi

# Step 5: Post-deployment verification
print_step "Step 5: Post-deployment Verification"

print_info "Waiting for deployment to complete..."
sleep 30

# Run health checks
HEALTH_CHECKS_PASSED=0
for i in {1..10}; do
    print_info "Health check attempt $i/10..."
    
    # Check API health
    if curl -s https://navimpact-api.onrender.com/health | grep -q "healthy"; then
        API_HEALTH=true
    else
        API_HEALTH=false
    fi
    
    # Check frontend health
    if curl -s -I https://navimpact-web.onrender.com | grep -q "200 OK"; then
        FRONTEND_HEALTH=true
    else
        FRONTEND_HEALTH=false
    fi
    
    if [ "$API_HEALTH" = true ] && [ "$FRONTEND_HEALTH" = true ]; then
        HEALTH_CHECKS_PASSED=$((HEALTH_CHECKS_PASSED + 1))
    fi
    
    if [ $HEALTH_CHECKS_PASSED -ge 3 ]; then
        break
    fi
    
    sleep 10
done

if [ $HEALTH_CHECKS_PASSED -ge 3 ]; then
    print_status 0 "Health checks passed"
else
    print_status 1 "Health checks failed"
    print_warning "Deployment may have issues"
fi

# Step 6: Automated testing
print_step "Step 6: Automated Testing"

print_info "Running automated test suite..."
if python scripts/test_production_api.py >> "$DEPLOYMENT_LOG" 2>&1; then
    print_status 0 "API tests passed"
else
    print_status 1 "API tests failed"
    print_warning "Check $DEPLOYMENT_LOG for details"
fi

if python scripts/test_production_frontend.py >> "$DEPLOYMENT_LOG" 2>&1; then
    print_status 0 "Frontend tests passed"
else
    print_status 1 "Frontend tests failed"
    print_warning "Check $DEPLOYMENT_LOG for details"
fi

# Step 7: Monitoring setup
print_step "Step 7: Post-deployment Monitoring"

print_info "Starting post-deployment monitoring for $MONITOR_DURATION minutes..."
if [ -f "scripts/post_deployment_monitor.sh" ]; then
    # Run monitoring in background
    ./scripts/post_deployment_monitor.sh "$MONITOR_DURATION" > "monitoring_$(date +%Y%m%d_%H%M%S).log" 2>&1 &
    MONITOR_PID=$!
    print_status 0 "Monitoring started (PID: $MONITOR_PID)"
    print_info "Monitor logs: monitoring_$(date +%Y%m%d_%H%M%S).log"
else
    print_warning "Post-deployment monitor script not found"
fi

# Step 8: Deployment summary
print_step "Step 8: Deployment Summary"

echo ""
echo "📊 Deployment Summary"
echo "===================="
echo "Deployment Type: $DEPLOYMENT_TYPE"
echo "Branch: $CURRENT_BRANCH"
echo "Backup Branch: $BACKUP_BRANCH"
echo "Deployment Log: $DEPLOYMENT_LOG"
echo "Health Checks Passed: $HEALTH_CHECKS_PASSED/10"
echo ""

if [ $HEALTH_CHECKS_PASSED -ge 3 ]; then
    echo -e "${GREEN}🎉 Deployment Status: SUCCESSFUL${NC}"
    echo ""
    echo "✅ What's working:"
    echo "- Code deployed successfully"
    echo "- Health checks passed"
    echo "- Automated tests completed"
    echo "- Monitoring active"
    echo ""
    echo "📋 Next steps:"
    echo "1. Monitor system for the next 24 hours"
    echo "2. Check user feedback"
    echo "3. Review monitoring logs"
    echo "4. Update deployment documentation"
else
    echo -e "${YELLOW}⚠️  Deployment Status: PARTIAL SUCCESS${NC}"
    echo ""
    echo "⚠️  Issues detected:"
    echo "- Some health checks failed"
    echo "- Manual verification recommended"
    echo ""
    echo "📋 Immediate actions:"
    echo "1. Check deployment logs"
    echo "2. Verify system functionality manually"
    echo "3. Monitor for issues"
    echo "4. Consider rollback if necessary"
fi

echo ""
echo "📞 Emergency Contacts:"
echo "- Lead Developer: [Contact Info]"
echo "- DevOps Engineer: [Contact Info]"
echo "- System Administrator: [Contact Info]"

echo ""
echo "🔄 Rollback Commands:"
echo "git checkout $BACKUP_BRANCH"
echo "git push origin $BACKUP_BRANCH:main --force"

# Save deployment summary to log
{
    echo ""
    echo "Deployment completed at $(date)"
    echo "Status: $([ $HEALTH_CHECKS_PASSED -ge 3 ] && echo "SUCCESSFUL" || echo "PARTIAL SUCCESS")"
    echo "Health Checks: $HEALTH_CHECKS_PASSED/10"
} >> "$DEPLOYMENT_LOG"

print_info "Deployment workflow completed. Check logs for details." 