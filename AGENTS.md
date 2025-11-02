# Linear.app Clone - MVP Build Instructions for GitHub Copilot

## Project Overview

Build a high-fidelity fullstack clone of Linear.app focusing on core project management functionality with real-time collaboration, issue tracking, and team management.

## Technology Stack Requirements

### Core Technologies

- **Package Manager**: NPM
- **Runtime**: Node.js
- **Build System**: Turborepo (monorepo structure)
- **Backend Framework**: Hono.js
- **Frontend Framework**: Next.js (App Router)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **Code Quality**: Biome.js (linting & formatting)
- **Testing**: Vitest

### Additional Libraries to Consider

- **Real-time**: WebSockets (ws) or Server-Sent Events
- **State Management**: Zustand or React Context
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Drag & Drop**: @dnd-kit/core
- **Markdown**: react-markdown or similar
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **File Upload**: uploadthing or similar

## Project Structure

```
linear-clone/
├── apps/
│   ├── web/                 # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/        # App router pages
│   │   │   ├── components/ # React components
│   │   │   ├── hooks/      # Custom React hooks
│   │   │   ├── lib/        # Utilities and helpers
│   │   │   ├── stores/     # State management
│   │   │   └── types/      # TypeScript types
│   │   ├── public/
│   │   └── package.json
│   │
│   └── api/                 # Hono.js backend application
│       ├── src/
│       │   ├── routes/     # API routes
│       │   ├── middleware/ # Authentication, CORS, etc.
│       │   ├── services/   # Business logic
│       │   ├── db/         # Database schema and migrations
│       │   ├── websocket/  # Real-time handlers
│       │   └── types/      # TypeScript types
│       └── package.json
│
├── packages/
│   ├── database/           # Shared Drizzle ORM schema
│   │   ├── schema/
│   │   ├── migrations/
│   │   └── package.json
│   │
│   ├── types/              # Shared TypeScript types
│   │   └── package.json
│   │
│   ├── ui/                 # Shared UI components
│   │   └── package.json
│   │
│   └── typescript-config/  # Shared TypeScript configs
│       └── package.json
│
├── turbo.json
├── package.json
├── biome.json
└── README.md
```

## Phase 1: Project Initialization & Setup

### Step 1.1: Remove Unnecessary Template Files

```bash
# Remove docs app (not needed for Linear clone)
Remove-Item -Recurse -Force apps/docs

# Remove ESLint config package (replaced by Biome.js)
Remove-Item -Recurse -Force packages/eslint-config

# Update root package.json workspaces (done automatically by npm)
```

### Step 1.2: Setup Biome.js

Install Biome.js and create configuration:

```bash
npm install --save-dev --workspace-root @biomejs/biome
```

Create `biome.json` in the root with configuration for:

- TypeScript/JavaScript linting
- Formatting rules (2 spaces, semicolons, single quotes)
- Import sorting
- Ignore patterns for build directories (`.next`, `node_modules`, `dist`)

