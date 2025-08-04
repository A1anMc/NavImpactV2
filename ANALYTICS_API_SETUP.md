# Analytics API Configuration Guide

## PHASE 2: ANALYTICS APIS (Priority 2)

### 1. Google Analytics API
- URL: https://analytics.google.com/
- Status: Ready to connect
- Required: Service account and property ID
- Features: Real website analytics, user data, page views

### 2. Instagram Basic Display API
- URL: https://developers.facebook.com/docs/instagram-basic-display-api
- Status: Ready to connect
- Required: App ID and access token
- Features: Social media analytics, follower data, engagement

## ENVIRONMENT VARIABLES TO SET

# Google Analytics
GOOGLE_ANALYTICS_PROPERTY_ID=your-ga-property-id
GOOGLE_ANALYTICS_PRIVATE_KEY_ID=your-private-key-id
GOOGLE_ANALYTICS_PRIVATE_KEY=your-private-key
GOOGLE_ANALYTICS_CLIENT_EMAIL=your-client-email
GOOGLE_ANALYTICS_CLIENT_ID=your-client-id

# Instagram
INSTAGRAM_ACCESS_TOKEN=your-instagram-token
INSTAGRAM_APP_ID=your-instagram-app-id
INSTAGRAM_APP_SECRET=your-instagram-app-secret

## GOOGLE ANALYTICS SETUP

### 1. Create Service Account
1. Go to Google Cloud Console
2. Create new project or select existing
3. Enable Google Analytics API
4. Create service account
5. Download JSON key file

### 2. Configure Analytics
1. Add service account email to GA property
2. Grant appropriate permissions
3. Get property ID from GA admin

### 3. Environment Variables
```bash
GOOGLE_ANALYTICS_PROPERTY_ID=123456789
GOOGLE_ANALYTICS_PRIVATE_KEY_ID=your-private-key-id
GOOGLE_ANALYTICS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_ANALYTICS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_ANALYTICS_CLIENT_ID=your-client-id
```

## INSTAGRAM SETUP

### 1. Create Facebook App
1. Go to Facebook Developers
2. Create new app
3. Add Instagram Basic Display product
4. Configure app settings

### 2. Get Access Token
1. Set up Instagram Basic Display
2. Configure redirect URIs
3. Generate access token
4. Test API connection

### 3. Environment Variables
```bash
INSTAGRAM_ACCESS_TOKEN=your-long-lived-access-token
INSTAGRAM_APP_ID=your-facebook-app-id
INSTAGRAM_APP_SECRET=your-facebook-app-secret
```

## REAL-TIME ANALYTICS FEATURES

# Google Analytics Integration
- Live user data
- Page view tracking
- Engagement metrics
- Traffic sources
- Device analytics

# Instagram Integration
- Follower count
- Engagement rates
- Post performance
- Audience insights
- Content analytics

# Dashboard Features
- Real-time metrics
- Historical trends
- Performance alerts
- Custom reports
- Export capabilities

## API ENDPOINTS READY

# Google Analytics
- /analytics/ga/users (active users)
- /analytics/ga/pageviews (page views)
- /analytics/ga/sources (traffic sources)
- /analytics/ga/devices (device usage)

# Instagram
- /analytics/instagram/followers (follower count)
- /analytics/instagram/engagement (engagement rate)
- /analytics/instagram/posts (post performance)
- /analytics/instagram/audience (audience insights)

## NEXT STEPS

1. Set up Google Analytics service account
2. Configure Instagram app
3. Add environment variables to Render
4. Test real data connections
5. Deploy analytics dashboard

## CURRENT STATUS

✅ Analytics service configured
✅ Real-time data processing ready
✅ Dashboard visualizations prepared
✅ Error handling implemented
✅ Fallback data available

Ready to connect real analytics data! 