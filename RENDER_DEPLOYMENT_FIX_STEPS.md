# 🚨 **RENDER DEPLOYMENT FIX - SGE DASHBOARD**

## **Current Issues:**
- ❌ API Service: Suspended
- ❌ Frontend Service: Not Found
- ✅ Local Development: Working perfectly

---

## 🔧 **STEP 1: Fix API Service**

### **Option A: Reactivate Existing Service**
1. **Go to**: https://dashboard.render.com
2. **Find**: `sge-dashboard-api` service
3. **Click**: "Resume" button
4. **Wait**: 2-3 minutes for restart

### **Option B: Create New API Service**
If reactivation fails:
1. **Go to**: https://dashboard.render.com
2. **Click**: "New +" → "Web Service"
3. **Connect**: GitHub repo `A1anMc/NavImpactV2`
4. **Settings**:
   - **Name**: `sge-dashboard-api`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**:
     ```
     DATABASE_URL=postgresql://navimpact_dbv3_user:EY0Vd5QcTEoY7ZM0CrKCWfsFVHcYIZ8V@dpg-d21hvsvfte5s73fkk140-a/navimpact_dbv3
     ```

---

## 🔧 **STEP 2: Fix Frontend Service**

### **Create Frontend Service**
1. **Go to**: https://dashboard.render.com
2. **Click**: "New +" → "Static Site"
3. **Connect**: GitHub repo `A1anMc/NavImpactV2`
4. **Settings**:
   - **Name**: `sge-dashboard`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/out`
   - **Environment Variables**:
     ```
     NEXT_PUBLIC_API_URL=https://sge-dashboard-api.onrender.com
     ```

---

## 🔧 **STEP 3: Update Frontend API URL**

### **Update API Client**
```typescript
// frontend/src/lib/api-client.ts
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://sge-dashboard-api.onrender.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

---

## 🔧 **STEP 4: Deploy Mock API to Render**

### **Create Mock API Service**
Since the main API has database issues, let's deploy the mock API:

1. **Create new service**: `sge-mock-api`
2. **Build Command**: `pip install fastapi uvicorn`
3. **Start Command**: `python mock_api.py`
4. **Environment Variables**: None needed

---

## 🎯 **QUICK FIX COMMANDS**

### **Test Current Status:**
```bash
# Test API
curl https://sge-dashboard-api.onrender.com/health

# Test Frontend
curl https://sge-dashboard.onrender.com
```

### **Deploy Mock API:**
```bash
# Push current changes
git add .
git commit -m "Add mock API for Render deployment"
git push origin main
```

---

## 📋 **DEPLOYMENT CHECKLIST**

- [ ] Reactivate API service on Render
- [ ] Create frontend static site on Render
- [ ] Update API URL in frontend
- [ ] Deploy mock API as backup
- [ ] Test all endpoints
- [ ] Verify SGE branding works
- [ ] Test team data loading

---

## 🚨 **IMMEDIATE ACTION NEEDED**

**You need to:**
1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Reactivate the API service** or create a new one
3. **Create the frontend service**
4. **Let me know the new URLs** so I can update the configuration

**Priority**: Get SGE dashboard live for tomorrow's presentation! 