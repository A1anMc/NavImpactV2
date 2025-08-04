# 📸 INSTAGRAM SETUP GUIDE

## **🎯 Your Instagram Integration**

### **✅ Status: Ready to Connect**

You have Instagram ready to connect. Let's set up real social media data for your Shadow Goose dashboard.

---

## **🔧 SETUP STEPS**

### **Step 1: Get Instagram App Credentials**

1. **Go to Facebook Developers**
   - Visit: https://developers.facebook.com/
   - Log in with your Facebook account

2. **Create a New App**
   - Click "Create App"
   - Choose "Business" type
   - Name: `Shadow Goose Analytics`
   - Contact email: Your email

3. **Add Instagram Basic Display**
   - Go to "Add Products"
   - Find "Instagram Basic Display"
   - Click "Set Up"

4. **Configure Instagram Basic Display**
   - Go to "Instagram Basic Display" → "Basic Display"
   - Add your Instagram account
   - Get the **App ID** and **App Secret**

### **Step 2: Get Access Token**

1. **Generate Access Token**
   - Go to "Instagram Basic Display" → "Basic Display"
   - Click "Generate Token"
   - Authorize your Instagram account
   - Copy the **Access Token**

2. **Get Business Account ID**
   - Go to "Instagram Basic Display" → "Basic Display"
   - Find your **Instagram Business Account ID**

### **Step 3: Add to Render Environment Variables**

Go to [Render Dashboard](https://dashboard.render.com/) → `shadow-goose-api` → Environment tab → Add:

```bash
# Instagram Configuration
INSTAGRAM_APP_ID=your-app-id-from-facebook-developers
INSTAGRAM_APP_SECRET=your-app-secret-from-facebook-developers
INSTAGRAM_ACCESS_TOKEN=your-access-token-from-instagram
INSTAGRAM_BUSINESS_ACCOUNT_ID=your-business-account-id
INSTAGRAM_API_BASE_URL=https://graph.facebook.com/v18.0
INSTAGRAM_API_TIMEOUT=30
```

---

## **📊 WHAT YOU'LL GET**

### **Real Instagram Data:**
- ✅ **Follower Count**: Live follower numbers
- ✅ **Post Count**: Total posts on your account
- ✅ **Engagement Rate**: Real engagement metrics
- ✅ **Recent Posts**: Latest content with metrics
- ✅ **Profile Data**: Bio, profile picture, etc.

### **Dashboard Changes:**
- ✅ Real Instagram metrics instead of "..."
- ✅ Live social media data
- ✅ Actual engagement numbers
- ✅ Real follower counts

---

## **🧪 TESTING**

### **Test Your Configuration:**

```bash
# Test the Instagram API endpoint
curl https://shadow-goose-api.onrender.com/api/v1/analytics/instagram/profile

# Test with your configuration script
python scripts/configure_real_data.py test

# Check current status
python scripts/configure_real_data.py status
```

### **Expected Response:**
```json
{
  "status": "success",
  "data": {
    "username": "shadowgoose",
    "followers_count": 1234,
    "media_count": 56,
    "biography": "Shadow Goose Entertainment...",
    "profile_picture_url": "https://...",
    "engagement_rate": 4.2
  }
}
```

---

## **🚀 QUICK START**

### **Option A: Manual Setup**
1. Get Instagram app credentials (follow steps above)
2. Add environment variables to Render
3. Test the integration

### **Option B: Use Configuration Script**
```bash
python scripts/configure_real_data.py
# Choose option 2 (Instagram)
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
1. Check the detailed setup plan: `ANALYTICS_API_SETUP.md`
2. Run the configuration script: `python scripts/configure_real_data.py`
3. Test endpoints: `python scripts/configure_real_data.py test`

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

1. **Get Instagram app credentials** (follow steps above)
2. **Add environment variables to Render**
3. **Test the integration**
4. **Verify real data is working**

**Your Shadow Goose Instagram account will be connected to real social media data!**

---

## **📋 CHECKLIST**

- [ ] Create Facebook Developer app
- [ ] Add Instagram Basic Display
- [ ] Get App ID and App Secret
- [ ] Generate Access Token
- [ ] Get Business Account ID
- [ ] Add environment variables to Render
- [ ] Test the integration
- [ ] Verify real data is working

**Ready to connect your Instagram account to real social media analytics!** 