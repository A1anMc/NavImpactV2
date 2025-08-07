import json
import logging
from datetime import datetime, timedelta
from decimal import Decimal
from typing import List, Optional

from app.core.deps import get_current_user, get_db
from app.models.grant import Grant
from app.models.user import User
from app.schemas.grant import (
    AIRecommendationRequest,
    AIRecommendationResponse,
    EnhancedGrantResponse,
    GrantAnalytics,
    GrantApplication,
    GrantApplicationCreate,
    GrantCreate,
    GrantDashboard,
    GrantExportRequest,
    GrantExportResponse,
    GrantFilters,
    GrantList,
    GrantMetrics,
    GrantNote,
    GrantNoteCreate,
    GrantRecommendation,
    GrantResponse,
    GrantUpdate,
    SavedSearch,
    SavedSearchCreate,
    SmartSearchRequest,
    SmartSearchResponse,
)
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query
from sqlalchemy import and_, desc, func, or_
from sqlalchemy.orm import Session

router = APIRouter()
logger = logging.getLogger(__name__)

# Industry focus options
INDUSTRY_FOCUS_OPTIONS = [
    "technology",
    "healthcare",
    "education",
    "environment",
    "sustainability",
    "agriculture",
    "manufacturing",
    "services",
    "research",
    "cultural heritage",
    "energy",
    "community",
    "other",
]

# Location eligibility options
LOCATION_ELIGIBILITY_OPTIONS = [
    "national",
    "state",
    "regional",
    "local",
    "international",
    "victoria",
]

# Organization type options
ORG_TYPE_OPTIONS = [
    "startup",
    "sme",
    "enterprise",
    "nonprofit",
    "government",
    "academic",
    "indigenous organisation",
    "social enterprise",
    "community group",
    "any",
]


# Existing endpoints
@router.get("/", response_model=GrantList)
def get_grants(
    skip: int = 0,
    limit: int = 100,
    source: Optional[str] = None,
    industry_focus: Optional[str] = Query(None, enum=INDUSTRY_FOCUS_OPTIONS),
    location: Optional[str] = Query(None, enum=LOCATION_ELIGIBILITY_OPTIONS),
    org_type: Optional[str] = Query(None, enum=ORG_TYPE_OPTIONS),
    status: Optional[str] = Query(
        None, enum=["open", "closed", "draft", "active", "closing_soon"]
    ),
):
    """Get list of grants with optional filtering."""
    try:
        from app.db.session import get_engine
        from app.models.grant import Grant
        from sqlalchemy import and_, or_
        from sqlalchemy.orm import sessionmaker

        engine = get_engine()
        SessionLocal = sessionmaker(bind=engine)
        db = SessionLocal()

        try:
            query = db.query(Grant)

            if source:
                query = query.filter(Grant.source == source)

            if industry_focus:
                query = query.filter(Grant.industry_focus == industry_focus)

            if location:
                query = query.filter(Grant.location_eligibility == location)

            if org_type:
                query = query.filter(Grant.org_type_eligible.contains([org_type]))

            if status:
                query = query.filter(Grant.status == status)

            total = query.count()
            grants = query.offset(skip).limit(limit).all()

            grant_items = []
            for grant in grants:
                grant_items.append(
                    GrantResponse(
                        id=grant.id,
                        title=grant.title,
                        description=grant.description or "",
                        min_amount=int(grant.min_amount) if grant.min_amount else None,
                        max_amount=int(grant.max_amount) if grant.max_amount else None,
                        deadline=grant.deadline,
                        source=grant.source,
                        industry_focus=grant.industry_focus,
                        location_eligibility=grant.location_eligibility,
                        status=grant.status,
                        created_at=grant.created_at,
                        updated_at=grant.updated_at,
                    )
                )

            return GrantList(
                items=grant_items,
                total=total,
                page=skip // limit + 1,
                size=limit,
                has_next=skip + limit < total,
                has_prev=skip > 0,
            )

        finally:
            db.close()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching grants: {str(e)}")


