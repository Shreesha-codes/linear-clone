import type { Workspace, WorkspaceMember } from '@/types';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Workspace State Interface
 */
interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  members: Map<string, WorkspaceMember[]>; // workspaceId -> members
  isLoading: boolean;
}

/**
 * Workspace Actions Interface
 */
interface WorkspaceActions {
  setWorkspaces: (workspaces: Workspace[]) => void;
  setActiveWorkspace: (workspace: Workspace | null) => void;
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  removeWorkspace: (id: string) => void;
  setMembers: (workspaceId: string, members: WorkspaceMember[]) => void;
  addMember: (workspaceId: string, member: WorkspaceMember) => void;
  removeMember: (workspaceId: string, memberId: string) => void;
  setLoading: (isLoading: boolean) => void;
  reset: () => void;
}

const initialState: WorkspaceState = {
  workspaces: [],
  activeWorkspace: null,
  members: new Map(),
  isLoading: false,
};

/**
 * Workspace Store
 *
 * Manages workspace and workspace membership state.
 * Active workspace is persisted across sessions.
 *
 * @example
 * ```tsx
 * const { activeWorkspace, setActiveWorkspace } = useWorkspaceStore();
 *
 * // Switch workspace
 * setActiveWorkspace(workspace);
 * ```
 */
export const useWorkspaceStore = create<WorkspaceState & WorkspaceActions>()(
  devtools(
    persist(
      (set, _get) => ({
        ...initialState,

        setWorkspaces: (workspaces) => set({ workspaces }, false, 'workspace/setWorkspaces'),

        setActiveWorkspace: (workspace) =>
          set({ activeWorkspace: workspace }, false, 'workspace/setActive'),

        addWorkspace: (workspace) =>
          set(
            (state) => ({
              workspaces: [...state.workspaces, workspace],
            }),
            false,
            'workspace/add'
          ),

        updateWorkspace: (id, updates) =>
          set(
            (state) => ({
              workspaces: state.workspaces.map((w) => (w.id === id ? { ...w, ...updates } : w)),
              activeWorkspace:
                state.activeWorkspace?.id === id
                  ? { ...state.activeWorkspace, ...updates }
                  : state.activeWorkspace,
            }),
            false,
            'workspace/update'
          ),

        removeWorkspace: (id) =>
          set(
            (state) => ({
              workspaces: state.workspaces.filter((w) => w.id !== id),
              activeWorkspace: state.activeWorkspace?.id === id ? null : state.activeWorkspace,
            }),
            false,
            'workspace/remove'
          ),

        setMembers: (workspaceId, members) =>
          set(
            (state) => {
              const newMembers = new Map(state.members);
              newMembers.set(workspaceId, members);
              return { members: newMembers };
            },
            false,
            'workspace/setMembers'
          ),

        addMember: (workspaceId, member) =>
          set(
            (state) => {
              const newMembers = new Map(state.members);
              const currentMembers = newMembers.get(workspaceId) || [];
              newMembers.set(workspaceId, [...currentMembers, member]);
              return { members: newMembers };
            },
            false,
            'workspace/addMember'
          ),

        removeMember: (workspaceId, memberId) =>
          set(
            (state) => {
              const newMembers = new Map(state.members);
              const currentMembers = newMembers.get(workspaceId) || [];
              newMembers.set(
                workspaceId,
                currentMembers.filter((m) => m.id !== memberId)
              );
              return { members: newMembers };
            },
            false,
            'workspace/removeMember'
          ),

        setLoading: (isLoading) => set({ isLoading }, false, 'workspace/setLoading'),

        reset: () => set(initialState, false, 'workspace/reset'),
      }),
      {
        name: 'linear-clone-workspace',
        partialize: (state) => ({
          activeWorkspace: state.activeWorkspace,
        }),
      }
    ),
    { name: 'WorkspaceStore' }
  )
);

/**
 * Selector hooks
 */
export const useActiveWorkspace = () => useWorkspaceStore((state) => state.activeWorkspace);
export const useWorkspaces = () => useWorkspaceStore((state) => state.workspaces);
export const useWorkspaceMembers = (workspaceId: string) =>
  useWorkspaceStore((state) => state.members.get(workspaceId) || []);
