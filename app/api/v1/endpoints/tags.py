from app.db.session import get_db
from app.models.tag import Tag
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/")
async def list_tags(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str = None,
):
    """List tags with filtering and pagination."""
    query = db.query(Tag)

    # Apply search filter
    if search:
        query = query.filter(Tag.name.ilike(f"%{search}%"))

    # Get total count
    total = query.count()

    # Apply pagination
    tags = query.offset(skip).limit(limit).all()

    return {
        "items": tags,
        "total": total,
        "page": (skip // limit) + 1,
        "size": limit,
        "has_next": skip + limit < total,
        "has_prev": skip > 0,
    }


@router.get("/{tag_id}")
async def get_tag(tag_id: int, db: Session = Depends(get_db)):
    """Get tag by ID."""
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Tag not found"
        )
    return tag
