import { create } from "zustand";
import { User, Role, Family } from "@/generated/prisma"; // Assuming Prisma types are available

interface UserState {
  users: (User & { roles: Role[] })[];
  currentUser: (User & { roles: Role[]; family: Family | null }) | null;
  familyMembers: (User & { family: Family | null })[];
  membershipStatus: Role[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  fetchCurrentUser: (userId: string) => Promise<void>;
  fetchFamilyMembers: (familyId: string) => Promise<void>;
  fetchMembershipStatus: (userId: string) => Promise<void>;
  updateUserProfile: (userId: string, data: Partial<User>) => Promise<void>;
  
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  currentUser: null,
  familyMembers: [],
  membershipStatus: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error(`Error fetching users: ${response.statusText}`);
      }
      const users = await response.json();
      set({ users, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchCurrentUser: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/profile?type=user&userId=${userId}`);
      if (!response.ok) {
        throw new Error(`Error fetching user: ${response.statusText}`);
      }
      const user = await response.json();
      set({ currentUser: user, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchFamilyMembers: async (familyId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `/api/profile?type=family-members&familyId=${familyId}`
      );
      if (!response.ok) {
        throw new Error(
          `Error fetching family members: ${response.statusText}`
        );
      }
      const members = await response.json();
      set({ familyMembers: members, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchMembershipStatus: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `/api/profile?type=membership-status&userId=${userId}`
      );
      if (!response.ok) {
        throw new Error(
          `Error fetching membership status: ${response.statusText}`
        );
      }
      const status = await response.json();
      set({ membershipStatus: status, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  updateUserProfile: async (userId, data) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userId, ...data }),
      });
      if (!response.ok) {
        throw new Error(`Error updating user profile: ${response.statusText}`);
      }
      const updatedUser = await response.json();
      set((state) => ({
        currentUser: state.currentUser
          ? { ...state.currentUser, ...updatedUser }
          : updatedUser,
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  
}));
