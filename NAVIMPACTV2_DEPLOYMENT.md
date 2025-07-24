# NavImpactV2 Deployment Guide

## 🚀 Complete Deployment Process

### **Repository Status**
- ✅ **GitHub**: https://github.com/A1anMc/NavImpactV2
- ✅ **Code**: All NavImpactV2 code pushed
- ✅ **Branding**: Protection system active

---

## 📋 Step-by-Step Render Update

### **Option 1: Automated (Recommended)**

1. **Install Render CLI** (if not installed):
   ```bash
   brew install render
   ```

2. **Login to Render**:
   ```bash
   render login
   ```

3. **Run Deployment Script**:
   ```bash
   ./scripts/deploy-navimpactv2.sh
   ```

### **Option 2: Manual Update**

1. **Go to Render Dashboard**: https://dashboard.render.com

2. **Update Backend Service**:
   - Find `navimpact-api` service
   - Click "Settings"
   - Update "Repository" to: `https://github.com/A1anMc/NavImpactV2.git`
   - Click "Save Changes"
   - Click "Manual Deploy"

3. **Update Frontend Service**:
   - Find `navimpact-frontend` service
   - Click "Settings"
   - Update "Repository" to: `https://github.com/A1anMc/NavImpactV2.git`
   - Click "Save Changes"
   - Click "Manual Deploy"

---

## 🌐 Service URLs

### **Production Services**
- **Frontend**: https://navimpact-frontend.onrender.com
- **Backend API**: https://navimpact-api.onrender.com
- **Database**: navimpact-db (PostgreSQL)

### **Health Checks**
- **API Health**: https://navimpact-api.onrender.com/api/v1/health
- **Frontend**: https://navimpact-frontend.onrender.com

---

## 🔍 Deployment Verification

### **1. Check Deployment Status**
- Monitor builds in Render dashboard
- Check for any build errors
- Verify services are "Live"

### **2. Test Functionality**
- **Frontend**: Loads without errors
- **API**: Returns grant data
- **Database**: User profiles working
- **Personalized Matching**: Demo data showing

### **3. Test Features**
- ✅ **Grant Browsing**: All grants tab
- ✅ **Personalized Matching**: Demo profile
- ✅ **UI/UX**: NavImpactV2 branding
- ✅ **Responsive Design**: Mobile/desktop

---

## 🛠️ Troubleshooting

### **Common Issues**

#### **Build Failures**
- Check Node.js version (18.17.0)
- Verify all dependencies installed
- Check for TypeScript errors

#### **Database Issues**
- Verify database service is running
- Check connection strings
- Restart database if needed

#### **API Issues**
- Check CORS configuration
- Verify environment variables
- Check API health endpoint

---

## 📊 Monitoring

### **Render Dashboard**
- **Services**: Monitor CPU, memory, requests
- **Logs**: Check for errors or warnings
- **Deployments**: Track build status

### **Health Monitoring**
```bash
# Check API health
curl https://navimpact-api.onrender.com/api/v1/health

# Check grants endpoint
curl https://navimpact-api.onrender.com/api/v1/grants/

# Check frontend
curl https://navimpact-frontend.onrender.com
```

---

## 🎯 Success Criteria

### **✅ Deployment Complete When:**
- [ ] Both services show "Live" status
- [ ] Frontend loads without errors
- [ ] API returns grant data
- [ ] Personalized matching works
- [ ] NavImpactV2 branding visible
- [ ] All features functional

---

## 🚀 NavImpactV2 is Ready!

**Your intelligent grant matching platform is now deployed with proper NavImpactV2 branding!**

The platform includes:
- 🎯 **Intelligent Grant Matching**
- 🎨 **Beautiful NavImpactV2 UI**
- 🛡️ **Branding Protection System**
- 📱 **Responsive Design**
- 🚀 **Production Ready**

**NavImpactV2 is live and ready to help organisations find their perfect funding opportunities!** ✨🎯 