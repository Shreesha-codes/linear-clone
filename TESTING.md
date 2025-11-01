# Testing the Authentication System

## Quick Start - Test the Auth Endpoints

### 1. Start the API Server

```bash
cd apps/api
npm run dev
```

Server should start at: http://localhost:3001

### 2. Test with cURL Commands

#### Register a New User

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"TestPass123\",\"name\":\"Test User\"}"
```

**Expected Response (201):**
```json
{
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "test@example.com",
      "name": "Test User",
      "avatarUrl": null,
      "createdAt": "2025-11-01T...",
      "updatedAt": "2025-11-01T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Save the token from the response!**

#### Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"TestPass123\"}"
```

#### Get Current User (Protected Route)

```bash
# Replace YOUR_TOKEN with the token from register/login
curl -X GET http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Logout

```bash
# Replace YOUR_TOKEN and YOUR_SESSION_TOKEN with actual values
curl -X POST http://localhost:3001/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-Session-Token: YOUR_SESSION_TOKEN"
```

---

## PowerShell Commands (Windows)

### Register

```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@example.com","password":"TestPass123","name":"Test User"}' | ConvertTo-Json -Depth 10
```

### Login

```powershell
$response = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@example.com","password":"TestPass123"}'

# Save token for later use
$token = $response.data.token
Write-Host "Token: $token"
```

### Get Current User

```powershell
# Use the token from previous step
Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/me" `
  -Method GET `
  -Headers @{ Authorization = "Bearer $token" } | ConvertTo-Json -Depth 10
```

---

## Using REST Client (VS Code Extension)

Install "REST Client" extension in VS Code, then create a file `test-auth.http`:

```http
### Variables
@baseUrl = http://localhost:3001/api/v1
@email = test@example.com
@password = TestPass123

### Register User
POST {{baseUrl}}/auth/register
Content-Type: application/json

{
  "email": "{{email}}",
  "password": "{{password}}",
  "name": "Test User"
}

### Login
# @name login
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "{{email}}",
  "password": "{{password}}"
}

### Get Current User
@token = {{login.response.body.data.token}}

GET {{baseUrl}}/auth/me
Authorization: Bearer {{token}}

### Logout
POST {{baseUrl}}/auth/logout
Authorization: Bearer {{token}}
X-Session-Token: dummy-session-token
```

Click "Send Request" above each section to test.

---

## Using Postman

1. **Create a new Collection** called "Linear Clone Auth"

2. **Register User:**
   - Method: POST
   - URL: `http://localhost:3001/api/v1/auth/register`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "email": "test@example.com",
       "password": "TestPass123",
       "name": "Test User"
     }
     ```

3. **Save the token from response:**
   - Go to Tests tab in Postman
   - Add script:
     ```javascript
     pm.environment.set("auth_token", pm.response.json().data.token);
     ```

4. **Get Current User:**
   - Method: GET
   - URL: `http://localhost:3001/api/v1/auth/me`
   - Headers: `Authorization: Bearer {{auth_token}}`

---

## Run Automated Tests

### Unit Tests (Already Passing)

```bash
cd apps/api
npm run test
```

**Expected Output:**
```
✓ src/__tests__/auth.lib.test.ts (12 tests)
✓ src/__tests__/auth.routes.test.ts (5 tests)

Test Files  2 passed (2)
Tests  17 passed (17)
Duration  2.61s
```

### Test Coverage

```bash
npm run test:coverage
```

### Watch Mode (for development)

```bash
npm run test:watch
```

---

## Test Scenarios

### ✅ Success Cases

1. **Register with valid data** → 201 Created
2. **Login with correct credentials** → 200 OK
3. **Access protected route with valid token** → 200 OK
4. **Logout with valid session** → 200 OK

### ❌ Error Cases

1. **Register with duplicate email:**
   ```bash
   # Register the same user twice
   ```
   → 409 Conflict

2. **Register with weak password:**
   ```bash
   curl -X POST http://localhost:3001/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d "{\"email\":\"test2@example.com\",\"password\":\"weak\",\"name\":\"Test\"}"
   ```
   → 422 Validation Error

