import { create } from "zustand";
import { Role, VolunteerShift, User } from "@/generated/prisma";

interface VolunteerState {
  roles: Role[];
  shifts: VolunteerShift[];
  volunteers: User[];
  loading: boolean;
  error: string | null;
  fetchedRoles: boolean;
  fetchedShifts: boolean;
  fetchedVolunteers: boolean;
  fetchRoles: () => Promise<void>;
  fetchShifts: () => Promise<void>;
  fetchVolunteers: () => Promise<void>;
  scheduleShift: (shift: Omit<VolunteerShift, "id">) => Promise<void>;
  checkInVolunteer: (id: string) => Promise<void>;
}

export const useVolunteerStore = create<VolunteerState>((set) => ({
  roles: [],
  shifts: [],
  volunteers: [],
  loading: false,
  error: null,
  fetchedRoles: false,
  fetchedShifts: false,
  fetchedVolunteers: false,

  fetchRoles: async () => {
    set((state) => {
      if (state.fetchedRoles) {
        return {}; // Already fetched, do nothing
      }
      return { loading: true, error: null };
    });
    try {
      const response = await fetch("/api/volunteer?type=roles");
      if (!response.ok) {
        throw new Error(`Error fetching roles: ${response.statusText}`);
      }
      const roles = await response.json();
      set({ roles, loading: false, fetchedRoles: true });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchShifts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/volunteer?type=shifts");
      if (!response.ok) {
        throw new Error(`Error fetching shifts: ${response.statusText}`);
      }
      const shifts = await response.json();
      set({ shifts, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchVolunteers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/volunteer?type=volunteers");
      if (!response.ok) {
        throw new Error(`Error fetching volunteers: ${response.statusText}`);
      }
      const volunteers = await response.json();
      set({ volunteers, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  scheduleShift: async (shift) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/volunteer?type=schedule-shift", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shift),
      });
      if (!response.ok) {
        throw new Error(`Error scheduling shift: ${response.statusText}`);
      }
      const newShift = await response.json();
      set((state) => ({
        shifts: [...state.shifts, newShift],
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  checkInVolunteer: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/volunteer?type=check-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error(`Error checking in volunteer: ${response.statusText}`);
      }
      const checkedInShift = await response.json();
      set((state) => ({
        shifts: state.shifts.map((shift) =>
          shift.id === id
            ? { ...shift, checkedIn: checkedInShift.checkedIn }
            : shift
        ),
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },
}));
