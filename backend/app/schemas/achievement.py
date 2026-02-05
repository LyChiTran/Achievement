from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime


class AchievementBase(BaseModel):
    """Base achievement schema"""
    title: str
    description: Optional[str] = None
    category_id: Optional[int] = None
    date_achieved: Optional[datetime] = None
    importance_level: int = Field(default=3, ge=1, le=5)
    is_public: bool = False


class AchievementCreate(AchievementBase):
    """Schema for creating an achievement"""
    pass


class AchievementUpdate(BaseModel):
    """Schema for updating an achievement"""
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    date_achieved: Optional[datetime] = None
    importance_level: Optional[int] = Field(None, ge=1, le=5)
    is_public: Optional[bool] = None


class Achievement(AchievementBase):
    """Schema for achievement response"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class AchievementWithCategory(Achievement):
    """Schema for achievement response with category details"""
    category: Optional[dict] = None
