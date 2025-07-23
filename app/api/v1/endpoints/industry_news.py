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

@router.post("/seed")
def seed_news_database(db: Session = Depends(get_db)):
    """
    Seed the news database with sample data for testing.
    
    Args:
        db: Database session
    
    Returns:
        Summary of the seeding operation
    """
    try:
        from app.models.industry_news import IndustryNews
        from datetime import datetime, timedelta
        import hashlib
        
        # Check if database already has data
        existing_count = db.query(IndustryNews).count()
        if existing_count > 0:
            return {
                "message": f"Database already has {existing_count} news items. Skipping seed.",
                "items_added": 0,
                "total_items": existing_count
            }
        
        # Sample news data
        sample_news = [
            {
                "sector": "tech",
                "title": "New AI Grant Program Launches for Australian Startups",
                "summary": "The Australian government has announced a new $50 million grant program to support AI startups and innovation in the technology sector.",
                "url": "https://example.com/ai-grant-program",
                "source": "Tech News Australia",
                "platform": "website",
                "platform_icon": "globe",
                "published_at": datetime.now() - timedelta(hours=2),
                "relevance_score": 0.95,
            },
            {
                "sector": "creative",
                "title": "Digital Arts Innovation Fund Opens Applications",
                "summary": "Creative Australia has opened applications for the Digital Arts Innovation Fund, supporting digital artists and creative technologists.",
                "url": "https://example.com/digital-arts-fund",
                "source": "Creative Australia",
                "platform": "website",
                "platform_icon": "globe",
                "published_at": datetime.now() - timedelta(hours=4),
                "relevance_score": 0.88,
            },
            {
                "sector": "health",
                "title": "Mental Health Technology Grant Available",
                "summary": "The Department of Health is offering grants for innovative mental health technology solutions that can improve access to care.",
                "url": "https://example.com/mental-health-tech",
                "source": "Health.gov.au",
                "platform": "website",
                "platform_icon": "globe",
                "published_at": datetime.now() - timedelta(hours=6),
                "relevance_score": 0.92,
            },
            {
                "sector": "government",
                "title": "Government Digital Transformation Initiative",
                "summary": "The federal government has launched a new digital transformation initiative to modernize public services.",
                "url": "https://example.com/digital-transformation",
                "source": "Gov News",
                "platform": "website",
                "platform_icon": "globe",
                "published_at": datetime.now() - timedelta(hours=8),
                "relevance_score": 0.85,
            },
            {
                "sector": "funding",
                "title": "New Funding Round for Social Impact Startups",
                "summary": "A new funding round has been announced for social impact startups focusing on environmental and social challenges.",
                "url": "https://example.com/social-impact-funding",
                "source": "Funding Weekly",
                "platform": "website",
                "platform_icon": "globe",
                "published_at": datetime.now() - timedelta(hours=10),
                "relevance_score": 0.90,
            },
            {
                "sector": "tech",
                "title": "Cybersecurity Innovation Grant Program",
                "summary": "The Australian Cyber Security Centre is offering grants for innovative cybersecurity solutions and research.",
                "url": "https://example.com/cybersecurity-grants",
                "source": "Cyber Security News",
                "platform": "twitter",
                "platform_icon": "twitter",
                "published_at": datetime.now() - timedelta(hours=12),
                "relevance_score": 0.87,
            },
            {
                "sector": "creative",
                "title": "Indigenous Arts and Culture Funding",
                "summary": "New funding opportunities for Indigenous artists and cultural preservation projects across Australia.",
                "url": "https://example.com/indigenous-arts-funding",
                "source": "Indigenous Arts Network",
                "platform": "linkedin",
                "platform_icon": "linkedin",
                "published_at": datetime.now() - timedelta(hours=14),
                "relevance_score": 0.93,
            },
            {
                "sector": "health",
                "title": "Telehealth Innovation Grants",
                "summary": "The Department of Health is offering grants for innovative telehealth solutions to improve rural healthcare access.",
                "url": "https://example.com/telehealth-grants",
                "source": "Health Innovation Hub",
                "platform": "facebook",
                "platform_icon": "facebook",
                "published_at": datetime.now() - timedelta(hours=16),
                "relevance_score": 0.89,
            }
        ]
        
        # Add sample news items
        added_count = 0
        for item in sample_news:
            url_hash = hashlib.md5(item["url"].encode()).hexdigest()
            
            # Check if news already exists
            existing = db.query(IndustryNews).filter(
                IndustryNews.url_hash == url_hash
            ).first()
            
            if not existing:
                news_item = IndustryNews(
                    sector=item["sector"],
                    title=item["title"],
                    summary=item["summary"],
                    url=item["url"],
                    url_hash=url_hash,
                    source=item["source"],
                    platform=item["platform"],
                    platform_icon=item["platform_icon"],
                    relevance_score=item["relevance_score"],
                    published_at=item["published_at"]
                )
                db.add(news_item)
                added_count += 1
        
        # Commit changes
        db.commit()
        
        return {
            "message": f"Successfully seeded {added_count} news items",
            "items_added": added_count,
            "total_items": db.query(IndustryNews).count()
        }
        
    except Exception as e:
        logger.error(f"Error seeding news database: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=500, 
            detail=f"Error seeding news database: {str(e)}"
        ) 