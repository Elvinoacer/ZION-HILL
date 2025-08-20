"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Event, EventType } from '@/generated/prisma';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Plus, List } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export const EventsManagerDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newEventData, setNewEventData] = useState({
    title: '',
    type: 'EVENT' as EventType,
    date: '',
    location: '',
    description: '',
    imageUrl: '',
    time: '',
    capacity: 0,
  });

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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
      setNewEventData({ title: '', type: 'EVENT', date: '', location: '', description: '', imageUrl: '', time: '', capacity: 0 });
      fetchEvents();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="text-center py-8">Loading dashboard...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-6">
        <CalendarDays className="mr-3" /> Events Manager Dashboard
      </h1>

      {/* All Events List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><List className="mr-2" /> All Events</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p>No events found.</p>
          ) : (
            <ul className="space-y-2">
              {events.map((event) => (
                <li key={event.id} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(event.date), 'PPP')} {event.time && `at ${event.time}`}
                  </p>
                  <Link href={`/events-manager/dashboard/${event.id}`} className="text-blue-500 hover:underline">
                    View Details & RSVPs
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Create New Event Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Plus className="mr-2" /> Create New Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <Input
              type="text"
              placeholder="Event Title"
              value={newEventData.title}
              onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })}
              required
            />
            <select
              value={newEventData.type}
              onChange={(e) => setNewEventData({ ...newEventData, type: e.target.value as EventType })}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
            >
              {Object.values(EventType).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
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
              type="number"
              placeholder="Capacity (0 for unlimited)"
              value={newEventData.capacity === 0 ? '' : newEventData.capacity.toString()}
              onChange={(e) => setNewEventData({ ...newEventData, capacity: parseInt(e.target.value) || 0 })}
            />
            <Input
              type="text"
              placeholder="Location (Optional)"
              value={newEventData.location}
              onChange={(e) => setNewEventData({ ...newEventData, location: e.target.value })}
            />
            <Input
              type="url"
              placeholder="Image URL (Optional)"
              value={newEventData.imageUrl}
              onChange={(e) => setNewEventData({ ...newEventData, imageUrl: e.target.value })}
            />
            <Textarea
              placeholder="Description (Optional)"
              value={newEventData.description}
              onChange={(e) => setNewEventData({ ...newEventData, description: e.target.value })}
            />
            <Button type="submit" className="w-full">
              Create Event
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
