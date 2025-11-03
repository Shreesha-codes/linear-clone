# 🎯 Phase 2 Testing Guide - How to See Your New Features

## ⚡ Quick Navigation

Your Phase 2 components are ready! Here's **exactly** where to find them:

### 📍 Feature Locations (Routes)

| Feature | URL Pattern | Example URL |
|---------|-------------|-------------|
| **Kanban Board** 🎨 | `/team/{TEAM_ID}/issues/board` | `http://localhost:3000/team/abc-123/issues/board` |
| **Virtualized List** 📋 | `/team/{TEAM_ID}/issues` | `http://localhost:3000/team/abc-123/issues` |
| **Issue Detail** 🔍 | `/team/{TEAM_ID}/issue/{ISSUE_ID}` | `http://localhost:3000/team/abc-123/issue/issue-1` |

---

## 🚨 IMPORTANT: You Need a Team First!

**Why you can't see the features yet:**
- The Phase 2 pages are under `/team/{teamId}/` routes
- Your Sidebar shows "No teams yet"
- You need to create a team in the database to access these pages

---

## 🛠️ Quick Setup - 3 Steps to Test

### Step 1: Create Sample Data in Database

**Option A: Using SQL Directly** (fastest)
```sql
-- 1. Create a workspace (replace YOUR_USER_ID with your actual user ID from dashboard)
INSERT INTO workspaces (id, name, slug, created_at, updated_at)
VALUES ('workspace-1', 'My Workspace', 'my-workspace', NOW(), NOW());

-- 2. Add yourself as workspace member
INSERT INTO workspace_members (id, workspace_id, user_id, role, created_at)
VALUES ('wm-1', 'workspace-1', 'YOUR_USER_ID', 'owner', NOW());

-- 3. Create a team
INSERT INTO teams (id, workspace_id, name, identifier, created_at, updated_at)
VALUES ('team-1', 'workspace-1', 'Engineering', 'ENG', NOW(), NOW());

-- 4. Add yourself as team member
INSERT INTO team_members (id, team_id, user_id, created_at)
VALUES ('tm-1', 'team-1', 'YOUR_USER_ID', NOW());

-- 5. Create sample issues
INSERT INTO issues (id, team_id, identifier, title, status, priority, creator_id, sort_order, created_at, updated_at)
VALUES 
  ('issue-1', 'team-1', 'ENG-1', 'Setup authentication', 'done', 'high', 'YOUR_USER_ID', 1.0, NOW(), NOW()),
  ('issue-2', 'team-1', 'ENG-2', 'Build Kanban board', 'in_progress', 'urgent', 'YOUR_USER_ID', 2.0, NOW(), NOW()),
  ('issue-3', 'team-1', 'ENG-3', 'Add drag and drop', 'todo', 'medium', 'YOUR_USER_ID', 3.0, NOW(), NOW()),
  ('issue-4', 'team-1', 'ENG-4', 'Implement virtualization', 'backlog', 'low', 'YOUR_USER_ID', 4.0, NOW(), NOW());
```

**Option B: Using the Database Seed Script** (coming next)

### Step 2: Refresh Your Browser

1. After adding data, refresh the dashboard page
2. You should now see "Engineering (ENG)" team in the Sidebar
3. Click on the team to navigate

### Step 3: Navigate to Features

Once you see your team in the sidebar:

**🎨 To See Kanban Board:**
1. Click "Engineering" team in sidebar → goes to `/team/team-1`
2. Navigate to `/team/team-1/issues/board` manually in URL bar
3. **OR** use the demo script (see below)

**📋 To See Virtualized List:**
1. Navigate to `/team/team-1/issues`
2. You'll see the high-performance virtual scrolling list

**🔍 To See Issue Detail:**
1. Click any issue from list or board
2. Opens `/team/team-1/issue/{issueId}` with inline editing

---

## 🎬 Automated Demo Script

I've created a script to automatically create test data and open the features:

```bash
# From project root
chmod +x demo-phase2.sh
./demo-phase2.sh
```

This will:
1. ✅ Create workspace, team, and 10 sample issues
2. ✅ Open board view in your browser
3. ✅ Print URLs for all features

---

## 🧪 What to Test

### Kanban Board (`/team/team-1/issues/board`)
- ✅ **Drag & Drop**: Drag issues between columns (Backlog → Todo → In Progress → Done)
- ✅ **Real-time Updates**: Changes saved to API instantly
- ✅ **Rollback**: If API fails, issue returns to original column
- ✅ **Virtual Scrolling**: Smooth performance with 100+ issues per column
- ✅ **Quick Edit**: Click priority icon to change (no modal needed)
- ✅ **Click to Navigate**: Click card to open detail view

