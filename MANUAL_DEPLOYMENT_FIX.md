# Manual Deployment Fix - Render Dashboard Configuration

## 🚨 URGENT: Manual Configuration Required

The deployment logs show that Render is still using `npm start` instead of our corrected start command. The `render.staging.yaml` file is not being read by Render.

## 📋 Step-by-Step Fix

### **Step 1: Access Render Dashboard**
1. Go to https://dashboard.render.com
2. Sign in to your account
3. Find the `navimpact-web-staging` service

### **Step 2: Update Service Configuration**
1. Click on the `navimpact-web-staging` service
2. Go to **Settings** tab
3. Scroll down to **Build & Deploy** section

### **Step 3: Fix the Start Command**
1. Find the **Start Command** field
2. **Current (WRONG)**: `cd frontend && npm start`
3. **Change to (CORRECT)**: `cd frontend && npx serve@latest out -p $PORT`
4. Click **Save Changes**

### **Step 4: Trigger Manual Redeploy**
1. Go to the **Manual Deploy** section
2. Click **Deploy latest commit**
3. Or click **Clear build cache & deploy**

## 🔍 Verification Steps

### **Check the Fix Worked**
After the manual redeploy, the logs should show:
```
✅ CORRECT: Running 'cd frontend && npx serve@latest out -p $PORT'
❌ WRONG: Running 'cd frontend && npm start'
```

### **Expected Timeline**
- **Manual Configuration**: 2-3 minutes
- **Redeployment**: 5-8 minutes
- **Total**: 10-15 minutes

## 🎯 Success Indicators

✅ **Frontend**: Returns 200 OK (instead of 502)  
✅ **Backend**: Returns 200 OK  
✅ **Integration**: Frontend can communicate with backend  

## 📊 Monitor URLs

- **Frontend**: https://navimpact-web-staging.onrender.com
- **Backend**: https://navimpact-api-staging.onrender.com
- **Dashboard**: https://dashboard.render.com

## 🚨 Why This Happened

1. **Render Configuration Issue**: The `render.staging.yaml` file is not being read
2. **Service Configuration**: The service was configured with the wrong start command
3. **Manual Override Needed**: Render dashboard settings override the YAML file

## ✅ After the Fix

Once the manual configuration is applied:
1. The frontend will serve static files correctly
2. Both services will be operational
3. The NavImpact V2 dashboard will be fully functional

---

**Status**: 🚨 **MANUAL INTERVENTION REQUIRED**  
**Priority**: **CRITICAL** - Need to fix start command in Render dashboard 