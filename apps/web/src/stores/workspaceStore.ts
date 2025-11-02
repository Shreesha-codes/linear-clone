import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Workspace {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  isLoading: boolean;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setActiveWorkspace: (workspace: Workspace | null) => void;
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  removeWorkspace: (id: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      workspaces: [],
      activeWorkspace: null,
      isLoading: false,
      setWorkspaces: (workspaces) => set({ workspaces }),
      setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
      addWorkspace: (workspace) =>
        set((state) => ({ workspaces: [...state.workspaces, workspace] })),
      updateWorkspace: (id, updates) =>
        set((state) => ({
          workspaces: state.workspaces.map((w) => (w.id === id ? { ...w, ...updates } : w)),
          activeWorkspace:
            state.activeWorkspace?.id === id
              ? { ...state.activeWorkspace, ...updates }
              : state.activeWorkspace,
        })),
      removeWorkspace: (id) =>
        set((state) => ({
          workspaces: state.workspaces.filter((w) => w.id !== id),
          activeWorkspace: state.activeWorkspace?.id === id ? null : state.activeWorkspace,
        })),
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'workspace-storage',
    }
  )
);
