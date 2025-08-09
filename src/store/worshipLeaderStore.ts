import { create } from "zustand";
import { Event, User, Asset } from "@/generated/prisma";

interface WorshipLeaderState {
  upcomingServices: Event[];
  teamMembers: User[];
  recentSongs: Asset[];
  loading: boolean;
  error: string | null;
  fetchUpcomingServices: () => Promise<void>;
  fetchTeamMembers: () => Promise<void>;
  fetchRecentSongs: () => Promise<void>;
}

export const useWorshipLeaderStore = create<WorshipLeaderState>((set) => ({
  upcomingServices: [],
  teamMembers: [],
  recentSongs: [],
  loading: false,
  error: null,

  fetchUpcomingServices: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        "/api/worship-leader?type=upcoming-services"
      );
      if (!response.ok) {
        throw new Error(
          `Error fetching upcoming services: ${response.statusText}`
        );
      }
      const services = await response.json();
      set({ upcomingServices: services, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTeamMembers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/worship-leader?type=team-members");
      if (!response.ok) {
        throw new Error(`Error fetching team members: ${response.statusText}`);
      }
      const members = await response.json();
      set({ teamMembers: members, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchRecentSongs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/worship-leader?type=recent-songs");
      if (!response.ok) {
        throw new Error(`Error fetching recent songs: ${response.statusText}`);
      }
      const songs = await response.json();
      set({ recentSongs: songs, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
