import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Issue, IssueFilters } from '@/types';

/**
 * Issue State Interface
 */
interface IssueState {
  issues: Map<string, Issue>; // issueId -> issue
  filters: IssueFilters;
  activeIssue: Issue | null;
  isLoading: boolean;
  optimisticUpdates: Map<string, Partial<Issue>>; // For optimistic UI
}

/**
 * Issue Actions Interface
 */
interface IssueActions {
  setIssues: (issues: Issue[]) => void;
  addIssue: (issue: Issue) => void;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  removeIssue: (id: string) => void;
  setActiveIssue: (issue: Issue | null) => void;
  setFilters: (filters: IssueFilters) => void;
  clearFilters: () => void;
  setLoading: (isLoading: boolean) => void;

  // Optimistic updates with rollback support
  updateIssueOptimistic: (id: string, updates: Partial<Issue>) => Promise<void>;
  rollbackOptimisticUpdate: (id: string) => void;

  reset: () => void;
}

const initialState: IssueState = {
  issues: new Map(),
  filters: {},
  activeIssue: null,
  isLoading: false,
  optimisticUpdates: new Map(),
};

/**
 * Issue Store
 *
 * Manages issue state with optimistic updates and WebSocket sync support.
 * Uses Map for O(1) lookups and efficient updates.
 *
 * @example
 * ```tsx
 * const { issues, updateIssueOptimistic, setFilters } = useIssueStore();
 *
 * // Optimistic update
 * await updateIssueOptimistic(issueId, { status: 'done' });
 *
 * // Apply filters
 * setFilters({ status: ['todo', 'in_progress'] });
 * ```
 */
export const useIssueStore = create<IssueState & IssueActions>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setIssues: (issues) =>
        set(
          {
            issues: new Map(issues.map((issue) => [issue.id, issue])),
          },
          false,
          'issue/setIssues'
        ),

      addIssue: (issue) =>
        set(
          (state) => {
            const newIssues = new Map(state.issues);
            newIssues.set(issue.id, issue);
            return { issues: newIssues };
          },
          false,
          'issue/add'
        ),

      updateIssue: (id, updates) =>
        set(
          (state) => {
            const newIssues = new Map(state.issues);
            const existingIssue = newIssues.get(id);
            if (existingIssue) {
              newIssues.set(id, { ...existingIssue, ...updates });
            }
            return {
              issues: newIssues,
              activeIssue:
                state.activeIssue?.id === id
                  ? { ...state.activeIssue, ...updates }
                  : state.activeIssue,
            };
          },
          false,
          'issue/update'
        ),

      removeIssue: (id) =>
        set(
          (state) => {
            const newIssues = new Map(state.issues);
            newIssues.delete(id);
            return {
              issues: newIssues,
              activeIssue: state.activeIssue?.id === id ? null : state.activeIssue,
            };
          },
          false,
          'issue/remove'
        ),

      setActiveIssue: (issue) => set({ activeIssue: issue }, false, 'issue/setActive'),

      setFilters: (filters) => set({ filters }, false, 'issue/setFilters'),

      clearFilters: () => set({ filters: {} }, false, 'issue/clearFilters'),

      setLoading: (isLoading) => set({ isLoading }, false, 'issue/setLoading'),

      /**
       * Optimistic update with API call
       * Updates UI immediately, then syncs with server
       * Rolls back on failure
       */
      updateIssueOptimistic: async (id, updates) => {
        const state = get();
        const originalIssue = state.issues.get(id);

        if (!originalIssue) {
          throw new Error(`Issue ${id} not found`);
        }

        // Store original for rollback
        const optimisticUpdates = new Map(state.optimisticUpdates);
        optimisticUpdates.set(id, originalIssue);

        // Apply optimistic update
        get().updateIssue(id, updates);
        set({ optimisticUpdates }, false, 'issue/optimistic');

        try {
          // TODO: Call API to persist changes
          // await apiClient.updateIssue(id, updates);

          // Clear optimistic update on success
          const newOptimisticUpdates = new Map(get().optimisticUpdates);
          newOptimisticUpdates.delete(id);
          set({ optimisticUpdates: newOptimisticUpdates }, false, 'issue/commitOptimistic');
        } catch (error) {
          // Rollback on failure
          get().rollbackOptimisticUpdate(id);
          throw error;
        }
      },

      rollbackOptimisticUpdate: (id) => {
        const state = get();
        const originalIssue = state.optimisticUpdates.get(id);

        if (originalIssue) {
          get().updateIssue(id, originalIssue);
          const newOptimisticUpdates = new Map(state.optimisticUpdates);
          newOptimisticUpdates.delete(id);
          set({ optimisticUpdates: newOptimisticUpdates }, false, 'issue/rollback');
        }
      },

      reset: () => set(initialState, false, 'issue/reset'),
    }),
    { name: 'IssueStore' }
  )
);

/**
 * Selector hooks for better performance
 */
export const useIssues = () => {
  const issues = useIssueStore((state) => state.issues);
  return Array.from(issues.values());
};

export const useIssue = (id: string) => useIssueStore((state) => state.issues.get(id));

export const useFilteredIssues = () => {
  const issues = useIssues();
  const filters = useIssueStore((state) => state.filters);

  return issues.filter((issue) => {
    if (filters.status && !filters.status.includes(issue.status)) return false;
    if (filters.priority && !filters.priority.includes(issue.priority)) return false;
    if (filters.assigneeId && !filters.assigneeId.includes(issue.assigneeId || '')) return false;
    if (filters.projectId !== undefined && issue.projectId !== filters.projectId) return false;
    if (filters.cycleId !== undefined && issue.cycleId !== filters.cycleId) return false;
    if (filters.search && !issue.title.toLowerCase().includes(filters.search.toLowerCase()))
      return false;

    return true;
  });
};

export const useActiveIssue = () => useIssueStore((state) => state.activeIssue);
export const useIssueFilters = () => useIssueStore((state) => state.filters);
