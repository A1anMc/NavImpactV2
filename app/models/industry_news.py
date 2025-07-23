from sqlalchemy import Column, Integer, String, Text, DateTime, DECIMAL, Index
from sqlalchemy.sql import func
from app.db.base_class import Base

class IndustryNews(Base):
    __tablename__ = "industry_news"
    
    id = Column(Integer, primary_key=True, index=True)
    sector = Column(String(100), nullable=False, index=True)
    title = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)
    url = Column(Text, nullable=False)
    url_hash = Column(String(32), nullable=False, unique=True, index=True)
    source = Column(String(200), nullable=True)
    platform = Column(String(50), nullable=True, index=True)  # twitter, linkedin, facebook, website
    platform_icon = Column(String(50), nullable=True)  # icon name for display
    relevance_score = Column(DECIMAL(3, 2), default=0.50)
    published_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Create indexes for better query performance
    __table_args__ = (
        Index('idx_industry_news_sector_published', 'sector', 'published_at'),
        Index('idx_industry_news_relevance', 'relevance_score'),
        Index('idx_industry_news_created', 'created_at'),
        Index('idx_industry_news_platform', 'platform'),
    ) 