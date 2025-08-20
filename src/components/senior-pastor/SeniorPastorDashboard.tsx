"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Event, Group, PrayerRequest, Announcement, User } from '@/generated/prisma';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Church, Users, MessageSquare, Megaphone, Plus } from 'lucide-react';
import { format } from 'date-fns';

export const SeniorPastorDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newAnnouncementContent, setNewAnnouncementContent] = useState('');

  const fetchDashboardData = async () => {
    try {
      const [eventsRes, groupsRes, prayerRequestsRes, announcementsRes, usersRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/groups'),
        fetch('/api/prayer-requests'),
        fetch('/api/announcements'),
        fetch('/api/users'),
      ]);

      if (!eventsRes.ok) throw new Error('Failed to fetch events');
      if (!groupsRes.ok) throw new Error('Failed to fetch groups');
      if (!prayerRequestsRes.ok) throw new Error('Failed to fetch prayer requests');
      if (!announcementsRes.ok) throw new Error('Failed to fetch announcements');
      if (!usersRes.ok) throw new Error('Failed to fetch users');

      const eventsData = await eventsRes.json();
      const groupsData = await groupsRes.json();
      const prayerRequestsData = await prayerRequestsRes.json();
      const announcementsData = await announcementsRes.json();
      const usersData = await usersRes.json();

      setEvents(eventsData);
      setGroups(groupsData);
      setPrayerRequests(prayerRequestsData);
      setAnnouncements(announcementsData);
      setUsers(usersData);
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

  const handleBroadcastAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncementContent.trim()) {
      toast.error('Announcement content cannot be empty.');
      return;
    }
    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newAnnouncementContent }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to broadcast announcement');
      }

      toast.success('Announcement broadcasted successfully!');
      setNewAnnouncementContent('');
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleMarkPrayerRequestAsPrayed = async (id: string) => {
    try {
      const response = await fetch(`/api/prayer-requests?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PRAYED' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to mark prayer request as prayed');
      }

      toast.success('Prayer request marked as prayed!');
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
        <Church className="mr-3" /> Senior Pastor Dashboard
      </h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Total Events</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{events.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Groups</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{groups.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Users</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{users.length}</p></CardContent>
        </Card>
      </div>

      {/* Recent Prayer Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><MessageSquare className="mr-2" /> Recent Prayer Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {prayerRequests.length === 0 ? (
            <p>No recent prayer requests.</p>
          ) : (
            <ul className="space-y-2">
              {prayerRequests.map((request) => (
                <li key={request.id} className="border-b pb-2 last:border-b-0 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{request.request}</p>
                    <p className="text-sm text-gray-600">Status: {request.status}</p>
                  </div>
                  {request.status !== 'PRAYED' && (
                    <Button onClick={() => handleMarkPrayerRequestAsPrayed(request.id)} size="sm">
                      Mark as Prayed
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Broadcast Urgent Announcement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Plus className="mr-2" /> Broadcast Urgent Announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBroadcastAnnouncement} className="space-y-4">
            <Textarea
              placeholder="Type your urgent announcement here..."
              value={newAnnouncementContent}
              onChange={(e) => setNewAnnouncementContent({ ...newAnnouncementContent, content: e.target.value })}
              required
            />
            <Button type="submit" className="w-full">
              Broadcast Announcement
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
