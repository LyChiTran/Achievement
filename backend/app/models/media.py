from sqlalchemy import Column, String, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base
from app.db.base_class import BaseModel


class Media(Base, BaseModel):
    """
    Media model for storing files (images, certificates, etc.) 
    associated with achievements.
    """
    __tablename__ = "media"
    
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False, index=True)
    
    file_url = Column(String, nullable=False)
    file_type = Column(String, nullable=False)  # e.g., "image", "pdf", "video"
    caption = Column(Text, nullable=True)
    
    # Relationships
    achievement = relationship("Achievement", back_populates="media")
