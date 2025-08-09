import { create } from "zustand";
import { Asset, Sermon, Resource } from "@/generated/prisma";

interface ResourceState {
  resources: Asset[];
  sermons: Sermon[];
  equipment: Resource[];
  error: string | null;
  fetchResources: (type?: string) => Promise<void>;
  fetchSermons: () => Promise<void>;
  fetchEquipment: () => Promise<void>;
  createResource: (resource: Omit<Asset, "id">) => Promise<void>;
  tagAsset: (id: string, tag: string) => Promise<void>;
}

export const useResourceStore = create<ResourceState>((set) => ({
  resources: [],
  sermons: [],
  equipment: [],
  error: null,

  fetchResources: async (type) => {
    set({ error: null });
    try {
      const url = type ? `/api/resources?type=${type}` : "/api/resources";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching resources: ${response.statusText}`);
      }
      const resources = await response.json();
      set({ resources });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchSermons: async () => {
    set({ error: null });
    try {
      const response = await fetch("/api/digital-hub?type=sermons");
      if (!response.ok) {
        throw new Error(`Error fetching sermons: ${response.statusText}`);
      }
      const sermons = await response.json();
      set({ sermons, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchEquipment: async () => {
    set({ error: null });
    try {
      const response = await fetch("/api/digital-hub?type=equipment");
      if (!response.ok) {
        throw new Error(`Error fetching equipment: ${response.statusText}`);
      }
      const equipment = await response.json();
      set({ equipment, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  createResource: async (resource) => {
    set({ error: null });
    try {
      const response = await fetch("/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resource),
      });
      if (!response.ok) {
        throw new Error(`Error creating resource: ${response.statusText}`);
      }
      const newResource = await response.json();
      set((state) => ({
        resources: [...state.resources, newResource],
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  tagAsset: async (id, tag) => {
    set({ error: null });
    try {
      const response = await fetch("/api/digital-hub?type=tag-asset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, tag }),
      });
      if (!response.ok) {
        throw new Error(`Error tagging asset: ${response.statusText}`);
      }
      const updatedAsset = await response.json();
      set((state) => ({
        resources: state.resources.map((asset) =>
          asset.id === id ? { ...asset, tags: updatedAsset.tags } : asset
        ),
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },
}));
