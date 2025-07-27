#!/bin/bash

# 📊 NavImpact Post-Deployment Monitor
# Purpose: Monitor system health after deployment
# Usage: ./scripts/post_deployment_monitor.sh [duration_minutes]

set -e

# Default monitoring duration (30 minutes)
DURATION=${1:-30}
INTERVAL=60  # Check every 60 seconds

echo "📊 NavImpact Post-Deployment Monitor"
echo "===================================="
echo "Monitoring duration: $DURATION minutes"
echo "Check interval: $INTERVAL seconds"
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

# Function to check API health
check_api_health() {
    local response=$(curl -s -w "%{http_code}" https://navimpact-api.onrender.com/health -o /dev/null)
    if [ "$response" = "200" ]; then
        return 0
    else
        return 1
    fi
}

# Function to check frontend health
check_frontend_health() {
    local response=$(curl -s -w "%{http_code}" https://navimpact-web.onrender.com -o /dev/null)
    if [ "$response" = "200" ]; then
        return 0
    else
        return 1
    fi
}

# Function to check database connection
check_database() {
    if python scripts/check_database_connection.py > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to check API response time
check_api_performance() {
    local start_time=$(date +%s%N)
    curl -s https://navimpact-api.onrender.com/health > /dev/null
    local end_time=$(date +%s%N)
    local duration=$(( (end_time - start_time) / 1000000 ))  # Convert to milliseconds
    echo $duration
}

# Function to check frontend response time
check_frontend_performance() {
    local start_time=$(date +%s%N)
    curl -s https://navimpact-web.onrender.com > /dev/null
    local end_time=$(date +%s%N)
    local duration=$(( (end_time - start_time) / 1000000 ))  # Convert to milliseconds
    echo $duration
}

# Initialize counters
total_checks=0
api_failures=0
frontend_failures=0
database_failures=0
performance_issues=0

# Performance thresholds
API_THRESHOLD=2000      # 2 seconds
FRONTEND_THRESHOLD=5000 # 5 seconds

echo "🚀 Starting monitoring..."
echo ""

# Calculate end time
end_time=$(date -d "+$DURATION minutes" +%s)

while [ $(date +%s) -lt $end_time ]; do
    current_time=$(date '+%H:%M:%S')
    total_checks=$((total_checks + 1))
    
    echo "⏰ $current_time - Check #$total_checks"
    echo "----------------------------------------"
    
    # Check API health
    if check_api_health; then
        print_status 0 "API Health: OK"
    else
        print_status 1 "API Health: FAILED"
        api_failures=$((api_failures + 1))
    fi
    
    # Check frontend health
    if check_frontend_health; then
        print_status 0 "Frontend Health: OK"
    else
        print_status 1 "Frontend Health: FAILED"
        frontend_failures=$((frontend_failures + 1))
    fi
    
    # Check database connection
    if check_database; then
        print_status 0 "Database Connection: OK"
    else
        print_status 1 "Database Connection: FAILED"
        database_failures=$((database_failures + 1))
    fi
    
    # Check API performance
    api_response_time=$(check_api_performance)
    if [ $api_response_time -lt $API_THRESHOLD ]; then
        print_status 0 "API Performance: ${api_response_time}ms"
    else
        print_status 1 "API Performance: ${api_response_time}ms (SLOW)"
        performance_issues=$((performance_issues + 1))
    fi
    
    # Check frontend performance
    frontend_response_time=$(check_frontend_performance)
    if [ $frontend_response_time -lt $FRONTEND_THRESHOLD ]; then
        print_status 0 "Frontend Performance: ${frontend_response_time}ms"
    else
        print_status 1 "Frontend Performance: ${frontend_response_time}ms (SLOW)"
        performance_issues=$((performance_issues + 1))
    fi
    
    echo ""
    
    # Calculate remaining time
    remaining_seconds=$((end_time - $(date +%s)))
    remaining_minutes=$((remaining_seconds / 60))
    remaining_seconds=$((remaining_seconds % 60))
    
    if [ $remaining_seconds -gt 0 ]; then
        print_info "Next check in $INTERVAL seconds (${remaining_minutes}m ${remaining_seconds}s remaining)"
        sleep $INTERVAL
    fi
done

echo "📊 Monitoring Complete - Summary"
echo "================================"
echo "Total checks performed: $total_checks"
echo ""

# Calculate failure rates
if [ $total_checks -gt 0 ]; then
    api_failure_rate=$(echo "scale=2; $api_failures * 100 / $total_checks" | bc -l 2>/dev/null || echo "0")
    frontend_failure_rate=$(echo "scale=2; $frontend_failures * 100 / $total_checks" | bc -l 2>/dev/null || echo "0")
    database_failure_rate=$(echo "scale=2; $database_failures * 100 / $total_checks" | bc -l 2>/dev/null || echo "0")
    performance_issue_rate=$(echo "scale=2; $performance_issues * 100 / $total_checks" | bc -l 2>/dev/null || echo "0")
else
    api_failure_rate=0
    frontend_failure_rate=0
    database_failure_rate=0
    performance_issue_rate=0
fi

echo "API Failures: $api_failures/$total_checks (${api_failure_rate}%)"
echo "Frontend Failures: $frontend_failures/$total_checks (${frontend_failure_rate}%)"
echo "Database Failures: $database_failures/$total_checks (${database_failure_rate}%)"
echo "Performance Issues: $performance_issues/$total_checks (${performance_issue_rate}%)"
echo ""

# Determine overall status
if [ $api_failures -eq 0 ] && [ $frontend_failures -eq 0 ] && [ $database_failures -eq 0 ] && [ $performance_issues -eq 0 ]; then
    echo -e "${GREEN}🎉 Deployment Status: EXCELLENT${NC}"
    echo "All systems operating normally with no issues detected."
elif [ $api_failures -eq 0 ] && [ $frontend_failures -eq 0 ] && [ $database_failures -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Deployment Status: GOOD${NC}"
    echo "Core systems operational with minor performance issues."
elif [ $api_failures -lt 3 ] && [ $frontend_failures -lt 3 ]; then
    echo -e "${YELLOW}⚠️  Deployment Status: ACCEPTABLE${NC}"
    echo "Some intermittent issues detected. Monitor closely."
else
    echo -e "${RED}❌ Deployment Status: PROBLEMATIC${NC}"
    echo "Multiple failures detected. Immediate attention required."
fi

echo ""

# Recommendations
echo "📋 Recommendations:"
if [ $api_failures -gt 0 ]; then
    echo "- Investigate API failures and check backend logs"
fi
if [ $frontend_failures -gt 0 ]; then
    echo "- Check frontend deployment and build status"
fi
if [ $database_failures -gt 0 ]; then
    echo "- Verify database connectivity and configuration"
fi
if [ $performance_issues -gt 0 ]; then
    echo "- Optimize performance bottlenecks"
fi

if [ $api_failures -eq 0 ] && [ $frontend_failures -eq 0 ] && [ $database_failures -eq 0 ] && [ $performance_issues -eq 0 ]; then
    echo "- Continue monitoring for the next 24 hours"
    echo "- Document successful deployment patterns"
fi

echo ""
echo "📈 Next Steps:"
echo "1. Review any issues identified above"
echo "2. Check application logs for detailed error information"
echo "3. Monitor user feedback and system metrics"
echo "4. Update deployment documentation with learnings" 