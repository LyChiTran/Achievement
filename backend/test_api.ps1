# Test admin API
Write-Host "Testing admin login..." -ForegroundColor Yellow

# Login
$body = @{
    username = "admin1@gmail.com"
    password = "Admin123"
}

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/auth/login" -Method Post -Body $body -ContentType "application/x-www-form-urlencoded"
    
    Write-Host "✅ Login successful!" -ForegroundColor Green
    $token = $loginResponse.access_token
    Write-Host "Token: $($token.Substring(0,50))..." -ForegroundColor Gray
    
    # Test /me endpoint
    Write-Host "`nTesting /api/auth/me..." -ForegroundColor Yellow
    $headers = @{
        Authorization = "Bearer $token"
    }
    $meResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/auth/me" -Method Get -Headers $headers
    
    Write-Host "`n=== USER DATA ===" -ForegroundColor Cyan
    Write-Host "Email: $($meResponse.email)"
    Write-Host "is_superuser: $($meResponse.is_superuser)" -ForegroundColor $(if ($meResponse.is_superuser) {"Green"} else {"Red"})
    Write-Host "is_active: $($meResponse.is_active)"
    
    if ($meResponse.is_superuser) {
        Write-Host "`n✅ API RETURNS is_superuser = true!" -ForegroundColor Green
        Write-Host "Now LOGOUT + LOGIN in browser to get new token!" -ForegroundColor Yellow
    } else {
        Write-Host "`n❌ API NOT returning is_superuser!" -ForegroundColor Red
    }
    
    Write-Host "`nFull JSON:" -ForegroundColor Gray
    $meResponse | ConvertTo-Json
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
