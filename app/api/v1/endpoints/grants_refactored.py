from typing import List, Optional

from app.core.auth import get_current_user
from app.db.base import get_db
from app.models.user import User
from app.repositories.grant_repository import GrantRepository
from app.schemas.grant import (
    GrantListResponse,
    GrantRecommendationResponse,
    GrantResponse,
)
from app.services.grant_service import (
    GrantAccessDeniedError,
    GrantNotFoundError,
    GrantService,
)
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

router = APIRouter()


# Dependency injection for services
def get_grant_repository(db: Session = Depends(get_db)) -> GrantRepository:
    """Dependency to get grant repository"""
    return GrantRepository(db)


def get_grant_service(
    grant_repo: GrantRepository = Depends(get_grant_repository),
    # notification_service: NotificationServiceInterface = Depends(get_notification_service)
) -> GrantService:
    """Dependency to get grant service with all dependencies"""
    # For now, we'll use a mock notification service
    # In production, this would be injected
    from app.interfaces.notification_service import NotificationServiceInterface

    class MockNotificationService(NotificationServiceInterface):
        def send_notification(
            self, user_id: int, message: str, notification_type: str = "info"
        ) -> bool:
            return True

        def send_grant_notification(
            self, user_id: int, grant_id: int, notification_type: str
        ) -> bool:
            return True

        def send_bulk_notification(
            self, user_ids: list[int], message: str, notification_type: str = "info"
        ) -> dict[int, bool]:
            return {user_id: True for user_id in user_ids}

        def get_user_notifications(
            self, user_id: int, limit: int = 50
        ) -> list[dict[str, any]]:
            return []

        def mark_notification_read(self, notification_id: int, user_id: int) -> bool:
            return True

    notification_service = MockNotificationService()
    return GrantService(grant_repo, notification_service)


@router.get("/grants/", response_model=GrantListResponse)
def get_grants(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = Query(None),
    industry: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    min_amount: Optional[int] = Query(None, ge=0),
    max_amount: Optional[int] = Query(None, ge=0),
    sort_by: Optional[str] = Query(None, regex="^(deadline|amount|title)$"),
    current_user: User = Depends(get_current_user),
    grant_service: GrantService = Depends(get_grant_service),
):
    """
    Get grants with filtering and sorting options.
    Follows Single Responsibility Principle - only handles HTTP concerns.
    """
    try:
        # Build search criteria
        criteria = {}
        if industry:
            criteria["industry"] = industry
        if location:
            criteria["location"] = location
        if min_amount:
            criteria["min_amount"] = min_amount
        if max_amount:
            criteria["max_amount"] = max_amount
        if sort_by:
            criteria["sort_by"] = sort_by

        # Get grants using service layer
        if search:
            grants = grant_service.search_grants(search, current_user)
        else:
            grants = grant_service.find_matching_grants(current_user, criteria)

        # Apply pagination
        total_count = len(grants)
        grants = grants[skip : skip + limit]

        return GrantListResponse(
            grants=[GrantResponse.from_orm(grant) for grant in grants],
            total_count=total_count,
            skip=skip,
            limit=limit,
        )

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error retrieving grants: {str(e)}"
        )


@router.get("/grants/{grant_id}", response_model=GrantResponse)
def get_grant(
    grant_id: int,
    current_user: User = Depends(get_current_user),
    grant_service: GrantService = Depends(get_grant_service),
):
    """
    Get a specific grant by ID.
    Follows Single Responsibility Principle - only handles HTTP concerns.
    """
    try:
        grant = grant_service.get_accessible_grant(grant_id, current_user)
        return GrantResponse.from_orm(grant)

    except GrantNotFoundError:
        raise HTTPException(status_code=404, detail="Grant not found")
    except GrantAccessDeniedError:
        raise HTTPException(status_code=403, detail="Access denied")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving grant: {str(e)}")


@router.get(
    "/grants/recommendations/", response_model=List[GrantRecommendationResponse]
)
def get_grant_recommendations(
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    grant_service: GrantService = Depends(get_grant_service),
):
    """
    Get personalized grant recommendations for the current user.
    Follows Single Responsibility Principle - only handles HTTP concerns.
    """
    try:
        recommendations = grant_service.get_grant_recommendations(current_user, limit)

        return [
            GrantRecommendationResponse(
                grant=GrantResponse.from_orm(rec["grant"]),
                match_score=rec["match_score"],
                match_reasons=rec["match_reasons"],
            )
            for rec in recommendations
        ]

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error getting recommendations: {str(e)}"
        )


@router.get("/grants/statistics/")
def get_grant_statistics(grant_service: GrantService = Depends(get_grant_service)):
    """
    Get grant statistics for analytics.
    Follows Single Responsibility Principle - only handles HTTP concerns.
    """
    try:
        stats = grant_service.get_grant_statistics()
        return stats

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error getting statistics: {str(e)}"
        )


@router.get("/grants/upcoming-deadlines/", response_model=GrantListResponse)
def get_upcoming_deadlines(
    days_ahead: int = Query(30, ge=1, le=365),
    current_user: User = Depends(get_current_user),
    grant_service: GrantService = Depends(get_grant_service),
):
    """
    Get grants with upcoming deadlines.
    Follows Single Responsibility Principle - only handles HTTP concerns.
    """
    try:
        grants = grant_service.get_upcoming_deadlines(days_ahead)

        return GrantListResponse(
            grants=[GrantResponse.from_orm(grant) for grant in grants],
            total_count=len(grants),
            skip=0,
            limit=len(grants),
        )

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error getting upcoming deadlines: {str(e)}"
        )
