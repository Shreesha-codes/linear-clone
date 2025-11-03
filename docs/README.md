# Documentation Index

This directory contains all documentation for the Linear Clone project.

## 📚 Documentation Structure

```
docs/
├── guides/              # User guides and tutorials
│   ├── QUICKSTART.md   # Quick start guide
│   ├── TESTING.md      # Testing guide
│   ├── TESTING_GUIDE.md # Comprehensive testing documentation
│   ├── TESTING_PHASE2.md # Phase 2 testing details
│   ├── HOW_TO_TEST.md  # How to test the application
│   ├── HOW_TO_TEST_AUTH.md # Authentication testing guide
│   └── DEMO_GUIDE.md   # Demo and presentation guide
│
└── development-logs/   # Historical development phase reports
    ├── PHASE1_COMPLETE.md # Phase 1: Project setup
    ├── PHASE2_COMPLETE.md # Phase 2: Database schema
    ├── PHASE3.2_COMPLETE.md # Phase 3.2: API routes
    ├── PHASE3.3_COMPLETE.md # Phase 3.3: Services
    ├── PHASE3.5_AND_3.6_COMPLETE.md # Phase 3.5-3.6: Middleware
    ├── PHASE3_4_COMPLETE.md # Phase 3.4: WebSocket
    ├── PHASE4.1-4.3_COMPLETE.md # Phase 4.1-4.3: Frontend foundation
    ├── PHASE4.5_AND_4.6_COMPLETE.md # Phase 4.5-4.6: Navigation
    ├── PHASE4.7_COMPLETE.md # Phase 4.7: Issue management
    ├── AUTH_IMPLEMENTATION_SUMMARY.md # Auth implementation details
    ├── AUTH_FIX_SUMMARY.md # Auth bug fixes
    ├── AUTH_TESTING.md # Auth testing results
    ├── BACKEND_INTEGRATION_COMPLETE.md # Backend integration status
    ├── BACKEND_STATUS.md # Backend development status
    ├── BACKEND_TESTING.md # Backend testing results
    ├── CODE_QUALITY_VERIFICATION.md # Code quality checks
    ├── COMPLIANCE_REVIEW.md # Compliance and security review
    ├── INTEGRATION_STATUS.md # Integration status report
    ├── REVIEW_SUMMARY.md # Code review summary
    └── ROUTE_FIXES.md # API route fixes
```

## 📖 Main Documentation

Located in the root directory:

- **[README.md](../README.md)** - Quick start and overview
- **[PROJECT.md](../PROJECT.md)** - Complete project documentation
- **[DEPLOYMENT.md](../DEPLOYMENT.md)** - Production deployment guide
- **[AGENTS.md](../AGENTS.md)** - Implementation guide and roadmap

## 🚀 Getting Started

**New to the project?** Start here:

1. Read [README.md](../README.md) for quick start
2. Review [PROJECT.md](../PROJECT.md) for architecture overview
3. Check [guides/QUICKSTART.md](./guides/QUICKSTART.md) for detailed setup
4. See [guides/HOW_TO_TEST.md](./guides/HOW_TO_TEST.md) for testing instructions

## 🔧 Development

**Working on features?**

- [AGENTS.md](../AGENTS.md) - Feature requirements and implementation plan
- [.github/copilot-instructions.md](../.github/copilot-instructions.md) - Coding guidelines
- [development-logs/](./development-logs/) - Historical phase completion reports

## 🧪 Testing

**Writing or running tests?**

- [guides/TESTING_GUIDE.md](./guides/TESTING_GUIDE.md) - Comprehensive testing guide
- [guides/HOW_TO_TEST.md](./guides/HOW_TO_TEST.md) - Quick testing reference
- [guides/HOW_TO_TEST_AUTH.md](./guides/HOW_TO_TEST_AUTH.md) - Authentication testing

## 🚢 Deployment

**Deploying to production?**

- [DEPLOYMENT.md](../DEPLOYMENT.md) - Complete deployment guide
- Docker configuration in root: `docker-compose.yml`, `Dockerfile`

## 📜 Development Logs

The `development-logs/` directory contains phase completion reports documenting the project's development journey. These are historical records and are kept for reference.

**Key milestones:**

- **Phase 1** - Project setup (Turborepo, Biome, Vitest)
- **Phase 2** - Database schema (16 tables, migrations)
- **Phase 3** - Backend API (Auth, routes, services, WebSocket, middleware)
- **Phase 4** - Frontend (Design system, layouts, issue management)

## 🤝 Contributing

When adding new documentation:

1. **Guides** go in `docs/guides/` (user-facing tutorials)
2. **Development logs** go in `docs/development-logs/` (historical records)
3. **Major documentation** goes in root (README, PROJECT, DEPLOYMENT, AGENTS)

## 🔍 Search Documentation

Use your IDE's search functionality to find specific topics across all documentation files.

**Common searches:**
- "authentication" - Auth setup and testing
- "database" - Database schema and migrations
- "docker" - Docker deployment
- "testing" - Test setup and running tests
- "API" - API endpoints and usage

---

**Last Updated:** November 3, 2025
