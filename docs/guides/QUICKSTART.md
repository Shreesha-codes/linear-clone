# 🚀 Quick Start Guide - Backend Integration

## TL;DR - What Changed

**All frontend routes now talk to the backend API.**

✅ Issue list fetches from database
✅ Create issue persists to backend
✅ Edit issue updates backend
✅ Kanban drag-drop saves to backend
✅ Optimistic updates with error rollback

---

## Start Both Servers

```bash
# Terminal 1: Backend (Hono.js)
cd apps/api
npm run dev
# → http://localhost:3001

# Terminal 2: Frontend (Next.js)
cd apps/web
npm run dev
# → http://localhost:3000
```

---

## Test It Works

### 1. Register User
```bash
# Go to: http://localhost:3000/api-test
# Fill form → Click "Register"
# Should see: { "user": {...}, "token": "..." }
```

### 2. Create Issue
```bash
# Go to: http://localhost:3000/team/demo-team-1/issues
# Click "New Issue" → Fill form → Submit
# Should see: Issue appears in list instantly
# Network tab: POST /api/v1/teams/demo-team-1/issues
```

### 3. Edit Issue
```bash
# Click on issue → Edit title → Press Enter
# Should see: Title updates instantly
# Network tab: PATCH /api/v1/issues/:id
```

### 4. Kanban Drag-Drop
```bash
# Go to: http://localhost:3000/team/demo-team-1/issues/board
# Drag issue to different column
# Should see: Moves instantly
# Network tab: PATCH /api/v1/issues/:id
```

---

## New API Files

```
apps/web/lib/api/
├── client.ts        - Base API client
├── auth.ts          - Login/register
├── issues.ts        - Issue CRUD
├── workspaces.ts    - Workspace/team endpoints
└── index.ts         - Exports
```

**Import in components:**
```typescript
import { issueApi, authApi, workspaceApi } from '@/lib/api';

// Use it:
await issueApi.create(teamId, { title: "New Issue" });
await issueApi.update(issueId, { title: "Updated" });
await issueApi.list(teamId);
```

---

## Pages Updated

1. **`/team/[teamId]/issues`** - Fetches issues, create modal
2. **`/team/[teamId]/issue/[issueId]`** - Fetches + edits issue
3. **`/team/[teamId]/issues/board`** - Drag-drop persists
4. **`/issues/me`** - Create modal wired up

---

## How It Works

### Optimistic Updates
```typescript
// 1. Update UI immediately (instant feedback)
updateIssue(id, { title: "New Title" });

// 2. Send to backend (background)
try {
  await issueApi.update(id, { title: "New Title" });
  // Success: Already updated ✅
} catch (error) {
  // Error: Rollback to original ⚠️
  updateIssue(id, { title: originalTitle });
}
```

### API Calls
```typescript
// All API calls use JWT token from localStorage
const token = localStorage.getItem('authToken');

fetch('/api/v1/issues', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

---

## Troubleshooting

### Issue: "Cannot fetch issues"
**Fix:** Make sure backend is running on port 3001

### Issue: "401 Unauthorized"
**Fix:** Login again at /api-test to get fresh token

### Issue: "Issues don't persist"
**Fix:** Check backend logs, verify database is running

### Issue: "Optimistic updates don't rollback"
**Fix:** Check console for errors, backend might be down

---

## What's NOT Done Yet

⚠️ Comments (API ready, UI pending)
⚠️ Delete/Archive buttons (API ready, UI pending)
⚠️ Inbox action buttons (see ROUTE_FIXES.md)
❌ Projects API integration
❌ Cycles API integration
❌ WebSocket real-time updates

---

## Full Documentation

- **Complete Guide:** `BACKEND_INTEGRATION_COMPLETE.md`
- **Testing Guide:** `BACKEND_TESTING.md`
- **Status:** `INTEGRATION_STATUS.md`
- **Route Fixes:** `ROUTE_FIXES.md`

---

## That's It!

Your Linear clone now has a fully functional backend! 🎉

All issue operations (list, create, edit, drag-drop) persist to PostgreSQL via the Hono.js API.
