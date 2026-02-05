from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime
from app.models.goal import GoalStatus


class GoalBase(BaseModel):
    """Base goal schema"""
    title: str
    description: Optional[str] = None
    target_date: Optional[datetime] = None
    status: GoalStatus = GoalStatus.NOT_STARTED
    progress_percentage: int = Field(default=0, ge=0, le=100)


class GoalCreate(GoalBase):
    """Schema for creating a goal"""
    pass


class GoalUpdate(BaseModel):
    """Schema for updating a goal"""
    title: Optional[str] = None
    description: Optional[str] = None
    target_date: Optional[datetime] = None
    status: Optional[GoalStatus] = None
    progress_percentage: Optional[int] = Field(None, ge=0, le=100)


class Goal(GoalBase):
    """Schema for goal response"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
