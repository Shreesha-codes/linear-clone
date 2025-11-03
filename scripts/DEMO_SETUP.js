/**
 * 🎯 QUICK DEMO SETUP GUIDE
 *
 * This script helps you populate your Linear clone with demo data
 * to test all the Phase 2 components we just built.
 *
 * Run this in your browser console on http://localhost:3000
 */

// ============================================
// STEP 1: Create Demo Data in Zustand Stores
// ============================================

// Mock data generator
const generateMockIssues = (teamId, count = 50) => {
  const statuses = ['backlog', 'todo', 'in_progress', 'done', 'cancelled'];
  const priorities = ['none', 'low', 'medium', 'high', 'urgent'];
  const issues = [];

  for (let i = 1; i <= count; i++) {
    issues.push({
      id: `issue-${i}`,
      teamId: teamId,
      identifier: `DEMO-${i}`,
      title: `Demo Issue ${i}: ${getRandomTitle()}`,
      description: `This is a demo issue created to test the new features.\n\n**Status:** ${statuses[i % 5]}\n**Priority:** ${priorities[i % 5]}`,
      status: statuses[i % 5],
      priority: priorities[i % 5],
      assigneeId: i % 3 === 0 ? 'user-1' : null,
      creatorId: 'user-1',
      projectId: null,
      cycleId: null,
      parentId: null,
      dueDate: null,
      estimate: Math.floor(Math.random() * 8) + 1,
      sortOrder: i * 1000,
      archived: false,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - i * 43200000).toISOString(),
      assignee:
        i % 3 === 0
          ? {
              id: 'user-1',
              name: 'Demo User',
              email: 'demo@example.com',
              avatarUrl: null,
            }
          : null,
      creator: {
        id: 'user-1',
        name: 'Demo User',
        email: 'demo@example.com',
        avatarUrl: null,
      },
      labels: [],
    });
  }

  return issues;
};

const getRandomTitle = () => {
  const titles = [
    'Fix login authentication bug',
    'Add dark mode support',
    'Improve performance on dashboard',
    'Refactor API endpoints',
    'Update documentation',
    'Design new landing page',
    'Implement search functionality',
    'Fix mobile responsiveness',
    'Add unit tests',
    'Optimize database queries',
    'Create onboarding flow',
    'Fix drag and drop issues',
    'Add keyboard shortcuts',
    'Improve error handling',
    'Update dependencies',
  ];
  return titles[Math.floor(Math.random() * titles.length)];
};

// ============================================
// STEP 2: Populate the Issue Store
// ============================================

console.log('🚀 Starting demo data setup...');

// Access Zustand stores (they're available globally in dev mode)
const demoTeamId = 'demo-team-1';
const mockIssues = generateMockIssues(demoTeamId, 50);

// Populate issue store
if (window.useIssueStore) {
  const issueStore = window.useIssueStore.getState();
  issueStore.setIssues(mockIssues);
  console.log('✅ Created 50 demo issues');
} else {
  console.error('❌ Issue store not found. Make sure you are on the app.');
}

// ============================================
// STEP 3: Navigation Instructions
// ============================================

console.log(`
🎉 Demo data is ready! Here's how to test the new features:

📍 KANBAN BOARD (Drag & Drop):
   Navigate to: /team/${demoTeamId}/issues/board
   
   Features to test:
   ✅ Drag issues between columns
   ✅ See 5 status columns (Backlog, Todo, In Progress, Done, Cancelled)
   ✅ Click priority icon to change priority
   ✅ Scroll to see virtualized rendering

📍 VIRTUALIZED LIST VIEW:
   Navigate to: /team/${demoTeamId}/issues
   
   Features to test:
   ✅ Scroll through 50 issues smoothly
   ✅ Notice only ~20 rows are rendered (check DOM)
   ✅ Toggle filters and search
   ✅ Switch to Board view

📍 ISSUE DETAIL PAGE:
   Click any issue to open detail view
   
   Features to test:
   ✅ Edit title (inline, debounced)
   ✅ Edit description (TipTap editor)
   ✅ Change status/priority via dropdowns
   ✅ View property sidebar
   ✅ Try posting a comment

🔗 Quick Links (copy and paste):
   - Kanban Board: http://localhost:3000/team/${demoTeamId}/issues/board
   - List View: http://localhost:3000/team/${demoTeamId}/issues
   - First Issue: http://localhost:3000/team/${demoTeamId}/issue/issue-1
`);

// ============================================
// STEP 4: Create Team in Store (if needed)
// ============================================

if (window.useTeamStore) {
  const teamStore = window.useTeamStore.getState();

  const demoTeam = {
    id: demoTeamId,
    workspaceId: 'demo-workspace-1',
    name: 'Demo Team',
    identifier: 'DEMO',
    description: 'A demo team to test Phase 2 features',
    icon: null,
    archived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  teamStore.addTeam(demoTeam);
  teamStore.setActiveTeam(demoTeam);
  console.log('✅ Created demo team');
}

// ============================================
// STEP 5: Create Workspace (if needed)
// ============================================

if (window.useWorkspaceStore) {
  const workspaceStore = window.useWorkspaceStore.getState();

  const demoWorkspace = {
    id: 'demo-workspace-1',
    name: 'Demo Workspace',
    slug: 'demo',
    icon: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  workspaceStore.addWorkspace(demoWorkspace);
  workspaceStore.setActiveWorkspace(demoWorkspace);
  console.log('✅ Created demo workspace');
}

console.log('✨ All done! Navigate to the links above to see the features.');
