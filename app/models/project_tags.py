from app.db.base_class import Base
from sqlalchemy import Column, ForeignKey, Integer, Table

project_tags = Table(
    "project_tags",
    Base.metadata,
    Column(
        "project_id",
        Integer,
        ForeignKey("projects.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "tag_id", Integer, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True
    ),
)
