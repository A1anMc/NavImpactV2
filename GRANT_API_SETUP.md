# Grant API Configuration Guide

## PHASE 1: GRANT APIS (Priority 1)

### 1. Screen Australia API
- URL: https://www.screenaustralia.gov.au/api/
- Status: Ready to connect
- Required: API Key from Screen Australia
- Features: Real-time grant opportunities for film/media

### 2. Business.gov.au API  
- URL: https://business.gov.au/api/
- Status: Ready to connect
- Required: API Key from Business.gov.au
- Features: Government grants and funding

### 3. GrantConnect API
- URL: https://www.grants.gov.au/api/
- Status: Ready to connect
- Required: API Key from GrantConnect
- Features: Australian government grants

## ENVIRONMENT VARIABLES TO SET

# Screen Australia
SCREEN_AUSTRALIA_API_KEY=your-screen-australia-api-key
SCREEN_AUSTRALIA_BASE_URL=https://www.screenaustralia.gov.au/api/

# Business.gov.au
BUSINESS_GOV_API_KEY=your-business-gov-api-key
BUSINESS_GOV_BASE_URL=https://business.gov.au/api/

# GrantConnect
GRANT_CONNECT_API_KEY=your-grantconnect-api-key
GRANT_CONNECT_BASE_URL=https://www.grants.gov.au/api/

## API ENDPOINTS READY

# Screen Australia Endpoints
- /funding-and-support/narrative-content-development
- /funding-and-support/narrative-content-production  
- /funding-and-support/documentary
- /funding-and-support/games
- /funding-and-support/online-and-games

# Business.gov.au Endpoints
- /grants-and-programs/creative-industries
- /grants-and-programs/arts-and-culture
- /grants-and-programs/innovation-and-science

# GrantConnect Endpoints
- /grants (search and filter)
- /grants/{id} (specific grant details)

## REAL-TIME FEATURES

# WebSocket Notifications
- Live grant discovery
- Instant matching alerts
- Real-time updates

# Grant Matching
- AI-powered matching algorithm
- Project profile analysis
- Success probability scoring

# Rate Limiting
- Respectful API usage
- Circuit breakers for failures
- Fallback to cached data

## NEXT STEPS

1. Get API keys from each service
2. Add keys to Render environment variables
3. Test connections with real data
4. Deploy to production

## CURRENT STATUS

✅ Scrapers ready for API integration
✅ Real-time service configured
✅ WebSocket notifications ready
✅ Grant matching algorithm active
✅ Error handling and fallbacks in place

Ready to switch from mock data to real data!
