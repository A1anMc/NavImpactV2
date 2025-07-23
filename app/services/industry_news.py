import feedparser
import hashlib
from datetime import datetime, timezone
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc
import logging

from app.models.industry_news import IndustryNews
from app.schemas.industry_news import IndustryNewsCreate, IndustryNewsResponse

logger = logging.getLogger(__name__)

class IndustryNewsService:
    """Service for managing industry news from RSS feeds"""
    
    # RSS Feed sources organized by sector
    RSS_FEEDS = {
        "creative": [
            "https://feeds.feedburner.com/creative-australia",
            "https://www.artshub.com.au/feed/",
            "https://www.probonoaustralia.com.au/feed/",
        ],
        "health": [
            "https://www.health.gov.au/news/feed",
            "https://www.abc.net.au/news/feed/4590958/rss.xml",  # Health news
            "https://www.smh.com.au/rss/health.xml",
        ],
        "tech": [
            "https://www.zdnet.com/news/rss.xml",
            "https://feeds.feedburner.com/TechCrunch/",
            "https://www.abc.net.au/news/feed/4590958/rss.xml",  # Tech news
        ],
        "government": [
            "https://www.pm.gov.au/feed",
            "https://www.vic.gov.au/feed",
            "https://www.australia.gov.au/news/feed",
        ],
        "funding": [
            "https://www.grants.gov.au/feed",
            "https://www.business.gov.au/news/feed",
            "https://www.innovation.gov.au/feed",
        ]
    }
    
    # Keywords for relevance scoring by sector
    SECTOR_KEYWORDS = {
        "creative": [
            "arts", "culture", "creative", "film", "music", "theatre", "dance", 
            "visual arts", "literature", "design", "festival", "exhibition",
            "performance", "artist", "creative industry", "cultural"
        ],
        "health": [
            "health", "medical", "healthcare", "wellness", "mental health", 
            "public health", "hospital", "clinic", "pharmaceutical", "research",
            "treatment", "prevention", "disease", "medicine", "nursing"
        ],
        "tech": [
            "technology", "digital", "software", "startup", "innovation", 
            "artificial intelligence", "AI", "machine learning", "cybersecurity",
            "fintech", "edtech", "biotech", "blockchain", "cloud", "data"
        ],
        "government": [
            "government", "policy", "legislation", "regulation", "minister",
            "department", "public service", "budget", "funding", "initiative",
            "program", "scheme", "reform", "announcement"
        ],
        "funding": [
            "grant", "funding", "investment", "financial", "budget", "money",
            "support", "assistance", "program", "scheme", "initiative",
            "subsidy", "loan", "capital", "financing"
        ]
    }
    
    @staticmethod
    def calculate_relevance_score(title: str, summary: str, user_sectors: List[str]) -> float:
        """Calculate relevance score based on user sectors and content"""
        if not user_sectors:
            return 0.5  # Default score if no sectors specified
            
        content = f"{title} {summary}".lower()
        max_score = 0.0
        
        for sector in user_sectors:
            if sector in IndustryNewsService.SECTOR_KEYWORDS:
                keywords = IndustryNewsService.SECTOR_KEYWORDS[sector]
                score = sum(1 for keyword in keywords if keyword in content)
                max_score = max(max_score, score)
        
        # Normalize score (0.0 to 1.0)
        return min(max_score / 5.0, 1.0) if max_score > 0 else 0.1
    
    @staticmethod
    def generate_url_hash(url: str) -> str:
        """Generate hash for URL deduplication"""
        return hashlib.md5(url.encode()).hexdigest()
    
    @staticmethod
    def parse_rss_feed(feed_url: str, sector: str) -> List[Dict]:
        """Parse RSS feed and extract news items"""
        try:
            feed = feedparser.parse(feed_url)
            news_items = []
            
            for entry in feed.entries[:10]:  # Limit to 10 items per feed
                # Extract basic info
                title = getattr(entry, 'title', '')
                summary = getattr(entry, 'summary', '')
                url = getattr(entry, 'link', '')
                
                # Parse published date
                published_at = None
                if hasattr(entry, 'published_parsed') and entry.published_parsed:
                    published_at = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc)
                elif hasattr(entry, 'updated_parsed') and entry.updated_parsed:
                    published_at = datetime(*entry.updated_parsed[:6], tzinfo=timezone.utc)
                
                # Get source name
                source = getattr(feed.feed, 'title', 'Unknown')
                
                if title and url:
                    news_items.append({
                        'title': title,
                        'summary': summary,
                        'url': url,
                        'source': source,
                        'sector': sector,
                        'published_at': published_at
                    })
            
            return news_items
            
        except Exception as e:
            logger.error(f"Error parsing RSS feed {feed_url}: {str(e)}")
            return []
    
    @staticmethod
    def fetch_all_news() -> List[Dict]:
        """Fetch news from all RSS feeds"""
        all_news = []
        
        for sector, feeds in IndustryNewsService.RSS_FEEDS.items():
            for feed_url in feeds:
                news_items = IndustryNewsService.parse_rss_feed(feed_url, sector)
                all_news.extend(news_items)
        
        return all_news
    
    @staticmethod
    def save_news_to_db(db: Session, news_items: List[Dict]) -> int:
        """Save news items to database with deduplication"""
        saved_count = 0
        
        for item in news_items:
            # Generate URL hash for deduplication
            url_hash = IndustryNewsService.generate_url_hash(item['url'])
            
            # Check if news already exists
            existing = db.query(IndustryNews).filter(
                IndustryNews.url_hash == url_hash
            ).first()
            
            if not existing:
                # Create new news item
                news_data = IndustryNewsCreate(
                    title=item['title'],
                    summary=item['summary'],
                    url=item['url'],
                    url_hash=url_hash,
                    source=item['source'],
                    sector=item['sector'],
                    published_at=item['published_at']
                )
                
                db_news = IndustryNews(**news_data.dict())
                db.add(db_news)
                saved_count += 1
        
        try:
            db.commit()
            logger.info(f"Saved {saved_count} new news items to database")
        except Exception as e:
            db.rollback()
            logger.error(f"Error saving news to database: {str(e)}")
            saved_count = 0
        
        return saved_count
    
    @staticmethod
    def get_news_for_user(db: Session, user_sectors: List[str], limit: int = 20) -> List[IndustryNewsResponse]:
        """Get personalized news for user based on their sectors"""
        # Get news from user's sectors
        query = db.query(IndustryNews).filter(
            IndustryNews.sector.in_(user_sectors)
        ).order_by(desc(IndustryNews.published_at))
        
        news_items = query.limit(limit).all()
        
        # Calculate relevance scores
        scored_news = []
        for item in news_items:
            relevance_score = IndustryNewsService.calculate_relevance_score(
                item.title, item.summary, user_sectors
            )
            
            # Update relevance score in database
            item.relevance_score = relevance_score
            
            scored_news.append(IndustryNewsResponse(
                id=item.id,
                title=item.title,
                summary=item.summary,
                url=item.url,
                source=item.source,
                sector=item.sector,
                relevance_score=relevance_score,
                published_at=item.published_at,
                created_at=item.created_at
            ))
        
        # Sort by relevance score (highest first)
        scored_news.sort(key=lambda x: x.relevance_score, reverse=True)
        
        try:
            db.commit()
        except Exception as e:
            db.rollback()
            logger.error(f"Error updating relevance scores: {str(e)}")
        
        return scored_news
    
    @staticmethod
    def refresh_news_feed(db: Session) -> Dict:
        """Refresh news feed by fetching from RSS sources"""
        logger.info("Starting news feed refresh...")
        
        # Fetch news from all RSS feeds
        news_items = IndustryNewsService.fetch_all_news()
        
        # Save to database
        saved_count = IndustryNewsService.save_news_to_db(db, news_items)
        
        # Clean up old news (older than 30 days)
        cutoff_date = datetime.now(timezone.utc).replace(day=datetime.now().day - 30)
        deleted_count = db.query(IndustryNews).filter(
            IndustryNews.created_at < cutoff_date
        ).delete()
        
        try:
            db.commit()
            logger.info(f"Deleted {deleted_count} old news items")
        except Exception as e:
            db.rollback()
            logger.error(f"Error cleaning up old news: {str(e)}")
        
        return {
            "total_fetched": len(news_items),
            "saved": saved_count,
            "deleted_old": deleted_count
        } 