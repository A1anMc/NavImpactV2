from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import logging

from app.core.deps import get_db
from app.services.industry_news import IndustryNewsService
from app.schemas.industry_news import (
    IndustryNewsResponse, 
    NewsRefreshResponse, 
    UserNewsRequest
)

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/", response_model=List[IndustryNewsResponse])
def get_news_for_user(
    sectors: str = Query(..., description="Comma-separated list of sectors"),
    limit: int = Query(20, ge=1, le=100, description="Number of news items to return"),
    db: Session = Depends(get_db)
):
    """
    Get personalized industry news for user based on their sectors.
    
    Args:
        sectors: Comma-separated list of user sectors (e.g., "creative,health,tech")
        limit: Maximum number of news items to return (1-100)
        db: Database session
    
    Returns:
        List of relevant news items sorted by relevance score
    """
    try:
        # Parse sectors from comma-separated string
        user_sectors = [s.strip().lower() for s in sectors.split(",") if s.strip()]
        
        if not user_sectors:
            raise HTTPException(
                status_code=400, 
                detail="At least one sector must be specified"
            )
        
        # Get news for user
        news_items = IndustryNewsService.get_news_for_user(
            db=db, 
            user_sectors=user_sectors, 
            limit=limit
        )
        
        return news_items
        
    except Exception as e:
        logger.error(f"Error getting news for user: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Error retrieving news items"
        )

@router.get("/sectors/{sector}", response_model=List[IndustryNewsResponse])
def get_news_by_sector(
    sector: str,
    limit: int = Query(20, ge=1, le=100, description="Number of news items to return"),
    db: Session = Depends(get_db)
):
    """
    Get news items for a specific sector.
    
    Args:
        sector: Sector name (e.g., "creative", "health", "tech")
        limit: Maximum number of news items to return (1-100)
        db: Database session
    
    Returns:
        List of news items for the specified sector
    """
    try:
        # Get news for specific sector
        news_items = IndustryNewsService.get_news_for_user(
            db=db, 
            user_sectors=[sector.lower()], 
            limit=limit
        )
        
        return news_items
        
    except Exception as e:
        logger.error(f"Error getting news for sector {sector}: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Error retrieving news items"
        )

@router.post("/refresh", response_model=NewsRefreshResponse)
def refresh_news_feed(db: Session = Depends(get_db)):
    """
    Refresh the news feed by fetching from RSS sources.
    
    This endpoint:
    1. Fetches news from all configured RSS feeds
    2. Saves new items to database (with deduplication)
    3. Cleans up old news items (older than 30 days)
    
    Args:
        db: Database session
    
    Returns:
        Summary of the refresh operation
    """
    try:
        # Refresh news feed
        result = IndustryNewsService.refresh_news_feed(db)
        
        # Create response message
        message = (
            f"News feed refreshed successfully. "
            f"Fetched {result['total_fetched']} items, "
            f"saved {result['saved']} new items, "
            f"deleted {result['deleted_old']} old items."
        )
        
        return NewsRefreshResponse(
            total_fetched=result['total_fetched'],
            saved=result['saved'],
            deleted_old=result['deleted_old'],
            message=message
        )
        
    except Exception as e:
        logger.error(f"Error refreshing news feed: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Error refreshing news feed"
        )

@router.get("/sectors", response_model=List[str])
def get_available_sectors():
    """
    Get list of available sectors for news filtering.
    
    Returns:
        List of available sector names
    """
    return list(IndustryNewsService.RSS_FEEDS.keys())

@router.get("/stats")
def get_news_stats(db: Session = Depends(get_db)):
    """
    Get statistics about the news database.
    
    Args:
        db: Database session
    
    Returns:
        News database statistics
    """
    try:
        from app.models.industry_news import IndustryNews
        from sqlalchemy import func
        
        # Get total count
        total_count = db.query(IndustryNews).count()
        
        # Get count by sector
        sector_counts = db.query(
            IndustryNews.sector,
            func.count(IndustryNews.id).label('count')
        ).group_by(IndustryNews.sector).all()
        
        # Get recent count (last 7 days)
        from datetime import datetime, timezone, timedelta
        week_ago = datetime.now(timezone.utc) - timedelta(days=7)
        recent_count = db.query(IndustryNews).filter(
            IndustryNews.created_at >= week_ago
        ).count()
        
        return {
            "total_news_items": total_count,
            "recent_news_items": recent_count,
            "sector_breakdown": {
                sector: count for sector, count in sector_counts
            },
            "available_sectors": list(IndustryNewsService.RSS_FEEDS.keys())
        }
        
    except Exception as e:
        logger.error(f"Error getting news stats: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Error retrieving news statistics"
        ) 