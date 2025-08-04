# 📸 INSTAGRAM CONFIGURATION

## **🎯 Your Complete Instagram Credentials**

### **✅ Complete Configuration:**
```bash
INSTAGRAM_APP_ID=750807407546453
INSTAGRAM_APP_SECRET=b1bb9291aa6dff3eefeb1d32ac7874ae
INSTAGRAM_ACCESS_TOKEN=EAAKq2vjSUFUBPMLCmwnZAY0BZAHcKH3mjeWPU13AV0uR8ZAOnZCBqZAwFhZC5braxJ2HxlSgCbcpdJa4qokdO7roADoZCcpAbt9CZAUDh21fyrGaJATkxEhfGVtlvgEaAS4WGBBVMJ64mz9tZAGAESXUddutmDy0W8tRF57sSMU0sSZBzLAHUYeAu4TVxhK6vu2353v58bXLNlzULODEbVIMKaagCBtFFD9jz7G2rZArOzLsy0ZD
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841470067685584
```

### **📊 What This Means:**
- **App ID**: `750807407546453` - Your Facebook app
- **App Secret**: `b1bb9291aa6dff3eefeb1d32ac7874ae` - Your app secret
- **Access Token**: Valid Instagram Graph API token
- **Business Account ID**: `17841470067685584` - @shadowgoose.ent Instagram account
- **Status**: ✅ **READY TO DEPLOY**

---

## **🚀 IMMEDIATE DEPLOYMENT**

### **Step 1: Add ALL Environment Variables to Render**

Go to [Render Dashboard](https://dashboard.render.com/) → `shadow-goose-api` → Environment tab → Add:

```bash
# Instagram Configuration
INSTAGRAM_APP_ID=750807407546453
INSTAGRAM_APP_SECRET=b1bb9291aa6dff3eefeb1d32ac7874ae
INSTAGRAM_ACCESS_TOKEN=EAAKq2vjSUFUBPMLCmwnZAY0BZAHcKH3mjeWPU13AV0uR8ZAOnZCBqZAwFhZC5braxJ2HxlSgCbcpdJa4qokdO7roADoZCcpAbt9CZAUDh21fyrGaJATkxEhfGVtlvgEaAS4WGBBVMJ64mz9tZAGAESXUddutmDy0W8tRF57sSMU0sSZBzLAHUYeAu4TVxhK6vu2353v58bXLNlzULODEbVIMKaagCBtFFD9jz7G2rZArOzLsy0ZD
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841470067685584
INSTAGRAM_API_BASE_URL=https://graph.facebook.com/v18.0
INSTAGRAM_API_TIMEOUT=30
```

### **Step 2: Deploy the Changes**

After adding the environment variables, Render will automatically redeploy your API.

### **Step 3: Test the Integration**

```bash
# Test the Instagram API endpoint
curl https://shadow-goose-api.onrender.com/api/v1/analytics/instagram/profile

# Test with your configuration script
python scripts/configure_real_data.py test

# Check current status
python scripts/configure_real_data.py status
```

---

## **🧪 TESTING**

### **Expected Response:**
```json
{
  "status": "success",
  "data": {
    "username": "shadowgoose.ent",
    "followers_count": 1234,
    "media_count": 56,
    "biography": "Shadow Goose Entertainment...",
    "profile_picture_url": "https://...",
    "engagement_rate": 4.2
  }
}
```

### **If You Get Errors:**
1. Check that all environment variables are added correctly
2. Verify the Business Account ID is correct
3. Check the API logs in Render dashboard

---

## **📊 WHAT YOU'LL GET**

### **Real Instagram Data from @shadowgoose.ent:**
- ✅ **Follower Count**: Live follower numbers
- ✅ **Post Count**: Total posts on your account
- ✅ **Engagement Rate**: Real engagement metrics
- ✅ **Recent Posts**: Latest content with metrics
- ✅ **Profile Data**: Bio, profile picture, etc.

### **Dashboard Changes:**
- ✅ Real Instagram metrics instead of "..."
- ✅ Live social media data from @shadowgoose.ent
- ✅ Actual engagement numbers
- ✅ Real follower counts

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

### **Useful Commands:**
```bash
# Check current status
python scripts/configure_real_data.py status

# Test Instagram
curl https://shadow-goose-api.onrender.com/api/v1/analytics/instagram/profile

# Show Render commands
python scripts/configure_real_data.py render
```

---

## **🎯 NEXT STEPS**

1. **Add ALL environment variables to Render** (copy the complete block above)
2. **Wait for deployment to complete**
3. **Test the integration**
4. **Verify real data is working**

**Your @shadowgoose.ent Instagram account will be connected to real social media data!**

---

## **✅ STATUS: READY TO DEPLOY**

All Instagram credentials are complete and ready to go. Just add the environment variables to Render and test! 