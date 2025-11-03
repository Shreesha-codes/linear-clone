# Deployment Guide - Linear Clone

This guide covers production deployment of the Linear Clone application using Docker and traditional deployment methods.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Docker Deployment](#docker-deployment)
- [Traditional Deployment](#traditional-deployment)
- [Database Migration](#database-migration)
- [SSL/TLS Configuration](#ssltls-configuration)
- [Monitoring & Logging](#monitoring--logging)
- [Backup & Recovery](#backup--recovery)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements

- **Server**: Linux (Ubuntu 20.04+ recommended) or macOS
- **Memory**: Minimum 2GB RAM (4GB+ recommended)
- **Storage**: Minimum 20GB free space
- **Node.js**: v18 or higher
- **PostgreSQL**: v14 or higher
- **Docker**: v20.10+ (for Docker deployment)
- **Docker Compose**: v2.0+ (for Docker deployment)

### Domain & DNS

- Domain name configured (e.g., `linear-clone.com`)
- DNS A records pointing to your server IP:
  - `@` → Server IP (for `linear-clone.com`)
  - `www` → Server IP (for `www.linear-clone.com`)
  - `api` → Server IP (for `api.linear-clone.com`)

---

## Environment Configuration

### Required Environment Variables

**Backend API (`apps/api/.env`):**

```env
# Database (REQUIRED)
DATABASE_URL=postgresql://username:password@host:5432/database_name

# Authentication (REQUIRED)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Server Configuration (REQUIRED)
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://linear-clone.com

# Optional: Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Optional: Email (if implementing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=Linear Clone <noreply@linear-clone.com>

# Optional: Redis (for distributed rate limiting)
REDIS_URL=redis://localhost:6379

# Optional: Monitoring
SENTRY_DSN=https://your-sentry-dsn
LOG_LEVEL=info

# Optional: Feature Flags
FEATURE_WEBSOCKETS=true
FEATURE_EMAIL_NOTIFICATIONS=false
FEATURE_FILE_UPLOADS=true
```

**Frontend Web (`apps/web/.env.production`):**

```env
# API Configuration (REQUIRED)
NEXT_PUBLIC_API_URL=https://api.linear-clone.com
NEXT_PUBLIC_WS_URL=wss://api.linear-clone.com

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional: Sentry
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn
```

**Database Package (`packages/database/.env`):**

```env
DATABASE_URL=postgresql://username:password@host:5432/database_name
```

### Security Best Practices

**Critical Security Checklist:**

- ✅ Use strong, unique `JWT_SECRET` (32+ characters, randomly generated)
- ✅ Never commit `.env` files to version control
- ✅ Use environment-specific `.env` files (`.env.production`, `.env.staging`)
- ✅ Restrict database user permissions (no superuser access)
- ✅ Enable SSL/TLS for database connections
- ✅ Set strong PostgreSQL passwords (16+ characters)
- ✅ Configure CORS to allow only your frontend domain
- ✅ Enable rate limiting on all API endpoints
- ✅ Use prepared statements (Drizzle ORM handles this)
- ✅ Sanitize all user inputs (Zod schemas validate inputs)

**Generate Secure Secrets:**

```bash
# Generate JWT_SECRET (64 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate PostgreSQL password
openssl rand -base64 32
```

---

## Docker Deployment

### Step 1: Prepare Environment

**1.1 Clone repository on server:**

```bash
git clone <your-repo-url>
cd linear-clone
```

**1.2 Create Docker environment file:**

```bash
cp .env.docker.example .env
```

**1.3 Edit `.env` with production values:**

```bash
nano .env
```

Set:
- `POSTGRES_PASSWORD` (strong password)
- `JWT_SECRET` (64 character random string)
- `FRONTEND_URL` (your production domain)
- `NEXT_PUBLIC_API_URL` (your API domain)
- `NEXT_PUBLIC_WS_URL` (your WebSocket domain)

### Step 2: Build and Run

**2.1 Build Docker images:**

```bash
docker-compose build
```

**2.2 Start services:**

```bash
docker-compose up -d
```

This starts:
- PostgreSQL database on port 5432
- Backend API on port 3001
- Frontend web on port 3000

**2.3 Check service status:**

```bash
docker-compose ps
```

All services should show as `Up` (healthy).

### Step 3: Database Migration

**3.1 Run migrations inside API container:**

```bash
docker-compose exec api sh
cd packages/database
npm run db:migrate
exit
```

**3.2 Verify database tables:**

```bash
docker-compose exec postgres psql -U postgres -d linear_clone -c "\dt"
```

You should see 16 tables.

### Step 4: Health Checks

**4.1 Check API health:**

```bash
curl http://localhost:3001/api/v1/health
```

Expected response: `{"status":"ok"}`

**4.2 Check frontend:**

```bash
curl http://localhost:3000
```

Expected: HTML response with Next.js app.

### Docker Management Commands

```bash
# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f api
docker-compose logs -f web

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v

# Update application (after git pull)
docker-compose build
docker-compose up -d
```

---

## Traditional Deployment

### Step 1: Server Setup

**1.1 Update system:**

```bash
sudo apt update && sudo apt upgrade -y
```

**1.2 Install Node.js:**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

**1.3 Install PostgreSQL:**

```bash
sudo apt install -y postgresql postgresql-contrib
```

**1.4 Install process manager (PM2):**

```bash
sudo npm install -g pm2
```

### Step 2: Database Setup

**2.1 Configure PostgreSQL:**

```bash
sudo -u postgres psql
```

```sql
-- Create database
CREATE DATABASE linear_clone;

-- Create user with password
CREATE USER linear_user WITH ENCRYPTED PASSWORD 'your-strong-password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE linear_clone TO linear_user;

-- Exit
\q
```

**2.2 Configure PostgreSQL for remote access (if needed):**

```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
```

Add:
```
listen_addresses = 'localhost'
```

```bash
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

Add:
```
host    linear_clone    linear_user    127.0.0.1/32    md5
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

### Step 3: Application Deployment

**3.1 Clone repository:**

```bash
cd /var/www
sudo git clone <your-repo-url> linear-clone
cd linear-clone
sudo chown -R $USER:$USER .
```

**3.2 Install dependencies:**

```bash
npm install
```

**3.3 Configure environment variables:**

```bash
# Backend API
cp apps/api/.env.example apps/api/.env
nano apps/api/.env

# Database
cp packages/database/.env.example packages/database/.env
nano packages/database/.env

# Frontend
cp apps/web/.env.production.example apps/web/.env.production
nano apps/web/.env.production
```

**3.4 Run database migrations:**

```bash
cd packages/database
npm run db:migrate
cd ../..
```

**3.5 Build applications:**

```bash
npm run build
```

### Step 4: Process Management with PM2

**4.1 Create PM2 ecosystem file:**

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'linear-api',
      cwd: './apps/api',
      script: 'node',
      args: 'dist/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      instances: 2,
      exec_mode: 'cluster',
      max_memory_restart: '500M',
      error_file: './logs/api-err.log',
      out_file: './logs/api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
    {
      name: 'linear-web',
      cwd: './apps/web',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      instances: 2,
      exec_mode: 'cluster',
      max_memory_restart: '800M',
      error_file: './logs/web-err.log',
      out_file: './logs/web-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
```

**4.2 Start applications:**

```bash
pm2 start ecosystem.config.js
```

**4.3 Setup PM2 to start on boot:**

```bash
pm2 startup
pm2 save
```

**4.4 PM2 management commands:**

```bash
# View status
pm2 status

# View logs
pm2 logs

# Restart app
pm2 restart linear-api
pm2 restart linear-web

# Stop app
pm2 stop linear-api

# Monitor resources
pm2 monit
```

---

## SSL/TLS Configuration

### Using Nginx as Reverse Proxy

**1. Install Nginx:**

```bash
sudo apt install -y nginx
```

**2. Create Nginx configuration:**

```bash
sudo nano /etc/nginx/sites-available/linear-clone
```

```nginx
# HTTP redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name linear-clone.com www.linear-clone.com;
    return 301 https://linear-clone.com$request_uri;
}

# Frontend (HTTPS)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name linear-clone.com www.linear-clone.com;

    # SSL certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/linear-clone.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/linear-clone.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# API (HTTPS)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.linear-clone.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/linear-clone.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/linear-clone.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket support
        proxy_read_timeout 86400;
    }
}
```

**3. Enable configuration:**

```bash
sudo ln -s /etc/nginx/sites-available/linear-clone /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**4. Install SSL certificate (Let's Encrypt):**

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d linear-clone.com -d www.linear-clone.com -d api.linear-clone.com
```

**5. Auto-renew SSL certificates:**

Certbot auto-renews via systemd timer. Verify:

```bash
sudo systemctl status certbot.timer
```

---

## Monitoring & Logging

### Application Logs

**Docker:**

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api
docker-compose logs -f web

# Export logs to file
docker-compose logs > app.log
```

**PM2:**

```bash
# View logs
pm2 logs

# View specific app logs
pm2 logs linear-api

# Export logs
pm2 logs --lines 1000 > app.log
```

### Database Logs

**PostgreSQL:**

```bash
# View logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### System Monitoring

**Install monitoring tools:**

```bash
sudo apt install -y htop iotop nethogs
```

**Monitor resources:**

```bash
# CPU/Memory
htop

# Disk I/O
iotop

# Network
nethogs
```

### Uptime Monitoring

Use external services:
- [UptimeRobot](https://uptimerobot.com/) - Free uptime monitoring
- [Pingdom](https://www.pingdom.com/) - Comprehensive monitoring
- [Better Uptime](https://betteruptime.com/) - Developer-friendly monitoring

Configure health check endpoints:
- Frontend: `https://linear-clone.com`
- API: `https://api.linear-clone.com/api/v1/health`

---

## Backup & Recovery

### Database Backups

**1. Create backup script:**

Create `/usr/local/bin/backup-linear-db.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/linear-clone"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="linear_clone_$DATE.sql.gz"

mkdir -p $BACKUP_DIR

# Backup with compression
pg_dump -U linear_user linear_clone | gzip > $BACKUP_DIR/$FILENAME

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: $FILENAME"
```

Make executable:
```bash
sudo chmod +x /usr/local/bin/backup-linear-db.sh
```

**2. Schedule daily backups:**

```bash
sudo crontab -e
```

Add:
```cron
0 2 * * * /usr/local/bin/backup-linear-db.sh >> /var/log/linear-backup.log 2>&1
```

**3. Restore from backup:**

```bash
# Decompress and restore
gunzip -c /var/backups/linear-clone/linear_clone_20240101_020000.sql.gz | psql -U linear_user linear_clone
```

### Application Backups

**Backup code and configuration:**

```bash
tar -czf linear-clone-backup-$(date +%Y%m%d).tar.gz \
  /var/www/linear-clone \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=dist
```

**Restore:**

```bash
tar -xzf linear-clone-backup-20240101.tar.gz -C /var/www/
```

---

## Troubleshooting

### Common Issues

**1. Database Connection Errors**

```
Error: Connection refused on localhost:5432
```

**Solution:**
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify DATABASE_URL is correct
- Check PostgreSQL logs: `sudo tail -f /var/log/postgresql/*.log`

**2. Port Already in Use**

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>
```

**3. JWT Secret Not Set (Production)**

```
Error: JWT_SECRET is required in production
```

**Solution:**
- Set JWT_SECRET in `apps/api/.env`
- Generate secure secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Restart application

**4. Database Migration Errors**

```
Error: relation "users" does not exist
```

**Solution:**
```bash
cd packages/database
npm run db:migrate
```

**5. Next.js Build Errors**

```
Error: Module not found
```

**Solution:**
```bash
# Clear cache
rm -rf apps/web/.next
rm -rf node_modules
npm install
npm run build
```

### Health Checks

**API Health:**

```bash
curl http://localhost:3001/api/v1/health
```

**Database Health:**

```bash
psql -U postgres -d linear_clone -c "SELECT version();"
```

**Frontend Health:**

```bash
curl -I http://localhost:3000
```

### Performance Issues

**High CPU Usage:**

1. Check PM2 metrics: `pm2 monit`
2. Reduce PM2 instances in `ecosystem.config.js`
3. Optimize database queries (add indexes)
4. Enable query logging in Drizzle

**High Memory Usage:**

1. Reduce `max_memory_restart` in PM2 config
2. Increase server RAM
3. Enable memory profiling

**Slow Database Queries:**

1. Enable query logging:
   ```sql
   ALTER DATABASE linear_clone SET log_min_duration_statement = 100;
   ```
2. Analyze slow queries:
   ```sql
   SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;
   ```
3. Add missing indexes

---

## Security Hardening

### Firewall Configuration

**UFW (Ubuntu):**

```bash
# Install UFW
sudo apt install -y ufw

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### Fail2Ban (Prevent Brute Force)

```bash
# Install Fail2Ban
sudo apt install -y fail2ban

# Configure
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### Regular Security Updates

```bash
# Enable automatic security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## Rollback Procedure

### Application Rollback

**1. Stop current version:**

```bash
pm2 stop all
```

**2. Checkout previous version:**

```bash
cd /var/www/linear-clone
git log --oneline  # Find commit hash
git checkout <previous-commit-hash>
```

**3. Rebuild and restart:**

```bash
npm install
npm run build
pm2 restart all
```

### Database Rollback

**Restore from backup:**

```bash
# Stop applications
pm2 stop all

# Restore database
gunzip -c /var/backups/linear-clone/<backup-file>.sql.gz | psql -U linear_user linear_clone

# Restart applications
pm2 restart all
```

---

## Support & Maintenance

### Regular Maintenance Tasks

**Weekly:**
- Review application logs for errors
- Check disk space: `df -h`
- Review database performance
- Check SSL certificate expiry: `sudo certbot certificates`

**Monthly:**
- Update dependencies: `npm update`
- Review security advisories: `npm audit`
- Test backups (restore to staging)
- Review monitoring metrics

**Quarterly:**
- Security audit
- Performance optimization
- Database vacuum: `VACUUM ANALYZE;`
- Update Node.js version

---

**For additional help, see:**
- [PROJECT.md](./PROJECT.md) - Project documentation
- [AGENTS.md](./AGENTS.md) - Implementation guide
- [GitHub Issues](https://github.com/your-repo/issues) - Report bugs

---

**Deployment Status:** Ready for production 🚀
