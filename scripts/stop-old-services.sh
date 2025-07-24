#!/bin/bash

echo "🛑 Checking Old Service Status"
echo "==============================="

# Check backend
echo "Backend: https://navimpact-api.onrender.com"
curl -s https://navimpact-api.onrender.com/ | jq . 2>/dev/null || echo "❌ Service not responding (good!)"

# Check frontend
echo "Frontend: https://navimpact-web.onrender.com"
curl -s -I https://navimpact-web.onrender.com/ | head -1 2>/dev/null || echo "❌ Service not responding (good!)" 