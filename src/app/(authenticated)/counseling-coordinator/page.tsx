"use client";

import React, { useEffect, useState } from 'react';

interface Session {
  id: string;
  date: string;
  status: string;
  counselor?: { name: string };
  client?: { name: string };
}

interface Group {
  id: string;
  name: string;
  description?: string;
}

const CounselingCoordinatorDashboard = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Sessions
        const sessionsRes = await fetch('/api/sessions');
        if (!sessionsRes.ok) throw new Error('Failed to fetch sessions');
        const sessionsData = await sessionsRes.json();
        setSessions(sessionsData);

        // Fetch Groups
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
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Counseling Coordinator Dashboard</h1>
        <p className="text-lg text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Counseling Coordinator Dashboard</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Counseling Coordinator Dashboard</h1>
      <p className="text-lg text-gray-600 mb-4">
        Manage pastoral care and mental health support services.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Counseling Sessions</h2>
          {sessions.length > 0 ? (
            <ul>
              {sessions.map((session) => (
                <li key={session.id} className="mb-2">
                  <strong>{new Date(session.date).toLocaleDateString()}</strong> - {session.status}
                  {/* Assuming counselor and client names are available in the fetched data */}
                  {session.counselor && <p className="text-gray-600 text-sm">Counselor: {session.counselor.name}</p>}
                  {session.client && <p className="text-gray-600 text-sm">Client: {session.client.name}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p>No counseling sessions found.</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Support Groups</h2>
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
            <p>No support groups found.</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Resource Coordination</h2>
          <p>Referral network, professional partnerships, and crisis intervention.</p>
        </div>
      </div>
    </div>
  );
};

export default CounselingCoordinatorDashboard;