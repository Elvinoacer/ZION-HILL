"use client";

import React, { useEffect, useState } from 'react';

interface Group {
  id: string;
  name: string;
  description?: string;
}

const SmallGroupLeaderDashboard = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Groups (assuming small groups are part of the general groups API)
        const groupsRes = await fetch('/api/groups');
        if (!groupsRes.ok) throw new Error('Failed to fetch groups');
        const groupsData = await groupsRes.json();
        setGroups(groupsData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">Small Group Leader Dashboard</h1>
        <p className="text-base sm:text-lg text-gray-400">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-6 max-w-md mx-auto text-center text-white shadow-lg">
          <h1 className="text-xl sm:text-2xl font-bold text-red-400 mb-2">
            Dashboard Error
          </h1>
          <p className="text-red-300 mb-6">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-800/50 hover:bg-red-800/80 text-red-200 font-semibold py-2 px-4 rounded-lg border border-red-700 transition-colors"
          >
            Retry Loading Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">Small Group Leader Dashboard</h1>
      <p className="text-base sm:text-lg text-gray-400 mb-4">
        Facilitate discipleship and community building within your small group.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">Your Small Groups</h2>
          {groups.length > 0 ? (
            <ul>
              {groups.map((group) => (
                <li key={group.id} className="mb-2">
                  <strong className="text-blue-400">{group.name}</strong>
                  <p className="text-gray-400 text-sm">{group.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No small groups found.</p>
          )}
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">Member Care</h2>
          <p className="text-gray-400">Spiritual health monitoring and personalized follow-up.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">Resource Distribution</h2>
          <p className="text-gray-400">Digital library and discussion archives.</p>
        </div>
      </div>
    </div>
  );
};

export default SmallGroupLeaderDashboard;