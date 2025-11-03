# 🧪 Backend Integration Testing Checklist

## Prerequisites

- [ ] Backend server running on `http://localhost:3001`
- [ ] Frontend server running on `http://localhost:3000`
- [ ] PostgreSQL database running
- [ ] Database migrations applied

## Quick Start Commands

```bash
# Terminal 1: Start Backend
cd apps/api
npm run dev

# Terminal 2: Start Frontend
cd apps/web
npm run dev

# Terminal 3: Check backend health
curl http://localhost:3001/health
```

---

## Test 1: Authentication Flow

### Register New User
1. Go to `http://localhost:3000/api-test`
2. Fill in registration form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. Click "Register"
4. **Expected:** Success message with user data and token
5. **Check:** localStorage has `authToken`

### Login
1. Use same credentials to login
2. Click "Login"
3. **Expected:** Success with same token
4. **Check:** Token saved in localStorage

### Get Current User
1. Click "Get Current User" button
2. **Expected:** Returns user data (protected endpoint)
3. **Network Tab:** Should see `Authorization: Bearer <token>` header

**✅ Pass Criteria:**
- Registration returns 201 status
- Login returns 200 status
- Token persists in localStorage
- Protected endpoint works with token

---

## Test 2: Issue List Loading

### Team Issues Page
1. Go to `http://localhost:3000/team/demo-team-1/issues`
2. **Expected:** Page loads without errors
3. **Network Tab:** 
   - Request: `GET /api/v1/teams/demo-team-1/issues`
   - Response: `{ data: [] }` (empty if no issues)
4. **Console:** Should see logs like:
   ```
   [API] Fetching issues for team: demo-team-1
   ```

**✅ Pass Criteria:**
- No console errors
- Network request succeeds
- Issues array loads into Zustand store
- Empty state shows "No issues found"

---

## Test 3: Create Issue

### From Team Page
1. Go to `http://localhost:3000/team/demo-team-1/issues`
2. Click "New Issue" button
3. **Expected:** Modal opens with form
4. Fill in form:
   - Title: "Test Issue from Frontend"
   - Description: "Testing backend integration"
   - Status: "Todo"
   - Priority: "High"
5. Click "Create Issue" (or press ⌘Enter)
6. **Expected:** 
   - Modal closes
   - New issue appears in list instantly
   - No page refresh

**Network Tab:**
```
POST /api/v1/teams/demo-team-1/issues
Request Body:
{
  "title": "Test Issue from Frontend",
  "description": "Testing backend integration",
  "status": "todo",
  "priority": "high"
}

Response:
{
  "data": {
    "id": "uuid-here",
    "identifier": "TEAM-1",
    "title": "Test Issue from Frontend",
    ...
  }
}
```

### From My Issues Page
1. Go to `http://localhost:3000/issues/me`
2. Click "New Issue" button
3. Fill form and submit
4. **Expected:** Same behavior as team page

**✅ Pass Criteria:**
- Form validates (title required)
- POST request succeeds (201 status)
- Issue appears in list immediately
- Identifier is auto-generated (e.g., TEAM-1)
- createdAt/updatedAt timestamps set

---

## Test 4: Issue Detail & Editing

### Navigate to Issue
1. Go to `http://localhost:3000/team/demo-team-1/issues`
2. Click on an issue row
3. **Expected:** Navigates to `/team/demo-team-1/issue/[issueId]`

### If Issue Not in Store (Cold Load)
1. Open issue detail URL directly
2. **Expected:** 
   - Loading state briefly
   - Issue fetches from API
   - Page renders with data

**Network Tab:**
```
GET /api/v1/issues/[issueId]
Response: { data: { id: "...", title: "...", ... } }
```

### Edit Title
1. Click on issue title
2. **Expected:** Input field appears
3. Type new title: "Updated Test Issue"
4. Press Enter
5. **Expected:**
   - Title updates instantly (optimistic)
   - Input closes
   - No loading spinner

**Network Tab:**
```
PATCH /api/v1/issues/[issueId]
Request: { "title": "Updated Test Issue" }
Response: { data: { ...updated issue } }
```

### Edit Description
1. Click in description textarea
2. Type: "Updated description via frontend"
3. Click outside (blur)
4. **Expected:**
   - Description saves automatically
   - No visual feedback (silent save)

**Network Tab:**
```
PATCH /api/v1/issues/[issueId]
Request: { "description": "Updated description via frontend" }
```

### Test Rollback on Error
1. Stop backend server
2. Edit title
3. **Expected:**
   - Title updates in UI (optimistic)
   - Network request fails
   - Title reverts to original
   - Console error: "Failed to update issue title"

**✅ Pass Criteria:**
- Issue loads from API if not in store
- Title edits persist (PATCH request)
- Description edits persist
- Optimistic updates work
- Rollback works on API errors

---

## Test 5: Kanban Board Drag-Drop

### Navigate to Board
1. Go to `http://localhost:3000/team/demo-team-1/issues/board`
2. **Expected:** Kanban board with 5 columns
3. Issues load from API (same as list view)

### Drag Issue to New Status
1. Drag an issue from "Todo" to "In Progress"
2. **Expected:**
   - Issue moves instantly (optimistic)
   - Smooth animation with @dnd-kit

**Network Tab:**
```
PATCH /api/v1/issues/[issueId]
Request: 
{
  "status": "in_progress",
  "sortOrder": 0.5  // Fractional indexing
}
```

### Reorder Within Same Column
1. Drag issue up/down within same status column
2. **Expected:**
   - Position changes instantly
   - sortOrder updates with fractional indexing

