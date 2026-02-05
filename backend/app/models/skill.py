from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base
from app.db.base_class import BaseModel


class Skill(Base, BaseModel):
    """
    Skill model for tracking user skills and proficiency.
    """
    __tablename__ = "skills"
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    name = Column(String, nullable=False, index=True)
    proficiency_level = Column(Integer, default=1, nullable=False)  # 1-5 scale
    category = Column(String, nullable=True)  # e.g., "Technical", "Soft Skills"
    
    # Relationships
    user = relationship("User", back_populates="skills")
