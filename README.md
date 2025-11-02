# Linear Clone

A high-fidelity fullstack clone of Linear.app built with modern technologies focusing on core project management functionality with real-time collaboration, issue tracking, and team management.

## 🚀 Technology Stack

### Core Technologies
- **Package Manager**: npm 11.6.2
- **Build System**: Turborepo 2.3.0
- **Frontend**: Next.js 16.0.1 with React 19.2.0 (App Router)
- **Backend**: Hono.js 4.6.11
- **Database**: PostgreSQL with Drizzle ORM 0.44.7
- **Styling**: Tailwind CSS 4.1.16 (v4 - CSS-first architecture)
- **Code Quality**: Biome.js 1.9.4 (root) + 2.2.0 (web)
- **Testing**: Vitest 2.1.9
- **TypeScript**: 5.6.3

### Backend Stack ✅ Implemented
- **Auth**: JWT tokens + Bcrypt password hashing
- **Validation**: Zod 3.23.8 (schema validation)
- **Real-time**: WebSockets (ws 8.18.0)
- **Middleware**: CORS, validation, rate limiting, auth, error handling

### Frontend Stack (Planned)
- **UI Components**: Radix UI (to be installed)
- **State Management**: Zustand (to be installed)
- **Forms**: React Hook Form + Zod (to be installed)
- **Icons**: Lucide React (to be installed)

## 📁 Project Structure

```
linear-clone/
├── apps/
│   ├── web/                 # Next.js frontend (port 3000)
│   └── api/                 # Hono.js backend (port 3001)
├── packages/
│   ├── database/            # Drizzle ORM schemas & migrations
│   ├── ui/                  # Shared React components
│   └── typescript-config/   # Shared TypeScript configs
├── biome.json               # Biome.js configuration
├── turbo.json               # Turborepo pipeline config
└── vitest.config.ts         # Root Vitest config
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- npm 11.6.2

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd linear-clone
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   For the API:

   ```bash
   cd apps/api
   cp .env.example .env
   # Edit .env with your database credentials
   ```

   For the database:

   ```bash
   cd packages/database
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Create the database**

   ```sql
   CREATE DATABASE linear_clone;
   ```

5. **Run database migrations** (when schemas are created)
   ```bash
   cd packages/database
   npm run db:generate
   npm run db:migrate
   ```

## 🚦 Development

### Start all apps

```bash
npm run dev
```

This starts:

- Frontend (Next.js) at http://localhost:3000
- Backend (Hono.js) at http://localhost:3001

### Start specific app

```bash
# Frontend only
npx turbo dev --filter=web

# Backend only
npx turbo dev --filter=api
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for specific package
npx turbo test --filter=web
npx turbo test --filter=api
```

## 🎨 Code Quality

```bash
# Lint all code
npm run lint

# Lint and auto-fix
npm run lint:fix

# Format all code
npm run format

# Type check all packages
npm run check-types
```

## 🏗️ Build

```bash
# Build all apps and packages
npm run build

# Build specific app
npx turbo build --filter=web
npx turbo build --filter=api
```

## 📦 Packages

### Apps

- **web**: Next.js frontend application with App Router, Tailwind CSS, and Radix UI
- **api**: Hono.js backend with clean architecture (routes → services → database)

### Packages

- **@repo/database**: Drizzle ORM schema definitions and database client
- **@repo/ui**: Shared React component library
- **@repo/typescript-config**: Shared TypeScript configurations

## 🗄️ Database Commands

```bash
cd packages/database

# Generate migrations from schema
npm run db:generate

# Run migrations
npm run db:migrate

# Push schema to database (dev only)
npm run db:push

# Open Drizzle Studio
npm run db:studio
```

## � Security

### Authentication System
- **JWT Tokens**: 7-day expiration with secure signing
- **Password Hashing**: Bcrypt with cost factor 12
- **Session Management**: Database-backed session tokens
- **Environment Security**: 
  - Production deployment fails if `JWT_SECRET` is not set
  - Development shows warnings for missing environment variables
- **Error Sanitization**: 
  - Production: No sensitive information in error responses
  - Development: Full error details for debugging

### Security Best Practices
- ✅ No hardcoded secrets in production
- ✅ Expired session cleanup mechanism
- ✅ Input validation with Zod schemas
- ✅ Type-safe database queries (no SQL injection)
- ✅ Password hash stored securely (never exposed in API responses)

See [CODE_REVIEW_FIXES.md](./CODE_REVIEW_FIXES.md) for recent security improvements.

## 📚 Documentation

### Main Documentation
- [AGENTS.md](./AGENTS.md) - Comprehensive implementation guide and feature requirements
- [.github/copilot-instructions.md](./.github/copilot-instructions.md) - Development guidelines and best practices

