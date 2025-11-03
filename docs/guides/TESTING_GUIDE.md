# Testing Guide - Phase 4.5 & 4.6

## 🔍 How to Verify Everything is Working

### ✅ Pre-Test Checklist

1. **Start the development server**:
   ```bash
   cd apps/web
   npm run dev
   ```
   - Server should run on **http://localhost:3000**
   - Check terminal for "Ready in X.Xs" message

2. **Backend API (Optional but recommended)**:
   ```bash
   cd apps/api
   npm run dev
   ```
   - API runs on **http://localhost:3001**
   - Required for future API integration

### 📋 Step-by-Step Testing

#### 1. Authentication Flow ✅
1. Visit **http://localhost:3000**
2. Click "**Login**" in header
3. If you don't have an account:
   - Click "**Don't have an account? Sign up**"
   - Fill in: Name, Email, Password
   - Watch **real-time password validation** (checklist should appear)
   - Click "**Create account**"
4. Login with your credentials
5. You should be redirected to **`/issues/me`**

**Expected Result**: You see the main app with sidebar and top navigation.

#### 2. Sidebar Navigation ✅

**Visual Check**:
- ✅ Sidebar should be visible on the left (256px wide)
- ✅ Header shows "**Linear Clone**" with collapse button
- ✅ Workspace dropdown shows "**Acme Corp**" (mock data)
- ✅ Team dropdown shows "**Engineering**" (mock data)
- ✅ Navigation items visible:
  - My Issues (with gray count badge "0")
  - Inbox (with gray count badge "0")
- ✅ Team section header: "**ENGINEERING**"
- ✅ Team Issues link
- ✅ Projects section (expandable)
- ✅ Cycles section (expandable)
- ✅ Settings link at bottom

**Interaction Tests**:
1. **Click "My Issues"**
   - URL changes to `/issues/me`
   - Link highlights with accent color
   
2. **Click "Inbox"**
   - URL changes to `/inbox`
   - Link highlights with accent color

3. **Click collapse button (X icon)**
   - Sidebar shrinks to icon-only mode (64px wide)
   - Only icons visible
   
4. **Click expand button (Menu icon)**
   - Sidebar expands back to full width

5. **Click Projects section**
   - Section collapses/expands
   - ChevronDown/ChevronRight icon rotates

6. **Click Cycles section**
   - Section collapses/expands

7. **Click workspace dropdown**
   - Shows 2 workspaces:
     - 🏢 Acme Corp
     - 👤 Personal Projects
   - Shows "+ Create workspace" option
   - Select "Personal Projects"
   - Team dropdown updates to show "Side Projects"

8. **Click team dropdown**
   - Shows teams for active workspace
   - Shows "+ Create team" option

**Expected Result**: All navigation works smoothly with proper highlighting and transitions.

#### 3. Top Navigation ✅

**Visual Check**:
- ✅ Top bar (56px height) with white/dark background
- ✅ Breadcrumbs on left showing: "Acme Corp > Engineering > Issues" (or similar)
- ✅ Search button with ⌘K indicator
- ✅ Create issue button (+ icon)
- ✅ Notifications bell with red badge
- ✅ User avatar on right

**Interaction Tests**:
1. **Navigate between pages**
   - Breadcrumbs should update automatically
   - "My Issues" → Shows "Acme Corp > My Issues"
   - "Inbox" → Shows "Acme Corp > Inbox"

2. **Click search button**
   - Command palette should open

3. **Click user avatar**
   - Dropdown menu appears with:
     - User name and email
     - Profile link
     - Settings link
     - Sign out (in red)

4. **Click "Sign out"**
   - Logs out
   - Redirects to `/login`

**Expected Result**: Top nav is responsive and all dropdowns work.

#### 4. Command Palette (⌘K) ✅

