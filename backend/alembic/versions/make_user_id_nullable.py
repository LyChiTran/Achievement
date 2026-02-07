"""make user_id nullable in otps table

Revision ID: make_user_id_nullable
Revises: 0bf3b7770ead
Create Date: 2026-02-08 00:07:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'make_user_id_nullable'
down_revision = '0bf3b7770ead'
branch_labels = None
depends_on = None


def upgrade():
    # Make user_id nullable to support registration OTP before user exists
    op.alter_column('otps', 'user_id',
                    existing_type=sa.INTEGER(),
                    nullable=True)
    
    # Add email column to store email for registration OTP
    op.add_column('otps', sa.Column('email', sa.String(), nullable=True))


def downgrade():
    # Remove email column
    op.drop_column('otps', 'email')
    
    # Make user_id not nullable again
    op.alter_column('otps', 'user_id',
                    existing_type=sa.INTEGER(),
                    nullable=False)
