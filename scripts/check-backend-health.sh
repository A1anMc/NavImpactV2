#!/bin/bash

# Health check script for NavImpact API
echo "🏥 NavImpact Backend Health Check"
echo "================================="

# Test health endpoint
echo "Testing health endpoint..."
curl -s https://navimpact-api.onrender.com/health | jq .

# Test detailed health
echo -e "\nTesting detailed health..."
curl -s https://navimpact-api.onrender.com/health/detailed | jq .

echo -e "\n📊 Database metrics:"
curl -s https://navimpact-api.onrender.com/health/db-metrics | jq .

echo -e "\n📎 Check logs at: https://dashboard.render.com/web/navimpact-api" 