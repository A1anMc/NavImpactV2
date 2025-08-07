# 🛡️ Configuration Prevention Rules - NavImpact V2

## 🚨 **CRITICAL RULE: NEVER MIX URLS**

### **NavImpact Branch (main/feature branches)**
✅ **CORRECT URLs:**
- API: `https://navimpact-api.onrender.com`
- Web: `https://navimpact-web.onrender.com`
- Staging API: `https://navimpact-api-staging.onrender.com`
- Staging Web: `https://navimpact-web-staging.onrender.com`

❌ **FORBIDDEN URLs:**
- `https://shadow-goose-api.onrender.com`
- `https://shadow-goose-dashboard.onrender.com`
- `https://sge-dashboard-api.onrender.com`
- `https://sge-dashboard.onrender.com`

### **SGE Branch (sge branch)**
✅ **CORRECT URLs:**
- API: `https://shadow-goose-api.onrender.com`
- Web: `https://shadow-goose-dashboard.onrender.com`

❌ **FORBIDDEN URLs:**
- `https://navimpact-api.onrender.com`
- `https://navimpact-web.onrender.com`

---

## 🔧 **CRITICAL FILES TO CHECK**

### **Frontend Configuration Files:**
1. `frontend/src/lib/api-client.ts` - API base URL
2. `frontend/src/lib/config.ts` - API configuration
3. `frontend/next.config.js` - Environment variables and image domains

### **Deployment Configuration Files:**
4. `render.yaml` - Production deployment
5. `render.staging.yaml` - Staging deployment

---

## 🚨 **PREVENTION SYSTEM**

### **1. Pre-Commit Validation**
```bash
# Run before every commit
./scripts/pre-commit-validation.sh
```

### **2. Full Configuration Validation**
```bash
# Run before deployment
./scripts/validate_configuration.sh
```

### **3. Automatic Checks**
- Pre-commit hook blocks commits with wrong URLs
- Validation script scans entire project
- Branch-specific URL validation

---

## 📋 **CHECKLIST BEFORE DEPLOYMENT**

### **✅ Pre-Deployment Checklist:**
- [ ] Run `./scripts/validate_configuration.sh`
- [ ] Verify current branch is correct
- [ ] Check all critical files for correct URLs
- [ ] Test API connectivity
- [ ] Verify frontend builds successfully

### **✅ Post-Deployment Checklist:**
- [ ] Test API endpoints return real data
- [ ] Verify frontend loads correctly
- [ ] Check no fallback data is being used
- [ ] Confirm database migrations completed

---

## 🔍 **HOW TO DETECT THE MISTAKE**

### **Symptoms of Wrong URLs:**
1. **Frontend shows "Failed to load grant details"**
2. **API returns "Invalid host header"**
3. **Backend health check fails**
4. **Fallback data being used instead of real data**

### **Quick Detection Commands:**
```bash
# Check current API URL
grep -r "shadow-goose-api" frontend/src/lib/

# Check current branch
git branch --show-current

# Validate configuration
./scripts/validate_configuration.sh
```

---

## 🛠️ **FIXING THE MISTAKE**

### **If Wrong URLs Are Found:**

1. **Immediate Actions:**
   ```bash
   # Stop any deployment in progress
   # Fix the URLs in critical files
   # Run validation script
   ./scripts/validate_configuration.sh
   ```

2. **Fix Critical Files:**
   - `frontend/src/lib/api-client.ts` - Update baseURL
   - `frontend/next.config.js` - Update environment variables
   - `frontend/src/lib/config.ts` - Update apiUrl

3. **Test Changes:**
   ```bash
   # Test locally
   npm run dev
   
   # Test API connectivity
   curl https://navimpact-api.onrender.com/health
   ```

4. **Deploy Safely:**
   ```bash
   # Commit changes
   git add .
   git commit -m "fix: Update API URLs to correct NavImpact services"
   git push
   ```

---

## 🎯 **PREVENTION RULES**

### **Rule 1: Branch Awareness**
- **main/feature branches** = NavImpact URLs only
- **sge branch** = Shadow Goose URLs only
- **Never mix them**

### **Rule 2: Validation First**
- Always run validation before committing
- Always run validation before deploying
- Never skip the validation step

### **Rule 3: URL Consistency**
- All files must use the same URL pattern
- No mixed URLs in the same branch
- Environment variables must match

### **Rule 4: Testing**
- Test API connectivity before deployment
- Verify real data is loading
- Check no fallback data is being used

---

## 🚨 **EMERGENCY PROCEDURES**

### **If Wrong URLs Are Deployed:**

1. **Immediate Rollback:**
   ```bash
   git revert HEAD
   git push --force
   ```

2. **Fix Configuration:**
   - Update all critical files
   - Run validation script
   - Test locally

3. **Redeploy:**
   ```bash
   git add .
   git commit -m "fix: Correct API URLs"
   git push
   ```

---

## ✅ **SUCCESS INDICATORS**

### **Correct Configuration:**
- ✅ API health check returns 200 OK
- ✅ Frontend loads real data (not fallback)
- ✅ No "Invalid host header" errors
- ✅ No "Failed to load grant details" errors
- ✅ Database migrations complete successfully

### **Wrong Configuration:**
- ❌ API returns "Invalid host header"
- ❌ Frontend shows fallback data
- ❌ "Failed to load grant details" errors
- ❌ Wrong service responding

---

**🔒 REMEMBER: This prevention system is designed to catch mistakes BEFORE they reach production. Always run the validation scripts!** 