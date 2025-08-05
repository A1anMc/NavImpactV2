from dataclasses import dataclass
from datetime import datetime
from typing import Any, Dict, List, Optional

from app.interfaces.grant_scraper import GrantScraperInterface, ScrapingError
from app.models.grant import Grant


@dataclass
class ScrapingResult:
    """Result of a scraping operation"""

    source_name: str
    grants: List[Grant]
    success: bool
    error_message: Optional[str] = None
    duration_seconds: float = 0.0


@dataclass
class ScrapingSummary:
    """Summary of all scraping operations"""

    total_grants: int
    successful_sources: int
    failed_sources: int
    total_duration: float
    results: List[ScrapingResult]


class GrantScrapingService:
    """
    Orchestrates all grant scrapers using Strategy pattern.
    Follows Single Responsibility Principle - only handles scraping orchestration.
    """

    def __init__(self, scrapers: List[GrantScraperInterface]):
        self.scrapers = scrapers
        self.logger = self._get_logger()

    def scrape_all_sources(self) -> ScrapingSummary:
        """
        Scrape all configured sources

        Returns:
            ScrapingSummary: Summary of all scraping operations
        """
        start_time = datetime.utcnow()
        results = []
        total_grants = 0
        successful_sources = 0
        failed_sources = 0

        self.logger.info(f"Starting scraping of {len(self.scrapers)} sources")

        for scraper in self.scrapers:
            result = self._scrape_source(scraper)
            results.append(result)

            if result.success:
                successful_sources += 1
                total_grants += len(result.grants)
                self.logger.info(
                    f"Successfully scraped {len(result.grants)} grants from {result.source_name}"
                )
            else:
                failed_sources += 1
                self.logger.error(
                    f"Failed to scrape {result.source_name}: {result.error_message}"
                )

        total_duration = (datetime.utcnow() - start_time).total_seconds()

        self.logger.info(
            f"Scraping completed: {successful_sources} successful, {failed_sources} failed, {total_grants} total grants"
        )

        return ScrapingSummary(
            total_grants=total_grants,
            successful_sources=successful_sources,
            failed_sources=failed_sources,
            total_duration=total_duration,
            results=results,
        )

    def scrape_source(self, source_name: str) -> Optional[ScrapingResult]:
        """
        Scrape specific source by name

        Args:
            source_name: Name of the source to scrape

        Returns:
            ScrapingResult: Result of scraping operation, or None if source not found
        """
        scraper = self._get_scraper_by_name(source_name)
        if not scraper:
            self.logger.warning(f"Unknown grant source: {source_name}")
            return None

        return self._scrape_source(scraper)

    def get_available_sources(self) -> List[Dict[str, str]]:
        """
        Get list of available scraping sources

        Returns:
            List[Dict]: List of source information
        """
        return [
            {
                "name": scraper.source_name,
                "display_name": getattr(
                    scraper, "source_display_name", scraper.source_name
                ),
                "url": scraper.source_url,
            }
            for scraper in self.scrapers
        ]

    def get_source_status(self, source_name: str) -> Optional[Dict[str, Any]]:
        """
        Get status of a specific source

        Args:
            source_name: Name of the source

        Returns:
            Dict: Status information for the source
        """
        scraper = self._get_scraper_by_name(source_name)
        if not scraper:
            return None

        # Test the scraper
        result = self._scrape_source(scraper)

        return {
            "name": source_name,
            "display_name": getattr(scraper, "source_display_name", source_name),
            "url": scraper.source_url,
            "status": "healthy" if result.success else "error",
            "last_check": datetime.utcnow().isoformat(),
            "error_message": result.error_message if not result.success else None,
            "grants_found": len(result.grants) if result.success else 0,
        }

    def _scrape_source(self, scraper: GrantScraperInterface) -> ScrapingResult:
        """
        Scrape a single source

        Args:
            scraper: The scraper to use

        Returns:
            ScrapingResult: Result of the scraping operation
        """
        start_time = datetime.utcnow()

        try:
            grants = scraper.scrape()
            duration = (datetime.utcnow() - start_time).total_seconds()

            return ScrapingResult(
                source_name=scraper.source_name,
                grants=grants,
                success=True,
                duration_seconds=duration,
            )

        except ScrapingError as e:
            duration = (datetime.utcnow() - start_time).total_seconds()

            return ScrapingResult(
                source_name=scraper.source_name,
                grants=[],
                success=False,
                error_message=str(e),
                duration_seconds=duration,
            )
        except Exception as e:
            duration = (datetime.utcnow() - start_time).total_seconds()

            return ScrapingResult(
                source_name=scraper.source_name,
                grants=[],
                success=False,
                error_message=f"Unexpected error: {str(e)}",
                duration_seconds=duration,
            )

    def _get_scraper_by_name(self, source_name: str) -> Optional[GrantScraperInterface]:
        """
        Get scraper by source name

        Args:
            source_name: Name of the source

        Returns:
            GrantScraperInterface: The scraper, or None if not found
        """
        for scraper in self.scrapers:
            if scraper.source_name == source_name:
                return scraper
        return None

    def _get_logger(self):
        """Get logger instance - in production, this would be injected"""

        # Simple logger implementation for now
        class SimpleLogger:
            def info(self, message: str):
                print(f"[INFO] {message}")

            def warning(self, message: str):
                print(f"[WARNING] {message}")

            def error(self, message: str):
                print(f"[ERROR] {message}")

            def debug(self, message: str):
                print(f"[DEBUG] {message}")

        return SimpleLogger()


def create_grant_scraping_service(http_client, logger) -> GrantScrapingService:
    """
    Factory function to create grant scraping service with all configured scrapers.
    Easy to add/remove scrapers by modifying this function.
    """
    from app.scrapers.screen_australia import ScreenAustraliaGrantScraper

    # from app.scrapers.creative_australia import CreativeAustraliaGrantScraper
    # from app.scrapers.youtube_creative import YouTubeCreativeFundScraper
    # Add more scrapers as they are implemented

    scrapers = [
        ScreenAustraliaGrantScraper(http_client, logger),
        # CreativeAustraliaGrantScraper(http_client, logger),
        # YouTubeCreativeFundScraper(http_client, logger),
        # Add new scrapers here - no existing code modification needed!
    ]

    return GrantScrapingService(scrapers)
