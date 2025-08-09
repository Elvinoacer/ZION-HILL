import { create } from "zustand";
import { Family, User } from "@/generated/prisma";

interface FamilyState {
  families: (Family & { members: User[] })[];
  loading: boolean;
  error: string | null;
  fetchFamilies: () => Promise<void>;
  createFamily: (family: Omit<Family, "id">) => Promise<void>;
  addFamilyMember: (familyId: string, userId: string) => Promise<void>;
}

export const useFamilyStore = create<FamilyState>((set) => ({
  families: [],
  loading: false,
  error: null,

  addFamilyMember: async (familyId, userId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/family/${familyId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        throw new Error(`Error adding family member: ${response.statusText}`);
      }
      const updatedUser = await response.json();
      set((state) => ({
        families: state.families.map((family) =>
          family.id === familyId
            ? { ...family, members: [...family.members, updatedUser] }
            : family
        ),
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchFamilies: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/family");
      if (!response.ok) {
        throw new Error(`Error fetching families: ${response.statusText}`);
      }
      const families = await response.json();
      set({ families, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  createFamily: async (family) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/family", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(family),
      });
      if (!response.ok) {
        throw new Error(`Error creating family: ${response.statusText}`);
      }
      const newFamily = await response.json();
      set((state) => ({
        families: [...state.families, newFamily],
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },
}));
