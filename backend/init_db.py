#!/usr/bin/env python3
"""
Database initialization script for Railway deployment.
Runs Alembic migrations to create all tables.
"""

import os
import sys
from pathlib import Path

# Add app directory to path
sys.path.insert(0, str(Path(__file__).parent))

from alembic.config import Config
from alembic import command
from app.core.config import settings

def init_db():
    """Run database migrations"""
    print("=" * 50)
    print("Database Initialization Started")
    print(f"Database URL: {settings.DATABASE_URL[:50]}...")
    print("=" * 50)
    
    try:
        # Configure Alembic
        alembic_cfg = Config("alembic.ini")
        alembic_cfg.set_main_option("sqlalchemy.url", settings.DATABASE_URL)
        
        # Run migrations to latest version
        print("\nRunning database migrations...")
        command.upgrade(alembic_cfg, "head")
        
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
