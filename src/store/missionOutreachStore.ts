import { create } from "zustand";
import { Event, Fund, User, Asset, Partner } from "@/generated/prisma";

interface MissionOutreachState {
  itineraries: Event[];
  fundraisers: Fund[];
  missionaries: User[];
  documents: Asset[];
  outreachLocations: Event[];
  volunteers: User[];
  partners: Partner[];
  sharedDocuments: Asset[];
  loading: boolean;
  error: string | null;
  fetchedItineraries: boolean;
  fetchedFundraisers: boolean;
  fetchedMissionaries: boolean;
  fetchedDocuments: boolean;
  fetchedOutreachLocations: boolean;
  fetchedVolunteers: boolean;
  fetchedPartners: boolean;
  fetchedSharedDocuments: boolean;
  fetchItineraries: () => Promise<void>;
  fetchFundraisers: () => Promise<void>;
  fetchMissionaries: () => Promise<void>;
  fetchDocuments: () => Promise<void>;
  fetchOutreachLocations: () => Promise<void>;
  fetchVolunteers: () => Promise<void>;
  fetchPartners: () => Promise<void>;
  fetchSharedDocuments: () => Promise<void>;
  createItinerary: (itinerary: Omit<Event, "id">) => Promise<void>;
  createFundraiser: (fundraiser: Omit<Fund, "id">) => Promise<void>;
  createDocument: (document: Omit<Asset, "id">) => Promise<void>;
  createVolunteer: (volunteer: Omit<User, "id">) => Promise<void>;
  createSharedDocument: (document: Omit<Asset, "id">) => Promise<void>;
}

export const useMissionOutreachStore = create<MissionOutreachState>((set) => ({
  itineraries: [],
  fundraisers: [],
  missionaries: [],
  documents: [],
  outreachLocations: [],
  volunteers: [],
  partners: [],
  sharedDocuments: [],
  loading: false,
  error: null,
  fetchedItineraries: false,
  fetchedFundraisers: false,
  fetchedMissionaries: false,
  fetchedDocuments: false,
  fetchedOutreachLocations: false,
  fetchedVolunteers: false,
  fetchedPartners: false,
  fetchedSharedDocuments: false,

  fetchItineraries: async () => {
    set((state) => {
      if (state.fetchedItineraries) {
        return {}; // Already fetched, do nothing
      }
      return { loading: true, error: null };
    });
    try {
      const response = await fetch("/api/mission-outreach?type=itineraries");
      if (!response.ok) {
        throw new Error(`Error fetching itineraries: ${response.statusText}`);
      }
      const itineraries = await response.json();
      set({ itineraries, loading: false, fetchedItineraries: true });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchFundraisers: async () => {
    set((state) => {
      if (state.fetchedFundraisers) {
        return {}; // Already fetched, do nothing
      }
      return { loading: true, error: null };
    });
    try {
      const response = await fetch("/api/mission-outreach?type=fundraisers");
      if (!response.ok) {
        throw new Error(`Error fetching fundraisers: ${response.statusText}`);
      }
      const fundraisers = await response.json();
      set({ fundraisers, loading: false, fetchedFundraisers: true });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchMissionaries: async () => {
    set((state) => {
      if (state.fetchedMissionaries) {
        return {}; // Already fetched, do nothing
      }
      return { loading: true, error: null };
    });
    try {
      const response = await fetch("/api/mission-outreach?type=missionaries");
      if (!response.ok) {
        throw new Error(`Error fetching missionaries: ${response.statusText}`);
      }
      const missionaries = await response.json();
      set({ missionaries, loading: false, fetchedMissionaries: true });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchDocuments: async () => {
    set((state) => {
      if (state.fetchedDocuments) {
        return {}; // Already fetched, do nothing
      }
      return { loading: true, error: null };
    });
    try {
      const response = await fetch("/api/mission-outreach?type=documents");
      if (!response.ok) {
        throw new Error(`Error fetching documents: ${response.statusText}`);
      }
      const documents = await response.json();
      set({ documents, loading: false, fetchedDocuments: true });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchOutreachLocations: async () => {
    set((state) => {
      if (state.fetchedOutreachLocations) {
        return {}; // Already fetched, do nothing
      }
      return { loading: true, error: null };
    });
    try {
      const response = await fetch(
        "/api/mission-outreach?type=outreach-locations"
      );
      if (!response.ok) {
        throw new Error(
          `Error fetching outreach locations: ${response.statusText}`
        );
      }
      const outreachLocations = await response.json();
      set({ outreachLocations, loading: false, fetchedOutreachLocations: true });
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
      const response = await fetch("/api/mission-outreach?type=volunteers");
      if (!response.ok) {
        throw new Error(`Error fetching volunteers: ${response.statusText}`);
      }
      const volunteers = await response.json();
      set({ volunteers, loading: false, fetchedVolunteers: true });
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
      const response = await fetch("/api/mission-outreach?type=partners");
      if (!response.ok) {
        throw new Error(`Error fetching partners: ${response.statusText}`);
      }
      const partners = await response.json();
      set({ partners, loading: false, fetchedPartners: true });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchSharedDocuments: async () => {
    set((state) => {
      if (state.fetchedSharedDocuments) {
        return {}; // Already fetched, do nothing
      }
      return { loading: true, error: null };
    });
    try {
      const response = await fetch(
        "/api/mission-outreach?type=shared-documents"
      );
      if (!response.ok) {
        throw new Error(
          `Error fetching shared documents: ${response.statusText}`
        );
      }
      const sharedDocuments = await response.json();
      set({ sharedDocuments, loading: false, fetchedSharedDocuments: true });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  createItinerary: async (itinerary) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/mission-outreach?type=itineraries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itinerary),
      });
      if (!response.ok) {
        throw new Error(`Error creating itinerary: ${response.statusText}`);
      }
      const newItinerary = await response.json();
      set((state) => ({
        itineraries: [...state.itineraries, newItinerary],
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  createFundraiser: async (fundraiser) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/mission-outreach?type=fundraisers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fundraiser),
      });
      if (!response.ok) {
        throw new Error(`Error creating fundraiser: ${response.statusText}`);
      }
      const newFundraiser = await response.json();
      set((state) => ({
        fundraisers: [...state.fundraisers, newFundraiser],
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  createDocument: async (document) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/mission-outreach?type=documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(document),
      });
      if (!response.ok) {
        throw new Error(`Error creating document: ${response.statusText}`);
      }
      const newDocument = await response.json();
      set((state) => ({
        documents: [...state.documents, newDocument],
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  createVolunteer: async (volunteer) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/mission-outreach?type=volunteers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(volunteer),
      });
      if (!response.ok) {
        throw new Error(`Error creating volunteer: ${response.statusText}`);
      }
      const newVolunteer = await response.json();
      set((state) => ({
        volunteers: [...state.volunteers, newVolunteer],
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  createSharedDocument: async (document) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/mission-outreach?type=share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(document),
      });
      if (!response.ok) {
        throw new Error(
          `Error creating shared document: ${response.statusText}`
        );
      }
      const newSharedDoc = await response.json();
      set((state) => ({
        sharedDocuments: [...state.sharedDocuments, newSharedDoc],
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },
}));
