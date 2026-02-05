from datetime import datetime, timedelta
from random import randint
from sqlalchemy.orm import Session
from app.models.otp import OTP
from app.models.user import User


class OTPService:
    """Service for generating and verifying OTP codes"""
    
    OTP_LENGTH = 6
    OTP_EXPIRY_MINUTES = 10
    
    @staticmethod
    def generate_code() -> str:
        """Generate a random 6-digit OTP code"""
        return str(randint(100000, 999999))
    
    @staticmethod
    def create_otp(
        db: Session,
        user_id: int,
        purpose: str = "password_reset",
        delivery_method: str = "email"
    ) -> OTP:
        """Create and store an OTP for a user"""
        # Invalidate any existing OTPs for this purpose
        db.query(OTP).filter(
            OTP.user_id == user_id,
            OTP.purpose == purpose,
            OTP.is_used == False
        ).update({"is_used": True})
        
        # Generate new OTP
        code = OTPService.generate_code()
        expires_at = datetime.utcnow() + timedelta(minutes=OTPService.OTP_EXPIRY_MINUTES)
        
        otp = OTP(
            user_id=user_id,
            code=code,
            purpose=purpose,
            delivery_method=delivery_method,
            expires_at=expires_at,
            is_used=False
        )
        
        db.add(otp)
        db.commit()
        db.refresh(otp)
        
        return otp
    
    @staticmethod
    def verify_otp(
        db: Session,
        user_id: int,
        code: str,
        purpose: str = "password_reset"
    ) -> bool:
        """Verify an OTP code for a user"""
        otp = db.query(OTP).filter(
            OTP.user_id == user_id,
            OTP.code == code,
            OTP.purpose == purpose,
            OTP.is_used == False
        ).first()
        
        if not otp:
            return False
        
        # Check if valid
        if not otp.is_valid(code):
            return False
        
        # Mark as used
        otp.is_used = True
        db.commit()
        
        return True
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> User | None:
        """Get user by email"""
        return db.query(User).filter(User.email == email).first()


otp_service = OTPService()
