import requests

# Test login
login_data = {
    'username': 'admin1@gmail.com',
    'password': 'Admin123'
}

print("Testing login...")
response = requests.post('http://localhost:8000/api/auth/login', data=login_data)
print(f"Login status: {response.status_code}")

if response.status_code == 200:
    token = response.json()['access_token']
    print(f"Token: {token[:50]}...")
    
    # Test /me endpoint
    print("\nTesting /api/auth/me...")
    headers = {'Authorization': f'Bearer {token}'}
    me_response = requests.get('http://localhost:8000/api/auth/me', headers=headers)
    print(f"Status: {me_response.status_code}")
    
    if me_response.status_code == 200:
        user_data = me_response.json()
        print("\n=== USER DATA ===")
        print(f"Email: {user_data.get('email')}")
        print(f"is_superuser: {user_data.get('is_superuser')}")
        print(f"is_active: {user_data.get('is_active')}")
        print("\nFull response:")
        import json
        print(json.dumps(user_data, indent=2))
    else:
        print(f"ERROR: {me_response.text}")
else:
    print(f"Login failed: {response.text}")