3. **Login with wrong password:**
   ```bash
   curl -X POST http://localhost:3001/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d "{\"email\":\"test@example.com\",\"password\":\"WrongPass123\"}"
   ```
   → 401 Unauthorized

4. **Access protected route without token:**
   ```bash
   curl -X GET http://localhost:3001/api/v1/auth/me
   ```
   → 401 Unauthorized

5. **Access protected route with invalid token:**
   ```bash
   curl -X GET http://localhost:3001/api/v1/auth/me \
     -H "Authorization: Bearer invalid-token"
   ```
   → 401 Unauthorized

---

## Validate Password Requirements

The password must:
- Be at least 8 characters long
- Contain at least one uppercase letter
- Contain at least one lowercase letter
- Contain at least one number

### Valid Passwords:
- ✅ `Password123`
- ✅ `SecurePass1`
- ✅ `MyP@ssw0rd`

### Invalid Passwords:
- ❌ `password` (no uppercase, no number)
- ❌ `PASSWORD123` (no lowercase)
- ❌ `Pass123` (too short)
- ❌ `Password` (no number)

---

## Check Database

You can verify the data is being stored correctly:

```bash
cd packages/database
npm run db:studio
```

This opens Drizzle Studio where you can:
- View the `users` table (password should be hashed)
- View the `sessions` table
- Verify data integrity

---

## Health Check

Test if the server is running:

```bash
curl http://localhost:3001/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-01T..."
}
```

---

## Troubleshooting

### Server won't start

**Error:** `DATABASE_URL environment variable is not set`

**Solution:**
```bash
cd apps/api
# Create .env file with:
echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/linearClone" > .env
echo "JWT_SECRET=your-secret-key" >> .env
```

### Database connection error

**Check PostgreSQL is running:**
```bash
# Windows
Get-Service postgresql*

# Or check if port 5432 is listening
netstat -an | findstr 5432
```

### Token expired error

**Solution:** The token expires after 7 days. Just login again to get a new token.

### Test failures

**Run type check first:**
```bash
npm run check-types
```

**Clear and reinstall dependencies:**
```bash
rm -rf node_modules
npm install
```

---

## Integration Testing (Future)

For full integration tests with database, you'll need:

1. **Test Database Setup**
   ```sql
   CREATE DATABASE linear_clone_test;
   ```

2. **Test Environment Variables**
   ```bash
   # .env.test
   DATABASE_URL=postgresql://postgres:password@localhost:5432/linear_clone_test
   JWT_SECRET=test-secret-key
   NODE_ENV=test
   ```

3. **Test Runner Configuration**
   - Database seeding before tests
   - Database cleanup after tests
   - Isolated test transactions

This will be implemented in Phase 5 (Comprehensive Testing).

---

## Quick Test Script

Save this as `test-auth.ps1`:

```powershell
# Test Auth Endpoints
$baseUrl = "http://localhost:3001/api/v1"

Write-Host "1. Testing Registration..." -ForegroundColor Cyan
$register = Invoke-RestMethod -Uri "$baseUrl/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@example.com","password":"TestPass123","name":"Test User"}'

$token = $register.data.token
Write-Host "✓ Registered successfully! Token: $($token.Substring(0,20))..." -ForegroundColor Green

Write-Host "`n2. Testing Login..." -ForegroundColor Cyan
$login = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@example.com","password":"TestPass123"}'

Write-Host "✓ Logged in successfully!" -ForegroundColor Green

Write-Host "`n3. Testing Get Current User..." -ForegroundColor Cyan
$me = Invoke-RestMethod -Uri "$baseUrl/auth/me" `
  -Method GET `
  -Headers @{ Authorization = "Bearer $token" }

Write-Host "✓ Got user: $($me.data.user.name) ($($me.data.user.email))" -ForegroundColor Green

Write-Host "`n✓ All tests passed!" -ForegroundColor Green
```

Run it:
```powershell
.\test-auth.ps1
```

---

**Happy Testing! 🎉**
