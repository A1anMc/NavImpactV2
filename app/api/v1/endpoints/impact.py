from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import logging

from app.core.deps import get_db
from app.models.grant import Grant
from app.models.project import Project
from app.models.metric import Metric
from app.models.user import User

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/")
async def get_impact_metrics(
    db: Session = Depends(get_db),
    timeframe: Optional[str] = "all"  # all, month, quarter, year
):
    """Get comprehensive impact metrics and analytics."""
    try:
        # Calculate time-based filters
        now = datetime.utcnow()
        if timeframe == "month":
            start_date = now - timedelta(days=30)
        elif timeframe == "quarter":
            start_date = now - timedelta(days=90)
        elif timeframe == "year":
            start_date = now - timedelta(days=365)
        else:
            start_date = None

        # Grant metrics
        grant_query = db.query(Grant)
        if start_date:
            grant_query = grant_query.filter(Grant.created_at >= start_date)
        
        total_grants = grant_query.count()
        active_grants = grant_query.filter(Grant.status == "open").count()
        closed_grants = grant_query.filter(Grant.status == "closed").count()
        
        # Funding metrics
        funding_stats = db.query(
            func.sum(Grant.max_amount).label('total_funding'),
            func.avg(Grant.max_amount).label('avg_grant_amount'),
            func.min(Grant.max_amount).label('min_grant_amount'),
            func.max(Grant.max_amount).label('max_grant_amount')
        ).filter(Grant.status == "open").first()
        
        # Industry distribution
        industry_distribution = db.query(
            Grant.industry_focus,
            func.count(Grant.id).label('count')
        ).filter(Grant.industry_focus.isnot(None)).group_by(Grant.industry_focus).all()
        
        # Location distribution
        location_distribution = db.query(
            Grant.location_eligibility,
            func.count(Grant.id).label('count')
        ).filter(Grant.location_eligibility.isnot(None)).group_by(Grant.location_eligibility).all()
        
        # Deadline urgency analysis
        urgent_deadlines = db.query(Grant).filter(
            and_(
                Grant.deadline.isnot(None),
                Grant.deadline <= now + timedelta(days=30),
                Grant.status == "open"
            )
        ).count()
        
        # Calculate impact score (composite metric)
        impact_score = calculate_impact_score(
            total_grants=total_grants,
            active_grants=active_grants,
            total_funding=funding_stats.total_funding or 0,
            urgent_deadlines=urgent_deadlines
        )
        
        return {
            "timeframe": timeframe,
            "metrics": {
                "total_grants": total_grants,
                "active_grants": active_grants,
                "closed_grants": closed_grants,
                "total_funding_available": float(funding_stats.total_funding or 0),
                "average_grant_amount": float(funding_stats.avg_grant_amount or 0),
                "min_grant_amount": float(funding_stats.min_grant_amount or 0),
                "max_grant_amount": float(funding_stats.max_grant_amount or 0),
                "urgent_deadlines": urgent_deadlines,
                "impact_score": impact_score
            },
            "distributions": {
                "by_industry": [
                    {"industry": item.industry_focus, "count": item.count}
                    for item in industry_distribution
                ],
                "by_location": [
                    {"location": item.location_eligibility, "count": item.count}
                    for item in location_distribution
                ]
            },
            "calculated_at": now.isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error calculating impact metrics: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to calculate impact metrics: {str(e)}")

@router.get("/dashboard")
async def get_impact_dashboard(
    db: Session = Depends(get_db)
):
    """Get comprehensive impact dashboard data with charts and trends."""
    try:
        now = datetime.utcnow()
        
        # Get basic metrics
        basic_metrics = await get_impact_metrics(db, "all")
        
        # Grant timeline analysis
        timeline_data = get_grant_timeline_data(db, now)
        
        # Success rate analysis (mock data for now)
        success_metrics = {
            "application_success_rate": 0.75,  # 75% success rate
            "total_applications": 24,
            "successful_applications": 18,
            "pending_applications": 4,
            "rejected_applications": 2
        }
        
        # Funding trends
        funding_trends = get_funding_trends(db, now)
        
        # Sector performance
        sector_performance = get_sector_performance(db)
        
        # Key insights
        insights = generate_impact_insights(basic_metrics, success_metrics, funding_trends)
        
        return {
            "metrics": basic_metrics["metrics"],
            "charts": {
                "timeline": timeline_data,
                "funding_trends": funding_trends,
                "sector_performance": sector_performance
            },
            "kpis": success_metrics,
            "trends": funding_trends,
            "insights": insights,
            "last_updated": now.isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error generating impact dashboard: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate dashboard: {str(e)}")

@router.get("/reports")
async def get_impact_reports(
    db: Session = Depends(get_db),
    report_type: Optional[str] = "summary"  # summary, detailed, sector, timeline
):
    """Get impact reports in various formats."""
    try:
        if report_type == "summary":
            return generate_summary_report(db)
        elif report_type == "detailed":
            return generate_detailed_report(db)
        elif report_type == "sector":
            return generate_sector_report(db)
        elif report_type == "timeline":
            return generate_timeline_report(db)
        else:
            raise HTTPException(status_code=400, detail="Invalid report type")
            
    except Exception as e:
        logger.error(f"Error generating impact report: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {str(e)}")

# Helper functions
def calculate_impact_score(total_grants: int, active_grants: int, total_funding: float, urgent_deadlines: int) -> float:
    """Calculate a composite impact score based on multiple factors."""
    # Base score from grant availability
    grant_score = min(total_grants * 10, 100)  # Max 100 points for grants
    
    # Activity score
    activity_score = min(active_grants * 15, 100)  # Max 100 points for active grants
    
    # Funding score (normalized to millions)
    funding_millions = total_funding / 1_000_000
    funding_score = min(funding_millions * 20, 100)  # Max 100 points for funding
    
    # Urgency score
    urgency_score = min(urgent_deadlines * 5, 50)  # Max 50 points for urgency
    
    # Weighted average
    total_score = (grant_score * 0.3 + activity_score * 0.3 + funding_score * 0.3 + urgency_score * 0.1)
    
    return round(total_score, 1)

def get_grant_timeline_data(db: Session, now: datetime) -> Dict[str, Any]:
    """Get grant timeline data for visualization."""
    # Get grants grouped by deadline periods
    this_week = db.query(Grant).filter(
        and_(
            Grant.deadline.isnot(None),
            Grant.deadline <= now + timedelta(days=7),
            Grant.status == "open"
        )
    ).count()
    
    this_month = db.query(Grant).filter(
        and_(
            Grant.deadline.isnot(None),
            Grant.deadline <= now + timedelta(days=30),
            Grant.status == "open"
        )
    ).count()
    
    this_quarter = db.query(Grant).filter(
        and_(
            Grant.deadline.isnot(None),
            Grant.deadline <= now + timedelta(days=90),
            Grant.status == "open"
        )
    ).count()
    
    return {
        "this_week": this_week,
        "this_month": this_month,
        "this_quarter": this_quarter,
        "total_open": db.query(Grant).filter(Grant.status == "open").count()
    }

def get_funding_trends(db: Session, now: datetime) -> List[Dict[str, Any]]:
    """Get funding trends over time."""
    # Mock trend data for now - would be real data in production
    return [
        {"period": "Jan", "total_funding": 2500000, "grants_count": 12},
        {"period": "Feb", "total_funding": 3200000, "grants_count": 15},
        {"period": "Mar", "total_funding": 2800000, "grants_count": 14},
        {"period": "Apr", "total_funding": 4500000, "grants_count": 18},
        {"period": "May", "total_funding": 3800000, "grants_count": 16},
        {"period": "Jun", "total_funding": 5200000, "grants_count": 20}
    ]

def get_sector_performance(db: Session) -> List[Dict[str, Any]]:
    """Get sector performance metrics."""
    sectors = db.query(
        Grant.industry_focus,
        func.count(Grant.id).label('grant_count'),
        func.sum(Grant.max_amount).label('total_funding')
    ).filter(
        and_(
            Grant.industry_focus.isnot(None),
            Grant.status == "open"
        )
    ).group_by(Grant.industry_focus).all()
    
    return [
        {
            "sector": sector.industry_focus,
            "grant_count": sector.grant_count,
            "total_funding": float(sector.total_funding or 0),
            "avg_funding": float((sector.total_funding or 0) / sector.grant_count) if sector.grant_count > 0 else 0
        }
        for sector in sectors
    ]

def generate_impact_insights(metrics: Dict, success_metrics: Dict, funding_trends: List) -> List[str]:
    """Generate actionable insights from the data."""
    insights = []
    
    if metrics["metrics"]["urgent_deadlines"] > 5:
        insights.append(f"⚠️ {metrics['metrics']['urgent_deadlines']} grants have deadlines within 30 days - prioritize applications")
    
    if metrics["metrics"]["total_funding_available"] > 5000000:
        insights.append(f"💰 ${metrics['metrics']['total_funding_available']:,.0f} in funding available across {metrics['metrics']['active_grants']} active grants")
    
    if success_metrics["application_success_rate"] > 0.7:
        insights.append(f"🎯 Strong application success rate of {success_metrics['application_success_rate']*100:.0f}% - maintain current strategy")
    
    if len(funding_trends) > 0:
        latest_trend = funding_trends[-1]
        insights.append(f"📈 Funding opportunities trending upward with {latest_trend['grants_count']} grants in {latest_trend['period']}")
    
    return insights

def generate_summary_report(db: Session) -> Dict[str, Any]:
    """Generate a summary impact report."""
    metrics = db.query(Grant).filter(Grant.status == "open").count()
    total_funding = db.query(func.sum(Grant.max_amount)).filter(Grant.status == "open").scalar() or 0
    
    return {
        "report_type": "summary",
        "generated_at": datetime.utcnow().isoformat(),
        "summary": {
            "total_active_grants": metrics,
            "total_funding_available": float(total_funding),
            "average_grant_amount": float(total_funding / metrics) if metrics > 0 else 0,
            "impact_score": calculate_impact_score(metrics, metrics, total_funding, 0)
        },
        "recommendations": [
            "Focus on high-value grants with upcoming deadlines",
            "Diversify applications across multiple sectors",
            "Monitor funding trends for optimal timing"
        ]
    }

def generate_detailed_report(db: Session) -> Dict[str, Any]:
    """Generate a detailed impact report."""
    return {
        "report_type": "detailed",
        "generated_at": datetime.utcnow().isoformat(),
        "detailed_analysis": {
            "grant_analysis": "Detailed breakdown of all grants",
            "funding_analysis": "Comprehensive funding analysis",
            "trend_analysis": "Historical trends and projections"
        }
    }

def generate_sector_report(db: Session) -> Dict[str, Any]:
    """Generate a sector-specific impact report."""
    return {
        "report_type": "sector",
        "generated_at": datetime.utcnow().isoformat(),
        "sector_analysis": get_sector_performance(db)
    }

def generate_timeline_report(db: Session) -> Dict[str, Any]:
    """Generate a timeline-based impact report."""
    now = datetime.utcnow()
    return {
        "report_type": "timeline",
        "generated_at": now.isoformat(),
        "timeline_analysis": get_grant_timeline_data(db, now)
    } 