### Phase Completion Reports
- [PHASE1_COMPLETE.md](./PHASE1_COMPLETE.md) - Project setup and configuration
- [PHASE2_COMPLETE.md](./PHASE2_COMPLETE.md) - Database schema design and migrations
- [PHASE3.5_AND_3.6_COMPLETE.md](./PHASE3.5_AND_3.6_COMPLETE.md) - Middleware and environment setup
- [PHASE4.7_COMPLETE.md](./PHASE4.7_COMPLETE.md) - Issue management pages (list, board, detail) ✅
- Phase 4.8 complete - see AGENTS.md Step 4.8 for IssueForm implementation details ✅

### Project Status
- [MVP_STATUS.md](./MVP_STATUS.md) - **Comprehensive MVP progress report** (~48% complete)

### Package Documentation
- [packages/database/README.md](./packages/database/README.md) - Database setup and schema docs

## 🎯 Current Status

### ✅ Completed

**Phase 1: Project Setup & Configuration**

- [x] Project initialization with Turborepo
- [x] Biome.js setup for linting and formatting
- [x] Vitest setup for comprehensive testing
- [x] Next.js app with Tailwind CSS v4 and Radix UI
- [x] Hono.js backend with clean architecture
- [x] Database package with Drizzle ORM
- [x] Turborepo pipeline configuration

**Phase 2: Database Schema Design** ✅

- [x] Complete database schema (16 tables, 133 columns)
- [x] Migration files generated with proper indexes (17 indexes)
- [x] Transaction utilities for atomic operations
- [x] Query builder utilities for complex filtering
- [x] Type-safe schema with TypeScript inference
- [x] Connection pooling configuration
- [x] Comprehensive documentation

**Phase 3: Backend API Development** ✅ (60% Complete)

- [x] **Phase 3.1: Authentication System** ✅
  - JWT token authentication with 7-day expiration
  - Bcrypt password hashing (cost factor 12)
  - Session management with database-backed tokens
  - Auth middleware for protected routes
  - User registration, login, logout, get-me endpoints
  - 17/17 tests passing

- [x] **Phase 3.2: API Route Handlers** ✅
  - Workspace routes (CRUD operations, member management)
  - Team routes (CRUD operations, member management)
  - Issue routes (CRUD operations, comments, activity)
  - Project routes (CRUD operations, progress tracking)
  - Cycle routes (CRUD operations, issue management)
  - Label routes (CRUD operations)
  - Comment routes (update, delete, reactions)
  - Attachment routes (upload, delete)
  - Notification routes (list, mark read, archive)
  - Search routes (global search, issue search)
  - Activity routes (user feed, workspace feed)

- [x] **Phase 3.3: Business Logic Services** ✅
  - Issue service (create, update, filter, reorder, activity tracking)
  - Project service (progress calculation, statistics)
  - Cycle service (active cycles, progress tracking)
  - Notification service (creation, mentions, assignments)
  - Activity service (logging, feed generation)

- [x] **Phase 3.4: WebSocket Real-time Updates** ✅
  - WebSocket server integration with Hono
  - Room-based pub/sub (workspace, team, issue, project, cycle, user)
  - Event broadcasting (issue updates, comments, status changes)
  - Client connection management
  - Rate limiting for WebSocket messages
  - Heartbeat/ping mechanism
  - Type-safe event payloads

- [x] **Phase 3.5: Middleware Layer** ✅
  - CORS middleware (environment-aware, multiple strategies)
  - Validation middleware (type-safe Zod validation)
  - Rate limiting middleware (in-memory, multiple strategies)
  - Auth middleware (JWT verification)
  - Error handler (global error handling)

- [x] **Phase 3.6: Environment Configuration** ✅
  - Comprehensive .env.example with documentation
  - Required variables (DATABASE_URL, JWT_SECRET, etc.)
  - Optional configurations (rate limiting, email, Redis, logging, feature flags)

See [PHASE2_COMPLETE.md](./PHASE2_COMPLETE.md) for database details.

**Phase 4: Frontend Development (Partial)** 🔄

- [x] **Phase 4.1**: Linear-inspired design system with Tailwind CSS v4
  - Complete design tokens (colors, typography, spacing, animations)
  - Dark/light theme support with CSS variables
  - Linear-inspired color palette and priority colors
- [x] **Phase 4.2**: Base UI components with Radix UI
  - 8 components complete: Button, Input, Dialog, Avatar, Badge, Tooltip, Textarea
  - Zustand state management stores (auth, workspace, team, issue, UI)
  - TypeScript type definitions for all entities
  - Utility functions (cn, formatDate, debounce, getInitials)
