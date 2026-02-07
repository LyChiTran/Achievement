from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette.requests import Request
from starlette.responses import RedirectResponse

from app.api.deps import get_db
from app.core.config import settings
from app.core.security import create_access_token
from app.crud.crud_user import user as crud_user
from app.schemas.user import UserCreate
from app.schemas.token import Token
from datetime import timedelta
import httpx

router = APIRouter()



@router.get("/google/login")
async def google_login(request: Request):
    """
    Redirect to Google OAuth login page
    """
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=500,
            detail="Google OAuth not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Railway environment variables."
        )
    
    # Build authorization URL manually (no session needed)
    auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={settings.GOOGLE_CLIENT_ID}&"
        f"redirect_uri={settings.GOOGLE_REDIRECT_URI}&"
        "response_type=code&"
        "scope=openid email profile&"
        "access_type=offline&"
        "prompt=consent"
    )
    
    return RedirectResponse(url=auth_url)


@router.post("/google/callback", response_model=Token)
async def google_callback(
    code: str,
    db: Session = Depends(get_db)
) -> Any:
    """
    Handle Google OAuth callback and create/login user
    """
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=500,
            detail="Google OAuth not configured"
        )
    
    try:
        # Exchange code for token
        token_url = "https://oauth2.googleapis.com/token"
        async with httpx.AsyncClient() as client:
            response = await client.post(
                token_url,
                data={
                    "code": code,
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                    "grant_type": "authorization_code",
                }
            )
            response.raise_for_status()
            token_data = response.json()
        
        # Get user info
        async with httpx.AsyncClient() as client:
            user_response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {token_data['access_token']}"}
            )
            user_response.raise_for_status()
            google_user = user_response.json()
        
        email = google_user.get("email")
        name = google_user.get("name", "")
        picture = google_user.get("picture", "")
        
        if not email:
            raise HTTPException(status_code=400, detail="Email not provided by Google")
        
        # Check if user exists
        user = crud_user.get_by_email(db, email=email)
        
        if not user:
            # Create new user from Google account
            # Use short UUID-based dummy password (Google users won't use it)
            import uuid
            dummy_password = f"google_{uuid.uuid4().hex[:16]}"
            
            user_in = UserCreate(
                email=email,
                password=dummy_password,
                full_name=name
            )
            user = crud_user.create(db, obj_in=user_in)
            
            # Mark as verified and update avatar
            from app.schemas.user import UserUpdate
            user_update = UserUpdate(
                is_email_verified=True,
                avatar_url=picture if picture else None
            )
            user = crud_user.update(db, db_obj=user, obj_in=user_update)
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            subject=user.id, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
        
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to authenticate with Google: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"OAuth error: {str(e)}"
        )
