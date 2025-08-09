"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Metrics {
  totalUsers: number;
  totalMinistries: number;
  totalEvents: number;
  totalDonations: number;
}

const AdminDashboardPage = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Fetch total users
        const usersRes = await fetch('/api/users');
        if (!usersRes.ok) throw new Error('Failed to fetch users');
        const usersData = await usersRes.json();

        // Fetch total ministries
        const ministriesRes = await fetch('/api/ministry');
        if (!ministriesRes.ok) throw new Error('Failed to fetch ministries');
        const ministriesData = await ministriesRes.json();

        // Fetch total events
        const eventsRes = await fetch('/api/events');
        if (!eventsRes.ok) throw new Error('Failed to fetch events');
        const eventsData = await eventsRes.json();

        // Fetch total donations
        const donationsRes = await fetch('/api/donations');
        if (!donationsRes.ok) throw new Error('Failed to fetch donations');
        const donationsData = await donationsRes.json();

        setMetrics({
          totalUsers: usersData.length,
          totalMinistries: ministriesData.ministries.length,
          totalEvents: eventsData.length,
          totalDonations: donationsData.length,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        <p className="text-lg text-gray-600">Loading metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <p className="text-lg text-gray-600 mb-4">
        Welcome to the administration panel. From here, you can manage various aspects of the church operations.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Users</h2>
          <p className="text-4xl font-bold text-indigo-600">{metrics?.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Ministries</h2>
          <p className="text-4xl font-bold text-indigo-600">{metrics?.totalMinistries}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Events</h2>
          <p className="text-4xl font-bold text-indigo-600">{metrics?.totalEvents}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Donations</h2>
          <p className="text-4xl font-bold text-indigo-600">{metrics?.totalDonations}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">User Management</h2>
          <p className="text-gray-600 mb-4">Manage users and roles.</p>
          <Link href="/admin/users" className="text-blue-600 hover:underline">Go to User Management</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Ministry Management</h2>
          <p className="text-gray-600 mb-4">Oversee church ministries.</p>
          <Link href="/admin/ministries" className="text-blue-600 hover:underline">Go to Ministry Management</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Event Management</h2>
          <p className="text-gray-600 mb-4">Plan and manage church events.</p>
          <Link href="/admin/events" className="text-blue-600 hover:underline">Go to Event Management</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Financial Overview</h2>
          <p className="text-gray-600 mb-4">Track donations and expenses.</p>
          <Link href="/admin/financials" className="text-blue-600 hover:underline">Go to Financial Overview</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Outreach Programs</h2>
          <p className="text-gray-600 mb-4">Manage community outreach initiatives.</p>
          <Link href="/admin/outreach" className="text-blue-600 hover:underline">Go to Outreach Programs</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Pastoral Care</h2>
          <p className="text-gray-600 mb-4">Manage counseling sessions and support groups.</p>
          <Link href="/admin/pastoral-care" className="text-blue-600 hover:underline">Go to Pastoral Care</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
