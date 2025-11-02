import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type IssueStatus = 'backlog' | 'todo' | 'in_progress' | 'done' | 'cancelled';
type IssuePriority = 'none' | 'low' | 'medium' | 'high' | 'urgent';

interface Issue {
  id: string;
  team_id: string;
  project_id: string | null;
  cycle_id: string | null;
  identifier: string;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  assignee_id: string | null;
  creator_id: string;
  parent_id: string | null;
  due_date: string | null;
  estimate: number | null;
  sort_order: number;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

interface IssueFilters {
  status?: IssueStatus[];
  priority?: IssuePriority[];
  assignee?: string[];
  labels?: string[];
  project?: string;
  cycle?: string;
  search?: string;
}

interface IssueState {
  issues: Map<string, Issue>;
  filters: IssueFilters;
  isLoading: boolean;
}

interface IssueActions {
  setIssues: (issues: Issue[]) => void;
  addIssue: (issue: Issue) => void;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  removeIssue: (id: string) => void;
  getIssue: (id: string) => Issue | null;
  getFilteredIssues: () => Issue[];
  setFilters: (filters: IssueFilters) => void;
  clearFilters: () => void;
  updateIssueOptimistic: (id: string, updates: Partial<Issue>) => Promise<void>;
  setLoading: (isLoading: boolean) => void;
}

type IssueStore = IssueState & IssueActions;

export const useIssueStore = create<IssueStore>()(
  devtools(
    (set, get) => ({
      // State
      issues: new Map(),
      filters: {},
      isLoading: false,

      // Actions
      setIssues: (issues) =>
        set({
          issues: new Map(issues.map((issue) => [issue.id, issue])),
        }),

      addIssue: (issue) =>
        set((state) => {
          const newIssues = new Map(state.issues);
          newIssues.set(issue.id, issue);
          return { issues: newIssues };
        }),

      updateIssue: (id, updates) =>
        set((state) => {
          const newIssues = new Map(state.issues);
          const existingIssue = newIssues.get(id);
          if (existingIssue) {
            newIssues.set(id, { ...existingIssue, ...updates });
          }
          return { issues: newIssues };
        }),

      removeIssue: (id) =>
        set((state) => {
          const newIssues = new Map(state.issues);
          newIssues.delete(id);
          return { issues: newIssues };
        }),

      getIssue: (id) => {
        const state = get();
        return state.issues.get(id) || null;
      },

      getFilteredIssues: () => {
        const state = get();
        let filtered = Array.from(state.issues.values());

        const { filters } = state;

        if (filters.status && filters.status.length > 0) {
          filtered = filtered.filter((issue) => filters.status?.includes(issue.status));
        }

        if (filters.priority && filters.priority.length > 0) {
          filtered = filtered.filter((issue) => filters.priority?.includes(issue.priority));
        }

        if (filters.assignee && filters.assignee.length > 0) {
          filtered = filtered.filter(
            (issue) => issue.assignee_id && filters.assignee?.includes(issue.assignee_id)
          );
        }

        if (filters.project) {
          filtered = filtered.filter((issue) => issue.project_id === filters.project);
        }

        if (filters.cycle) {
          filtered = filtered.filter((issue) => issue.cycle_id === filters.cycle);
        }

        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter(
            (issue) =>
              issue.title.toLowerCase().includes(searchLower) ||
              issue.identifier.toLowerCase().includes(searchLower) ||
              issue.description?.toLowerCase().includes(searchLower)
          );
        }

        return filtered.sort((a, b) => a.sort_order - b.sort_order);
      },

      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),

      clearFilters: () => set({ filters: {} }),

      updateIssueOptimistic: async (id, updates) => {
        const state = get();
        const originalIssue = state.issues.get(id);

        if (!originalIssue) return;

        // Optimistic update
        get().updateIssue(id, updates);

        // TODO: Implement API integration (Phase 4.4+)
        // This function requires:
        // 1. API client implementation in src/lib/api/client.ts
        // 2. Backend endpoint integration: PATCH /api/v1/issues/:id
        // 3. WebSocket event handling for real-time sync
        // 4. Comprehensive error handling with rollback logic
        // 5. Unit tests for success/failure scenarios
        //
        // Example implementation:
        // try {
        //   const response = await apiClient(`/issues/${id}`, {
        //     method: 'PATCH',
        //     body: JSON.stringify(updates),
        //   });
        //   // WebSocket will handle broadcasting to other clients
        // } catch (err) {
        //   // Rollback on error
        //   set((state) => {
        //     const newIssues = new Map(state.issues);
        //     newIssues.set(id, originalIssue);
        //     return { issues: newIssues };
        //   });
        //   throw err;
        // }
      },
      setLoading: (isLoading) => set({ isLoading }),
    }),
    { name: 'IssueStore' }
  )
);
