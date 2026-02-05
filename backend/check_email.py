import sqlite3

# Connect to database
conn = sqlite3.connect('achievement.db')
cursor = conn.cursor()

# Check for specific email
email_to_check = input("Enter email to check: ")

cursor.execute("SELECT id, email, is_superuser, is_active, created_at FROM users WHERE email = ?", (email_to_check,))
result = cursor.fetchone()

if result:
    print(f"\n✅ EMAIL FOUND!")
    print(f"ID: {result[0]}")
    print(f"Email: {result[1]}")
    print(f"is_superuser: {result[2]}")
    print(f"is_active: {result[3]}")
    print(f"Created: {result[4]}")
else:
    print(f"\n❌ Email '{email_to_check}' NOT FOUND in database")

# List all emails
print("\n\n=== ALL USERS IN DATABASE ===")
cursor.execute("SELECT id, email, is_superuser FROM users ORDER BY id")
all_users = cursor.fetchall()

if all_users:
    for user in all_users:
        admin_badge = "👑 ADMIN" if user[2] else "👤 User"
        print(f"{user[0]}. {user[1]} - {admin_badge}")
else:
    print("No users found")

conn.close()
