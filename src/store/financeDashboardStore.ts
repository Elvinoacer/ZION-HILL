
import { create } from 'zustand';

interface FinanceDashboardState {
  sidebarCollapsed: boolean;
  activeSection: string;
  mobileMenuOpen: boolean;
  searchQuery: string;
  planSearchQuery: string;
  setSidebarCollapsed: (isCollapsed: boolean) => void;
  setActiveSection: (section: string) => void;
  setMobileMenuOpen: (isOpen: boolean) => void;
  setSearchQuery: (query: string) => void;
  setPlanSearchQuery: (query: string) => void;
  toggleSidebar: () => void;
}

export const useFinanceDashboardStore = create<FinanceDashboardState>((set, get) => ({
  sidebarCollapsed: false,
  activeSection: "contributions",
  mobileMenuOpen: false,
  searchQuery: "",
  planSearchQuery: "",
  setSidebarCollapsed: (isCollapsed) => set({ sidebarCollapsed: isCollapsed }),
  setActiveSection: (section) => set({ activeSection: section }),
  setMobileMenuOpen: (isOpen) => set({ mobileMenuOpen: isOpen }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setPlanSearchQuery: (query) => set({ planSearchQuery: query }),
  toggleSidebar: () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      set({ mobileMenuOpen: !get().mobileMenuOpen });
    } else {
      set({ sidebarCollapsed: !get().sidebarCollapsed });
    }
  },
}));
