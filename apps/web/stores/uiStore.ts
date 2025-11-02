import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface UIState {
  theme: Theme;
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  activeModal: string | null;
  modalData: Record<string, unknown> | null;
}

interface UIActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
  openModal: (modalId: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        theme: 'light',
        sidebarCollapsed: false,
        commandPaletteOpen: false,
        activeModal: null,
        modalData: null,

        // Actions
        setTheme: (theme) => {
          set({ theme });
          if (typeof window !== 'undefined') {
            if (theme === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
        },

        toggleTheme: () => {
          const currentTheme = get().theme;
          const newTheme = currentTheme === 'light' ? 'dark' : 'light';
          get().setTheme(newTheme);
        },

        toggleSidebar: () =>
          set((state) => ({
            sidebarCollapsed: !state.sidebarCollapsed,
          })),

        setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

        openCommandPalette: () => set({ commandPaletteOpen: true }),

        closeCommandPalette: () => set({ commandPaletteOpen: false }),

        toggleCommandPalette: () =>
          set((state) => ({
            commandPaletteOpen: !state.commandPaletteOpen,
          })),

        openModal: (modalId, data) => set({ activeModal: modalId, modalData: data ?? null }),

        closeModal: () => set({ activeModal: null, modalData: null }),
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
        }),
      }
    ),
    { name: 'UIStore' }
  )
);
