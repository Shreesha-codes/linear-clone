'use client';

import { useEffect } from 'react';
import { useTeamStore } from '@/stores/teamStore';
import { useWorkspaceStore } from '@/stores/workspaceStore';

/**
 * Mock data initializer for development
 * This will populate stores with sample data until API integration is complete
 */
export function useMockData() {
  const { workspaces, setWorkspaces, setActiveWorkspace } = useWorkspaceStore();
  const { teams, setTeams, setActiveTeam } = useTeamStore();

  useEffect(() => {
    // Only initialize if stores are empty (first load)
    if (workspaces.length === 0) {
      const mockWorkspaces = [
        {
          id: 'workspace-1',
          name: 'Acme Corp',
          slug: 'acme-corp',
          icon: '🏢',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'workspace-2',
          name: 'Personal Projects',
          slug: 'personal',
          icon: '👤',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      setWorkspaces(mockWorkspaces);
      setActiveWorkspace('workspace-1');
    }

    if (teams.length === 0) {
      const mockTeams = [
        {
          id: 'team-1',
          workspace_id: 'workspace-1',
          name: 'Engineering',
          identifier: 'ENG',
          description: 'Engineering team',
          icon: '⚙️',
          archived: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'team-2',
          workspace_id: 'workspace-1',
          name: 'Product',
          identifier: 'PROD',
          description: 'Product team',
          icon: '📦',
          archived: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'team-3',
          workspace_id: 'workspace-2',
          name: 'Side Projects',
          identifier: 'SIDE',
          description: 'Personal side projects',
          icon: '🚀',
          archived: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      setTeams(mockTeams);
      setActiveTeam('team-1');
    }
  }, [workspaces, teams, setWorkspaces, setActiveWorkspace, setTeams, setActiveTeam]);
}
