"""SGE Media Module Health Check Endpoint"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.deps import get_db

router = APIRouter()

@router.get("/sge-media-health")
async def sge_media_health_check(db: Session = Depends(get_db)):
    """Check if SGE Media tables exist and are accessible."""
    try:
        # Test if SGE Media tables exist
        result = db.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name LIKE 'sge_%'
            ORDER BY table_name
        """))
        
        tables = [row[0] for row in result.fetchall()]
        
        if tables:
            return {
                "status": "healthy",
                "message": "SGE Media tables exist",
                "tables": tables,
                "table_count": len(tables)
            }
        else:
            return {
                "status": "pending",
                "message": "SGE Media tables not found - migration needed",
                "tables": [],
                "table_count": 0
            }
            
    except Exception as e:
        return {
            "status": "error",
            "message": f"Database error: {str(e)}",
            "tables": [],
            "table_count": 0
        }
