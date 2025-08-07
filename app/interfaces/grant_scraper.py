from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional

from app.models.grant import Grant


class GrantScraperInterface(ABC):
    """
    Interface for all grant scrapers - enables Open/Closed principle.
    Each scraper implements this interface, making it easy to add new sources.
    """

    @abstractmethod
    def scrape(self) -> List[Grant]:
        """
        Scrape grants from this source

        Returns:
            List[Grant]: List of grants found from this source

        Raises:
            ScrapingError: If scraping fails
        """

    @property
    @abstractmethod
    def source_name(self) -> str:
        """Unique identifier for this grant source"""

    @property
    @abstractmethod
    def source_url(self) -> str:
        """Base URL for this grant source"""

    @property
    @abstractmethod
    def source_display_name(self) -> str:
        """Human-readable name for this grant source"""


class HttpClientInterface(ABC):
    """
    Interface for HTTP client - enables dependency inversion.
    Allows easy testing and swapping HTTP implementations.
    """

    @abstractmethod
    def get(
        self, url: str, headers: Optional[Dict[str, str]] = None, timeout: int = 30
    ) -> "HttpResponse":
        """
        Make HTTP GET request

        Args:
            url: URL to request
            headers: Optional headers to include
            timeout: Request timeout in seconds

        Returns:
            HttpResponse: Response object

        Raises:
            HttpError: If request fails
        """

    @abstractmethod
    def post(
        self,
        url: str,
        data: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None,
        timeout: int = 30,
    ) -> "HttpResponse":
        """
        Make HTTP POST request

        Args:
            url: URL to request
            data: Optional data to send
            headers: Optional headers to include
            timeout: Request timeout in seconds

        Returns:
            HttpResponse: Response object

        Raises:
            HttpError: If request fails
        """


class HttpResponse:
    """Simple HTTP response object"""

    def __init__(self, status_code: int, content: str, headers: Dict[str, str] = None):
        self.status_code = status_code
        self.content = content
        self.headers = headers or {}


class LoggerInterface(ABC):
    """
    Interface for logging - enables dependency inversion.
    Allows easy testing and swapping logging implementations.
    """

    @abstractmethod
    def info(self, message: str) -> None:
        """Log info message"""

    @abstractmethod
    def warning(self, message: str) -> None:
        """Log warning message"""

    @abstractmethod
    def error(self, message: str) -> None:
        """Log error message"""

    @abstractmethod
    def debug(self, message: str) -> None:
        """Log debug message"""


class ScrapingError(Exception):
    """Raised when scraping fails"""


class HttpError(Exception):
    """Raised when HTTP request fails"""
