from pydantic import BaseModel


class ReactionBase(BaseModel):
    """Base schema for reactions."""

    emoji: str


class ReactionCreate(ReactionBase):
    """Schema for creating a reaction."""

    comment_id: int


class ReactionResponse(ReactionBase):
    """Schema for reaction responses."""

    id: int
    user_id: int
    comment_id: int

    class Config:
        from_attributes = True
