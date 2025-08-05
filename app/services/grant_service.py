from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.repositories.grant_repository import GrantRepository
from app.interfaces.notification_service import NotificationServiceInterface
from app.models.grant import Grant
from app.models.user import User

class GrantService:
    """
    Grant business logic service following Single Responsibility Principle.
    Handles all grant-related business logic, not database operations or HTTP concerns.
    """
    
    def __init__(self, 
                 grant_repo: GrantRepository,
                 notification_service: NotificationServiceInterface):
        self.grant_repo = grant_repo
        self.notification_service = notification_service
    
    def get_accessible_grant(self, grant_id: int, user: User) -> Grant:
        """
        Get a grant that the user has access to
        
        Args:
            grant_id: ID of the grant
            user: User requesting access
            
        Returns:
            Grant: The grant if accessible
            
        Raises:
            GrantNotFoundError: If grant doesn't exist
            GrantAccessDeniedError: If user cannot access grant
        """
        grant = self.grant_repo.get_by_id(grant_id)
        if not grant:
            raise GrantNotFoundError(f"Grant {grant_id} not found")
        
        if not self._is_grant_accessible_to_user(grant, user):
            raise GrantAccessDeniedError(f"User cannot access grant {grant_id}")
        
        return grant
    
    def find_matching_grants(self, user: User, criteria: Dict[str, Any] = None) -> List[Grant]:
        """
        Find grants that match user's profile and criteria
        
        Args:
            user: User to find matches for
            criteria: Additional search criteria
            
        Returns:
            List[Grant]: Matching grants
        """
        # Build search criteria based on user profile
        search_criteria = self._build_search_criteria_from_user(user)
        
        # Add additional criteria if provided
        if criteria:
            search_criteria.update(criteria)
        
        matches = self.grant_repo.get_grants_by_multiple_criteria(search_criteria)
        
        # Notify user of new matches if any found
        if matches:
            self.notification_service.send_notification(
                user.id,
                f"Found {len(matches)} new grant matches for you",
                "info"
            )
        
        return matches
    
    def get_grant_recommendations(self, user: User, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get personalized grant recommendations for a user
        
        Args:
            user: User to get recommendations for
            limit: Maximum number of recommendations
            
        Returns:
            List[Dict]: Grant recommendations with match scores
        """
        all_grants = self.grant_repo.get_active_grants()
        recommendations = []
        
        for grant in all_grants:
            score = self._calculate_match_score(grant, user)
            if score > 0.5:  # Minimum match threshold
                recommendations.append({
                    'grant': grant,
                    'match_score': score,
                    'match_reasons': self._get_match_reasons(grant, user)
                })
        
        # Sort by score and limit results
        recommendations.sort(key=lambda x: x['match_score'], reverse=True)
        return recommendations[:limit]
    
    def get_grant_statistics(self) -> Dict[str, Any]:
        """
        Get grant statistics for analytics
        
        Returns:
            Dict: Grant statistics
        """
        return self.grant_repo.get_grant_statistics()
    
    def get_upcoming_deadlines(self, days_ahead: int = 30) -> List[Grant]:
        """
        Get grants with upcoming deadlines
        
        Args:
            days_ahead: Number of days to look ahead
            
        Returns:
            List[Grant]: Grants with upcoming deadlines
        """
        return self.grant_repo.get_grants_by_deadline(days_ahead)
    
    def search_grants(self, search_term: str, user: User = None) -> List[Grant]:
        """
        Search grants by term
        
        Args:
            search_term: Term to search for
            user: Optional user for personalized results
            
        Returns:
            List[Grant]: Matching grants
        """
        grants = self.grant_repo.search_grants(search_term)
        
        # If user provided, filter by accessibility
        if user:
            grants = [g for g in grants if self._is_grant_accessible_to_user(g, user)]
        
        return grants
    
    def _build_search_criteria_from_user(self, user: User) -> Dict[str, Any]:
        """Build search criteria based on user profile"""
        criteria = {
            'status': 'active'
        }
        
        # Get user preferences
        user_preferences = user.preferences or {}
        
        if user_preferences.get('industry_focus'):
            criteria['industry'] = user_preferences['industry_focus']
        
        if user.location:
            criteria['location'] = user.location
        
        if user_preferences.get('min_grant_amount'):
            criteria['min_amount'] = user_preferences['min_grant_amount']
        
        return criteria
    
    def _calculate_match_score(self, grant: Grant, user: User) -> float:
        """Calculate how well a grant matches a user's profile"""
        score = 0.0
        
        # Get user preferences
        user_preferences = user.preferences or {}
        
        # Industry match (40% weight)
        user_industry = user_preferences.get('industry_focus')
        if user_industry and grant.industry_focus == user_industry:
            score += 0.4
        
        # Location match (30% weight)
        if user.location and grant.location_eligibility:
            if user.location in grant.location_eligibility:
                score += 0.3
        
        # Amount suitability (20% weight) - using min_amount if available
        user_min_amount = user_preferences.get('min_grant_amount')
        if user_min_amount and grant.min_amount:
            if float(grant.min_amount) >= user_min_amount:
                score += 0.2
        
        # Deadline urgency (10% weight)
        if grant.deadline:
            days_until_deadline = (grant.deadline - datetime.utcnow()).days
            if 0 <= days_until_deadline <= 30:
                score += 0.1
        
        return score
    
    def _get_match_reasons(self, grant: Grant, user: User) -> List[str]:
        """Get reasons why a grant matches a user"""
        reasons = []
        
        # Get user preferences
        user_preferences = user.preferences or {}
        
        user_industry = user_preferences.get('industry_focus')
        if user_industry and grant.industry_focus == user_industry:
            reasons.append(f"Industry match: {grant.industry_focus}")
        
        if user.location and grant.location_eligibility:
            if user.location in grant.location_eligibility:
                reasons.append(f"Location eligible: {user.location}")
        
        user_min_amount = user_preferences.get('min_grant_amount')
        if user_min_amount and grant.min_amount:
            if float(grant.min_amount) >= user_min_amount:
                reasons.append(f"Amount suitable: ${grant.min_amount:,.2f}")
        
        if grant.deadline:
            days_until_deadline = (grant.deadline - datetime.utcnow()).days
            if days_until_deadline <= 30:
                reasons.append(f"Urgent deadline: {days_until_deadline} days")
        
        return reasons
    
    def _is_grant_accessible_to_user(self, grant: Grant, user: User) -> bool:
        """Check if a user can access a grant"""
        # Basic accessibility check
        if grant.status != "active":
            return False
        
        # Add more complex business logic here if needed
        # For example, user permissions, grant restrictions, etc.
        
        return True

class GrantNotFoundError(Exception):
    """Raised when a grant is not found"""
    pass

class GrantAccessDeniedError(Exception):
    """Raised when user cannot access a grant"""
    pass 