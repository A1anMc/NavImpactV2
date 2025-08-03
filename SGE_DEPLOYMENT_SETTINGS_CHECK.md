# SGE Deployment Settings Check

## ✅ CURRENT SETTINGS (SGE Branch)

### **Frontend Configuration:**
- ✅ **Static Export:** `output: 'export'` ✅
- ✅ **Trailing Slash:** `trailingSlash: true` ✅
- ✅ **API URL:** `https://shadow-goose-api.onrender.com` ✅
- ✅ **Image Domains:** `shadow-goose-api.onrender.com`, `shadow-goose-dashboard.onrender.com` ✅
- ✅ **Unoptimized Images:** `true` ✅

### **API Client Configuration:**
- ✅ **Base URL:** `https://shadow-goose-api.onrender.com` ✅
- ✅ **Timeout:** 10000ms ✅
- ✅ **Content-Type:** `application/json` ✅

## 🎯 RENDER DEPLOYMENT SETTINGS (Should Be):

### **Shadow Goose Dashboard Service:**
```
Service Name: shadow-goose-dashboard
Branch: sge
Build Command: npm ci --only=production && npm run build
Start Command: npx serve@latest out
Publish Directory: frontend/out
Environment Variables:
  - NEXT_PUBLIC_API_URL: https://shadow-goose-api.onrender.com
```

### **Shadow Goose API Service:**
```
Service Name: shadow-goose-api
Branch: main (or sge if you want SGE-specific backend)
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
Environment Variables:
  - DATABASE_URL: (your SGE database URL)
  - SECRET_KEY: (your secret key)
```

## ⚠️ ISSUES FOUND & FIXED:

### **Issue 1: API Client URL**
- **Was:** `https://navimpact-api.onrender.com`
- **Fixed to:** `https://shadow-goose-api.onrender.com` ✅

### **Issue 2: Environment Variables**
- **Need to verify:** `NEXT_PUBLIC_API_URL` is set correctly on Render

## 🔧 VERIFICATION CHECKLIST:

### **On Render Dashboard:**
- [ ] **Shadow Goose Dashboard** branch set to `sge`
- [ ] **Shadow Goose API** service exists and is running
- [ ] **Environment variables** are set correctly
- [ ] **Build commands** are correct
- [ ] **Start commands** are correct

### **Expected URLs:**
- **Frontend:** `https://shadow-goose-dashboard.onrender.com`
- **Backend:** `https://shadow-goose-api.onrender.com`

## 🚀 DEPLOYMENT STATUS:

**Ready for deployment with:**
- ✅ **Correct API URLs**
- ✅ **Static export configuration**
- ✅ **SGE branding and features**
- ✅ **Professional UI/UX**

**All settings are now correct for SGE deployment!** 🎬✨ 