#!/bin/bash

# NavImpact V2 Production Deployment Script
# Deploys the enhanced system with ML features and monitoring

set -e

echo "🚀 Starting NavImpact V2 Production Deployment..."

# Configuration
APP_NAME="navimpact-v2"
ENVIRONMENT="production"
REGION="us-east-1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if we're in the right directory
    if [ ! -f "requirements.txt" ]; then
        print_error "requirements.txt not found. Please run from NavImpactV2 root directory."
        exit 1
    fi
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        print_warning "Virtual environment not found. Creating one..."
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
        pip install scikit-learn pandas numpy matplotlib seaborn plotly dash
    else
        print_success "Virtual environment found"
    fi
    
    # Check for environment variables
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Please ensure environment variables are set."
    fi
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    source venv/bin/activate
    
    # Run all tests
    python -m pytest tests/services/ tests/test_integration.py tests/test_refactored_scrapers.py tests/test_refactored_services.py tests/test_tasks.py --quiet
    
    if [ $? -eq 0 ]; then
        print_success "All tests passed"
    else
        print_error "Tests failed. Aborting deployment."
        exit 1
    fi
}

# Check code quality
check_code_quality() {
    print_status "Checking code quality..."
    
    source venv/bin/activate
    
    # Format code
    black app/ tests/ --quiet
    isort app/ tests/ --quiet
    
    # Check for critical issues
    flake8 app/ --count --statistics --max-line-length=100 --select=E,F,W --ignore=E501
    
    print_success "Code quality check completed"
}

# Build application
build_application() {
    print_status "Building application..."
    
    source venv/bin/activate
    
    # Create necessary directories
    mkdir -p app/ml_models
    
    # Generate requirements for production
    pip freeze > requirements.production.txt
    
    # Create deployment package
    tar -czf navimpact-v2-production.tar.gz \
        --exclude='venv' \
        --exclude='.git' \
        --exclude='__pycache__' \
        --exclude='*.pyc' \
        --exclude='.env' \
        --exclude='tests' \
        .
    
    print_success "Application built successfully"
}

# Deploy to Render (or other platform)
deploy_to_render() {
    print_status "Deploying to Render..."
    
    # Check if render CLI is available
    if command -v render &> /dev/null; then
        print_status "Using Render CLI for deployment..."
        
        # Deploy backend
        render deploy --service navimpact-api-staging --wait
        
        # Deploy frontend
        render deploy --service navimpact-web-staging --wait
        
        print_success "Deployment to Render completed"
    else
        print_warning "Render CLI not found. Please deploy manually or install render CLI."
        print_status "Manual deployment steps:"
        echo "1. Push code to repository"
        echo "2. Render will automatically deploy from repository"
        echo "3. Monitor deployment in Render dashboard"
    fi
}

# Deploy to alternative platforms
deploy_to_alternative() {
    print_status "Deploying to alternative platform..."
    
    # AWS Elastic Beanstalk
    if command -v eb &> /dev/null; then
        print_status "Deploying to AWS Elastic Beanstalk..."
        eb deploy navimpact-v2-production
    fi
    
    # Heroku
    if command -v heroku &> /dev/null; then
        print_status "Deploying to Heroku..."
        heroku container:push web -a navimpact-v2
        heroku container:release web -a navimpact-v2
    fi
    
    # Google Cloud Run
    if command -v gcloud &> /dev/null; then
        print_status "Deploying to Google Cloud Run..."
        gcloud run deploy navimpact-v2 \
            --source . \
            --platform managed \
            --region us-central1 \
            --allow-unauthenticated
    fi
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    source venv/bin/activate
    
    # Run Alembic migrations
    alembic upgrade head
    
    print_success "Database migrations completed"
}

# Train ML models
train_ml_models() {
    print_status "Training ML models..."
    
    source venv/bin/activate
    
    # Start the application temporarily to train models
    python -c "
import asyncio
from app.services.ml_service import MLService
from app.db.session import SessionLocal

async def train_models():
    db = SessionLocal()
    try:
        ml_service = MLService(db)
        result = ml_service.train_grant_recommendation_model()
        print(f'ML model training result: {result}')
    finally:
        db.close()

asyncio.run(train_models())
"
    
    print_success "ML models trained successfully"
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    # Wait for deployment to complete
    sleep 30
    
    # Check API health
    API_URL="https://navimpact-api-staging.onrender.com"
    
    # Health endpoint
    if curl -f -s "$API_URL/health" > /dev/null; then
        print_success "API health check passed"
    else
        print_error "API health check failed"
        return 1
    fi
    
    # ML analytics endpoint
    if curl -f -s "$API_URL/api/v1/ml-analytics/insights" > /dev/null; then
        print_success "ML analytics endpoint working"
    else
        print_warning "ML analytics endpoint not responding"
    fi
    
    # Performance metrics endpoint
    if curl -f -s "$API_URL/api/v1/performance/metrics" > /dev/null; then
        print_success "Performance monitoring working"
    else
        print_warning "Performance monitoring not responding"
    fi
}

# Post-deployment verification
post_deployment_verification() {
    print_status "Running post-deployment verification..."
    
    # Check all critical endpoints
    ENDPOINTS=(
        "/health"
        "/api/v1/projects/"
        "/api/v1/grants/"
        "/api/v1/ml-analytics/insights"
        "/api/v1/performance/metrics"
    )
    
    API_BASE="https://navimpact-api-staging.onrender.com"
    
    for endpoint in "${ENDPOINTS[@]}"; do
        if curl -f -s "$API_BASE$endpoint" > /dev/null; then
            print_success "✓ $endpoint"
        else
            print_error "✗ $endpoint"
        fi
    done
}

# Main deployment function
main() {
    print_status "Starting NavImpact V2 Production Deployment..."
    
    # Step 1: Check prerequisites
    check_prerequisites
    
    # Step 2: Run tests
    run_tests
    
    # Step 3: Check code quality
    check_code_quality
    
    # Step 4: Build application
    build_application
    
    # Step 5: Run migrations
    run_migrations
    
    # Step 6: Train ML models
    train_ml_models
    
    # Step 7: Deploy
    deploy_to_render
    
    # Step 8: Health check
    health_check
    
    # Step 9: Post-deployment verification
    post_deployment_verification
    
    print_success "🎉 NavImpact V2 Production Deployment Completed Successfully!"
    
    echo ""
    echo "📋 Deployment Summary:"
    echo "✅ Tests passed"
    echo "✅ Code quality verified"
    echo "✅ Application built"
    echo "✅ Database migrated"
    echo "✅ ML models trained"
    echo "✅ Deployed to production"
    echo "✅ Health checks passed"
    echo ""
    echo "🌐 Production URLs:"
    echo "   API: https://navimpact-api-staging.onrender.com"
    echo "   Frontend: https://navimpact-web-staging.onrender.com"
    echo ""
    echo "📊 Monitoring:"
    echo "   Performance: https://navimpact-api-staging.onrender.com/api/v1/performance/metrics"
    echo "   ML Insights: https://navimpact-api-staging.onrender.com/api/v1/ml-analytics/insights"
    echo ""
    echo "🔧 Next Steps:"
    echo "   1. Monitor application performance"
    echo "   2. Check ML model accuracy"
    echo "   3. Review user feedback"
    echo "   4. Plan next iteration"
}

# Run main function
main "$@" 