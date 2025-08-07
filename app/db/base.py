"""SQLAlchemy models."""

# Import models in dependency order (User moved to end to avoid circular import)
from app.models.user import User  # Moved to end to avoid circular import

# All models should be imported here to ensure they are registered with SQLAlchemy
