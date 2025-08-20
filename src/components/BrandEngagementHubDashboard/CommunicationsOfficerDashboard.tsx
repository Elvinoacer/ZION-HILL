"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Announcement, Event, User, MessageType } from '@/generated/prisma';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, Calendar, Users, Plus, Mail } from 'lucide-react';
import { format } from 'date-fns';

export const CommunicationsOfficerDashboard = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newAnnouncementContent, setNewAnnouncementContent] = useState('');
  const [newMessageData, setNewMessageData] = useState({
    recipientId: '',
    subject: '',
    content: '',
    type: 'GENERAL' as MessageType,
  });

  const fetchDashboardData = async () => {
    try {
      const [announcementsRes, eventsRes, usersRes] = await Promise.all([
        fetch('/api/announcements'),
        fetch('/api/events'),
        fetch('/api/users'),
      ]);

      if (!announcementsRes.ok) throw new Error('Failed to fetch announcements');
      if (!eventsRes.ok) throw new Error('Failed to fetch events');
      if (!usersRes.ok) throw new Error('Failed to fetch users');

      const announcementsData = await announcementsRes.json();
      const eventsData = await eventsRes.json();
      const usersData = await usersRes.json();

      setAnnouncements(announcementsData);
      setEvents(eventsData);
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

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
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
        throw new Error(errorData.error || 'Failed to create announcement');
      }

      toast.success('Announcement created successfully!');
      setNewAnnouncementContent('');
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleSendTargetedMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Assuming senderId comes from authenticated user session
      const senderId = 'current-user-id'; // Placeholder
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newMessageData, senderId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      toast.success('Message sent successfully!');
      setNewMessageData({ recipientId: '', subject: '', content: '', type: 'GENERAL' });
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
        <Megaphone className="mr-3" /> Communications Officer Dashboard
      </h1>

      {/* Recent Announcements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Megaphone className="mr-2" /> Recent Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          {announcements.length === 0 ? (
            <p>No recent announcements.</p>
          ) : (
            <ul className="space-y-2">
              {announcements.map((announcement) => (
                <li key={announcement.id} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{announcement.content}</p>
                  <p className="text-sm text-gray-600">{format(new Date(announcement.createdAt), 'PP')}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Events for Communication Planning */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Calendar className="mr-2" /> Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p>No upcoming events.</p>
          ) : (
            <ul className="space-y-2">
              {events.map((event) => (
                <li key={event.id} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(event.date), 'PPP')} {event.time && `at ${event.time}`}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Create New Announcement Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Plus className="mr-2" /> Create New Announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateAnnouncement} className="space-y-4">
            <Textarea
              placeholder="Announcement Content"
              value={newAnnouncementContent}
              onChange={(e) => setNewAnnouncementContent(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Post Announcement
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Send Targeted Message Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Mail className="mr-2" /> Send Targeted Message</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendTargetedMessage} className="space-y-4">
            <select
              value={newMessageData.recipientId}
              onChange={(e) => setNewMessageData({ ...newMessageData, recipientId: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
              required
            >
              <option value="">Select Recipient</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
              ))}
            </select>
            <Input
              type="text"
              placeholder="Subject"
              value={newMessageData.subject}
              onChange={(e) => setNewMessageData({ ...newMessageData, subject: e.target.value })}
              required
            />
            <Textarea
              placeholder="Message Content"
              value={newMessageData.content}
              onChange={(e) => setNewMessageData({ ...newMessageData, content: e.target.value })}
              required
            />
            <select
              value={newMessageData.type}
              onChange={(e) => setNewMessageData({ ...newMessageData, type: e.target.value as MessageType })}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
              required
            >
              <option value="GENERAL">General</option>
              <option value="EVENT_QUERY">Event Query</option>
              <option value="SUPPORT">Support</option>
              <option value="FEEDBACK">Feedback</option>
            </select>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
