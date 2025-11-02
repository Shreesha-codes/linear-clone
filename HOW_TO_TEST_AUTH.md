# 🧪 How to Test Your Authentication System

## ⚡ Quick Check (30 seconds)

### Step 1: Verify Servers Are Running

Open your terminal and run:

```bash
# Check backend
curl http://localhost:3001/health
# ✅ Should return: {"status":"ok","timestamp":"..."}

# Check frontend  
curl -I http://localhost:3000
# ✅ Should return: HTTP/1.1 200 OK
```

**If either server is not running**:
```bash
# Terminal 1 - Start Backend
cd apps/api
npm run dev

# Terminal 2 - Start Frontend
cd apps/web
npm run dev
```

---

## 🎯 Visual Testing (Step-by-Step)

### Test 1: Registration Page

1. **Open your browser** and go to:
   ```
   http://localhost:3000/register
   ```

2. **What you should see**:
   - ✅ A centered card with "Linear Clone" title
   - ✅ "Create an account" heading
   - ✅ Form fields: Name, Email, Password, Confirm Password
   - ✅ "Create account" button
   - ✅ "Sign in instead" link at bottom

3. **Fill in the form**:
   ```
   Name: Test User
   Email: test@example.com
   Password: Password123
   Confirm Password: Password123
   ```

4. **Watch for password strength indicator**:
   - Type slowly and watch the indicator change:
   - 1-7 chars: 🔴 Weak (red)
   - 8-11 chars: 🟡 Medium (yellow)
   - 12+ chars: 🟢 Strong (green)

5. **Click "Create account"**

6. **What should happen**:
   - ✅ You see a loading spinner
   - ✅ Page redirects to `/dashboard`
   - ✅ Dashboard shows your name "Test User"
   - ✅ Dashboard shows your email "test@example.com"

**Screenshot checklist**:
- [ ] Registration form loads
- [ ] Password strength indicator works
- [ ] Submit button shows loading state
- [ ] Redirect to dashboard happens
- [ ] User info displays correctly

---

### Test 2: Session Persistence

1. **While on the dashboard**, press `F5` or `Cmd+R` to refresh

2. **What should happen**:
   - ✅ Brief loading state
   - ✅ You stay on the dashboard (no redirect)
   - ✅ Your user info is still there

**Screenshot checklist**:
- [ ] Refresh doesn't log you out
- [ ] User data persists

---

### Test 3: Logout

1. **On the dashboard**, click the **"Sign out"** button (top right)

2. **What should happen**:
   - ✅ Brief loading state
   - ✅ Redirect to `/login` page
   - ✅ Login form is shown

3. **Try to access dashboard directly**:
   - Type in URL bar: `http://localhost:3000/dashboard`
   - Press Enter

4. **What should happen**:
   - ✅ Automatically redirected back to `/login`
   - ✅ This proves the route is protected!

**Screenshot checklist**:
- [ ] Sign out button works
- [ ] Redirect to login after logout
- [ ] Cannot access dashboard without login

---

### Test 4: Login

1. **On the login page**, enter your credentials:
   ```
   Email: test@example.com
   Password: Password123
   ```

2. **Click "Sign in"**

3. **What should happen**:
   - ✅ Loading spinner appears
   - ✅ Redirect to `/dashboard`
   - ✅ Welcome message with your name

**Screenshot checklist**:
- [ ] Login form loads
- [ ] Submit shows loading state
- [ ] Successful login redirect
- [ ] User data displayed

---

### Test 5: Error Handling

#### Test Invalid Password

1. **On login page**, enter:
   ```
   Email: test@example.com
   Password: WrongPassword
   ```

2. **Click "Sign in"**

3. **What should happen**:
   - ✅ Red error box appears
   - ✅ Error message: "Login failed" or "Invalid credentials"
   - ✅ You stay on login page

#### Test Duplicate Email

1. **Go to registration page**

2. **Try to register with same email**:
   ```
   Email: test@example.com (already exists)
   ```

3. **What should happen**:
   - ✅ Error message about email already in use

**Screenshot checklist**:
- [ ] Error messages display
- [ ] Errors are user-friendly
- [ ] Form doesn't submit on error

---

### Test 6: Protected Routes (Incognito)

