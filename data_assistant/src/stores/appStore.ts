import { create } from 'zustand';

interface AppState {
  sidebarCollapsed: boolean;
  selectedDataRange: string;
  selectedDataSources: string[];
  user: { name: string; avatar: string };
  toggleSidebar: () => void;
  setDataRange: (range: string) => void;
  toggleDataSource: (source: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  selectedDataRange: 'Finance DM',
  selectedDataSources: ['Customer Revenue'],
  user: { name: 'Ember', avatar: '' },

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setDataRange: (range) => set({ selectedDataRange: range }),
  toggleDataSource: (source) =>
    set((s) => ({
      selectedDataSources: s.selectedDataSources.includes(source)
        ? s.selectedDataSources.filter((d) => d !== source)
        : [...s.selectedDataSources, source],
    })),
}));
