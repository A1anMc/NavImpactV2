#!/bin/bash

echo "=== NAVIMPACT V2 WEEKLY METRICS REPORT ==="
echo "Date: $(date)"
echo ""

# Test coverage
echo "📊 TEST COVERAGE METRICS..."
echo ""
python -m pytest tests/ --cov=app --cov-report=term-missing --quiet
echo ""

# Code complexity
echo "📈 CODE COMPLEXITY METRICS..."
echo ""
if command -v radon &> /dev/null; then
    echo "Cyclomatic Complexity Analysis:"
    python -m radon cc app/ -a | head -20
    echo ""
    echo "Maintainability Index:"
    python -m radon mi app/ -a
    echo ""
else
    echo "Radon not installed - install with: pip install radon"
fi

# Performance metrics
echo "⚡ PERFORMANCE METRICS..."
echo ""

# Check if performance tests exist
if [ -f "tests/test_performance.py" ]; then
    echo "Running performance tests..."
    python -m pytest tests/test_performance.py -v --tb=short
else
    echo "No performance tests found"
    echo "Consider adding performance benchmarks"
fi
echo ""

# Git metrics
echo "📈 GIT METRICS..."
echo ""

echo "Commits this week:"
git log --since="1 week ago" --oneline --no-merges | wc -l
echo ""

echo "Lines of code changed this week:"
git diff --stat HEAD~7 HEAD
echo ""

echo "Files with most changes this week:"
git diff --name-only HEAD~7 HEAD | sort | uniq -c | sort -nr | head -10
echo ""

# Code quality metrics
echo "🔍 CODE QUALITY METRICS..."
echo ""

echo "Flake8 violations:"
python -m flake8 app/ --count --statistics --quiet
echo ""

echo "Black formatting issues:"
python -m black --check app/ --diff --quiet || echo "Formatting issues found"
echo ""

echo "Import sorting issues:"
python -m isort --check-only app/ --diff --quiet || echo "Import sorting issues found"
echo ""

# Documentation metrics
echo "📚 DOCUMENTATION METRICS..."
echo ""

echo "Functions without docstrings:"
python -m pydocstyle app/ --select=D100,D101,D102,D103,D104,D105,D106,D107 --count
echo ""

# Summary
echo "=== WEEKLY METRICS SUMMARY ==="
echo ""
echo "🎯 KEY METRICS TO TRACK:"
echo "- Test coverage (target: >80%)"
echo "- Code complexity (target: <10 per function)"
echo "- Performance (target: <200ms API responses)"
echo "- Documentation coverage (target: >80%)"
echo ""
echo "📈 TREND ANALYSIS:"
echo "- Are metrics improving week over week?"
echo "- Are there any concerning trends?"
echo "- What should be the focus for next week?"
echo ""
echo "🎉 CELEBRATE IMPROVEMENTS!"
echo "Track your progress and share wins with the team." 