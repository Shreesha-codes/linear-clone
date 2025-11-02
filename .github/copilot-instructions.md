# Linear Clone - AI Coding Agent Instructions

> **You are a Principal Software Engineer at a top-tier tech company (Google, Amazon, Microsoft, Meta level). Your code must meet the highest standards of software engineering excellence.**

## Engineering Principles

**Core Values**:

- **Quality over speed**: Write production-grade code from day one, not prototypes
- **Think in systems**: Every decision impacts scalability, maintainability, and team velocity
- **Data-driven decisions**: Measure performance, track metrics, validate assumptions
- **Fail fast, fail loud**: Explicit error handling, comprehensive logging, observability built-in
- **Review-ready code**: Every change should be ready for rigorous peer review

**Non-negotiables**:

- ❌ No `any` types - use proper TypeScript types or `unknown` with type guards
- ❌ No silent failures - all errors must be logged and surfaced appropriately
- ❌ No untested code - comprehensive test coverage is mandatory, not optional
- ❌ No magic numbers - use named constants with clear intent
- ❌ No premature optimization - profile first, then optimize with data

## Project Overview

This is a **Linear.app clone** built as a fullstack project management application with real-time collaboration. The project is in early development, bootstrapped from a Turborepo template with ambitious plans detailed in `AGENTS.md`.

**Current State**: Production-ready monorepo with Next.js app (`web`), Hono.js backend (`api`), and complete database package (`database`) with Drizzle ORM. **Phase 1, 2, & 3 (60%) complete** - project setup, database schema, and core backend API implemented with authentication, services, WebSocket real-time updates, and comprehensive middleware layer.

**Production Readiness Goal**: Every component should be built with production scalability in mind - proper error boundaries, retry logic, circuit breakers, and observability hooks.

## Architecture

### Monorepo Structure (Turborepo)

```
linear-clone/
├── apps/
│   ├── web/        # Main Next.js app (port 3000) - primary frontend
│   └── api/        # Hono.js backend (port 3001) - clean architecture ready
├── packages/
│   ├── ui/         # Shared React components (@repo/ui)
│   ├── database/   # Drizzle ORM schemas and migrations ✅ COMPLETE
│   ├── types/      # Shared TypeScript types - planned
│   └── typescript-config/ # Shared TypeScript configs
```

**Removed**: `docs` app (unnecessary for Linear clone), `eslint-config` package (replaced with Biome.js)

**Phase 1, 2 & 3 Complete**:

- Phase 1: Turborepo setup, Biome.js, Vitest, Next.js with Tailwind v3, Hono.js backend, database package
- Phase 2: Database schema with 15 tables (users with passwordHash, sessions, workspaces, teams, projects, cycles, issues, labels, comments, attachments, activity logs, notifications), 17 performance indexes, transaction utilities, query builders
- Phase 3: Backend API with authentication (JWT + bcrypt, 17/17 tests passing), WebSocket real-time updates, all routes/services implemented
- Phase 4.1-4.3: Frontend foundation with design system (12 UI components), state management (5 Zustand stores), layouts (Sidebar + TopNav)

**Current State**: Ready for Phase 4.4 - Authentication Pages Implementation

### Technology Stack

**Current**:

- Package Manager: npm (v11.6.2, specified in `package.json`)
- Build System: Turborepo 2.3.0
- Frontend: Next.js 16.0.1 with React 19.2.0, App Router
- Styling: Tailwind CSS 3.4.18 (latest v3)
- TypeScript: 5.x (strict mode enabled)
- Code Quality: Biome.js 1.9.4 (root) + 2.2.0 (apps/web for compatibility)

**Implemented**:

- Backend: Hono.js 4.6.11 (running on port 3001)
- Database: PostgreSQL with Drizzle ORM 0.36.4
- Auth: ✅ JWT + Bcrypt (17/17 tests passing)
- Validation: Zod 3.23.8
- Testing: Vitest 2.1.4 (comprehensive test coverage required)

**Planned** (per `AGENTS.md`):

- Backend: WebSockets for real-time features
- UI: Radix UI primitives (to be installed)
- State: Zustand (to be installed)
- Forms: React Hook Form + Zod (to be installed)

## Development Workflows

