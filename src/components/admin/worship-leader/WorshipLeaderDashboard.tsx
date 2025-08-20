"use client";
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Event, SongProposal, Announcement } from '@/generated/prisma';
import { Button } from '@/components/ui/button';
import { Input }m '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Music, Megaphone, Plus } from 'lucide-react';

export const WorshipLeaderDashboard = () => {
  const [services, setServices] = useState<Event[]>([]);
  const [songProposals, setSongProposals] = useState<SongProposal[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newServiceData, setNewServiceData] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    location: '',
    imageUrl: '',
  });

  const fetchDashboardData = async () => {
    try {
      const [servicesRes, songProposalsRes, announcementsRes] = await Promise.all([
        fetch('/api/services?type=SERVICE'),
        fetch('/api/song-proposals'),
        fetch('/api/announcements'),
      ]);

      if (!servicesRes.ok) throw new Error('Failed to fetch services');
      if (!songProposalsRes.ok) throw new Error('Failed to fetch song proposals');
      if (!announcementsRes.ok) throw new Error('Failed to fetch announcements');

      const servicesData = await servicesRes.json();
      const songProposalsData = await songProposalsRes.json();
      const announcementsData = await announcementsRes.json();

      setServices(servicesData);
      setSongProposals(songProposalsData);
      setAnnouncements(announcementsData);
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

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newServiceData,
          type: 'SERVICE',
          date: new Date(newServiceData.date),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create service');
      }

      toast.success('Service created successfully!');
      setNewServiceData({ title: '', date: '', time: '', description: '', location: '', imageUrl: '' });
      fetchDashboardData(); // Re-fetch data to update the list
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="text-center py-8">Loading dashboard...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-6">
        <CalendarDays className="mr-3" /> Worship Leader Dashboard
      </h1>

      {/* Upcoming Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><CalendarDays className="mr-2" /> Upcoming Services</CardTitle>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <p>No upcoming services.</p>
          ) : (
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.id} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{service.title}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(service.date), 'PPP')} {service.time && `at ${service.time}`}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Song Proposals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Music className="mr-2" /> Song Proposals</CardTitle>
        </CardHeader>
        <CardContent>
          {songProposals.length === 0 ? (
            <p>No new song proposals.</p>
          ) : (
            <ul className="space-y-2">
              {songProposals.map((proposal) => (
                <li key={proposal.id} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{proposal.title} by {proposal.artist}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Announcements */}
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
                  <p className="text-sm text-gray-700">{announcement.content}</p>
                  <p className="text-xs text-gray-500">{format(new Date(announcement.createdAt), 'PP')}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Create New Service Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Plus className="mr-2" /> Create New Service</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateService} className="space-y-4">
            <Input
              type="text"
              placeholder="Service Title"
              value={newServiceData.title}
              onChange={(e) => setNewServiceData({ ...newServiceData, title: e.target.value })}
              required
            />
            <Input
              type="date"
              value={newServiceData.date}
              onChange={(e) => setNewServiceData({ ...newServiceData, date: e.target.value })}
              required
            />
            <Input
              type="time"
              value={newServiceData.time}
              onChange={(e) => setNewServiceData({ ...newServiceData, time: e.target.value })}
              required
            />
            <Input
              type="text"
              placeholder="Location (Optional)"
              value={newServiceData.location}
              onChange={(e) => setNewServiceData({ ...newServiceData, location: e.target.value })}
            />
            <Input
              type="url"
              placeholder="Image URL (Optional)"
              value={newServiceData.imageUrl}
              onChange={(e) => setNewServiceData({ ...newServiceData, imageUrl: e.target.value })}
            />
            <Textarea
              placeholder="Description (Optional)"
              value={newServiceData.description}
              onChange={(e) => setNewServiceData({ ...newServiceData, description: e.target.value })}
            />
            <Button type="submit" className="w-full">
              Create Service
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
