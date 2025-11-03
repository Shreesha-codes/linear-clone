#!/bin/bash

# Phase 2 Demo Script - Automated Setup and Testing
# This script creates sample data and opens the new features in your browser

set -e  # Exit on error

echo "🎬 Linear Clone - Phase 2 Demo Setup"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if servers are running
echo -e "${YELLOW}📡 Checking servers...${NC}"
if ! curl -s http://localhost:3000 > /dev/null; then
    echo -e "${YELLOW}⚠️  Frontend not running. Starting...${NC}"
    npx turbo dev --filter=web &
    sleep 5
fi

if ! curl -s http://localhost:3001/api/v1/health > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Backend not running. Starting...${NC}"
    npx turbo dev --filter=api &
    sleep 5
fi

echo -e "${GREEN}✅ Servers are running${NC}"
echo ""

# Get user ID from environment or prompt
echo -e "${BLUE}🔑 User Authentication${NC}"
echo "Please provide your User ID from the dashboard."
echo "Visit http://localhost:3000/dashboard and copy the User ID from your profile card."
echo ""
read -p "Enter your User ID: " USER_ID

if [ -z "$USER_ID" ]; then
    echo -e "${YELLOW}No User ID provided. Using default: 'test-user-1'${NC}"
    USER_ID="test-user-1"
fi

# Database connection info
DB_NAME="${DATABASE_NAME:-linear_clone}"
echo ""
echo -e "${BLUE}📦 Creating sample data...${NC}"

# SQL to create workspace, team, and issues
SQL_SCRIPT="
-- Clean up existing demo data (optional)
DELETE FROM issue_labels WHERE issue_id LIKE 'demo-issue-%';
DELETE FROM issues WHERE id LIKE 'demo-issue-%';
DELETE FROM team_members WHERE id LIKE 'demo-tm-%';
DELETE FROM teams WHERE id LIKE 'demo-team-%';
DELETE FROM workspace_members WHERE id LIKE 'demo-wm-%';
DELETE FROM workspaces WHERE id LIKE 'demo-workspace-%';

