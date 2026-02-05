from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
from app.db.base import Base
from app.db.base_class import BaseModel


class OTP(Base, BaseModel):
    """
    OTP model for email/SMS verification.
    """
    __tablename__ = "otps"
    
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    code = Column(String(6), nullable=False)
    purpose = Column(String, nullable=False)  # "email_verify", "phone_verify", "login", "password_reset"
    delivery_method = Column(String, nullable=False)  # "email" or "sms"
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="otps")
    
    def is_expired(self) -> bool:
        """Check if OTP is expired"""
        return datetime.utcnow() > self.expires_at
    
    def is_valid(self, code: str) -> bool:
        """Check if OTP is valid"""
        return (
            self.code == code 
            and not self.is_used 
            and not self.is_expired()
        )
