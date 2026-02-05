from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user, get_db
from app.crud.base import CRUDBase
from app.models.user import User
from app.models.goal import Goal
from app.schemas.goal import Goal as GoalSchema, GoalCreate, GoalUpdate

router = APIRouter()

# Create CRUD instance for goals
crud_goal = CRUDBase[Goal, GoalCreate, GoalUpdate](Goal)


@router.get("/", response_model=List[GoalSchema])
def read_goals(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Retrieve goals for current user.
    """
    goals = db.query(Goal).filter(Goal.user_id == current_user.id).offset(skip).limit(limit).all()
    return goals


@router.post("/", response_model=GoalSchema, status_code=201)
def create_goal(
    *,
    db: Session = Depends(get_db),
    goal_in: GoalCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Create new goal for current user.
    """
    goal_data = goal_in.dict()
    goal = Goal(**goal_data, user_id=current_user.id)
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@router.put("/{goal_id}", response_model=GoalSchema)
def update_goal(
    *,
    db: Session = Depends(get_db),
    goal_id: int,
    goal_in: GoalUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update a goal.
    """
    goal = crud_goal.get(db=db, id=goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    if goal.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    goal = crud_goal.update(db=db, db_obj=goal, obj_in=goal_in)
    return goal


@router.delete("/{goal_id}", response_model=GoalSchema)
def delete_goal(
    *,
    db: Session = Depends(get_db),
    goal_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Delete a goal.
    """
    goal = crud_goal.get(db=db, id=goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    if goal.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    goal = crud_goal.remove(db=db, id=goal_id)
    return goal