**Network Tab:**
```
PATCH /api/v1/issues/[issueId]
Request: 
{
  "status": "todo",  // Same status
  "sortOrder": 0.25  // New position
}
```

### Test Error Handling
1. Stop backend
2. Drag issue to new column
3. **Expected:**
   - Issue moves in UI (optimistic)
   - Network fails
   - Issue snaps back to original position
   - Console error: "Failed to update issue position"

**✅ Pass Criteria:**
- Drag-drop works smoothly
- Status updates persist to backend
- sortOrder uses fractional indexing
- Optimistic updates + rollback work
- No duplicate network requests

---

## Test 6: Filters & Search

### Apply Filters
1. Go to `http://localhost:3000/team/demo-team-1/issues`
2. Use IssueFilters component
3. Select status: "Todo"
4. **Expected:** Only todo issues show
5. **Note:** Filtering is client-side (Zustand store)

### Search Issues
1. Type in search box: "Test"
2. **Expected:** Only issues with "Test" in title/identifier show
3. **Note:** Search is client-side (no API call)

**Future Enhancement:**
- Server-side filtering with query params:
  ```
  GET /api/v1/teams/demo-team-1/issues?status=todo&search=Test
  ```

**✅ Pass Criteria:**
- Filters work on client side
- Search works on title and identifier
- Clear filters button works

---

## Test 7: My Issues Page

### View Personal Issues
1. Go to `http://localhost:3000/issues/me`
2. **Expected:** Shows all issues (no backend filter yet)
3. Mock data or real issues from store

### Create Issue
1. Click "New Issue"
2. Form opens with first team selected
3. Submit
4. **Expected:** Issue created with API call

**Note:** Currently uses first team from store. In production, would need user's default team or team selector in modal.

**✅ Pass Criteria:**
- Page renders
- Create button works
- Form submission creates issue via API

---

## Test 8: Error Scenarios

### Network Errors
**Test:** Stop backend during operation

**Expected Behavior:**
- API calls fail gracefully
- Optimistic updates rollback
- Console errors logged
- User sees original state
- No crashes or blank screens

### 401 Unauthorized
**Test:** Clear localStorage token, try protected action

**Expected:**
- API returns 401
- User redirected to login (if auth middleware active)
- Token cleared from localStorage

### 404 Not Found
**Test:** Navigate to non-existent issue

**Expected:**
- "Issue not found" message
- "Back to Issues" button
- No console errors

### Validation Errors
**Test:** Submit empty issue title

**Expected:**
- Form validation catches (Zod)
- Error message: "Title is required"
- No API call made
- Modal stays open

**✅ Pass Criteria:**
- Graceful error handling
- No app crashes
- Clear error messages
- Rollback on failures

---

## Test 9: Performance

### Large Issue List
**Test:** Create 100+ issues (via API or seed script)

**Expected:**
- Virtualized list renders smoothly
- No lag when scrolling
- Only visible rows rendered
- react-window handles virtualization

### Rapid Actions
**Test:** Create/update/delete issues quickly

**Expected:**
- Optimistic updates feel instant
- No race conditions
- All API calls complete
- Final state matches backend

**✅ Pass Criteria:**
- Smooth scrolling with 100+ issues
- No memory leaks
- Optimistic updates snappy

---

## Test 10: Developer Experience

### Browser DevTools

**Console:**
- Clear, helpful logs
- No red errors (unless expected)
- API calls logged with endpoints

**Network Tab:**
- All requests to `/api/v1/*`
- Authorization headers present
- JSON request/response bodies
- Correct HTTP methods (GET/POST/PATCH/DELETE)
- Status codes: 200/201/204/401/404/500

**Application Tab:**
- localStorage has `authToken`
- Token is JWT format (3 parts separated by dots)

**React DevTools:**
- Zustand store state visible
- Issues array populated
- Filters state updates

**✅ Pass Criteria:**
- Clean console logs
- Network requests well-formed
- localStorage persists token
- React state updates correctly

---

## Common Issues & Solutions

### Issue: "Cannot read property 'addIssue' of undefined"
**Cause:** Zustand store not initialized
**Fix:** Check store exports and imports

### Issue: "401 Unauthorized" on every request
**Cause:** Token not in localStorage or expired
**Fix:** Re-login via /api-test

### Issue: Issues don't persist after refresh
**Cause:** Not fetching from API on mount
**Fix:** Check useEffect with issueApi.list()

### Issue: Optimistic updates don't rollback
**Cause:** Missing try/catch in API calls
**Fix:** Wrap API calls with error handling

### Issue: Duplicate issues in list
**Cause:** addIssue called multiple times
**Fix:** Check useEffect dependencies, add loading state

---

## Final Checklist

- [ ] All 10 tests pass
- [ ] No console errors
- [ ] Network requests succeed
- [ ] Optimistic updates work
- [ ] Rollback on errors works
- [ ] Token authentication works
- [ ] Forms validate correctly
- [ ] Drag-drop persists
- [ ] Issue editing persists
- [ ] Performance is smooth

**If all checked:** ✅ Backend integration is working correctly!

---

## Next Steps After Testing

1. **Fix any bugs found** during testing
2. **Add error toasts** for better UX (Phase 4.20)
3. **Connect comments** to API (Phase 4.11)
4. **Wire up inbox buttons** (mark as read, archive)
5. **Add WebSocket** for real-time updates (Phase 5)
6. **Implement projects/cycles** API integration

---

## Support

If tests fail, check:
1. Backend logs in terminal
2. Frontend console errors
3. Network tab for failed requests
4. Database connection
5. CORS configuration
6. Environment variables

**Common Fix:** Restart both servers and clear localStorage
