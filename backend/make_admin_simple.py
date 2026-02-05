import sqlite3
import bcrypt

# Connect to database
conn = sqlite3.connect('achievement_web.db')
cursor = conn.cursor()

# Check if admin1@gmail.com exists
cursor.execute("SELECT email, is_superuser FROM users WHERE email = ?", ('admin1@gmail.com',))
result = cursor.fetchone()

if result:
    print(f'✅ User exists: {result[0]}')
    print(f'Current is_superuser: {result[1]}')
    
    if result[1] == 0:
        # Update to superuser
        cursor.execute("UPDATE users SET is_superuser = 1 WHERE email = ?", ('admin1@gmail.com',))
        conn.commit()
        print('✅ Updated to admin!')
    else:
        print('✅ Already admin!')
else:
    # Create new admin user
    print('Creating new admin user...')
    password = 'Admin123'
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    cursor.execute("""
        INSERT INTO users (email, hashed_password, full_name, is_active, is_superuser, is_verified)
        VALUES (?, ?, ?, 1, 1, 1)
    """, ('admin1@gmail.com', hashed, 'Admin User'))
    conn.commit()
    print('✅ Created new admin user!')
    print('Email: admin1@gmail.com')
    print('Password: Admin123')

conn.close()
print('\n🎉 Done! Login with admin1@gmail.com / Admin123')