- [x] **Phase 4.3**: Core layouts with App Router
  - Root layout with Inter font, ThemeProvider, SEO metadata
  - Authentication layout with centered card design
  - Main app layout with sidebar + top navigation structure
  - Prepared for command palette and notifications integration
- [x] **Phase 4.5**: Main App Navigation ✅
  - Sidebar with workspace/team switcher, navigation links, collapsible state
  - TopNav with breadcrumb, search trigger, notifications, user menu
- [x] **Phase 4.7**: Issue Management Pages ✅ (100% Complete)
  - **3 Pages (702 lines total)**:
    - `issues/page.tsx` (153 lines) - List view with 7-column table, filters, client-side filtering
    - `issues/board/page.tsx` (260 lines) - Kanban board with drag-and-drop, 5 status columns
    - `issue/[issueId]/page.tsx` (289 lines) - Detail page with inline editing, property sidebar
  - **5 Components (440+ lines total)**:
    - `IssueCard.tsx` (89 lines) - Compact card for board view with labels, avatars
    - `IssueRow.tsx` (126 lines) - Table row for list view with 7 columns
    - `IssueFilters.tsx` (120 lines) - Filter panel with active badges, clear all
    - `IssuePriorityIcon.tsx` (65 lines) - Priority indicators with Linear-style icons
    - `IssueStatusBadge.tsx` (58 lines) - Status badges with color coding
  - **Dependencies**: @dnd-kit/core, @dnd-kit/sortable, react-markdown, date-fns
  - **Total**: ~900 lines of production-ready code
- [x] **Phase 4.8**: Issue Form Component ✅ (100% Complete)
  - **IssueForm Component (386 lines)**:
    - Create/edit issue modal with React Hook Form + Zod validation
    - All 10 issue properties: title, description, status, priority, assignee, project, cycle, due date, estimate, labels
    - Keyboard shortcut: Cmd/Ctrl+Enter to submit
    - Error handling, form reset, type-safe interfaces
    - Create vs Edit modes with conditional rendering
  - **Select Component (160 lines)**:
    - Radix UI Select dropdown wrapper
    - Accessible dropdown with proper keyboard navigation
    - Custom Tailwind CSS styling matching design system
  - **Dependencies**: react-hook-form@^7.54.2, @hookform/resolvers@^3.9.1, @radix-ui/react-select@^2.1.4
  - **Total**: ~546 lines of production-ready code
- [x] **Phase 4.9**: Project Management ✅ (100% Complete)
  - **Project Store (144 lines)**:
    - Zustand store with Map-based state management
    - CRUD operations (setProjects, addProject, updateProject, removeProject, archiveProject)
    - Active project state and loading state tracking
    - Selector hooks: useProjects, useProject, useProjectsByTeam, useActiveProject
    - Redux DevTools integration
  - **Projects List Page (237 lines)**:
    - Grid view with ProjectCard components
    - Status filter tabs (all, planned, in_progress, completed, cancelled)
    - Create project button with modal
    - Mock data for development (3 sample projects)
    - Empty states
  - **Project Detail Page (262 lines)**:
    - Project header with color indicator, status badge, metadata
    - Progress ring visualization (SVG with dasharray for percentage)
    - Stats dashboard (5 columns: total, backlog, todo, in_progress, done)
    - Issues grouped by status
    - Activity feed placeholder UI
    - Edit project button
  - **ProjectCard Component (145 lines)**:
    - Color-coded border matching project color
    - SVG progress ring with percentage overlay
    - Status badge, target date, lead avatar
    - Quick stats placeholders (issues count)
    - Hover effects and transitions
  - **ProjectForm Component (362 lines)**:
    - React Hook Form + Zod validation
    - All 7 project fields: name, description, status, startDate, targetDate, leadId, color
    - 14-color picker with predefined hex values
    - Keyboard shortcut: Cmd/Ctrl+Enter to submit
    - Create vs Edit modes
    - Semantic HTML (fieldset/legend for color picker)
  - **Dependencies**: React Hook Form, Zod, Zustand, Radix UI (Avatar, Badge, Button, Dialog)
  - **Total**: ~1,150 lines of production-ready code
