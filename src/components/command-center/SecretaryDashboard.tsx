"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Message, Event, User, MessageType } from '@/generated/prisma';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Calendar, Users, Plus } from 'lucide-react';
import { format } from 'date-fns';

export const SecretaryDashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newMessageData, setNewMessageData] = useState({
    recipientId: '',
    subject: '',
    content: '',
    type: 'GENERAL' as MessageType,
  });

  const [newEventData, setNewEventData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    type: 'BOOKING' as EventType, // Assuming secretary handles bookings
  });

  const fetchDashboardData = async () => {
    try {
      const [messagesRes, eventsRes, usersRes] = await Promise.all([
        fetch('/api/messages'),
        fetch('/api/events'),
        fetch('/api/users'),
      ]);

      if (!messagesRes.ok) throw new Error('Failed to fetch messages');
      if (!eventsRes.ok) throw new Error('Failed to fetch events');
      if (!usersRes.ok) throw new Error('Failed to fetch users');

      const messagesData = await messagesRes.json();
      const eventsData = await eventsRes.json();
      const usersData = await usersRes.json();

      setMessages(messagesData);
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

  const handleSendMessage = async (e: React.FormEvent) => {
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

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEventData,
          date: new Date(newEventData.date),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }

      toast.success('Event created successfully!');
      setNewEventData({ title: '', date: '', time: '', location: '', description: '', type: 'BOOKING' });
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
        <Mail className="mr-3" /> Secretary Dashboard
      </h1>

      {/* Recent Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Mail className="mr-2" /> Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <p>No recent messages.</p>
          ) : (
            <ul className="space-y-2">
              {messages.map((message) => (
                <li key={message.id} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">From: {message.senderId} - Subject: {message.subject}</p>
                  <p className="text-sm text-gray-600">{message.content}</p>
                  <p className="text-xs text-gray-500">Type: {message.type} - {format(new Date(message.createdAt), 'PP')}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Events/Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Calendar className="mr-2" /> Upcoming Events/Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p>No upcoming events or bookings.</p>
          ) : (
            <ul className="space-y-2">
              {events.map((event) => (
                <li key={event.id} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(event.date), 'PPP')} {event.time && `at ${event.time}`}
                  </p>
                  <p className="text-xs text-gray-500">Location: {event.location || 'N/A'}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Create New Message Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Plus className="mr-2" /> Send New Message</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendMessage} className="space-y-4">
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

      {/* Create New Event/Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Plus className="mr-2" /> Create New Event/Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <Input
              type="text"
              placeholder="Event/Booking Title"
              value={newEventData.title}
              onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })}
              required
            />
            <Input
              type="date"
              value={newEventData.date}
              onChange={(e) => setNewEventData({ ...newEventData, date: e.target.value })}
              required
            />
            <Input
              type="time"
              value={newEventData.time}
              onChange={(e) => setNewEventData({ ...newEventData, time: e.target.value })}
              required
            />
            <Input
              type="text"
              placeholder="Location (Optional)"
              value={newEventData.location}
              onChange={(e) => setNewEventData({ ...newEventData, location: e.target.value })}
            />
            <Textarea
              placeholder="Description (Optional)"
              value={newEventData.description}
              onChange={(e) => setNewEventData({ ...newEventData, description: e.target.value })}
            />
            <select
              value={newEventData.type}
              onChange={(e) => setNewEventData({ ...newEventData, type: e.target.value as EventType })}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
              required
            >
              <option value="BOOKING">Booking</option>
              <option value="EVENT">Event</option>
              <option value="MEETING">Meeting</option>
              <option value="SERVICE">Service</option>
              <option value="TRIP">Trip</option>
              <option value="APPOINTMENT">Appointment</option>
              <option value="CLASS">Class</option>
            </select>
            <Button type="submit" className="w-full">
              Create Event/Booking
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
