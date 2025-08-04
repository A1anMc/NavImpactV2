# 📊 GOOGLE ANALYTICS SETUP FOR SHADOW GOOSE

## **🎯 Your Google Analytics Tag: G-W5J0946RGP**

### **✅ What You Have:**
- **Google Analytics Property ID**: `G-W5J0946RGP`
- **Website**: Shadow Goose Entertainment
- **Status**: Ready to configure

---

## **🔧 IMMEDIATE SETUP STEPS**

### **Step 1: Get Google Analytics Credentials**

You need to create a service account to access your Google Analytics data:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select existing

2. **Enable Google Analytics API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google Analytics Data API"
   - Click "Enable"

3. **Create Service Account**
   - Go to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Name: `shadow-goose-analytics`
   - Description: `Service account for Shadow Goose Analytics`

4. **Download JSON Key**
   - Click on the service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose "JSON"
   - Download the key file

### **Step 2: Add Service Account to Google Analytics**

1. **Go to Google Analytics**
   - Visit: https://analytics.google.com/
   - Select your property (G-W5J0946RGP)

2. **Add Service Account**
   - Go to "Admin" > "Property" > "Property access management"
   - Click the "+" button
   - Add the service account email from your JSON file
   - Grant "Viewer" permissions

### **Step 3: Extract Credentials from JSON**

Your downloaded JSON file contains these values:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "shadow-goose-analytics@your-project.iam.gserviceaccount.com",
  "client_id": "your-client-id"
}
```

---

## **📝 ENVIRONMENT VARIABLES TO SET**

### **Add these to Render Dashboard:**

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Navigate to `shadow-goose-api` service
3. Go to Environment tab
4. Add these variables:

```bash
GOOGLE_ANALYTICS_PROPERTY_ID=G-W5J0946RGP
GOOGLE_ANALYTICS_PRIVATE_KEY_ID=your-private-key-id-from-json
GOOGLE_ANALYTICS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_ANALYTICS_CLIENT_EMAIL=shadow-goose-analytics@your-project.iam.gserviceaccount.com
GOOGLE_ANALYTICS_CLIENT_ID=your-client-id-from-json
```

---

## **🧪 TESTING**

### **Test Google Analytics Integration:**

```bash
# Test the API endpoint
curl https://shadow-goose-api.onrender.com/api/v1/analytics/ga/users

# Test with your configuration script
python scripts/configure_real_data.py test
```

### **Expected Response:**
```json
{
  "status": "success",
  "data": {
    "active_users": 123,
    "page_views": 456,
    "sessions": 78
  }
}
```

---

## **📊 WHAT YOU'LL GET**

### **Real Analytics Data:**
- ✅ Live user data from Shadow Goose website
- ✅ Page view tracking
- ✅ Engagement metrics
- ✅ Traffic sources
- ✅ Device analytics
- ✅ Real-time visitor data

### **Dashboard Changes:**
- ✅ Real numbers instead of "..."
- ✅ Live analytics data
- ✅ Actual user metrics
- ✅ Real engagement data

---

## **🚀 QUICK START**

### **Option A: Manual Setup**
1. Follow the steps above to get credentials
2. Add environment variables to Render
3. Test the integration

### **Option B: Use Configuration Script**
```bash
python scripts/configure_real_data.py
# Choose option 1 (Google Analytics)
# Follow the interactive guide
```

---

## **🛡️ SAFETY**

### **Current Status:**
- ✅ Mock data is working
- ✅ System is operational
- ✅ No risk of breaking anything

### **When Adding Real Data:**
- ✅ Circuit breakers in place
- ✅ Fallback to mock data if API fails
- ✅ Error handling implemented

---

## **📞 NEED HELP?**

### **If You Get Stuck:**
1. Check the detailed setup plan: `REAL_DATA_SETUP_PLAN.md`
2. Run the configuration script: `python scripts/configure_real_data.py`
3. Test endpoints: `python scripts/configure_real_data.py test`

### **Useful Commands:**
```bash
# Check current status
python scripts/configure_real_data.py status

# Test Google Analytics
curl https://shadow-goose-api.onrender.com/api/v1/analytics/ga/users

# Show Render commands
python scripts/configure_real_data.py render
```

---

## **🎯 NEXT STEPS**

1. **Get Google Analytics credentials** (follow steps above)
2. **Add environment variables to Render**
3. **Test the integration**
4. **Verify real data is working**

**Your Shadow Goose website (G-W5J0946RGP) will be connected to real analytics data!** 