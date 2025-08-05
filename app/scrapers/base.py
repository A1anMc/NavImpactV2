from typing import List, Dict, Any, Optional
from datetime import datetime
import re
from bs4 import BeautifulSoup
from abc import abstractmethod

from app.interfaces.grant_scraper import (
    GrantScraperInterface, 
    HttpClientInterface, 
    LoggerInterface,
    ScrapingError,
    HttpError
)
from app.models.grant import Grant

class BaseGrantScraper(GrantScraperInterface):
    """
    Base implementation with common scraping logic (DRY principle).
    Implements template method pattern - common flow with specific parsing.
    """
    
    def __init__(self, http_client: HttpClientInterface, logger: LoggerInterface):
        self.http_client = http_client
        self.logger = logger
    
    def scrape(self) -> List[Grant]:
        """
        Template method - common scraping flow for all grant sources.
        Delegates specific parsing to subclasses.
        """
        try:
            self.logger.info(f"Starting scrape of {self.source_name}")
            
            # Common HTTP request logic
            response = self.http_client.get(
                self.source_url,
                headers=self._get_headers(),
                timeout=30
            )
            
            if response.status_code != 200:
                raise ScrapingError(f"HTTP {response.status_code} from {self.source_name}")
            
            # Delegate parsing to specific implementation
            grants = self._parse_grants(response.content)
            
            # Validate and normalize grants
            validated_grants = []
            for grant in grants:
                if self._validate_grant(grant):
                    normalized_grant = self._normalize_grant(grant)
                    validated_grants.append(normalized_grant)
            
            self.logger.info(f"Successfully scraped {len(validated_grants)} grants from {self.source_name}")
            return validated_grants
            
        except HttpError as e:
            self.logger.error(f"HTTP error scraping {self.source_name}: {str(e)}")
            raise ScrapingError(f"HTTP error scraping {self.source_name}: {str(e)}")
        except Exception as e:
            self.logger.error(f"Failed to scrape {self.source_name}: {str(e)}")
            raise ScrapingError(f"Scraping failed for {self.source_name}: {str(e)}")
    
    @abstractmethod
    def _parse_grants(self, content: str) -> List[Grant]:
        """
        Subclasses implement specific parsing logic.
        This is where the specific HTML parsing happens.
        """
        pass
    
    def _get_headers(self) -> Dict[str, str]:
        """Common headers for all scrapers"""
        return {
            'User-Agent': 'NavImpact-GrantScraper/1.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
    
    def _validate_grant(self, grant: Grant) -> bool:
        """Validate that a grant has required fields"""
        if not grant.title or not grant.title.strip():
            self.logger.warning(f"Grant missing title from {self.source_name}")
            return False
        
        if not grant.source:
            grant.source = self.source_name
        
        if not grant.status:
            grant.status = "active"
        
        return True
    
    def _normalize_grant(self, grant: Grant) -> Grant:
        """Normalize grant data for consistency across sources"""
        # Normalize title
        if grant.title:
            grant.title = grant.title.strip()
        
        # Normalize description
        if grant.description:
            grant.description = grant.description.strip()
        
        # Normalize industry focus
        if grant.industry_focus:
            grant.industry_focus = self._normalize_industry(grant.industry_focus)
        
        # Normalize location eligibility
        if grant.location_eligibility:
            grant.location_eligibility = self._normalize_location(grant.location_eligibility)
        
        # Normalize organization types
        if grant.org_type_eligible:
            grant.org_type_eligible = self._normalize_org_types(grant.org_type_eligible)
        
        # Set timestamps
        now = datetime.utcnow()
        if not grant.created_at:
            grant.created_at = now
        grant.updated_at = now
        
        return grant
    
    def _normalize_industry(self, industry: str) -> str:
        """Normalize industry focus to standard values"""
        industry_lower = industry.lower().strip()
        
        # Map common variations to standard values
        industry_mapping = {
            'film': 'film_tv',
            'television': 'film_tv',
            'tv': 'film_tv',
            'media': 'digital_media',
            'digital': 'digital_media',
            'arts': 'creative_arts',
            'creative': 'creative_arts',
            'culture': 'creative_arts',
            'technology': 'tech_innovation',
            'tech': 'tech_innovation',
            'innovation': 'tech_innovation',
            'business': 'business_enterprise',
            'enterprise': 'business_enterprise',
            'community': 'community_social',
            'social': 'community_social',
            'health': 'health_wellbeing',
            'wellbeing': 'health_wellbeing',
            'education': 'education_training',
            'training': 'education_training',
            'environment': 'environment_sustainability',
            'sustainability': 'environment_sustainability',
        }
        
        return industry_mapping.get(industry_lower, industry_lower)
    
    def _normalize_location(self, location: str) -> str:
        """Normalize location eligibility to standard values"""
        location_lower = location.lower().strip()
        
        # Map common variations to standard values
        location_mapping = {
            'australia': 'australia',
            'national': 'australia',
            'nsw': 'new_south_wales',
            'new south wales': 'new_south_wales',
            'vic': 'victoria',
            'victoria': 'victoria',
            'qld': 'queensland',
            'queensland': 'queensland',
            'wa': 'western_australia',
            'western australia': 'western_australia',
            'sa': 'south_australia',
            'south australia': 'south_australia',
            'tas': 'tasmania',
            'tasmania': 'tasmania',
            'nt': 'northern_territory',
            'northern territory': 'northern_territory',
            'act': 'australian_capital_territory',
            'australian capital territory': 'australian_capital_territory',
        }
        
        return location_mapping.get(location_lower, location_lower)
    
    def _normalize_org_types(self, org_types: List[str]) -> List[str]:
        """Normalize organization types to standard values"""
        if not org_types:
            return []
        
        normalized = []
        org_type_mapping = {
            'not-for-profit': 'not_for_profit',
            'non-profit': 'not_for_profit',
            'nonprofit': 'not_for_profit',
            'charity': 'charity',
            'charitable': 'charity',
            'business': 'business',
            'company': 'business',
            'corporation': 'business',
            'individual': 'individual',
            'person': 'individual',
            'artist': 'individual',
            'government': 'government',
            'local government': 'government',
            'state government': 'government',
            'federal government': 'government',
            'educational': 'educational',
            'education': 'educational',
            'school': 'educational',
            'university': 'educational',
            'research': 'research',
            'research institution': 'research',
        }
        
        for org_type in org_types:
            org_type_lower = org_type.lower().strip()
            normalized_type = org_type_mapping.get(org_type_lower, org_type_lower)
            if normalized_type not in normalized:
                normalized.append(normalized_type)
        
        return normalized
    
    def _extract_amount_from_text(self, text: str) -> Optional[float]:
        """Extract monetary amount from text"""
        if not text:
            return None
        
        # Common patterns for amounts
        patterns = [
            r'\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:million|mil|m)?',
            r'(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:million|mil|m)',
            r'up to \$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)',
            r'between \$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?) and \$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)',
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                if len(matches[0]) == 2:  # Range
                    min_amount = float(matches[0][0].replace(',', ''))
                    max_amount = float(matches[0][1].replace(',', ''))
                    return (min_amount + max_amount) / 2  # Return average
                else:
                    amount_str = matches[0].replace(',', '')
                    amount = float(amount_str)
                    
                    # Handle multipliers
                    if 'million' in text.lower() or 'mil' in text.lower() or 'm' in text.lower():
                        amount *= 1000000
                    
                    return amount
        
        return None
    
    def _extract_date_from_text(self, text: str) -> Optional[datetime]:
        """Extract date from text"""
        if not text:
            return None
        
        # Common date patterns
        patterns = [
            r'(\d{1,2})/(\d{1,2})/(\d{4})',  # MM/DD/YYYY
            r'(\d{1,2})-(\d{1,2})-(\d{4})',  # MM-DD-YYYY
            r'(\d{4})-(\d{1,2})-(\d{1,2})',  # YYYY-MM-DD
            r'(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{4})',  # DD MMM YYYY
        ]
        
        month_names = {
            'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
            'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
        }
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                match = matches[0]
                if len(match) == 3:
                    if match[1].lower() in month_names:  # DD MMM YYYY
                        day, month_name, year = match
                        month = month_names[month_name.lower()]
                    else:  # MM/DD/YYYY or YYYY-MM-DD
                        if len(match[0]) == 4:  # YYYY-MM-DD
                            year, month, day = match
                        else:  # MM/DD/YYYY
                            month, day, year = match
                        month = int(month)
                    
                    try:
                        return datetime(int(year), month, int(day))
                    except ValueError:
                        continue
        
        return None 