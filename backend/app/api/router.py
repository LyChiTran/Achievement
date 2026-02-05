from fastapi import APIRouter
from app.api.endpoints import auth, achievements, categories, skills, goals, admin

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(achievements.router, prefix="/achievements", tags=["achievements"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(skills.router, prefix="/skills", tags=["skills"])
api_router.include_router(goals.router, prefix="/goals", tags=["goals"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
