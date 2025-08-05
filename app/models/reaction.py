from app.db.base import Base
from sqlalchemy import Column, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship


class Reaction(Base):
    """Model for comment reactions."""

    __tablename__ = "reactions"

    id = Column(Integer, primary_key=True, index=True)
    emoji = Column(String, nullable=False)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    comment_id = Column(
        Integer, ForeignKey("task_comments.id", ondelete="CASCADE"), nullable=False
    )

    # Relationships
    user = relationship("User", back_populates="reactions")
    comment = relationship("TaskComment", back_populates="reactions")

    # Ensure unique reactions per user per comment
    __table_args__ = (
        UniqueConstraint(
            "user_id", "comment_id", "emoji", name="unique_user_comment_emoji"
        ),
    )
