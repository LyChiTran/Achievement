from datetime import datetime, timedelta
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_

from app.api.deps import get_current_active_user, get_db
from app.models.user import User
from app.models.achievement import Achievement
from app.models.skill import Skill
from app.models.goal import Goal
from app.schemas.admin import (
    UserAdmin,
    UserAdminUpdate,
    SystemStats,
    GrowthDataPoint,
    ActivityLog
)
from app.crud.crud_user import user as crud_user

router = APIRouter()


def get_current_admin(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """Verify that the current user is an admin"""
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


# ============================================================
# USER MANAGEMENT
# ============================================================

@router.get("/users", response_model=List[UserAdmin])
def list_users(
    *,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None
) -> Any:
    """
    Get list of all users (admin only)
    """
    query = db.query(User)
    
    # Search filter
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (User.email.ilike(search_filter)) | 
            (User.full_name.ilike(search_filter))
        )
    
    users = query.offset(skip).limit(limit).all()
    
    # Add stats to each user
    user_list = []
    for user in users:
        user_dict = {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "is_active": user.is_active,
            "is_superuser": user.is_superuser,
            "subscription_tier": user.subscription_tier,
            "is_email_verified": user.is_email_verified,
            "is_phone_verified": user.is_phone_verified,
            "created_at": user.created_at,
            "updated_at": user.updated_at,
            "achievement_count": len(user.achievements),
            "skill_count": len(user.skills),
            "goal_count": len(user.goals)
        }
        user_list.append(UserAdmin(**user_dict))
    
    return user_list


@router.get("/users/{user_id}", response_model=UserAdmin)
def get_user_details(
    *,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
    user_id: int
) -> Any:
    """
    Get detailed user information (admin only)
    """
    user = crud_user.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserAdmin(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        is_superuser=user.is_superuser,
        subscription_tier=user.subscription_tier,
        is_email_verified=user.is_email_verified,
        is_phone_verified=user.is_phone_verified,
        created_at=user.created_at,
        updated_at=user.updated_at,
        achievement_count=len(user.achievements),
        skill_count=len(user.skills),
        goal_count=len(user.goals)
    )


@router.put("/users/{user_id}", response_model=UserAdmin)
def update_user(
    *,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
    user_id: int,
    user_update: UserAdminUpdate
) -> Any:
    """
    Update user (admin only) - can change tier, ban, verify, etc.
    """
    user = crud_user.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update fields
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    
    return UserAdmin(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        is_superuser=user.is_superuser,
        subscription_tier=user.subscription_tier,
        is_email_verified=user.is_email_verified,
        is_phone_verified=user.is_phone_verified,
        created_at=user.created_at,
        updated_at=user.updated_at,
        achievement_count=len(user.achievements),
        skill_count=len(user.skills),
        goal_count=len(user.goals)
    )


@router.delete("/users/{user_id}")
def delete_user(
    *,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
    user_id: int
) -> Any:
    """
    Delete user (admin only)
    """
    user = crud_user.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent admin from deleting themselves
    if user.id == admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own admin account"
        )
    
    crud_user.remove(db, id=user_id)
    return {"message": "User deleted successfully"}


# ============================================================
# SYSTEM STATISTICS
# ============================================================

@router.get("/stats/overview", response_model=SystemStats)
def get_system_stats(
    *,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
) -> Any:
    """
    Get overall system statistics (admin only)
    """
    total_users = db.query(func.count(User.id)).scalar()
    active_users = db.query(func.count(User.id)).filter(User.is_active == True).scalar()
    verified_users = db.query(func.count(User.id)).filter(User.is_email_verified == True).scalar()
    pro_users = db.query(func.count(User.id)).filter(User.subscription_tier == "pro").scalar()
    
    total_achievements = db.query(func.count(Achievement.id)).scalar()
    total_skills = db.query(func.count(Skill.id)).scalar()
    total_goals = db.query(func.count(Goal.id)).scalar()
    
    # Users created today
    today = datetime.utcnow().date()
    users_created_today = db.query(func.count(User.id)).filter(
        func.date(User.created_at) == today
    ).scalar()
    
    return SystemStats(
        total_users=total_users or 0,
        active_users=active_users or 0,
        verified_users=verified_users or 0,
        pro_users=pro_users or 0,
        total_achievements=total_achievements or 0,
        total_skills=total_skills or 0,
        total_goals=total_goals or 0,
        users_created_today=users_created_today or 0
    )


@router.get("/stats/growth", response_model=List[GrowthDataPoint])
def get_growth_data(
    *,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
    days: int = Query(default=30, le=365)
) -> Any:
    """
    Get user growth data for charts (admin only)
    """
    end_date = datetime.utcnow().date()
    start_date = end_date - timedelta(days=days)
    
    # Get all users within date range
    users = db.query(User).filter(
        User.created_at >= start_date
    ).order_by(User.created_at).all()
    
    # Group by date
    growth_data = {}
    current_date = start_date
    total_users_before = db.query(func.count(User.id)).filter(
        User.created_at < start_date
    ).scalar() or 0
    
    running_total = total_users_before
    
    while current_date <= end_date:
        date_str = current_date.strftime("%Y-%m-%d")
        new_users_count = sum(1 for u in users if u.created_at.date() == current_date)
        running_total += new_users_count
        
        growth_data[date_str] = {
            "date": date_str,
            "new_users": new_users_count,
            "total_users": running_total
        }
        current_date += timedelta(days=1)
    
    return [GrowthDataPoint(**data) for data in growth_data.values()]


# ============================================================
# CONTENT MANAGEMENT
# ============================================================

@router.get("/achievements")
def list_all_achievements(
    *,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    Get all achievements (public + private) for moderation (admin only)
    """
    achievements = db.query(Achievement).offset(skip).limit(limit).all()
    
    result = []
    for ach in achievements:
        result.append({
            "id": ach.id,
            "title": ach.title,
            "description": ach.description,
            "user_id": ach.user_id,
            "user_email": ach.user.email if ach.user else None,
            "is_public": ach.is_public,
            "created_at": ach.created_at
        })
    
    return result
