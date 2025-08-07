from datetime import datetime
from decimal import Decimal
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class GrantBase(BaseModel):
    """Base schema for grant data."""

    title: str
    description: Optional[str] = None
    source: str
    source_url: Optional[str] = None
    application_url: Optional[str] = None
    contact_email: Optional[str] = None
    min_amount: Optional[Decimal] = None
    max_amount: Optional[Decimal] = None
    open_date: Optional[datetime] = None
    deadline: Optional[datetime] = None
    industry_focus: Optional[str] = None
    location_eligibility: Optional[str] = None
    org_type_eligible: Optional[List[str]] = []
    funding_purpose: Optional[List[str]] = []
    audience_tags: Optional[List[str]] = []
    status: str = "draft"
    notes: Optional[str] = None

    class Config:
        from_attributes = True


class GrantCreate(GrantBase):
    """Schema for creating a new grant."""

    pass


class GrantUpdate(BaseModel):
    """Schema for updating an existing grant."""

    title: Optional[str] = None
    description: Optional[str] = None
    source: Optional[str] = None
    source_url: Optional[str] = None
    application_url: Optional[str] = None
    contact_email: Optional[str] = None
    min_amount: Optional[Decimal] = None
    max_amount: Optional[Decimal] = None
    open_date: Optional[datetime] = None
    deadline: Optional[datetime] = None
    industry_focus: Optional[str] = None
    location_eligibility: Optional[str] = None
    org_type_eligible: Optional[List[str]] = None
    funding_purpose: Optional[List[str]] = None
    audience_tags: Optional[List[str]] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class GrantResponse(BaseModel):
    """Grant response schema"""

    id: int
    title: str
    description: str
    min_amount: Optional[int] = None
    max_amount: Optional[int] = None
    deadline: Optional[datetime]
    source: str
    industry_focus: Optional[str]
    location_eligibility: Optional[str]
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class GrantListResponse(BaseModel):
    """Response schema for list of grants"""

    grants: List[GrantResponse]
    total_count: int
    skip: int
    limit: int


class GrantRecommendationResponse(BaseModel):
    """Response schema for grant recommendations"""

    grant: GrantResponse
    match_score: float
    match_reasons: List[str]


class GrantList(BaseModel):
    """Schema for paginated grant list."""

    items: List[GrantResponse]
    total: int
    page: int
    size: int
    has_next: bool
    has_prev: bool


class GrantFilters(BaseModel):
    """Schema for grant filtering parameters."""

    search: Optional[str] = None
    status: Optional[str] = None
    industry_focus: Optional[str] = None
    location_eligibility: Optional[str] = None
    org_type: Optional[str] = None
    min_amount: Optional[Decimal] = None
    max_amount: Optional[Decimal] = None
    deadline_before: Optional[datetime] = None
    deadline_after: Optional[datetime] = None
    funding_purpose: Optional[str] = None
    audience_tags: Optional[str] = None
    relevance_score_min: Optional[int] = None
    success_probability_min: Optional[int] = None
    page: int = 1
    size: int = 20


class GrantMatchResult(BaseModel):
    """Schema for grant matching results."""

    grant_id: int
    title: str
    score: int
    reasons: List[str]
    deadline: Optional[str]
    amount_range: str


class GrantData(BaseModel):
    """Schema for grant data in groups."""

    id: int
    title: str
    min_amount: Optional[float] = None
    max_amount: Optional[float] = None
    deadline: Optional[datetime] = None
    status: str
    source: str


class DeadlineGroup(BaseModel):
    """Schema for grouped grants by deadline."""

    grants: List[Dict[str, Any]]
    total_amount: float
    count: int

    class Config:
        arbitrary_types_allowed = True


class GrantTimeline(BaseModel):
    """Schema for grant timeline view."""

    this_week: DeadlineGroup
    next_week: DeadlineGroup
    this_month: DeadlineGroup
    next_month: DeadlineGroup
    later: DeadlineGroup


class GrantsByCategory(BaseModel):
    """Schema for grants grouped by category."""

    by_industry: Dict[str, int]
    by_location: Dict[str, int]
    by_org_type: Dict[str, int]
    by_funding_range: Dict[str, int]


class GrantMetrics(BaseModel):
    """Schema for grant dashboard metrics."""

    total_active: int
    total_amount_available: float
    upcoming_deadlines: int
    avg_match_score: float


class MatchingInsights(BaseModel):
    """Schema for grant matching insights."""

    best_matches: List[Dict[str, Any]]
    common_mismatches: List[str]
    suggested_improvements: List[str]

    class Config:
        arbitrary_types_allowed = True


class GrantDashboard(BaseModel):
    """Schema for comprehensive grant dashboard."""

    metrics: GrantMetrics
    categories: GrantsByCategory
    timeline: GrantTimeline
    matching_insights: MatchingInsights
    last_updated: datetime


class ScraperStatus(BaseModel):
    """Schema for scraper status."""

    status: str
    last_run: Optional[datetime] = None
    next_scheduled: Optional[datetime] = None
    available_sources: List[str]

    class Config:
        from_attributes = True


class ScraperRunRequest(BaseModel):
    """Schema for scraper run requests."""

    source: str
    keywords: Optional[List[str]] = []
    tags: Optional[List[str]] = []


class ScraperRunResponse(BaseModel):
    """Schema for scraper run responses."""

    message: str
    status: str = "accepted"


# New AI and Analytics Schemas
class GrantRecommendation(BaseModel):
    grant: GrantResponse
    reasons: List[str]
    match_score: int = Field(..., ge=0, le=100)
    priority: str = Field(..., pattern="^(high|medium|low)$")
    success_probability: Optional[int] = Field(None, ge=0, le=100)
    estimated_effort: Optional[str] = None
    key_requirements: Optional[List[str]] = None


