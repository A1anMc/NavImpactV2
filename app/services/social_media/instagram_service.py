import asyncio
import logging
from datetime import datetime, timedelta
from typing import Any, Dict, Optional

import aiohttp
from app.core.config import settings

logger = logging.getLogger(__name__)


class InstagramService:
    """Service for interacting with Instagram Graph API."""

    def __init__(self):
        self.base_url = settings.INSTAGRAM_API_BASE_URL
        self.access_token = settings.INSTAGRAM_ACCESS_TOKEN
        self.business_account_id = settings.INSTAGRAM_BUSINESS_ACCOUNT_ID
        self.timeout = aiohttp.ClientTimeout(total=settings.INSTAGRAM_API_TIMEOUT)

    async def _make_request(
        self, endpoint: str, params: Optional[Dict] = None
    ) -> Optional[Dict]:
        """Make authenticated request to Instagram API."""
        if not self.access_token:
            logger.warning("Instagram access token not configured")
            return None

        url = f"{self.base_url}/{endpoint}"
        params = params or {}
        params.update(
            {
                "access_token": self.access_token,
                "fields": "id,username,followers_count,media_count,biography,profile_picture_url",
            }
        )

        try:
            async with aiohttp.ClientSession(timeout=self.timeout) as session:
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        logger.info(f"Instagram API request successful: {endpoint}")
                        return data
                    else:
                        error_text = await response.text()
                        logger.error(
                            f"Instagram API error {response.status}: {error_text}"
                        )
                        return None
        except Exception as e:
            logger.error(f"Instagram API request failed: {str(e)}")
            return None

    async def get_account_info(self) -> Optional[Dict[str, Any]]:
        """Get Instagram business account information."""
        if not self.business_account_id:
            logger.warning("Instagram business account ID not configured")
            return None

        endpoint = f"{self.business_account_id}"
        return await self._make_request(endpoint)

    async def get_follower_count(self) -> Optional[int]:
        """Get current follower count."""
        account_info = await self.get_account_info()
        if account_info and "followers_count" in account_info:
            return account_info["followers_count"]
        return None

    async def get_media_count(self) -> Optional[int]:
        """Get total media count."""
        account_info = await self.get_account_info()
        if account_info and "media_count" in account_info:
            return account_info["media_count"]
        return None

    async def get_recent_media(self, limit: int = 10) -> Optional[list]:
        """Get recent media posts with engagement metrics."""
        if not self.business_account_id:
            return None

        endpoint = f"{self.business_account_id}/media"
        params = {
            "fields": "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count",
            "limit": limit,
        }

        return await self._make_request(endpoint, params)

    async def get_media_insights(self, media_id: str) -> Optional[Dict]:
        """Get insights for a specific media post."""
        endpoint = f"{media_id}/insights"
        params = {"metric": "impressions,reach,engagement,saved"}

        return await self._make_request(endpoint, params)

    async def get_account_insights(self) -> Optional[Dict]:
        """Get account-level insights (requires permissions)."""
        if not self.business_account_id:
            return None

        endpoint = f"{self.business_account_id}/insights"
        params = {
            "metric": "follower_count,impressions,reach,profile_views",
            "period": "day",
        }

        return await self._make_request(endpoint, params)

    async def get_comprehensive_metrics(self) -> Dict[str, Any]:
        """Get comprehensive Instagram metrics for OKR tracking."""
        metrics = {
            "platform": "instagram",
            "timestamp": datetime.utcnow().isoformat(),
            "followers": None,
            "media_count": None,
            "recent_engagement": None,
            "account_info": None,
            "status": "error",
            "error": None,
        }

        try:
            # Get basic account info
            account_info = await self.get_account_info()
            if account_info:
                metrics["account_info"] = {
                    "username": account_info.get("username"),
                    "biography": account_info.get("biography"),
                    "profile_picture": account_info.get("profile_picture_url"),
                }
                metrics["followers"] = account_info.get("followers_count")
                metrics["media_count"] = account_info.get("media_count")
                metrics["status"] = "success"

            # Get recent media engagement
            recent_media = await self.get_recent_media(limit=5)
            if recent_media and "data" in recent_media:
                total_likes = sum(
                    post.get("like_count", 0) for post in recent_media["data"]
                )
                total_comments = sum(
                    post.get("comments_count", 0) for post in recent_media["data"]
                )
                metrics["recent_engagement"] = {
                    "total_likes": total_likes,
                    "total_comments": total_comments,
                    "avg_likes_per_post": (
                        total_likes / len(recent_media["data"])
                        if recent_media["data"]
                        else 0
                    ),
                    "avg_comments_per_post": (
                        total_comments / len(recent_media["data"])
                        if recent_media["data"]
                        else 0
                    ),
                }

        except Exception as e:
            metrics["error"] = str(e)
            logger.error(f"Error getting Instagram metrics: {str(e)}")

        return metrics


# Global instance
instagram_service = InstagramService()
