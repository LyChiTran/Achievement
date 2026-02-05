from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime


class UserAdmin(BaseModel):
    """Admin view of user with additional stats"""
    id: int
    email: str
    full_name: Optional[str]
    is_active: bool
    is_superuser: bool
    subscription_tier: str
    is_email_verified: bool
    is_phone_verified: bool
    created_at: datetime
    updated_at: datetime
    
    # Stats (will be computed)
    achievement_count: int = 0
    skill_count: int = 0
    goal_count: int = 0
    
    class Config:
        from_attributes = True


class UserAdminUpdate(BaseModel):
    """Schema for admin to update user"""
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None
    subscription_tier: Optional[str] = None
    subscription_expires_at: Optional[datetime] = None
    is_email_verified: Optional[bool] = None


class SystemStats(BaseModel):
    """Overall system statistics"""
    total_users: int
    active_users: int  # is_active = True
    verified_users: int  # is_email_verified = True
    pro_users: int  # subscription_tier = "pro"
    total_achievements: int
    total_skills: int
    total_goals: int
    users_created_today: int


class GrowthDataPoint(BaseModel):
    """Single data point for growth chart"""
    date: str  # YYYY-MM-DD format
    new_users: int
    total_users: int


class ActivityLog(BaseModel):
    """Recent user activity"""
    user_id: int
    user_email: str
    action: str  # "registered", "logged_in", "created_achievement", etc.
    timestamp: datetime
    details: Optional[str] = None
