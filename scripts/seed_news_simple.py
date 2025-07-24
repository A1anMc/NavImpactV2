#!/usr/bin/env python3
"""
Simple script to seed the industry_news table with sample data
"""

import sys
import os
from datetime import datetime, timedelta
import hashlib

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'app'))

from app.db.session import get_session_local
from app.models.industry_news import IndustryNews

def generate_url_hash(url: str) -> str:
    """Generate MD5 hash of URL for deduplication"""
    return hashlib.md5(url.encode()).hexdigest()

def seed_news_data():
    """Seed the industry_news table with sample data"""
    
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
    
    try:
        # Get database session
        db = next(get_session_local())
        
        # Check if table exists and has data
        existing_count = db.query(IndustryNews).count()
        print(f"Current news items in database: {existing_count}")
        
        if existing_count > 0:
            print("Database already has news data. Skipping seed.")
            return
        
        # Add sample news items
        for item in sample_news:
            url_hash = generate_url_hash(item["url"])
            
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
                print(f"Added: {item['title']}")
        
        # Commit changes
        db.commit()
        print(f"Successfully seeded {len(sample_news)} news items")
        
    except Exception as e:
        print(f"Error seeding news data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Seeding industry news database...")
    seed_news_data()
    print("Done!") 