@router.get("/{grant_id}", response_model=GrantResponse)
def get_grant(grant_id: int, db: Session = Depends(get_db)):
    """Get a specific grant by ID."""
    try:
        from app.db.session import get_engine
        from app.models.grant import Grant
        from sqlalchemy.orm import sessionmaker

        engine = get_engine()
        SessionLocal = sessionmaker(bind=engine)
        db = SessionLocal()

        grant = db.query(Grant).filter(Grant.id == grant_id).first()

        if not grant:
            raise HTTPException(status_code=404, detail="Grant not found")

        return {
            "id": grant.id,
            "title": grant.title,
            "description": grant.description,
            "source": grant.source,
            "source_url": grant.source_url,
            "application_url": grant.application_url,
            "contact_email": grant.contact_email,
            "min_amount": float(grant.min_amount) if grant.min_amount else None,
            "max_amount": float(grant.max_amount) if grant.max_amount else None,
            "open_date": grant.open_date.isoformat() if grant.open_date else None,
            "deadline": grant.deadline.isoformat() if grant.deadline else None,
            "industry_focus": grant.industry_focus,
            "location_eligibility": grant.location_eligibility,
            "org_type_eligible": grant.org_type_eligible,
            "status": grant.status,
            "created_at": grant.created_at.isoformat() if grant.created_at else None,
            "updated_at": grant.updated_at.isoformat() if grant.updated_at else None,
        }

    except Exception as e:
        logger.error(f"Error getting grant {grant_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
    finally:
        db.close()


@router.post("/", response_model=GrantResponse)
def create_grant(grant_data: GrantCreate, db: Session = Depends(get_db)):
    """Create a new grant."""
    try:
        from datetime import datetime

        from app.db.session import get_engine
        from app.models.grant import Grant
        from sqlalchemy.orm import sessionmaker

        engine = get_engine()
        SessionLocal = sessionmaker(bind=engine)
        db = SessionLocal()

        # Create new grant
        new_grant = Grant(
            title=grant_data.title,
            description=grant_data.description,
            source=grant_data.source,
            source_url=grant_data.source_url,
            application_url=grant_data.application_url,
            contact_email=grant_data.contact_email,
            min_amount=(
                Decimal(str(grant_data.min_amount)) if grant_data.min_amount else None
            ),
            max_amount=(
                Decimal(str(grant_data.max_amount)) if grant_data.max_amount else None
            ),
            open_date=(
                datetime.fromisoformat(grant_data.open_date)
                if grant_data.open_date
                else None
            ),
            deadline=(
                datetime.fromisoformat(grant_data.deadline)
                if grant_data.deadline
                else None
            ),
            industry_focus=grant_data.industry_focus,
            location_eligibility=grant_data.location_eligibility,
            org_type_eligible=grant_data.org_type_eligible,
            status=grant_data.status or "active",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        db.add(new_grant)
        db.commit()
        db.refresh(new_grant)

        return {
            "id": new_grant.id,
            "title": new_grant.title,
            "description": new_grant.description,
            "source": new_grant.source,
            "source_url": new_grant.source_url,
            "application_url": new_grant.application_url,
            "contact_email": new_grant.contact_email,
            "min_amount": float(new_grant.min_amount) if new_grant.min_amount else None,
            "max_amount": float(new_grant.max_amount) if new_grant.max_amount else None,
            "open_date": (
                new_grant.open_date.isoformat() if new_grant.open_date else None
            ),
            "deadline": new_grant.deadline.isoformat() if new_grant.deadline else None,
            "industry_focus": new_grant.industry_focus,
            "location_eligibility": new_grant.location_eligibility,
            "org_type_eligible": new_grant.org_type_eligible,
            "status": new_grant.status,
            "created_at": (
                new_grant.created_at.isoformat() if new_grant.created_at else None
            ),
            "updated_at": (
                new_grant.updated_at.isoformat() if new_grant.updated_at else None
            ),
        }

    except Exception as e:
        logger.error(f"Error creating grant: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
    finally:
        db.close()


# New AI-Powered Endpoints


@router.post("/ai/recommendations", response_model=AIRecommendationResponse)
async def get_ai_recommendations(
    request: AIRecommendationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get AI-powered grant recommendations based on user profile and preferences."""
    try:
        # Mock AI recommendation logic (replace with actual AI service)
        recommendations = []

        # Get grants that match the criteria
        query = db.query(Grant).filter(Grant.status == "open")

        if request.industry_focus:
            query = query.filter(Grant.industry_focus == request.industry_focus)

        if request.location:
            query = query.filter(
                Grant.location_eligibility.contains([request.location])
            )

        if request.org_type:
            query = query.filter(Grant.org_type_eligible.contains([request.org_type]))

        if request.budget_range:
            min_budget = request.budget_range.get("min")
            max_budget = request.budget_range.get("max")
            if min_budget:
                query = query.filter(Grant.max_amount >= min_budget)
            if max_budget:
                query = query.filter(Grant.min_amount <= max_budget)

        matching_grants = query.limit(request.max_results).all()

        for grant in matching_grants:
            # Calculate match score based on various factors
            match_score = calculate_match_score(grant, request)

            if match_score >= 70:  # Only recommend grants with 70%+ match
                reasons = generate_match_reasons(grant, request)
                priority = determine_priority(match_score, grant)

                recommendation = GrantRecommendation(
                    grant=GrantResponse.from_orm(grant),
                    reasons=reasons,
                    match_score=match_score,
                    priority=priority,
                    success_probability=estimate_success_probability(grant),
                    estimated_effort="Medium",
                    key_requirements=extract_key_requirements(grant),
                )
                recommendations.append(recommendation)

        # Sort by match score
        recommendations.sort(key=lambda x: x.match_score, reverse=True)

        return AIRecommendationResponse(
            recommendations=recommendations,
            total_matches=len(recommendations),
            confidence_score=0.85,
            reasoning="Based on your profile, project focus, and historical success patterns",
        )

    except Exception as e:
        logger.error(f"Error generating AI recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail="Error generating recommendations")


@router.post("/smart-search", response_model=SmartSearchResponse)
async def smart_search(
    request: SmartSearchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Perform smart search with natural language processing and AI insights."""
    try:
        # Parse natural language query
        parsed_query = parse_natural_language_query(request.query)

        # Build search query
        query = db.query(Grant).filter(Grant.status.in_(["open", "closing_soon"]))

        # Apply parsed filters
        if parsed_query.get("keywords"):
            keywords = parsed_query["keywords"]
            search_conditions = []
            for keyword in keywords:
                search_conditions.append(
                    or_(
                        Grant.title.ilike(f"%{keyword}%"),
                        Grant.description.ilike(f"%{keyword}%"),
                        Grant.funding_purpose.contains([keyword]),
                    )
                )
            query = query.filter(or_(*search_conditions))

        if parsed_query.get("industry"):
            query = query.filter(Grant.industry_focus == parsed_query["industry"])

        if parsed_query.get("location"):
            query = query.filter(
                Grant.location_eligibility.contains([parsed_query["location"]])
            )

        if parsed_query.get("amount_range"):
            min_amount = parsed_query["amount_range"].get("min")
            max_amount = parsed_query["amount_range"].get("max")
            if min_amount:
                query = query.filter(Grant.max_amount >= min_amount)
            if max_amount:
                query = query.filter(Grant.min_amount <= max_amount)

        # Apply additional filters if provided
        if request.filters:
            if request.filters.industry_focus:
                query = query.filter(
                    Grant.industry_focus == request.filters.industry_focus
                )
            if request.filters.status:
                query = query.filter(Grant.status == request.filters.status)
            if request.filters.relevance_score_min:
                # This would require relevance scoring to be implemented
                pass

        total = query.count()
        grants = query.limit(request.max_results).all()

        # Convert to enhanced response format
        enhanced_grants = []
        for grant in grants:
            enhanced_grant = EnhancedGrantResponse.from_orm(grant)
            enhanced_grant.relevance_score = calculate_relevance_score(
                grant, request.query
            )
            enhanced_grant.success_probability = estimate_success_probability(grant)
            enhanced_grant.tags = extract_tags_from_grant(grant)
            enhanced_grants.append(enhanced_grant)

        # Generate AI insights
        ai_insights = None
        if request.include_ai_insights:
            ai_insights = generate_ai_insights(enhanced_grants, request.query)

        return SmartSearchResponse(
            grants=enhanced_grants,
            total_results=total,
            search_suggestions=generate_search_suggestions(request.query),
            ai_insights=ai_insights,
            related_searches=generate_related_searches(request.query),
        )

    except Exception as e:
        logger.error(f"Error performing smart search: {str(e)}")
        raise HTTPException(status_code=500, detail="Error performing search")


@router.get("/analytics", response_model=GrantAnalytics)
async def get_grant_analytics(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Get comprehensive grant analytics and insights."""
    try:
        # Get basic counts
        total_grants = db.query(Grant).count()
        open_grants = db.query(Grant).filter(Grant.status == "open").count()

        # Calculate closing soon (deadline within 30 days)
        thirty_days_from_now = datetime.now() + timedelta(days=30)
        closing_soon = (
            db.query(Grant)
            .filter(
                and_(Grant.status == "open", Grant.deadline <= thirty_days_from_now)
            )
            .count()
        )

        # Calculate funding totals
        funding_query = db.query(
            func.sum(Grant.max_amount).label("total_funding"),
            func.avg(Grant.max_amount).label("average_amount"),
        ).filter(Grant.status == "open")

        funding_result = funding_query.first()
        total_funding = funding_result.total_funding or Decimal("0")
        average_amount = funding_result.average_amount or Decimal("0")

        # Get top industries
        industry_stats = (
            db.query(Grant.industry_focus, func.count(Grant.id).label("count"))
            .filter(Grant.industry_focus.isnot(None))
            .group_by(Grant.industry_focus)
            .order_by(desc("count"))
            .limit(5)
            .all()
        )

        top_industries = [
            {"industry": stat.industry_focus, "count": stat.count}
            for stat in industry_stats
        ]

        # Generate funding trends (mock data for now)
        funding_trends = [
            {"month": "Jan", "amount": 3200000},
            {"month": "Feb", "amount": 3800000},
            {"month": "Mar", "amount": 4200000},
            {"month": "Apr", "amount": 4500000},
        ]

        # Get upcoming deadlines
        upcoming_deadlines = (
            db.query(Grant)
            .filter(
                and_(
                    Grant.status.in_(["open", "closing_soon"]),
                    Grant.deadline >= datetime.now(),
                )
            )
            .order_by(Grant.deadline)
            .limit(5)
            .all()
        )

        # Calculate success rate (mock data)
        success_rate = 68.0

        # Generate sector and location breakdowns
        sector_breakdown = {}
        location_breakdown = {}

        for grant in db.query(Grant).filter(Grant.status == "open").all():
            if grant.industry_focus:
                sector_breakdown[grant.industry_focus] = (
                    sector_breakdown.get(grant.industry_focus, 0) + 1
                )
            if grant.location_eligibility:
                location_breakdown[grant.location_eligibility] = (
                    location_breakdown.get(grant.location_eligibility, 0) + 1
                )

        return GrantAnalytics(
            total_grants=total_grants,
            open_grants=open_grants,
            closing_soon=closing_soon,
            total_funding=total_funding,
            average_amount=average_amount,
            success_rate=success_rate,
            top_industries=top_industries,
            funding_trends=funding_trends,
            upcoming_deadlines=[
                GrantResponse.from_orm(grant) for grant in upcoming_deadlines
            ],
            sector_breakdown=sector_breakdown,
            location_breakdown=location_breakdown,
        )

    except Exception as e:
        logger.error(f"Error generating analytics: {str(e)}")
        raise HTTPException(status_code=500, detail="Error generating analytics")


@router.get("/dashboard", response_model=GrantDashboard)
async def get_grant_dashboard(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Get comprehensive grant dashboard with overview, recommendations, and recent activity."""
    try:
        # Get overview analytics
        analytics = await get_grant_analytics(db, current_user)

        # Get AI recommendations
        recommendation_request = AIRecommendationRequest(
            user_id=current_user.id, max_results=5
        )
        recommendations_response = await get_ai_recommendations(
            recommendation_request, db, current_user
        )

        # Mock recent applications (would come from actual application tracking)
        recent_applications = []

        # Get upcoming deadlines
        upcoming_deadlines = (
            db.query(Grant)
            .filter(
                and_(
                    Grant.status.in_(["open", "closing_soon"]),
                    Grant.deadline >= datetime.now(),
                )
            )
            .order_by(Grant.deadline)
            .limit(5)
            .all()
        )

        # Mock saved searches and alerts
        saved_searches = []
        alerts = []

        return GrantDashboard(
            overview=analytics,
            recommendations=recommendations_response.recommendations,
            recent_applications=recent_applications,
            upcoming_deadlines=[
                GrantResponse.from_orm(grant) for grant in upcoming_deadlines
            ],
            saved_searches=saved_searches,
            alerts=alerts,
        )

    except Exception as e:
        logger.error(f"Error generating dashboard: {str(e)}")
        raise HTTPException(status_code=500, detail="Error generating dashboard")


@router.post("/export", response_model=GrantExportResponse)
async def export_grants(
    request: GrantExportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Export grants with optional analytics and recommendations."""
    try:
        # Build query based on filters
        query = db.query(Grant)

        if request.filters:
            if request.filters.search:
                search_term = f"%{request.filters.search}%"
                query = query.filter(
                    or_(
                        Grant.title.ilike(search_term),
                        Grant.description.ilike(search_term),
                    )
                )
            if request.filters.status:
                query = query.filter(Grant.status == request.filters.status)
            if request.filters.industry_focus:
                query = query.filter(
                    Grant.industry_focus == request.filters.industry_focus
                )

        grants = query.all()

        # Generate export file
        filename = (
            f"grants_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{request.format}"
        )

        # Mock file generation (in production, this would create actual files)
        file_size = len(grants) * 100  # Mock file size

        # Generate download URL (in production, this would be a real file storage URL)
        download_url = f"/api/v1/grants/download/{filename}"

        return GrantExportResponse(
            download_url=download_url,
            filename=filename,
            file_size=file_size,
            expires_at=datetime.now() + timedelta(hours=24),
        )

    except Exception as e:
        logger.error(f"Error exporting grants: {str(e)}")
        raise HTTPException(status_code=500, detail="Error exporting grants")


# Helper functions for AI features


def calculate_match_score(grant: Grant, request: AIRecommendationRequest) -> int:
    """Calculate match score between grant and user request."""
    score = 0

    # Industry match (30 points)
    if request.industry_focus and grant.industry_focus:
        if request.industry_focus.lower() == grant.industry_focus.lower():
            score += 30
        elif request.industry_focus.lower() in grant.industry_focus.lower():
            score += 20

    # Location match (25 points)
    if request.location and grant.location_eligibility:
        if request.location.lower() in grant.location_eligibility.lower():
            score += 25

    # Organization type match (20 points)
    if request.org_type and grant.org_type_eligible:
        if request.org_type in grant.org_type_eligible:
            score += 20

    # Budget match (15 points)
    if request.budget_range and grant.min_amount and grant.max_amount:
        min_budget = request.budget_range.get("min")
        max_budget = request.budget_range.get("max")
        if min_budget and max_budget:
            if grant.min_amount <= max_budget and grant.max_amount >= min_budget:
                score += 15

    # Project tags match (10 points)
    if request.project_tags and grant.funding_purpose:
        matching_tags = set(request.project_tags) & set(grant.funding_purpose)
        if matching_tags:
            score += min(10, len(matching_tags) * 2)

    return min(100, score)


def generate_match_reasons(grant: Grant, request: AIRecommendationRequest) -> List[str]:
    """Generate human-readable reasons for the match."""
    reasons = []

    if request.industry_focus and grant.industry_focus:
        if request.industry_focus.lower() == grant.industry_focus.lower():
            reasons.append(f"Perfect industry match: {grant.industry_focus}")

    if request.location and grant.location_eligibility:
        if request.location.lower() in grant.location_eligibility.lower():
            reasons.append(f"Location eligible: {grant.location_eligibility}")

    if request.org_type and grant.org_type_eligible:
        if request.org_type in grant.org_type_eligible:
            reasons.append(f"Your organisation type is eligible")

    if request.budget_range and grant.min_amount and grant.max_amount:
        reasons.append(
            f"Funding range: ${grant.min_amount:,.0f} - ${grant.max_amount:,.0f}"
        )

    if grant.deadline:
        days_until_deadline = (grant.deadline - datetime.now()).days
        if days_until_deadline > 0:
            reasons.append(f"Deadline: {days_until_deadline} days remaining")

    return reasons


def determine_priority(match_score: int, grant: Grant) -> str:
    """Determine priority level based on match score and grant characteristics."""
    if match_score >= 90:
        return "high"
    elif match_score >= 75:
        return "medium"
    else:
        return "low"


def estimate_success_probability(grant: Grant, user=None) -> int:
    """Estimate success probability based on grant and user characteristics."""
    # Mock implementation - in production, this would use ML models
    base_probability = 60

    # Adjust based on grant characteristics
    if grant.max_amount and grant.max_amount > 100000:
        base_probability -= 10  # Larger grants are more competitive

    if grant.deadline:
        days_until_deadline = (grant.deadline - datetime.now()).days
        if days_until_deadline < 30:
            base_probability -= 15  # Short deadlines reduce success chance

    return max(0, min(100, base_probability))


def extract_key_requirements(grant: Grant) -> List[str]:
    """Extract key requirements from grant description."""
    # Mock implementation - in production, this would use NLP
    requirements = []

    if grant.org_type_eligible:
        requirements.append(
            f"Eligible organisations: {', '.join(grant.org_type_eligible)}"
        )

    if grant.location_eligibility:
        requirements.append(f"Location: {grant.location_eligibility}")

    if grant.funding_purpose:
        requirements.append(f"Focus areas: {', '.join(grant.funding_purpose)}")

    return requirements


def parse_natural_language_query(query: str) -> dict:
    """Parse natural language query into structured filters."""
    # Mock implementation - in production, this would use NLP
    parsed = {"keywords": []}

    query_lower = query.lower()

    # Extract industry keywords
    industry_keywords = {
        "technology": ["tech", "digital", "software", "ai", "artificial intelligence"],
        "healthcare": ["health", "medical", "wellness", "mental health"],
        "sustainability": ["sustainable", "environment", "green", "climate"],
        "education": ["education", "learning", "school", "training"],
        "cultural heritage": ["cultural", "heritage", "indigenous", "arts"],
    }

    for industry, keywords in industry_keywords.items():
        if any(keyword in query_lower for keyword in keywords):
            parsed["industry"] = industry
            break

    # Extract location keywords
    location_keywords = {
        "victoria": ["victoria", "melbourne", "geelong"],
        "national": ["national", "australia", "countrywide"],
        "local": ["local", "community", "neighbourhood"],
    }

    for location, keywords in location_keywords.items():
        if any(keyword in query_lower for keyword in keywords):
            parsed["location"] = location
            break

    # Extract amount keywords
    if "small" in query_lower or "under 50k" in query_lower:
        parsed["amount_range"] = {"max": 50000}
    elif "large" in query_lower or "over 100k" in query_lower:
        parsed["amount_range"] = {"min": 100000}

    return parsed


def calculate_relevance_score(grant: Grant, query: str) -> int:
    """Calculate relevance score for a grant based on search query."""
    # Mock implementation
    score = 50

    query_lower = query.lower()
    title_lower = grant.title.lower()
    desc_lower = grant.description.lower() if grant.description else ""

    # Title match
    if any(word in title_lower for word in query_lower.split()):
        score += 30

    # Description match
    if any(word in desc_lower for word in query_lower.split()):
        score += 20

    return min(100, score)


def extract_tags_from_grant(grant: Grant) -> List[str]:
    """Extract tags from grant data."""
    tags = []

    if grant.industry_focus:
        tags.append(grant.industry_focus)

    if grant.funding_purpose:
        tags.extend(grant.funding_purpose)

    if grant.audience_tags:
        tags.extend(grant.audience_tags)

    return list(set(tags))


def generate_ai_insights(grants: List[EnhancedGrantResponse], query: str) -> dict:
    """Generate AI insights about the search results."""
    return {
        "total_funding_available": sum(g.max_amount or 0 for g in grants),
        "average_relevance_score": (
            sum(g.relevance_score or 0 for g in grants) / len(grants) if grants else 0
        ),
        "top_industries": list(
            set(g.industry_focus for g in grants if g.industry_focus)
        ),
        "deadline_urgency": (
            "medium"
            if any(
                g.deadline and (g.deadline - datetime.now()).days < 30 for g in grants
            )
            else "low"
        ),
    }


def generate_search_suggestions(query: str) -> List[str]:
    """Generate search suggestions based on the query."""
    suggestions = [
        f"{query} in Victoria",
        f"{query} for nonprofits",
        f"{query} under $50,000",
        f"{query} closing soon",
    ]
    return suggestions


def generate_related_searches(query: str) -> List[str]:
    """Generate related search terms."""
    related = [
        "sustainability grants",
        "technology innovation funding",
        "community development grants",
        "indigenous cultural projects",
    ]
    return related


# Existing endpoints (keep these)
@router.post("/scrape")
async def scrape_all_sources(
    background_tasks: BackgroundTasks, db: Session = Depends(get_db)
):
    """Trigger scraping of all available grant sources."""
    try:
        from app.core.config import settings

        if not hasattr(settings, "ALLOWED_SCRAPER_SOURCES"):
            raise HTTPException(
                status_code=500, detail="Scraper configuration not found"
            )

        enabled_sources = []
        for source_id, config in settings.ALLOWED_SCRAPER_SOURCES.items():
            if config.get("enabled", False):
                enabled_sources.append(source_id)

        if not enabled_sources:
            return {
                "status": "no_sources",
                "message": "No enabled scraper sources found",
                "available_sources": [],
            }

        # Start scraping for each enabled source
        started_sources = []
        for source in enabled_sources:
            try:
                # Import and initialize scraper
                if source == "australian_grants":
                    from app.services.scrapers.australian_grants_scraper import (
                        AustralianGrantsScraper,
                    )

                    scraper = AustralianGrantsScraper(db)
                elif source == "business_gov":
                    from app.services.scrapers.business_gov import BusinessGovScraper

                    scraper = BusinessGovScraper(db)
                elif source == "media_investment":
                    from app.services.scrapers.media_investment_scraper import (
                        MediaInvestmentScraper,
                    )

                    scraper = MediaInvestmentScraper(db)
                else:
                    logger.warning(f"Skipping {source} - not yet implemented")
                    continue

                # Add to background tasks
                background_tasks.add_task(scraper.scrape)
                started_sources.append(source)

            except Exception as e:
                logger.error(f"Error starting scraper {source}: {str(e)}")
                # Continue with other sources even if one fails

        return {
            "status": "started",
            "message": f"Started scraping for {len(started_sources)} sources",
            "started_sources": started_sources,
            "total_enabled": len(enabled_sources),
            "estimated_time": "5-10 minutes",
        }

    except Exception as e:
        logger.error(f"Error in scrape_all_sources: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error starting scrapers: {str(e)}"
        )


@router.post("/scrape/{source}")
async def scrape_specific_source(
    source: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)
):
    """Trigger scraping of a specific grant source."""
    try:
        from app.core.config import settings

        # Check if source is allowed
        if (
            not hasattr(settings, "ALLOWED_SCRAPER_SOURCES")
            or source not in settings.ALLOWED_SCRAPER_SOURCES
        ):
            raise HTTPException(
                status_code=400,
                detail=f"Source '{source}' is not allowed or not configured",
            )

        source_config = settings.ALLOWED_SCRAPER_SOURCES[source]
        if not source_config.get("enabled", False):
            raise HTTPException(
                status_code=400, detail=f"Source '{source}' is currently disabled"
            )

        # Import the appropriate scraper
        scraper_map = {
            "australian_grants": "AustralianGrantsScraper",
            "business.gov.au": "BusinessGovScraper",
            "media_investment": "MediaInvestmentScraper",
            "grantconnect": "GrantConnectScraper",
            "philanthropic": "PhilanthropicScraper",
        }

        if source not in scraper_map:
            raise HTTPException(
                status_code=400,
                detail=f"No scraper implementation found for source '{source}'",
            )

        # Import and initialize scraper
        try:
            if source == "australian_grants":
                from app.services.scrapers.australian_grants_scraper import (
                    AustralianGrantsScraper,
                )

                scraper = AustralianGrantsScraper(db)
            elif source == "business_gov":
                from app.services.scrapers.business_gov import BusinessGovScraper

                scraper = BusinessGovScraper(db)
            elif source == "media_investment":
                from app.services.scrapers.media_investment_scraper import (
                    MediaInvestmentScraper,
                )

                scraper = MediaInvestmentScraper(db)
            else:
                raise HTTPException(
                    status_code=400,
                    detail=f"Scraper for '{source}' not yet implemented",
                )

            # Run scraper in background
            background_tasks.add_task(scraper.scrape)

            return {
                "status": "started",
                "message": f"Scraping started for {source}",
                "source": source,
                "estimated_time": "2-5 minutes",
            }

        except ImportError as e:
            logger.error(f"Import error for scraper {source}: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Scraper module for '{source}' could not be imported",
            )
        except Exception as e:
            logger.error(f"Error initializing scraper {source}: {str(e)}")
            raise HTTPException(
                status_code=500, detail=f"Error initializing scraper: {str(e)}"
            )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in scrape_specific_source: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.get("/sources")
def get_available_sources(db: Session = Depends(get_db)):
    """Get list of available grant sources with their status."""
    try:
        from app.core.config import settings

        sources = []
        if hasattr(settings, "ALLOWED_SCRAPER_SOURCES"):
            for source_id, config in settings.ALLOWED_SCRAPER_SOURCES.items():
                sources.append(
                    {
                        "id": source_id,
                        "name": config.get("description", source_id),
                        "base_url": config.get("base_url", ""),
                        "enabled": config.get("enabled", False),
                        "rate_limit": config.get("rate_limit", 1.0),
                    }
                )

        return {
            "sources": sources,
            "total": len(sources),
            "status": "enabled",
            "message": "Grant scraping sources are now available",
        }
    except Exception as e:
        logger.error(f"Error getting available sources: {str(e)}")
        return {
            "sources": [],
            "total": 0,
            "status": "error",
            "message": f"Error retrieving sources: {str(e)}",
        }


@router.get("/test")
def test_grants():
    """Test endpoint that doesn't use dependency injection."""
    try:
        from app.db.session import get_engine
        from sqlalchemy import text

        engine = get_engine()
        with engine.connect() as conn:
            result = conn.execute(text("SELECT COUNT(*) FROM grants"))
            count = result.scalar()

        return {
            "status": "success",
            "grants_count": count,
            "message": "Direct database access working",
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "message": "Direct database access failed",
        }


@router.post("/add-test")
def add_test_grant():
    """Add a single test grant to the database."""
    try:
        from datetime import datetime, timedelta

        from app.db.session import get_engine
        from app.models.grant import Grant
        from sqlalchemy.orm import sessionmaker

        engine = get_engine()
        SessionLocal = sessionmaker(bind=engine)
        db = SessionLocal()

        try:
            test_grant = Grant(
                title="Test Community Grant",
                description="A test grant for community development",
                source="Test Foundation",
                source_url="https://example.com/test",
                application_url="https://example.com/apply",
                contact_email="test@example.com",
                min_amount=1000.00,
                max_amount=10000.00,
                open_date=datetime.now(),
                deadline=datetime.now() + timedelta(days=30),
                industry_focus="community",
                location_eligibility="local",
                org_type_eligible=["nonprofit"],
                funding_purpose=["community development"],
                audience_tags=["community organizations"],
                status="open",
            )

            db.add(test_grant)
            db.commit()

            return {
                "status": "success",
                "message": "Added test grant",
                "grant_id": test_grant.id,
            }

        finally:
            db.close()

    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "message": "Failed to add test grant",
        }


@router.post("/clear")
def clear_all_grants():
    """Clear all grants from the database."""
    db = next(get_db())

    try:
        deleted_count = db.query(Grant).delete()
        db.commit()

        return {
            "message": f"Successfully cleared {deleted_count} grants from the database",
            "grants_deleted": deleted_count,
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error clearing grants: {str(e)}")
    finally:
        db.close()


@router.post("/seed-simple")
def seed_simple_grants():
    """Seed the database with a simple set of diverse grants for testing."""
    db = next(get_db())

    existing_count = db.query(Grant).count()
    if existing_count > 0:
        return {
            "message": f"Database already has {existing_count} grants. Use /clear first to reset.",
            "existing_grants": existing_count,
        }

    sample_grants = [
        {
            "title": "Digital Media Innovation Fund",
            "description": "Supporting innovative digital media projects that push creative boundaries and engage new audiences through technology.",
            "source": "Creative Australia",
            "source_url": "https://creative.gov.au",
            "application_url": "https://creative.gov.au/apply",
            "contact_email": "grants@creative.gov.au",
            "min_amount": 50000,
            "max_amount": 200000,
            "open_date": datetime.now(),
            "deadline": datetime.now() + timedelta(days=45),
            "industry_focus": "technology",
            "location_eligibility": "national",
            "org_type_eligible": ["startup", "sme", "nonprofit"],
            "funding_purpose": ["Digital Media", "Innovation"],
            "audience_tags": ["Digital Creators", "Tech Startups"],
            "status": "open",
            "notes": "Focus on digital storytelling",
        },
        {
            "title": "Indigenous Film Production Grant",
            "description": "Supporting Indigenous filmmakers to tell authentic stories and preserve cultural heritage through film.",
            "source": "Screen Australia",
            "source_url": "https://screenaustralia.gov.au",
            "application_url": "https://screenaustralia.gov.au/indigenous",
            "contact_email": "indigenous@screenaustralia.gov.au",
            "min_amount": 25000,
            "max_amount": 150000,
            "open_date": datetime.now(),
            "deadline": datetime.now() + timedelta(days=30),
            "industry_focus": "services",
            "location_eligibility": "national",
            "org_type_eligible": ["indigenous organisation", "nonprofit"],
            "funding_purpose": ["Film Production", "Cultural Preservation"],
            "audience_tags": ["Indigenous Communities", "Filmmakers"],
            "status": "open",
            "notes": "Priority for Indigenous-owned companies",
        },
        {
            "title": "Youth Mental Health Initiative",
            "description": "Supporting community organizations to provide mental health services and support programs for young people.",
            "source": "Department of Health",
            "source_url": "https://health.gov.au",
            "application_url": "https://health.gov.au/youth-mental-health",
            "contact_email": "youth.health@health.gov.au",
            "min_amount": 50000,
            "max_amount": 500000,
            "open_date": datetime.now(),
            "deadline": datetime.now() + timedelta(days=75),
            "industry_focus": "healthcare",
            "location_eligibility": "national",
            "org_type_eligible": ["nonprofit", "healthcare provider"],
            "funding_purpose": ["Mental Health", "Youth Services"],
            "audience_tags": ["Youth", "Mental Health Professionals"],
            "status": "open",
            "notes": "Priority for evidence-based programs",
        },
        {
            "title": "Social Enterprise Accelerator",
            "description": "Supporting social enterprises to scale their impact and create sustainable business models.",
            "source": "Social Traders",
            "source_url": "https://socialtraders.com.au",
            "application_url": "https://socialtraders.com.au/accelerator",
            "contact_email": "accelerator@socialtraders.com.au",
            "min_amount": 25000,
            "max_amount": 150000,
            "open_date": datetime.now(),
            "deadline": datetime.now() + timedelta(days=30),
            "industry_focus": "services",
            "location_eligibility": "national",
            "org_type_eligible": ["social enterprise", "nonprofit"],
            "funding_purpose": ["Social Enterprise", "Business Development"],
            "audience_tags": ["Social Entrepreneurs", "Nonprofits"],
            "status": "open",
            "notes": "Must have proven social impact model",
        },
        {
            "title": "Renewable Energy Innovation Grant",
            "description": "Supporting innovative renewable energy projects that can accelerate Australia's transition to clean energy.",
            "source": "Australian Renewable Energy Agency",
            "source_url": "https://arena.gov.au",
            "application_url": "https://arena.gov.au/innovation",
            "contact_email": "innovation@arena.gov.au",
            "min_amount": 100000,
            "max_amount": 2000000,
            "open_date": datetime.now(),
            "deadline": datetime.now() + timedelta(days=120),
            "industry_focus": "technology",
            "location_eligibility": "national",
            "org_type_eligible": ["startup", "sme", "research institution"],
            "funding_purpose": ["Renewable Energy", "Innovation"],
            "audience_tags": ["Energy Companies", "Researchers"],
            "status": "open",
            "notes": "Must demonstrate commercial potential",
        },
        {
            "title": "Circular Economy Solutions",
            "description": "Supporting businesses to develop circular economy solutions that reduce waste and create sustainable value chains.",
            "source": "Circular Economy Australia",
            "source_url": "https://circulareconomy.org.au",
            "application_url": "https://circulareconomy.org.au/solutions-fund",
            "contact_email": "solutions@circulareconomy.org.au",
            "min_amount": 25000,
            "max_amount": 300000,
            "open_date": datetime.now(),
            "deadline": datetime.now() + timedelta(days=75),
            "industry_focus": "manufacturing",
            "location_eligibility": "national",
            "org_type_eligible": ["startup", "sme", "nonprofit"],
            "funding_purpose": ["Circular Economy", "Waste Reduction"],
            "audience_tags": ["Manufacturers", "Sustainability Experts"],
            "status": "open",
            "notes": "Focus on scalable circular economy models",
        },
        {
            "title": "Sustainable Agriculture Innovation",
            "description": "Supporting farmers to adopt sustainable practices and reduce environmental impact.",
            "source": "Department of Agriculture",
            "source_url": "https://agriculture.gov.au",
            "application_url": "https://agriculture.gov.au/sustainable-ag",
            "contact_email": "sustainable.ag@agriculture.gov.au",
            "min_amount": 50000,
            "max_amount": 500000,
            "open_date": datetime.now(),
            "deadline": datetime.now() + timedelta(days=90),
            "industry_focus": "agriculture",
            "location_eligibility": "regional",
            "org_type_eligible": ["sme", "farmer", "research institution"],
            "funding_purpose": ["Sustainable Agriculture", "Innovation"],
            "audience_tags": ["Farmers", "Agricultural Researchers"],
            "status": "active",
            "notes": "Must demonstrate environmental benefits",
        },
        {
            "title": "Marine Conservation Initiative",
            "description": "Supporting marine conservation projects that protect Australia's unique marine ecosystems.",
            "source": "Great Barrier Reef Foundation",
            "source_url": "https://barrierreef.org",
            "application_url": "https://barrierreef.org/conservation",
            "contact_email": "conservation@barrierreef.org",
            "min_amount": 25000,
            "max_amount": 250000,
            "open_date": datetime.now(),
            "deadline": datetime.now() + timedelta(days=45),
            "industry_focus": "environment",
            "location_eligibility": "coastal",
            "org_type_eligible": ["nonprofit", "research institution"],
            "funding_purpose": ["Marine Conservation", "Biodiversity"],
            "audience_tags": ["Marine Biologists", "Conservationists"],
            "status": "open",
            "notes": "Priority for Great Barrier Reef projects",
        },
    ]

    try:
        for grant_data in sample_grants:
            grant = Grant(**grant_data)
            db.add(grant)

        db.commit()
        return {
            "message": f"Successfully seeded {len(sample_grants)} diverse grants across Media, Community Impact, and Sustainability sectors",
            "grants_added": len(sample_grants),
            "sectors": [
                "Media & Creative",
                "Community & Social Impact",
                "Sustainability & Environment",
            ],
            "note": "Simple test dataset with 8 grants for comprehensive testing",
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error seeding grants: {str(e)}")
    finally:
        db.close()
