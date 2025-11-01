# Linear Clone

A high-fidelity fullstack clone of Linear.app built with modern technologies focusing on core project management functionality with real-time collaboration, issue tracking, and team management.

## 🚀 Technology Stack

- **Package Manager**: npm (v11.6.2)
- **Build System**: Turborepo 2.6.0
- **Frontend**: Next.js 16 with React 19 (App Router)
- **Backend**: Hono.js
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Better Auth (planned)
- **Code Quality**: Biome.js (linting & formatting)
- **Testing**: Vitest
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

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

## 📚 Documentation

- [AGENTS.md](./AGENTS.md) - Comprehensive implementation guide and feature requirements
- [.github/copilot-instructions.md](./.github/copilot-instructions.md) - Development guidelines and best practices
- [apps/api/README.md](./apps/api/README.md) - Backend API documentation
- [packages/database/README.md](./packages/database/README.md) - Database setup and schema docs

## 🎯 Current Status

### ✅ Completed (Phase 1)

- [x] Project initialization with Turborepo
- [x] Biome.js setup for linting and formatting
- [x] Vitest setup for comprehensive testing
- [x] Next.js app with Tailwind CSS and Radix UI
- [x] Hono.js backend with clean architecture
- [x] Database package with Drizzle ORM
- [x] Turborepo pipeline configuration

### 🔄 In Progress

- [ ] Database schema design (Phase 2)
- [ ] Backend API development (Phase 3)
- [ ] Frontend development (Phase 4)
- [ ] Authentication with Better Auth

### 📋 Planned

- [ ] Issue tracking features
- [ ] Project management
- [ ] Cycles/sprints
- [ ] Real-time collaboration with WebSockets
- [ ] Command palette
- [ ] Search functionality
- [ ] Notifications

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