class GrantAnalytics(BaseModel):
    total_grants: int
    open_grants: int
    closing_soon: int
    total_funding: Decimal
    average_amount: Decimal
    success_rate: float = Field(..., ge=0, le=100)
    top_industries: List[Dict[str, Any]]
    funding_trends: List[Dict[str, Any]]
    upcoming_deadlines: List[GrantResponse]
    sector_breakdown: Dict[str, int]
    location_breakdown: Dict[str, int]


class SavedSearch(BaseModel):
    id: int
    name: str
    filters: Dict[str, Any]
    user_id: int
    last_used: datetime
    result_count: int
    is_alert_enabled: bool = False


class SavedSearchCreate(BaseModel):
    name: str
    filters: Dict[str, Any]
    is_alert_enabled: bool = False


class SavedSearchUpdate(BaseModel):
    name: Optional[str] = None
    filters: Optional[Dict[str, Any]] = None
    is_alert_enabled: Optional[bool] = None


class GrantApplication(BaseModel):
    id: int
    grant_id: int
    user_id: int
    status: str = Field(
        ..., pattern="^(not_started|in_progress|submitted|awarded|rejected)$"
    )
    progress_percentage: int = Field(..., ge=0, le=100)
    notes: Optional[str] = None
    team_members: Optional[List[str]] = None
    documents: Optional[List[str]] = None
    created_at: datetime
    updated_at: datetime


class GrantApplicationCreate(BaseModel):
    grant_id: int
    status: str = "not_started"
    notes: Optional[str] = None
    team_members: Optional[List[str]] = None


class GrantApplicationUpdate(BaseModel):
    status: Optional[str] = None
    progress_percentage: Optional[int] = None
    notes: Optional[str] = None
    team_members: Optional[List[str]] = None
    documents: Optional[List[str]] = None


class GrantNote(BaseModel):
    id: int
    grant_id: int
    user_id: int
    content: str
    created_at: datetime
    updated_at: datetime


class GrantNoteCreate(BaseModel):
    grant_id: int
    content: str


class GrantNoteUpdate(BaseModel):
    content: str


class GrantDocument(BaseModel):
    id: int
    grant_id: int
    user_id: int
    filename: str
    file_url: str
    file_type: str
    file_size: int
    created_at: datetime


class GrantDocumentCreate(BaseModel):
    grant_id: int
    filename: str
    file_url: str
    file_type: str
    file_size: int


class AIRecommendationRequest(BaseModel):
    user_id: int
    project_tags: Optional[List[str]] = None
    industry_focus: Optional[str] = None
    location: Optional[str] = None
    org_type: Optional[str] = None
    budget_range: Optional[Dict[str, Decimal]] = None
    timeline: Optional[str] = None
    max_results: int = 10


class AIRecommendationResponse(BaseModel):
    recommendations: List[GrantRecommendation]
    total_matches: int
    confidence_score: float
    reasoning: str


class GrantExportRequest(BaseModel):
    filters: Optional[GrantFilters] = None
    format: str = Field(..., pattern="^(csv|pdf|excel)$")
    include_analytics: bool = False
    include_recommendations: bool = False


class GrantExportResponse(BaseModel):
    download_url: str
    filename: str
    file_size: int
    expires_at: datetime


class GrantAlert(BaseModel):
    id: int
    user_id: int
    search_id: int
    name: str
    conditions: Dict[str, Any]
    is_active: bool
    last_triggered: Optional[datetime] = None
    created_at: datetime


class GrantAlertCreate(BaseModel):
    search_id: int
    name: str
    conditions: Dict[str, Any]


class GrantAlertUpdate(BaseModel):
    name: Optional[str] = None
    conditions: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None


# Enhanced Grant Response with AI features
class EnhancedGrantResponse(GrantResponse):
    relevance_score: Optional[int] = Field(None, ge=0, le=100)
    success_probability: Optional[int] = Field(None, ge=0, le=100)
    tags: Optional[List[str]] = []
    application_status: Optional[str] = "not_started"
    team_notes: Optional[List[GrantNote]] = []
    documents: Optional[List[GrantDocument]] = []
    similar_grants: Optional[List[int]] = []


# Analytics and Reporting
class GrantMetrics(BaseModel):
    total_applications: int
    success_rate: float
    average_processing_time: Optional[int] = None
    total_funding_received: Decimal
    sector_performance: Dict[str, float]
    monthly_trends: List[Dict[str, Any]]


class GrantDashboard(BaseModel):
    overview: GrantAnalytics
    recommendations: List[GrantRecommendation]
    recent_applications: List[GrantApplication]
    upcoming_deadlines: List[GrantResponse]
    saved_searches: List[SavedSearch]
    alerts: List[GrantAlert]


# Search and Discovery
class SmartSearchRequest(BaseModel):
    query: str
    filters: Optional[GrantFilters] = None
    include_ai_insights: bool = True
    max_results: int = 20


class SmartSearchResponse(BaseModel):
    grants: List[EnhancedGrantResponse]
    total_results: int
    search_suggestions: List[str]
    ai_insights: Optional[Dict[str, Any]] = None
    related_searches: List[str]


# Collaboration Features
class GrantCollaboration(BaseModel):
    grant_id: int
    team_members: List[Dict[str, Any]]
    shared_documents: List[GrantDocument]
    discussion_threads: List[Dict[str, Any]]
    task_assignments: List[Dict[str, Any]]


class GrantCollaborationUpdate(BaseModel):
    team_members: Optional[List[Dict[str, Any]]] = None
    shared_documents: Optional[List[GrantDocument]] = None
    discussion_threads: Optional[List[Dict[str, Any]]] = None
    task_assignments: Optional[List[Dict[str, Any]]] = None
