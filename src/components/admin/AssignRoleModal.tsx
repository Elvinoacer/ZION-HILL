import React, { useState, useEffect } from 'react';

interface AssignRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleAssigned: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  roles: { name: string }[];
}

interface Role {
  id: number;
  name: string;
  users: { id: string; name: string; email: string }[];
}

const AssignRoleModal: React.FC<AssignRoleModalProps> = ({ isOpen, onClose, onRoleAssigned }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/roles'),
      ]);

      if (!usersRes.ok) throw new Error('Failed to fetch users');
      if (!rolesRes.ok) throw new Error('Failed to fetch roles');

      const usersData: User[] = await usersRes.json();
      const rolesData: Role[] = await rolesRes.json();

      setUsers(usersData);
      setRoles(rolesData);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUserId || !selectedRoleId) {
      setError('Please select a user and a role.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`/api/users/${selectedUserId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roleId: selectedRoleId }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to assign role');
      }

      setSuccess('Role assigned successfully!');
      onRoleAssigned();
      // Optionally close modal after success or allow further assignments
      // onClose();
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred during assignment');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Assign Role to User</h2>
        {loading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {success && <p className="text-green-500">Success: {success}</p>}

        <div className="mb-4">
          <label htmlFor="user-search" className="block text-sm font-medium text-gray-700">Search User:</label>
          <input
            type="text"
            id="user-search"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mb-4 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
          {filteredUsers.length === 0 && !loading && <p>No users found.</p>}
          {filteredUsers.map(user => (
            <div
              key={user.id}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedUserId === user.id ? 'bg-blue-100' : ''}`}
              onClick={() => setSelectedUserId(user.id)}
            >
              <p className="font-medium">{user.name} ({user.email})</p>
              <p className="text-sm text-gray-500">Current Roles: {user.roles.map(r => r.name).join(', ') || 'None'}</p>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label htmlFor="role-select" className="block text-sm font-medium text-gray-700">Select Role:</label>
          <select
            id="role-select"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={selectedRoleId || ''}
            onChange={(e) => setSelectedRoleId(Number(e.target.value))}
          >
            <option value="" disabled>Select a role</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>
                {role.name} {role.users.length > 0 ? `(${role.users.map(u => u.name).join(', ')})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={handleAssignRole}
            disabled={loading || !selectedUserId || !selectedRoleId}
          >
            Assign Role
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignRoleModal;