Example configuration:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "always"
    }
  }
}
```

Update root `package.json` scripts:

```json
{
  "scripts": {
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write ."
  }
}
```

### Step 1.3: Setup Vitest for Testing

Install Vitest in root and configure for all packages:

```bash
npm install --save-dev --workspace-root vitest @vitest/ui
```

Create `vitest.config.ts` in root for shared test configuration.

Add test scripts to root `package.json`:

```json
{
  "scripts": {
    "test": "turbo run test",
    "test:watch": "turbo run test:watch",
    "test:coverage": "turbo run test:coverage"
  }
}
```

Update `turbo.json` to include test tasks:

```json
{
  "tasks": {
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "test:watch": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### Step 1.3: Setup Vitest for Testing

Install Vitest in root and configure for all packages:

```bash
npm install --save-dev --workspace-root vitest @vitest/ui
```

Create `vitest.config.ts` in root for shared test configuration.

Add test scripts to root `package.json`:

```json
{
  "scripts": {
    "test": "turbo run test",
    "test:watch": "turbo run test:watch",
    "test:coverage": "turbo run test:coverage"
  }
}
```

Update `turbo.json` to include test tasks:

```json
{
  "tasks": {
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "test:watch": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### Step 1.4: Setup Frontend App (Next.js)

In `apps/web`:

- Initialize Next.js 14+ with App Router
- Install dependencies: Tailwind CSS, Radix UI, Lucide React, Zustand, React Hook Form, Zod
- Configure `tailwind.config.js` with Linear-inspired design tokens
- Setup `next.config.js` for image optimization and environment variables

### Step 1.4: Setup Frontend App (Next.js)

In `apps/web`:

- Install dependencies: Tailwind CSS, Radix UI, Lucide React, Zustand, React Hook Form, Zod
- Configure `tailwind.config.js` with Linear-inspired design tokens
- Setup `next.config.js` for image optimization and environment variables
- Configure Vitest for frontend testing

### Step 1.5: Setup Backend App (Hono.js)

In `apps/api`:

- Initialize Hono.js project
- Install dependencies: Hono, ws (WebSockets), cors, dotenv
- Setup development server with hot reload
- Configure environment variables

### Step 1.5: Setup Backend App (Hono.js)

Create `apps/api`:

- Initialize Hono.js project with clean architecture structure
- Install dependencies: Hono, ws (WebSockets), cors, dotenv
- Setup development server with hot reload
- Configure environment variables
- Configure Vitest for backend testing
- Setup test utilities and mocks

### Step 1.6: Setup Database Package

In `packages/database`:

- Install Drizzle ORM and PostgreSQL driver (pg)
- Setup Drizzle config file
- Create initial database connection utility

### Step 1.6: Setup Database Package

Create `packages/database`:

- Install Drizzle ORM and PostgreSQL driver (pg)
- Setup Drizzle config file
- Create initial database connection utility
- Configure test database for integration tests

### Step 1.7: Configure Turborepo

Update `turbo.json` with:

- Build pipeline for all apps/packages
- Dev pipeline with proper dependencies
- Test pipeline with coverage outputs
- Lint pipeline using Biome.js
- Cache configuration for optimal performance

## Phase 2: Database Schema Design ✅ COMPLETE

> **Status**: ✅ All schema files created, migrations generated, indexes optimized, utilities implemented
> **Details**: See [PHASE2_COMPLETE.md](./PHASE2_COMPLETE.md) for full implementation report

### Step 2.1: Define Core Schema Files ✅

All schema files created in `packages/database/schema/`:

#### `users.ts`

```typescript
// Define users table with fields:
// - id (uuid, primary key)
// - email (unique, not null)
// - name (not null)
// - avatar_url (nullable)
// - created_at, updated_at (timestamps)
```

#### `workspaces.ts`

```typescript
// Define workspaces table with fields:
// - id (uuid, primary key)
// - name (not null)
// - slug (unique, not null)
// - icon (nullable)
// - created_at, updated_at
```

#### `workspace_members.ts`

```typescript
// Define workspace_members junction table:
// - id (uuid, primary key)
// - workspace_id (foreign key to workspaces)
// - user_id (foreign key to users)
// - role (enum: owner, admin, member, guest)
// - created_at
```

#### `teams.ts`

```typescript
// Define teams table:
// - id (uuid, primary key)
// - workspace_id (foreign key)
// - name (not null)
// - identifier (unique, 2-4 letter code, e.g., "ENG")
// - description (nullable)
// - icon (nullable)
// - archived (boolean, default false)
// - created_at, updated_at
```

#### `team_members.ts`

```typescript
// Define team_members junction table:
// - id (uuid, primary key)
// - team_id (foreign key to teams)
// - user_id (foreign key to users)
// - created_at
```

#### `projects.ts`

```typescript
// Define projects table:
// - id (uuid, primary key)
// - team_id (foreign key to teams)
// - name (not null)
// - description (nullable, text)
// - status (enum: planned, in_progress, completed, cancelled)
// - start_date, target_date (nullable dates)
// - lead_id (foreign key to users, nullable)
// - color (hex color code)
// - archived (boolean, default false)
// - created_at, updated_at
```

#### `cycles.ts`

```typescript
// Define cycles table:
// - id (uuid, primary key)
// - team_id (foreign key to teams)
// - name (not null)
// - number (integer, auto-increment per team)
// - start_date, end_date (dates, not null)
// - description (nullable)
// - created_at, updated_at
```

#### `issues.ts`

```typescript
// Define issues table:
// - id (uuid, primary key)
// - team_id (foreign key to teams)
// - project_id (foreign key to projects, nullable)
// - cycle_id (foreign key to cycles, nullable)
// - identifier (string, e.g., "ENG-123", unique per team)
// - title (not null)
// - description (text, nullable, markdown supported)
// - status (enum: backlog, todo, in_progress, done, cancelled)
// - priority (enum: none, low, medium, high, urgent)
// - assignee_id (foreign key to users, nullable)
// - creator_id (foreign key to users, not null)
// - parent_id (foreign key to issues, nullable for sub-issues)
// - due_date (nullable)
// - estimate (integer, story points, nullable)
// - sort_order (float for custom ordering)
// - archived (boolean, default false)
// - created_at, updated_at
```

#### `labels.ts`

```typescript
// Define labels table:
// - id (uuid, primary key)
// - team_id (foreign key to teams)
// - name (not null)
// - color (hex color code)
// - description (nullable)
// - created_at, updated_at
```

#### `issue_labels.ts`

```typescript
// Define issue_labels junction table:
// - id (uuid, primary key)
// - issue_id (foreign key to issues)
// - label_id (foreign key to labels)
// - created_at
```

#### `comments.ts`

```typescript
// Define comments table:
// - id (uuid, primary key)
// - issue_id (foreign key to issues)
// - user_id (foreign key to users)
// - parent_id (foreign key to comments, nullable for threading)
// - body (text, not null, markdown supported)
// - edited (boolean, default false)
// - created_at, updated_at
```

#### `comment_reactions.ts`

```typescript
// Define comment_reactions table:
// - id (uuid, primary key)
// - comment_id (foreign key to comments)
// - user_id (foreign key to users)
// - emoji (string, not null)
// - created_at
// - unique constraint on (comment_id, user_id, emoji)
```

#### `attachments.ts`

```typescript
// Define attachments table:
// - id (uuid, primary key)
// - issue_id (foreign key to issues, nullable)
// - comment_id (foreign key to comments, nullable)
// - user_id (foreign key to users)
// - filename (not null)
// - url (not null)
// - mime_type (not null)
// - size (integer, bytes)
// - created_at
```

#### `activity_logs.ts`

```typescript
// Define activity_logs table for audit trail:
// - id (uuid, primary key)
// - workspace_id (foreign key to workspaces)
// - user_id (foreign key to users)
// - entity_type (enum: issue, project, cycle, comment, etc.)
// - entity_id (uuid)
// - action (enum: created, updated, deleted, commented, etc.)
// - metadata (jsonb for storing change details)
// - created_at
```

#### `notifications.ts`

```typescript
// Define notifications table:
// - id (uuid, primary key)
// - user_id (foreign key to users)
// - type (enum: mention, assignment, comment, etc.)
// - entity_type (string)
// - entity_id (uuid)
// - read (boolean, default false)
// - archived (boolean, default false)
// - created_at
```

### Step 2.2: Create Migration Files ✅

- ✅ Generated 2 migration files using Drizzle Kit
- ✅ `0000_next_sumo.sql` - Initial schema with all tables and foreign keys
- ✅ `0001_daffy_arclight.sql` - Added 17 performance indexes
- ✅ Indexes on: team_id, project_id, cycle_id, assignee_id, status, created_at, identifier, workspace_id, user_id, entity_id, read

### Step 2.3: Setup Database Utilities ✅

Created production-grade helper functions:

- ✅ Connection pooling (max 20 connections, 30s idle timeout, 10s connect timeout)
- ✅ Transaction utilities (`withTransaction`, `executeInTransaction`)
- ✅ Query builders for complex filters (`buildIssueFilters`, pagination utilities)
- ✅ Type-safe interfaces for all database operations

## Phase 3: Backend API Development (Hono.js) ✅ 100% COMPLETE

> **Status**: ✅ All backend features implemented and tested
> **Details**: Authentication, routes, services, WebSocket, middleware all working

### Step 3.1: Setup Authentication ✅ COMPLETE

**Status**: ✅ **17/17 tests passing + Production fixes applied**

In `apps/api/src/`:

- ✅ JWT token authentication with 7-day expiration
- ✅ Bcrypt password hashing (cost factor 12)
- ✅ Session management with database-backed tokens
- ✅ Auth middleware (authMiddleware, optionalAuthMiddleware)
- ✅ User registration endpoint with validation
- ✅ User login endpoint with email/password
- ✅ User logout endpoint (session deletion)
- ✅ Get current user endpoint
- ✅ Comprehensive unit tests
- ✅ HTTP server request body parsing fixed for POST requests

### Step 3.2: Create API Route Structure ✅ COMPLETE

**Status**: ✅ All route handlers implemented and working

Setup the following route groups (all implemented at `/api/v1/*`):

#### `routes/auth.ts` ✅
- POST `/api/v1/auth/register` - User registration
- POST `/api/v1/auth/login` - User login
- POST `/api/v1/auth/logout` - User logout
- GET `/api/v1/auth/me` - Get current user

#### `routes/workspaces.ts`

- GET `/api/workspaces` - List user's workspaces
- POST `/api/workspaces` - Create workspace
- GET `/api/workspaces/:id` - Get workspace details
- PATCH `/api/workspaces/:id` - Update workspace
- DELETE `/api/workspaces/:id` - Delete workspace
- GET `/api/workspaces/:id/members` - List workspace members
- POST `/api/workspaces/:id/members` - Add member
- DELETE `/api/workspaces/:id/members/:userId` - Remove member

#### `routes/teams.ts`

- GET `/api/workspaces/:workspaceId/teams` - List teams
- POST `/api/workspaces/:workspaceId/teams` - Create team
- GET `/api/teams/:id` - Get team details
- PATCH `/api/teams/:id` - Update team
- POST `/api/teams/:id/archive` - Archive team
- GET `/api/teams/:id/members` - List team members
- POST `/api/teams/:id/members` - Add team member
- DELETE `/api/teams/:id/members/:userId` - Remove team member

#### `routes/issues.ts`

- GET `/api/teams/:teamId/issues` - List issues (with filters)
- POST `/api/teams/:teamId/issues` - Create issue
- GET `/api/issues/:id` - Get issue details
- PATCH `/api/issues/:id` - Update issue
- DELETE `/api/issues/:id` - Delete issue
- POST `/api/issues/:id/archive` - Archive issue
- GET `/api/issues/:id/comments` - Get issue comments
- POST `/api/issues/:id/comments` - Create comment
- GET `/api/issues/:id/activity` - Get issue activity log

#### `routes/projects.ts`

- GET `/api/teams/:teamId/projects` - List projects
- POST `/api/teams/:teamId/projects` - Create project
- GET `/api/projects/:id` - Get project details
- PATCH `/api/projects/:id` - Update project
- DELETE `/api/projects/:id` - Delete project
- GET `/api/projects/:id/issues` - Get project issues
- GET `/api/projects/:id/progress` - Get project progress stats

#### `routes/cycles.ts`

- GET `/api/teams/:teamId/cycles` - List cycles
- POST `/api/teams/:teamId/cycles` - Create cycle
- GET `/api/cycles/:id` - Get cycle details
- PATCH `/api/cycles/:id` - Update cycle
- DELETE `/api/cycles/:id` - Delete cycle
- GET `/api/cycles/:id/issues` - Get cycle issues
- GET `/api/cycles/:id/progress` - Get cycle progress stats

#### `routes/labels.ts`

- GET `/api/teams/:teamId/labels` - List labels
- POST `/api/teams/:teamId/labels` - Create label
- PATCH `/api/labels/:id` - Update label
- DELETE `/api/labels/:id` - Delete label

#### `routes/comments.ts`

- PATCH `/api/comments/:id` - Update comment
- DELETE `/api/comments/:id` - Delete comment
- POST `/api/comments/:id/reactions` - Add reaction
- DELETE `/api/comments/:id/reactions/:emoji` - Remove reaction

#### `routes/attachments.ts`

- POST `/api/attachments` - Upload attachment
- DELETE `/api/attachments/:id` - Delete attachment

#### `routes/notifications.ts`

- GET `/api/notifications` - List user notifications
- PATCH `/api/notifications/:id/read` - Mark as read
- POST `/api/notifications/read-all` - Mark all as read
- PATCH `/api/notifications/:id/archive` - Archive notification

#### `routes/search.ts`

- GET `/api/search` - Global search (issues, projects, users)
- GET `/api/search/issues` - Search issues with filters

#### `routes/activity.ts`

- GET `/api/activity` - Get user activity feed
- GET `/api/workspaces/:id/activity` - Get workspace activity

### Step 3.3: Implement Business Logic Services ✅ COMPLETE

**Status**: ✅ All service files created (5 files, 1,400+ lines)

Create service files in `apps/api/src/services/`:

#### `issueService.ts` ✅

- ✅ `createIssue()` - Generate identifier, validate, create issue
- ✅ `updateIssue()` - Handle updates with activity logging
- ✅ `filterIssues()` - Complex filtering by status, assignee, labels, etc.
- ✅ `reorderIssues()` - Update sort_order for drag-drop
- ✅ `getIssueActivity()` - Fetch activity logs for an issue

#### `projectService.ts` ✅

- ✅ `calculateProjectProgress()` - Compute completion percentage
- ✅ `getProjectStats()` - Issue counts by status

#### `cycleService.ts` ✅

- ✅ `getActiveCycles()` - Get currently running cycles
- ✅ `calculateCycleProgress()` - Compute cycle completion

#### `notificationService.ts` ✅

- ✅ `createNotification()` - Generate notifications for mentions, assignments
- ✅ `sendMentionNotifications()` - Parse markdown for @mentions
- ✅ `sendAssignmentNotification()` - Notify on assignment changes

#### `activityService.ts` ✅

- ✅ `logActivity()` - Create activity log entries
- ✅ `getActivityFeed()` - Fetch aggregated activity for user/workspace

### Step 3.4: Setup WebSocket for Real-time Updates ✅ COMPLETE

**Status**: ✅ WebSocket system implemented (7 files, 1,500+ lines)

In `apps/api/src/websocket/`:

- ✅ Create WebSocket server integration with Hono
- ✅ Implement room-based pub/sub (workspace, team, issue, project, cycle, user)
- ✅ Broadcast events: issue updates, comments, status changes, typing indicators
- ✅ Handle client subscriptions and unsubscriptions
- ✅ Type-safe event payloads and message handlers
- ✅ Rate limiting for WebSocket messages (100/minute)
- ✅ Heartbeat/ping mechanism (30-second interval)
- ✅ Client connection management with auto-cleanup
- ✅ Error handling and graceful degradation

### Step 3.5: Implement Middleware ✅ COMPLETE

**Status**: ✅ Middleware layer complete (3 new files, ~675 lines)

Create middleware in `apps/api/src/middleware/`:

- ✅ `auth.ts` - JWT token verification (already implemented)
- ✅ `cors.ts` - Environment-aware CORS (4 strategies: default, WebSocket, strict, public)
- ✅ `errorHandler.ts` - Global error handling (already implemented)
- ✅ `validation.ts` - Type-safe Zod validation (body, query, params)
- ✅ `rateLimit.ts` - In-memory rate limiting (4 pre-configured limiters)
- ✅ `index.ts` - Barrel exports for clean imports

**Key Features**:
- Environment-aware CORS (dev: localhost, prod: FRONTEND_URL only)
- Type-safe validation with Zod schema inference
- Multiple rate limiting strategies (API: 100/min, Auth: 10/min, Write: 30/min, Read: 200/min)
- Standard rate limit headers (X-RateLimit-*)
- Client identification (userId or IP address)

### Step 3.6: Setup Environment Variables ✅ COMPLETE

**Status**: ✅ Enhanced .env.example with comprehensive documentation

Create `.env.example`:

```env
# Required Variables
DATABASE_URL=postgresql://user:password@localhost:5432/linear_clone
JWT_SECRET=your-secret-key-change-in-production
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# Optional Configurations (documented with inline comments)
# - Rate limiting (window, max requests per limiter)
# - Session expiry
# - File uploads (max size, allowed types)
# - Email (SMTP configuration)
# - Redis (for multi-server rate limiting)
# - Logging level
# - Monitoring (Sentry DSN)
# - Feature flags (WebSockets, email notifications, file uploads)
```

See [PHASE3.5_AND_3.6_COMPLETE.md](./PHASE3.5_AND_3.6_COMPLETE.md) for detailed documentation.

## Phase 4: Frontend Development (Next.js)

### Step 4.1: Setup Design System ✅ COMPLETE

In `apps/web/src/`:

#### `globals.css` ✅

Created Linear-inspired design system with:

- ✅ Colors: primary (#5e6ad2), secondary, accent, surfaces, borders
- ✅ Typography: font families (sans, mono), sizes, weights
- ✅ Spacing: consistent spacing scale (0-16)
- ✅ Animations: smooth transitions (150-300ms with cubic-bezier)
- ✅ Dark/light theme support with CSS variables
- ✅ Priority colors: urgent, high, medium, low, none
- ✅ Issue status colors: backlog, todo, in_progress, done, cancelled
- ✅ Accessibility: focus styles, selection colors
- ✅ Scrollbar styling

#### `components/ui/` ✅ PARTIAL

Created base UI components using Radix UI:

- ✅ `Button.tsx` - Primary, secondary, ghost, outline, destructive variants with loading states
- ✅ `Input.tsx` - Text input with icon support, error states, helper text
- ⚠️ `Select.tsx` - Custom select dropdown (to be implemented)
- ✅ `Dialog.tsx` - Modal dialog with overlay, animations, focus trapping
- ⚠️ `Popover.tsx` - Popover menus (to be implemented)
- ⚠️ `DropdownMenu.tsx` - Context menus (to be implemented)
- ✅ `Tooltip.tsx` - Tooltips with slide animations
- ✅ `Badge.tsx` - Status/label badges with issue status variants
- ✅ `Avatar.tsx` - User avatars with auto-generated initials fallback
- ⚠️ `Checkbox.tsx` - Checkboxes (to be implemented)
- ⚠️ `RadioGroup.tsx` - Radio buttons (to be implemented)
- ✅ `Textarea.tsx` - Multi-line text input with error states
- ⚠️ `Command.tsx` - Command palette base (to be implemented)
- ⚠️ `ContextMenu.tsx` - Right-click menus (to be implemented)

#### `lib/utils.ts` ✅

Created utility functions:

- ✅ `cn()` - Class name merging with Tailwind conflict resolution
- ✅ `formatDate()` - Human-readable date formatting
- ✅ `formatRelativeTime()` - Relative time strings ("2h ago")
- ✅ `debounce()` - Debounce function for performance
- ✅ `getInitials()` - Generate initials from names

### Step 4.2: Setup Global State Management ✅ COMPLETE

In `apps/web/src/stores/`:

#### `auth-store.ts` ✅

- ✅ Current user state (User | null)
- ✅ Authentication tokens (JWT)
- ✅ Login/logout actions
- ✅ Persisted storage with Zustand persist middleware
- ✅ Redux DevTools integration
- ✅ Selector hooks (useUser, useIsAuthenticated, useAuthToken)

#### `workspace-store.ts` ✅

- ✅ Active workspace state
- ✅ Workspace list with Map for efficient lookups
- ✅ Workspace members cache
- ✅ Switch workspace action
- ✅ Add/update/remove workspace operations
- ✅ Member management (add, remove, set)
- ✅ Persisted active workspace
- ✅ Selector hooks (useActiveWorkspace, useWorkspaces, useWorkspaceMembers)

#### `team-store.ts` ✅

- ✅ Active team state
- ✅ Team list with archived support
- ✅ Team members cache with Map
- ✅ Switch team action
- ✅ Add/update/remove/archive team operations
- ✅ Member management
- ✅ Persisted active team
- ✅ Selector hooks (useActiveTeam, useTeams, useTeamMembers)

#### `issue-store.ts` ✅

- ✅ Issues Map for O(1) lookups (issueId -> Issue)
- ✅ Issue filters state (status, priority, assignee, labels, etc.)
- ✅ Active issue state
- ✅ Optimistic updates with rollback support
- ✅ Add/update/remove issue operations
- ✅ Filter management (set, clear)
- ✅ WebSocket sync handler placeholders
- ✅ Selector hooks (useIssues, useIssue, useFilteredIssues, useActiveIssue)

#### `ui-store.ts` ✅

- ✅ Command palette open/close state
- ✅ Modal/dialog state with data passing
- ✅ Sidebar collapsed state
- ✅ Theme (light/dark/system) with auto-apply to DOM
- ✅ Persisted UI preferences
- ✅ Selector hooks (useTheme, useSidebarCollapsed, useCommandPaletteOpen, useActiveModal)

#### `types/index.ts` ✅

- ✅ Complete TypeScript type definitions for all entities
- ✅ Union types for enums (IssueStatus, IssuePriority, ProjectStatus, etc.)
- ✅ Filter types (IssueFilters)
- ✅ Pagination types (PaginationParams, PaginatedResponse)
- ✅ Type-safe interfaces matching database schema

### Step 4.3: Create Core Layouts ✅ COMPLETE

In `apps/web/src/app/`:

#### `layout.tsx` ✅

- ✅ Root layout with Inter font (replacing Geist for Linear-like aesthetic)
- ✅ ThemeProvider integration with system theme detection
- ✅ TooltipProvider from Radix UI for global tooltip support
- ✅ Comprehensive SEO metadata (OpenGraph, Twitter cards)
- ✅ CSS variables for theme management
- ✅ Smooth transitions support

#### `components/providers/theme-provider.tsx` ✅

- ✅ Theme provider with Zustand UI store integration
- ✅ System theme detection via matchMedia
- ✅ SSR-safe with mounted state
- ✅ Automatic theme application to document root
- ✅ Smooth theme transitions

#### `(auth)/layout.tsx` ✅

- ✅ Auth pages layout (login, register)
- ✅ Centered card design (max-width 500px)
- ✅ Subtle grid background pattern (32px, 2% opacity)
- ✅ Brand header section with title and tagline
- ✅ Footer with Terms of Service and Privacy Policy links
- ✅ Responsive with proper spacing

#### `(app)/layout.tsx` ✅

- ✅ Main app layout with flex structure
- ✅ Fixed sidebar navigation (240px width, collapsible)
  - Workspace/team switcher section
  - Navigation links (My Issues, Inbox, Views)
  - Teams section with placeholder
  - Projects section with placeholder
  - Cycles section with placeholder
  - User profile section
- ✅ Fixed top navigation bar (56px height)
  - Mobile menu button
  - Breadcrumb navigation
  - Search/command palette trigger (⌘K)
  - Create issue button
  - Notifications button
  - User menu
- ✅ Scrollable main content area
- ✅ Full viewport height (100vh)
- ✅ Placeholder structure ready for Phase 4.5 components
- ✅ Prepared for command palette integration (Phase 4.6)
- ✅ Prepared for notification system (Phase 4.12)

### Step 4.4: Implement Authentication Pages

In `apps/web/src/app/(auth)/`:

#### `login/page.tsx`

- Email/password login form
- Form validation with React Hook Form + Zod
- Error handling
- Redirect on success

#### `register/page.tsx`

- Registration form
- Password strength indicator
- Email validation

### Step 4.5: Create Main App Navigation

In `apps/web/src/components/layout/`:

#### `Sidebar.tsx` ✅

- Workspace/team switcher dropdown
- Navigation links: My Issues, Inbox, Views
- Team sections with issue counts
- Projects list
- Cycles list
- Settings link
- User profile dropdown

Implementation notes:
- Collapsible state with persistent preference (64px collapsed / 256px expanded)
- Workspace switcher with avatar and dropdown menu
- Integration with `ui-store` and `workspace-store`

#### `TopNav.tsx` ✅

- Breadcrumb navigation
- Search trigger (⌘K)
- Notifications bell icon
- Create issue button
- User avatar menu

Implementation notes:
- Command palette trigger (⌘K) placeholder wired to `ui-store`
- Notifications dropdown with unread badge and recent items
- User menu with profile/settings/logout actions

Status: ✅ Step 4.5 COMPLETE — Sidebar and TopNav implemented and integrated with stores

### Step 4.6: Implement Command Palette

In `apps/web/src/components/`:

#### `CommandPalette.tsx`

- Global command menu (⌘K / Ctrl+K)
- Fuzzy search for:
  - Issues (by identifier or title)
  - Projects
  - Users
  - Actions (Create Issue, New Project, etc.)
- Keyboard navigation
- Recent searches
- Command categories

### Step 4.7: Build Issue Management Pages

In `apps/web/src/app/(app)/team/[teamId]/`:

#### `issues/page.tsx`

- Issue list view with table layout
- Columns: Identifier, Title, Status, Priority, Assignee, Labels, Due Date
- Inline editing capabilities
- Bulk selection and actions
- Keyboard shortcuts (c for create, e for edit, etc.)

#### `issues/board/page.tsx`

- Kanban board view
- Drag-and-drop between status columns using @dnd-kit
- Group by status
- Real-time updates via WebSocket
- Smooth animations for card movements

#### `issue/[issueId]/page.tsx`

- Full issue detail view
- Editable title (inline)
- Markdown description editor with preview
- Property panel:
  - Status dropdown
  - Priority selector
  - Assignee picker
  - Labels multi-select
  - Project dropdown
  - Cycle dropdown
  - Due date picker
  - Estimate input
- Comments section with threading
- Activity timeline
- Attachments section

### Step 4.8: Create Issue Components

In `apps/web/src/components/issues/`:

#### `IssueCard.tsx`

- Compact issue card for board view
- Show: identifier, title, priority icon, assignee avatar, labels
- Hover state with quick actions

#### `IssueRow.tsx`

- Table row for list view
- Inline editing for status, priority, assignee
- Click to open detail view

#### `IssueForm.tsx`

- Create/edit issue modal
- Form with all issue properties
- Markdown editor for description
- Keyboard shortcut (⌘Enter to save)

#### `IssueFilters.tsx`

- Filter panel with:
  - Status multi-select
  - Priority multi-select
  - Assignee multi-select
  - Label multi-select
  - Project filter
  - Date range filter
- Save custom views

#### `IssuePriorityIcon.tsx`

- Visual priority indicators (icons with colors)

#### `IssueStatusBadge.tsx`

- Status badge with color coding

### Step 4.9: Build Project Management

In `apps/web/src/app/(app)/team/[teamId]/projects/`:

#### `page.tsx`

- Projects list/grid view
- Show: name, status, progress bar, lead, dates
- Filter and sort options

#### `[projectId]/page.tsx`

- Project detail page
- Project header with edit capabilities
- Progress chart/visualization
- Issues grouped by status
- Project activity feed

#### `components/ProjectCard.tsx`

- Project card for grid view
- Progress ring visualization
- Quick stats

#### `components/ProjectForm.tsx`

- Create/edit project modal
- Color picker for project color

### Step 4.10: Build Cycle Management

In `apps/web/src/app/(app)/team/[teamId]/cycles/`:

#### `page.tsx`

- Cycles list (active, upcoming, past)
- Create cycle button
- Cycle cards with progress

#### `[cycleId]/page.tsx`

- Cycle detail page
- Cycle timeline visualization
- Issues in cycle
- Burndown chart (simple)
- Cycle stats

#### `components/CycleForm.tsx`

- Create/edit cycle modal
- Date range picker
- Auto-generate cycle number

### Step 4.11: Implement Comments System

In `apps/web/src/components/comments/`:

#### `CommentList.tsx`

- Threaded comment display
- Load more pagination
- Real-time new comments

#### `CommentItem.tsx`

- Single comment with:
  - User avatar and name
  - Timestamp
  - Markdown rendered body
  - Edit/delete actions (if owner)
  - Reaction picker
  - Reply button

#### `CommentForm.tsx`

- Markdown editor for new comments
- @mention autocomplete
- Emoji picker
- File attachment option

#### `CommentReactions.tsx`

- Reaction display with counts
- Click to add/remove reaction

### Step 4.12: Build Notification System

In `apps/web/src/components/notifications/`:

#### `NotificationPopover.tsx`

- Notifications dropdown from top nav
- List of recent notifications
- Mark as read/unread
- Group by date
- "View all" link

#### `NotificationItem.tsx`

- Single notification with:
  - Icon based on type
  - Description
  - Link to entity
  - Timestamp
  - Read/unread indicator

#### `NotificationPreferences.tsx`

- Settings page for notification preferences
- Toggle notification types

### Step 4.13: Implement Search

In `apps/web/src/components/search/`:

#### `SearchDialog.tsx`

- Search modal (accessible from command palette)
- Search input with filters
- Results grouped by type
- Keyboard navigation

#### `SearchResults.tsx`

- Display search results
- Highlight matching text
- Quick preview on hover

### Step 4.14: Build Activity Feed

In `apps/web/src/app/(app)/activity/`:

#### `page.tsx`

- User activity feed
- Filter by: all, assigned to me, mentions, created by me
- Group by date
- Infinite scroll pagination

#### `components/ActivityItem.tsx`

- Single activity entry with:
  - User avatar
  - Action description
  - Entity link
  - Timestamp

### Step 4.15: Create Settings Pages

In `apps/web/src/app/(app)/settings/`:

#### `account/page.tsx`

- Edit profile (name, email, avatar)
- Change password
- Account deletion

#### `workspace/page.tsx`

- Workspace settings (name, icon, slug)
- Member management
- Delete workspace

#### `team/[teamId]/page.tsx`

- Team settings
- Team members
- Team identifier
- Archive team

#### `preferences/page.tsx`

- Theme toggle (light/dark)
- Keyboard shortcuts reference
- Notification settings

### Step 4.16: Implement Keyboard Shortcuts

In `apps/web/src/hooks/`:

#### `useKeyboardShortcuts.ts`

- Global keyboard shortcuts handler
- Shortcuts:
  - ⌘K / Ctrl+K: Open command palette
  - C: Create new issue
  - /: Focus search
  - ?: Show shortcuts help
  - G then I: Go to issues
  - G then P: Go to projects
  - Esc: Close modals

### Step 4.17: Add Drag and Drop

In `apps/web/src/components/issues/`:

#### `DraggableIssueCard.tsx`

- Wrap IssueCard with @dnd-kit draggable
- Visual feedback during drag

#### `DroppableStatusColumn.tsx`

- Status column as drop target
- Handle drop to update issue status
- Optimistic UI updates

### Step 4.18: Implement Real-time Sync

In `apps/web/src/lib/`:

#### `websocket.ts`

- WebSocket client connection
- Auto-reconnect logic
- Event handlers for:
  - Issue updates
  - New comments
  - Status changes
  - Assignments
- Sync with local state stores

### Step 4.19: Add Loading States & Animations

Throughout components:

- Skeleton loaders for data fetching
- Smooth transitions for modals (scale + fade)
- Slide animations for sidebars
- Fade-in for lists
- Loading spinners for async actions
- Optimistic UI for mutations

### Step 4.20: Implement Error Handling

In `apps/web/src/components/`:

#### `ErrorBoundary.tsx`

- Catch React errors
- Display friendly error messages
- Retry functionality

#### `Toast.tsx`

- Toast notifications for:
  - Success messages
  - Error messages
  - Info/warnings
- Auto-dismiss

## Phase 5: Testing

### Step 5.1: Setup Vitest

- Configure Vitest for both frontend and backend
- Setup test utilities and helpers
- Install React Testing Library for component tests
- Configure coverage thresholds

### Step 5.2: Write Backend Tests

In `apps/api/src/__tests__/`:

- **Unit tests** for services (business logic)
  - Issue creation with identifier generation
  - Filtering and sorting logic
  - Notification generation
  - Activity logging
- **Integration tests** for API routes (with mocked DB)
  - Full request/response cycles
  - Authentication flows
  - Error handling
- **Database tests** (migrations, queries)
  - Schema validation
  - Constraint testing
  - Migration rollback

### Step 5.3: Write Frontend Tests

In `apps/web/src/__tests__/`:

- **Component unit tests** (React Testing Library)
  - UI component rendering
  - User interactions
  - Accessibility
- **Integration tests** (user flows)
  - Issue creation flow
  - Kanban board interactions
  - Command palette usage
- **Store tests** (Zustand state management)
  - State updates
  - Action handlers
  - WebSocket sync
- **Hook tests** (custom hooks)
  - Keyboard shortcuts
  - API data fetching
  - Form validation

### Step 5.4: E2E Testing (Optional)

- Use Playwright for critical user flows
- Test scenarios:
  - Complete authentication flow
  - Create and update issue
  - Real-time collaboration
  - Command palette workflows

## Phase 6: Performance Optimization

### Step 6.1: Frontend Optimizations

- Implement React.memo for expensive components
- Use virtualization for long lists (react-window)
- Lazy load routes and heavy components
- Optimize images (Next.js Image component)
- Minimize bundle size (analyze with webpack-bundle-analyzer)

### Step 6.2: Backend Optimizations

- Add database query indexes
- Implement response caching for static data
- Use database connection pooling
- Optimize N+1 queries with proper joins
- Implement pagination for large datasets

### Step 6.3: Real-time Optimizations

- Debounce/throttle WebSocket events
- Batch database writes for activity logs
- Implement efficient room-based broadcasting

## Phase 7: Documentation

### Step 7.1: Create README.md

Include:

- Project overview
- Technology stack explanation
- Setup instructions
- Environment variables
- Database migration steps
- Running the development servers
- Building for production

### Step 7.2: Architecture Documentation

Create `ARCHITECTURE.md`:

- High-level system architecture diagram
- Database schema explanation
- Real-time synchronization strategy
- State management approach
- API design decisions

### Step 7.3: Code Comments

- Add JSDoc comments for complex functions
- Document business logic
- Explain non-obvious algorithms

### Step 7.4: API Documentation

Create `API.md`:

- List all endpoints with:
  - Method and path
  - Request body schema
  - Response schema
  - Authentication requirements
  - Example requests/responses

## Phase 8: Deployment Preparation

### Step 8.1: Environment Configuration

- Setup production environment variables
- Configure database for production
- Setup CORS for production domain

### Step 8.2: Build Optimization

- Enable production builds in Next.js
- Minify backend bundle
- Setup environment-based configs

### Step 8.3: Docker (Optional)

- Create Dockerfile for frontend
- Create Dockerfile for backend
- Create docker-compose.yml for local development

## Development Priorities

### Must Have (MVP Core)

1. ✅ Authentication (register, login, logout)
2. ✅ Workspace & team management
3. ✅ Issue CRUD operations
4. ✅ Issue list and board views
5. ✅ Issue properties (status, priority, assignee, labels)
6. ✅ Comments on issues
7. ✅ Projects with progress tracking
8. ✅ Basic real-time updates
9. ✅ Command palette
10. ✅ Search functionality

### Should Have (Enhanced UX)

1. ✅ Cycles/sprints
2. ✅ Notifications
3. ✅ Activity feed
4. ✅ Drag-and-drop reordering
5. ✅ Keyboard shortcuts
6. ✅ Dark/light theme
7. ✅ File attachments
8. ✅ Comment reactions
9. ✅ @mentions in comments
10. ✅ Custom filters and views

### Nice to Have (Polish)

1. ⚠️ Threaded comment replies
2. ⚠️ Advanced search filters
3. ⚠️ Burndown charts
4. ⚠️ Export functionality
5. ⚠️ Email notifications
6. ⚠️ Issue templates
7. ⚠️ Bulk operations
8. ⚠️ Mobile responsive design
9. ⚠️ Offline support
10. ⚠️ Integration webhooks (mocked)

## Clean Architecture Implementation

### Backend Structure (`apps/api/src/`)

**Separation of Concerns**:

- **Routes** (`routes/`): Thin handlers, validation only (Zod schemas)
- **Services** (`services/`): Business logic, no HTTP concerns
- **Middleware** (`middleware/`): Auth, CORS, error handling, validation
- **Database** (`packages/database/`): Drizzle ORM, migrations, schemas

**Key Principles**:

1. **Routes should NOT contain business logic** - Only handle HTTP concerns
2. **Services contain all business logic** - No knowledge of HTTP/Express/Hono
3. **Database layer is isolated** - Services use database through abstraction
4. **Dependency injection** - Services receive dependencies (DB, config) as parameters

**Example Pattern**:

```typescript
// routes/issues.ts - Thin handler
app.post("/api/teams/:teamId/issues", async (c) => {
  const body = await c.req.json();
  const validated = issueSchema.parse(body);
  const issue = await issueService.createIssue(validated);
  return c.json(issue, 201);
});

// services/issueService.ts - Business logic
export async function createIssue(data: CreateIssueInput) {
  const identifier = await generateIdentifier(data.teamId);
  const issue = await db.insert(issues).values({ ...data, identifier });
  await activityService.logActivity("issue", "created", issue.id);
  await notificationService.notifyAssignment(issue);
  return issue;
}
```

### Frontend Structure (`apps/web/src/`)

**Layer Organization**:

- **App** (`app/`): Next.js App Router pages and layouts
- **Components** (`components/`): Reusable UI components
- **Stores** (`stores/`): Zustand state management
- **Lib** (`lib/`): Utilities, API clients, WebSocket handlers
- **Hooks** (`hooks/`): Custom React hooks

**Key Principles**:

1. **Server Components by default** - Use `"use client"` sparingly
2. **Co-locate related code** - Keep components with their styles/tests
3. **API layer abstraction** - All API calls through `lib/api/` functions
4. **State management** - Global state in Zustand, local state in hooks

## Code Quality Guidelines

### TypeScript

- Enable strict mode
- Use proper types (avoid `any`)
- Define interfaces for all data structures
- Use Zod for runtime validation

### React Best Practices

- Use functional components and hooks
- Keep components small and focused
- Extract custom hooks for reusable logic
- Proper dependency arrays in useEffect
- Memoize expensive computations

### Code Style

- Use Biome.js for consistent formatting
- Follow naming conventions:
  - camelCase for functions/variables
  - PascalCase for components/types
  - UPPER_CASE for constants
- Write descriptive variable names
- Keep functions small (< 50 lines ideally)

### Performance

- Avoid unnecessary re-renders
- Use appropriate data structures
- Implement proper loading states
- Handle errors gracefully
- Log errors appropriately

## Security Considerations

1. **Authentication**
   - Use secure password hashing (Better Auth handles this)
   - Implement proper session management
   - CSRF protection

2. **Authorization**
   - Verify user permissions on all mutations
   - Check workspace/team membership
   - Validate ownership for updates/deletes

3. **Input Validation**
   - Validate all inputs on backend
   - Sanitize user-generated content
   - Prevent SQL injection (use parameterized queries)
   - Validate file uploads

4. **API Security**
   - Rate limiting
   - CORS configuration
   - Secure headers
   - Environment variable protection

## Success Criteria

The MVP is complete when:

- [ ] User can register and login
- [ ] User can create a workspace and team
- [ ] User can create, edit, and delete issues
- [ ] User can view issues in list and board views
- [ ] User can drag issues between status columns
- [ ] User can assign issues, set priority, and add labels
- [ ] User can create and manage projects
- [ ] User can create and manage cycles
- [ ] User can add comments to issues
- [ ] User can see real-time updates from other users
- [ ] User can use command palette (⌘K) for quick actions
- [ ] User can search for issues, projects, and users
- [ ] User receives notifications for mentions and assignments
- [ ] Application has smooth animations and transitions
- [ ] Application is responsive and performant
- [ ] Code is well-documented and tested
- [ ] README includes complete setup instructions

## Next Steps After MVP

1. **Mobile Optimization**
   - Responsive design for tablets/phones
   - Touch-friendly interactions
   - Mobile-specific navigation

2. **Advanced Features**
   - Custom fields for issues
   - Issue templates
   - Automation rules
   - Advanced reporting and analytics
   - Time tracking
   - Roadmap view

3. **Integrations**
   - GitHub/GitLab integration (real)
   - Slack notifications
   - Email notifications
   - Zapier/webhook support
   - API for third-party integrations

4. **AI Features**
   - Issue triage and auto-assignment
   - Smart due date suggestions
   - Duplicate issue detection
   - Natural language issue creation

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Setup database
cd packages/database
npm run db:generate
npm run db:migrate

# Start development servers
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Lint and format
npm run lint
npm run format
```

## Environment Setup Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL 14+ installed and running
- [ ] NPM installed
- [ ] Git initialized
- [ ] `.env` files created in all apps
- [ ] Database created and migrated
- [ ] Dependencies installed
- [ ] Development servers running

---

**Remember**: Focus on delivering a polished, performant MVP that closely matches Linear's UX rather than implementing every feature. Quality over quantity