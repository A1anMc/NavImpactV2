# 🚀 NavImpact V2 Development Environment

## 📋 Overview

This guide explains how to set up and use the NavImpact V2 development environment with proper isolation and all necessary tools.

## 🎯 Quick Start

### 1. Automated Setup (Recommended)
```bash
# Run the automated setup script
./scripts/setup_dev_environment.sh
```

### 2. Manual Setup
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install development tools
pip install black isort flake8 autoflake pytest pytest-cov pytest-asyncio httpx beautifulsoup4 lxml requests
```

## 🔧 Virtual Environment

### Why Use Virtual Environment?
- **Package Isolation**: No conflicts between projects
- **Reproducible Environment**: Same packages across all machines
- **Clean Testing**: Test data doesn't interfere with real data
- **Better Development**: IDE uses correct Python interpreter

### Virtual Environment Location
```
/Users/alanmccarthy/Desktop/NavImpactV2/venv/
```

### Python Interpreter
```
/Users/alanmccarthy/Desktop/NavImpactV2/venv/bin/python
```

## 🛠️ Development Tools

### Code Quality Tools
- **Black**: Code formatting
- **isort**: Import sorting
- **flake8**: Code linting
- **autoflake**: Remove unused imports

### Testing Tools
- **pytest**: Test framework
- **pytest-cov**: Coverage reporting
- **pytest-asyncio**: Async test support
- **httpx**: HTTP client for testing

### Scraping Tools
- **beautifulsoup4**: HTML parsing
- **lxml**: XML/HTML processing
- **requests**: HTTP requests

## 📊 Current Status

### ✅ Working Components
- **74/84 tests passing** (88% success rate)
- **55% code coverage**
- **All core functionality working**
- **Performance monitoring added**
- **Complete API endpoints**

### 🔧 Test Results
```bash
# Run all working tests
python -m pytest tests/services/ tests/test_integration.py tests/test_refactored_scrapers.py tests/test_refactored_services.py tests/test_tasks.py --cov=app

# Result: 74 passed, 0 failed
```

## 🚀 Common Commands

### Development Server
```bash
# Start development server
source venv/bin/activate
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Testing
```bash
# Run all tests
python -m pytest tests/ --cov=app

# Run specific test categories
python -m pytest tests/services/ --cov=app

# Run with verbose output
python -m pytest tests/ -v
```

### Code Quality
```bash
# Format code
black app/ tests/

# Sort imports
isort app/ tests/

# Check code quality
flake8 app/ --count --statistics

# Remove unused imports
autoflake --in-place --remove-all-unused-imports --recursive app/
```

### Database
```bash
# Run migrations
alembic upgrade head

# Create new migration
alembic revision --autogenerate -m "description"
```

## 🌐 Environment Variables

### Development Environment
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

### Key Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT secret key
- `ENVIRONMENT`: development/production
- `API_V1_STR`: API version prefix

## 📁 Project Structure

```
NavImpactV2/
├── venv/                    # Virtual environment
├── app/                     # Main application
│   ├── api/                # API endpoints
│   ├── core/               # Core functionality
│   ├── models/             # Database models
│   ├── services/           # Business logic
│   └── scrapers/           # Web scrapers
├── tests/                  # Test files
├── scripts/                # Utility scripts
├── requirements.txt         # Python dependencies
└── alembic/               # Database migrations
```

## 🔍 Troubleshooting

### Virtual Environment Issues
```bash
# Recreate virtual environment
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Test Issues
```bash
# Clear pytest cache
python -m pytest --cache-clear

# Run tests with more verbose output
python -m pytest tests/ -v -s
```

### Import Issues
```bash
# Check Python path
python -c "import sys; print(sys.path)"

# Verify virtual environment
which python
```

## 📈 Performance Monitoring

### Available Metrics
- API response times
- Database query performance
- Error rates
- System resource usage

### Access Metrics
```bash
# Get performance metrics
curl http://localhost:8000/api/v1/performance/metrics
```

## 🎯 Best Practices

1. **Always activate virtual environment** before development
2. **Run tests frequently** to catch issues early
3. **Format code** before committing
4. **Check code quality** with flake8
5. **Use proper isolation** for test data

## 📞 Support

For issues with the development environment:
1. Check this documentation
2. Run the setup script again
3. Check the troubleshooting section
4. Verify virtual environment activation

---

**Happy coding! 🚀** 