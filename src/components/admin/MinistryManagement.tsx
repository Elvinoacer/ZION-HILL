import React, { useState, useEffect } from 'react';
import { useMinistryStore } from '@/store';
import { Ministry, User } from '@/generated/prisma';

interface MinistryManagementProps {
  users: User[]; // Pass users to select ministry leader
}

const MinistryManagement: React.FC<MinistryManagementProps> = ({ users }) => {
  const { ministries, loading, error, fetchMinistries, createMinistry, updateMinistry, deleteMinistry, currentPage, pageSize, totalMinistries } = useMinistryStore();

  const [newMinistryName, setNewMinistryName] = useState('');
  const [newMinistryDescription, setNewMinistryDescription] = useState('');
  const [newMinistryLeaderId, setNewMinistryLeaderId] = useState<string | null>(null);
  const [editingMinistry, setEditingMinistry] = useState<Ministry | null>(null);

  useEffect(() => {
    fetchMinistries(currentPage, pageSize);
  }, [fetchMinistries, currentPage, pageSize]);

  const totalPages = Math.ceil(totalMinistries / pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchMinistries(page, pageSize);
    }
  };

  const handleCreateMinistry = async () => {
    if (newMinistryName.trim() && newMinistryLeaderId) {
      await createMinistry({
        name: newMinistryName.trim(),
        description: newMinistryDescription.trim(),
        leaderId: newMinistryLeaderId,
      });
      setNewMinistryName('');
      setNewMinistryDescription('');
      setNewMinistryLeaderId(null);
    }
  };

  const handleUpdateMinistry = async () => {
    if (editingMinistry) {
      await updateMinistry(editingMinistry.id, {
        name: editingMinistry.name,
        description: editingMinistry.description,
        leaderId: editingMinistry.leaderId,
      });
      setEditingMinistry(null);
    }
  };

  const handleDeleteMinistry = async (id: string) => {
    await deleteMinistry(id);
  };

  if (loading) return <div className="text-center py-8">Loading ministries...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Ministry Management</h2>

      {/* Add New Ministry */}
      <div className="mb-6 p-4 border rounded-md bg-gray-50">
        <h3 className="text-xl font-semibold mb-3">Add New Ministry</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Ministry Name"
            value={newMinistryName}
            onChange={(e) => setNewMinistryName(e.target.value)}
            className="border p-2 rounded-md w-full"
          />
          <input
            type="text"
            placeholder="Description (Optional)"
            value={newMinistryDescription}
            onChange={(e) => setNewMinistryDescription(e.target.value)}
            className="border p-2 rounded-md w-full"
          />
          <select
            value={newMinistryLeaderId || ''}
            onChange={(e) => setNewMinistryLeaderId(e.target.value)}
            className="border p-2 rounded-md w-full"
          >
            <option value="" disabled>Select Leader</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleCreateMinistry}
          disabled={!newMinistryName.trim() || !newMinistryLeaderId}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Ministry
        </button>
      </div>

      {/* Existing Ministries List */}
      <h3 className="text-xl font-semibold mb-3">Existing Ministries</h3>
      <div className="space-y-4">
        {ministries.length === 0 ? (
          <p>No ministries found.</p>
        ) : (
          ministries.map((ministry) => (
            <div key={ministry.id} className="p-4 border rounded-md bg-white flex flex-col md:flex-row justify-between items-start md:items-center">
              {editingMinistry?.id === ministry.id ? (
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={editingMinistry.name}
                    onChange={(e) => setEditingMinistry({ ...editingMinistry, name: e.target.value })}
                    className="border p-2 rounded-md w-full"
                  />
                  <input
                    type="text"
                    value={editingMinistry.description || ''}
                    onChange={(e) => setEditingMinistry({ ...editingMinistry, description: e.target.value })}
                    className="border p-2 rounded-md w-full"
                  />
                  <select
                    value={editingMinistry.leaderId || ''}
                    onChange={(e) => setEditingMinistry({ ...editingMinistry, leaderId: e.target.value })}
                    className="border p-2 rounded-md w-full"
                  >
                    <option value="" disabled>Select Leader</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex-grow">
                  <h4 className="font-bold text-lg">{ministry.name}</h4>
                  <p className="text-gray-600 text-sm">{ministry.description}</p>
                  <p className="text-gray-500 text-xs">Leader: {ministry.leader?.name || 'N/A'}</p>
                </div>
              )}
              <div className="flex space-x-2 mt-3 md:mt-0">
                {editingMinistry?.id === ministry.id ? (
                  <button
                    onClick={handleUpdateMinistry}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingMinistry(ministry)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDeleteMinistry(ministry.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalMinistries > pageSize && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MinistryManagement;
