from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import get_db
from app.core.auth import get_current_user
from app.models.user import User
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/budget-migration")
async def apply_budget_migration(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Apply budget migration to projects table"""
    
    # Only allow admin users
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        logger.info("🔧 Applying Budget Migration to Projects Table")
        
        # Check if columns already exist
        result = db.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'projects' 
            AND column_name IN ('budget', 'budget_currency')
        """))
        
        existing_columns = [row[0] for row in result]
        logger.info(f"📋 Existing budget columns: {existing_columns}")
        
        # Add budget column if it doesn't exist
        if 'budget' not in existing_columns:
            logger.info("🔧 Step 1: Adding budget column...")
            db.execute(text("ALTER TABLE projects ADD COLUMN budget FLOAT"))
            db.commit()
            logger.info("✅ Budget column added successfully")
        else:
            logger.info("✅ Budget column already exists")
        
        # Add budget_currency column if it doesn't exist
        if 'budget_currency' not in existing_columns:
            logger.info("🔧 Step 2: Adding budget_currency column...")
            db.execute(text("ALTER TABLE projects ADD COLUMN budget_currency VARCHAR(3) NOT NULL DEFAULT 'AUD'"))
            db.commit()
            logger.info("✅ Budget currency column added successfully")
        else:
            logger.info("✅ Budget currency column already exists")
        
        # Verify the changes
        logger.info("🔧 Step 3: Verifying changes...")
        result = db.execute(text("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'projects' 
            AND column_name IN ('budget', 'budget_currency')
            ORDER BY column_name
        """))
        
        schema_info = []
        for row in result:
            schema_info.append({
                "column": row[0],
                "type": row[1],
                "nullable": row[2],
                "default": row[3]
            })
        
        logger.info("🎉 Budget migration completed successfully!")
        
        return {
            "status": "success",
            "message": "Budget migration completed successfully",
            "schema": schema_info,
            "existing_columns": existing_columns
        }
        
    except Exception as e:
        logger.error(f"❌ Migration error: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Migration failed: {str(e)}") 