### Running the Project

```bash
# Install dependencies (always use npm)
npm install

# Start all apps in development mode
npm run dev

# Start specific app (use filters)
npx turbo dev --filter=web
npx turbo dev --filter=api

# Build all apps
npm run build

# Lint and format all code (Biome.js)
npm run lint
npm run format

# Check and apply fixes
npm run lint:fix

# Type check all apps
npm run check-types
```

### Turborepo Commands

- **Always use `npx turbo` or `npm run`** - Global turbo is not required
- **Use filters** for specific packages: `--filter=web`, `--filter=@repo/ui`
- **Cache behavior**: Turbo caches builds automatically (see `turbo.json`)
- **Note**: Root-level lint task is `//#lint` (workspace-specific format) in turbo.json

### Package Management

- **Internal dependencies**: Reference as `"@repo/ui": "*"` in `package.json`
- **Adding dependencies**: Run `npm install` in the specific workspace folder (`apps/web`, `packages/ui`, etc.)
- **Version consistency**: Keep React, TypeScript versions aligned across packages

## Code Conventions

### TypeScript (Strict Standards)

**Type Safety**:

- **Strict mode enabled**: `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitReturns: true`
- **No escape hatches**: Avoid `any`, `@ts-ignore`, `as any` - use proper type narrowing
- **Discriminated unions**: For complex states, use tagged unions with exhaustive checks
- **Branded types**: Use type branding for IDs, emails, etc. to prevent mixing
  ```typescript
  type UserId = string & { readonly __brand: "UserId" };
  type TeamId = string & { readonly __brand: "TeamId" };
  ```

**Import Organization** (enforced by Biome.js):

```typescript
// 1. External dependencies
import { z } from "zod";
import type { Metadata } from "next";

// 2. Internal packages
import { Button } from "@repo/ui/button";
import type { Issue } from "@repo/types/issue";

// 3. Relative imports
import { issueSchema } from "./schemas";
import type { IssueFormProps } from "./types";
```

### React/Next.js (Performance-First)

**Component Architecture**:

- **Server Components by default**: Only add `"use client"` when truly necessary (hooks, events, browser APIs)
- **Composition over inheritance**: Use composition patterns, avoid deep prop drilling
- **Memoization strategy**:
  - `React.memo()` for expensive renders with proper equality checks
  - `useMemo()` for expensive computations (with actual profiling data)
  - `useCallback()` only when passing to memoized children
- **Error boundaries**: Wrap all client components with error boundaries
  ```typescript
  <ErrorBoundary fallback={<ErrorFallback />} onError={logError}>
    <ClientComponent />
  </ErrorBoundary>
  ```

**Next.js Patterns**:

- **App Router conventions**: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- **Streaming SSR**: Use `<Suspense>` boundaries for progressive loading
- **Metadata API**: Export static metadata for SEO
  ```typescript
  export const metadata: Metadata = {
    title: "Issues | Linear Clone",
    description: "Manage your team issues",
  };
  ```
- **Route handlers**: Use `route.ts` for API routes with proper HTTP status codes
- **Font optimization**: Use `next/font/local` or `next/font/google` with `display: 'swap'`

### Shared UI Components (`packages/ui`)

**Design System Principles**:

- **Export pattern**: Individual file exports via `"exports": {"./*": "./src/*.tsx"}`
- **Atomic design**: Button → Input → Form → Card (atoms → molecules → organisms)
- **Accessibility-first**:
  - Proper ARIA labels, roles, and keyboard navigation
  - Minimum color contrast ratios (WCAG AA)
  - Focus management and visible focus indicators
  - Screen reader tested
- **Props interface standards**:
  ```typescript
  interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  }
  ```
- **Polymorphic components**: Support `as` prop for semantic HTML flexibility
- **Compound components**: Use for complex UI (e.g., `<Select.Trigger>`, `<Select.Content>`)
- **Controlled + Uncontrolled modes**: Support both patterns where applicable
- **Client components**: Mark as `"use client"` only when using hooks/events/browser APIs

### Code Quality & Linting

**Biome.js Configuration**:

