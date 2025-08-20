"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Group, Event, PrayerRequest, EventType } from '@/generated/prisma';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, MessageSquare, Plus } from 'lucide-react';
import { format } from 'date-fns';

export const SmallGroupsLeaderDashboard = () => {
  const [smallGroups, setSmallGroups] = useState<Group[]>([]);
  const [groupMeetings, setGroupMeetings] = useState<Event[]>([]);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newMeetingData, setNewMeetingData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    groupId: '', // To link to a specific small group
  });

  const fetchDashboardData = async () => {
    try {
      const [groupsRes, eventsRes, prayerRequestsRes] = await Promise.all([
        fetch('/api/groups'),
        fetch('/api/events?type=MEETING'), // Assuming group meetings are events of type MEETING
        fetch('/api/prayer-requests'),
      ]);

      if (!groupsRes.ok) throw new Error('Failed to fetch small groups');
      if (!eventsRes.ok) throw new Error('Failed to fetch group meetings');
      if (!prayerRequestsRes.ok) throw new Error('Failed to fetch prayer requests');

      const groupsData = await groupsRes.json();
      const eventsData = await eventsRes.json();
      const prayerRequestsData = await prayerRequestsRes.json();

      setSmallGroups(groupsData);
      setGroupMeetings(eventsData);
      setPrayerRequests(prayerRequestsData);
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

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newMeetingData,
          type: 'MEETING' as EventType, // Ensure it's a meeting type
          date: new Date(newMeetingData.date),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create meeting');
      }

      toast.success('Meeting created successfully!');
      setNewMeetingData({ title: '', date: '', time: '', location: '', description: '', groupId: '' });
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
        <Users className="mr-3" /> Small Groups Leader Dashboard
      </h1>

      {/* My Small Groups */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Users className="mr-2" /> My Small Groups</CardTitle>
        </CardHeader>
        <CardContent>
          {smallGroups.length === 0 ? (
            <p>No small groups found.</p>
          ) : (
            <ul className="space-y-2">
              {smallGroups.map((group) => (
                <li key={group.id} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{group.name}</p>
                  <p className="text-sm text-gray-600">{group.description}</p>
                  {/* Link to group details or members */}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Group Meetings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Calendar className="mr-2" /> Upcoming Group Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          {groupMeetings.length === 0 ? (
            <p>No upcoming group meetings.</p>
          ) : (
            <ul className="space-y-2">
              {groupMeetings.map((meeting) => (
                <li key={meeting.id} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{meeting.title}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(meeting.date), 'PPP')} {meeting.time && `at ${meeting.time}`}
                  </p>
                  <p className="text-xs text-gray-500">Group ID: {meeting.groupId || 'N/A'}</p>
                  {/* Add attendance tracking here */}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

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
                <li key={request.id} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{request.request}</p>
                  <p className="text-sm text-gray-600">Status: {request.status}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Create New Group Meeting Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Plus className="mr-2" /> Create New Group Meeting</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateMeeting} className="space-y-4">
            <Input
              type="text"
              placeholder="Meeting Title"
              value={newMeetingData.title}
              onChange={(e) => setNewMeetingData({ ...newMeetingData, title: e.target.value })}
              required
            />
            <Input
              type="date"
              value={newMeetingData.date}
              onChange={(e) => setNewMeetingData({ ...newMeetingData, date: e.target.value })}
              required
            />
            <Input
              type="time"
              value={newMeetingData.time}
              onChange={(e) => setNewMeetingData({ ...newMeetingData, time: e.target.value })}
              required
            />
            <Input
              type="text"
              placeholder="Location (Optional)"
              value={newMeetingData.location}
              onChange={(e) => setNewMeetingData({ ...newMeetingData, location: e.target.value })}
            />
            <Textarea
              placeholder="Description (Optional)"
              value={newMeetingData.description}
              onChange={(e) => setNewMeetingData({ ...newMeetingData, description: e.target.value })}
            />
            <select
              value={newMeetingData.groupId}
              onChange={(e) => setNewMeetingData({ ...newMeetingData, groupId: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
              required
            >
              <option value="">Select Small Group</option>
              {smallGroups.map((group) => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
            <Button type="submit" className="w-full">
              Create Meeting
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
