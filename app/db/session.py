import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
import logging
import time
from typing import Dict, Any

# Configure logging
logger = logging.getLogger(__name__)

# Global engine variable
_engine = None
_SessionLocal = None

# Global error tracking
_last_connection_error = None

def get_engine():
    """Create SQLAlchemy engine with absolute minimal configuration."""
    global _engine
    
    if _engine is not None:
        return _engine
    
    # Get DATABASE_URL
    database_url = settings.DATABASE_URL
    
    if not database_url:
        if settings.ENV == "production":
            raise RuntimeError("DATABASE_URL environment variable is required in production")
        else:
            database_url = "postgresql://alanmccarthy@localhost:5432/navimpact_db"
    
    try:
        # Create engine with minimal configuration
        _engine = create_engine(database_url)
        
        # Test connection
        with _engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        
        logger.info("Database connection successful")
        return _engine
        
    except Exception as e:
        error_msg = f"Failed to create database engine: {str(e)}"
        logger.error(error_msg)
        global _last_connection_error
        _last_connection_error = {"error": error_msg, "timestamp": time.time()}
        raise RuntimeError(error_msg)

def get_session_local():
    """Get database session factory."""
    global _SessionLocal
    
    if _SessionLocal is None:
        engine = get_engine()
        _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    return _SessionLocal

def close_database():
    """Close database connections."""
    global _engine
    if _engine:
        _engine.dispose()
        logger.info("Database connections closed")

def get_last_connection_error():
    """Get the last database connection error."""
    global _last_connection_error
    return _last_connection_error

def get_db():
    """Get database session with automatic closing."""
    SessionLocal = get_session_local()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def health_check():
    """Check database health."""
    try:
        engine = get_engine()
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception as e:
        logger.error(f"Database health check failed: {str(e)}")
        return False

def check_pool_status() -> Dict[str, Any]:
    """Check connection pool status for monitoring."""
    try:
        engine = get_engine()
        pool = engine.pool
        
        # Get pool statistics
        pool_stats = {
            "pool_size": pool.size(),
            "checked_out": pool.checkedout(),
            "overflow": pool.overflow(),
            "checked_in": pool.checkedin(),
            "available": pool.size() - pool.checkedout(),
            "utilization_percent": round((pool.checkedout() / pool.size()) * 100, 2) if pool.size() > 0 else 0,
            "status": "healthy"
        }
        
        # Log warning if pool utilization is high
        if pool_stats["utilization_percent"] > 80:
            logger.warning(f"High database pool utilization: {pool_stats['utilization_percent']}%")
            pool_stats["status"] = "warning"
        
        # Log critical if pool is nearly exhausted
        if pool_stats["utilization_percent"] > 95:
            logger.error(f"Critical database pool utilization: {pool_stats['utilization_percent']}%")
            pool_stats["status"] = "critical"
        
        # Log pool stats periodically
        logger.info(f"DB Pool: {pool_stats['checked_out']}/{pool_stats['pool_size']} connections in use ({pool_stats['utilization_percent']}%)")
        
        return pool_stats
        
    except Exception as e:
        logger.error(f"Failed to check pool status: {str(e)}")
        return {
            "error": str(e),
            "status": "error",
            "pool_size": 0,
            "checked_out": 0,
            "available": 0,
            "utilization_percent": 0
        }

def get_connection_metrics() -> Dict[str, Any]:
    """Get comprehensive database connection metrics."""
    try:
        engine = get_engine()
        pool_stats = check_pool_status()
        
        # Test connection speed
        start_time = time.time()
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        connection_time_ms = round((time.time() - start_time) * 1000, 2)
        
        metrics = {
            "connection_time_ms": connection_time_ms,
            "pool_stats": pool_stats,
            "database_reachable": True,
            "last_error": get_last_connection_error(),
            "timestamp": time.time()
        }
        
        return metrics
        
    except Exception as e:
        logger.error(f"Failed to get connection metrics: {str(e)}")
        return {
            "connection_time_ms": None,
            "database_reachable": False,
            "error": str(e),
            "last_error": get_last_connection_error(),
            "timestamp": time.time()
        } 