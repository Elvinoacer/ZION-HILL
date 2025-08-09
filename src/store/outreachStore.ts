import { create } from "zustand";
import { Event, Partner, Transaction, User, Waiver } from "@/generated/prisma";

interface OutreachState {
  outreachPrograms: Event[];
  trips: Event[];
  partners: Partner[];
  donations: Transaction[];
  volunteers: User[];
  waivers: Waiver[];
  loading: boolean;
  error: string | null;
  fetchOutreachPrograms: () => Promise<void>;
  fetchTrips: () => Promise<void>;
  fetchPartners: () => Promise<void>;
  fetchDonations: () => Promise<void>;
  fetchVolunteers: () => Promise<void>;
  fetchWaivers: () => Promise<void>;
  fetchedOutreachPrograms: boolean;
  fetchedTrips: boolean;
  fetchedPartners: boolean;
  fetchedDonations: boolean;
  fetchedVolunteers: boolean;
  fetchedWaivers: boolean;
}

export const useOutreachStore = create<OutreachState>((set) => ({
  outreachPrograms: [],
  trips: [],
  partners: [],
  donations: [],
  volunteers: [],
  waivers: [],
  loading: false,
  error: null,
  fetchedOutreachPrograms: false,
  fetchedTrips: false,
  fetchedPartners: false,
  fetchedDonations: false,
  fetchedVolunteers: false,
  fetchedWaivers: false,

  fetchOutreachPrograms: async () => {
    set((state) => {
      if (state.fetchedOutreachPrograms) {
        return {}; // Already fetched, do nothing
      }
      return { loading: true, error: null };
    });
    try {
      const response = await fetch("/api/outreach?type=outreach-programs");
      if (!response.ok) {
        throw new Error(
          `Error fetching outreach programs: ${response.statusText}`
        );
      }
      const programs = await response.json();
      set({ outreachPrograms: programs, loading: false, fetchedOutreachPrograms: true });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTrips: async () => {
    set((state) => {
      if (state.fetchedTrips) {
        return {}; // Already fetched, do nothing
      }
      return { loading: true, error: null };
    });
    try {
      const response = await fetch("/api/outreach?type=trips");
      if (!response.ok) {
        throw new Error(`Error fetching trips: ${response.statusText}`);
      }
      const trips = await response.json();
      set({ trips, loading: false, fetchedTrips: true });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchPartners: async () => {
    set((state) => {
      if (state.fetchedPartners) {
        return {}; // Already fetched, do nothing
      }
      return { loading: true, error: null };
    });
    try {
      const response = await fetch("/api/outreach?type=partners");
      if (!response.ok) {
        throw new Error(`Error fetching partners: ${response.statusText}`);
      }
      const partners = await response.json();
      set({ partners, loading: false, fetchedPartners: true });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchDonations: async () => {
    set((state) => {
      if (state.fetchedDonations) {
        return {}; // Already fetched, do nothing
      }
      return { loading: true, error: null };
    });
    try {
      const response = await fetch("/api/outreach?type=donations");
      if (!response.ok) {
        throw new Error(`Error fetching donations: ${response.statusText}`);
      }
      const donations = await response.json();
      set({ donations, loading: false, fetchedDonations: true });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchVolunteers: async () => {
    set((state) => {
      if (state.fetchedVolunteers) {
        return {}; // Already fetched, do nothing
      }
      return { loading: true, error: null };
    });
    try {
      const response = await fetch("/api/outreach?type=volunteers");
      if (!response.ok) {
        throw new Error(`Error fetching volunteers: ${response.statusText}`);
      }
      const volunteers = await response.json();
      set({ volunteers, loading: false, fetchedVolunteers: true });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchWaivers: async () => {
    set((state) => {
      if (state.fetchedWaivers) {
        return {}; // Already fetched, do nothing
      }
      return { loading: true, error: null };
    });
    try {
      const response = await fetch("/api/outreach?type=waivers");
      if (!response.ok) {
        throw new Error(`Error fetching waivers: ${response.statusText}`);
      }
      const waivers = await response.json();
      set({ waivers, loading: false, fetchedWaivers: true });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },
}));
