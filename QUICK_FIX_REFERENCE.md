# Quick Fix Reference - NavImpact V2

## 🎯 **TWO SIMPLE CHANGES NEEDED**

### **Step 1: Fix ALLOWED_HOSTS**
1. Go to: https://dashboard.render.com
2. Find: `navimpact-api-staging` service
3. Click on the service
4. Go to: **Settings** tab
5. Scroll to: **Environment** section
6. Find: `ALLOWED_HOSTS` variable
7. Set it to: `navimpact-api-staging.onrender.com,localhost,127.0.0.1,*`
8. Click **Save Changes**

### **Step 2: Fix Start Command**
1. Stay in the same service
2. Go to: **Settings** tab
3. Scroll to: **Build & Deploy** section
4. Find: **Start Command** field
5. Replace the entire command with:
```bash
echo "Starting STAGING backend deployment..." && echo "Database URL: $DATABASE_URL" && echo "Stamping database head..." && alembic stamp 20250127_sustainability && echo "Running database migrations..." && alembic upgrade 20250127_sustainability && echo "Starting application..." && gunicorn app.main:app --bind 0.0.0.0:$PORT --workers 2 --worker-class uvicorn.workers.UvicornWorker --timeout 300 --preload
```
6. Click **Save Changes**
7. Go to: **Manual Deploy** section
8. Click **Deploy latest commit**

## ⏱️ **TIMELINE**
- **Step 1**: 1 minute
- **Step 2**: 1 minute
- **Deployment**: 5-8 minutes
- **Testing**: 2-3 minutes

## ✅ **SUCCESS INDICATORS**
After deployment, you should see:
- Backend returns 200 OK (not "Invalid host header")
- Frontend loads grant details properly
- No more "Failed to load grant details" errors

## 🔍 **TEST AFTER DEPLOYMENT**
Visit: https://navimpact-web-staging.onrender.com/grants/apply/1/

**Good luck! This should fix the data issues.** 🚀 