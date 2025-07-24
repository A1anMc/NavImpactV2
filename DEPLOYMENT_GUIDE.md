# 🚀 NavImpact Deployment Guide

## Problem Solved ✅
**Before**: Git push triggered both frontend and backend simultaneously, causing deployment conflicts.

**After**: Proper deployment order with dependencies handled correctly.

## 🎯 New Deployment Process

### **Option 1: GitHub Actions (Recommended)**
```bash
# Simply push to main - GitHub Actions handles the rest
git push origin main
```

**What happens:**
1. ✅ **Backend deploys first**
2. ✅ **Waits for backend health check**
3. ✅ **Frontend deploys after backend is ready**
4. ✅ **Verifies both services are working**

### **Option 2: Manual Deployment Script**
```bash
# Run the deployment script
./scripts/deploy.sh
```

### **Option 3: Manual Step-by-Step**
```bash
# 1. Deploy backend only
git push origin main  # Backend auto-deploys

# 2. Wait for backend health
curl https://navimpact-api.onrender.com/health

# 3. Trigger migration (if needed)
curl -X POST "https://navimpact-api.onrender.com/api/v1/migrations/budget-migration" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# 4. Deploy frontend manually from Render dashboard
```

## 🔧 Configuration Files

### **render.yaml**
- ✅ **Backend**: `autoDeploy: true` (deploys on push)
- ✅ **Frontend**: `autoDeploy: false` (manual deployment)
- ✅ **Health checks** for both services

### **GitHub Actions (.github/workflows/deploy.yml)**
- ✅ **Sequential deployment**: Backend → Frontend
- ✅ **Health checks** between deployments
- ✅ **Verification** of both services

## 🎯 Benefits

### **✅ No More Deployment Conflicts**
- Backend deploys first
- Frontend waits for backend
- Proper dependency handling

### **✅ Better Error Handling**
- Health checks between steps
- Clear error messages
- Rollback capability

### **✅ Automated Verification**
- Tests both services after deployment
- Confirms everything is working
- Provides deployment status

## 🚨 Emergency Procedures

### **If Frontend Fails**
```bash
# Deploy frontend manually
# Go to Render dashboard → navimpact-web → Manual Deploy
```

### **If Backend Fails**
```bash
# Check backend logs
# Go to Render dashboard → navimpact-api → Logs
```

### **If Migration Fails**
```bash
# Trigger migration manually
curl -X POST "https://navimpact-api.onrender.com/api/v1/migrations/budget-migration" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## 📊 Monitoring

### **Health Endpoints**
- **Backend**: `https://navimpact-api.onrender.com/health`
- **Frontend**: `https://navimpact-web.onrender.com`

### **Deployment Status**
- **GitHub Actions**: Check Actions tab in repository
- **Render Dashboard**: Monitor both services

## 🎉 Result

**No more deployment conflicts!** The system now deploys in the correct order with proper health checks and verification. 