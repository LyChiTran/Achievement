#!/usr/bin/env python3
"""
Database initialization script for Railway deployment.
Runs Alembic migrations and creates default admin user.
"""

import os
import sys
from pathlib import Path

# Add app directory to path
sys.path.insert(0, str(Path(__file__).parent))

from alembic.config import Config
from alembic import command
from app.core.config import settings
from app.db.base import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

def create_admin_user(db):
    """Create default admin user if not exists"""
    admin_email = "admin@achievement.com"
    
    # Check if admin exists
    existing_admin = db.query(User).filter(User.email == admin_email).first()
    if existing_admin:
        print(f"   Admin user already exists: {admin_email}")
        return
    
    # Create admin user
    admin = User(
        email=admin_email,
        hashed_password=get_password_hash("Admin123!"),  # Default password
        full_name="System Administrator",
        is_active=True,
        is_superuser=True,
        is_email_verified=True
    )
    db.add(admin)
    db.commit()
    
    print("\n" + "🎉" * 25)
    print("   ✅ Default admin user created!")
    print(f"   📧 Email: {admin_email}")
    print("   🔑 Password: Admin123!")
    print("   ⚠️  IMPORTANT: Change password after first login!")
    print("🎉" * 25)

def init_db():
    """Run database migrations and setup"""
    print("=" * 50)
    print("Database Initialization Started")
    print(f"Database URL: {settings.DATABASE_URL[:50]}...")
    print("=" * 50)
    
    try:
        # Configure Alembic
        alembic_cfg = Config("alembic.ini")
        alembic_cfg.set_main_option("sqlalchemy.url", settings.DATABASE_URL)
        
        # Run migrations to latest version
        print("\n1️⃣  Running database migrations...")
        command.upgrade(alembic_cfg, "head")
        print("   ✅ Migrations completed!")
        
        # Create admin user
        print("\n2️⃣  Creating default admin user...")
        db = SessionLocal()
        try:
            create_admin_user(db)
        finally:
            db.close()
        
        print("\n" + "=" * 50)
        print("✅ Database initialization completed successfully!")
        print("=" * 50)
        
        return True
        
    except Exception as e:
        print("\n" + "=" * 50)
        print(f"❌ Database initialization failed: {e}")
        print("=" * 50)
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = init_db()
    sys.exit(0 if success else 1)
