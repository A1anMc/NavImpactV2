from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import logging
from sqlalchemy import text

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
                "existing_count": existing_count
            }
        
        # Sample news data
        sample_news = [
            {
                "sector": "tech",
                "title": "New AI Grant Program Launches for Australian Startups",
                "description": "The Australian government has announced a new $50 million grant program to support AI startups and innovation in the technology sector.",
                "url": "https://example.com/ai-grant-program",
                "published_at": datetime.now() - timedelta(hours=2),
                "platform": "website",
                "platform_icon": "globe"
            },
            {
                "sector": "health",
                "title": "Mental Health Initiative Receives Major Funding Boost",
                "description": "A comprehensive mental health program has been awarded $25 million in funding to expand services across regional Australia.",
                "url": "https://example.com/mental-health-funding",
                "published_at": datetime.now() - timedelta(hours=4),
                "platform": "twitter",
                "platform_icon": "twitter"
            },
            {
                "sector": "creative",
                "title": "Digital Arts Grant Opens for Applications",
                "description": "Creative Australia has opened applications for digital arts grants, supporting innovative projects in digital media and interactive art.",
                "url": "https://example.com/digital-arts-grant",
                "published_at": datetime.now() - timedelta(hours=6),
                "platform": "linkedin",
                "platform_icon": "linkedin"
            },
            {
                "sector": "government",
                "title": "Local Government Innovation Fund Announced",
                "description": "A new $10 million fund has been established to support innovative projects in local government and community development.",
                "url": "https://example.com/local-government-fund",
                "published_at": datetime.now() - timedelta(hours=8),
                "platform": "website",
                "platform_icon": "globe"
            },
            {
                "sector": "funding",
                "title": "Startup Accelerator Program Applications Open",
                "description": "Applications are now open for the next cohort of the national startup accelerator program, offering funding and mentorship.",
                "url": "https://example.com/startup-accelerator",
                "published_at": datetime.now() - timedelta(hours=10),
                "platform": "facebook",
                "platform_icon": "facebook"
            }
        ]
        
        # Create news items
        created_count = 0
        for news_item in sample_news:
            # Generate URL hash for deduplication
            url_hash = hashlib.md5(news_item["url"].encode()).hexdigest()
            
            # Check if item already exists
            existing = db.query(IndustryNews).filter(IndustryNews.url_hash == url_hash).first()
            if not existing:
                news = IndustryNews(
                    sector=news_item["sector"],
                    title=news_item["title"],
                    description=news_item["description"],
                    url=news_item["url"],
                    url_hash=url_hash,
                    published_at=news_item["published_at"],
                    platform=news_item["platform"],
                    platform_icon=news_item["platform_icon"]
                )
                db.add(news)
                created_count += 1
        
        # Commit changes
        db.commit()
        
        return {
            "message": f"Successfully seeded {created_count} news items",
            "created_count": created_count,
            "total_count": db.query(IndustryNews).count()
        }
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding news database: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error seeding news database: {str(e)}"
        ) 

@router.get("/test-table")
def test_news_table(db: Session = Depends(get_db)):
    """
    Test if the news table exists and can be accessed.
    
    Args:
        db: Database session
    
    Returns:
        Table status information
    """
    try:
        from app.models.industry_news import IndustryNews
        
        # Try to query the table
        count = db.query(IndustryNews).count()
        
        return {
            "status": "success",
            "table_exists": True,
            "record_count": count,
            "message": f"News table is accessible with {count} records"
        }
        
    except Exception as e:
        logger.error(f"Error testing news table: {str(e)}")
        return {
            "status": "error",
            "table_exists": False,
            "error": str(e),
            "message": "News table is not accessible"
        } 

@router.get("/debug")
def debug_news_issue(db: Session = Depends(get_db)):
    """
    Debug endpoint to identify the specific database issue
    """
    try:
        # Test 1: Basic database connection
        logger.info("Testing basic database connection...")
        db.execute(text("SELECT 1"))
        logger.info("✅ Basic database connection successful")
        
        # Test 2: Check if table exists
        logger.info("Testing if industry_news table exists...")
        result = db.execute(text("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'industry_news'
            )
        """))
        table_exists = result.scalar()
        logger.info(f"✅ Table exists check: {table_exists}")
        
        # Test 3: Try to query the table directly
        if table_exists:
            logger.info("Testing direct table query...")
            result = db.execute(text("SELECT COUNT(*) FROM industry_news"))
            count = result.scalar()
            logger.info(f"✅ Direct query successful: {count} records")
        
        # Test 4: Try to import and use the model
        logger.info("Testing IndustryNews model import...")
        from app.models.industry_news import IndustryNews
        logger.info("✅ IndustryNews model imported successfully")
        
        # Test 5: Try to query using SQLAlchemy ORM
        logger.info("Testing SQLAlchemy ORM query...")
        news_count = db.query(IndustryNews).count()
        logger.info(f"✅ ORM query successful: {news_count} records")
        
        return {
            "status": "success",
            "table_exists": table_exists,
            "direct_query_count": count if table_exists else None,
            "orm_query_count": news_count,
            "message": "All tests passed successfully"
        }
        
    except Exception as e:
        logger.error(f"Debug test failed: {str(e)}")
        return {
            "status": "error",
            "error": str(e),
            "error_type": type(e).__name__,
            "message": "Debug test failed"
        } 