from sqlalchemy import Column, String, Integer, ForeignKey, Text, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.db.base import Base
from app.db.base_class import BaseModel
import enum


class GoalStatus(str, enum.Enum):
    """Enumeration for goal status"""
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Goal(Base, BaseModel):
    """
    Goal model for tracking user goals and progress.
    """
    __tablename__ = "goals"
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    target_date = Column(DateTime, nullable=True)
    status = Column(SQLEnum(GoalStatus), default=GoalStatus.NOT_STARTED, nullable=False)
    progress_percentage = Column(Integer, default=0, nullable=False)  # 0-100
    
    # Relationships
    user = relationship("User", back_populates="goals")
