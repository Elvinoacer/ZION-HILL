import { create } from 'zustand';

interface DigitalHubState {
  loading: boolean;
  error: string | null;
  switchCameraPreset: (preset: string) => Promise<void>;
  recallLightingScene: (scene: string) => Promise<void>;
  processSermon: (sermonId: string) => Promise<void>;
  tagAsset: (assetId: string, tag: string) => Promise<void>;
  saveContentVersion: (contentBlocks: unknown[]) => Promise<void>;
  createTicket: (issue: string, priority: string) => Promise<void>;
}

export const useDigitalHubStore = create<DigitalHubState>((set) => ({
  loading: false,
  error: null,

  switchCameraPreset: async (preset) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/digital-hub?type=camera-preset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preset }),
      });
      if (!response.ok) {
        throw new Error(`Error switching camera preset: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  recallLightingScene: async (scene) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/digital-hub?type=lighting-scene', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scene }),
      });
      if (!response.ok) {
        throw new Error(`Error recalling lighting scene: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  processSermon: async (sermonId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/digital-hub?type=process-sermon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sermonId }),
      });
      if (!response.ok) {
        throw new Error(`Error processing sermon: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  tagAsset: async (assetId, tag) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/digital-hub?type=tag-asset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assetId, tag }),
      });
      if (!response.ok) {
        throw new Error(`Error tagging asset: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  saveContentVersion: async (contentBlocks) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/digital-hub?type=save-content-version', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentBlocks }),
      });
      if (!response.ok) {
        throw new Error(`Error saving content version: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  createTicket: async (issue, priority) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/digital-hub?type=create-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ issue, priority, status: 'Open', creatorId: 'clw021111000008l701111111' }), // Assuming a default creatorId
      });
      if (!response.ok) {
        throw new Error(`Error creating ticket: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  saveContentVersion: async (contentBlocks) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/digital-hub?type=save-content-version', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentBlocks }),
      });
      if (!response.ok) {
        throw new Error(`Error saving content version: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  processSermon: async (sermonId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/digital-hub?type=process-sermon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sermonId }),
      });
      if (!response.ok) {
        throw new Error(`Error processing sermon: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },
}));
