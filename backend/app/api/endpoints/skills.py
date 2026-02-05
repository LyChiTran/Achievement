from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user, get_db
from app.crud.base import CRUDBase
from app.models.user import User
from app.models.skill import Skill
from app.schemas.skill import Skill as SkillSchema, SkillCreate, SkillUpdate

router = APIRouter()

# Create CRUD instance for skills
crud_skill = CRUDBase[Skill, SkillCreate, SkillUpdate](Skill)


@router.get("/", response_model=List[SkillSchema])
def read_skills(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Retrieve skills for current user.
    """
    skills = db.query(Skill).filter(Skill.user_id == current_user.id).offset(skip).limit(limit).all()
    return skills


@router.post("/", response_model=SkillSchema, status_code=201)
def create_skill(
    *,
    db: Session = Depends(get_db),
    skill_in: SkillCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Create new skill for current user.
    """
    skill_data = skill_in.dict()
    skill = Skill(**skill_data, user_id=current_user.id)
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill


@router.put("/{skill_id}", response_model=SkillSchema)
def update_skill(
    *,
    db: Session = Depends(get_db),
    skill_id: int,
    skill_in: SkillUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update a skill.
    """
    skill = crud_skill.get(db=db, id=skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    if skill.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    skill = crud_skill.update(db=db, db_obj=skill, obj_in=skill_in)
    return skill


@router.delete("/{skill_id}", response_model=SkillSchema)
def delete_skill(
    *,
    db: Session = Depends(get_db),
    skill_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Delete a skill.
    """
    skill = crud_skill.get(db=db, id=skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    if skill.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    skill = crud_skill.remove(db=db, id=skill_id)
    return skill
