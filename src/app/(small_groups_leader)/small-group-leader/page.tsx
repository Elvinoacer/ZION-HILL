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
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Small Group Leader Dashboard</h1>
        <p className="text-lg text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Small Group Leader Dashboard</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Small Group Leader Dashboard</h1>
      <p className="text-lg text-gray-600 mb-4">
        Facilitate discipleship and community building within your small group.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Small Groups</h2>
          {groups.length > 0 ? (
            <ul>
              {groups.map((group) => (
                <li key={group.id} className="mb-2">
                  <strong>{group.name}</strong>
                  <p className="text-gray-600 text-sm">{group.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No small groups found.</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Member Care</h2>
          <p>Spiritual health monitoring and personalized follow-up.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Resource Distribution</h2>
          <p>Digital library and discussion archives.</p>
        </div>
      </div>
    </div>
  );
};

export default SmallGroupLeaderDashboard;