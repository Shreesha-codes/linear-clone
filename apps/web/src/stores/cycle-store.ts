import type { Cycle } from '@/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Cycle State Interface
 */
interface CycleState {
  cycles: Map<string, Cycle>; // cycleId -> cycle
  activeCycle: Cycle | null;
  isLoading: boolean;
}

/**
 * Cycle Actions Interface
 */
interface CycleActions {
  setCycles: (cycles: Cycle[]) => void;
  setActiveCycle: (cycle: Cycle | null) => void;
  addCycle: (cycle: Cycle) => void;
  updateCycle: (id: string, updates: Partial<Cycle>) => void;
  removeCycle: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  reset: () => void;
}

const initialState: CycleState = {
  cycles: new Map(),
  activeCycle: null,
  isLoading: false,
};

/**
 * Cycle Store
 *
 * Manages cycle state with Map for O(1) lookups.
 * Supports CRUD operations and active/upcoming/past filtering.
 *
 * @example
 * ```tsx
 * const { cycles, addCycle, updateCycle } = useCycleStore();
 *
 * // Add cycle
 * addCycle(newCycle);
 *
 * // Update cycle
 * updateCycle(cycleId, { name: 'Q1 2025' });
 * ```
 */
export const useCycleStore = create<CycleState & CycleActions>()(
  devtools(
    (set, _get) => ({
      ...initialState,

      setCycles: (cycles) =>
        set(
          {
            cycles: new Map(cycles.map((cycle) => [cycle.id, cycle])),
          },
          false,
          'cycle/setCycles'
        ),

      setActiveCycle: (cycle) => set({ activeCycle: cycle }, false, 'cycle/setActiveCycle'),

      addCycle: (cycle) =>
        set(
          (state) => {
            const newCycles = new Map(state.cycles);
            newCycles.set(cycle.id, cycle);
            return { cycles: newCycles };
          },
          false,
          'cycle/add'
        ),

      updateCycle: (id, updates) =>
        set(
          (state) => {
            const newCycles = new Map(state.cycles);
            const existingCycle = newCycles.get(id);
            if (existingCycle) {
              newCycles.set(id, { ...existingCycle, ...updates });
            }
            return {
              cycles: newCycles,
              activeCycle:
                state.activeCycle?.id === id
                  ? { ...state.activeCycle, ...updates }
                  : state.activeCycle,
            };
          },
          false,
          'cycle/update'
        ),

      removeCycle: (id) =>
        set(
          (state) => {
            const newCycles = new Map(state.cycles);
            newCycles.delete(id);
            return {
              cycles: newCycles,
              activeCycle: state.activeCycle?.id === id ? null : state.activeCycle,
            };
          },
          false,
          'cycle/remove'
        ),

      setLoading: (isLoading) => set({ isLoading }, false, 'cycle/setLoading'),

      reset: () => set(initialState, false, 'cycle/reset'),
    }),
    { name: 'CycleStore' }
  )
);

/**
 * Selector hooks for better performance
 */
export const useCycles = () => {
  const cycles = useCycleStore((state) => state.cycles);
  return Array.from(cycles.values());
};

export const useCycle = (id: string) => useCycleStore((state) => state.cycles.get(id));

export const useCyclesByTeam = (teamId: string) => {
  const cycles = useCycles();
  return cycles.filter((cycle) => cycle.teamId === teamId);
};

export const useActiveCycle = () => useCycleStore((state) => state.activeCycle);

/**
 * Utility functions for cycle filtering
 */
export const getActiveCycles = (cycles: Cycle[]): Cycle[] => {
  const now = new Date();
  return cycles.filter((cycle) => {
    const start = new Date(cycle.startDate);
    const end = new Date(cycle.endDate);
    return start <= now && now <= end;
  });
};

export const getUpcomingCycles = (cycles: Cycle[]): Cycle[] => {
  const now = new Date();
  return cycles.filter((cycle) => new Date(cycle.startDate) > now);
};

export const getPastCycles = (cycles: Cycle[]): Cycle[] => {
  const now = new Date();
  return cycles.filter((cycle) => new Date(cycle.endDate) < now);
};

/**
 * Calculate cycle progress based on time
 */
export const calculateCycleProgress = (cycle: Cycle): number => {
  const now = new Date();
  const start = new Date(cycle.startDate);
  const end = new Date(cycle.endDate);

  if (now < start) return 0;
  if (now > end) return 100;

  const total = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  return Math.round((elapsed / total) * 100);
};

/**
 * Calculate days remaining in cycle
 */
export const getCycleDaysRemaining = (cycle: Cycle): number => {
  const now = new Date();
  const end = new Date(cycle.endDate);
  const diff = end.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