1. **Open a new incognito/private window**
   - Chrome: `Cmd+Shift+N` (Mac) or `Ctrl+Shift+N` (Windows)
   - Firefox: `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)

2. **In incognito, go to**:
   ```
   http://localhost:3000/dashboard
   ```

3. **What should happen**:
   - ✅ Brief loading screen
   - ✅ Automatic redirect to `/login`
   - ✅ You never see the dashboard

4. **Now login in incognito**:
   - Use your credentials
   - ✅ Should successfully access dashboard

**Screenshot checklist**:
- [ ] Incognito redirects to login
- [ ] After login, can access dashboard
- [ ] Multiple sessions work

---

## 🔍 Advanced Testing (Browser DevTools)

### Check LocalStorage

1. **Open DevTools**: `F12` or `Cmd+Option+I`

2. **Go to Application tab** → **Local Storage** → `http://localhost:3000`

3. **Find the key**: `auth-storage`

4. **What you should see**:
   ```json
   {
     "state": {
       "user": {
         "id": "uuid-here",
         "email": "test@example.com",
         "name": "Test User",
         ...
       },
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "isAuthenticated": true
     }
   }
   ```

**Screenshot checklist**:
- [ ] `auth-storage` key exists
- [ ] User data is stored
- [ ] JWT token is present

---

### Check Network Requests

1. **Open DevTools** → **Network tab**

2. **Filter by**: `Fetch/XHR`

3. **Login again** and watch for:

   **Registration/Login Request**:
   ```
   POST http://localhost:3001/api/auth/register
   or
   POST http://localhost:3001/api/auth/login
   ```
   
   Click on it → **Response** tab:
   ```json
   {
     "data": {
       "user": { ... },
       "token": "eyJ..."
     }
   }
   ```

   **Session Check Request** (on page load):
   ```
   GET http://localhost:3001/api/auth/me
   ```
   
   Click on it → **Headers** tab → Look for:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

**Screenshot checklist**:
- [ ] API requests visible in Network tab
- [ ] POST /api/auth/login returns 200
- [ ] GET /api/auth/me includes Authorization header
- [ ] Responses contain user data

---

### Decode JWT Token (Console)

1. **Open DevTools** → **Console tab**

2. **Paste this code**:
   ```javascript
   // Get auth data from localStorage
   const authData = JSON.parse(localStorage.getItem('auth-storage'));
   const token = authData.state.token;
   
   console.log('🔑 Full Token:', token);
   
   // Decode JWT (without verification)
   const parts = token.split('.');
   const payload = JSON.parse(atob(parts[1]));
   
   console.log('📦 Token Payload:', payload);
   console.log('👤 User ID:', payload.userId);
   console.log('📧 Email:', payload.email);
   console.log('⏰ Issued At:', new Date(payload.iat * 1000).toLocaleString());
   console.log('⏱️ Expires At:', new Date(payload.exp * 1000).toLocaleString());
   ```

3. **What you should see**:
   ```
   🔑 Full Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   📦 Token Payload: {userId: "...", email: "...", iat: ..., exp: ...}
   👤 User ID: 550e8400-e29b-41d4-a716-446655440000
   📧 Email: test@example.com
   ⏰ Issued At: 11/2/2025, 5:00:00 PM
   ⏱️ Expires At: 11/9/2025, 5:00:00 PM (7 days later)
   ```

**Screenshot checklist**:
- [ ] Token decodes successfully
- [ ] User ID matches database
- [ ] Expiration is 7 days from issue

---

## 🧪 API Testing (curl commands)

### Test Backend Directly

#### 1. Register via API
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test User",
    "email": "api@example.com",
    "password": "SecurePass123"
  }' | jq
```

**Expected output**:
```json
{
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "api@example.com",
      "name": "API Test User",
      ...
    },
    "token": "eyJhbGci..."
  }
}
```

#### 2. Login via API
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api@example.com",
    "password": "SecurePass123"
  }' | jq
```

#### 3. Get Current User (Save token first)
```bash
# Replace TOKEN with actual token from login response
TOKEN="paste-your-token-here"

curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq
```

**Expected output**:
```json
{
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "api@example.com",
      "name": "API Test User",
      ...
    }
  }
}
```

#### 4. Logout via API
```bash
TOKEN="paste-your-token-here"

curl -X POST http://localhost:3001/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq
```

