#!/usr/bin/env python3
"""
Seed script to populate the industry_news table with sample data
"""

import sys
import os
from datetime import datetime, timedelta
import hashlib

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.db.session import get_session_local
from app.models.industry_news import IndustryNews

def generate_url_hash(url):
    """Generate MD5 hash for URL deduplication"""
    return hashlib.md5(url.encode()).hexdigest()

def seed_news_data():
    """Seed the industry_news table with sample data"""
    
    # Sample news data
    sample_news = [
        {
            "sector": "creative",
            "title": "New Digital Arts Grant Program Launches",
            "summary": "The Australian government has announced a $50 million grant program to support digital arts and creative technology projects. This initiative aims to foster innovation in the creative sector and help artists adapt to digital platforms.",
            "url": "https://example.com/digital-arts-grant",
            "source": "Creative Australia",
            "relevance_score": 0.95,
            "published_at": datetime.now() - timedelta(hours=2)
        },
        {
            "sector": "health",
            "title": "Mental Health Innovation Fund Opens Applications",
            "summary": "Applications are now open for the $30 million Mental Health Innovation Fund. This program supports community-based mental health initiatives and digital health solutions for young people.",
            "url": "https://example.com/mental-health-fund",
            "source": "Department of Health",
            "relevance_score": 0.88,
            "published_at": datetime.now() - timedelta(hours=4)
        },
        {
            "sector": "tech",
            "title": "Startup Accelerator Program for Tech Entrepreneurs",
            "summary": "A new accelerator program is offering $100,000 in funding and mentorship for early-stage tech startups. The program focuses on AI, renewable energy, and digital health solutions.",
            "url": "https://example.com/startup-accelerator",
            "source": "Tech Startup Australia",
            "relevance_score": 0.92,
            "published_at": datetime.now() - timedelta(hours=6)
        },
        {
            "sector": "government",
            "title": "Regional Development Grants Announced",
            "summary": "The government has announced $200 million in regional development grants to support infrastructure projects and economic growth in rural and regional areas.",
            "url": "https://example.com/regional-grants",
            "source": "Department of Infrastructure",
            "relevance_score": 0.75,
            "published_at": datetime.now() - timedelta(hours=8)
        },
        {
            "sector": "funding",
            "title": "Social Enterprise Funding Round Opens",
            "summary": "Social Traders has opened applications for their latest funding round, offering up to $150,000 for social enterprises that create positive community impact.",
            "url": "https://example.com/social-enterprise-funding",
            "source": "Social Traders",
            "relevance_score": 0.85,
            "published_at": datetime.now() - timedelta(hours=10)
        },
        {
            "sector": "creative",
            "title": "Indigenous Arts and Culture Grant Program",
            "summary": "A new grant program specifically for Indigenous artists and cultural organizations has been launched, with $25 million available for projects that preserve and promote Indigenous culture.",
            "url": "https://example.com/indigenous-arts-grant",
            "source": "Indigenous Arts Australia",
            "relevance_score": 0.90,
            "published_at": datetime.now() - timedelta(hours=12)
        },
        {
            "sector": "health",
            "title": "Digital Health Innovation Challenge",
            "summary": "The Digital Health Innovation Challenge is seeking proposals for technology solutions that improve healthcare delivery and patient outcomes. Winners receive up to $500,000 in funding.",
            "url": "https://example.com/digital-health-challenge",
            "source": "Digital Health Australia",
            "relevance_score": 0.87,
            "published_at": datetime.now() - timedelta(hours=14)
        },
        {
            "sector": "tech",
            "title": "Clean Energy Technology Grants",
            "summary": "The Clean Energy Technology Grants program is offering $75 million in funding for innovative renewable energy projects and clean technology solutions.",
            "url": "https://example.com/clean-energy-grants",
            "source": "Clean Energy Australia",
            "relevance_score": 0.93,
            "published_at": datetime.now() - timedelta(hours=16)
        },
        {
            "sector": "government",
            "title": "Small Business Innovation Fund",
            "summary": "A new $100 million fund has been established to support small business innovation and help SMEs develop new products and services.",
            "url": "https://example.com/small-business-innovation",
            "source": "Department of Industry",
            "relevance_score": 0.78,
            "published_at": datetime.now() - timedelta(hours=18)
        },
        {
            "sector": "funding",
            "title": "Women in Business Grant Program",
            "summary": "The Women in Business Grant Program is offering $50,000 grants to support female entrepreneurs and help close the gender gap in business ownership.",
            "url": "https://example.com/women-business-grants",
            "source": "Women in Business Australia",
            "relevance_score": 0.82,
            "published_at": datetime.now() - timedelta(hours=20)
        }
    ]
    
    SessionLocal = get_session_local()
    db = SessionLocal()
    try:
        # Clear existing data
        db.query(IndustryNews).delete()
        db.commit()
        
        # Insert sample data
        for news_item in sample_news:
            news = IndustryNews(
                sector=news_item["sector"],
                title=news_item["title"],
                summary=news_item["summary"],
                url=news_item["url"],
                url_hash=generate_url_hash(news_item["url"]),
                source=news_item["source"],
                relevance_score=news_item["relevance_score"],
                published_at=news_item["published_at"]
            )
            db.add(news)
        
        db.commit()
        print(f"✅ Successfully seeded {len(sample_news)} news items")
        
    except Exception as e:
        print(f"❌ Error seeding news data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_news_data() 