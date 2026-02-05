from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base
from app.db.base_class import BaseModel


class Subscription(Base, BaseModel):
    """
    Subscription model for Pro tier management.
    """
    __tablename__ = "subscriptions"
    
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    tier = Column(String, default="free", nullable=False)  # "free" or "pro"
    status = Column(String, default="active", nullable=False)  # "active", "cancelled", "expired"
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    amount = Column(Float, nullable=True)
    payment_method = Column(String, nullable=True)  # "stripe", "paypal"
    stripe_subscription_id = Column(String, nullable=True)
    stripe_customer_id = Column(String, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="subscription")
    
    def is_active_pro(self) -> bool:
        """Check if subscription is active Pro"""
        from datetime import datetime
        return (
            self.tier == "pro" 
            and self.status == "active"
            and (self.end_date is None or self.end_date > datetime.utcnow())
        )
