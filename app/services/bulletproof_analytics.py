"""
Bulletproof Analytics Service
Provides rock-solid analytics integration with comprehensive error handling,
fallbacks, and monitoring for Google Analytics and Instagram.
"""

import logging
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import aiohttp
import redis
from functools import wraps
from fastapi import HTTPException

from app.core.config import settings
from app.core.error_handling import (
    bulletproof_async, 
    error_handler, 
    service_monitor,
    google_analytics_circuit_breaker,
    instagram_circuit_breaker
)

logger = logging.getLogger(__name__)

# Redis connection with error handling
try:
    redis_client = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)
    redis_client.ping()  # Test connection
    logger.info("Redis connection established")
except Exception as e:
    logger.error(f"Redis connection failed: {e}")
    redis_client = None

class BulletproofGoogleAnalytics:
    """Bulletproof Google Analytics service with comprehensive error handling."""
    
    def __init__(self):
        self.api_key = settings.GOOGLE_ANALYTICS_KEY_FILE
        self.view_id = settings.GOOGLE_ANALYTICS_VIEW_ID
        self.session = None
        self.fallback_data = {
            "active_users": 0,
            "page_views": 0,
            "current_pages": [],
            "last_updated": datetime.now().isoformat(),
            "status": "fallback"
        }
    
    async def get_session(self):
        """Get aiohttp session with error handling."""
        if not self.session:
            try:
                self.session = aiohttp.ClientSession(
                    timeout=aiohttp.ClientTimeout(total=30)
                )
            except Exception as e:
                logger.error(f"Failed to create aiohttp session: {e}")
                return None
        return self.session
    
    @bulletproof_async
    async def health_check(self) -> bool:
        """Health check for Google Analytics service."""
        try:
            session = await self.get_session()
            if not session:
                return False
            
            # Simple API call to test connectivity
            url = f"https://www.googleapis.com/analytics/v3/data/realtime"
            params = {
                'ids': f'ga:{self.view_id}',
                'metrics': 'ga:activeUsers',
                'key': self.api_key
            }
            
            async with session.get(url, params=params) as response:
                return response.status == 200
                
        except Exception as e:
            logger.error(f"Google Analytics health check failed: {e}")
            return False
    
    @bulletproof_async
    async def get_real_time_data(self) -> Dict[str, Any]:
        """Get real-time Google Analytics data with comprehensive error handling."""
        try:
            session = await self.get_session()
            if not session:
                return self.fallback_data
            
            # Use circuit breaker for external API call
            async def fetch_data():
                url = f"https://www.googleapis.com/analytics/v3/data/realtime"
                params = {
                    'ids': f'ga:{self.view_id}',
                    'metrics': 'ga:activeUsers,ga:pageviews',
                    'key': self.api_key
                }
                
                async with session.get(url, params=params) as response:
                    if response.status != 200:
                        raise HTTPException(
                            status_code=response.status,
                            detail=f"Google Analytics API error: {response.status}"
                        )
                    
                    data = await response.json()
                    
                    return {
                        "active_users": int(data.get('totalsForAllResults', {}).get('ga:activeUsers', 0)),
                        "page_views": int(data.get('totalsForAllResults', {}).get('ga:pageviews', 0)),
                        "current_pages": data.get('rows', []),
                        "last_updated": datetime.now().isoformat(),
                        "status": "live"
                    }
            
            # Use circuit breaker
            result = await google_analytics_circuit_breaker.call(fetch_data)
            
            # Cache successful results
            if redis_client and result.get("status") == "live":
                redis_client.setex(
                    "analytics:google:latest",
                    300,  # 5 minutes
                    str(result)
                )
            
            return result
            
        except Exception as e:
            logger.error(f"Google Analytics data fetch failed: {e}")
            
            # Try to get cached data
            if redis_client:
                try:
                    cached = redis_client.get("analytics:google:latest")
                    if cached:
                        return eval(cached)  # Safe for our own cached data
                except Exception as cache_error:
                    logger.error(f"Cache retrieval failed: {cache_error}")
            
            return self.fallback_data

