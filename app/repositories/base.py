from abc import ABC, abstractmethod
from typing import TypeVar, Generic, List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

T = TypeVar('T')

class BaseRepository(Generic[T]):
    """
    Base repository following Single Responsibility Principle (SRP)
    and DRY (Don't Repeat Yourself) pattern.
    
    Single responsibility: Database operations only
    DRY: Common database operations implemented once
    """
    
    def __init__(self, db: Session, model: type):
        self.db = db
        self.model = model
    
    def get_by_id(self, id: int) -> Optional[T]:
        """Get entity by primary key"""
        return self.db.query(self.model).filter(self.model.id == id).first()
    
    def get_all(self, limit: int = 100, offset: int = 0) -> List[T]:
        """Get all entities with pagination"""
        return self.db.query(self.model).offset(offset).limit(limit).all()
    
    def create(self, obj_data: Dict[str, Any]) -> T:
        """Create new entity"""
        db_obj = self.model(**obj_data)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj
    
    def update(self, id: int, obj_data: Dict[str, Any]) -> Optional[T]:
        """Update existing entity"""
        db_obj = self.get_by_id(id)
        if db_obj:
            for key, value in obj_data.items():
                if hasattr(db_obj, key):
                    setattr(db_obj, key, value)
            self.db.commit()
            self.db.refresh(db_obj)
        return db_obj
    
    def delete(self, id: int) -> bool:
        """Delete entity by primary key"""
        db_obj = self.get_by_id(id)
        if db_obj:
            self.db.delete(db_obj)
            self.db.commit()
            return True
        return False
    
    def find_by_criteria(self, criteria: Dict[str, Any]) -> List[T]:
        """Find entities by multiple criteria"""
        query = self.db.query(self.model)
        
        for field, value in criteria.items():
            if hasattr(self.model, field):
                if isinstance(value, list):
                    query = query.filter(getattr(self.model, field).in_(value))
                else:
                    query = query.filter(getattr(self.model, field) == value)
        
        return query.all()
    
    def count(self) -> int:
        """Get total count of entities"""
        return self.db.query(self.model).count()
    
    def exists(self, id: int) -> bool:
        """Check if entity exists"""
        return self.db.query(self.model).filter(self.model.id == id).first() is not None 