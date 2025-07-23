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
    """Service for managing industry news from RSS feeds and social media"""
    
    # RSS Feed sources organized by sector
    RSS_FEEDS = {
        "creative": [
            "https://feeds.feedburner.com/creative-australia",
            "https://www.artshub.com.au/feed/",
            "https://www.probonoaustralia.com.au/feed/",
            # Social Media RSS Proxies (Twitter via Nitter)
            "https://nitter.net/creativeaus/rss",  # Creative Australia Twitter
            "https://nitter.net/artshub/rss",      # ArtsHub Twitter
            "https://nitter.net/screenaustralia/rss",  # Screen Australia Twitter
            "https://nitter.net/artsgovau/rss",    # Arts.gov.au Twitter
        ],
        "health": [
            "https://www.health.gov.au/news/feed",
            "https://www.abc.net.au/news/feed/4590958/rss.xml",  # Health news
            "https://www.smh.com.au/rss/health.xml",
            # Social Media RSS Proxies
            "https://nitter.net/healthgovau/rss",   # Health.gov.au Twitter
            "https://nitter.net/abcnews/rss",       # ABC News Twitter
            "https://nitter.net/health_innovation/rss",  # Health Innovation Twitter
            "https://nitter.net/medicalresearch/rss",  # Medical Research Twitter
        ],
        "tech": [
            "https://www.zdnet.com/news/rss.xml",
            "https://feeds.feedburner.com/TechCrunch/",
            "https://www.abc.net.au/news/feed/4590958/rss.xml",  # Tech news
            # Social Media RSS Proxies
            "https://nitter.net/zdnet/rss",         # ZDNet Twitter
            "https://nitter.net/techcrunch/rss",    # TechCrunch Twitter
            "https://nitter.net/startupaus/rss",    # Startup Australia Twitter
            "https://nitter.net/innovationgovau/rss",  # Innovation.gov.au Twitter
            "https://nitter.net/techau/rss",        # TechAU Twitter
        ],
        "government": [
            "https://www.pm.gov.au/feed",
            "https://www.vic.gov.au/feed",
            "https://www.australia.gov.au/news/feed",
            # Social Media RSS Proxies
            "https://nitter.net/ScottMorrisonMP/rss",  # PM Twitter
            "https://nitter.net/ausgov/rss",        # Australian Government Twitter
            "https://nitter.net/vicgovau/rss",      # Victorian Government Twitter
            "https://nitter.net/nswgov/rss",        # NSW Government Twitter
            "https://nitter.net/qldgov/rss",        # Queensland Government Twitter
        ],
        "funding": [
            "https://www.grants.gov.au/feed",
            "https://www.business.gov.au/news/feed",
            "https://www.innovation.gov.au/feed",
            # Social Media RSS Proxies
            "https://nitter.net/grantsgovau/rss",   # Grants.gov.au Twitter
            "https://nitter.net/businessgovau/rss", # Business.gov.au Twitter
            "https://nitter.net/innovationgovau/rss",  # Innovation.gov.au Twitter
            "https://nitter.net/socialtraders/rss", # Social Traders Twitter
            "https://nitter.net/foundationaus/rss", # Foundation Australia Twitter
            "https://nitter.net/impactinvest/rss",  # Impact Investment Twitter
        ]
    }
    
    # LinkedIn RSS Proxies (via RSS.app or similar services)
    LINKEDIN_RSS_FEEDS = {
        "creative": [
            "https://rss.app/feeds/v1.0/creative-australia-linkedin.xml",
            "https://rss.app/feeds/v1.0/screen-australia-linkedin.xml",
            "https://rss.app/feeds/v1.0/arts-culture-linkedin.xml",
        ],
        "health": [
            "https://rss.app/feeds/v1.0/health-innovation-linkedin.xml",
            "https://rss.app/feeds/v1.0/medical-research-linkedin.xml",
            "https://rss.app/feeds/v1.0/healthcare-australia-linkedin.xml",
        ],
        "tech": [
            "https://rss.app/feeds/v1.0/startup-australia-linkedin.xml",
            "https://rss.app/feeds/v1.0/tech-innovation-linkedin.xml",
            "https://rss.app/feeds/v1.0/ai-ml-linkedin.xml",
        ],
        "government": [
            "https://rss.app/feeds/v1.0/australian-government-linkedin.xml",
            "https://rss.app/feeds/v1.0/public-service-linkedin.xml",
            "https://rss.app/feeds/v1.0/policy-australia-linkedin.xml",
        ],
        "funding": [
            "https://rss.app/feeds/v1.0/grant-funding-linkedin.xml",
            "https://rss.app/feeds/v1.0/social-investment-linkedin.xml",
            "https://rss.app/feeds/v1.0/venture-capital-linkedin.xml",
        ]
    }
    
    # Facebook RSS Proxies (via RSS.app)
    FACEBOOK_RSS_FEEDS = {
        "creative": [
            "https://rss.app/feeds/v1.0/creative-australia-facebook.xml",
            "https://rss.app/feeds/v1.0/arts-culture-facebook.xml",
        ],
        "health": [
            "https://rss.app/feeds/v1.0/health-australia-facebook.xml",
            "https://rss.app/feeds/v1.0/medical-research-facebook.xml",
        ],
        "tech": [
            "https://rss.app/feeds/v1.0/startup-australia-facebook.xml",
            "https://rss.app/feeds/v1.0/tech-innovation-facebook.xml",
        ],
        "government": [
            "https://rss.app/feeds/v1.0/australian-government-facebook.xml",
            "https://rss.app/feeds/v1.0/public-service-facebook.xml",
        ],
        "funding": [
            "https://rss.app/feeds/v1.0/grant-funding-facebook.xml",
            "https://rss.app/feeds/v1.0/social-investment-facebook.xml",
        ]
    }
    
    # Keywords for relevance scoring by sector
    SECTOR_KEYWORDS = {
        "creative": [
            "arts", "culture", "creative", "film", "music", "theatre", "dance", 
            "visual arts", "literature", "design", "festival", "exhibition",
            "performance", "artist", "creative industry", "cultural", "screen",
            "media", "entertainment", "digital arts", "animation", "gaming"
        ],
        "health": [
            "health", "medical", "healthcare", "wellness", "mental health", 
            "public health", "hospital", "clinic", "pharmaceutical", "research",
            "treatment", "prevention", "disease", "medicine", "nursing",
            "biomedical", "telehealth", "digital health", "health innovation"
        ],
        "tech": [
            "technology", "digital", "software", "startup", "innovation", 
            "artificial intelligence", "AI", "machine learning", "cybersecurity",
            "fintech", "edtech", "biotech", "blockchain", "cloud", "data",
            "renewable energy", "clean tech", "sustainability", "IoT", "automation"
        ],
        "government": [
            "government", "policy", "legislation", "regulation", "minister",
            "department", "public service", "budget", "funding", "initiative",
            "program", "scheme", "reform", "announcement", "australia",
            "federal", "state", "local government", "public sector"
        ],
        "funding": [
            "grant", "funding", "investment", "financial", "budget", "money",
            "support", "assistance", "program", "scheme", "initiative",
            "subsidy", "loan", "capital", "financing", "award", "scholarship",
            "fellowship", "accelerator", "incubator", "venture capital"
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
    def identify_social_media_source(url: str, source: str) -> Dict[str, str]:
        """Identify social media platform and enhance source information"""
        social_media_info = {
            "platform": "website",
            "icon": "globe",
            "display_name": source
        }
        
        # Check for Twitter/X via Nitter
        if "nitter.net" in url:
            social_media_info.update({
                "platform": "twitter",
                "icon": "twitter",
                "display_name": f"Twitter - {source}"
            })
        # Check for LinkedIn
        elif "linkedin.com" in url or "LinkedIn" in source:
            social_media_info.update({
                "platform": "linkedin",
                "icon": "linkedin",
                "display_name": f"LinkedIn - {source.replace('LinkedIn - ', '')}"
            })
        # Check for Facebook
        elif "facebook.com" in url or "Facebook" in source:
            social_media_info.update({
                "platform": "facebook",
                "icon": "facebook",
                "display_name": f"Facebook - {source.replace('Facebook - ', '')}"
            })
        # Check for Instagram
        elif "instagram.com" in url:
            social_media_info.update({
                "platform": "instagram",
                "icon": "instagram",
                "display_name": f"Instagram - {source}"
            })
        
        return social_media_info

    @staticmethod
    def parse_rss_feed(feed_url: str, sector: str) -> List[Dict]:
        """Parse RSS feed and extract news items with social media identification"""
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
                
                # Identify social media platform
                social_info = IndustryNewsService.identify_social_media_source(url, source)
                
                if title and url:
                    news_items.append({
                        'title': title,
                        'summary': summary,
                        'url': url,
                        'source': social_info['display_name'],
                        'platform': social_info['platform'],
                        'platform_icon': social_info['icon'],
                        'sector': sector,
                        'published_at': published_at
                    })
            
            return news_items
            
        except Exception as e:
            logger.error(f"Error parsing RSS feed {feed_url}: {str(e)}")
            return []
    
    @staticmethod
    def fetch_all_news() -> List[Dict]:
        """Fetch news from all RSS feeds and social media sources"""
        all_news = []
        
        # Fetch from traditional RSS feeds
        for sector, feeds in IndustryNewsService.RSS_FEEDS.items():
            for feed_url in feeds:
                news_items = IndustryNewsService.parse_rss_feed(feed_url, sector)
                all_news.extend(news_items)
        
        # Fetch from LinkedIn RSS feeds
        for sector, feeds in IndustryNewsService.LINKEDIN_RSS_FEEDS.items():
            for feed_url in feeds:
                news_items = IndustryNewsService.parse_rss_feed(feed_url, sector)
                # Add LinkedIn source identifier
                for item in news_items:
                    if item.get('source'):
                        item['source'] = f"LinkedIn - {item['source']}"
                    else:
                        item['source'] = "LinkedIn"
                all_news.extend(news_items)
        
        # Fetch from Facebook RSS feeds
        for sector, feeds in IndustryNewsService.FACEBOOK_RSS_FEEDS.items():
            for feed_url in feeds:
                news_items = IndustryNewsService.parse_rss_feed(feed_url, sector)
                # Add Facebook source identifier
                for item in news_items:
                    if item.get('source'):
                        item['source'] = f"Facebook - {item['source']}"
                    else:
                        item['source'] = "Facebook"
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
                    platform=item.get('platform', 'website'),
                    platform_icon=item.get('platform_icon', 'globe'),
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