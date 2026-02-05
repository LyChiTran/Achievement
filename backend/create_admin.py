from app.db.session import SessionLocal
from app.crud.crud_user import user as crud_user
from app.schemas.user import UserCreate, UserUpdate

db = SessionLocal()

# Check if admin exists
admin = crud_user.get_by_email(db, email='admin1@gmail.com')

if admin:
    print(f'✅ User exists: {admin.email}')
    print(f'Current is_superuser: {admin.is_superuser}')
    
    if not admin.is_superuser:
        # Update to superuser
        update = UserUpdate(is_superuser=True)
        admin = crud_user.update(db, db_obj=admin, obj_in=update)
        print('✅ Updated to admin/superuser!')
    else:
        print('✅ Already admin/superuser')
else:
    # Create new admin user
    print('Creating new admin user...')
    user_in = UserCreate(
        email='admin1@gmail.com',
        password='Admin123',
        full_name='Admin User'
    )
    new_user = crud_user.create(db, obj_in=user_in)
    new_user.is_superuser = True
    db.commit()
    print('✅ Created new admin user!')
    print(f'Email: admin1@gmail.com')
    print(f'Password: Admin123')

db.close()
print('\n🎉 Done! You can now login with admin1@gmail.com')
