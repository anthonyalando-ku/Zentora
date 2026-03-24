import { create } from "zustand";

type AdminUiState = {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
};

export const useAdminUiStore = create<AdminUiState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}));