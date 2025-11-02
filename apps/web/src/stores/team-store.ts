import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Team, TeamMember } from '@/types';

/**
 * Team State Interface
 */
interface TeamState {
  teams: Team[];
  activeTeam: Team | null;
  members: Map<string, TeamMember[]>; // teamId -> members
  isLoading: boolean;
}

/**
 * Team Actions Interface
 */
interface TeamActions {
  setTeams: (teams: Team[]) => void;
  setActiveTeam: (team: Team | null) => void;
  addTeam: (team: Team) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  removeTeam: (id: string) => void;
  archiveTeam: (id: string) => void;
  setMembers: (teamId: string, members: TeamMember[]) => void;
  addMember: (teamId: string, member: TeamMember) => void;
  removeMember: (teamId: string, memberId: string) => void;
  setLoading: (isLoading: boolean) => void;
  reset: () => void;
}

const initialState: TeamState = {
  teams: [],
  activeTeam: null,
  members: new Map(),
  isLoading: false,
};

/**
 * Team Store
 *
 * Manages team and team membership state.
 * Active team is persisted for navigation consistency.
 *
 * @example
 * ```tsx
 * const { activeTeam, teams, setActiveTeam } = useTeamStore();
 *
 * // Switch team
 * setActiveTeam(team);
 *
 * // Get team members
 * const members = useTeamMembers(teamId);
 * ```
 */
export const useTeamStore = create<TeamState & TeamActions>()(
  devtools(
    persist(
      (set, _get) => ({
        ...initialState,

        setTeams: (teams) => set({ teams }, false, 'team/setTeams'),

        setActiveTeam: (team) => set({ activeTeam: team }, false, 'team/setActive'),

        addTeam: (team) =>
          set(
            (state) => ({
              teams: [...state.teams, team],
            }),
            false,
            'team/add'
          ),

        updateTeam: (id, updates) =>
          set(
            (state) => ({
              teams: state.teams.map((t) => (t.id === id ? { ...t, ...updates } : t)),
              activeTeam:
                state.activeTeam?.id === id
                  ? { ...state.activeTeam, ...updates }
                  : state.activeTeam,
            }),
            false,
            'team/update'
          ),

        removeTeam: (id) =>
          set(
            (state) => ({
              teams: state.teams.filter((t) => t.id !== id),
              activeTeam: state.activeTeam?.id === id ? null : state.activeTeam,
            }),
            false,
            'team/remove'
          ),

        archiveTeam: (id) =>
          set(
            (state) => ({
              teams: state.teams.map((t) => (t.id === id ? { ...t, archived: true } : t)),
            }),
            false,
            'team/archive'
          ),

        setMembers: (teamId, members) =>
          set(
            (state) => {
              const newMembers = new Map(state.members);
              newMembers.set(teamId, members);
              return { members: newMembers };
            },
            false,
            'team/setMembers'
          ),

        addMember: (teamId, member) =>
          set(
            (state) => {
              const newMembers = new Map(state.members);
              const currentMembers = newMembers.get(teamId) || [];
              newMembers.set(teamId, [...currentMembers, member]);
              return { members: newMembers };
            },
            false,
            'team/addMember'
          ),

        removeMember: (teamId, memberId) =>
          set(
            (state) => {
              const newMembers = new Map(state.members);
              const currentMembers = newMembers.get(teamId) || [];
              newMembers.set(
                teamId,
                currentMembers.filter((m) => m.id !== memberId)
              );
              return { members: newMembers };
            },
            false,
            'team/removeMember'
          ),

        setLoading: (isLoading) => set({ isLoading }, false, 'team/setLoading'),

        reset: () => set(initialState, false, 'team/reset'),
      }),
      {
        name: 'linear-clone-team',
        partialize: (state) => ({
          activeTeam: state.activeTeam,
        }),
      }
    ),
    { name: 'TeamStore' }
  )
);

/**
 * Selector hooks
 */
export const useActiveTeam = () => useTeamStore((state) => state.activeTeam);
export const useTeams = () => useTeamStore((state) => state.teams);
export const useTeamMembers = (teamId: string) =>
  useTeamStore((state) => state.members.get(teamId) || []);
