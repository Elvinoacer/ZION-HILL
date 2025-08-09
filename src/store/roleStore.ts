import { create } from 'zustand';
import { toast } from 'sonner';

interface Role {
  id: number;
  name: string;
}

interface RoleStore {
  roles: Role[];
  loading: boolean;
  error: string | null;
  fetchRoles: () => Promise<void>;
  createRole: (name: string) => Promise<void>;
  updateRole: (id: number, name: string) => Promise<void>;
  deleteRole: (id: number) => Promise<void>;
}

export const useRoleStore = create<RoleStore>((set) => ({
  roles: [],
  loading: false,
  error: null,
  fetchRoles: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/roles');
      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }
      const roles = await response.json();
      set({ roles, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },
  createRole: async (name) => {
    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        throw new Error('Failed to create role');
      }
      const newRole = await response.json();
      set((state) => ({ roles: [...state.roles, newRole] }));
      toast.success('Role created successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(errorMessage);
    }
  },
  updateRole: async (id, name) => {
    try {
      const response = await fetch('/api/roles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, name }),
      });
      if (!response.ok) {
        throw new Error('Failed to update role');
      }
      const updatedRole = await response.json();
      set((state) => ({
        roles: state.roles.map((role) => (role.id === id ? updatedRole : role)),
      }));
      toast.success('Role updated successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(errorMessage);
    }
  },
  deleteRole: async (id) => {
    try {
      const response = await fetch('/api/roles', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete role');
      }
      set((state) => ({ roles: state.roles.filter((role) => role.id !== id) }));
      toast.success('Role deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(errorMessage);
    }
  },
}));
