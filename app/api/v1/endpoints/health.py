"""Health check endpoints for the application."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core import deps
from app.db.session import get_engine, check_pool_status, get_connection_metrics
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/")
def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "database": "connected",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": "production",
        "version": "1.0.0"
    }

@router.get("/db-test")
def database_test():
    """Test database connection."""
    try:
        engine = get_engine()
        with engine.connect() as conn:
            result = conn.execute("SELECT 1 as test")
            row = result.fetchone()
            
            # Get database info
            db_info = conn.execute("SELECT current_database() as db_name, current_user as db_user")
            db_row = db_info.fetchone()
            
            return {
                "status": "success",
                "database": {
                    "test": row[0],
                    "database_name": db_row[0],
                    "user": db_row[1],
                    "url": str(engine.url).replace(str(engine.url.password), "***") if engine.url.password else str(engine.url)
                },
                "timestamp": datetime.utcnow().isoformat()
            }
    except Exception as e:
        logger.error(f"Database test failed: {e}")
        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

@router.get("/session-test")
def session_test(db: Session = Depends(deps.get_db)):
    """Test database session."""
    try:
        result = db.execute("SELECT 1 as test")
        row = result.fetchone()
        return {
            "status": "success",
            "session_test": row[0],
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Session test failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/db-pool")
def database_pool_status():
    """Get database connection pool status."""
    try:
        pool_stats = check_pool_status()
        return {
            "status": "success",
            "pool": pool_stats,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Pool status check failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/db-metrics")
def database_connection_metrics():
    """Get comprehensive database connection metrics."""
    try:
        metrics = get_connection_metrics()
        return {
            "status": "success",
            "metrics": metrics,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Connection metrics failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/detailed")
def detailed_health_check():
    """Comprehensive health check with database monitoring."""
    try:
        # Get connection metrics
        metrics = get_connection_metrics()
        
        # Determine overall status
        overall_status = "healthy"
        if not metrics.get("database_reachable", False):
            overall_status = "unhealthy"
        elif metrics.get("pool_stats", {}).get("status") == "critical":
            overall_status = "critical"
        elif metrics.get("pool_stats", {}).get("status") == "warning":
            overall_status = "degraded"
        
        return {
            "status": overall_status,
            "database": {
                "reachable": metrics.get("database_reachable", False),
                "connection_time_ms": metrics.get("connection_time_ms"),
                "pool_status": metrics.get("pool_stats", {}).get("status", "unknown"),
                "pool_utilization": f"{metrics.get('pool_stats', {}).get('utilization_percent', 0)}%"
            },
            "metrics": metrics,
            "timestamp": datetime.utcnow().isoformat(),
            "environment": "production",
            "version": "1.0.0"
        }
    except Exception as e:
        logger.error(f"Detailed health check failed: {e}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        } 