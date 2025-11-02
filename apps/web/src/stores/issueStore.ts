import { create } from 'zustand';

type IssueStatus = 'backlog' | 'todo' | 'in_progress' | 'done' | 'cancelled';
type IssuePriority = 'none' | 'low' | 'medium' | 'high' | 'urgent';

interface Issue {
  id: string;
  identifier: string;
  title: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  assigneeId?: string;
  creatorId: string;
  teamId: string;
  projectId?: string;
  cycleId?: string;
  dueDate?: Date;
  estimate?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IssueFilters {
  status?: IssueStatus[];
  priority?: IssuePriority[];
  assigneeId?: string[];
  projectId?: string;
  cycleId?: string;
  search?: string;
}

interface IssueState {
  issues: Map<string, Issue>;
  filters: IssueFilters;
  isLoading: boolean;
  activeIssue: Issue | null;
  setIssues: (issues: Issue[]) => void;
  addIssue: (issue: Issue) => void;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  removeIssue: (id: string) => void;
  setFilters: (filters: IssueFilters) => void;
  clearFilters: () => void;
  setActiveIssue: (issue: Issue | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  // Optimistic update with rollback capability
  updateIssueOptimistic: (
    id: string,
    updates: Partial<Issue>
  ) => {
    rollback: () => void;
  };
}

export const useIssueStore = create<IssueState>((set, get) => ({
  issues: new Map(),
  filters: {},
  isLoading: false,
  activeIssue: null,
  setIssues: (issues) => set({ issues: new Map(issues.map((i) => [i.id, i])) }),
  addIssue: (issue) =>
    set((state) => {
      const newIssues = new Map(state.issues);
      newIssues.set(issue.id, issue);
      return { issues: newIssues };
    }),
  updateIssue: (id, updates) =>
    set((state) => {
      const newIssues = new Map(state.issues);
      const existing = newIssues.get(id);
      if (existing) {
        newIssues.set(id, { ...existing, ...updates, updatedAt: new Date() });
      }
      return {
        issues: newIssues,
        activeIssue:
          state.activeIssue?.id === id ? { ...state.activeIssue, ...updates } : state.activeIssue,
      };
    }),
  removeIssue: (id) =>
    set((state) => {
      const newIssues = new Map(state.issues);
      newIssues.delete(id);
      return {
        issues: newIssues,
        activeIssue: state.activeIssue?.id === id ? null : state.activeIssue,
      };
    }),
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),
  setActiveIssue: (issue) => set({ activeIssue: issue }),
  setIsLoading: (isLoading) => set({ isLoading }),
  updateIssueOptimistic: (id, updates) => {
    const state = get();
    const original = state.issues.get(id);

    // Apply optimistic update
    if (original) {
      const newIssues = new Map(state.issues);
      newIssues.set(id, { ...original, ...updates, updatedAt: new Date() });
      set({ issues: newIssues });
    }

    // Return rollback function
    return {
      rollback: () => {
        if (original) {
          const newIssues = new Map(get().issues);
          newIssues.set(id, original);
          set({ issues: newIssues });
        }
      },
    };
  },
}));
