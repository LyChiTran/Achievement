from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime


class SkillBase(BaseModel):
    """Base skill schema"""
    name: str
    proficiency_level: int = Field(default=1, ge=1, le=5)
    category: Optional[str] = None


class SkillCreate(SkillBase):
    """Schema for creating a skill"""
    pass


class SkillUpdate(BaseModel):
    """Schema for updating a skill"""
    name: Optional[str] = None
    proficiency_level: Optional[int] = Field(None, ge=1, le=5)
    category: Optional[str] = None


class Skill(SkillBase):
    """Schema for skill response"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
