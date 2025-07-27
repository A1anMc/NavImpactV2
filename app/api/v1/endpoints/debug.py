from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from alembic import command
from alembic.config import Config
import os

from app.core.deps import get_db

router = APIRouter()

@router.post("/debug/apply-migration")
async def apply_migration(db: Session = Depends(get_db)):
    """Manually apply the SGE Media migration."""
    try:
        # Configure Alembic with the correct database URL
        alembic_cfg = Config("alembic.ini")
        
        # Apply migration
        command.upgrade(alembic_cfg, "head")
        
        return {"status": "success", "message": "Migration applied successfully"}
    except Exception as e:
        return {"error": f"Migration failed: {str(e)}"}

