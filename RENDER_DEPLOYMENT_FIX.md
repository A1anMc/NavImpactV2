# 🚨 **RENDER API SUSPENSION FIX**

## **Issue**: API Service Suspended
The SGE dashboard API at `https://sge-dashboard-api.onrender.com` has been suspended.

---

## 🔧 **SOLUTION 1: Reactivate Service (RECOMMENDED)**

### **Steps:**
1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Find Service**: Look for `sge-dashboard-api`
3. **Click Resume**: Use the "Resume" button
4. **Wait**: 2-3 minutes for restart
5. **Test**: Check if API is responding

### **Test Command:**
```bash
curl https://sge-dashboard-api.onrender.com/health
```

---

## 🔧 **SOLUTION 2: Create New API Service**

### **If reactivation fails:**

1. **Create New Service**:
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect to GitHub repo: `A1anMc/NavImpactV2`
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

2. **Environment Variables**:
   ```
   DATABASE_URL=postgresql://navimpact_dbv3_user:EY0Vd5QcTEoY7ZM0CrKCWfsFVHcYIZ8V@dpg-d21hvsvfte5s73fkk140-a/navimpact_dbv3
   ```

3. **Deploy**: Click "Create Web Service"

---

## 🔧 **SOLUTION 3: Local Development**

### **Run API Locally:**
```bash
# Install dependencies
pip install -r requirements.txt

# Set environment
export DATABASE_URL="postgresql://navimpact_dbv3_user:EY0Vd5QcTEoY7ZM0CrKCWfsFVHcYIZ8V@dpg-d21hvsvfte5s73fkk140-a/navimpact_dbv3"

# Start API
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### **Update Frontend API URL:**
```typescript
// frontend/src/lib/api-client.ts
const API_BASE_URL = 'http://localhost:8000';
```

---

## 🔧 **SOLUTION 4: Alternative Hosting**

### **Railway.app** (Alternative to Render):
1. Go to https://railway.app
2. Connect GitHub repo
3. Deploy with same settings
4. Get new API URL

### **Heroku** (Alternative):
1. Go to https://heroku.com
2. Create new app
3. Connect GitHub repo
4. Deploy with same settings

---

## 📋 **CHECKLIST:**

- [ ] Try reactivating existing service
- [ ] Check Render billing/usage limits
- [ ] Create new service if needed
- [ ] Update frontend API URL
- [ ] Test all endpoints
- [ ] Verify database connection

---

## 🎯 **QUICK FIX COMMANDS:**

```bash
# Test current API
curl https://sge-dashboard-api.onrender.com/health

# If suspended, create new service
# Then update frontend API URL in:
# frontend/src/lib/api-client.ts
```

**Priority**: Get API back online for SGE presentation tomorrow! 