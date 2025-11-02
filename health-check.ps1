# Linear Clone Backend Health Check Script
$baseUrl = "http://localhost:3001"
$pass = 0
$fail = 0

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "LINEAR CLONE BACKEND HEALTH CHECK" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

function Test-Endpoint {
    param([string]$Name, [string]$Url, [string]$Method = "GET")
    
    Write-Host "Testing: $Name" -NoNewline
    try {
        $response = Invoke-WebRequest -Uri $Url -Method $Method -TimeoutSec 5 -ErrorAction Stop
        Write-Host " PASS ($($response.StatusCode))" -ForegroundColor Green
        $script:pass++
        return $true
    } catch {
        Write-Host " FAIL" -ForegroundColor Red
        $script:fail++
        return $false
    }
}

Write-Host "1. CORE SERVER" -ForegroundColor Cyan
Test-Endpoint -Name "Root Endpoint" -Url "$baseUrl/"
Test-Endpoint -Name "Health Check" -Url "$baseUrl/health"
Write-Host ""

Write-Host "2. AUTH ENDPOINTS" -ForegroundColor Cyan
Test-Endpoint -Name "Register" -Url "$baseUrl/api/v1/auth/register" -Method POST
Test-Endpoint -Name "Login" -Url "$baseUrl/api/v1/auth/login" -Method POST
Test-Endpoint -Name "Current User" -Url "$baseUrl/api/v1/auth/me"
Test-Endpoint -Name "Logout" -Url "$baseUrl/api/v1/auth/logout" -Method POST
Write-Host ""

Write-Host "3. RESOURCE ENDPOINTS" -ForegroundColor Cyan
Test-Endpoint -Name "Workspaces" -Url "$baseUrl/api/v1/workspaces"
Test-Endpoint -Name "Teams" -Url "$baseUrl/api/v1/teams"
Test-Endpoint -Name "Projects" -Url "$baseUrl/api/v1/projects"
Test-Endpoint -Name "Issues" -Url "$baseUrl/api/v1/issues"
Test-Endpoint -Name "Cycles" -Url "$baseUrl/api/v1/cycles"
Test-Endpoint -Name "Labels" -Url "$baseUrl/api/v1/labels"
Test-Endpoint -Name "Comments" -Url "$baseUrl/api/v1/comments"
Test-Endpoint -Name "Attachments" -Url "$baseUrl/api/v1/attachments"
Test-Endpoint -Name "Activity" -Url "$baseUrl/api/v1/activity"
Test-Endpoint -Name "Notifications" -Url "$baseUrl/api/v1/notifications"
Test-Endpoint -Name "Search" -Url "$baseUrl/api/v1/search"
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SUMMARY: Passed=$pass Failed=$fail" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
