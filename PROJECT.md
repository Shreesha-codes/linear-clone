# Linear Clone - Project Documentation

> A production-ready, high-fidelity clone of Linear.app built with modern fullstack technologies.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Database](#database)
- [API Reference](#api-reference)
- [Frontend Guide](#frontend-guide)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Overview

Linear Clone is a fullstack project management application that replicates the core functionality of Linear.app, featuring:

- **Real-time Collaboration**: WebSocket-based live updates across all clients
- **Issue Tracking**: Complete issue lifecycle with status, priority, labels, and assignments
- **Project Management**: Projects and cycles (sprints) with progress tracking
- **Team Workspace**: Multi-workspace and team management
- **Command Palette**: Global keyboard-driven navigation (⌘K)
- **Modern UX**: Linear-inspired design with smooth animations and dark/light themes

### Current Status

**Production-Ready Features:**
- ✅ Authentication system (JWT + Bcrypt)
- ✅ Complete database schema (16 tables)
- ✅ REST API with 11 route groups
- ✅ WebSocket real-time updates
- ✅ Frontend auth pages with validation
- ✅ Main app navigation (sidebar + top nav)
- ✅ Issue management (list, board, detail, form)
- ✅ Design system and UI components

**In Development:**
- 🔄 Project management pages
- 🔄 Cycle management pages
- 🔄 Comments system
- 🔄 Notification system

---

## Architecture

### Clean Architecture Principles

The project follows **clean architecture** with strict separation of concerns:

```
┌─────────────────────────────────────────┐
│          Frontend (Next.js)              │
│  ┌─────────┐  ┌──────────┐  ┌────────┐ │
│  │  Pages  │→ │Components│→ │ Stores │ │
│  └─────────┘  └──────────┘  └────────┘ │
└──────────────────┬──────────────────────┘
                   │ HTTP/WebSocket
┌──────────────────▼──────────────────────┐
│          Backend (Hono.js)               │
│  ┌────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Routes │→ │ Services │→ │Database │ │
│  └────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────┘
```

**Backend Layers:**
1. **Routes** (`apps/api/src/routes/`): HTTP handlers, request validation, response formatting
2. **Services** (`apps/api/src/services/`): Business logic, orchestration, no HTTP knowledge
3. **Database** (`packages/database/`): Data access, Drizzle ORM, migrations

**Frontend Layers:**
1. **Pages** (`apps/web/app/`): Next.js App Router pages and layouts
2. **Components** (`apps/web/components/`): Reusable React components
3. **Stores** (`apps/web/stores/`): Zustand state management
4. **API Client** (`apps/web/lib/api/`): Type-safe API communication

### Monorepo Structure

Built with **Turborepo** for efficient builds and caching:

- **apps/web**: Next.js frontend (port 3000)
- **apps/api**: Hono.js backend (port 3001)
- **packages/database**: Shared database schemas and migrations
- **packages/ui**: Shared React component library
- **packages/typescript-config**: Shared TypeScript configurations

---

## Technology Stack

### Core Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Package Manager** | npm | 11.6.2 | Workspace management |
| **Build System** | Turborepo | 2.3.0 | Monorepo orchestration |
| **Runtime** | Node.js | 18+ | JavaScript runtime |
| **Language** | TypeScript | 5.6.3 | Type safety |

### Backend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Framework** | Hono.js | 4.6.11 | Lightweight web framework |
| **Database** | PostgreSQL | 14+ | Relational database |
| **ORM** | Drizzle ORM | 0.44.7 | Type-safe database client |
| **Auth** | JWT + Bcrypt | - | Authentication |
| **Validation** | Zod | 3.23.8 | Schema validation |
| **WebSocket** | ws | 8.18.0 | Real-time updates |
| **Testing** | Vitest | 2.1.9 | Unit/integration tests |

### Frontend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Framework** | Next.js | 16.0.1 | React framework |
| **React** | React | 19.2.0 | UI library |
| **Styling** | Tailwind CSS | 4.1.16 | Utility-first CSS |
| **UI Components** | Radix UI | - | Accessible primitives |
| **State Management** | Zustand | 4.5.0 | Global state |
| **Forms** | React Hook Form | 7.54.2 | Form handling |
| **Validation** | Zod | 3.23.8 | Schema validation |
| **Icons** | Lucide React | 0.552.0 | Icon library |
| **Command Palette** | cmdk | 1.1.1 | Keyboard navigation |
| **Drag & Drop** | @dnd-kit | - | Kanban board |
| **Markdown** | react-markdown | - | Rich text rendering |

### Code Quality & Tooling

| Tool | Version | Purpose |
|------|---------|---------|
| **Linter/Formatter** | Biome.js | 1.9.4 | Fast code quality |
| **Testing** | Vitest | 2.1.9 | Test runner |
| **Git Hooks** | Husky | - | Pre-commit validation |

---

## Project Structure

```
linear-clone/
├── apps/
│   ├── web/                      # Next.js Frontend (Port 3000)
│   │   ├── app/                  # App Router pages
│   │   │   ├── (auth)/          # Auth pages (login, register)
│   │   │   ├── (app)/           # Main app pages
│   │   │   ├── layout.tsx       # Root layout
│   │   │   └── page.tsx         # Landing page
│   │   ├── components/           # React components
│   │   │   ├── ui/              # Base UI components
│   │   │   ├── layout/          # Layout components
│   │   │   └── issues/          # Issue-specific components
│   │   ├── stores/               # Zustand stores
│   │   ├── lib/                  # Utilities and helpers
│   │   ├── hooks/                # Custom React hooks
│   │   └── types/                # TypeScript types
│   │
│   └── api/                      # Hono.js Backend (Port 3001)
│       ├── src/
│       │   ├── routes/          # API route handlers
│       │   ├── services/        # Business logic
│       │   ├── middleware/      # Auth, CORS, validation
│       │   ├── websocket/       # WebSocket handlers
│       │   └── types/           # TypeScript types
│       └── package.json
│
├── packages/
│   ├── database/                 # Database Package
│   │   ├── src/
│   │   │   ├── schema/          # Drizzle schema files
│   │   │   ├── client.ts        # DB connection
│   │   │   └── index.ts         # Exports
│   │   ├── migrations/          # SQL migrations
│   │   └── drizzle.config.ts    # Drizzle config
│   │
│   ├── ui/                       # Shared UI Components
│   │   └── src/                 # Component source
│   │
│   └── typescript-config/        # Shared TypeScript Configs
│       ├── base.json
│       ├── nextjs.json
│       └── react-library.json
│
├── docs/                         # Documentation
│   ├── guides/                  # User guides
│   └── development-logs/        # Phase completion reports
│
├── scripts/                      # Utility scripts
│   ├── demo.sh                  # Demo script
│   └── test-auth.ps1            # Auth testing script
│
├── .github/
│   └── copilot-instructions.md  # AI coding guidelines
│
├── biome.json                    # Biome.js config
├── turbo.json                    # Turborepo config
├── package.json                  # Root package.json
├── AGENTS.md                     # Implementation guide
├── README.md                     # Quick start guide
└── PROJECT.md                    # This file
```

---

## Getting Started

### Prerequisites

Before starting, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **PostgreSQL 14+** installed and running ([Download](https://www.postgresql.org/download/))
- **npm 11.6.2** (comes with Node.js)
- **Git** for version control

### Installation

**1. Clone the repository**

```bash
git clone <your-repo-url>
cd linear-clone
```

**2. Install dependencies**

```bash
npm install
```

This installs dependencies for all apps and packages in the monorepo.

**3. Setup environment variables**

Create `.env` files in the required locations:

```bash
# Backend API environment
cd apps/api
cp .env.example .env
```

Edit `apps/api/.env`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/linear_clone
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

```bash
# Database package environment
cd packages/database
cp .env.example .env
```

Edit `packages/database/.env`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/linear_clone
```

**4. Create the PostgreSQL database**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE linear_clone;

# Exit psql
\q
```

**5. Run database migrations**

```bash
cd packages/database
npm run db:migrate
```

This creates all 16 tables with proper indexes and constraints.

**6. Start development servers**

```bash
# From root directory
npm run dev
```

This starts:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

---

## Development

### Running the Project

**Start all apps in development mode:**

```bash
npm run dev
```

**Start specific app:**

```bash
# Frontend only
npx turbo dev --filter=web

# Backend only
npx turbo dev --filter=api
```

**Build for production:**

```bash
npm run build
```

### Code Quality

**Linting and Formatting:**

```bash
# Check code quality
npm run lint

# Auto-fix issues
npm run lint:fix

# Format code
npm run format
```

**Type Checking:**

```bash
npm run check-types
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all apps in dev mode |
| `npm run build` | Build all apps |
| `npm run lint` | Lint all code |
| `npm run lint:fix` | Lint and auto-fix |
| `npm run format` | Format all code |
| `npm run test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run check-types` | Type check all packages |

---

## Database

### Schema Overview

The database consists of **16 tables** with **133 columns** and **17 performance indexes**.

**Core Entities:**

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | User accounts | email, name, password_hash, avatar_url |
| `sessions` | JWT sessions | user_id, token, expires_at |
| `workspaces` | Team workspaces | name, slug, icon |
| `workspace_members` | Workspace access | workspace_id, user_id, role |
| `teams` | Teams within workspaces | workspace_id, name, identifier |
| `team_members` | Team membership | team_id, user_id |
| `projects` | Project containers | team_id, name, status, progress |
| `cycles` | Sprint cycles | team_id, name, start_date, end_date |
| `issues` | Core issue tracking | team_id, title, status, priority, assignee_id |
| `labels` | Issue labels | team_id, name, color |
| `issue_labels` | Issue-label junction | issue_id, label_id |
| `comments` | Issue comments | issue_id, user_id, body, parent_id |
| `comment_reactions` | Comment reactions | comment_id, user_id, emoji |
| `attachments` | File attachments | issue_id, filename, url, size |
| `activity_logs` | Audit trail | entity_type, entity_id, action, metadata |
| `notifications` | User notifications | user_id, type, entity_id, read |

### Database Commands

```bash
cd packages/database

# Generate migration from schema changes
npm run db:generate

# Run migrations
npm run db:migrate

# Push schema directly (dev only)
npm run db:push

# Open Drizzle Studio (GUI)
npm run db:studio
```

### Connection Pooling

Production-ready connection pool configuration:

```typescript
const pool = new Pool({
  max: 20,                      // Max connections
  idleTimeoutMillis: 30000,     // 30s idle timeout
  connectionTimeoutMillis: 2000 // 2s connection timeout
});
```

---

## API Reference

### Base URL

```
http://localhost:3001/api/v1
```

### Authentication

All protected routes require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

### Endpoints

#### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| POST | `/auth/logout` | Logout user |
| GET | `/auth/me` | Get current user |

#### Workspaces

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/workspaces` | List user workspaces |
| POST | `/workspaces` | Create workspace |
| GET | `/workspaces/:id` | Get workspace |
| PATCH | `/workspaces/:id` | Update workspace |
| DELETE | `/workspaces/:id` | Delete workspace |
| GET | `/workspaces/:id/members` | List members |
| POST | `/workspaces/:id/members` | Add member |
| DELETE | `/workspaces/:id/members/:userId` | Remove member |

#### Teams

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/workspaces/:workspaceId/teams` | List teams |
| POST | `/workspaces/:workspaceId/teams` | Create team |
| GET | `/teams/:id` | Get team |
| PATCH | `/teams/:id` | Update team |
| POST | `/teams/:id/archive` | Archive team |
| GET | `/teams/:id/members` | List members |
| POST | `/teams/:id/members` | Add member |
| DELETE | `/teams/:id/members/:userId` | Remove member |

#### Issues

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/teams/:teamId/issues` | List issues |
| POST | `/teams/:teamId/issues` | Create issue |
| GET | `/issues/:id` | Get issue |
| PATCH | `/issues/:id` | Update issue |
| DELETE | `/issues/:id` | Delete issue |
| POST | `/issues/:id/archive` | Archive issue |
| GET | `/issues/:id/comments` | Get comments |
| POST | `/issues/:id/comments` | Create comment |
| GET | `/issues/:id/activity` | Get activity |

#### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/teams/:teamId/projects` | List projects |
| POST | `/teams/:teamId/projects` | Create project |
| GET | `/projects/:id` | Get project |
| PATCH | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |
| GET | `/projects/:id/issues` | Get issues |
| GET | `/projects/:id/progress` | Get progress |

#### Cycles

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/teams/:teamId/cycles` | List cycles |
| POST | `/teams/:teamId/cycles` | Create cycle |
| GET | `/cycles/:id` | Get cycle |
| PATCH | `/cycles/:id` | Update cycle |
| DELETE | `/cycles/:id` | Delete cycle |
| GET | `/cycles/:id/issues` | Get issues |
| GET | `/cycles/:id/progress` | Get progress |

#### Labels

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/teams/:teamId/labels` | List labels |
| POST | `/teams/:teamId/labels` | Create label |
| PATCH | `/labels/:id` | Update label |
| DELETE | `/labels/:id` | Delete label |

#### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| PATCH | `/comments/:id` | Update comment |
| DELETE | `/comments/:id` | Delete comment |
| POST | `/comments/:id/reactions` | Add reaction |
| DELETE | `/comments/:id/reactions/:emoji` | Remove reaction |

#### Attachments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/attachments` | Upload file |
| DELETE | `/attachments/:id` | Delete file |

#### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | List notifications |
| PATCH | `/notifications/:id/read` | Mark as read |
| POST | `/notifications/read-all` | Mark all as read |
| PATCH | `/notifications/:id/archive` | Archive |

#### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/search` | Global search |
| GET | `/search/issues` | Search issues |

#### Activity

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/activity` | User activity feed |
| GET | `/workspaces/:id/activity` | Workspace activity |

### WebSocket Events

Connect to `ws://localhost:3001/ws`

**Client → Server:**

```json
{
  "type": "subscribe",
  "room": "workspace:<id>" | "team:<id>" | "issue:<id>"
}
```

**Server → Client:**

```json
{
  "type": "issue.updated" | "comment.created" | "status.changed",
  "payload": { /* entity data */ }
}
```

---

## Frontend Guide

### Routing

Built with **Next.js App Router**:

- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page
- `/issues/me` - My issues
- `/team/[teamId]/issues` - Team issues (list view)
- `/team/[teamId]/issues/board` - Kanban board
- `/team/[teamId]/issue/[issueId]` - Issue detail
- `/team/[teamId]/projects` - Projects
- `/team/[teamId]/cycles` - Cycles

### State Management

**Zustand stores** for global state:

```typescript
// Auth store
import { useAuthStore } from '@/stores/auth-store';

const { user, login, logout } = useAuthStore();

// Issue store
import { useIssueStore } from '@/stores/issue-store';

const { issues, updateIssue, filters } = useIssueStore();
```

### UI Components

Import from `@/components/ui/`:

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
```

### Keyboard Shortcuts

- `⌘K` / `Ctrl+K` - Command palette
- `C` - Create issue
- `/` - Focus search
- `?` - Show shortcuts
- `Esc` - Close modals

---

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Test specific package
npx turbo test --filter=api
npx turbo test --filter=web
```

### Test Structure

```
apps/api/src/__tests__/        # Backend tests
apps/web/src/__tests__/         # Frontend tests
packages/database/src/__tests__/ # Database tests
```

### Writing Tests

**Backend (Vitest):**

```typescript
import { describe, it, expect } from 'vitest';

describe('issueService', () => {
  it('should create issue with identifier', async () => {
    const issue = await issueService.create({...});
    expect(issue.identifier).toMatch(/^[A-Z]+-\d+$/);
  });
});
```

**Frontend (Vitest + React Testing Library):**

```typescript
import { render, screen } from '@testing-library/react';

it('renders button', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete production deployment guide.

### Quick Production Checklist

- [ ] Set production `DATABASE_URL`
- [ ] Set strong `JWT_SECRET` (minimum 32 characters)
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS with production `FRONTEND_URL`
- [ ] Run database migrations
- [ ] Build apps: `npm run build`
- [ ] Setup reverse proxy (Nginx)
- [ ] Configure SSL/TLS certificates
- [ ] Setup monitoring and logging
- [ ] Configure backups

### Docker Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

See `docker-compose.yml` and `Dockerfile` for configuration.

---

## Contributing

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Run quality checks**
   ```bash
   npm run lint:fix
   npm run test
   npm run check-types
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

- Follow **Biome.js** formatting (2 spaces, semicolons, single quotes)
- Use **TypeScript strict mode** (no `any` types)
- Write **comprehensive tests** (80%+ coverage target)
- Follow **clean architecture** principles
- Use **semantic commit messages**

### Commit Message Format

```
type(scope): description

feat: add new feature
fix: fix bug
refactor: refactor code
test: add tests
docs: update documentation
```

---

## Resources

### Documentation

- [AGENTS.md](./AGENTS.md) - Complete implementation guide
- [.github/copilot-instructions.md](./.github/copilot-instructions.md) - Coding guidelines
- [packages/database/README.md](./packages/database/README.md) - Database documentation
- [docs/guides/](./docs/guides/) - User guides
- [docs/development-logs/](./docs/development-logs/) - Phase completion reports

### External Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Hono.js Documentation](https://hono.dev/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Turborepo Documentation](https://turborepo.com/docs)
- [Biome.js Documentation](https://biomejs.dev/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## License

This project is for educational purposes. Linear is a trademark of Linear Orbit, Inc.

---

**Built with ❤️ following Principal Engineer best practices**
