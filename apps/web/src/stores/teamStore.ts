import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Team {
  id: string;
  name: string;
  identifier: string;
  icon?: string;
  workspaceId: string;
}

interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface TeamState {
  teams: Team[];
  activeTeam: Team | null;
  teamMembers: Record<string, TeamMember[]>;
  isLoading: boolean;
  setTeams: (teams: Team[]) => void;
  setActiveTeam: (team: Team | null) => void;
  setTeamMembers: (teamId: string, members: TeamMember[]) => void;
  addTeam: (team: Team) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  removeTeam: (id: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set) => ({
      teams: [],
      activeTeam: null,
      teamMembers: {},
      isLoading: false,
      setTeams: (teams) => set({ teams }),
      setActiveTeam: (team) => set({ activeTeam: team }),
      setTeamMembers: (teamId, members) =>
        set((state) => ({ teamMembers: { ...state.teamMembers, [teamId]: members } })),
      addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
      updateTeam: (id, updates) =>
        set((state) => ({
          teams: state.teams.map((t) => (t.id === id ? { ...t, ...updates } : t)),
          activeTeam:
            state.activeTeam?.id === id ? { ...state.activeTeam, ...updates } : state.activeTeam,
        })),
      removeTeam: (id) =>
        set((state) => ({
          teams: state.teams.filter((t) => t.id !== id),
          activeTeam: state.activeTeam?.id === id ? null : state.activeTeam,
        })),
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'team-storage',
    }
  )
);
