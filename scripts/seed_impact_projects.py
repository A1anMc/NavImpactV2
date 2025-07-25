import asyncio
from datetime import datetime
import json
import logging
import os
import sys
from typing import List

# Add the project root to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.project import Project
from app.models.user import User
from app.schemas.project import ProjectCreate

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Impact-Focused Project Data ---
# A diverse set of projects covering social, environmental, and community impact.

PROJECTS_DATA: List[dict] = [
    {
        "name": "Digital Literacy for Seniors",
        "description": "Empowering elderly community members with essential digital skills to reduce isolation and improve access to services.",
        "status": "active",
        "start_date": "2023-01-15",
        "end_date": "2024-06-30",
        "outcome_text": "82 seniors gained lasting digital confidence and independence.",
        "impact_statement": "This project directly addresses the digital divide, improving digital inclusion for vulnerable populations and reducing social isolation.",
        "impact_types": ["social", "community"],
        "sdg_tags": ["SDG-4", "SDG-10"],
        "evidence_sources": "Pre- and post-program surveys, participant interviews, and skill assessment scores.",
    },
    {
        "name": "Urban Green Spaces Initiative",
        "description": "Creating sustainable green spaces in urban communities to improve biodiversity, air quality, and resident wellbeing.",
        "status": "active",
        "start_date": "2023-03-01",
        "end_date": "2025-12-31",
        "outcome_text": "Established 3 new community gardens and 1 micro-forest, serving over 500 residents.",
        "impact_statement": "Enhances environmental sustainability and community wellbeing through urban greening, while providing educational opportunities.",
        "impact_types": ["environmental", "community"],
        "sdg_tags": ["SDG-11", "SDG-13", "SDG-15"],
        "evidence_sources": "GIS mapping of green space, air quality monitoring data, community engagement metrics.",
    },
    {
        "name": "Youth Employment Skills Program",
        "description": "Providing job readiness training, mentorship, and placement support for disadvantaged youth.",
        "status": "completed",
        "start_date": "2022-09-01",
        "end_date": "2023-08-31",
        "outcome_text": "Achieved a 15% increase in the employment rate for program participants within 3 months of completion.",
        "impact_statement": "Reduces youth unemployment and improves long-term economic opportunities, contributing to community stability.",
        "impact_types": ["social"],
        "sdg_tags": ["SDG-8", "SDG-1", "SDG-4"],
        "evidence_sources": "Employment tracking data, employer feedback surveys, participant income analysis.",
    },
    {
        "name": "Renewable Energy for Community Hubs",
        "description": "Installing solar panels on community buildings to reduce carbon footprint and operational costs.",
        "status": "planning",
        "start_date": "2024-08-01",
        "end_date": "2025-07-31",
        "outcome_text": "Projected to reduce community carbon footprint by 40 tonnes annually.",
        "impact_statement": "Transitions community infrastructure to sustainable energy, demonstrating a scalable model for local climate action.",
        "impact_types": ["environmental", "community"],
        "sdg_tags": ["SDG-7", "SDG-11", "SDG-13"],
        "evidence_sources": "Energy audit reports, supplier technical specifications, financial modeling for cost savings.",
    },
    {
        "name": "Local Food Systems Network",
        "description": "Connecting local farmers with consumers and businesses to build a resilient local food economy.",
        "status": "active",
        "start_date": "2023-05-15",
        "end_date": None,
        "outcome_text": "Onboarded 25 local producers and established 3 new market channels.",
        "impact_statement": "Strengthens food security, supports local economies, and reduces food miles, contributing to a more sustainable food system.",
        "impact_types": ["environmental", "social", "community"],
        "sdg_tags": ["SDG-2", "SDG-11", "SDG-12"],
        "evidence_sources": "Producer sales data, supply chain analysis, consumer surveys.",
    },
]

async def seed_projects(db: Session):
    """
    Seeds the database with impact-focused projects.
    """
    # Get the first user to be the owner of the projects
    owner = db.query(User).first()
    if not owner:
        logger.error("No users found in the database. Please create a user first.")
        # As a fallback, create a default user if none exist
        default_email = "admin@navimpact.com"
        default_password = "password" # Use a more secure default in a real scenario
        from app.services.user import user as user_service
        from app.schemas.user import UserCreate
        
        user_in = UserCreate(email=default_email, password=default_password, is_superuser=True)
        owner = user_service.create(db, obj_in=user_in)
        logger.info(f"Created default user: {owner.email}")

    logger.info(f"Projects will be owned by: {owner.email}")

    # Check for existing projects to avoid duplicates
    existing_project_names = {p.name for p in db.query(Project).all()}

    projects_to_add = [
        p for p in PROJECTS_DATA if p["name"] not in existing_project_names
    ]

    if not projects_to_add:
        logger.info("All seed projects already exist in the database. No new projects will be added.")
        return

    logger.info(f"Adding {len(projects_to_add)} new projects to the database...")

    for project_data in projects_to_add:
        # Pydantic schema expects date objects, not strings
        start_date = datetime.fromisoformat(project_data["start_date"]) if project_data.get("start_date") else None
        end_date = datetime.fromisoformat(project_data["end_date"]) if project_data.get("end_date") else None

        # The backend schema might not directly support all these fields upon creation.
        # We create the core project and then update it with the additional metadata.
        # This is a common pattern when dealing with complex related models or JSON fields.

        project_in = Project(
            name=project_data["name"],
            description=project_data["description"],
            status=project_data["status"],
            start_date=start_date,
            end_date=end_date,
            owner_id=owner.id,
            # These fields might be in a details/metadata table or a JSONB column.
            # For this script, we'll assume they are available on the Project model.
            # If not, this script would need adjustment to match the actual schema.
            outcome_text=project_data.get("outcome_text"),
            impact_statement=project_data.get("impact_statement"),
            impact_types=project_data.get("impact_types"),
            sdg_tags=project_data.get("sdg_tags"),
            evidence_sources=project_data.get("evidence_sources"),
        )
        
        db.add(project_in)

    try:
        db.commit()
        logger.info("Successfully committed new projects to the database.")
    except Exception as e:
        logger.error(f"Error committing projects to the database: {e}")
        db.rollback()

async def main():
    logger.info("Starting project seeding process...")
    db = SessionLocal()
    try:
        await seed_projects(db)
    finally:
        db.close()
    logger.info("Project seeding process finished.")

if __name__ == "__main__":
    # To run this script:
    # 1. Make sure your environment variables are set up (e.g., DATABASE_URL).
    # 2. From the project root, run:
    #    python scripts/seed_impact_projects.py
    asyncio.run(main()) 