**Opening Methods**:
1. Press **⌘K** (Mac) or **Ctrl+K** (Windows/Linux)
2. Click search button in top nav
3. Press **/** key

**Expected Result**: Dialog opens with search input focused.

**Visual Check**:
- ✅ Large dialog (centered on screen)
- ✅ Search input at top with magnifying glass icon
- ✅ Commands grouped by category:
  - **Actions** (Create new issue, project, cycle)
  - **Navigation** (Go to My Issues, Inbox, Settings, etc.)
  - **Search** (Search issues, projects)
- ✅ Shortcuts displayed on right (e.g., "G → I")
- ✅ Recent items section at bottom (shows "No recent items")

**Interaction Tests**:
1. **Fuzzy search**
   - Type "**issue**"
   - Should filter to: "Create new issue", "Go to My Issues", "Search issues"
   
2. **Keyboard navigation**
   - Press **↓** (down arrow) → Highlights next item
   - Press **↑** (up arrow) → Highlights previous item
   - Press **Enter** → Executes selected command

3. **Command execution**
   - Select "Go to My Issues" → Closes palette, navigates to `/issues/me`
   - Select "Go to Inbox" → Navigates to `/inbox`
   - Select "Go to Settings" → Navigates to `/settings`

4. **Close palette**
   - Press **Escape**
   - Click outside dialog
   - Both should close the palette

**Expected Result**: Command palette is fully functional with fuzzy search.

#### 5. Keyboard Shortcuts ✅

**Global Shortcuts** (work from anywhere):

| Shortcut | Action | Test |
|----------|--------|------|
| **⌘K / Ctrl+K** | Open command palette | Press and verify palette opens |
| **/** | Open command palette | Press and verify palette opens |
| **Escape** | Close modals | Open palette, press Esc, verify it closes |
| **?** | Show shortcuts help | Press Shift+/ (shows console log for now) |

**Sequence Shortcuts** (press keys in order, 1-second timeout):

| Sequence | Action | Test |
|----------|--------|------|
| **G** then **I** | Go to My Issues | Press G, then I within 1 second |
| **G** then **P** | Go to Projects | Press G, then P within 1 second |
| **G** then **C** | Go to Cycles | Press G, then C within 1 second |

**Expected Behavior**:
- ✅ Shortcuts work from any page
- ✅ Shortcuts are **ignored** when typing in input fields
- ✅ ⌘K and Escape work even inside input fields
- ✅ Sequence timeout works (wait > 1 second, sequence resets)

**Test Scenarios**:
1. **From issues page**: Press **G** then **P**
   - Should navigate to projects

2. **From command palette input**: Type something, press **Escape**
   - Palette should close

3. **From search input**: Type "test", press **G**
   - Should type "g" in input (not trigger shortcut)

**Expected Result**: All shortcuts work as documented.

#### 6. Page Content ✅

**My Issues Page** (`/issues/me`):
- ✅ Shows placeholder: "Issue list view will be implemented here."
- ✅ Gray card with centered text
- ✅ Proper spacing and layout

**Inbox Page** (`/inbox`):
- ✅ Shows placeholder: "Inbox view will be implemented here."
- ✅ Gray card with centered text

**Settings Page** (`/settings`) - Not yet created:
- Will show 404 or blank page (expected)

**Expected Result**: Placeholder pages render correctly.

### 🐛 Common Issues & Solutions

#### Issue: "Blank screen after login"
**Cause**: Authentication not working or stores not initialized
**Solution**:
1. Check browser console for errors
2. Verify you're logged in (check localStorage for auth token)
3. Hard refresh (⌘+Shift+R or Ctrl+Shift+R)

#### Issue: "Sidebar not showing"
**Cause**: CSS not loading or layout issue
**Solution**:
1. Check browser console for CSS errors
2. Inspect element → Check if sidebar has `display: none`
3. Try clearing `.next` folder: `rm -rf apps/web/.next`

#### Issue: "Workspace/Team dropdowns are empty"
**Cause**: Mock data not loaded
**Solution**:
1. Check browser console for errors in `useMockData` hook
2. Verify stores are initialized (use React DevTools)
3. Hard refresh the page

