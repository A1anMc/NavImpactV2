"""Seeding endpoints for populating database with sample data."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core import deps
from app.models.industry_news import IndustryNews
import hashlib
from datetime import datetime, timedelta, timezone
from typing import List, Dict

router = APIRouter()

def generate_url_hash(url: str) -> str:
    """Generate a unique hash for the URL"""
    return hashlib.md5(url.encode()).hexdigest()

def get_sample_news_data() -> List[Dict]:
    """Generate sample news data across different sectors"""
    
    # Base date for generating realistic timestamps
    base_date = datetime.now(timezone.utc)
    
    news_data = [
        # TECHNOLOGY SECTOR
        {
            "sector": "technology",
            "title": "Australian Government Announces $50M AI Innovation Fund",
            "summary": "New funding initiative to support AI startups and research institutions across Australia, focusing on ethical AI development and commercialisation.",
            "url": "https://www.innovation.gov.au/news/ai-innovation-fund-2025",
            "source": "Department of Industry, Science and Resources",
            "platform": "website",
            "platform_icon": "globe",
            "relevance_score": 0.95,
            "published_at": base_date - timedelta(days=2)
        },
        {
            "sector": "technology",
            "title": "Sydney Tech Hub Receives Major Funding Boost",
            "summary": "NSW Government invests $25M in expanding Sydney's tech ecosystem, with new co-working spaces and mentorship programs for startups.",
            "url": "https://twitter.com/nswgov/status/1234567890",
            "source": "NSW Government",
            "platform": "twitter",
            "platform_icon": "twitter",
            "relevance_score": 0.82,
            "published_at": base_date - timedelta(days=5)
        },
        {
            "sector": "technology",
            "title": "Quantum Computing Research Grant Opens Applications",
            "summary": "Australian Research Council announces $15M funding round for quantum computing research projects, deadline March 2025.",
            "url": "https://www.arc.gov.au/funding/quantum-computing-grants",
            "source": "Australian Research Council",
            "platform": "website",
            "platform_icon": "globe",
            "relevance_score": 0.88,
            "published_at": base_date - timedelta(days=1)
        },
        
        # CREATIVE ARTS SECTOR
        {
            "sector": "creative-arts",
            "title": "Screen Australia Opens Documentary Development Fund",
            "summary": "New $12M fund supporting Australian documentary filmmakers, with focus on diverse voices and innovative storytelling approaches.",
            "url": "https://www.screenaustralia.gov.au/funding/documentary-development",
            "source": "Screen Australia",
            "platform": "website",
            "platform_icon": "globe",
            "relevance_score": 0.93,
            "published_at": base_date - timedelta(days=3)
        },
        {
            "sector": "creative-arts",
            "title": "Creative Australia Announces Regional Arts Funding",
            "summary": "Multi-year $30M investment in regional creative communities, supporting local artists and cultural infrastructure development.",
            "url": "https://www.linkedin.com/posts/creative-australia-funding-update",
            "source": "Creative Australia",
            "platform": "linkedin",
            "platform_icon": "linkedin",
            "relevance_score": 0.87,
            "published_at": base_date - timedelta(days=7)
        },
        {
            "sector": "creative-arts",
            "title": "Indigenous Storytelling Grant Program Expanded",
            "summary": "Additional $8M allocated to support Indigenous creators in film, digital media, and interactive storytelling projects.",
            "url": "https://www.facebook.com/ScreenAustralia/posts/indigenous-storytelling-grants",
            "source": "Screen Australia",
            "platform": "facebook",
            "platform_icon": "facebook",
            "relevance_score": 0.91,
            "published_at": base_date - timedelta(days=4)
        },
        
        # HEALTH SECTOR
        {
            "sector": "health",
            "title": "Medical Research Future Fund Opens New Applications",
            "summary": "MRFF announces $100M funding round for health innovation projects, including digital health and AI-assisted diagnostics.",
            "url": "https://www.health.gov.au/mrff/funding-opportunities",
            "source": "Department of Health and Aged Care",
            "platform": "website",
            "platform_icon": "globe",
            "relevance_score": 0.94,
            "published_at": base_date - timedelta(days=1)
        },
        {
            "sector": "health",
            "title": "Mental Health Innovation Challenge Launched",
            "summary": "Cross-sector initiative offering $20M for innovative mental health solutions, targeting youth and rural communities.",
            "url": "https://twitter.com/healthgov/status/mental-health-innovation",
            "source": "Mental Health Commission",
            "platform": "twitter",
            "platform_icon": "twitter",
            "relevance_score": 0.89,
            "published_at": base_date - timedelta(days=6)
        },
        
        # ENVIRONMENT SECTOR
        {
            "sector": "environment",
            "title": "Clean Energy Innovation Fund Second Round Opens",
            "summary": "CEIF announces $75M for clean energy startups and renewable technology projects, with fast-track assessment process.",
            "url": "https://www.cleanenergyregulator.gov.au/ceif-round-2",
            "source": "Clean Energy Regulator",
            "platform": "website",
            "platform_icon": "globe",
            "relevance_score": 0.92,
            "published_at": base_date - timedelta(days=3)
        },
        {
            "sector": "environment",
            "title": "Biodiversity Conservation Grants Now Available",
            "summary": "Environment Department launches $40M program supporting ecosystem restoration and endangered species protection projects.",
            "url": "https://www.linkedin.com/posts/environment-gov-au-biodiversity-grants",
            "source": "Department of Climate Change, Energy, Environment and Water",
            "platform": "linkedin",
            "platform_icon": "linkedin",
            "relevance_score": 0.86,
            "published_at": base_date - timedelta(days=8)
        },
        
        # EDUCATION SECTOR
        {
            "sector": "education",
            "title": "EdTech Innovation Grants Open for Applications",
            "summary": "Education Department offers $35M for educational technology solutions, focusing on accessibility and remote learning.",
            "url": "https://www.education.gov.au/edtech-innovation-grants",
            "source": "Department of Education",
            "platform": "website",
            "platform_icon": "globe",
            "relevance_score": 0.83,
            "published_at": base_date - timedelta(days=5)
        },
        {
            "sector": "education",
            "title": "University Research Commercialisation Fund Expanded",
            "summary": "Additional $60M allocated to help universities commercialise research discoveries and create industry partnerships.",
            "url": "https://twitter.com/education_gov/status/university-research-funding",
            "source": "Department of Education",
            "platform": "twitter",
            "platform_icon": "twitter",
            "relevance_score": 0.88,
            "published_at": base_date - timedelta(days=4)
        },
        
        # AGRICULTURE SECTOR
        {
            "sector": "agriculture",
            "title": "AgTech Development Program Launches Third Round",
            "summary": "DAFF announces $28M for agricultural technology innovations, including precision farming and sustainable practices.",
            "url": "https://www.agriculture.gov.au/agtech-development-program",
            "source": "Department of Agriculture, Fisheries and Forestry",
            "platform": "website",
            "platform_icon": "globe",
            "relevance_score": 0.85,
            "published_at": base_date - timedelta(days=2)
        },
        
        # MANUFACTURING SECTOR
        {
            "sector": "manufacturing",
            "title": "Modern Manufacturing Initiative Opens New Stream",
            "summary": "Industry Department launches $90M funding for advanced manufacturing projects, focusing on Industry 4.0 technologies.",
            "url": "https://www.industry.gov.au/modern-manufacturing-initiative",
            "source": "Department of Industry, Science and Resources",
            "platform": "website",
            "platform_icon": "globe",
            "relevance_score": 0.90,
            "published_at": base_date - timedelta(days=1)
        },
        
        # SOCIAL SERVICES SECTOR
        {
            "sector": "social-services",
            "title": "Community Development Grants Program Expanded",
            "summary": "DSS increases funding to $45M for community-led initiatives addressing social inclusion and disadvantage.",
            "url": "https://www.dss.gov.au/community-development-grants",
            "source": "Department of Social Services",
            "platform": "website",
            "platform_icon": "globe",
            "relevance_score": 0.81,
            "published_at": base_date - timedelta(days=6)
        }
    ]
    
    # Generate URL hashes for all entries
    for item in news_data:
        item["url_hash"] = generate_url_hash(item["url"])
    
    return news_data

@router.post("/news")
async def seed_news_database(
    clear_existing: bool = False,
    db: Session = Depends(deps.get_db)
):
    """Seed the news database with sample data."""
    try:
        # Check existing data
        existing_count = db.query(IndustryNews).count()
        
        if existing_count > 0 and not clear_existing:
            return {
                "status": "error",
                "message": f"Database already contains {existing_count} news items. Use clear_existing=true to override.",
                "existing_count": existing_count
            }
        
        # Clear existing data if requested
        if clear_existing and existing_count > 0:
            deleted = db.query(IndustryNews).delete()
            db.commit()
        
        # Get sample data
        news_data = get_sample_news_data()
        
        # Insert news items
        created_count = 0
        for item in news_data:
            try:
                news_item = IndustryNews(**item)
                db.add(news_item)
                created_count += 1
            except Exception as e:
                print(f"Failed to add item: {str(e)}")
                continue
        
        # Commit changes
        db.commit()
        
        # Get final stats
        final_count = db.query(IndustryNews).count()
        sectors = db.query(IndustryNews.sector).distinct().all()
        sector_counts = {}
        for (sector,) in sectors:
            count = db.query(IndustryNews).filter(IndustryNews.sector == sector).count()
            sector_counts[sector] = count
        
        return {
            "status": "success",
            "message": f"Successfully seeded {created_count} news items",
            "created_count": created_count,
            "total_count": final_count,
            "sectors": sector_counts,
            "cleared_existing": existing_count if clear_existing else 0
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to seed database: {str(e)}")

@router.delete("/news")
async def clear_news_database(db: Session = Depends(deps.get_db)):
    """Clear all news data from the database."""
    try:
        deleted_count = db.query(IndustryNews).count()
        db.query(IndustryNews).delete()
        db.commit()
        
        return {
            "status": "success",
            "message": f"Cleared {deleted_count} news items from database",
            "deleted_count": deleted_count
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to clear database: {str(e)}")

@router.get("/status")
async def get_database_status(db: Session = Depends(deps.get_db)):
    """Get current database seeding status."""
    try:
        news_count = db.query(IndustryNews).count()
        
        sectors = {}
        if news_count > 0:
            sector_data = db.query(IndustryNews.sector).distinct().all()
            for (sector,) in sector_data:
                count = db.query(IndustryNews).filter(IndustryNews.sector == sector).count()
                sectors[sector] = count
        
        return {
            "status": "success",
            "news_count": news_count,
            "sectors": sectors,
            "database_ready": news_count > 0
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get status: {str(e)}") 