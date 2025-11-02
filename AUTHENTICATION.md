# Authentication System Documentation

## Overview

The Linear Clone uses a **hybrid authentication approach** combining:
- **Backend**: Custom JWT + Bcrypt implementation (Hono.js API)
- **Frontend**: Better Auth UI patterns with Zustand state management (Next.js)

This provides the security of JWT tokens with the user experience of Better Auth's patterns.

---

## Architecture

### Backend (Hono.js API - Port 3001)

**Location**: `apps/api/src/`

**Components**:
1. **Auth Library** (`lib/auth.ts`):
   - Password hashing with Bcrypt (cost factor 12)
   - JWT token generation and verification
   - Session token generation
   - Token expiration: 7 days

2. **Auth Routes** (`routes/auth.ts`):
   - `POST /api/auth/register` - User registration
   - `POST /api/auth/login` - User login (returns JWT token)
   - `POST /api/auth/logout` - User logout
   - `GET /api/auth/me` - Get current user (requires JWT)

3. **Auth Middleware** (`middleware/auth.ts`):
   - JWT token verification
   - Attaches user info to request context
   - Used to protect routes

**Database Tables**:
- `users` - User accounts (id, email, name, password_hash, avatar_url, created_at, updated_at)
- `sessions` - Optional session storage (currently using JWT only)

### Frontend (Next.js - Port 3000)

**Location**: `apps/web/src/`

**Components**:
1. **Auth Client** (`lib/auth-client.ts`):
   - Better Auth client instance (configured for custom backend)
   - Auth adapter for API integration
   - Methods: register(), login(), logout(), getCurrentUser()

2. **Auth Store** (`stores/authStore.ts`):
   - Zustand store for global auth state
   - State: user, token, isAuthenticated, isLoading
   - Actions: loginWithEmail(), registerWithEmail(), logoutUser(), initializeSession()
   - Persisted to localStorage (dev only - use httpOnly cookies in production)

3. **Auth Pages** (`app/(auth)/`):
   - `/login` - Login form with email/password
   - `/register` - Registration form with validation
   - Shared layout with branding

4. **Protected Routes** (`components/ProtectedRoute.tsx`):
   - HOC for wrapping protected pages
   - Redirects to /login if not authenticated
   - Shows loading state during authentication check

---

## Authentication Flow

### 1. User Registration

**Frontend Flow**:
```tsx
// User fills registration form (name, email, password)
await registerWithEmail(email, password, name);
// ↓
// authAdapter.register() calls POST /api/auth/register
// ↓
// Backend creates user, hashes password, generates JWT
// ↓
// Frontend stores user + token in authStore
// ↓
// Redirect to /dashboard
```

**Backend Flow**:
```typescript
POST /api/auth/register
  ↓
  Validate input (Zod schema)
  ↓
  Check if email exists
  ↓
  Hash password (Bcrypt)
  ↓
  Insert user into database
  ↓
  Generate JWT token
  ↓
  Create session record
  ↓
  Return { user, token }
```

**Request Example**:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Response**:
```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "john@example.com",
      "name": "John Doe",
      "avatar_url": null,
      "created_at": "2025-11-02T12:00:00.000Z",
      "updated_at": "2025-11-02T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. User Login

**Frontend Flow**:
```tsx
// User fills login form (email, password)
await loginWithEmail(email, password);
// ↓
// authAdapter.login() calls POST /api/auth/login
// ↓
// Backend verifies password, generates JWT
// ↓
// Frontend stores user + token in authStore
// ↓
// Redirect to /dashboard
```

**Backend Flow**:
```typescript
POST /api/auth/login
  ↓
  Validate input
  ↓
  Find user by email
  ↓
  Compare password with hash (Bcrypt)
  ↓
  Generate JWT token
  ↓
  Update session record
  ↓
  Return { user, token }
```

**Request Example**:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Response**: Same as registration

### 3. Session Initialization

**Frontend Flow** (on app load):
```tsx
// Component mounts
useEffect(() => {
  initializeSession();
}, []);
// ↓
// authAdapter.getCurrentUser() calls GET /api/auth/me
// ↓
// Backend verifies JWT from localStorage
// ↓
// Frontend updates authStore with user info
```

**Backend Flow**:
```typescript
GET /api/auth/me
  ↓
  Extract JWT from Authorization header
  ↓
  Verify JWT signature and expiration
  ↓
  Find user by ID from token
  ↓
  Return { user }
```

**Request Example**:
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Protected Route Access

**Frontend Flow**:
```tsx
// User navigates to /dashboard
// ↓
// Dashboard page calls initializeSession()
// ↓
// If not authenticated → redirect to /login
// ↓
// If authenticated → render page
```

### 5. User Logout

**Frontend Flow**:
```tsx
await logoutUser();
// ↓
// authAdapter.logout() calls POST /api/auth/logout
// ↓
// Backend deletes session
// ↓
// Frontend clears localStorage and authStore
// ↓
// Redirect to /login
```

---

## Usage Examples

### Login Form

```tsx
import { useAuthStore } from '@/stores/authStore';

function LoginForm() {
  const { loginWithEmail, isLoading } = useAuthStore();

  const handleLogin = async (email: string, password: string) => {
    try {
      await loginWithEmail(email, password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin(email, password);
    }}>
      {/* Form fields */}
    </form>
  );
}
```

### Protected Page

```tsx
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export default function DashboardPage() {
  const { user, isAuthenticated, initializeSession } = useAuthStore();

  useEffect(() => {
    initializeSession(); // Check authentication on page load
  }, []);

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return <div>Welcome, {user?.name}!</div>;
}
```

### Get Current User

```tsx
const { user } = useAuthStore();

