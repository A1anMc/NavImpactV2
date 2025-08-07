"""
Performance Monitoring System
Tracks API response times, database queries, and system metrics
"""

import logging
import time
from contextlib import contextmanager
from datetime import datetime
from functools import wraps
from typing import Any, Dict


logger = logging.getLogger(__name__)


class PerformanceMonitor:
    """Performance monitoring for NavImpact API."""

    def __init__(self):
        self.metrics: Dict[str, Any] = {
            "api_calls": [],
            "db_queries": [],
            "errors": [],
            "start_time": datetime.utcnow(),
        }

    def record_api_call(
        self, endpoint: str, method: str, duration: float, status_code: int
    ):
        """Record API call metrics."""
        self.metrics["api_calls"].append(
            {
                "endpoint": endpoint,
                "method": method,
                "duration": duration,
                "status_code": status_code,
                "timestamp": datetime.utcnow(),
            }
        )

        # Log slow requests
        if duration > 1.0:  # More than 1 second
            logger.warning(f"Slow API call: {method} {endpoint} took {duration:.2f}s")

    def record_db_query(self, query: str, duration: float, table: str = None):
        """Record database query metrics."""
        self.metrics["db_queries"].append(
            {
                "query": query[:100] + "..." if len(query) > 100 else query,
                "duration": duration,
                "table": table,
                "timestamp": datetime.utcnow(),
            }
        )

        # Log slow queries
        if duration > 0.5:  # More than 500ms
            logger.warning(f"Slow DB query: {duration:.2f}s on {table or 'unknown'}")

    def record_error(self, error: Exception, context: str = None):
        """Record error metrics."""
        self.metrics["errors"].append(
            {
                "error": str(error),
                "error_type": type(error).__name__,
                "context": context,
                "timestamp": datetime.utcnow(),
            }
        )

    def get_summary(self) -> Dict[str, Any]:
        """Get performance summary."""
        now = datetime.utcnow()
        uptime = now - self.metrics["start_time"]

        api_calls = self.metrics["api_calls"]
        db_queries = self.metrics["db_queries"]
        errors = self.metrics["errors"]

        # Calculate averages
        avg_api_duration = (
            sum(call["duration"] for call in api_calls) / len(api_calls)
            if api_calls
            else 0
        )

        avg_db_duration = (
            sum(query["duration"] for query in db_queries) / len(db_queries)
            if db_queries
            else 0
        )

        return {
            "uptime_seconds": uptime.total_seconds(),
            "total_api_calls": len(api_calls),
            "total_db_queries": len(db_queries),
            "total_errors": len(errors),
            "avg_api_duration_ms": round(avg_api_duration * 1000, 2),
            "avg_db_duration_ms": round(avg_db_duration * 1000, 2),
            "slow_api_calls": len([c for c in api_calls if c["duration"] > 1.0]),
            "slow_db_queries": len([q for q in db_queries if q["duration"] > 0.5]),
            "error_rate": len(errors) / len(api_calls) if api_calls else 0,
        }


# Global performance monitor instance
performance_monitor = PerformanceMonitor()


@contextmanager
def monitor_db_query(query: str, table: str = None):
    """Context manager to monitor database query performance."""
    start_time = time.time()
    try:
        yield
    finally:
        duration = time.time() - start_time
        performance_monitor.record_db_query(query, duration, table)


def monitor_api_call(func):
    """Decorator to monitor API call performance."""

    @wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            result = await func(*args, **kwargs)
            duration = time.time() - start_time

            # Extract endpoint info from FastAPI context
            endpoint = "unknown"
            method = "GET"
            status_code = 200

            # Try to get request info from args
            for arg in args:
                if hasattr(arg, "url"):
                    endpoint = str(arg.url.path)
                    method = arg.method
                    break

            performance_monitor.record_api_call(endpoint, method, duration, status_code)
            return result

        except Exception as e:
            duration = time.time() - start_time
            performance_monitor.record_error(e, f"API call: {func.__name__}")
            performance_monitor.record_api_call("unknown", "GET", duration, 500)
            raise

    return wrapper


def get_performance_metrics() -> Dict[str, Any]:
    """Get current performance metrics."""
    return performance_monitor.get_summary()


def reset_performance_metrics():
    """Reset performance metrics (useful for testing)."""
    global performance_monitor
    performance_monitor = PerformanceMonitor()
