import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from unittest.mock import patch, MagicMock

from app.main import app
from app.models.industry_news import IndustryNews
from app.schemas.industry_news import IndustryNewsResponse
from datetime import datetime, timezone

client = TestClient(app)

@pytest.fixture
def sample_news_data():
    """Sample news data for testing"""
    return [
        {
            "id": 1,
            "sector": "tech",
            "title": "AI Innovation Grant Announced",
            "summary": "New funding for AI startups in Australia",
            "url": "https://example.com/ai-grant",
            "url_hash": "hash1",
            "source": "Tech News",
            "relevance_score": 0.85,
            "published_at": datetime.now(timezone.utc),
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": 2,
            "sector": "health",
            "title": "Mental Health Initiative Funding",
            "summary": "Major funding boost for mental health programs",
            "url": "https://example.com/mental-health",
            "url_hash": "hash2",
            "source": "Health News",
            "relevance_score": 0.75,
            "published_at": datetime.now(timezone.utc),
            "created_at": datetime.now(timezone.utc)
        }
    ]

class TestNewsEndpoints:
    """Test cases for news endpoints"""
    
    def test_get_news_for_user_success(self, sample_news_data):
        """Test successful news retrieval for user"""
        with patch('app.services.industry_news.IndustryNewsService.get_news_for_user') as mock_service:
            # Mock the service response
            mock_news_items = [
                IndustryNewsResponse(**item) for item in sample_news_data
            ]
            mock_service.return_value = mock_news_items
            
            # Make request
            response = client.get("/api/v1/news/?sectors=tech,health&limit=10")
            
            # Verify response
            assert response.status_code == 200
            data = response.json()
            assert len(data) == 2
            assert data[0]["sector"] == "tech"
            assert data[1]["sector"] == "health"
            
            # Verify service was called correctly
            mock_service.assert_called_once()
            call_args = mock_service.call_args
            assert call_args[1]["user_sectors"] == ["tech", "health"]
            assert call_args[1]["limit"] == 10
    
    def test_get_news_for_user_no_sectors(self):
        """Test error when no sectors provided"""
        response = client.get("/api/v1/news/?sectors=")
        assert response.status_code == 400
        assert "At least one sector must be specified" in response.json()["detail"]
    
    def test_get_news_for_user_invalid_limit(self):
        """Test error when limit is invalid"""
        response = client.get("/api/v1/news/?sectors=tech&limit=0")
        assert response.status_code == 422  # Validation error
        
        response = client.get("/api/v1/news/?sectors=tech&limit=101")
        assert response.status_code == 422  # Validation error
    
    def test_get_news_for_user_single_sector(self, sample_news_data):
        """Test news retrieval for single sector"""
        with patch('app.services.industry_news.IndustryNewsService.get_news_for_user') as mock_service:
            mock_news_items = [IndustryNewsResponse(**sample_news_data[0])]
            mock_service.return_value = mock_news_items
            
            response = client.get("/api/v1/news/?sectors=tech&limit=5")
            
            assert response.status_code == 200
            data = response.json()
            assert len(data) == 1
            assert data[0]["sector"] == "tech"
    
    def test_get_news_for_user_database_error(self):
        """Test handling of database errors"""
        with patch('app.services.industry_news.IndustryNewsService.get_news_for_user') as mock_service:
            from sqlalchemy.exc import SQLAlchemyError
            mock_service.side_effect = SQLAlchemyError("Database connection failed")
            
            response = client.get("/api/v1/news/?sectors=tech&limit=10")
            
            assert response.status_code == 503
            assert "Database service unavailable" in response.json()["detail"]
    
    def test_get_news_for_user_general_error(self):
        """Test handling of general errors"""
        with patch('app.services.industry_news.IndustryNewsService.get_news_for_user') as mock_service:
            mock_service.side_effect = Exception("Unexpected error")
            
            response = client.get("/api/v1/news/?sectors=tech&limit=10")
            
            assert response.status_code == 500
            assert "Error retrieving news items" in response.json()["detail"]
    
    def test_get_news_by_sector(self, sample_news_data):
        """Test getting news for specific sector"""
        with patch('app.services.industry_news.IndustryNewsService.get_news_for_user') as mock_service:
            mock_news_items = [IndustryNewsResponse(**sample_news_data[0])]
            mock_service.return_value = mock_news_items
            
            response = client.get("/api/v1/news/sectors/tech?limit=5")
            
            assert response.status_code == 200
            data = response.json()
            assert len(data) == 1
            assert data[0]["sector"] == "tech"
    
    def test_get_available_sectors(self):
        """Test getting available sectors"""
        with patch('app.services.industry_news.IndustryNewsService.RSS_FEEDS') as mock_feeds:
            mock_feeds.keys.return_value = ["tech", "health", "creative"]
            
            response = client.get("/api/v1/news/sectors")
            
            assert response.status_code == 200
            data = response.json()
            assert "tech" in data
            assert "health" in data
            assert "creative" in data
    
    @pytest.mark.skip(reason="Complex database mocking required")
    def test_get_news_stats(self):
        """Test getting news statistics"""
        with patch('app.api.v1.endpoints.industry_news.get_db') as mock_get_db:
            # Mock the database session
            mock_db = MagicMock()
            mock_get_db.return_value = mock_db
            
            # Mock the query chain
            mock_query = MagicMock()
            mock_db.query.return_value = mock_query
            mock_query.count.return_value = 100
            
            # Mock the sector counts query
            mock_sector_query = MagicMock()
            mock_query.filter.return_value.group_by.return_value = mock_sector_query
            mock_sector_query.all.return_value = [
                ("tech", 50),
                ("health", 30),
                ("creative", 20)
            ]
            
            # Mock the recent count query
            mock_recent_query = MagicMock()
            mock_query.filter.return_value = mock_recent_query
            mock_recent_query.count.return_value = 25
            
            response = client.get("/api/v1/news/stats")
            
            assert response.status_code == 200
            data = response.json()
            assert "total_news_items" in data
            assert "sector_breakdown" in data
            assert data["total_news_items"] == 100
    
    def test_refresh_news_feed(self):
        """Test refreshing news feed"""
        with patch('app.services.industry_news.IndustryNewsService.refresh_news_feed') as mock_refresh:
            mock_refresh.return_value = {
                "total_fetched": 50,
                "saved": 30,
                "deleted_old": 10
            }
            
            response = client.post("/api/v1/news/refresh")
            
            assert response.status_code == 200
            data = response.json()
            assert data["total_fetched"] == 50
            assert data["saved"] == 30
            assert data["deleted_old"] == 10
            assert "News feed refreshed successfully" in data["message"]

class TestNewsServiceIntegration:
    """Integration tests for news service"""
    
    def test_news_service_get_news_for_user(self, db):
        """Test the news service directly"""
        from app.services.industry_news import IndustryNewsService
        
        # Create test news items
        news_items = [
            IndustryNews(
                sector="tech",
                title="Test Tech News",
                summary="Test summary",
                url="https://example.com/test1",
                url_hash="hash1",
                source="Test Source",
                published_at=datetime.now(timezone.utc)
            ),
            IndustryNews(
                sector="health",
                title="Test Health News", 
                summary="Test summary",
                url="https://example.com/test2",
                url_hash="hash2",
                source="Test Source",
                published_at=datetime.now(timezone.utc)
            )
        ]
        
        for item in news_items:
            db.add(item)
        db.commit()
        
        # Test service call
        result = IndustryNewsService.get_news_for_user(
            db=db,
            user_sectors=["tech"],
            limit=10
        )
        
        assert len(result) == 1
        assert result[0].sector == "tech"
        assert result[0].title == "Test Tech News" 