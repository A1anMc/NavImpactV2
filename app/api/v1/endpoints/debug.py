from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
import os

from app.core.deps import get_db

router = APIRouter()

@router.post("/debug/create-sge-tables")
async def create_sge_tables(db: Session = Depends(get_db)):
    """Manually create SGE Media tables using SQL."""
    try:
        # Read the SQL script
        with open("scripts/create_sge_tables.sql", "r") as f:
            sql_script = f.read()
        
        # Split into individual statements
        statements = [stmt.strip() for stmt in sql_script.split(";") if stmt.strip()]
        
        # Execute each statement
        for statement in statements:
            if statement:
                db.execute(text(statement))
        
        db.commit()
        
        return {"status": "success", "message": "SGE Media tables created successfully"}
    except Exception as e:
        db.rollback()
        return {"error": f"Failed to create tables: {str(e)}"}

