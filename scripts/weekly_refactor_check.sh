#!/bin/bash

echo "=== NAVIMPACT V2 WEEKLY REFACTORING CHECK ==="
echo "Date: $(date)"
echo ""

# Code quality checks
echo "🔍 RUNNING CODE QUALITY CHECKS..."
echo ""

echo "1. Flake8 (Code style and complexity)..."
python -m flake8 app/ --max-line-length=88 --count --statistics
echo ""

echo "2. Black (Code formatting)..."
python -m black --check app/ --diff
echo ""

echo "3. isort (Import sorting)..."
python -m isort --check-only app/ --diff
echo ""

# Testing
echo "🧪 RUNNING TESTS..."
echo ""

echo "4. Unit and Integration Tests..."
python -m pytest tests/test_refactored_services.py tests/test_refactored_scrapers.py tests/test_integration.py -v --tb=short
echo ""

echo "5. Test Coverage..."
python -m pytest tests/ --cov=app --cov-report=term-missing --cov-fail-under=80
echo ""

# Performance checks
echo "⚡ PERFORMANCE CHECKS..."
echo ""

echo "6. Performance Tests..."
if [ -f "tests/test_performance.py" ]; then
    python -m pytest tests/test_performance.py -v
else
    echo "No performance tests found - consider adding them"
fi
echo ""

# Documentation checks
echo "📚 DOCUMENTATION CHECKS..."
echo ""

echo "7. Docstring Coverage..."
python -m pydocstyle app/ --select=D100,D101,D102,D103,D104,D105,D106,D107
echo ""

# Code complexity analysis
echo "📊 CODE COMPLEXITY ANALYSIS..."
echo ""

echo "8. Cyclomatic Complexity..."
if command -v radon &> /dev/null; then
    python -m radon cc app/ -a
else
    echo "Radon not installed - install with: pip install radon"
fi
echo ""

# Git analysis
echo "📈 GIT ANALYSIS..."
echo ""

echo "9. Recent Commit Analysis..."
echo "Commits this week:"
git log --since="1 week ago" --oneline --no-merges
echo ""

echo "10. Files Changed This Week..."
git diff --name-only HEAD~7 HEAD
echo ""

# Summary
echo "=== WEEKLY REFACTORING CHECK COMPLETE ==="
echo ""
echo "📋 NEXT STEPS:"
echo "1. Address any code quality issues found"
echo "2. Improve test coverage if below 80%"
echo "3. Add performance tests if missing"
echo "4. Document complex functions"
echo "5. Plan next week's refactoring focus"
echo ""
echo "🎯 REMEMBER: Focus on 1-2 specific improvements per week!"
echo "Keep it sustainable and measurable." 