class BulletproofInstagram:
    """Bulletproof Instagram service with comprehensive error handling."""
    
    def __init__(self):
        self.access_token = settings.INSTAGRAM_ACCESS_TOKEN
        self.user_id = settings.INSTAGRAM_USER_ID
        self.session = None
        self.fallback_data = {
            "followers": 0,
            "posts": 0,
            "engagement_rate": 0.0,
            "recent_posts": [],
            "last_updated": datetime.now().isoformat(),
            "status": "fallback"
        }
    
    async def get_session(self):
        """Get aiohttp session with error handling."""
        if not self.session:
            try:
                self.session = aiohttp.ClientSession(
                    timeout=aiohttp.ClientTimeout(total=30)
                )
            except Exception as e:
                logger.error(f"Failed to create aiohttp session: {e}")
                return None
        return self.session
    
    @bulletproof_async
    async def health_check(self) -> bool:
        """Health check for Instagram service."""
        try:
            session = await self.get_session()
            if not session:
                return False
            
            # Simple API call to test connectivity
            url = f"https://graph.instagram.com/me"
            params = {
                'fields': 'id',
                'access_token': self.access_token
            }
            
            async with session.get(url, params=params) as response:
                return response.status == 200
                
        except Exception as e:
            logger.error(f"Instagram health check failed: {e}")
            return False
    
    @bulletproof_async
    async def get_account_data(self) -> Dict[str, Any]:
        """Get Instagram account data with comprehensive error handling."""
        try:
            session = await self.get_session()
            if not session:
                return self.fallback_data
            
            # Use circuit breaker for external API call
            async def fetch_data():
                # Get account info
                url = f"https://graph.instagram.com/me"
                params = {
                    'fields': 'id,username,media_count',
                    'access_token': self.access_token
                }
                
                async with session.get(url, params=params) as response:
                    if response.status != 200:
                        raise HTTPException(
                            status_code=response.status,
                            detail=f"Instagram API error: {response.status}"
                        )
                    
                    data = await response.json()
                    
                    # Get recent media
                    media_url = f"https://graph.instagram.com/me/media"
                    media_params = {
                        'fields': 'id,caption,media_type,media_url,like_count,comments_count',
                        'access_token': self.access_token,
                        'limit': 5
                    }
                    
                    async with session.get(media_url, params=media_params) as media_response:
                        if media_response.status == 200:
                            media_data = await media_response.json()
                            recent_posts = media_data.get('data', [])
                        else:
                            recent_posts = []
                    
                    return {
                        "followers": 0,  # Instagram Basic Display API doesn't provide follower count
                        "posts": data.get('media_count', 0),
                        "engagement_rate": 0.0,  # Would need Instagram Graph API for this
                        "recent_posts": recent_posts,
                        "last_updated": datetime.now().isoformat(),
                        "status": "live"
                    }
            
            # Use circuit breaker
            result = await instagram_circuit_breaker.call(fetch_data)
            
            # Cache successful results
            if redis_client and result.get("status") == "live":
                redis_client.setex(
                    "analytics:instagram:latest",
                    600,  # 10 minutes (Instagram rate limits)
                    str(result)
                )
            
            return result
            
        except Exception as e:
            logger.error(f"Instagram data fetch failed: {e}")
            
            # Try to get cached data
            if redis_client:
                try:
                    cached = redis_client.get("analytics:instagram:latest")
                    if cached:
                        return eval(cached)  # Safe for our own cached data
                except Exception as cache_error:
                    logger.error(f"Cache retrieval failed: {cache_error}")
            
            return self.fallback_data

class BulletproofAnalyticsService:
    """Main analytics service with comprehensive error handling and monitoring."""
    
    def __init__(self):
        self.google_analytics = BulletproofGoogleAnalytics()
        self.instagram = BulletproofInstagram()
        
        # Register services with monitor
        service_monitor.register_service(
            "google_analytics",
            self.google_analytics.health_check,
            self.google_analytics.fallback_data
        )
        service_monitor.register_service(
            "instagram",
            self.instagram.health_check,
            self.instagram.fallback_data
        )
    
    @bulletproof_async
    async def get_comprehensive_analytics(self) -> Dict[str, Any]:
        """Get comprehensive analytics data from all sources."""
        try:
            # Fetch data from all sources concurrently
            tasks = [
                self.google_analytics.get_real_time_data(),
                self.instagram.get_account_data()
            ]
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Process results
            google_data = results[0] if not isinstance(results[0], Exception) else self.google_analytics.fallback_data
            instagram_data = results[1] if not isinstance(results[1], Exception) else self.instagram.fallback_data
            
            # Count errors
            error_count = sum(1 for result in results if isinstance(result, Exception))
            
            return {
                "google_analytics": google_data,
                "instagram": instagram_data,
                "error_count": error_count,
                "last_updated": datetime.now().isoformat(),
                "overall_status": "healthy" if error_count == 0 else "degraded"
            }
            
        except Exception as e:
            logger.error(f"Comprehensive analytics fetch failed: {e}")
            return {
                "google_analytics": self.google_analytics.fallback_data,
                "instagram": self.instagram.fallback_data,
                "error_count": 2,
                "last_updated": datetime.now().isoformat(),
                "overall_status": "error"
            }
    
    @bulletproof_async
    async def get_service_health(self) -> Dict[str, Any]:
        """Get health status of all analytics services."""
        try:
            health_checks = [
                service_monitor.check_service_health("google_analytics"),
                service_monitor.check_service_health("instagram")
            ]
            
            results = await asyncio.gather(*health_checks, return_exceptions=True)
            
            return {
                "google_analytics": {
                    "status": "healthy" if results[0] and not isinstance(results[0], Exception) else "unhealthy",
                    "last_check": datetime.now().isoformat()
                },
                "instagram": {
                    "status": "healthy" if results[1] and not isinstance(results[1], Exception) else "unhealthy",
                    "last_check": datetime.now().isoformat()
                },
                "redis": {
                    "status": "healthy" if redis_client else "unhealthy",
                    "last_check": datetime.now().isoformat()
                },
                "overall_status": "healthy" if all(
                    result and not isinstance(result, Exception) for result in results
                ) else "degraded"
            }
            
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return {
                "google_analytics": {"status": "error", "last_check": datetime.now().isoformat()},
                "instagram": {"status": "error", "last_check": datetime.now().isoformat()},
                "redis": {"status": "error", "last_check": datetime.now().isoformat()},
                "overall_status": "error"
            }

# Global analytics service instance
analytics_service = BulletproofAnalyticsService()

# Decorator for analytics endpoints
def analytics_endpoint(func):
    """Decorator for analytics endpoints with comprehensive error handling."""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except Exception as e:
            error_handler.log_error(e, f"Analytics endpoint: {func.__name__}")
            return {
                "status": "error",
                "message": "Analytics service temporarily unavailable",
                "timestamp": datetime.now().isoformat()
            }
    return wrapper 