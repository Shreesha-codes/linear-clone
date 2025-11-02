import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Team {
  id: string;
  workspace_id: string;
  name: string;
  identifier: string;
  description: string | null;
  icon: string | null;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
  };
  created_at: string;
}

interface TeamState {
  teams: Team[];
  activeTeamId: string | null;
  teamMembersCache: Map<string, TeamMember[]>;
  isLoading: boolean;
}

interface TeamActions {
  setTeams: (teams: Team[]) => void;
  addTeam: (team: Team) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  removeTeam: (id: string) => void;
  setActiveTeam: (id: string) => void;
  getActiveTeam: () => Team | null;
  setTeamMembers: (teamId: string, members: TeamMember[]) => void;
  getTeamMembers: (teamId: string) => TeamMember[];
  setLoading: (isLoading: boolean) => void;
}

type TeamStore = TeamState & TeamActions;

export const useTeamStore = create<TeamStore>()(
  devtools(
    (set, get) => ({
      // State
      teams: [],
      activeTeamId: null,
      teamMembersCache: new Map(),
      isLoading: false,

      // Actions
      setTeams: (teams) => set({ teams }),
      addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),

      updateTeam: (id, updates) =>
        set((state) => ({
          teams: state.teams.map((team) => (team.id === id ? { ...team, ...updates } : team)),
        })),

      removeTeam: (id) =>
        set((state) => {
          const newCache = new Map(state.teamMembersCache);
          newCache.delete(id);
          return {
            teams: state.teams.filter((team) => team.id !== id),
            activeTeamId: state.activeTeamId === id ? null : state.activeTeamId,
            teamMembersCache: newCache,
          };
        }),

      setActiveTeam: (id) => set({ activeTeamId: id }),

      getActiveTeam: () => {
        const state = get();
        return state.teams.find((team) => team.id === state.activeTeamId) || null;
      },

      setTeamMembers: (teamId, members) =>
        set((state) => {
          const newCache = new Map(state.teamMembersCache);
          newCache.set(teamId, members);
          return { teamMembersCache: newCache };
        }),

      getTeamMembers: (teamId) => {
        const state = get();
        return state.teamMembersCache.get(teamId) || [];
      },

      setLoading: (isLoading) => set({ isLoading }),
    }),
    { name: 'TeamStore' }
  )
);
