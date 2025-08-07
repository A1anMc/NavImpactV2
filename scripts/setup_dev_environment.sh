#!/bin/bash

# NavImpact V2 Development Environment Setup
# This script sets up the complete development environment

set -e

echo "🚀 Setting up NavImpact V2 Development Environment..."

# Check if we're in the right directory
if [ ! -f "requirements.txt" ]; then
    echo "❌ Error: requirements.txt not found. Please run this script from the NavImpactV2 root directory."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️ Upgrading pip..."
pip install --upgrade pip

# Install project dependencies
echo "📥 Installing project dependencies..."
pip install -r requirements.txt

# Install development tools
echo "🛠️ Installing development tools..."
pip install black isort flake8 autoflake pytest pytest-cov pytest-asyncio httpx beautifulsoup4 lxml requests

# Verify installation
echo "✅ Verifying installation..."
python --version
which python
pip list | grep -E "(fastapi|pytest|black|flake8)"

# Run tests to verify everything works
echo "🧪 Running tests to verify setup..."
python -m pytest tests/services/ tests/test_integration.py tests/test_refactored_scrapers.py tests/test_refactored_services.py tests/test_tasks.py --quiet

echo ""
echo "🎉 Development environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Activate the virtual environment: source venv/bin/activate"
echo "2. Run the development server: python -m uvicorn app.main:app --reload"
echo "3. Run tests: python -m pytest tests/ --cov=app"
echo "4. Format code: black app/ tests/"
echo "5. Check code quality: flake8 app/"
echo ""
echo "🌐 Virtual environment: $(pwd)/venv"
echo "🐍 Python interpreter: $(which python)" 