-- Create demo workspace
INSERT INTO workspaces (id, name, slug, created_at, updated_at)
VALUES ('demo-workspace-1', 'Demo Workspace', 'demo-workspace', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Add user as workspace member
INSERT INTO workspace_members (id, workspace_id, user_id, role, created_at)
VALUES ('demo-wm-1', 'demo-workspace-1', '${USER_ID}', 'owner', NOW())
ON CONFLICT (id) DO NOTHING;

-- Create demo team
INSERT INTO teams (id, workspace_id, name, identifier, description, created_at, updated_at)
VALUES ('demo-team-1', 'demo-workspace-1', 'Demo Engineering', 'DEMO', 'Demo team for Phase 2 testing', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Add user as team member
INSERT INTO team_members (id, team_id, user_id, created_at)
VALUES ('demo-tm-1', 'demo-team-1', '${USER_ID}', NOW())
ON CONFLICT (id) DO NOTHING;

-- Create 15 sample issues across different statuses
INSERT INTO issues (id, team_id, identifier, title, description, status, priority, creator_id, assignee_id, sort_order, created_at, updated_at)
VALUES 
  -- Backlog (3 issues)
  ('demo-issue-1', 'demo-team-1', 'DEMO-1', '🎨 Design new landing page', 'Create a modern landing page with hero section and features showcase', 'backlog', 'low', '${USER_ID}', NULL, 1.0, NOW(), NOW()),
  ('demo-issue-2', 'demo-team-1', 'DEMO-2', '📱 Add mobile responsiveness', 'Ensure all pages work on mobile devices', 'backlog', 'medium', '${USER_ID}', '${USER_ID}', 2.0, NOW(), NOW()),
  ('demo-issue-3', 'demo-team-1', 'DEMO-3', '🔍 Implement search functionality', 'Add global search with filters', 'backlog', 'none', '${USER_ID}', NULL, 3.0, NOW(), NOW()),
  
  -- Todo (4 issues)
  ('demo-issue-4', 'demo-team-1', 'DEMO-4', '🔐 Setup two-factor authentication', 'Add 2FA for enhanced security', 'todo', 'high', '${USER_ID}', '${USER_ID}', 4.0, NOW(), NOW()),
  ('demo-issue-5', 'demo-team-1', 'DEMO-5', '📊 Create analytics dashboard', 'Build dashboard with charts and metrics', 'todo', 'medium', '${USER_ID}', NULL, 5.0, NOW(), NOW()),
  ('demo-issue-6', 'demo-team-1', 'DEMO-6', '🎯 Add issue templates', 'Create templates for common issue types', 'todo', 'low', '${USER_ID}', NULL, 6.0, NOW(), NOW()),
  ('demo-issue-7', 'demo-team-1', 'DEMO-7', '⚡ Optimize database queries', 'Add indexes and optimize N+1 queries', 'todo', 'high', '${USER_ID}', '${USER_ID}', 7.0, NOW(), NOW()),
  
  -- In Progress (4 issues)
  ('demo-issue-8', 'demo-team-1', 'DEMO-8', '🚀 Deploy to staging environment', 'Setup staging server and CI/CD pipeline', 'in_progress', 'urgent', '${USER_ID}', '${USER_ID}', 8.0, NOW(), NOW()),
  ('demo-issue-9', 'demo-team-1', 'DEMO-9', '🎨 Implement drag and drop', 'Add @dnd-kit for Kanban board', 'in_progress', 'high', '${USER_ID}', '${USER_ID}', 9.0, NOW(), NOW()),
  ('demo-issue-10', 'demo-team-1', 'DEMO-10', '📝 Write API documentation', 'Document all REST endpoints', 'in_progress', 'medium', '${USER_ID}', NULL, 10.0, NOW(), NOW()),
  ('demo-issue-11', 'demo-team-1', 'DEMO-11', '🧪 Add E2E tests', 'Setup Playwright for critical workflows', 'in_progress', 'high', '${USER_ID}', '${USER_ID}', 11.0, NOW(), NOW()),
  
  -- Done (3 issues)
  ('demo-issue-12', 'demo-team-1', 'DEMO-12', '✅ Setup authentication', 'JWT + bcrypt authentication system', 'done', 'urgent', '${USER_ID}', '${USER_ID}', 12.0, NOW(), NOW()),
  ('demo-issue-13', 'demo-team-1', 'DEMO-13', '✅ Build Kanban board', 'Create board with virtual scrolling', 'done', 'high', '${USER_ID}', '${USER_ID}', 13.0, NOW(), NOW()),
  ('demo-issue-14', 'demo-team-1', 'DEMO-14', '✅ Add virtualized list', 'Implement react-window for performance', 'done', 'high', '${USER_ID}', '${USER_ID}', 14.0, NOW(), NOW()),
  
  -- Cancelled (1 issue)
  ('demo-issue-15', 'demo-team-1', 'DEMO-15', '❌ Legacy code migration', 'Decided to rewrite instead', 'cancelled', 'none', '${USER_ID}', NULL, 15.0, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
"

# Execute SQL
echo "$SQL_SCRIPT" | psql -d "$DB_NAME" -q

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Sample data created successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Database error. Make sure PostgreSQL is running and DATABASE_URL is set.${NC}"
    echo "You can manually run the SQL in TESTING_PHASE2.md"
fi

echo ""
echo -e "${BLUE}🎯 Feature URLs:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Virtualized List View:"
echo "   http://localhost:3000/team/demo-team-1/issues"
echo ""
echo "🎨 Kanban Board View:"
echo "   http://localhost:3000/team/demo-team-1/issues/board"
echo ""
echo "🔍 Issue Detail (example):"
echo "   http://localhost:3000/team/demo-team-1/issue/demo-issue-8"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Open browser (macOS)
echo -e "${BLUE}🌐 Opening Kanban board in browser...${NC}"
sleep 2
open "http://localhost:3000/team/demo-team-1/issues/board" 2>/dev/null || \
    echo "Visit: http://localhost:3000/team/demo-team-1/issues/board"

echo ""
echo -e "${GREEN}✨ Demo setup complete!${NC}"
echo ""
echo "What to test:"
echo "  • Drag issues between columns on the board"
echo "  • Switch to list view and scroll smoothly"
echo "  • Click an issue to see inline editing"
echo "  • Add comments with Markdown support"
echo "  • Test keyboard shortcuts (⌘K for command palette)"
echo ""
echo "See TESTING_PHASE2.md for detailed testing guide."