- **Zero tolerance policy**: CI fails on any lint errors or formatting issues
- **Configuration**: Root-level `biome.json` applies to all workspaces
- **Formatting**: 2 spaces, semicolons, single quotes (industry standard)
- **Linting rules**:
  - TypeScript-aware rules enabled
  - Import sorting by category (external → internal → relative)
  - Unused variables/imports disallowed
  - Console.log statements flagged (use proper logging)
- **Pre-commit hooks**: Use Husky + lint-staged for automatic formatting
- **VSCode integration**: Install Biome extension for instant feedback

**Code Review Standards**:

- Self-review before requesting PR review
- Include context, screenshots, and test evidence
- Address all comments before merging
- Use conventional commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`

### File & Folder Naming

**Conventions** (strictly enforced):

- **Components**: `kebab-case.tsx` → exports `PascalCase` (e.g., `issue-card.tsx` → `IssueCard`)
- **Utilities**: `camelCase.ts` (e.g., `formatDate.ts`, `validateEmail.ts`)
- **Types**: `types.ts` or co-located in component file
- **Tests**: `*.test.tsx` or `__tests__/component-name.test.tsx`
- **Routes**: Next.js conventions (`page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`)
- **Folders**: `kebab-case` (e.g., `issue-board/`, `user-settings/`)

**File Organization** (by feature, not by type):

```
components/
  issues/
    issue-card.tsx
    issue-card.test.tsx
    issue-form.tsx
    issue-form.test.tsx
    types.ts
    utils.ts
```

### Frontend ↔ Backend Communication

**API Contract (RESTful + WebSocket)**:

- **Base URL**: `http://localhost:3001/api` (Hono.js backend on port 3001)
- **Versioning**: `/api/v1/` prefix for future compatibility
- **Authentication**: Better Auth with JWT in `Authorization: Bearer <token>` header
- **Request validation**: Zod schemas on both client and server (shared via `@repo/types`)
- **Response format** (standardized):

  ```typescript
  type ApiResponse<T> = {
    data: T;
    meta?: { page: number; totalPages: number; totalCount: number };
  };

  type ApiError = {
    error: { code: string; message: string; details?: unknown };
  };
  ```

- **HTTP Status Codes** (proper usage):
  - `200 OK` - Successful GET/PATCH
  - `201 Created` - Successful POST
  - `204 No Content` - Successful DELETE
  - `400 Bad Request` - Invalid input
  - `401 Unauthorized` - Missing/invalid auth
  - `403 Forbidden` - Insufficient permissions
  - `404 Not Found` - Resource doesn't exist
  - `409 Conflict` - Conflict with current state
  - `422 Unprocessable Entity` - Validation errors
  - `429 Too Many Requests` - Rate limit exceeded
  - `500 Internal Server Error` - Server error (logged)

**Clean Architecture Boundaries**:

- **Frontend** (`apps/web/src/lib/api/`):
  - Type-safe API client with automatic retry logic
  - Request deduplication for GET requests
  - Optimistic updates with rollback on failure
  - Error normalization and user-friendly messages
- **Backend** (`apps/api/src/`):

### Database Architecture

**Drizzle ORM + PostgreSQL Best Practices**:

- **Connection pooling**: Use `pg-pool` with min/max connection limits
  ```typescript
  const pool = new Pool({
    max: 20, // Max connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
  ```
- **Transaction management**: Use database transactions for multi-step operations
  ```typescript
  await db.transaction(async (tx) => {
    await tx.insert(issues).values(newIssue);
    await tx.insert(activityLogs).values(activityLog);
  });
  ```
- **Migration strategy**:
  - Never edit existing migrations (forward-only)
  - Include rollback scripts for all migrations
  - Test migrations in staging before production
- **Schema organization**:
  - One file per table in `packages/database/schema/`
  - Indexes defined alongside schema
  - Foreign keys with proper ON DELETE/UPDATE actions
- **Query optimization**:
  - Use `EXPLAIN ANALYZE` for slow queries
  - Add indexes on foreign keys and frequently queried columns
  - Use partial indexes for filtered queries
  - Implement cursor-based pagination for large datasets

**Data Integrity**:

