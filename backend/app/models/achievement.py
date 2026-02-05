from sqlalchemy import Column, String, Integer, ForeignKey, Boolean, Text, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base
from app.db.base_class import BaseModel


class Achievement(Base, BaseModel):
    """
    Achievement model for storing user achievements.
    """
    __tablename__ = "achievements"
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    date_achieved = Column(DateTime, nullable=True)
    importance_level = Column(Integer, default=3, nullable=False)  # 1-5 scale
    is_public = Column(Boolean, default=False, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="achievements")
    category = relationship("Category", back_populates="achievements")
    media = relationship("Media", back_populates="achievement", cascade="all, delete-orphan")
