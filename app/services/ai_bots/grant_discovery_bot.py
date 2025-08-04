import asyncio
import logging
import aiohttp
import re
from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from dataclasses import dataclass
from sqlalchemy.orm import Session
import json
import time
import random

logger = logging.getLogger(__name__)

@dataclass
class GrantOpportunity:
    """Structured grant opportunity data"""
    title: str
    description: str
    amount: Optional[str]
    deadline: Optional[str]
    source: str
    url: str
    category: str
    eligibility: str
    success_probability: float
    ai_insights: Dict[str, Any]
    discovered_at: datetime
    last_updated: datetime

class GrantDiscoveryBot:
    """
    AI-powered grant discovery bot that intelligently searches and analyzes
    grant opportunities from multiple sources without requiring API keys.
    """
    
    def __init__(self, db_session: Session):
        self.db_session = db_session
        self.session = None
        self.discovered_grants = []
        self.rate_limits = {"requests_made": 0, "max_per_minute": 20}
        
        # AI analysis parameters
        self.keywords = [
            "film", "documentary", "media", "creative", "arts", "culture",
            "production", "development", "screen", "digital", "innovation"
        ]
        
        self.sources = {
            "screen_australia": {
                "base_url": "https://www.screenaustralia.gov.au",
                "endpoints": [
                    "/funding-and-support/narrative-content-development",
                    "/funding-and-support/narrative-content-production",
                    "/funding-and-support/documentary",
                    "/funding-and-support/games",
                    "/funding-and-support/online-and-games"
                ],
                "description": "Screen Australia - Government funding for screen content"
            },
            "business_gov": {
                "base_url": "https://business.gov.au",
                "endpoints": [
                    "/grants-and-programs/creative-industries",
                    "/grants-and-programs/arts-and-culture",
                    "/grants-and-programs/innovation-and-science"
                ],
                "description": "Business.gov.au - Creative industry grants"
            },
            "creative_australia": {
                "base_url": "https://creative.gov.au",
                "endpoints": [
                    "/investment-and-development/arts-projects-for-individuals-and-groups",
                    "/investment-and-development/arts-projects-for-organisations",
                    "/investment-and-development/four-year-funding"
                ],
                "description": "Creative Australia - Federal arts funding"
            }
        }
    
    async def initialize(self):
        """Initialize the bot session"""
        timeout = aiohttp.ClientTimeout(total=30)
        connector = aiohttp.TCPConnector(limit=10, limit_per_host=5)
        self.session = aiohttp.ClientSession(
            timeout=timeout,
            connector=connector,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        )
    
    async def close(self):
        """Close the bot session"""
        if self.session:
            await self.session.close()
    
    async def discover_grants(self) -> List[GrantOpportunity]:
        """Main method to discover grants from all sources"""
        logger.info("🤖 Starting AI Grant Discovery Bot")
        
        try:
            await self.initialize()
            
            # Discover grants from all sources concurrently
            tasks = []
            for source_name, source_config in self.sources.items():
                task = asyncio.create_task(
                    self._discover_from_source(source_name, source_config)
                )
                tasks.append(task)
            
            # Wait for all discoveries to complete
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Combine all discovered grants
            all_grants = []
            for result in results:
                if isinstance(result, list):
                    all_grants.extend(result)
                else:
                    logger.error(f"Error in grant discovery: {result}")
            
            # AI analysis and filtering
            analyzed_grants = await self._analyze_grants(all_grants)
            
            logger.info(f"🎯 Discovered {len(analyzed_grants)} relevant grants")
            return analyzed_grants
            
        except Exception as e:
            logger.error(f"Error in grant discovery: {str(e)}")
            return []
        finally:
            await self.close()
    
    async def _discover_from_source(self, source_name: str, source_config: Dict) -> List[GrantOpportunity]:
        """Discover grants from a specific source"""
        grants = []
        
        try:
            for endpoint in source_config["endpoints"]:
                url = f"{source_config['base_url']}{endpoint}"
                logger.info(f"🔍 Searching {source_name}: {url}")
                
                # Respectful rate limiting
                await self._rate_limit_delay()
                
                try:
                    async with self.session.get(url) as response:
                        if response.status == 200:
                            html = await response.text()
                            soup = BeautifulSoup(html, 'html.parser')
                            
                            # Extract grants using AI-powered parsing
                            source_grants = await self._extract_grants_from_page(
                                soup, url, source_name, source_config
                            )
                            grants.extend(source_grants)
                            
                            logger.info(f"✅ Found {len(source_grants)} grants from {source_name}")
                        else:
                            logger.warning(f"⚠️ Failed to access {url}: {response.status}")
                
                except Exception as e:
                    logger.error(f"Error scraping {url}: {str(e)}")
                    continue
        
        except Exception as e:
            logger.error(f"Error discovering from {source_name}: {str(e)}")
        
        return grants
    
    async def _extract_grants_from_page(self, soup: BeautifulSoup, url: str, source_name: str, source_config: Dict) -> List[GrantOpportunity]:
        """AI-powered grant extraction from HTML"""
        grants = []
        
        try:
            # Find grant opportunities using multiple strategies
            grant_elements = []
            
            # Strategy 1: Look for grant-specific patterns
            grant_elements.extend(soup.find_all(['div', 'article', 'section'], 
                                             class_=re.compile(r'grant|funding|opportunity|program', re.I)))
            
            # Strategy 2: Look for content with funding amounts
            grant_elements.extend(soup.find_all(text=re.compile(r'\$[\d,]+|funding|grant|opportunity', re.I)))
            
            # Strategy 3: Look for deadline information
            grant_elements.extend(soup.find_all(text=re.compile(r'deadline|closing|apply|application', re.I)))
            
            # Process each potential grant element
            for element in grant_elements:
                grant = await self._parse_grant_element(element, url, source_name)
                if grant:
                    grants.append(grant)
            
            # If no specific grants found, try to extract general funding information
            if not grants:
                grant = await self._extract_general_funding_info(soup, url, source_name)
                if grant:
                    grants.append(grant)
        
        except Exception as e:
            logger.error(f"Error extracting grants from {url}: {str(e)}")
        
        return grants
    
    async def _parse_grant_element(self, element, url: str, source_name: str) -> Optional[GrantOpportunity]:
        """Parse individual grant element using AI-like analysis"""
        try:
            # Extract text content
            text = element.get_text() if hasattr(element, 'get_text') else str(element)
            
            # AI analysis for relevance
            relevance_score = self._calculate_relevance_score(text)
            if relevance_score < 0.3:  # Only process relevant content
                return None
            
            # Extract grant information
            title = self._extract_title(element, text)
            description = self._extract_description(element, text)
            amount = self._extract_amount(text)
            deadline = self._extract_deadline(text)
            category = self._categorize_grant(text)
            eligibility = self._extract_eligibility(text)
            
            # Calculate success probability
            success_probability = self._calculate_success_probability(text, category)
            
            # Generate AI insights
            ai_insights = self._generate_ai_insights(text, category, amount)
            
            if title and description:
                return GrantOpportunity(
                    title=title,
                    description=description,
                    amount=amount,
                    deadline=deadline,
                    source=source_name,
                    url=url,
                    category=category,
                    eligibility=eligibility,
                    success_probability=success_probability,
                    ai_insights=ai_insights,
                    discovered_at=datetime.now(),
                    last_updated=datetime.now()
                )
        
        except Exception as e:
            logger.error(f"Error parsing grant element: {str(e)}")
        
        return None
    
    def _calculate_relevance_score(self, text: str) -> float:
        """Calculate relevance score using keyword matching"""
        text_lower = text.lower()
        score = 0.0
        
        # Keyword matching
        for keyword in self.keywords:
            if keyword in text_lower:
                score += 0.1
        
        # Funding amount presence
        if re.search(r'\$[\d,]+', text):
            score += 0.2
        
        # Deadline presence
        if re.search(r'deadline|closing|apply', text_lower):
            score += 0.2
        
        # Grant-specific terms
        grant_terms = ['grant', 'funding', 'opportunity', 'program']
        for term in grant_terms:
            if term in text_lower:
                score += 0.1
        
        return min(score, 1.0)
    
    def _extract_title(self, element, text: str) -> str:
        """Extract grant title using multiple strategies"""
        # Strategy 1: Look for headings
        if hasattr(element, 'find'):
            heading = element.find(['h1', 'h2', 'h3', 'h4'])
            if heading:
                return heading.get_text().strip()
        
        # Strategy 2: Look for strong/bold text
        if hasattr(element, 'find'):
            strong = element.find(['strong', 'b'])
            if strong:
                return strong.get_text().strip()
        
        # Strategy 3: Extract first meaningful sentence
        sentences = text.split('.')
        for sentence in sentences[:3]:  # Check first 3 sentences
            sentence = sentence.strip()
            if len(sentence) > 10 and any(keyword in sentence.lower() for keyword in self.keywords):
                return sentence
        
        return "Grant Opportunity"
    
    def _extract_description(self, element, text: str) -> str:
        """Extract grant description"""
        # Clean and truncate text
        description = text.replace('\n', ' ').replace('\r', ' ')
        description = re.sub(r'\s+', ' ', description).strip()
        
        # Limit length
        if len(description) > 500:
            description = description[:500] + "..."
        
        return description
    
    def _extract_amount(self, text: str) -> Optional[str]:
        """Extract funding amount"""
        amounts = re.findall(r'\$[\d,]+(?:\.\d{2})?', text)
        if amounts:
            return amounts[0]
        return None
    
    def _extract_deadline(self, text: str) -> Optional[str]:
        """Extract deadline information"""
        # Look for date patterns
        date_patterns = [
            r'deadline[:\s]+([A-Za-z]+\s+\d{1,2},?\s+\d{4})',
            r'closing[:\s]+([A-Za-z]+\s+\d{1,2},?\s+\d{4})',
            r'apply by[:\s]+([A-Za-z]+\s+\d{1,2},?\s+\d{4})',
            r'(\d{1,2}/\d{1,2}/\d{4})',
            r'(\d{1,2}\s+[A-Za-z]+\s+\d{4})'
        ]
        
        for pattern in date_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1)
        
        return None
    
    def _categorize_grant(self, text: str) -> str:
        """Categorize grant using AI-like analysis"""
        text_lower = text.lower()
        
        if any(word in text_lower for word in ['film', 'documentary', 'screen']):
            return "Film & Documentary"
        elif any(word in text_lower for word in ['digital', 'online', 'web']):
            return "Digital Media"
        elif any(word in text_lower for word in ['arts', 'culture', 'creative']):
            return "Arts & Culture"
        elif any(word in text_lower for word in ['innovation', 'technology']):
            return "Innovation & Technology"
        else:
            return "General Funding"
    
    def _extract_eligibility(self, text: str) -> str:
        """Extract eligibility information"""
        eligibility_keywords = ['eligible', 'eligibility', 'requirements', 'criteria']
        sentences = text.split('.')
        
        for sentence in sentences:
            sentence_lower = sentence.lower()
            if any(keyword in sentence_lower for keyword in eligibility_keywords):
                return sentence.strip()
        
        return "Contact source for eligibility details"
    
    def _calculate_success_probability(self, text: str, category: str) -> float:
        """Calculate success probability using AI-like analysis"""
        score = 0.5  # Base score
        
        # Category-specific scoring
        if category == "Film & Documentary":
            score += 0.2
        elif category == "Digital Media":
            score += 0.15
        elif category == "Arts & Culture":
            score += 0.1
        
        # Amount-based scoring
        amount_match = re.search(r'\$([\d,]+)', text)
        if amount_match:
            amount = int(amount_match.group(1).replace(',', ''))
            if amount > 100000:
                score += 0.1
            elif amount > 50000:
                score += 0.05
        
        # Deadline urgency
        if 'deadline' in text.lower() and 'soon' in text.lower():
            score -= 0.1  # Less time to prepare
        
        return min(max(score, 0.0), 1.0)
    
    def _generate_ai_insights(self, text: str, category: str, amount: Optional[str]) -> Dict[str, Any]:
        """Generate AI-powered insights about the grant"""
        insights = {
            "category": category,
            "keywords_found": [],
            "urgency_level": "normal",
            "complexity_score": 0.5,
            "recommended_actions": []
        }
        
        # Extract keywords
        for keyword in self.keywords:
            if keyword in text.lower():
                insights["keywords_found"].append(keyword)
        
        # Assess urgency
        urgency_indicators = ['deadline', 'closing', 'soon', 'urgent']
        urgency_count = sum(1 for indicator in urgency_indicators if indicator in text.lower())
        if urgency_count >= 2:
            insights["urgency_level"] = "high"
        elif urgency_count >= 1:
            insights["urgency_level"] = "medium"
        
        # Assess complexity
        complexity_indicators = ['application', 'proposal', 'detailed', 'requirements']
        complexity_count = sum(1 for indicator in complexity_indicators if indicator in text.lower())
        insights["complexity_score"] = min(complexity_count * 0.2, 1.0)
        
        # Generate recommendations
        if insights["urgency_level"] == "high":
            insights["recommended_actions"].append("Start application immediately")
        if insights["complexity_score"] > 0.7:
            insights["recommended_actions"].append("Allocate significant time for application")
        if amount and int(amount.replace('$', '').replace(',', '')) > 100000:
            insights["recommended_actions"].append("Consider professional grant writing support")
        
        return insights
    
    async def _analyze_grants(self, grants: List[GrantOpportunity]) -> List[GrantOpportunity]:
        """Apply AI analysis to filter and rank grants"""
        analyzed_grants = []
        
        for grant in grants:
            # Apply AI filtering
            if grant.success_probability > 0.3:  # Only keep promising grants
                analyzed_grants.append(grant)
        
        # Sort by success probability
        analyzed_grants.sort(key=lambda x: x.success_probability, reverse=True)
        
        return analyzed_grants
    
    async def _rate_limit_delay(self):
        """Respectful rate limiting"""
        self.rate_limits["requests_made"] += 1
        
        if self.rate_limits["requests_made"] >= self.rate_limits["max_per_minute"]:
            await asyncio.sleep(60)  # Wait 1 minute
            self.rate_limits["requests_made"] = 0
        else:
            await asyncio.sleep(random.uniform(1, 3))  # Random delay
    
    async def _extract_general_funding_info(self, soup: BeautifulSoup, url: str, source_name: str) -> Optional[GrantOpportunity]:
        """Extract general funding information when specific grants aren't found"""
        try:
            text = soup.get_text()
            
            # Look for funding-related content
            if any(keyword in text.lower() for keyword in ['funding', 'grant', 'opportunity']):
                return GrantOpportunity(
                    title=f"{source_name.title()} Funding Opportunities",
                    description=f"General funding opportunities available from {source_name}",
                    amount=None,
                    deadline=None,
                    source=source_name,
                    url=url,
                    category="General Funding",
                    eligibility="Contact source for details",
                    success_probability=0.4,
                    ai_insights={"category": "General Funding", "keywords_found": [], "urgency_level": "normal", "complexity_score": 0.5, "recommended_actions": ["Contact source for specific opportunities"]},
                    discovered_at=datetime.now(),
                    last_updated=datetime.now()
                )
        
        except Exception as e:
            logger.error(f"Error extracting general funding info: {str(e)}")
        
        return None

# Usage example
async def run_grant_discovery_bot(db_session: Session) -> List[GrantOpportunity]:
    """Run the grant discovery bot"""
    bot = GrantDiscoveryBot(db_session)
    return await bot.discover_grants() 