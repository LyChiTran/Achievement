import sqlite3

# Connect to the correct database
conn = sqlite3.connect('achievement.db')
cursor = conn.cursor()

# Check tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()
print('Tables in database:', [t[0] for t in tables])

# If users table exists, update admin
if any('users' in t[0].lower() for t in tables):
    # Check if admin exists
    cursor.execute("SELECT email, is_superuser FROM users WHERE email = 'admin1@gmail.com'")
    result = cursor.fetchone()
    
    if result:
        print(f'\n✅ User found: {result[0]}')
        print(f'is_superuser: {result[1]}')
        
        if result[1] == 0:
            cursor.execute("UPDATE users SET is_superuser = 1 WHERE email = 'admin1@gmail.com'")
            conn.commit()
            print('✅ Updated to admin!')
        else:
            print('✅ Already admin!')
    else:
        print('\n❌ admin1@gmail.com not found in database')
        print('Please register this account first via the frontend')
else:
    print('\n❌ No users table found. Database may not be initialized.')

conn.close()
