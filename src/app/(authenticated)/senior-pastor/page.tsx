"use client";

import React, { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
}

interface Ministry {
  id: string;
  name: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
}

const SeniorPastorDashboard = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalMinistries, setTotalMinistries] = useState<number | null>(null);
  const [totalEvents, setTotalEvents] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total users
        const usersRes = await fetch('/api/users');
        if (!usersRes.ok) throw new Error('Failed to fetch users');
        const usersData = await usersRes.json();
        setTotalUsers(usersData.length);

        // Fetch total ministries
        const ministriesRes = await fetch('/api/ministry');
        if (!ministriesRes.ok) throw new Error('Failed to fetch ministries');
        const ministriesData = await ministriesRes.json();
        setTotalMinistries(ministriesData.ministries.length);

        // Fetch total events
        const eventsRes = await fetch('/api/events');
        if (!eventsRes.ok) throw new Error('Failed to fetch events');
        const eventsData = await eventsRes.json();
        setTotalEvents(eventsData.length);

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
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Senior Pastor Dashboard</h1>
        <p className="text-lg text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Senior Pastor Dashboard</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Senior Pastor Dashboard</h1>
      <p className="text-lg text-gray-600 mb-4">
        Oversee spiritual growth and church leadership.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Church Growth Metrics</h2>
          <p>Total Users: {totalUsers !== null ? totalUsers : 'N/A'}</p>
          <p>Total Ministries: {totalMinistries !== null ? totalMinistries : 'N/A'}</p>
          <p>Total Events: {totalEvents !== null ? totalEvents : 'N/A'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Communication & Announcements</h2>
          <p>Broadcast urgent announcements and send personalized emails.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Leadership & Oversight</h2>
          <p>Approve ministry budgets, assign admin privileges, and manage counseling requests.</p>
        </div>
      </div>
    </div>
  );
};

export default SeniorPastorDashboard;