# 🚀 QUICK START: REAL DATA CONFIGURATION

## **Goal: Replace All Mock Data with Real Data**

Your SGE system is currently using mock data. This guide will help you configure real data integrations step by step.

---

## **🎯 IMMEDIATE ACTIONS**

### **Step 1: Run the Configuration Script**
```bash
# Navigate to your project directory
cd /Users/alanmccarthy/Desktop/NavImpactV2

# Run the interactive configuration script
python scripts/configure_real_data.py
```

### **Step 2: Choose Your Priority**
The script will show you options:
1. **Google Analytics** - Website analytics (Recommended first)
2. **Instagram** - Social media metrics
3. **Notion** - Project management
4. **Grant APIs** - Funding opportunities

---

## **📊 QUICK SETUP OPTIONS**

### **Option A: Google Analytics (Easiest)**
```bash
# 1. Go to Google Cloud Console
# 2. Create service account
# 3. Get credentials
# 4. Add to Render environment variables
```

### **Option B: Instagram (Medium)**
```bash
# 1. Create Facebook app
# 2. Add Instagram product
# 3. Get access token
# 4. Add to Render environment variables
```

### **Option C: Notion (Medium)**
```bash
# 1. Create Notion integration
# 2. Share database
# 3. Get API key
# 4. Add to Render environment variables
```

---

## **🔧 RENDER DEPLOYMENT**

### **Add Environment Variables to Render:**
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Navigate to `shadow-goose-api` service
3. Go to Environment tab
4. Add your API keys
5. Save and redeploy

### **Required Environment Variables:**
```bash
# Google Analytics
GOOGLE_ANALYTICS_PROPERTY_ID=your-ga-property-id
GOOGLE_ANALYTICS_PRIVATE_KEY_ID=your-private-key-id
GOOGLE_ANALYTICS_PRIVATE_KEY=your-private-key
GOOGLE_ANALYTICS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_ANALYTICS_CLIENT_ID=your-client-id

# Instagram
INSTAGRAM_ACCESS_TOKEN=your-long-lived-access-token
INSTAGRAM_APP_ID=your-facebook-app-id
INSTAGRAM_APP_SECRET=your-facebook-app-secret
INSTAGRAM_BUSINESS_ACCOUNT_ID=your-business-account-id

# Notion
NOTION_API_KEY=secret_your-notion-api-key-here
NOTION_DATABASE_ID=your-database-id-here
NOTION_WORKSPACE_ID=your-workspace-id-here

# Grant APIs
SCREEN_AUSTRALIA_API_KEY=your-screen-au-api-key
BUSINESS_GOV_API_KEY=your-business-gov-api-key
GRANT_CONNECT_API_KEY=your-grantconnect-api-key
```

---

## **🧪 TESTING**

### **Test Current Status:**
```bash
# Check current configuration
python scripts/configure_real_data.py status

# Test all endpoints
python scripts/configure_real_data.py test
```

### **Test Real Data:**
```bash
# Test Google Analytics
curl https://shadow-goose-api.onrender.com/api/v1/analytics/ga/users

# Test Instagram
curl https://shadow-goose-api.onrender.com/api/v1/social/instagram/followers

# Test Notion
curl https://shadow-goose-api.onrender.com/api/v1/notion/status

# Test Grants
curl https://shadow-goose-api.onrender.com/api/v1/grants
```

---

## **📈 EXPECTED RESULTS**

### **Before (Mock Data):**
- Dashboard shows "Loading real data..."
- Numbers are placeholder values
- No real analytics data

### **After (Real Data):**
- Real user analytics from Google Analytics
- Live follower counts from Instagram
- Real project data from Notion
- Live grant opportunities
- Actual engagement metrics

---

## **🛡️ SAFETY**

### **Current System:**
- ✅ Mock data is working
- ✅ System is operational
- ✅ No risk of breaking anything

### **When Adding Real Data:**
- ✅ Circuit breakers in place
- ✅ Fallback to mock data if APIs fail
- ✅ Error handling implemented
- ✅ Rate limiting configured

---

## **🎯 SUCCESS CRITERIA**

### **You'll Know It's Working When:**
- [ ] Dashboard shows real numbers instead of "..."
- [ ] No more "Loading real data..." messages
- [ ] Analytics show actual user data
- [ ] Social media shows real follower counts
- [ ] Grants show real opportunities

---

## **📞 GETTING HELP**

### **If You Need Help:**
1. Run the configuration script: `python scripts/configure_real_data.py`
2. Check the detailed setup plan: `REAL_DATA_SETUP_PLAN.md`
3. Test endpoints: `python scripts/configure_real_data.py test`

### **Useful Commands:**
```bash
# Check current status
python scripts/configure_real_data.py status

# Test all endpoints
python scripts/configure_real_data.py test

# Show Render commands
python scripts/configure_real_data.py render
```

---

## **🚀 READY TO START?**

**Run this command to begin:**
```bash
python scripts/configure_real_data.py
```

**The script will guide you through each step and help you configure real data for your SGE dashboard!** 