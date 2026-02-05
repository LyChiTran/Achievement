from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.crud.base import CRUDBase
from app.models.category import Category
from app.schemas.category import Category as CategorySchema, CategoryCreate, CategoryUpdate

router = APIRouter()

# Create CRUD instance for categories
crud_category = CRUDBase[Category, CategoryCreate, CategoryUpdate](Category)


@router.get("/", response_model=List[CategorySchema])
def read_categories(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve all categories.
    """
    categories = crud_category.get_multi(db, skip=skip, limit=limit)
    return categories


@router.post("/", response_model=CategorySchema, status_code=201)
def create_category(
    *,
    db: Session = Depends(get_db),
    category_in: CategoryCreate,
) -> Any:
    """
    Create new category.
    """
    category = crud_category.create(db=db, obj_in=category_in)
    return category


@router.get("/{category_id}", response_model=CategorySchema)
def read_category(
    *,
    db: Session = Depends(get_db),
    category_id: int,
) -> Any:
    """
    Get category by ID.
    """
    category = crud_category.get(db=db, id=category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category
