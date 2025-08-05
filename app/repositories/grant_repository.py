from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, asc
from datetime import datetime, timedelta

from .base import BaseRepository
from app.models.grant import Grant

class GrantRepository(BaseRepository[Grant]):
    """
    Grant-specific repository following Single Responsibility Principle.
    Handles all grant-related database operations.
    """
    
    def __init__(self, db: Session):
        super().__init__(db, Grant)
    
    def get_active_grants(self) -> List[Grant]:
        """Get all active grants"""
        return self.db.query(Grant).filter(Grant.status == "active").all()
    
    def get_grants_by_industry(self, industry: str) -> List[Grant]:
        """Get grants by industry focus"""
        return self.db.query(Grant).filter(Grant.industry_focus == industry).all()
    
    def get_grants_by_location(self, location: str) -> List[Grant]:
        """Get grants by location eligibility"""
        return self.db.query(Grant).filter(
            Grant.location_eligibility.contains(location)
        ).all()
    
    def get_grants_by_amount_range(self, min_amount: int, max_amount: int) -> List[Grant]:
        """Get grants within amount range"""
        return self.db.query(Grant).filter(
            and_(
                Grant.amount >= min_amount,
                Grant.amount <= max_amount
            )
        ).all()
    
    def get_grants_by_deadline(self, days_ahead: int = 30) -> List[Grant]:
        """Get grants with deadlines within specified days"""
        cutoff_date = datetime.utcnow() + timedelta(days=days_ahead)
        return self.db.query(Grant).filter(
            and_(
                Grant.deadline >= datetime.utcnow(),
                Grant.deadline <= cutoff_date
            )
        ).order_by(asc(Grant.deadline)).all()
    
    def get_grants_by_source(self, source: str) -> List[Grant]:
        """Get grants by source (e.g., 'screen_australia', 'creative_australia')"""
        return self.db.query(Grant).filter(Grant.source == source).all()
    
    def search_grants(self, search_term: str) -> List[Grant]:
        """Search grants by title or description"""
        return self.db.query(Grant).filter(
            or_(
                Grant.title.ilike(f"%{search_term}%"),
                Grant.description.ilike(f"%{search_term}%")
            )
        ).all()
    
    def get_grants_by_multiple_criteria(self, criteria: Dict[str, Any]) -> List[Grant]:
        """Get grants matching multiple criteria"""
        query = self.db.query(Grant)
        
        if criteria.get('industry'):
            query = query.filter(Grant.industry_focus == criteria['industry'])
        
        if criteria.get('location'):
            query = query.filter(Grant.location_eligibility.contains(criteria['location']))
        
        if criteria.get('min_amount'):
            query = query.filter(Grant.min_amount >= criteria['min_amount'])
        
        if criteria.get('max_amount'):
            query = query.filter(Grant.max_amount <= criteria['max_amount'])
        
        if criteria.get('status'):
            query = query.filter(Grant.status == criteria['status'])
        
        if criteria.get('source'):
            query = query.filter(Grant.source == criteria['source'])
        
        if criteria.get('sort_by'):
            if criteria['sort_by'] == 'deadline':
                query = query.order_by(asc(Grant.deadline))
            elif criteria['sort_by'] == 'amount':
                query = query.order_by(desc(Grant.amount))
            elif criteria['sort_by'] == 'title':
                query = query.order_by(asc(Grant.title))
        
        return query.all()
    
    def get_recent_grants(self, days: int = 7) -> List[Grant]:
        """Get grants added in the last N days"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        return self.db.query(Grant).filter(
            Grant.created_at >= cutoff_date
        ).order_by(desc(Grant.created_at)).all()
    
    def get_grant_statistics(self) -> Dict[str, Any]:
        """Get grant statistics for analytics"""
        total_grants = self.count()
        active_grants = self.db.query(Grant).filter(Grant.status == "active").count()
        upcoming_deadlines = len(self.get_grants_by_deadline(30))
        
        # Get grants by source
        sources = self.db.query(Grant.source).distinct().all()
        source_counts = {}
        for source in sources:
            source_counts[source[0]] = self.db.query(Grant).filter(
                Grant.source == source[0]
            ).count()
        
        return {
            'total_grants': total_grants,
            'active_grants': active_grants,
            'upcoming_deadlines': upcoming_deadlines,
            'grants_by_source': source_counts
        } 