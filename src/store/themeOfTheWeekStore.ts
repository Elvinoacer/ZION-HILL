import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface ThemeOfTheWeekState {
  theme: {
    id: string;
    title: string;
    verse: string;
    reference: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  loading: boolean;
  error: string | null;
  fetchTheme: () => Promise<void>;
}

export const useThemeOfTheWeekStore = create<ThemeOfTheWeekState>()(
  devtools(
    persist(
      (set) => ({
        theme: null,
        loading: false,
        error: null,
        fetchTheme: async () => {
          set({ loading: true, error: null });
          try {
            const response = await fetch('/api/theme-of-the-week');
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            set({ theme: data, loading: false });
          } catch (error: unknown) {
            set({ error: error.message, loading: false });
          }
        },
      }),
      {
        name: 'theme-of-the-week-storage',
      }
    )
  )
);
