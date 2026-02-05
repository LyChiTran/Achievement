from typing import Optional
from pydantic import BaseModel


class Token(BaseModel):
    """JWT Token response schema"""
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """JWT Token payload schema"""
    sub: Optional[int] = None
