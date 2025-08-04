"""
Comprehensive Error Handling System
Provides bulletproof error handling, monitoring, and fallback mechanisms.
"""

import logging
import traceback
import asyncio
from typing import Any, Dict, Optional, Callable
from datetime import datetime
from functools import wraps
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
import os

# Configure Sentry for production monitoring
if os.getenv("SENTRY_DSN"):
    sentry_sdk.init(
        dsn=os.getenv("SENTRY_DSN"),
        integrations=[FastApiIntegration()],
        traces_sample_rate=1.0,
        environment=os.getenv("ENVIRONMENT", "development")
    )

# Configure logging
logger = logging.getLogger(__name__)

class ErrorHandler:
    """Comprehensive error handling with fallback mechanisms."""
    
    def __init__(self):
        self.error_counts = {}
        self.fallback_data = {}
        self.health_status = {}
    
    def log_error(self, error: Exception, context: str = "", request: Optional[Request] = None):
        """Log error with comprehensive context."""
        error_info = {
            "error_type": type(error).__name__,
            "error_message": str(error),
            "context": context,
            "timestamp": datetime.now().isoformat(),
            "traceback": traceback.format_exc()
        }
        
        if request:
            error_info.update({
                "method": request.method,
                "url": str(request.url),
                "client_ip": request.client.host if request.client else None,
                "user_agent": request.headers.get("user-agent")
            })
        
        # Log to different levels based on error type
        if isinstance(error, HTTPException):
            logger.warning(f"HTTP Error in {context}: {error.detail}")
        else:
            logger.error(f"System Error in {context}: {str(error)}")
            logger.error(f"Traceback: {error_info['traceback']}")
        
        # Track error counts for monitoring
        error_key = f"{context}:{type(error).__name__}"
        self.error_counts[error_key] = self.error_counts.get(error_key, 0) + 1
        
        # Send to Sentry in production
        if os.getenv("SENTRY_DSN"):
            sentry_sdk.capture_exception(error)
        
        return error_info
    
    def get_fallback_data(self, service: str) -> Dict[str, Any]:
        """Get fallback data for a service when it's unavailable."""
        return self.fallback_data.get(service, {
            "status": "fallback",
            "message": f"{service} service unavailable",
            "timestamp": datetime.now().isoformat(),
            "data": {}
        })
    
    def set_fallback_data(self, service: str, data: Dict[str, Any]):
        """Set fallback data for a service."""
        self.fallback_data[service] = {
            "status": "fallback",
            "data": data,
            "timestamp": datetime.now().isoformat()
        }
    
    def update_health_status(self, service: str, status: str, details: str = ""):
        """Update health status for monitoring."""
        self.health_status[service] = {
            "status": status,
            "details": details,
            "last_check": datetime.now().isoformat()
        }
    
    def get_system_health(self) -> Dict[str, Any]:
        """Get comprehensive system health status."""
        return {
            "overall_status": "healthy" if all(
                status["status"] == "healthy" for status in self.health_status.values()
            ) else "degraded",
            "services": self.health_status,
            "error_counts": self.error_counts,
            "timestamp": datetime.now().isoformat()
        }

# Global error handler instance
error_handler = ErrorHandler()

def bulletproof_async(func: Callable) -> Callable:
    """Decorator for bulletproof async functions with comprehensive error handling."""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except HTTPException:
            raise
        except Exception as e:
            error_handler.log_error(e, f"{func.__module__}.{func.__name__}")
            
            # Return fallback data if available
            if hasattr(func, 'fallback_service'):
                return error_handler.get_fallback_data(func.fallback_service)
            
            # Generic fallback response
            return {
                "status": "error",
                "message": "Service temporarily unavailable",
                "timestamp": datetime.now().isoformat()
            }
    return wrapper

