from sqlalchemy import Column, String, Boolean, Text, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base
from app.db.base_class import BaseModel


class User(Base, BaseModel):
    """
    User model for authentication and profile management.
    """
    __tablename__ = "users"
    
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    
    # Subscription & Verification
    subscription_tier = Column(String, default="free", nullable=False)  # "free" or "pro"
    subscription_expires_at = Column(DateTime, nullable=True)
    is_email_verified = Column(Boolean, default=False, nullable=False)
    is_phone_verified = Column(Boolean, default=False, nullable=False)
    phone_number = Column(String, nullable=True)
    
    # Relationships
    achievements = relationship("Achievement", back_populates="user", cascade="all, delete-orphan")
    skills = relationship("Skill", back_populates="user", cascade="all, delete-orphan")
    goals = relationship("Goal", back_populates="user", cascade="all, delete-orphan")
    otps = relationship("OTP", back_populates="user", cascade="all, delete-orphan")
    subscription = relationship("Subscription", back_populates="user", uselist=False, cascade="all, delete-orphan")

