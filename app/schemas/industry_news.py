from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from datetime import datetime

class IndustryNewsBase(BaseModel):
    title: str
    summary: Optional[str] = None
    url: str
    source: Optional[str] = None
    sector: str
    published_at: Optional[datetime] = None

class IndustryNewsCreate(IndustryNewsBase):
    url_hash: str

class IndustryNewsUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    url: Optional[str] = None
    source: Optional[str] = None
    sector: Optional[str] = None
    relevance_score: Optional[float] = None
    published_at: Optional[datetime] = None

class IndustryNewsResponse(IndustryNewsBase):
    id: int
    url_hash: str
    relevance_score: float
    created_at: datetime
    
    class Config:
        from_attributes = True

class NewsRefreshResponse(BaseModel):
    total_fetched: int
    saved: int
    deleted_old: int
    message: str

class UserNewsRequest(BaseModel):
    sectors: List[str]
    limit: Optional[int] = 20 