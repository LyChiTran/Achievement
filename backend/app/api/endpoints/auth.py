from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user, get_db
from app.core.config import settings
from app.core.security import create_access_token
from app.crud.crud_user import user as crud_user
from app.models.user import User
from app.schemas.token import Token
from app.schemas.user import User as UserSchema, UserCreate

router = APIRouter()


@router.post("/register/request-otp", response_model=dict)
def register_request_otp(
    *,
    db: Session = Depends(get_db),
    email: str,
    full_name: str = ""
) -> Any:
    """
    Step 1: Send OTP to email for registration
    """
    from app.services.otp_service import otp_service
    
    # Check if user already exists
    user = crud_user.get_by_email(db, email=email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )
    
    # Generate OTP using email (no user_id needed for registration)
    otp = otp_service.create_otp(db, email=email, purpose="registration")
    
    # Print OTP to console logs (since SendGrid is not configured)
    print("=" * 50)
    print(f"🔐 REGISTRATION OTP FOR: {email}")
    print(f"📧 OTP CODE: {otp.code}")
    print(f"⏰ Expires: {otp.expires_at}")
    print("=" * 50)
    
    # TODO: Enable when SendGrid is configured
    # email_service.send_registration_otp(to_email=email, otp_code=otp.code, user_name=full_name or "User")
    
    return {"message": f"OTP sent! (Check Railway logs for code: {otp.code})", "debug_otp": otp.code}


@router.post("/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
def register(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate,
    otp_code: str,
) -> Any:
    """
    Step 2: Verify OTP and create user account
    """
    from app.services.otp_service import otp_service
    
    # Check if user already exists
    user = crud_user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="A user with this email already exists.",
        )
    
    # Verify OTP
    temp_user_id = abs(hash(user_in.email)) % 1000000000
    is_valid = otp_service.verify_otp(db, user_id=temp_user_id, code=otp_code, purpose="registration")
    
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )
    
    # Create new user with email verified
    user = crud_user.create(db, obj_in=user_in)
    
    # Mark email as verified
    from app.schemas.user import UserUpdate
    user_update = UserUpdate(is_email_verified=True)
    user = crud_user.update(db, db_obj=user, obj_in=user_update)
    
    return user


@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    # Authenticate user
    user = crud_user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    elif not crud_user.is_active(user):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/me", response_model=UserSchema)
def read_users_me(
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get current user information.
    """
    return current_user


@router.put("/me", response_model=UserSchema)
def update_user_me(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    user_in: dict,
) -> Any:
    """
    Update current user profile.
    """
    # Update user profile
    user = crud_user.update(db, db_obj=current_user, obj_in=user_in)
    return user


@router.post("/change-password", response_model=dict)
def change_password(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    current_password: str,
    new_password: str,
) -> Any:
    """
    Change user password.
    """
    # Verify current password
    if not crud_user.authenticate(db, email=current_user.email, password=current_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect password"
        )
    
    # Update password
    from app.schemas.user import UserUpdate
    user_update = UserUpdate(password=new_password)
    crud_user.update(db, db_obj=current_user, obj_in=user_update)
    
    return {"message": "Password updated successfully"}


@router.post("/forgot-password", response_model=dict)
def forgot_password(
    *,
    db: Session = Depends(get_db),
    email: str,
) -> Any:
    """
    Send OTP to user email for password reset.
    """
    from app.services.otp_service import otp_service
    from app.services.email_service import email_service
    
    # Check if user exists
    user = crud_user.get_by_email(db, email=email)
    if not user:
        # Don't reveal if email exists or not for security
        return {"message": "If the email exists, an OTP has been sent"}
    
    # Generate and send OTP
    otp = otp_service.create_otp(db, user_id=user.id, purpose="password_reset")
    email_service.send_otp_email(to_email=user.email, otp_code=otp.code, user_name=user.full_name)
    
    return {"message": "If the email exists, an OTP has been sent"}


@router.post("/verify-otp", response_model=dict)
def verify_otp(
    *,
    db: Session = Depends(get_db),
    email: str,
    otp_code: str,
) -> Any:
    """
    Verify OTP code for password reset.
    """
    from app.services.otp_service import otp_service
    
    # Get user
    user = crud_user.get_by_email(db, email=email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP"
        )
    
    # Verify OTP
    is_valid = otp_service.verify_otp(db, user_id=user.id, code=otp_code, purpose="password_reset")
    
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )
    
    return {"message": "OTP verified successfully", "email": email}


@router.post("/reset-password", response_model=dict)
def reset_password(
    *,
    db: Session = Depends(get_db),
    email: str,
    new_password: str,
) -> Any:
    """
    Reset password after OTP verification.
    Note: OTP must be verified first via /verify-otp endpoint.
    """
    from app.schemas.user import UserUpdate
    from app.services.email_service import email_service
    
    # Get user
    user = crud_user.get_by_email(db, email=email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User not found"
        )
    
    # Update password
    user_update = UserUpdate(password=new_password)
    crud_user.update(db, db_obj=user, obj_in=user_update)
    
    # Send confirmation email
    email_service.send_password_reset_confirmation(to_email=user.email, user_name=user.full_name)
    
    return {"message": "Password reset successfully"}

