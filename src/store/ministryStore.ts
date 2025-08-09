import { create } from "zustand";
import { Ministry, User, MinistryMember } from "@/generated/prisma";
export type ministryType = Ministry & { leader: User | null };
interface MinistryState {
  ministries: (Ministry & { leader: User | null })[];
  ministryMembers: (MinistryMember & { user: User })[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  totalMinistries: number;
  fetched: boolean; // Add this line
  fetchMinistries: (page?: number, pageSize?: number) => Promise<void>;
  fetchMinistryMembers: () => Promise<void>;
  createMinistry: (ministry: Omit<Ministry, "id">) => Promise<void>;
  updateMinistry: (
    ministryId: string,
    data: Partial<Ministry>
  ) => Promise<void>;
  deleteMinistry: (ministryId: string) => Promise<void>;
}

export const useMinistryStore = create<MinistryState>((set) => ({
  ministries: [],
  ministryMembers: [],
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  totalMinistries: 0,
  fetched: false, // Initialize fetched to false

  fetchMinistries: async (page = 1, pageSize = 10) => {
    set((state) => {
      if (state.fetched) {
        return {}; // Already fetched, do nothing
      }
      return { loading: true, error: null };
    });
    try {
      const response = await fetch(
        `/api/ministry?page=${page}&pageSize=${pageSize}`
      );
      if (!response.ok) {
        throw new Error(`Error fetching ministries: ${response.statusText}`);
      }
      const { ministries, totalMinistries } = await response.json();
      set({
        ministries,
        totalMinistries,
        currentPage: page,
        pageSize,
        loading: false,
        fetched: true,
      });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchMinistryMembers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/ministry?type=ministry-members");
      if (!response.ok) {
        throw new Error(
          `Error fetching ministry members: ${response.statusText}`
        );
      }
      const data = await response.json();
      const ministryMembers = Array.isArray(data) ? data : [];
      set({ ministryMembers, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  createMinistry: async (ministry) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/ministry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ministry),
      });
      if (!response.ok) {
        throw new Error(`Error creating ministry: ${response.statusText}`);
      }
      const newMinistry = await response.json();
      set((state) => ({
        ministries: [...state.ministries, newMinistry],
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  updateMinistry: async (ministryId, data) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/ministry", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: ministryId, ...data }),
      });
      if (!response.ok) {
        throw new Error(`Error updating ministry: ${response.statusText}`);
      }
      const updatedMinistry = await response.json();
      set((state) => ({
        ministries: state.ministries.map((ministry) =>
          ministry.id === ministryId
            ? { ...ministry, ...updatedMinistry }
            : ministry
        ),
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  deleteMinistry: async (ministryId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/ministry", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: ministryId }),
      });
      if (!response.ok) {
        throw new Error(`Error deleting ministry: ${response.statusText}`);
      }
      set((state) => ({
        ministries: state.ministries.filter(
          (ministry) => ministry.id !== ministryId
        ),
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },
}));
