from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import logging
from datetime import datetime

from app.core.config import settings
from app.db.session import get_session_local, get_last_connection_error

logger = logging.getLogger(__name__)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def get_db() -> Generator:
    """Get SQLAlchemy database session."""
    db = None
    try:
        logger.debug("Creating database session...")
        SessionLocal = get_session_local()
        db = SessionLocal()
        logger.debug("Database session created successfully")
        
        # Only test connection in development or when explicitly requested
        if settings.DEBUG:
            try:
                from sqlalchemy import text
                db.execute(text("SELECT 1"))
                logger.debug("Database connection test successful")
            except SQLAlchemyError as e:
                logger.warning(f"Database connection test failed: {str(e)}")
                # Don't fail the request for connection test issues in production
        
        yield db
    finally:
        if db:
            try:
                db.close()
                logger.debug("Database session closed successfully")
            except Exception as e:
                logger.warning(f"Error closing database session: {str(e)}")

async def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    """Get current authenticated user."""
    from app.models.user import User  # Import here to avoid circular import
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        user_id: Optional[int] = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    try:
        user = db.query(User).filter(User.id == user_id).first()
    except SQLAlchemyError as e:
        logger.error(f"Database error while fetching user: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Database error while authenticating"
        )
    
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return user

async def get_current_active_superuser(
    current_user = Depends(get_current_user),
):
    """Get current authenticated superuser."""
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user 