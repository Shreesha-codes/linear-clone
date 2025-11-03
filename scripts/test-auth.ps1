# Quick Auth Test Script
$baseUrl = "http://localhost:3001/api/v1"
$email = "test$(Get-Random)@example.com"

Write-Host "`n=== Testing Authentication ===" -ForegroundColor Cyan

# Test 1: Register
Write-Host "`n1. Testing Registration..." -ForegroundColor Yellow
try {
    $body = @{
        email = $email
        password = "TestPass123"
        name = "Test User"
    } | ConvertTo-Json
    
    $register = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -ContentType "application/json" -Body $body
    $token = $register.data.token
    Write-Host "   SUCCESS: User registered!" -ForegroundColor Green
    Write-Host "   Email: $($register.data.user.email)" -ForegroundColor Gray
} catch {
    Write-Host "   FAILED: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Login
Write-Host "`n2. Testing Login..." -ForegroundColor Yellow
try {
    $body = @{
        email = $email
        password = "TestPass123"
    } | ConvertTo-Json
    
    $login = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $body
    Write-Host "   SUCCESS: User logged in!" -ForegroundColor Green
} catch {
    Write-Host "   FAILED: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 3: Get Current User
Write-Host "`n3. Testing Get Current User..." -ForegroundColor Yellow
try {
    $headers = @{ Authorization = "Bearer $token" }
    $me = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method GET -Headers $headers
    Write-Host "   SUCCESS: Got user data!" -ForegroundColor Green
    Write-Host "   Name: $($me.data.user.name)" -ForegroundColor Gray
} catch {
    Write-Host "   FAILED: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== All Tests Passed! ===" -ForegroundColor Green