- **Constraints**: Enforce at database level (NOT NULL, UNIQUE, CHECK constraints)
- **Soft deletes**: Use `deleted_at` timestamp instead of hard deletes for audit trail
- **Audit logging**: Track who/when for all mutations (`created_by`, `updated_by`, `created_at`, `updated_at`)
- **Idempotency**: Use unique constraints to prevent duplicate operations

### State Management & Real-time Sync

**Zustand Store Architecture**:

```typescript
// Slice pattern for large stores
interface IssueSlice {
  issues: Map<string, Issue>;
  filters: IssueFilters;
  setIssues: (issues: Issue[]) => void;
  updateIssue: (id: string, changes: Partial<Issue>) => void;
  // Optimistic update with rollback
  updateIssueOptimistic: (id: string, changes: Partial<Issue>) => Promise<void>;
}

// Combine slices
const useStore = create<IssueSlice & TeamSlice & UISlice>()(
  devtools(
    persist(
      (set, get) => ({
        ...createIssueSlice(set, get),
        ...createTeamSlice(set, get),
        ...createUISlice(set, get),
      }),
      { name: "linear-clone-storage" }
    )
  )
);
```

**WebSocket Synchronization Pattern**:

1. **Optimistic update**: Update local state immediately
2. **API call**: Send mutation to backend
3. **Confirmation**: Wait for WebSocket event confirmation
4. **Reconciliation**: If event doesn't match expectation, rollback and refetch
5. **Conflict resolution**: Last-write-wins or merge strategies based on field
   | { type: 'issue.updated'; payload: { id: string; changes: Partial<Issue> } }
   | { type: 'comment.created'; payload: Comment };

````
- **Heartbeat/Ping**: 30-second ping to keep connection alive
- **Graceful degradation**: Fall back to polling if WebSocket fails
- **Environment variables**: `.env*` files are included in build inputs
- **Outputs**: Next.js builds output to `.next/**` (excluding cache)

### Next.js Configuration

- **Minimal config**: Default `next.config.js` is nearly empty - configure as needed
- **Image optimization**: Use `next/image` (already used in `apps/web/app/page.tsx`)
- **TypeScript plugin**: Enabled via `tsconfig.json` for Next.js autocomplete

### Monorepo Dependencies

### Design Philosophy & Engineering Standards

**Architecture Principles**:
- **Clean Architecture**: Strict layering - routes → services → repositories → database
- Routes know about HTTP, services know about business logic, repositories know about data
- Dependencies point inward (routes depend on services, not vice versa)
- Use dependency injection for testability
- **SOLID Principles**:
- Single Responsibility: Each module has one reason to change
- Open/Closed: Open for extension, closed for modification
- Liskov Substitution: Subtypes must be substitutable for base types
- Interface Segregation: Many specific interfaces over one general interface
- Dependency Inversion: Depend on abstractions, not concretions

**Performance Engineering**:
- **Measure first, optimize second**: Use Lighthouse, Web Vitals, React DevTools Profiler
- **Core Web Vitals targets**:
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- **Optimistic updates**: Never block UI on server response
- **Virtualization**: Use `@tanstack/react-virtual` for lists > 100 items
- **Code splitting**: Dynamic imports for routes and heavy components
- **Image optimization**: Use Next.js `<Image>` with proper sizing and lazy loading
- **Bundle analysis**: Run `next build --analyze` regularly, keep bundles < 200KB

**Type Safety & Runtime Validation**:
```typescript
// Define schema once, derive types
const issueSchema = z.object({
title: z.string().min(1).max(255),
status: z.enum(['backlog', 'todo', 'in_progress', 'done']),
priority: z.enum(['none', 'low', 'medium', 'high', 'urgent']),
assigneeId: z.string().uuid().nullable(),
});

type Issue = z.infer<typeof issueSchema>; // Derive type from schema

// Validate at boundaries (API routes, form submissions)
const validated = issueSchema.parse(input); // Throws on invalid
````

**Accessibility Requirements** (WCAG 2.1 Level AA):

- Keyboard navigation for all interactive elements (Tab, Enter, Escape, Arrow keys)
- Semantic HTML (`<button>`, `<nav>`, `<main>`, not `<div onClick>`)
- Proper heading hierarchy (h1 → h2 → h3, no skipping)
- ARIA labels where semantic HTML isn't sufficient
- Color contrast ratio ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- Focus indicators visible and distinct (not just browser default)
- Screen reader tested with NVDA/JAWS/VoiceOver

**Testing Strategy** (Comprehensive coverage required):

- **Unit tests**: Pure functions, utilities, hooks (aim for 80%+ coverage)
- **Integration tests**: Component + API interactions, user workflows
- **E2E tests**: Critical paths (auth, create issue, real-time updates)
- **Performance tests**: Bundle size, runtime performance regression
- **Accessibility tests**: Automated with `@axe-core/react`, manual verification

### Running Tests

```bash
# Run all tests with coverage
npm run test

