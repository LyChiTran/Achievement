from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.achievement import Achievement
from app.schemas.achievement import AchievementCreate, AchievementUpdate


class CRUDAchievement(CRUDBase[Achievement, AchievementCreate, AchievementUpdate]):
    """CRUD operations for Achievement model"""
    
    def create_with_user(
        self, db: Session, *, obj_in: AchievementCreate, user_id: int
    ) -> Achievement:
        """Create achievement for a specific user"""
        obj_in_data = obj_in.dict()
        db_obj = Achievement(**obj_in_data, user_id=user_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def get_multi_by_user(
        self, 
        db: Session, 
        *, 
        user_id: int, 
        skip: int = 0, 
        limit: int = 100,
        category_id: Optional[int] = None
    ) -> List[Achievement]:
        """Get achievements for a specific user with optional category filter"""
        query = db.query(Achievement).filter(Achievement.user_id == user_id)
        
        if category_id is not None:
            query = query.filter(Achievement.category_id == category_id)
        
        return query.offset(skip).limit(limit).all()
    
    def get_public_achievements(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[Achievement]:
        """Get all public achievements"""
        return (
            db.query(Achievement)
            .filter(Achievement.is_public == True)
            .offset(skip)
            .limit(limit)
            .all()
        )


# Create instance
achievement = CRUDAchievement(Achievement)
