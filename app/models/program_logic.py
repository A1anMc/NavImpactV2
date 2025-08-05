from app.db.base_class import Base
from sqlalchemy import Column, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship


class ProgramLogic(Base):
    """ProgramLogic model for tracking project logic models."""

    __tablename__ = "program_logics"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(
        Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False
    )
    input = Column(Text, nullable=False)
    output = Column(Text, nullable=False)
    outcome = Column(Text, nullable=False)
    impact = Column(Text, nullable=False)

    # Relationships
    project = relationship("Project", back_populates="program_logic")
