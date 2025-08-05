import logging
from datetime import datetime
from typing import Generator, Optional

from app.core.config import settings
from app.db.session import get_last_connection_error, get_session_local
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


def get_db() -> Generator:
    """Get SQLAlchemy database session with enhanced error handling."""
    db = None
    try:
        SessionLocal = get_session_local()
        db = SessionLocal()
        yield db
    except Exception as e:
        logger.error(f"Error creating database session: {str(e)}")
        # Only return 503 for actual database connection errors
        if (
            "database" in str(e).lower()
            or "connection" in str(e).lower()
            or "sql" in str(e).lower()
        ):
            raise HTTPException(status_code=503, detail="Database service unavailable")
        else:
            # Re-raise other exceptions (like Pydantic validation errors)
            raise
    finally:
        if db:
            try:
                db.close()
            except Exception as e:
                logger.warning(f"Error closing database session: {str(e)}")


async def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
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
            token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
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
            status_code=503, detail="Database error while authenticating"
        )

    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )
    return user


async def get_current_active_superuser(
    current_user=Depends(get_current_user),
):
    """Get current authenticated superuser."""
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges",
        )
    return current_user
