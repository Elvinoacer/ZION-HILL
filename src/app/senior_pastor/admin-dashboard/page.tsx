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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mb-4"></div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-base sm:text-lg text-gray-300">Loading metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Admin Dashboard</h1>
        <div className="bg-red-900/30 border-l-4 border-red-500 p-4 mb-6 rounded-lg shadow-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-300">Error: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 sm:p-6 md:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-base sm:text-lg text-gray-300">
          Welcome to the administration panel. From here, you can manage various aspects of the church operations.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Users Card */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider">Total Users</h2>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-2">{metrics?.totalUsers}</p>
            </div>
            <div className="bg-blue-900/30 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Ministries Card */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider">Total Ministries</h2>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-2">{metrics?.totalMinistries}</p>
            </div>
            <div className="bg-green-900/30 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Events Card */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider">Total Events</h2>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-2">{metrics?.totalEvents}</p>
            </div>
            <div className="bg-purple-900/30 p-3 rounded-lg">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Donations Card */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-amber-500">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider">Total Donations</h2>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-2">{metrics?.totalDonations}</p>
            </div>
            <div className="bg-amber-900/30 p-3 rounded-lg">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Management */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-900/30 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-white">User Management</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-300 mb-6">Manage users and their roles within the church community.</p>
            <Link href="/senior_pastor/users" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium">
              Go to User Management
              <svg className="w-4 h-4 ml-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Ministry Management */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-900/30 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-white">Ministry Management</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-300 mb-6">Oversee and organize all church ministries and groups.</p>
            <Link href="/overall_ministries_coordinator/admin/ministries" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium">
              Go to Ministry Management
              <svg className="w-4 h-4 ml-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Event Management */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-purple-900/30 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-white">Event Management</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-300 mb-6">Plan and manage all church events and activities.</p>
            <Link href="/events_manager/events" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium">
              Go to Event Management
              <svg className="w-4 h-4 ml-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-amber-900/30 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-white">Financial Overview</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-300 mb-6">Track donations, expenses, and financial reports.</p>
            <Link href="/finance_administrator/financials" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium">
              Go to Financial Overview
              <svg className="w-4 h-4 ml-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Outreach Programs */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-teal-900/30 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-white">Outreach Programs</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-300 mb-6">Manage community outreach and mission programs.</p>
            <Link href="/outreach_director/outreach" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium">
              Go to Outreach Programs
              <svg className="w-4 h-4 ml-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Pastoral Care */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-indigo-900/30 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-white">Pastoral Care</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-300 mb-6">Manage counseling sessions and support groups.</p>
            <Link href="/senior_pastor/pastoral-care" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium">
              Go to Pastoral Care
              <svg className="w-4 h-4 ml-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Role Management */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-red-900/30 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-white">Role Management</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-300 mb-6">Manage user roles and permissions within the system.</p>
            <Link href="/senior_pastor/role-management" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium">
              Go to Role Management
              <svg className="w-4 h-4 ml-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Institutions Management */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-orange-900/30 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-white">Institutions Management</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-300 mb-6">Manage church-owned schools, clinics, and other institutions.</p>
            <Link href="/admin/institutions" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium">
              Go to Institutions Management
              <svg className="w-4 h-4 ml-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;