def bulletproof_sync(func: Callable) -> Callable:
    """Decorator for bulletproof sync functions with comprehensive error handling."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except HTTPException:
            raise
        except Exception as e:
            error_handler.log_error(e, f"{func.__module__}.{func.__name__}")
            
            # Return fallback data if available
            if hasattr(func, 'fallback_service'):
                return error_handler.get_fallback_data(func.fallback_service)
            
            # Generic fallback response
            return {
                "status": "error",
                "message": "Service temporarily unavailable",
                "timestamp": datetime.now().isoformat()
            }
    return wrapper

class ServiceMonitor:
    """Monitor service health and provide fallbacks."""
    
    def __init__(self):
        self.services = {}
        self.health_checks = {}
    
    def register_service(self, name: str, health_check: Callable, fallback_data: Dict[str, Any]):
        """Register a service with health check and fallback data."""
        self.services[name] = {
            "health_check": health_check,
            "fallback_data": fallback_data,
            "last_check": None,
            "status": "unknown"
        }
    
    async def check_service_health(self, service_name: str) -> bool:
        """Check if a service is healthy."""
        if service_name not in self.services:
            return False
        
        try:
            service = self.services[service_name]
            is_healthy = await service["health_check"]()
            service["status"] = "healthy" if is_healthy else "unhealthy"
            service["last_check"] = datetime.now().isoformat()
            
            error_handler.update_health_status(service_name, service["status"])
            return is_healthy
            
        except Exception as e:
            error_handler.log_error(e, f"Health check for {service_name}")
            self.services[service_name]["status"] = "error"
            error_handler.update_health_status(service_name, "error", str(e))
            return False
    
    async def get_service_data(self, service_name: str, data_fetcher: Callable) -> Dict[str, Any]:
        """Get data from a service with fallback."""
        try:
            # Check if service is healthy
            if await self.check_service_health(service_name):
                data = await data_fetcher()
                error_handler.set_fallback_data(service_name, data)
                return data
            else:
                # Return fallback data
                return error_handler.get_fallback_data(service_name)
                
        except Exception as e:
            error_handler.log_error(e, f"Data fetch for {service_name}")
            return error_handler.get_fallback_data(service_name)

# Global service monitor
service_monitor = ServiceMonitor()

class CircuitBreaker:
    """Circuit breaker pattern for external service calls."""
    
    def __init__(self, failure_threshold: int = 5, recovery_timeout: int = 60):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN
    
    async def call(self, func: Callable, *args, **kwargs):
        """Execute function with circuit breaker protection."""
        if self.state == "OPEN":
            if (datetime.now() - self.last_failure_time).seconds > self.recovery_timeout:
                self.state = "HALF_OPEN"
            else:
                raise HTTPException(
                    status_code=503,
                    detail="Service temporarily unavailable (circuit breaker open)"
                )
        
        try:
            result = await func(*args, **kwargs)
            if self.state == "HALF_OPEN":
                self.state = "CLOSED"
                self.failure_count = 0
            return result
            
        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = datetime.now()
            
            if self.failure_count >= self.failure_threshold:
                self.state = "OPEN"
            
            raise e

# Global circuit breakers for external services
google_analytics_circuit_breaker = CircuitBreaker()
instagram_circuit_breaker = CircuitBreaker()
notion_circuit_breaker = CircuitBreaker()

async def handle_exception(request: Request, exc: Exception) -> JSONResponse:
    """Global exception handler for FastAPI."""
    error_info = error_handler.log_error(exc, "Global exception handler", request)
    
    # Don't expose internal errors in production
    if os.getenv("ENVIRONMENT") == "production":
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal server error",
                "timestamp": datetime.now().isoformat()
            }
        )
    else:
        return JSONResponse(
            status_code=500,
            content={
                "error": str(exc),
                "details": error_info,
                "timestamp": datetime.now().isoformat()
            }
        )

def setup_error_handling(app):
    """Setup comprehensive error handling for FastAPI app."""
    app.add_exception_handler(Exception, handle_exception)
    
    # Add health check endpoint
    @app.get("/health")
    async def health_check():
        return error_handler.get_system_health()
    
    # Add error monitoring endpoint
    @app.get("/monitoring/errors")
    async def error_monitoring():
        return {
            "error_counts": error_handler.error_counts,
            "health_status": error_handler.health_status,
            "timestamp": datetime.now().isoformat()
        } 