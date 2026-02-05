from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user, get_db
from app.crud.crud_achievement import achievement as crud_achievement
from app.models.user import User
from app.schemas.achievement import Achievement, AchievementCreate, AchievementUpdate

router = APIRouter()


@router.get("/", response_model=List[Achievement])
def read_achievements(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = Query(None),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Retrieve achievements for the current user.
    """
    achievements = crud_achievement.get_multi_by_user(
        db=db, 
        user_id=current_user.id, 
        skip=skip, 
        limit=limit,
        category_id=category_id
    )
    return achievements


@router.post("/", response_model=Achievement, status_code=201)
def create_achievement(
    *,
    db: Session = Depends(get_db),
    achievement_in: AchievementCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Create new achievement for current user.
    """
    achievement = crud_achievement.create_with_user(
        db=db, 
        obj_in=achievement_in, 
        user_id=current_user.id
    )
    return achievement


@router.get("/{achievement_id}", response_model=Achievement)
def read_achievement(
    *,
    db: Session = Depends(get_db),
    achievement_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get achievement by ID.
    """
    achievement = crud_achievement.get(db=db, id=achievement_id)
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    
    # Check if user owns this achievement or it's public
    if achievement.user_id != current_user.id and not achievement.is_public:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return achievement


@router.put("/{achievement_id}", response_model=Achievement)
def update_achievement(
    *,
    db: Session = Depends(get_db),
    achievement_id: int,
    achievement_in: AchievementUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update an achievement.
    """
    achievement = crud_achievement.get(db=db, id=achievement_id)
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    
    # Check if user owns this achievement
    if achievement.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    achievement = crud_achievement.update(
        db=db, 
        db_obj=achievement, 
        obj_in=achievement_in
    )
    return achievement


@router.delete("/{achievement_id}", response_model=Achievement)
def delete_achievement(
    *,
    db: Session = Depends(get_db),
    achievement_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Delete an achievement.
    """
    achievement = crud_achievement.get(db=db, id=achievement_id)
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    
    # Check if user owns this achievement
    if achievement.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    achievement = crud_achievement.remove(db=db, id=achievement_id)
    return achievement


@router.get("/public/all", response_model=List[Achievement])
def read_public_achievements(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve all public achievements (no authentication required).
    """
    achievements = crud_achievement.get_public_achievements(
        db=db, skip=skip, limit=limit
    )
    return achievements