- [x] **Phase 4.10**: Cycle Management ✅ (100% Complete)
  - **Cycle Store (180 lines)**:
    - Zustand store with Map-based state management
    - CRUD operations (setCycles, addCycle, updateCycle, removeCycle)
    - Utility functions: getActiveCycles, getUpcomingCycles, getPastCycles, calculateCycleProgress, getCycleDaysRemaining
    - Active cycle state and loading state tracking
    - Selector hooks: useCycles, useCycle, useCyclesByTeam, useActiveCycle
    - Redux DevTools integration
  - **Cycles List Page (240 lines)**:
    - Grid view with CycleCard components (sm:grid-cols-2, lg:grid-cols-3)
    - 4 filter tabs with counts: all, active, upcoming, past
    - Create cycle button with modal
    - Mock data for development (3 sample cycles: Sprint 1 active, Sprint 2 upcoming, Q4 2024 past)
    - Empty states per filter with contextual messages
    - Client-side filtering using utility functions
  - **Cycle Detail Page (268 lines)**:
    - Cycle header with name, status badge, dates, days remaining
    - Back button navigation
    - Progress section: Time Progress (cycle duration) + Issue Completion (done/total)
    - Stats dashboard (5 columns: total, backlog, todo, in_progress, done)
    - Issues grouped by status (reuses IssueRow components)
    - Activity feed placeholder
    - Edit cycle button
  - **CycleCard Component (128 lines)**:
    - Time-based progress bar (only for active cycles)
    - Status badge (active/upcoming/past)
    - Date range with Calendar icon
    - Days remaining indicator with TrendingUp icon (color-coded)
    - Quick stats placeholders (issues count)
    - Hover effects: scale-[1.02], shadow-lg
  - **CycleForm Component (233 lines)**:
    - React Hook Form + Zod validation
    - All 4 cycle fields: name, description, startDate, endDate
    - Custom validation: endDate must be after startDate
    - Auto-suggested name in create mode: "Sprint {number}"
    - Cycle number display in create mode
    - Keyboard shortcut: Cmd/Ctrl+Enter to submit
    - Create vs Edit modes
  - **Dependencies**: React Hook Form, Zod, Zustand, Radix UI (Badge, Button, Dialog), Lucide React (Calendar, TrendingUp)
  - **Total**: ~1,049 lines of production-ready code
- [ ] Complete remaining UI components (DropdownMenu, Popover, Checkbox, RadioGroup)
- [ ] Authentication pages (Phase 4.4)
- [ ] Command Palette (Phase 4.6)

See sections 4.1, 4.2, and 4.3 in [AGENTS.md](./AGENTS.md) for completed features.

### 🔄 In Progress

**Phase 4: Frontend Development** (85% Complete)
- [x] Design system and UI components (Phase 4.1-4.3)
- [x] Main app navigation (Phase 4.5)
- [x] Issue management pages (Phase 4.7) ✅
- [x] Issue form component (Phase 4.8) ✅
- [x] Project management (Phase 4.9) ✅
- [x] Cycle management (Phase 4.10) ✅
- [ ] Authentication pages (Phase 4.4)
- [ ] Command palette (Phase 4.6)
- [ ] Cycle management (Phase 4.10)
- [ ] Comments system (Phase 4.11)
- [ ] Notification system (Phase 4.12)

**Phase 3: Backend API** (60% Complete)
- [x] Authentication system (Phase 3.1) ✅
- [x] API route handlers (Phase 3.2) ✅
- [x] Business logic services (Phase 3.3) ✅
- [x] WebSocket real-time updates (Phase 3.4) ✅
- [x] Middleware layer (Phase 3.5) ✅
- [x] Environment configuration (Phase 3.6) ✅
- [ ] Route integration testing (Phase 3.7)
- [ ] Comprehensive test coverage (Phase 3.8)

### 📋 Planned

- [ ] **Phase 4**: Frontend development (Next.js)
  - Design system and UI components
  - Authentication pages
  - Issue management views (list, board, detail)
  - Project and cycle management
  - Command palette
  - Real-time synchronization
- [ ] **Phase 5**: Comprehensive testing
- [ ] **Phase 6**: Performance optimization
- [ ] **Phase 7**: Documentation

## 🤝 Contributing

1. Follow the code quality guidelines in `.github/copilot-instructions.md`
2. Use Biome.js for formatting: `npm run lint:fix`
3. Write tests for all new features
4. Maintain 80%+ test coverage
5. Follow clean architecture principles

## 📝 Scripts Reference

| Command                 | Description                        |
| ----------------------- | ---------------------------------- |
| `npm run dev`           | Start all apps in development mode |
| `npm run build`         | Build all apps and packages        |
| `npm run lint`          | Lint all code with Biome.js        |
| `npm run lint:fix`      | Lint and auto-fix issues           |
| `npm run format`        | Format all code with Biome.js      |
| `npm run test`          | Run all tests                      |
| `npm run test:watch`    | Run tests in watch mode            |
| `npm run test:coverage` | Run tests with coverage            |
| `npm run check-types`   | Type check all packages            |

## 🔗 Useful Links

- [Turborepo Docs](https://turborepo.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Hono.js Docs](https://hono.dev/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Biome.js Docs](https://biomejs.dev/)
- [Vitest Docs](https://vitest.dev/)

---

**Built with ❤️ following Principal Engineer best practices**
