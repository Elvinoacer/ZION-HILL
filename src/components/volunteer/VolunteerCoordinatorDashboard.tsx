"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User, VolunteerShift, Event } from '@/generated/prisma';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Plus, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export const VolunteerCoordinatorDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [volunteerShifts, setVolunteerShifts] = useState<VolunteerShift[]>([]);
  const [events, setEvents] = useState<Event[]>([]); // To link shifts to events
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newShiftData, setNewShiftData] = useState({
    userId: '',
    eventId: '',
    time: '',
    conflictCheck: false,
    replacementPool: [],
    checkedIn: false,
  });

  const fetchDashboardData = async () => {
    try {
      const [usersRes, shiftsRes, eventsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/volunteer-shifts'),
        fetch('/api/events'),
      ]);

      if (!usersRes.ok) throw new Error('Failed to fetch users');
      if (!shiftsRes.ok) throw new Error('Failed to fetch volunteer shifts');
      if (!eventsRes.ok) throw new Error('Failed to fetch events');

      const usersData = await usersRes.json();
      const shiftsData = await shiftsRes.json();
      const eventsData = await eventsRes.json();

      setUsers(usersData);
      setVolunteerShifts(shiftsData);
      setEvents(eventsData);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateShift = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/volunteer-shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newShiftData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create shift');
      }

      toast.success('Volunteer shift created successfully!');
      setNewShiftData({ userId: '', eventId: '', time: '', conflictCheck: false, replacementPool: [], checkedIn: false });
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleCheckIn = async (id: string) => {
    try {
      const response = await fetch(`/api/volunteer-shifts?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkedIn: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check in volunteer');
      }

      toast.success('Volunteer checked in!');
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="text-center py-8">Loading dashboard...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-6">
        <Users className="mr-3" /> Volunteer Coordinator Dashboard
      </h1>

      {/* Upcoming Volunteer Shifts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Calendar className="mr-2" /> Upcoming Shifts</CardTitle>
        </CardHeader>
        <CardContent>
          {volunteerShifts.length === 0 ? (
            <p>No upcoming volunteer shifts.</p>
          ) : (
            <ul className="space-y-2">
              {volunteerShifts.map((shift) => (
                <li key={shift.id} className="border-b pb-2 last:border-b-0 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{shift.user?.name || 'Unknown User'} for {shift.event?.title || 'Unknown Event'}</p>
                    <p className="text-sm text-gray-600">Time: {shift.time}</p>
                    <p className="text-xs text-gray-500">Checked In: {shift.checkedIn ? 'Yes' : 'No'}</p>
                  </div>
                  {!shift.checkedIn && (
                    <Button onClick={() => handleCheckIn(shift.id)} size="sm">
                      Check In
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Create New Volunteer Shift Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Plus className="mr-2" /> Create New Shift</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateShift} className="space-y-4">
            <select
              value={newShiftData.userId}
              onChange={(e) => setNewShiftData({ ...newShiftData, userId: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
              required
            >
              <option value="">Select Volunteer</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
              ))}
            </select>
            <select
              value={newShiftData.eventId}
              onChange={(e) => setNewShiftData({ ...newShiftData, eventId: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
              required
            >
              <option value="">Select Event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>{event.title} ({format(new Date(event.date), 'PP')})</option>
              ))}
            </select>
            <Input
              type="time"
              placeholder="Shift Time"
              value={newShiftData.time}
              onChange={(e) => setNewShiftData({ ...newShiftData, time: e.target.value })}
              required
            />
            <Button type="submit" className="w-full">
              Create Shift
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
