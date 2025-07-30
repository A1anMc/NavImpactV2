from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, Optional
from datetime import datetime
import logging

from app.services.social_media.instagram_service import instagram_service
from app.core.deps import get_current_user
from app.models.user import User

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/instagram/metrics")
async def get_instagram_metrics(
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Get Instagram metrics for OKR tracking.
    Requires Instagram API access token to be configured.
    """
    try:
        metrics = await instagram_service.get_comprehensive_metrics()
        
        if metrics["status"] == "error":
            raise HTTPException(
                status_code=503,
                detail=f"Instagram API error: {metrics.get('error', 'Unknown error')}"
            )
        
        return {
            "success": True,
            "data": metrics,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error fetching Instagram metrics: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch Instagram metrics"
        )

@router.get("/instagram/followers")
async def get_instagram_followers(
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Get current Instagram follower count.
    """
    try:
        follower_count = await instagram_service.get_follower_count()
        
        if follower_count is None:
            raise HTTPException(
                status_code=503,
                detail="Unable to fetch Instagram follower count. Check API configuration."
            )
        
        return {
            "success": True,
            "data": {
                "platform": "instagram",
                "followers": follower_count,
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        
    except Exception as e:
        logger.error(f"Error fetching Instagram followers: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch Instagram follower count"
        )

@router.get("/instagram/account")
async def get_instagram_account_info(
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Get Instagram account information.
    """
    try:
        account_info = await instagram_service.get_account_info()
        
        if account_info is None:
            raise HTTPException(
                status_code=503,
                detail="Unable to fetch Instagram account info. Check API configuration."
            )
        
        return {
            "success": True,
            "data": account_info
        }
        
    except Exception as e:
        logger.error(f"Error fetching Instagram account info: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch Instagram account information"
        )

@router.get("/instagram/media")
async def get_instagram_recent_media(
    limit: int = 10,
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Get recent Instagram media posts with engagement metrics.
    """
    try:
        media = await instagram_service.get_recent_media(limit=limit)
        
        if media is None:
            raise HTTPException(
                status_code=503,
                detail="Unable to fetch Instagram media. Check API configuration."
            )
        
        return {
            "success": True,
            "data": media
        }
        
    except Exception as e:
        logger.error(f"Error fetching Instagram media: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch Instagram media"
        )

@router.get("/social-media/status")
async def get_social_media_status(
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Get status of all social media API connections.
    """
    status = {
        "instagram": {
            "configured": bool(instagram_service.access_token),
            "business_account_id": bool(instagram_service.business_account_id),
            "status": "configured" if instagram_service.access_token else "not_configured"
        },
        "overall_status": "partial" if instagram_service.access_token else "not_configured"
    }
    
    return {
        "success": True,
        "data": status,
        "timestamp": datetime.utcnow().isoformat()
    } 