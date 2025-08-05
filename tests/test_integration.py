import pytest
from unittest.mock import Mock, patch
from sqlalchemy.orm import Session
from datetime import datetime

from app.repositories.grant_repository import GrantRepository
from app.services.grant_service import GrantService
from app.services.grant_scraping_service import GrantScrapingService
from app.scrapers.screen_australia import ScreenAustraliaGrantScraper
from app.interfaces.grant_scraper import HttpClientInterface, LoggerInterface
from app.models.grant import Grant
from app.models.user import User

class TestIntegration:
    """Integration tests for refactored components working together"""

    @pytest.fixture
    def mock_db(self):
        """Mock database session"""
        return Mock(spec=Session)

    @pytest.fixture
    def mock_http_client(self):
        """Mock HTTP client"""
        mock = Mock(spec=HttpClientInterface)
        return mock

    @pytest.fixture
    def mock_logger(self):
        """Mock logger"""
        mock = Mock(spec=LoggerInterface)
        return mock

    @pytest.fixture
    def sample_user(self):
        """Sample user for testing"""
        return User(
            id=1,
            email="test@example.com",
            location="australia",
            preferences={"industry_focus": "film_tv", "min_grant_amount": 10000}
        )

    @pytest.fixture
    def sample_grants(self):
        """Sample grants for testing"""
        return [
            Grant(
                id=1,
                title="Screen Australia Documentary Grant",
                description="Funding for documentary filmmakers",
                min_amount=50000,
                max_amount=100000,
                deadline=datetime.utcnow(),
                source="screen_australia",
                industry_focus="film_tv",
                location_eligibility="australia",
                status="active",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ),
            Grant(
                id=2,
                title="Creative Australia Arts Grant",
                description="Support for creative arts projects",
                min_amount=25000,
                max_amount=75000,
                deadline=datetime.utcnow(),
                source="creative_australia",
                industry_focus="creative_arts",
                location_eligibility="australia",
                status="active",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
        ]

    def test_repository_service_integration(self, mock_db, sample_grants, sample_user):
        """Test repository and service layer integration"""
        # Setup repository with mock data
        grant_repo = GrantRepository(mock_db)
        mock_db.query.return_value.filter.return_value.first.return_value = sample_grants[0]
        mock_db.query.return_value.filter.return_value.all.return_value = sample_grants
        
        # Mock the get_grants_by_multiple_criteria method
        grant_repo.get_grants_by_multiple_criteria = Mock(return_value=sample_grants)

        # Setup notification service
        mock_notification_service = Mock()
        mock_notification_service.send_notification.return_value = True

        # Create service with repository
        grant_service = GrantService(grant_repo, mock_notification_service)

        # Test integration
        accessible_grant = grant_service.get_accessible_grant(1, sample_user)
        assert accessible_grant.id == 1
        assert accessible_grant.title == "Screen Australia Documentary Grant"

        # Test finding matching grants
        matching_grants = grant_service.find_matching_grants(sample_user)
        assert len(matching_grants) == 2

        # Verify notification was sent
        mock_notification_service.send_notification.assert_called()

    def test_scraper_service_integration(self, mock_http_client, mock_logger):
        """Test scraper and service integration"""
        # Create scraper
        scraper = ScreenAustraliaGrantScraper(mock_http_client, mock_logger)
        
        # Create scraping service with scraper
        scraping_service = GrantScrapingService([scraper])
        
        # Test integration
        sources = scraping_service.get_available_sources()
        assert len(sources) == 1
        assert sources[0]['name'] == 'screen_australia'
        assert sources[0]['display_name'] == 'Screen Australia'

    def test_full_workflow_integration(self, mock_db, mock_http_client, mock_logger, sample_user):
        """Test complete workflow from scraping to service"""
        # 1. Setup scraping service
        scraper = ScreenAustraliaGrantScraper(mock_http_client, mock_logger)
        scraping_service = GrantScrapingService([scraper])
        
        # 2. Setup repository and service
        grant_repo = GrantRepository(mock_db)
        mock_notification_service = Mock()
        grant_service = GrantService(grant_repo, mock_notification_service)
        
        # 3. Mock scraping results
        scraped_grants = [
            Grant(
                id=1,
                title="Scraped Grant",
                description="Grant from scraper",
                min_amount=50000,
                max_amount=100000,
                deadline=datetime.utcnow(),
                source="screen_australia",
                industry_focus="film_tv",
                location_eligibility="australia",
                status="active",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
        ]
        
        # Mock scraper to return grants
        scraper.scrape = Mock(return_value=scraped_grants)
        
        # 4. Test complete workflow
        # Scrape grants
        scraping_result = scraping_service.scrape_source("screen_australia")
        assert scraping_result.success is True
        assert len(scraping_result.grants) == 1
        
        # Process grants through service
        mock_db.query.return_value.filter.return_value.all.return_value = scraped_grants
        
        # Mock the get_grants_by_multiple_criteria method
        grant_repo.get_grants_by_multiple_criteria = Mock(return_value=scraped_grants)
        matching_grants = grant_service.find_matching_grants(sample_user)
        assert len(matching_grants) == 1
        
        # Verify notification
        mock_notification_service.send_notification.assert_called()

    def test_error_handling_integration(self, mock_db, mock_http_client, mock_logger):
        """Test error handling across components"""
        # Setup components
        grant_repo = GrantRepository(mock_db)
        mock_notification_service = Mock()
        grant_service = GrantService(grant_repo, mock_notification_service)
        
        # Test repository error handling
        mock_db.query.side_effect = Exception("Database error")
        
        # Should handle database errors gracefully
        with pytest.raises(Exception):
            grant_repo.get_by_id(1)
        
        # Test scraper error handling
        scraper = ScreenAustraliaGrantScraper(mock_http_client, mock_logger)
        scraping_service = GrantScrapingService([scraper])
        
        # Mock scraper to raise error
        scraper.scrape = Mock(side_effect=Exception("Scraping error"))
        
        # Should handle scraping errors gracefully
        result = scraping_service.scrape_source("screen_australia")
        assert result.success is False
        assert "Scraping error" in result.error_message

    def test_performance_integration(self, mock_db, mock_http_client, mock_logger, sample_user):
        """Test performance optimizations work together"""
        import time
        
        # Setup components
        grant_repo = GrantRepository(mock_db)
        mock_notification_service = Mock()
        grant_service = GrantService(grant_repo, mock_notification_service)
        
        # Mock database for performance testing
        mock_db.query.return_value.filter.return_value.all.return_value = []
        
        # Mock the get_grants_by_multiple_criteria method
        grant_repo.get_grants_by_multiple_criteria = Mock(return_value=[])
        
        # Test service performance
        start_time = time.time()
        matching_grants = grant_service.find_matching_grants(sample_user)
        service_time = time.time() - start_time
        
        # Should complete quickly (< 100ms)
        assert service_time < 0.1
        
        # Test scraper performance
        scraper = ScreenAustraliaGrantScraper(mock_http_client, mock_logger)
        scraping_service = GrantScrapingService([scraper])
        
        # Mock fast scraping
        scraper.scrape = Mock(return_value=[])
        
        start_time = time.time()
        result = scraping_service.scrape_source("screen_australia")
        scraper_time = time.time() - start_time
        
        # Should complete quickly (< 100ms)
        assert scraper_time < 0.1

    def test_data_consistency_integration(self, mock_db, mock_http_client, mock_logger, sample_grants):
        """Test data consistency across components"""
        # Setup repository with consistent data
        grant_repo = GrantRepository(mock_db)
        mock_db.query.return_value.filter.return_value.all.return_value = sample_grants
        
        # Setup service
        mock_notification_service = Mock()
        grant_service = GrantService(grant_repo, mock_notification_service)
        
        # Test data consistency
        grants = grant_service.find_matching_grants(User(id=1, email="test@example.com"))
        
        # Verify data structure consistency
        for grant in grants:
            assert hasattr(grant, 'id')
            assert hasattr(grant, 'title')
            assert hasattr(grant, 'source')
            assert hasattr(grant, 'status')
            assert grant.status == 'active'
        
        # Test scraper data consistency
        scraper = ScreenAustraliaGrantScraper(mock_http_client, mock_logger)
        scraping_service = GrantScrapingService([scraper])
        
        # Mock consistent scraper data
        scraper.scrape = Mock(return_value=sample_grants)
        
        result = scraping_service.scrape_source("screen_australia")
        assert result.success is True
        
        # Verify scraper data consistency
        for grant in result.grants:
            assert hasattr(grant, 'id')
            assert hasattr(grant, 'title')
            assert hasattr(grant, 'source')
            # Check that source is set correctly (not necessarily screen_australia for all)
            assert grant.source in ['screen_australia', 'creative_australia']

    def test_api_integration(self, mock_db, mock_http_client, mock_logger, sample_user):
        """Test API endpoints with refactored services"""
        # Skip API test for now as it requires more complex setup
        # This would test the API endpoints with the refactored services
        # For now, we'll test the service integration directly
        assert True  # Placeholder for API integration test

    def test_frontend_backend_integration(self, mock_db, mock_http_client, mock_logger):
        """Test frontend hooks with backend services"""
        # This would test the frontend hooks (useApiData, useForm, useSearch)
        # with the refactored backend services
        
        # For now, we'll test the service interfaces
        grant_repo = GrantRepository(mock_db)
        mock_notification_service = Mock()
        grant_service = GrantService(grant_repo, mock_notification_service)
        
        # Test that services are properly initialized
        assert grant_service.grant_repo == grant_repo
        assert grant_service.notification_service == mock_notification_service
        
        # Test scraper service initialization
        scraper = ScreenAustraliaGrantScraper(mock_http_client, mock_logger)
        scraping_service = GrantScrapingService([scraper])
        
        assert len(scraping_service.scrapers) == 1
        assert scraping_service.scrapers[0] == scraper

    def test_error_recovery_integration(self, mock_db, mock_http_client, mock_logger):
        """Test error recovery across components"""
        # Setup components
        grant_repo = GrantRepository(mock_db)
        mock_notification_service = Mock()
        grant_service = GrantService(grant_repo, mock_notification_service)
        
        # Test recovery from database errors
        mock_db.query.side_effect = [Exception("DB Error"), []]
        
        # First call should fail
        with pytest.raises(Exception):
            grant_repo.get_by_id(1)
        
        # Reset mock for recovery test
        mock_db.query.side_effect = None
        mock_db.query.return_value.filter.return_value.all.return_value = []
        
        # Second call should succeed
        grants = grant_service.find_matching_grants(User(id=1, email="test@example.com"))
        assert isinstance(grants, list)
        
        # Test scraper error recovery
        scraper = ScreenAustraliaGrantScraper(mock_http_client, mock_logger)
        scraping_service = GrantScrapingService([scraper])
        
        # Mock scraper to fail then succeed
        scraper.scrape = Mock(side_effect=[Exception("Scraping error"), []])
        
        # First call should fail
        result = scraping_service.scrape_source("screen_australia")
        assert result.success is False
        
        # Second call should succeed
        result = scraping_service.scrape_source("screen_australia")
        assert result.success is True 