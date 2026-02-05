from sqlalchemy import Column, String
from app.db.base import Base
from app.db.base_class import BaseModel
from sqlalchemy.orm import relationship


class Category(Base, BaseModel):
    """
    Category model for organizing achievements.
    """
    __tablename__ = "categories"
    
    name = Column(String, unique=True, nullable=False, index=True)
    icon = Column(String, nullable=True)
    color = Column(String, nullable=True)
    description = Column(String, nullable=True)
    
    # Relationships
    achievements = relationship("Achievement", back_populates="category")
