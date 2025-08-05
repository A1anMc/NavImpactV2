from typing import List, Optional
from bs4 import BeautifulSoup
from datetime import datetime
import re

from app.scrapers.base import BaseGrantScraper
from app.models.grant import Grant

class ScreenAustraliaGrantScraper(BaseGrantScraper):
    """
    Screen Australia specific grant scraper implementation.
    Follows Strategy pattern - specific parsing logic for Screen Australia format.
    """
    
    @property
    def source_name(self) -> str:
        return "screen_australia"
    
    @property
    def source_url(self) -> str:
        return "https://www.screenaustralia.gov.au/funding-and-support"
    
    @property
    def source_display_name(self) -> str:
        return "Screen Australia"
    
    def _parse_grants(self, content: str) -> List[Grant]:
        """
        Screen Australia specific parsing logic.
        Extracts grants from Screen Australia's funding page.
        """
        grants = []
        soup = BeautifulSoup(content, 'html.parser')
        
        # Look for grant opportunities in various containers
        grant_containers = soup.find_all(['div', 'article'], class_=lambda x: x and any(
            keyword in x.lower() for keyword in ['grant', 'funding', 'opportunity', 'program']
        ))
        
        if not grant_containers:
            # Fallback: look for any divs with funding-related text
            grant_containers = soup.find_all('div', string=lambda x: x and any(
                keyword in x.lower() for keyword in ['funding', 'grant', 'support', 'opportunity']
            ))
        
        for container in grant_containers:
            grant = self._extract_grant_from_container(container)
            if grant:
                grants.append(grant)
        
        # If no grants found in containers, try alternative parsing
        if not grants:
            grants = self._fallback_parsing(soup)
        
        return grants
    
    def _extract_grant_from_container(self, container) -> Optional[Grant]:
        """Extract grant information from a container element"""
        try:
            # Extract title
            title_elem = container.find(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
            title = title_elem.get_text().strip() if title_elem else None
            
            if not title:
                return None
            
            # Extract description
            description_elem = container.find(['p', 'div'], class_=lambda x: x and 'description' in x.lower())
            if not description_elem:
                description_elem = container.find('p')
            
            description = description_elem.get_text().strip() if description_elem else None
            
            # Extract amount
            amount_text = container.get_text()
            min_amount = self._extract_amount_from_text(amount_text)
            max_amount = min_amount  # Screen Australia often has fixed amounts
            
            # Extract deadline
            deadline = self._extract_deadline_from_container(container)
            
            # Extract application URL
            application_url = self._extract_application_url(container)
            
            # Extract contact email
            contact_email = self._extract_contact_email(container)
            
            # Determine industry focus (Screen Australia is primarily film/TV)
            industry_focus = "film_tv"
            
            # Determine location eligibility (Screen Australia is national)
            location_eligibility = "australia"
            
            # Determine organization types
            org_type_eligible = self._determine_org_types(container)
            
            # Determine funding purpose
            funding_purpose = self._determine_funding_purpose(container)
            
            # Determine audience tags
            audience_tags = self._determine_audience_tags(container)
            
            return Grant(
                title=title,
                description=description,
                source=self.source_name,
                source_url=self.source_url,
                application_url=application_url,
                contact_email=contact_email,
                min_amount=min_amount,
                max_amount=max_amount,
                deadline=deadline,
                industry_focus=industry_focus,
                location_eligibility=location_eligibility,
                org_type_eligible=org_type_eligible,
                funding_purpose=funding_purpose,
                audience_tags=audience_tags,
                status="active"
            )
            
        except Exception as e:
            self.logger.warning(f"Error extracting grant from container: {str(e)}")
            return None
    
    def _extract_deadline_from_container(self, container) -> Optional[datetime]:
        """Extract deadline from container text"""
        text = container.get_text()
        
        # Look for deadline patterns
        deadline_patterns = [
            r'deadline[:\s]+(\d{1,2}/\d{1,2}/\d{4})',
            r'closes[:\s]+(\d{1,2}/\d{1,2}/\d{4})',
            r'closing[:\s]+(\d{1,2}/\d{1,2}/\d{4})',
            r'apply by[:\s]+(\d{1,2}/\d{1,2}/\d{4})',
            r'application deadline[:\s]+(\d{1,2}/\d{1,2}/\d{4})',
        ]
        
        for pattern in deadline_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                date_str = match.group(1)
                return self._parse_date_string(date_str)
        
        return None
    
    def _extract_application_url(self, container) -> Optional[str]:
        """Extract application URL from container"""
        # Look for application links
        app_links = container.find_all('a', href=True, string=lambda x: x and any(
            keyword in x.lower() for keyword in ['apply', 'application', 'submit', 'register']
        ))
        
        if app_links:
            return app_links[0]['href']
        
        # Look for any links that might be application URLs
        all_links = container.find_all('a', href=True)
        for link in all_links:
            href = link['href']
            if any(keyword in href.lower() for keyword in ['apply', 'application', 'submit']):
                return href
        
        return None
    
    def _extract_contact_email(self, container) -> Optional[str]:
        """Extract contact email from container"""
        text = container.get_text()
        
        # Email pattern
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        match = re.search(email_pattern, text)
        
        if match:
            return match.group(0)
        
        return None
    
    def _determine_org_types(self, container) -> List[str]:
        """Determine eligible organization types from container"""
        text = container.get_text().lower()
        org_types = []
        
        # Screen Australia typically supports various org types
        if any(keyword in text for keyword in ['production company', 'producer', 'filmmaker']):
            org_types.append('business')
        
        if any(keyword in text for keyword in ['individual', 'filmmaker', 'director']):
            org_types.append('individual')
        
        if any(keyword in text for keyword in ['not-for-profit', 'charity']):
            org_types.append('not_for_profit')
        
        # Default to business if no specific types found
        if not org_types:
            org_types.append('business')
        
        return org_types
    
    def _determine_funding_purpose(self, container) -> List[str]:
        """Determine funding purpose from container"""
        text = container.get_text().lower()
        purposes = []
        
        # Screen Australia funding purposes
        if any(keyword in text for keyword in ['development', 'script development']):
            purposes.append('development')
        
        if any(keyword in text for keyword in ['production', 'filming', 'shooting']):
            purposes.append('production')
        
        if any(keyword in text for keyword in ['post-production', 'editing']):
            purposes.append('post_production')
        
        if any(keyword in text for keyword in ['distribution', 'marketing']):
            purposes.append('distribution')
        
        if any(keyword in text for keyword in ['festival', 'exhibition']):
            purposes.append('exhibition')
        
        # Default purposes
        if not purposes:
            purposes.extend(['development', 'production'])
        
        return purposes
    
    def _determine_audience_tags(self, container) -> List[str]:
        """Determine audience tags from container"""
        text = container.get_text().lower()
        tags = []
        
        # Screen Australia audience tags
        if any(keyword in text for keyword in ['documentary', 'doc']):
            tags.append('documentary')
        
        if any(keyword in text for keyword in ['drama', 'narrative']):
            tags.append('drama')
        
        if any(keyword in text for keyword in ['comedy']):
            tags.append('comedy')
        
        if any(keyword in text for keyword in ['indigenous', 'aboriginal']):
            tags.append('indigenous')
        
        if any(keyword in text for keyword in ['children', 'kids', 'family']):
            tags.append('children')
        
        if any(keyword in text for keyword in ['short film', 'short']):
            tags.append('short_film')
        
        if any(keyword in text for keyword in ['feature film', 'feature']):
            tags.append('feature_film')
        
        return tags
    
    def _fallback_parsing(self, soup: BeautifulSoup) -> List[Grant]:
        """Fallback parsing when standard containers aren't found"""
        grants = []
        
        # Look for any text that mentions funding or grants
        funding_texts = soup.find_all(string=lambda x: x and any(
            keyword in x.lower() for keyword in ['funding', 'grant', 'support', 'opportunity']
        ))
        
        for text in funding_texts:
            # Try to extract grant information from text
            grant = self._extract_grant_from_text(text)
            if grant:
                grants.append(grant)
        
        return grants
    
    def _extract_grant_from_text(self, text: str) -> Optional[Grant]:
        """Extract grant information from text"""
        # This is a simplified fallback - in practice, you'd want more sophisticated parsing
        if 'funding' in text.lower() or 'grant' in text.lower():
            return Grant(
                title=f"Screen Australia Grant - {text[:50]}...",
                description=text,
                source=self.source_name,
                source_url=self.source_url,
                industry_focus="film_tv",
                location_eligibility="australia",
                status="active"
            )
        
        return None
    
    def _parse_date_string(self, date_str: str) -> Optional[datetime]:
        """Parse date string in various formats"""
        try:
            # Try common date formats
            for fmt in ['%d/%m/%Y', '%m/%d/%Y', '%Y-%m-%d', '%d-%m-%Y']:
                try:
                    return datetime.strptime(date_str, fmt)
                except ValueError:
                    continue
            
            # If all formats fail, try to extract with regex
            return self._extract_date_from_text(date_str)
            
        except Exception:
            return None 