#### Issue: "Command palette doesn't open"
**Cause**: Keyboard shortcut not registered or UI store issue
**Solution**:
1. Check browser console for errors
2. Try clicking search button instead of ⌘K
3. Verify `useKeyboardShortcuts` hook is running (add console.log)

#### Issue: "Navigation links don't work"
**Cause**: Next.js routing issue
**Solution**:
1. Check URL changes in browser address bar
2. Verify `Link` components have proper `href`
3. Check browser console for Next.js routing errors

### ✅ Success Criteria

Your implementation is working correctly if:

1. ✅ **Authentication**:
   - Can register new account
   - Can login with credentials
   - Redirects to `/issues/me` after login
   - Can logout and redirects to `/login`

2. ✅ **Sidebar**:
   - Visible on all pages
   - Workspace switcher shows 2 workspaces
   - Team switcher shows teams filtered by workspace
   - Navigation links highlight active page
   - Collapse/expand works
   - Projects/Cycles sections expand/collapse

3. ✅ **Top Navigation**:
   - Breadcrumbs update on page change
   - User menu shows name, email, and actions
   - Logout works

4. ✅ **Command Palette**:
   - Opens with ⌘K / Ctrl+K / /
   - Fuzzy search filters commands
   - Keyboard navigation works (↑/↓/Enter)
   - Commands execute correctly
   - Closes with Escape

5. ✅ **Keyboard Shortcuts**:
   - ⌘K opens palette
   - G→I navigates to issues
   - Shortcuts ignored in input fields
   - Escape closes modals

6. ✅ **Visual Design**:
   - Proper spacing and layout
   - Dark mode compatible (if theme switcher implemented)
   - Smooth transitions
   - Active states on hover/click

### 📊 Browser Console Checks

Open browser DevTools (F12) → Console tab:

**Expected Messages**:
- No errors (red text)
- May see console.logs from keyboard shortcuts
- May see "Create new workspace" / "Create new team" when clicking those options

**React DevTools** (if installed):
- Check Components tab → Find `Sidebar`, `TopNav`, `CommandPalette`
- Verify hooks are initialized
- Check store values:
  - `useWorkspaceStore` → workspaces: [2 items]
  - `useTeamStore` → teams: [3 items]
  - `useUIStore` → commandPaletteOpen: false

### 🎯 Next Steps After Verification

Once everything is working:

1. **Take screenshots** of:
   - Main app with sidebar + topnav
   - Command palette open
   - Workspace/Team switchers
   - Collapsed sidebar

2. **Test on different browsers**:
   - Chrome/Chromium
   - Firefox
   - Safari
   - Edge

3. **Test responsive design**:
   - Resize browser window
   - Check mobile view (sidebar should be improved for mobile)

4. **Ready for Phase 4.7**: Issue Management
   - Issue list view
   - Issue board (Kanban)
   - Issue detail page

---

## 🔧 Developer Tools

### React DevTools
Install: https://react.devtools.org/

**What to check**:
- Component tree: Sidebar, TopNav, CommandPalette rendered
- Hooks: useKeyboardShortcuts, useMockData, useAuthStore
- State: Verify store values

### Redux DevTools (for Zustand)
Install: https://github.com/reduxjs/redux-devtools

**What to check**:
- WorkspaceStore: workspaces array, activeWorkspaceId
- TeamStore: teams array, activeTeamId
- UIStore: sidebarCollapsed, commandPaletteOpen
- AuthStore: user object

### Browser Network Tab
**What to check**:
- No failed requests (500 errors)
- API calls to `/api/v1/*` when backend is running
- WebSocket connection (future)

---

## 📝 Summary

You've built a complete main app navigation system with:
- ✅ Sidebar with workspace/team management
- ✅ Top navigation with breadcrumbs and user menu
- ✅ Command palette with fuzzy search
- ✅ Global keyboard shortcuts
- ✅ Mock data for testing
- ✅ Proper authentication guards

**Everything should be visible and working!** If you still see issues, check the common problems section above.
