# Import all models here to ensure they are registered with SQLAlchemy
from app.models.user import User
from app.models.category import Category
from app.models.achievement import Achievement
from app.models.skill import Skill
from app.models.goal import Goal
from app.models.media import Media
from app.models.otp import OTP
from app.models.subscription import Subscription

__all__ = ["User", "Category", "Achievement", "Skill", "Goal", "Media", "OTP", "Subscription"]

