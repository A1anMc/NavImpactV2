import asyncio
import logging
from typing import List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.services.real_time_grants import RealTimeGrantService

router = APIRouter()
logger = logging.getLogger(__name__)

# Global real-time service instance
real_time_service: RealTimeGrantService = None

@router.websocket("/ws/grants")
async def grants_websocket(websocket: WebSocket, db: Session = Depends(get_db)):
    """WebSocket endpoint for real-time grant updates."""
    global real_time_service
    
    if real_time_service is None:
        real_time_service = RealTimeGrantService(db)
        
    await real_time_service.connect_websocket(websocket)
    
    try:
        await real_time_service.handle_websocket_messages(websocket)
    except WebSocketDisconnect:
        await real_time_service.disconnect_websocket(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await real_time_service.disconnect_websocket(websocket)

@router.post("/grants/real-time/start")
async def start_real_time_monitoring(db: Session = Depends(get_db)):
    """Start real-time grant monitoring."""
    global real_time_service
    
    if real_time_service is None:
        real_time_service = RealTimeGrantService(db)
        
    # Start monitoring in background
    asyncio.create_task(real_time_service.start_real_time_monitoring())
    
    return {"message": "Real-time grant monitoring started"}

@router.get("/grants/real-time/status")
async def get_real_time_status():
    """Get real-time monitoring status."""
    global real_time_service
    
    if real_time_service is None:
        return {
            "status": "not_started",
            "active_connections": 0,
            "last_scrape_time": None
        }
        
    return {
        "status": "active",
        "active_connections": len(real_time_service.active_connections),
        "last_scrape_time": real_time_service.last_scrape_time.isoformat()
    }

@router.post("/grants/real-time/matches")
async def get_real_time_matches(project_profile: dict, db: Session = Depends(get_db)):
    """Get real-time grant matches for a project profile."""
    global real_time_service
    
    if real_time_service is None:
        real_time_service = RealTimeGrantService(db)
        
    matches = real_time_service.get_grant_matches(project_profile)
    
    return {
        "matches": matches,
        "total_found": len(matches),
        "timestamp": datetime.utcnow().isoformat()
    }