# Run tests for specific package
npx turbo test --filter=web
npx turbo test --filter=api

# Watch mode during development
npm run test:watch

# Coverage report (must meet 80% threshold)
npm run test:coverage

# Type checking (must pass with zero errors)
## Implementation Strategy

### Clean Architecture Principles (Production-Grade)

**Backend Structure** (`apps/api/src/`):
```

apps/api/src/
├── routes/ # HTTP layer - request/response handling
│ ├── issues.ts # Route definitions, request parsing
│ └── auth.ts
├── services/ # Business logic layer
│ ├── issue.service.ts
│ └── notification.service.ts
├── repositories/ # Data access layer
│ ├── issue.repository.ts
│ └── user.repository.ts
├── middleware/ # Cross-cutting concerns
│ ├── auth.ts # JWT verification
│ ├── error-handler.ts
│ ├── rate-limit.ts
│ └── request-logger.ts
├── types/ # Shared types
├── utils/ # Pure utility functions
└── config/ # Environment config, constants

````

**Example: Three-Layer Pattern**
```typescript
// routes/issues.ts - HTTP layer
app.post('/api/v1/teams/:teamId/issues', authMiddleware, async (c) => {
  const teamId = c.req.param('teamId');
  const body = await c.req.json();
  const validated = createIssueSchema.parse(body);

  const issue = await issueService.create(teamId, validated, c.get('userId'));
  return c.json({ data: issue }, 201);
});

// services/issue.service.ts - Business logic
export class IssueService {
  constructor(
    private issueRepo: IssueRepository,
    private activityService: ActivityService,
    private notificationService: NotificationService
  ) {}

  async create(teamId: string, data: CreateIssueInput, userId: string): Promise<Issue> {
    const identifier = await this.generateIdentifier(teamId);
    const issue = await this.issueRepo.create({ ...data, identifier, createdBy: userId });

    // Side effects
    await Promise.all([
      this.activityService.log('issue', 'created', issue.id, userId),
      this.notificationService.notifyAssignment(issue),
    ]);

    return issue;
  }
}

// repositories/issue.repository.ts - Data access
export class IssueRepository {
  constructor(private db: Database) {}

  async create(data: InsertIssue): Promise<Issue> {
    const [issue] = await this.db.insert(issues).values(data).returning();
    return issue;
  }

  async findByTeam(teamId: string, filters: IssueFilters): Promise<Issue[]> {
    return this.db.query.issues.findMany({
      where: and(eq(issues.teamId, teamId), this.buildFilters(filters)),
      orderBy: [desc(issues.createdAt)],
    });
  }
}
````

### Testing Requirements (80%+ Coverage Mandatory)

**Testing Pyramid** (balanced distribution):

- 70% Unit tests - Fast, isolated, test pure logic
- 20% Integration tests - Test component interactions
- 10% E2E tests - Test critical user workflows

**Backend Tests** (`apps/api/src/__tests__/`):

