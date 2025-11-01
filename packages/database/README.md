# Database Package

Drizzle ORM schema and migrations for Linear Clone.

## Setup

1. Install PostgreSQL 14+
2. Create a database:

   ```sql
   CREATE DATABASE linear_clone;
   ```

3. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

4. Update DATABASE_URL in `.env`

## Commands

```bash
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Push schema to database (development)
npm run db:push

# Open Drizzle Studio
npm run db:studio
```

## Structure

- `/src/schema` - Database schema definitions
- `/src/client.ts` - Database client
- `/src/migrate.ts` - Migration runner
- `/migrations` - Generated migration files
