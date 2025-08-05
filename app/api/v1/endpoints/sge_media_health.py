"""SGE Media Module Health Check Endpoint"""

from app.core.deps import get_db
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/sge-media-health")
async def sge_media_health_check(db: Session = Depends(get_db)):
    """Check if SGE Media tables exist and are accessible."""
    try:
        # Test if SGE Media tables exist
        result = db.execute(
            text(
                """
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name LIKE 'sge_%'
            ORDER BY table_name
        """
            )
        )

        tables = [row[0] for row in result.fetchall()]

        if tables:
            return {
                "status": "healthy",
                "message": "SGE Media tables exist",
                "tables": tables,
                "table_count": len(tables),
            }
        else:
            # Create the tables directly
            db.execute(
                text(
                    """
                CREATE TABLE IF NOT EXISTS sge_media_projects (
                    id SERIAL PRIMARY KEY,
                    project_id INTEGER,
                    media_type VARCHAR(50) NOT NULL,
                    duration VARCHAR(20),
                    release_date DATE,
                    target_audience TEXT[],
                    contributors TEXT[],
                    production_budget NUMERIC(10,2),
                    thumbnail_url VARCHAR(500),
                    created_at TIMESTAMP,
                    updated_at TIMESTAMP
                )
            """
                )
            )

            db.execute(
                text(
                    """
                CREATE TABLE IF NOT EXISTS sge_distribution_logs (
                    id SERIAL PRIMARY KEY,
                    media_project_id INTEGER NOT NULL,
                    platform VARCHAR(100) NOT NULL,
                    url TEXT,
                    publish_date DATE,
                    views INTEGER,
                    reach INTEGER,
                    engagement_rate NUMERIC(5,2),
                    notes TEXT,
                    created_at TIMESTAMP
                )
            """
                )
            )

            db.execute(
                text(
                    """
                CREATE TABLE IF NOT EXISTS sge_performance_metrics (
                    id SERIAL PRIMARY KEY,
                    media_project_id INTEGER NOT NULL,
                    metric_date DATE NOT NULL,
                    views INTEGER,
                    unique_viewers INTEGER,
                    watch_time_minutes INTEGER,
                    engagement_rate NUMERIC(5,2),
                    shares INTEGER,
                    comments INTEGER,
                    created_at TIMESTAMP
                )
            """
                )
            )

            db.execute(
                text(
                    """
                CREATE TABLE IF NOT EXISTS sge_impact_stories (
                    id SERIAL PRIMARY KEY,
                    media_project_id INTEGER NOT NULL,
                    story_type VARCHAR(50),
                    title VARCHAR(200) NOT NULL,
                    description TEXT,
                    stakeholder_name VARCHAR(200),
                    stakeholder_organisation VARCHAR(200),
                    impact_date DATE,
                    quantifiable_outcome TEXT,
                    created_at TIMESTAMP
                )
            """
                )
            )

            db.execute(
                text(
                    """
                CREATE TABLE IF NOT EXISTS sge_client_access (
                    id SERIAL PRIMARY KEY,
                    client_name VARCHAR(200) NOT NULL,
                    client_email VARCHAR(200) NOT NULL UNIQUE,
                    access_level VARCHAR(50),
                    allowed_projects INTEGER[],
                    is_active BOOLEAN,
                    created_at TIMESTAMP
                )
            """
                )
            )

            db.commit()

            return {
                "status": "created",
                "message": "SGE Media tables created successfully",
                "tables": [
                    "sge_media_projects",
                    "sge_distribution_logs",
                    "sge_performance_metrics",
                    "sge_impact_stories",
                    "sge_client_access",
                ],
                "table_count": 5,
            }
            return {
                "status": "pending",
                "message": "SGE Media tables not found - migration needed",
                "tables": [],
                "table_count": 0,
            }

    except Exception as e:
        return {
            "status": "error",
            "message": f"Database error: {str(e)}",
            "tables": [],
            "table_count": 0,
        }
