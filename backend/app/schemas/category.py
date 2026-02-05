from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime


class CategoryBase(BaseModel):
    """Base category schema"""
    name: str
    icon: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    """Schema for creating a category"""
    pass


class CategoryUpdate(CategoryBase):
    """Schema for updating a category"""
    name: Optional[str] = None


class Category(CategoryBase):
    """Schema for category response"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
