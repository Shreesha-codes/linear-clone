import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Workspace {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  isLoading: boolean;
}

interface WorkspaceActions {
  setWorkspaces: (workspaces: Workspace[]) => void;
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  removeWorkspace: (id: string) => void;
  setActiveWorkspace: (id: string) => void;
  getActiveWorkspace: () => Workspace | null;
  setLoading: (isLoading: boolean) => void;
}

type WorkspaceStore = WorkspaceState & WorkspaceActions;

export const useWorkspaceStore = create<WorkspaceStore>()(
  devtools(
    (set, get) => ({
      // State
      workspaces: [],
      activeWorkspaceId: null,
      isLoading: false,

      // Actions
      setWorkspaces: (workspaces) => set({ workspaces }),

      addWorkspace: (workspace) =>
        set((state) => ({
          workspaces: [...state.workspaces, workspace],
        })),

      updateWorkspace: (id, updates) =>
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === id ? { ...workspace, ...updates } : workspace
          ),
        })),

      removeWorkspace: (id) =>
        set((state) => ({
          workspaces: state.workspaces.filter((workspace) => workspace.id !== id),
          activeWorkspaceId: state.activeWorkspaceId === id ? null : state.activeWorkspaceId,
        })),

      setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),

      getActiveWorkspace: () => {
        const state = get();
        return (
          state.workspaces.find((workspace) => workspace.id === state.activeWorkspaceId) || null
        );
      },

      setLoading: (isLoading) => set({ isLoading }),
    }),
    { name: 'WorkspaceStore' }
  )
);
