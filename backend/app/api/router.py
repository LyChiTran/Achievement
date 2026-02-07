from fastapi import APIRouter
from app.api.endpoints import (
    auth,
    achievements,
    categories,
    goals,
    skills,
    users,
    admin,
    google_auth,  # Add Google OAuth
)

api_router = APIRouter()

# Auth routes
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(google_auth.router, prefix="/auth", tags=["google-oauth"])  # Google OAuth

# User routes
api_router.include_router(users.router, prefix="/users", tags=["users"])

# Achievement & Goal routes
api_router.include_router(achievements.router, prefix="/achievements", tags=["achievements"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(goals.router, prefix="/goals", tags=["goals"])
api_router.include_router(skills.router, prefix="/skills", tags=["skills"])

# Admin routes
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