if (user) {
  console.log(user.id, user.email, user.name);
}
```

### Logout

```tsx
const { logoutUser } = useAuthStore();

const handleLogout = async () => {
  await logoutUser();
  router.push('/login');
};
```

---

## API Client Integration

The auth system automatically integrates with the API client for protected endpoints:

```tsx
import { api } from '@/lib/api';

// API client automatically includes JWT token from authStore
const issues = await api.issues.list({ teamId: 'team-123' });
```

**How it works**:
1. API client reads token from localStorage
2. Adds `Authorization: Bearer <token>` header to all requests
3. Backend middleware verifies token
4. Request proceeds with authenticated user context

---

## Security Considerations

### Current Implementation (Development)

- ✅ JWT tokens with 7-day expiration
- ✅ Bcrypt password hashing (cost factor 12)
- ✅ Password minimum length validation (8 characters)
- ✅ Email uniqueness validation
- ⚠️ **Tokens stored in localStorage** (vulnerable to XSS)

### Production Recommendations

1. **Use httpOnly Cookies**:
   ```typescript
   // Backend sets cookie
   res.setHeader('Set-Cookie', `token=${jwt}; HttpOnly; Secure; SameSite=Strict`);
   
   // Frontend doesn't need to store token
   // Browser automatically sends cookie with requests
   ```

2. **Add CSRF Protection**:
   - Generate CSRF token on login
   - Include in form submissions
   - Verify on backend

3. **Implement Refresh Tokens**:
   - Short-lived access tokens (15 min)
   - Long-lived refresh tokens (7 days)
   - Rotate tokens on refresh

4. **Add Rate Limiting**:
   - Already implemented in backend middleware
   - Limit login attempts (10/minute)
   - Limit registration (5/hour per IP)

5. **Enable HTTPS**:
   - Required for Secure cookies
   - Protects tokens in transit

---

## Testing the Authentication

### Manual Testing

1. **Start Backend**:
   ```bash
   cd apps/api
   npm run dev
   # Server: http://localhost:3001
   ```

2. **Start Frontend**:
   ```bash
   cd apps/web
   npm run dev
   # App: http://localhost:3000
   ```

3. **Test Registration**:
   - Navigate to http://localhost:3000/register
   - Fill in name, email, password
   - Submit form
   - Should redirect to /dashboard

4. **Test Login**:
   - Open incognito window
   - Navigate to http://localhost:3000/login
   - Enter credentials
   - Submit form
   - Should redirect to /dashboard

5. **Test Protected Route**:
   - Open incognito window
   - Navigate to http://localhost:3000/dashboard
   - Should redirect to /login

6. **Test Logout**:
   - Click "Sign out" button on dashboard
   - Should redirect to /login
   - Try accessing /dashboard again
   - Should redirect to /login

### Automated Testing

Backend tests already exist:
```bash
cd apps/api
npm run test
# 17/17 tests passing ✅
```

---

## File Structure

```
apps/
├── api/
│   └── src/
│       ├── lib/
│       │   └── auth.ts               # Auth utilities (JWT, Bcrypt)
│       ├── routes/
│       │   └── auth.ts               # Auth API endpoints
│       ├── middleware/
│       │   └── auth.ts               # JWT verification middleware
│       └── __tests__/
│           ├── auth.lib.test.ts      # Auth library tests (12 tests)
│           └── auth.routes.test.ts   # Auth routes tests (5 tests)
│
└── web/
    └── src/
        ├── lib/
        │   └── auth-client.ts        # Better Auth client + adapter
        ├── stores/
        │   └── authStore.ts          # Zustand auth state
        ├── components/
        │   └── ProtectedRoute.tsx    # Protected route wrapper
        └── app/
            ├── (auth)/
            │   ├── layout.tsx         # Auth pages layout
            │   ├── login/
            │   │   └── page.tsx       # Login page
            │   └── register/
            │       └── page.tsx       # Register page
            └── (app)/
                └── dashboard/
                    └── page.tsx       # Protected dashboard
```

---

## Troubleshooting

### "Unauthorized" Error

**Cause**: JWT token is invalid or expired

**Solution**:
```tsx
// Clear localStorage and try logging in again
localStorage.removeItem('auth-storage');
window.location.reload();
```

### "User Already Exists" Error

**Cause**: Email is already registered

**Solution**: Use a different email or login with existing account

### Redirect Loop

**Cause**: Session initialization failing

**Solution**:
```bash
# Check backend is running
curl http://localhost:3001/health

# Check frontend environment
cat apps/web/.env.local
# Should have: NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Token Not Persisting

**Cause**: localStorage not saving

**Solution**:
- Check browser privacy settings
- Use a different browser
- Check localStorage in DevTools:
  ```javascript
  localStorage.getItem('auth-storage');
  ```

---

## Next Steps

1. ✅ **Authentication Pages** - COMPLETE
2. ✅ **Protected Routes** - COMPLETE
3. ⏳ **Workspace Management** - TODO
4. ⏳ **Team Management** - TODO
5. ⏳ **Issue Tracking** - TODO
6. ⏳ **Real-time Updates** - TODO
7. ⏳ **Production Security** - TODO (httpOnly cookies, CSRF)

---

## Credits

- **Better Auth**: UI patterns and client structure
- **JWT**: Secure token-based authentication
- **Bcrypt**: Password hashing
- **Zustand**: State management
- **Next.js**: Frontend framework
- **Hono.js**: Backend API framework
