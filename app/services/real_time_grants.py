import asyncio
import logging
from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta
from fastapi import WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from app.models.grant import Grant
from app.services.scrapers.business_gov import BusinessGovScraper
from app.services.scrapers.australian_grants_scraper import AustralianGrantsScraper
from app.services.scrapers.grantconnect import GrantConnectScraper

logger = logging.getLogger(__name__)

class RealTimeGrantService:
    """Real-time grant discovery and notification service."""
    
    def __init__(self, db_session: Session):
        self.db = db_session
        self.active_connections: List[WebSocket] = []
        self.scrapers = {
            'business_gov': BusinessGovScraper(db_session),
            'australian_grants': AustralianGrantsScraper(db_session),
            'grantconnect': GrantConnectScraper(db_session)
        }
        self.last_scrape_time = datetime.utcnow()
        self.scrape_interval = timedelta(minutes=30)  # Scrape every 30 minutes
        
    async def start_real_time_monitoring(self):
        """Start real-time grant monitoring."""
        logger.info("Starting real-time grant monitoring")
        
        while True:
            try:
                await self.scrape_all_sources()
                await self.notify_new_grants()
                await asyncio.sleep(1800)  # Wait 30 minutes
            except Exception as e:
                logger.error(f"Error in real-time monitoring: {e}")
                await asyncio.sleep(300)  # Wait 5 minutes on error
                
    async def scrape_all_sources(self) -> List[Grant]:
        """Scrape all grant sources for new opportunities."""
        all_grants = []
        
        for source_name, scraper in self.scrapers.items():
            try:
                logger.info(f"Scraping {source_name} for new grants")
                grants = await scraper.scrape()
                all_grants.extend(grants)
                
                # Rate limiting between scrapers
                await asyncio.sleep(5)
                
            except Exception as e:
                logger.error(f"Error scraping {source_name}: {e}")
                continue
                
        return all_grants
        
    async def notify_new_grants(self):
        """Notify connected clients about new grants."""
        if not self.active_connections:
            return
            
        # Get recent grants (last 24 hours)
        recent_grants = self.db.query(Grant).filter(
            Grant.created_at >= datetime.utcnow() - timedelta(hours=24)
        ).all()
        
        if recent_grants:
            notification = {
                "type": "new_grants",
                "count": len(recent_grants),
                "grants": [
                    {
                        "id": grant.id,
                        "title": grant.title,
                        "source": grant.source,
                        "min_amount": float(grant.min_amount) if grant.min_amount else None,
                        "max_amount": float(grant.max_amount) if grant.max_amount else None,
                        "deadline": grant.deadline.isoformat() if grant.deadline else None
                    }
                    for grant in recent_grants
                ]
            }
            
            # Send to all connected clients
            for connection in self.active_connections:
                try:
                    await connection.send_json(notification)
                except Exception as e:
                    logger.error(f"Error sending notification: {e}")
                    self.active_connections.remove(connection)
                    
    async def connect_websocket(self, websocket: WebSocket):
        """Connect a new WebSocket client."""
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket connected. Total connections: {len(self.active_connections)}")
        
    async def disconnect_websocket(self, websocket: WebSocket):
        """Disconnect a WebSocket client."""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        logger.info(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")
        
    async def handle_websocket_messages(self, websocket: WebSocket):
        """Handle WebSocket messages from clients."""
        try:
            while True:
                message = await websocket.receive_json()
                
                if message.get("type") == "subscribe_grants":
                    # Send current grants to new subscriber
                    grants = self.db.query(Grant).filter(Grant.status == "active").limit(50).all()
                    
                    response = {
                        "type": "grants_update",
                        "grants": [
                            {
                                "id": grant.id,
                                "title": grant.title,
                                "source": grant.source,
                                "min_amount": float(grant.min_amount) if grant.min_amount else None,
                                "max_amount": float(grant.max_amount) if grant.max_amount else None,
                                "deadline": grant.deadline.isoformat() if grant.deadline else None,
                                "industry_focus": grant.industry_focus,
                                "location_eligibility": grant.location_eligibility
                            }
                            for grant in grants
                        ]
                    }
                    
                    await websocket.send_json(response)
                    
        except WebSocketDisconnect:
            await self.disconnect_websocket(websocket)
        except Exception as e:
            logger.error(f"WebSocket error: {e}")
            await self.disconnect_websocket(websocket)
            
    def get_grant_matches(self, project_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Get real-time grant matches for a project profile."""
        grants = self.db.query(Grant).filter(Grant.status == "active").all()
        
        matches = []
        for grant in grants:
            match_score = grant.calculate_match_score(project_profile)
            if match_score["score"] > 50:  # Only show good matches
                matches.append({
                    "grant": grant,
                    "match_score": match_score
                })
                
        # Sort by match score
        matches.sort(key=lambda x: x["match_score"]["score"], reverse=True)
        return matches[:10]  # Return top 10 matches
