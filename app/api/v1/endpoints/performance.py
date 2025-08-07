"""
Performance Metrics API Endpoint
Provides real-time performance monitoring data
"""

from app.core.deps import get_db
from app.core.performance_monitor import (get_performance_metrics,
                                          reset_performance_metrics)
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/metrics")
async def get_metrics(db: Session = Depends(get_db)):
    """Get current performance metrics."""
    try:
        metrics = get_performance_metrics()
        return {
            "status": "success",
            "data": metrics,
            "message": "Performance metrics retrieved successfully",
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error retrieving metrics: {str(e)}"
        )


@router.post("/metrics/reset")
async def reset_metrics(db: Session = Depends(get_db)):
    """Reset performance metrics (admin only)."""
    try:
        reset_performance_metrics()
        return {
            "status": "success",
            "message": "Performance metrics reset successfully",
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error resetting metrics: {str(e)}"
        )


@router.get("/health/detailed")
async def detailed_health_check(db: Session = Depends(get_db)):
    """Detailed health check with performance metrics."""
    try:
        metrics = get_performance_metrics()

        # Determine health status based on metrics
        is_healthy = True
        issues = []

        # Check error rate
        if metrics.get("error_rate", 0) > 0.1:  # More than 10% error rate
            is_healthy = False
            issues.append("High error rate")

        # Check average response time
        if metrics.get("avg_api_duration_ms", 0) > 1000:  # More than 1 second
            is_healthy = False
            issues.append("Slow average response time")

        # Check slow calls
        if metrics.get("slow_api_calls", 0) > 10:  # More than 10 slow calls
            is_healthy = False
            issues.append("Multiple slow API calls detected")

        return {
            "status": "healthy" if is_healthy else "degraded",
            "uptime_seconds": metrics.get("uptime_seconds", 0),
            "total_api_calls": metrics.get("total_api_calls", 0),
            "avg_response_time_ms": metrics.get("avg_api_duration_ms", 0),
            "error_rate": metrics.get("error_rate", 0),
            "slow_calls": metrics.get("slow_api_calls", 0),
            "issues": issues,
            "timestamp": metrics.get("timestamp"),
        }

    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "issues": ["Performance monitoring error"],
        }
