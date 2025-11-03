# Linear Clone# Linear Clone



> A production-ready, high-fidelity clone of Linear.app built with modern fullstack technologies.> A production-ready, high-fidelity clone of Linear.app built with modern fullstack technologies.



[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)

[![Hono](https://img.shields.io/badge/Hono-4.6-orange)](https://hono.dev/)[![Hono](https://img.shields.io/badge/Hono-4.6-orange)](https://hono.dev/)

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)](https://www.postgresql.org/)[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)](https://www.postgresql.org/)



A fullstack project management application replicating Linear.app's core features with real-time collaboration, issue tracking, and team management.A fullstack project management application replicating Linear.app's core features with real-time collaboration, issue tracking, and team management.



## ✨ Features## ✨ Features



- 🔐 **Authentication** - JWT-based auth with Bcrypt password hashing- 🔐 **Authentication** - JWT-based auth with Bcrypt password hashing

- 📊 **Issue Tracking** - List view, Kanban board, and detailed issue pages- 📊 **Issue Tracking** - List view, Kanban board, and detailed issue pages

- 🎨 **Modern UI** - Linear-inspired design with dark/light themes- 🎨 **Modern UI** - Linear-inspired design with dark/light themes

- ⚡ **Real-time Updates** - WebSocket-based live collaboration- ⚡ **Real-time Updates** - WebSocket-based live collaboration

- ⌨️ **Keyboard Shortcuts** - Command palette (⌘K) and global shortcuts- ⌨️ **Keyboard Shortcuts** - Command palette (⌘K) and global shortcuts

- 🏢 **Team Management** - Multi-workspace and team support- 🏢 **Team Management** - Multi-workspace and team support

- 📱 **Responsive Design** - Works on desktop, tablet, and mobile- 📱 **Responsive Design** - Works on desktop, tablet, and mobile



## 🚀 Quick Start## 🚀 Quick Start



### Prerequisites### Prerequisites



- Node.js 18+- Node.js 18+

- PostgreSQL 14+- PostgreSQL 14+

- npm 11.6.2- npm 11.6.2



### Installation### Installation



```bash```bash

# Clone repository# Clone repository

git clone <your-repo-url>git clone <your-repo-url>

cd linear-clonecd linear-clone



# Install dependencies# Install dependencies

npm installnpm install



# Setup environment variables# Setup environment variables

cp apps/api/.env.example apps/api/.envcp apps/api/.env.example apps/api/.env

cp packages/database/.env.example packages/database/.envcp packages/database/.env.example packages/database/.env

# Edit .env files with your database credentials

# Create database

# Create databasecreatedb linear_clone

createdb linear_clone

# Run migrations

# Run migrationscd packages/database && npm run db:migrate && cd ../..

cd packages/database && npm run db:migrate && cd ../..

# Start development servers

# Start development serversnpm run dev

npm run dev```

```

Visit **http://localhost:3000** to see the app.

Visit **http://localhost:3000** to see the app.

## 📚 Documentation

## 📚 Documentation

- **[PROJECT.md](./PROJECT.md)** - Complete project documentation

- **[PROJECT.md](./PROJECT.md)** - Complete project documentation- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide- **[AGENTS.md](./AGENTS.md)** - Implementation guide and roadmap

- **[AGENTS.md](./AGENTS.md)** - Implementation guide and roadmap- **[docs/guides/](./docs/guides/)** - User guides and tutorials

- **[docs/guides/](./docs/guides/)** - User guides and tutorials

## �️ Technology Stack

## 🛠️ Technology Stack

### Core Technologies

| Category | Technology |- **Package Manager**: npm 11.6.2

|----------|-----------|- **Build System**: Turborepo 2.3.0

| **Frontend** | Next.js 16, React 19, Tailwind CSS 4, Radix UI |- **Frontend**: Next.js 16.0.1 with React 19.2.0 (App Router)

| **Backend** | Hono.js 4.6, Node.js 18+ |- **Backend**: Hono.js 4.6.11

| **Database** | PostgreSQL 14+, Drizzle ORM |- **Database**: PostgreSQL with Drizzle ORM 0.44.7

| **Auth** | JWT, Bcrypt |- **Styling**: Tailwind CSS 4.1.16 (v4 - CSS-first architecture)

| **Real-time** | WebSockets (ws) |- **Code Quality**: Biome.js 1.9.4 (root) + 2.2.0 (web)

| **State** | Zustand |- **Testing**: Vitest 2.1.9

| **Validation** | Zod |- **TypeScript**: 5.6.3

| **Build** | Turborepo |

| **Code Quality** | Biome.js, TypeScript 5.6 |### Backend Stack ✅ Implemented

| **Testing** | Vitest |- **Auth**: JWT tokens + Bcrypt password hashing

- **Validation**: Zod 3.23.8 (schema validation)

## 📁 Project Structure- **Real-time**: WebSockets (ws 8.18.0)

- **Middleware**: CORS, validation, rate limiting, auth, error handling

```

linear-clone/### Frontend Stack ✅ Implemented

├── apps/- **UI Components**: Radix UI (Select, Dialog, DropdownMenu, Avatar, Popover, etc.)

│   ├── web/                 # Next.js frontend (port 3000)- **State Management**: Zustand 4.5.0 (authStore, workspaceStore, teamStore, uiStore)

│   └── api/                 # Hono.js backend (port 3001)- **Command Palette**: cmdk 1.1.1 (global search and quick actions)

├── packages/- **Forms**: React Hook Form + Zod (authentication forms)

│   ├── database/            # Drizzle ORM schemas & migrations- **Icons**: Lucide React 0.552.0 (consistent iconography)

│   ├── ui/                  # Shared React components- **Date Handling**: date-fns 2.30.0

│   └── typescript-config/   # Shared TypeScript configs

├── docs/                    # Documentation## 📁 Project Structure

├── scripts/                 # Utility scripts

├── docker-compose.yml       # Docker configuration```

├── PROJECT.md               # Detailed documentationlinear-clone/

└── DEPLOYMENT.md            # Deployment guide├── apps/

```│   ├── web/                 # Next.js frontend (port 3000)

│   └── api/                 # Hono.js backend (port 3001)

## 🔧 Development├── packages/

│   ├── database/            # Drizzle ORM schemas & migrations

```bash│   ├── ui/                  # Shared React components

# Start all apps│   └── typescript-config/   # Shared TypeScript configs

npm run dev├── biome.json               # Biome.js configuration

├── turbo.json               # Turborepo pipeline config

# Start specific app└── vitest.config.ts         # Root Vitest config

npx turbo dev --filter=web```

npx turbo dev --filter=api

## 🛠️ Setup Instructions

# Build all apps

npm run build### Prerequisites



# Run tests- Node.js 18+ installed

npm run test- PostgreSQL 14+ installed and running

- npm 11.6.2

# Lint and format

npm run lint:fix### Installation

npm run format

1. **Clone the repository**

# Type check

npm run check-types   ```bash

```   git clone <your-repo-url>

   cd linear-clone

## 🗄️ Database   ```



```bash2. **Install dependencies**

cd packages/database

   ```bash

# Generate migration   npm install

npm run db:generate   ```



# Run migrations3. **Setup environment variables**

npm run db:migrate

   For the API:

# Open Drizzle Studio (GUI)

npm run db:studio   ```bash

```   cd apps/api

   cp .env.example .env

## 🐳 Docker Deployment   # Edit .env with your database credentials

   ```

```bash

# Copy and configure environment   For the database:

cp .env.docker.example .env

# Edit .env with production values   ```bash

   cd packages/database

# Build and start services   cp .env.example .env

docker-compose up -d   # Edit .env with your database credentials

   ```

# Run migrations

docker-compose exec api sh -c "cd packages/database && npm run db:migrate"4. **Create the database**



# View logs   ```sql

docker-compose logs -f   CREATE DATABASE linear_clone;

```   ```



Services:5. **Run database migrations** (when schemas are created)

- Frontend: http://localhost:3000   ```bash

- Backend: http://localhost:3001   cd packages/database

- PostgreSQL: localhost:5432   npm run db:generate

   npm run db:migrate

## 📦 API Endpoints   ```



Base URL: `http://localhost:3001/api/v1`## 🚦 Development



### Authentication### Start all apps

- `POST /auth/register` - Register new user

- `POST /auth/login` - Login user```bash

- `POST /auth/logout` - Logout usernpm run dev

- `GET /auth/me` - Get current user```



### IssuesThis starts:

- `GET /teams/:teamId/issues` - List issues

- `POST /teams/:teamId/issues` - Create issue- Frontend (Next.js) at http://localhost:3000

- `GET /issues/:id` - Get issue- Backend (Hono.js) at http://localhost:3001

- `PATCH /issues/:id` - Update issue

- `DELETE /issues/:id` - Delete issue### Start specific app



See [PROJECT.md](./PROJECT.md#api-reference) for complete API documentation.```bash

# Frontend only

## 🧪 Testingnpx turbo dev --filter=web



```bash# Backend only

# Run all testsnpx turbo dev --filter=api

npm run test```



# Watch mode## 🧪 Testing

npm run test:watch

```bash

# Coverage report# Run all tests

npm run test:coveragenpm run test



# Test specific package# Run tests in watch mode

npx turbo test --filter=apinpm run test:watch

```

# Run tests with coverage

## 🚢 Production Deploymentnpm run test:coverage



See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.# Run tests for specific package

npx turbo test --filter=web

**Quick checklist:**npx turbo test --filter=api

- [ ] Set production `DATABASE_URL````

- [ ] Set strong `JWT_SECRET` (32+ characters)

- [ ] Configure `FRONTEND_URL` and `CORS`## 🎨 Code Quality

- [ ] Run database migrations

- [ ] Build applications```bash

- [ ] Setup SSL/TLS certificates# Lint all code

- [ ] Configure monitoring and loggingnpm run lint



## 🤝 Contributing# Lint and auto-fix

npm run lint:fix

1. Fork the repository

2. Create a feature branch: `git checkout -b feature/your-feature`# Format all code

3. Commit changes: `git commit -m 'feat: add feature'`npm run format

4. Push to branch: `git push origin feature/your-feature`

5. Create a Pull Request# Type check all packages

npm run check-types

**Code quality:**```

- Follow Biome.js formatting

- Write tests for new features## 🏗️ Build

- Maintain 80%+ test coverage

- Use TypeScript strict mode```bash

# Build all apps and packages

## 📜 Scripts Referencenpm run build



| Command | Description |# Build specific app

|---------|-------------|npx turbo build --filter=web

| `npm run dev` | Start all apps in dev mode |npx turbo build --filter=api

| `npm run build` | Build all apps |```

| `npm run lint` | Lint all code |

| `npm run lint:fix` | Lint and auto-fix |## 📦 Packages

| `npm run format` | Format all code |

| `npm run test` | Run all tests |### Apps

| `npm run check-types` | Type check all packages |

- **web**: Next.js frontend application with App Router, Tailwind CSS, and Radix UI

## 🔗 Resources- **api**: Hono.js backend with clean architecture (routes → services → database)



- [Next.js Documentation](https://nextjs.org/docs)### Packages

- [Hono.js Documentation](https://hono.dev/)

- [Drizzle ORM Documentation](https://orm.drizzle.team/)- **@repo/database**: Drizzle ORM schema definitions and database client

- [Turborepo Documentation](https://turborepo.com/docs)- **@repo/ui**: Shared React component library

- [Radix UI Documentation](https://www.radix-ui.com/)- **@repo/typescript-config**: Shared TypeScript configurations



## 📄 License## 🗄️ Database Commands



This project is for educational purposes. Linear is a trademark of Linear Orbit, Inc.```bash

cd packages/database

---

# Generate migrations from schema

**Built with ❤️ following Principal Engineer best practices**npm run db:generate


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
- [ ] Complete remaining UI components (DropdownMenu, Popover, Checkbox, RadioGroup)
- [ ] Authentication pages (Phase 4.4)
- [ ] Command Palette (Phase 4.6)

See sections 4.1, 4.2, and 4.3 in [AGENTS.md](./AGENTS.md) for completed features.

- [x] **Phase 3.7: HTTP Body Parsing** ✅
  - Fixed POST/PUT/PATCH request body reading
  - Proper body forwarding to Hono.js
  - All routes tested and working

**Phase 4: Frontend Development** (78% Complete)
- [x] Design system and UI components (Phase 4.1-4.3)
- [x] Main app navigation (Phase 4.5)
- [x] Issue management pages (Phase 4.7) ✅
- [x] Issue form component (Phase 4.8) ✅
- [ ] Authentication pages (Phase 4.4)
- [ ] Command palette (Phase 4.6)
- [ ] Project management (Phase 4.9)
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

- [x] **Phase 4.1-4.4: Frontend Authentication** ✅ (100% Complete)
  - Design system (Tailwind v4, UI components)
  - State management (Zustand + Better Auth integration)
  - Core layouts (auth + root layouts)
  - Authentication pages:
    - Login with email validation & user-friendly errors
    - Register with real-time password validation
    - Password strength indicator & requirement checklist
    - Protected dashboard page
    - Landing page integration (header buttons)
    - Comprehensive edge case handling

### � Next Steps (Recommended Implementation Order)

#### 🎯 Immediate Priority (Phase 4.5-4.6)

**1. Workspace Management** (1-2 days)
- Create workspace creation page (`/workspace/new`)
- List user workspaces (`/workspaces`)
- Workspace switcher in sidebar
- Connect to `/api/v1/workspaces` endpoints

**2. Main App Navigation** (2-3 days)
- Sidebar component with sections:
  - Workspace/team switcher dropdown
  - My Issues, Inbox navigation links
  - Projects list, Cycles list
  - Settings link
- Top navigation bar:
  - Breadcrumb navigation
  - Search trigger (⌘K button)
  - Notifications bell icon
  - User profile dropdown with logout
- Responsive sidebar (collapsible on mobile)

**3. Command Palette (⌘K)** (2-3 days)
- Global command menu triggered by ⌘K/Ctrl+K
- Fuzzy search for:
  - Issues (by ID or title)
  - Projects, Cycles
  - Users
  - Quick actions (Create Issue, New Project)
- Keyboard navigation (up/down/enter/esc)
- Recent searches persistence

#### 📊 Short Term (Phase 4.7-4.10) - 1-2 weeks

**4. Issue List View** (3-4 days)
- Table layout with columns: ID, Title, Status, Priority, Assignee, Labels, Due Date
- Inline editing capabilities (click to edit status/priority)
- Filters panel (status, priority, assignee, labels, date range)
- Sorting by any column
- Bulk selection and actions
- Keyboard shortcuts (c for create, e for edit)

**5. Issue Board View (Kanban)** (3-4 days)
- Drag-and-drop between status columns using @dnd-kit
- Group by status (Backlog, Todo, In Progress, Done, Cancelled)
- Real-time updates via WebSocket
- Smooth animations for card movements
- Issue cards with priority icons, assignee avatars, labels

**6. Issue Detail Page** (4-5 days)
- Full issue view at `/issue/[id]`
- Editable title (inline editing)
- Markdown description editor with preview
- Property panel:
  - Status dropdown, Priority selector
  - Assignee picker, Labels multi-select
  - Project dropdown, Cycle dropdown
  - Due date picker, Estimate input
- Comments section with threading
- Activity timeline showing all changes
- Attachments section (upload/download)

**7. Project Management** (2-3 days)
- Projects list/grid view (`/team/[id]/projects`)
- Project detail page with:
  - Editable name, description, status
  - Progress ring visualization
  - Issues grouped by status
  - Project stats (total issues, completed, etc.)
- Create/edit project modal with color picker

#### 🚀 Medium Term (Phase 4.11+) - 2-3 weeks

**8. Cycle Management** (2-3 days)
- Cycles list (active, upcoming, past)
- Cycle detail page with:
  - Timeline visualization
  - Issues in cycle
  - Simple burndown chart
  - Cycle stats and progress
- Create cycle modal with date range picker
- Auto-generate cycle numbers

**9. Team Management** (2 days)
- Team settings page
- Member management (add/remove members)
- Team identifier configuration
- Archive team functionality

**10. Search Functionality** (2 days)
- Global search dialog (from command palette)
- Search with filters (type, team, date)
- Results grouped by type
- Keyword highlighting

**11. Notification System** (2-3 days)
- Notification popover from top nav
- List recent notifications
- Mark as read/unread
- Group by date
- Notification preferences page

**12. Activity Feed** (1-2 days)
- User activity page (`/activity`)
- Filter by: all, assigned to me, mentions, created by me
- Group by date
- Infinite scroll pagination

### 📋 Later Phases

- [ ] **Phase 5**: Comprehensive testing (unit, integration, E2E)
- [ ] **Phase 6**: Performance optimization (bundle analysis, caching)
- [ ] **Phase 7**: Documentation (API docs, architecture diagrams)

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