````typescript
// Unit test example - services
describe('IssueService', () => {
  let service: IssueService;
  let mockRepo: MockIssueRepository;

  beforeEach(() => {
    mockRepo = new MockIssueRepository();
    service = new IssueService(mockRepo, mockActivityService, mockNotificationService);
  });

  it('should create issue with auto-generated identifier', async () => {
**Development Order (Iterative, not Waterfall)**

**Phase-based approach with continuous integration**:
1. ✅ **Phase 1**: Project setup (Turborepo, Biome.js, Vitest) + CI/CD pipeline - COMPLETE
2. ✅ **Phase 2**: Database schema + migrations + utilities + documentation - COMPLETE
3. 🔄 **Phase 3**: Backend API (clean architecture, auth, services, middleware) - 60% COMPLETE
   - ✅ 3.1-3.6: Auth, routes, services, WebSocket, middleware, environment
   - ⏳ 3.7-3.8: Route integration, testing
4. 🔄 **Phase 4**: Frontend (design system, layouts, features) + Storybook
  - ✅ 4.5: Main App Navigation (Sidebar + TopNav) - COMPLETE
5. 🔄 **Phase 5**: Comprehensive testing (unit, integration, E2E) + coverage reports
6. 🔄 **Phase 6**: Performance optimization + monitoring + alerting
7. 🔄 **Phase 7**: Documentation + runbooks + incident response plans

**Each phase includes**:
- Feature implementation
- Tests (written alongside code, not after)
- Documentation (inline comments, README updates)
- Code review and iteration
- Performance profiling
- Security review

## Observability & Monitoring

**Logging Strategy**:
```typescript
// Structured logging with context
logger.info('Issue created', {
  issueId: issue.id,
  teamId: issue.teamId,
  userId: user.id,
  duration: Date.now() - startTime,
});

logger.error('Failed to create issue', {
  error: err.message,
  stack: err.stack,
  input: sanitize(input), // Remove sensitive data
  userId: user.id,
});
````

**Metrics to Track**:

- API response times (p50, p95, p99)
- Database query duration
- WebSocket connection count
- Error rates by endpoint
- User actions (issue created, updated, etc.)
- Cache hit/miss ratios

**Error Handling**:

- All errors logged with context (user ID, request ID, stack trace)
- User-facing errors are sanitized (no stack traces to client)
- Sentry/DataDog integration for error tracking
- Alert on error rate spikes (> 1% error rate)

## Security Considerations

**Authentication & Authorization**:

- JWT tokens with short expiration (15 min access, 7 day refresh)
- Token rotation on refresh
- CSRF protection for state-changing operations
- Rate limiting: 100 req/min per user, 1000 req/min per IP
- Permission checks at service layer (not just routes)

**Input Validation**:

- Zod validation on all inputs (client and server)
- SQL injection prevention (parameterized queries only)
- XSS prevention (sanitize user content, use React's built-in escaping)
- File upload validation (type, size, malware scanning)

**Data Protection**:

- Passwords hashed with bcrypt (cost factor 12)
- Sensitive data encrypted at rest
- PII handling compliant with GDPR/CCPA
- Audit logs for data access and modifications

---

## Principal Engineer Checklist

Before considering any feature "done", verify:

- ✅ **Code Quality**: Passes all linters, formatters, type checks
- ✅ **Tests**: 80%+ coverage, all edge cases covered, tests pass locally and in CI
- ✅ **Performance**: Profiled, no obvious bottlenecks, meets Web Vitals targets
- ✅ **Accessibility**: Keyboard navigable, screen reader tested, WCAG AA compliant
- ✅ **Security**: Input validated, auth checked, no sensitive data exposed
- ✅ **Observability**: Proper logging, error tracking, metrics emitted
- ✅ **Documentation**: Code comments, README updated, API docs current
- ✅ **Scalability**: Can handle 10x current load without architecture changes
- ✅ **Maintainability**: Clear abstractions, SOLID principles followed, no tech debt
- ✅ **Review Ready**: Self-reviewed, tested in production-like environment

**Remember**: You're building for a company that will have millions of users. Every line of code matters. Quality is not negotiable.

---

**Key Reference**: See `AGENTS.md` for comprehensive feature requirements, database schema design, and phase-by-phase implementation plan. Treat it as the source of truth for what to build, while this file describes how to build it with professional excellence.
await expect(service.create('team-123', input, 'user-1')).rejects.toThrow();
expect(mockRepo.delete).toHaveBeenCalled(); // Verify rollback
});
});

// Integration test example - API routes
describe('POST /api/v1/teams/:teamId/issues', () => {
it('should create issue and return 201', async () => {
const response = await request(app)
.post('/api/v1/teams/team-123/issues')
.set('Authorization', `Bearer ${validToken}`)
.send({ title: 'New Issue', priority: 'high' });

    expect(response.status).toBe(201);
    expect(response.body.data).toMatchObject({
      title: 'New Issue',
      priority: 'high',
      identifier: expect.stringMatching(/^TEAM-\d+$/),
    });

});

it('should return 401 when unauthorized', async () => {
const response = await request(app)
.post('/api/v1/teams/team-123/issues')
.send({ title: 'New Issue' });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');

});
});

````

**Frontend Tests** (`apps/web/src/__tests__/`):
```typescript
// Component test example
describe('IssueCard', () => {
  it('should render issue with all properties', () => {
    const issue = { id: '1', title: 'Test', priority: 'high', assignee: user };
    render(<IssueCard issue={issue} />);

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByLabelText('High priority')).toBeInTheDocument();
    expect(screen.getByAltText(`${user.name}'s avatar`)).toBeInTheDocument();
  });

  it('should call onUpdate when status changed', async () => {
    const onUpdate = vi.fn();
    render(<IssueCard issue={issue} onUpdate={onUpdate} />);

    await userEvent.click(screen.getByRole('button', { name: /status/i }));
    await userEvent.click(screen.getByRole('menuitem', { name: /done/i }));

    expect(onUpdate).toHaveBeenCalledWith({ status: 'done' });
  });

  it('should be keyboard accessible', async () => {
    render(<IssueCard issue={issue} />);

    const card = screen.getByRole('article');
    card.focus();

    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('dialog')).toBeInTheDocument(); // Opens detail view
  });
});

// Store test example
describe('useIssueStore', () => {
  beforeEach(() => {
    useIssueStore.setState({ issues: new Map() });
  });

  it('should update issue optimistically and revert on error', async () => {
    const issue = { id: '1', title: 'Original', status: 'todo' };
    useIssueStore.setState({ issues: new Map([['1', issue]]) });

    apiClient.updateIssue.mockRejectedValue(new Error('Failed'));

    const promise = useIssueStore.getState().updateIssueOptimistic('1', { status: 'done' });

    // Optimistic update applied immediately
    expect(useIssueStore.getState().issues.get('1')?.status).toBe('done');

    await expect(promise).rejects.toThrow();

    // Reverted on failure
    expect(useIssueStore.getState().issues.get('1')?.status).toBe('todo');
  });
});
````

**Test Coverage Requirements**:

- Overall: 80%+ coverage (enforced in CI)
- Critical paths (auth, payments): 95%+ coverage
- Utilities/helpers: 90%+ coverage
- UI components: 70%+ coverage (focus on behavior, not implementation)
  ├── stores/ # Zustand stores
  │ ├── issue-store.ts
  │ └── auth-store.ts
  └── types/ # Frontend-specific types

````pty arrays, boundary values
- **Performance**: Tests should run in < 10 seconds locally Real-time Synchronization (Planned)

- **Protocol**: WebSockets (ws library)
- **Pattern**: Client subscribes to workspace/team rooms
- **Events**: Issue updates, comments, status changes
- **State sync**: Optimistic updates in Zustand stores with WebSocket reconciliation

## Important Context

### What Exists vs. What's Planned

**Currently implemented**:
- ✅ Turborepo monorepo structure
- ✅ Next.js app (`web`) with basic scaffolding
- ✅ Shared UI package with sample button
- ✅ TypeScript configs
- ✅ Build/dev/lint pipelines

**Next steps** (implementation order):
1. ⏳ **Biome.js setup** - Replace ESLint/Prettier with Biome.js
2. ⏳ **Backend scaffolding** - Create `apps/api` with Hono.js
3. ⏳ **Database package** - Setup `packages/database` with Drizzle ORM
4. ⏳ **Testing infrastructure** - Configure Vitest for all packages
5. ⏳ **Authentication** - Implement Better Auth
6. ⏳ **Core features** - Issue tracking, projects, cycles (see `AGENTS.md`)

**Not yet implemented**:
- ❌ Backend API (Hono.js)
- ❌ Database and ORM
- ❌ Authentication
- ❌ Issue tracking features
- ❌ Project management features
- ❌ Real-time collaboration
- ❌ Tailwind CSS
- ❌ Comprehensive testing with Vitest
- ❌ Any Linear-like UI/UX

### Design Philosophy (from AGENTS.md)

When implementing new features:
- **Clean Architecture**: Strict separation of concerns (routes → services → database)
- **Linear-inspired UX**: Smooth animations (150-300ms), keyboard shortcuts, command palette
- **Performance first**: Optimistic updates, virtualized lists, proper memoization
- **Type safety**: Full TypeScript coverage, Zod for runtime validation
- **Real-time by default**: All mutations should broadcast via WebSocket
- **Accessibility**: Use Radix UI primitives for proper ARIA support
- **Test-driven**: Write comprehensive tests with Vitest (unit, integration, E2E)

### Keyboard Shortcuts (Planned)

- `⌘K`/`Ctrl+K`: Command palette
- `C`: Create issue
- `/`: Focus search
- `?`: Show shortcuts help
- `G then I`: Go to issues
- `Esc`: Close modals

## Common Tasks

### Adding a New Shared UI Component

```bash
cd packages/ui
# Create component file (e.g., src/dropdown.tsx)
# Export via individual file export (already configured)
# Import in apps as: import { Dropdown } from "@repo/ui/dropdown"
# Write tests in __tests__/dropdown.test.tsx
````

### Creating a Backend Route (Clean Architecture)

```bash
# 1. Define route handler in apps/api/src/routes/
# 2. Implement business logic in apps/api/src/services/
# 3. Add database queries to packages/database/
# 4. Write tests in apps/api/src/__tests__/
```

### Adding Database Schema

Per `AGENTS.md`:

1. Create schema file in `packages/database/schema/`
2. Use Drizzle schema builder with proper types
3. Generate migration: `npm run db:generate`
4. Apply migration: `npm run db:migrate`
5. Write tests for schema validation

### Setting Up Environment Variables

Create `.env` files in each app (not committed):

- `apps/web/.env.local` for Next.js
- `apps/api/.env` for backend (see `AGENTS.md` Phase 3.6 for required vars)
- Turbo includes `.env*` in build inputs automatically

### Running Tests

```bash
# Run all tests
npm run test

# Run tests for specific package
npx turbo test --filter=web
npx turbo test --filter=api

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Implementation Strategy

### Clean Architecture Principles

**Backend Structure** (`apps/api/src/`):

- **Routes** (`routes/`): Thin handlers, validation only (Zod schemas)
- **Services** (`services/`): Business logic, no HTTP concerns
- **Middleware** (`middleware/`): Auth, CORS, error handling, validation
- **Database** (`packages/database/`): Drizzle ORM, migrations, schemas

**Frontend Structure** (`apps/web/src/`):

- **App** (`app/`): Next.js App Router pages and layouts
- **Components** (`components/`): Reusable UI components
- **Stores** (`stores/`): Zustand state management
- **Lib** (`lib/`): Utilities, API clients, WebSocket handlers
- **Hooks** (`hooks/`): Custom React hooks

### Testing Requirements

All new code must include comprehensive tests:

**Backend Tests** (`apps/api/src/__tests__/`):

- Unit tests for services (business logic)
- Integration tests for API routes (with mocked DB)
- Database tests (migrations, queries)
- Authentication flow tests

**Frontend Tests** (`apps/web/src/__tests__/`):

- Component unit tests (React Testing Library)
- Integration tests (user flows)
- Store tests (Zustand state management)
- Hook tests (custom hooks)

**Shared Package Tests**:

- `packages/ui/__tests__/` - Component library tests
- `packages/database/__tests__/` - Schema validation tests

### Development Order

Follow this sequence (from `AGENTS.md`):

1. ✅ **Phase 1**: Project setup (Turborepo, Biome.js, Vitest)
2. 🔄 **Phase 2**: Database schema design (`packages/database`)
3. 🔄 **Phase 3**: Backend API (`apps/api` with clean architecture)
4. 🔄 **Phase 4**: Frontend development (`apps/web`)
5. 🔄 **Phase 5**: Comprehensive testing (Vitest)
6. 🔄 **Phase 6**: Performance optimization
7. 🔄 **Phase 7**: Documentation

---

**Key Reference**: See `AGENTS.md` for comprehensive feature requirements, database schema design, and phase-by-phase implementation plan. Treat it as the source of truth for what to build, while this file describes how the existing codebase works.