---

## ✅ Final Checklist

After completing all tests, verify:

### Registration ✅
- [ ] Can create new account
- [ ] Password strength indicator works
- [ ] Validation prevents weak passwords
- [ ] Duplicate email shows error
- [ ] Successful redirect to dashboard

### Login ✅
- [ ] Can login with valid credentials
- [ ] Invalid password shows error
- [ ] Successful redirect to dashboard
- [ ] Loading states appear

### Session ✅
- [ ] Session persists after refresh
- [ ] Token stored in localStorage
- [ ] Token included in API requests
- [ ] Token expires after 7 days

### Protected Routes ✅
- [ ] Dashboard requires authentication
- [ ] Unauthenticated users redirected to login
- [ ] After login, can access protected routes
- [ ] Multiple browser windows work independently

### Logout ✅
- [ ] Sign out button works
- [ ] Token cleared from localStorage
- [ ] Redirected to login
- [ ] Cannot access dashboard after logout

### Security ✅
- [ ] Passwords are hashed (never see plain password in response)
- [ ] JWT tokens have expiration
- [ ] Authorization header sent with requests
- [ ] Protected endpoints reject invalid tokens

---

## 📸 Create Demo Screenshots

Take screenshots of:

1. ✅ **Registration page** - Empty form
2. ✅ **Registration page** - Filled form with password strength
3. ✅ **Dashboard** - Successful login
4. ✅ **Login page** - Error message
5. ✅ **DevTools** - LocalStorage with auth data
6. ✅ **DevTools** - Network request with Authorization header
7. ✅ **Incognito** - Protected route redirect

---

## 🎬 Demo Video Script (For Friends)

**1. Introduction (10 sec)**
- "I built a complete authentication system for my Linear clone"

**2. Show Registration (20 sec)**
- Open browser to `/register`
- "Watch the password strength indicator"
- Fill form, submit
- "Automatically redirected to dashboard"

**3. Show Dashboard (15 sec)**
- "Here's my authenticated user info from PostgreSQL"
- Point out user details

**4. Show DevTools (20 sec)**
- Open DevTools → Application → LocalStorage
- "See this JWT token? That's how it knows I'm logged in"
- Open Network tab
- "All my API requests include this authentication header"

**5. Show Protected Routes (15 sec)**
- Open incognito window
- Try to access `/dashboard`
- "See? Automatically redirects - the route is protected!"

**6. Show Logout (10 sec)**
- Click Sign out
- "Token cleared, redirected to login"

**7. Tech Stack (10 sec)**
- "Backend: Hono.js, PostgreSQL, JWT, Bcrypt"
- "Frontend: Next.js, React, Better Auth patterns, Zustand"
- "100% TypeScript, fully type-safe"

**Total**: ~90 seconds

---

## 🚨 Troubleshooting

### Nothing loads / Blank page

```bash
# Check browser console for errors
# Common fix: Clear cache and hard reload
# Mac: Cmd+Shift+R
# Windows: Ctrl+Shift+R
```

### "Cannot connect" errors

```bash
# Verify both servers running
lsof -ti:3001 && echo "Backend: ✅" || echo "Backend: ❌"
lsof -ti:3000 && echo "Frontend: ✅" || echo "Frontend: ❌"

# Restart if needed
cd apps/api && npm run dev    # Terminal 1
cd apps/web && npm run dev    # Terminal 2
```

### Session not persisting

```javascript
// Check localStorage in DevTools Console
localStorage.getItem('auth-storage')
// Should return JSON string with user data

// If null, browser might block localStorage
// Try different browser or disable privacy extensions
```

---

## 🎉 Success!

If you can complete all the tests above, **your authentication system is working perfectly!**

**You now have**:
- ✅ Production-grade authentication
- ✅ Secure JWT + Bcrypt
- ✅ Session management
- ✅ Protected routes
- ✅ Better Auth UI patterns
- ✅ Full TypeScript safety

**Ready to show off!** 🚀

---

## 📚 More Information

- **Architecture Details**: See `AUTHENTICATION.md`
- **Code Implementation**: See `AUTH_IMPLEMENTATION_SUMMARY.md`
- **Quick Start**: See `AUTH_README.md`
