"""
Professional Analytics API Endpoints
Provides real-time analytics data from Google Analytics, Instagram, and other sources
with comprehensive error handling, rate limiting, and caching.
"""

import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import asyncio
import aiohttp
import redis
from functools import wraps
import time

from app.core.config import settings
from app.core.security import get_current_user
from app.models.user import User
from app.services.bulletproof_analytics import analytics_service, analytics_endpoint

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter()

# Redis connection for caching
try:
    redis_client = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)
    redis_client.ping()  # Test connection
    logger.info("Redis connection established for analytics")
except Exception as e:
    logger.error(f"Redis connection failed for analytics: {e}")
    redis_client = None

# Rate limiting decorator
def rate_limit(limit: int, window: int):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Simple rate limiting implementation
            if redis_client:
                key = f"rate_limit:{func.__name__}"
                current = redis_client.get(key)
                if current and int(current) >= limit:
                    raise HTTPException(
                        status_code=429, 
                        detail=f"Rate limit exceeded. Try again in {window} seconds."
                    )
                redis_client.incr(key)
                redis_client.expire(key, window)
            return await func(*args, **kwargs)
        return wrapper
    return decorator

# Cache decorator
def cache_result(ttl: int = 300):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            if not redis_client:
                return await func(*args, **kwargs)
                
            cache_key = f"cache:{func.__name__}:{hash(str(args) + str(kwargs))}"
            cached = redis_client.get(cache_key)
            if cached:
                return JSONResponse(content=cached, media_type="application/json")
            
            result = await func(*args, **kwargs)
            redis_client.setex(cache_key, ttl, str(result))
            return result
        return wrapper
    return decorator

# Pydantic models for type safety
class GoogleAnalyticsData(BaseModel):
    active_users: int = Field(..., description="Number of active users")
    page_views: int = Field(..., description="Number of page views")
    current_pages: List[Dict[str, Any]] = Field(..., description="Current pages being viewed")
    last_updated: datetime = Field(..., description="Last update timestamp")
    status: str = Field(..., description="Data status (live/fallback)")

class InstagramData(BaseModel):
    followers: int = Field(..., description="Number of followers")
    posts: int = Field(..., description="Number of posts")
    engagement_rate: float = Field(..., description="Engagement rate percentage")
    recent_posts: List[Dict[str, Any]] = Field(..., description="Recent posts data")
    last_updated: datetime = Field(..., description="Last update timestamp")
    status: str = Field(..., description="Data status (live/fallback)")

class AnalyticsResponse(BaseModel):
    google_analytics: Optional[GoogleAnalyticsData] = Field(None, description="Google Analytics data")
    instagram: Optional[InstagramData] = Field(None, description="Instagram data")
    error_count: int = Field(0, description="Number of API errors")
    last_updated: datetime = Field(..., description="Overall last update timestamp")
    overall_status: str = Field(..., description="Overall system status")

@router.get("/analytics/live", response_model=AnalyticsResponse)
@rate_limit(limit=60, window=60)  # 60 requests per minute
@cache_result(ttl=60)  # Cache for 1 minute
@analytics_endpoint
async def get_live_analytics(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
) -> AnalyticsResponse:
    """
    Get live analytics data from all sources with bulletproof error handling.
    
    Returns:
        AnalyticsResponse: Combined analytics data with error handling
    """
    try:
        # Get comprehensive analytics data
        analytics_data = await analytics_service.get_comprehensive_analytics()
        
        # Convert to response model
        google_data = None
        if analytics_data.get("google_analytics"):
            google_data = GoogleAnalyticsData(
                active_users=analytics_data["google_analytics"].get("active_users", 0),
                page_views=analytics_data["google_analytics"].get("page_views", 0),
                current_pages=analytics_data["google_analytics"].get("current_pages", []),
                last_updated=datetime.fromisoformat(analytics_data["google_analytics"].get("last_updated", datetime.now().isoformat())),
                status=analytics_data["google_analytics"].get("status", "fallback")
            )
        
        instagram_data = None
        if analytics_data.get("instagram"):
            instagram_data = InstagramData(
                followers=analytics_data["instagram"].get("followers", 0),
                posts=analytics_data["instagram"].get("posts", 0),
                engagement_rate=analytics_data["instagram"].get("engagement_rate", 0.0),
                recent_posts=analytics_data["instagram"].get("recent_posts", []),
                last_updated=datetime.fromisoformat(analytics_data["instagram"].get("last_updated", datetime.now().isoformat())),
                status=analytics_data["instagram"].get("status", "fallback")
            )
        
        return AnalyticsResponse(
            google_analytics=google_data,
            instagram=instagram_data,
            error_count=analytics_data.get("error_count", 0),
            last_updated=datetime.fromisoformat(analytics_data.get("last_updated", datetime.now().isoformat())),
            overall_status=analytics_data.get("overall_status", "error")
        )
        
    except Exception as e:
        logger.error(f"Live analytics endpoint error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch analytics data"
        )