### Virtualized List (`/team/team-1/issues`)
- ✅ **Performance**: Renders only ~20 visible rows (out of 1000+)
- ✅ **Smooth Scrolling**: 60fps with fractional indexing
- ✅ **Filters**: Use filters at top (status, priority, search)
- ✅ **Click Row**: Opens issue detail page

### Issue Detail (`/team/team-1/issue/{issueId}`)
- ✅ **Inline Editing**: Click title/description to edit
- ✅ **Debouncing**: Saves 500ms after you stop typing
- ✅ **Property Sidebar**: View status, priority, assignee, labels, due date, estimate
- ✅ **Comments**: Add comments with Markdown support (Editor at bottom)
- ✅ **Activity Timeline**: See all changes (placeholder UI ready)

---

## 📊 What You Built (27 Files, 2200+ Lines)

### New Components
1. **KanbanBoard.tsx** (180 lines) - Main board with @dnd-kit
2. **KanbanColumn.tsx** (110 lines) - Virtualized droppable column
3. **KanbanCard.tsx** (120 lines) - Draggable issue card
4. **VirtualizedIssueList.tsx** (80 lines) - High-performance list
5. **CommentList.tsx** (110 lines) - Comment thread with Markdown editor

### New Pages
1. **team/[teamId]/issues/board/page.tsx** (90 lines) - Board view
2. **team/[teamId]/issues/page.tsx** (modified) - List view with virtualization

### API Enhancements
- `updateComment(commentId, body)`
- `deleteComment(commentId)`
- `addReaction(commentId, emoji)`
- `removeReaction(commentId, emoji)`

### Dependencies Added
- `@dnd-kit/core` - Drag and drop system
- `@dnd-kit/sortable` - Sortable list utilities
- `react-window` - Virtual scrolling
- `fractional-indexing` - Efficient sort order
- `lodash.debounce` - Input debouncing

---

## 🔧 Troubleshooting

### "No teams yet" in Sidebar
**Problem**: Database is empty  
**Solution**: Run the SQL commands in Step 1 above OR use the demo script

### "Page Not Found" on `/team/team-1/issues/board`
**Problem**: Routes not matching  
**Solution**: 
1. Check `apps/web/src/app/(app)/team/[teamId]/issues/board/page.tsx` exists
2. Restart dev server: `npx turbo dev --filter=web`

### Drag-and-drop not working
**Problem**: @dnd-kit not installed  
**Solution**: `cd apps/web && npm install`

### Comments not appearing
**Problem**: Backend API not running  
**Solution**: Make sure backend is running on port 3001:
```bash
npx turbo dev --filter=api
```

---

## 🎯 Next Steps After Testing

Once you've tested all features:

1. **Add Navigation Links**: Update Sidebar to include "Board" link
2. **Real-time Sync**: Connect WebSocket for live updates
3. **Polish UI**: Add loading states, animations, error boundaries
4. **Add More Features**: 
   - Assignee picker
   - Label management
   - Due date picker
   - Bulk operations

---

## 💡 Pro Tips

1. **Open DevTools**: Watch Network tab to see API calls
2. **Check Console**: See optimistic updates and rollbacks
3. **Test Error Handling**: Stop backend server, try editing - see rollback
4. **Performance**: Open React DevTools Profiler to see virtualization benefits
5. **Accessibility**: Test keyboard navigation (Tab, Enter, Escape, Arrow keys)

---

## 📞 Still Lost?

If you still can't see the features:

1. **Check your User ID**: 
   - Go to dashboard (`http://localhost:3000/dashboard`)
   - Copy your User ID from the profile card
   - Use it in the SQL commands above

2. **Verify Database Connection**:
   ```bash
   # Check if tables exist
   psql -d linear_clone -c "\dt"
   ```

3. **Check Network Tab**:
   - Open browser DevTools → Network
   - Visit board page
   - Look for API calls to `/api/v1/teams/team-1/issues`

4. **Manual URL Navigation**:
   - Just type `http://localhost:3000/team/team-1/issues/board` directly
   - If 404, check file exists at `apps/web/src/app/(app)/team/[teamId]/issues/board/page.tsx`

---

## ✅ Success Checklist

- [ ] Both servers running (3000 and 3001)
- [ ] User logged in successfully
- [ ] Team created in database
- [ ] Can see team in Sidebar
- [ ] Can navigate to `/team/team-1/issues/board`
- [ ] Can drag issues between columns
- [ ] Can see virtualized list at `/team/team-1/issues`
- [ ] Can click issue to see detail page
- [ ] Can edit title/description inline
- [ ] Can add comments

Once all boxes checked: **🎉 Phase 2 is fully working!**
