import { create } from 'zustand';

interface OutreachDirectorState {
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useOutreachDirectorStore = create<OutreachDirectorState>((set) => ({
  sidebarCollapsed: false, // Default to expanded on desktop
  mobileMenuOpen: false, // Default to closed on mobile
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
}));