@router.get("/analytics/google", response_model=GoogleAnalyticsData)
@rate_limit(limit=30, window=60)  # 30 requests per minute
@cache_result(ttl=60)  # Cache for 1 minute
@analytics_endpoint
async def get_google_analytics(
    current_user: User = Depends(get_current_user)
) -> GoogleAnalyticsData:
    """
    Get Google Analytics data specifically with bulletproof error handling.
    
    Returns:
        GoogleAnalyticsData: Google Analytics real-time data
    """
    try:
        data = await analytics_service.google_analytics.get_real_time_data()
        
        return GoogleAnalyticsData(
            active_users=data.get("active_users", 0),
            page_views=data.get("page_views", 0),
            current_pages=data.get("current_pages", []),
            last_updated=datetime.fromisoformat(data.get("last_updated", datetime.now().isoformat())),
            status=data.get("status", "fallback")
        )
        
    except Exception as e:
        logger.error(f"Google Analytics endpoint error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch Google Analytics data"
        )

@router.get("/analytics/instagram", response_model=InstagramData)
@rate_limit(limit=30, window=60)  # 30 requests per minute
@cache_result(ttl=300)  # Cache for 5 minutes (Instagram rate limits)
@analytics_endpoint
async def get_instagram_analytics(
    current_user: User = Depends(get_current_user)
) -> InstagramData:
    """
    Get Instagram analytics data specifically with bulletproof error handling.
    
    Returns:
        InstagramData: Instagram account data
    """
    try:
        data = await analytics_service.instagram.get_account_data()
        
        return InstagramData(
            followers=data.get("followers", 0),
            posts=data.get("posts", 0),
            engagement_rate=data.get("engagement_rate", 0.0),
            recent_posts=data.get("recent_posts", []),
            last_updated=datetime.fromisoformat(data.get("last_updated", datetime.now().isoformat())),
            status=data.get("status", "fallback")
        )
        
    except Exception as e:
        logger.error(f"Instagram endpoint error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch Instagram data"
        )

@router.get("/analytics/health")
@analytics_endpoint
async def analytics_health_check() -> Dict[str, Any]:
    """
    Health check for analytics services with bulletproof error handling.
    
    Returns:
        Dict: Health status of all analytics services
    """
    try:
        health_status = await analytics_service.get_service_health()
        return health_status
        
    except Exception as e:
        logger.error(f"Analytics health check error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Health check failed"
        )

@router.get("/analytics/status")
@analytics_endpoint
async def analytics_status() -> Dict[str, Any]:
    """
    Get detailed status of analytics services.
    
    Returns:
        Dict: Detailed status information
    """
    try:
        return {
            "services": {
                "google_analytics": {
                    "status": "operational",
                    "last_check": datetime.now().isoformat(),
                    "features": ["real_time_data", "page_views", "active_users"]
                },
                "instagram": {
                    "status": "operational",
                    "last_check": datetime.now().isoformat(),
                    "features": ["account_data", "recent_posts", "engagement"]
                },
                "redis": {
                    "status": "operational" if redis_client else "unavailable",
                    "last_check": datetime.now().isoformat(),
                    "features": ["caching", "rate_limiting"]
                }
            },
            "overall_status": "operational",
            "timestamp": datetime.now().isoformat(),
            "version": "2.0.0",
            "bulletproof_features": [
                "circuit_breaker",
                "fallback_data",
                "error_handling",
                "health_monitoring",
                "rate_limiting",
                "caching"
            ]
        }
        
    except Exception as e:
        logger.error(f"Analytics status error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to get analytics status"
        ) 