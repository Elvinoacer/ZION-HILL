"use client";
import React, { useState, useEffect } from 'react';
import { toast } 'sonner';
import { Event, Partner, Transaction } from '@/generated/prisma';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Handshake, DollarSign, Plus } from 'lucide-react';
import { format } from 'date-fns';

export const OutreachDirectorDashboard = () => {
  const [outreachEvents, setOutreachEvents] = useState<Event[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [donationLogs, setDonationLogs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newOutreachEventData, setNewOutreachEventData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    imageUrl: '',
    time: '',
  });

  const [newDonationLogData, setNewDonationLogData] = useState({
    amount: 0,
    description: '',
    method: 'CASH', // Default method
  });

  const fetchDashboardData = async () => {
    try {
      const [eventsRes, partnersRes, transactionsRes] = await Promise.all([
        fetch('/api/events?type=OUTREACH'), // Assuming OUTREACH type for events
        fetch('/api/partners'),
        fetch('/api/transactions'),
      ]);

      if (!eventsRes.ok) throw new Error('Failed to fetch outreach events');
      if (!partnersRes.ok) throw new Error('Failed to fetch partners');
      if (!transactionsRes.ok) throw new Error('Failed to fetch donation logs');

      const eventsData = await eventsRes.json();
      const partnersData = await partnersRes.json();
      const transactionsData = await transactionsRes.json();

      setOutreachEvents(eventsData);
      setPartners(partnersData);
      setDonationLogs(transactionsData);
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

  const handleCreateOutreachEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newOutreachEventData,
          type: 'OUTREACH',
          date: new Date(newOutreachEventData.date),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create outreach event');
      }

      toast.success('Outreach event created successfully!');
      setNewOutreachEventData({ title: '', date: '', location: '', description: '', imageUrl: '', time: '' });
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleRecordDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDonationLogData,
          type: 'DONATION', // Assuming DONATION type for transactions
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to record donation');
      }

      toast.success('Donation recorded successfully!');
      setNewDonationLogData({ amount: 0, description: '', method: 'CASH' });
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
        <MapPin className="mr-3" /> Outreach Director Dashboard
      </h1>

      {/* Upcoming Outreach Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><MapPin className="mr-2" /> Upcoming Outreach Events</CardTitle>
        </CardHeader>
        <CardContent>
          {outreachEvents.length === 0 ? (
            <p>No upcoming outreach events.</p>
          ) : (
            <ul className="space-y-2">
              {outreachEvents.map((event) => (
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

      {/* Partners */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Handshake className="mr-2" /> Community Partners</CardTitle>
        </CardHeader>
        <CardContent>
          {partners.length === 0 ? (
            <p>No partners found.</p>
          ) : (
            <ul className="space-y-2">
              {partners.map((partner) => (
                <li key={partner.id} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{partner.name}</p>
                  <p className="text-sm text-gray-600">Type: {partner.type}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Recent Donation Distributions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><DollarSign className="mr-2" /> Recent Donation Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {donationLogs.length === 0 ? (
            <p>No recent donation logs.</p>
          ) : (
            <ul className="space-y-2">
              {donationLogs.map((log) => (
                <li key={log.id} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">Amount: {log.amount}</p>
                  <p className="text-sm text-gray-600">{log.description}</p>
                  <p className="text-xs text-gray-500">{format(new Date(log.date), 'PP')}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Create New Outreach Event Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Plus className="mr-2" /> Create New Outreach Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateOutreachEvent} className="space-y-4">
            <Input
              type="text"
              placeholder="Event Title"
              value={newOutreachEventData.title}
              onChange={(e) => setNewOutreachEventData({ ...newOutreachEventData, title: e.target.value })}
              required
            />
            <Input
              type="date"
              value={newOutreachEventData.date}
              onChange={(e) => setNewOutreachEventData({ ...newOutreachEventData, date: e.target.value })}
              required
            />
            <Input
              type="time"
              value={newOutreachEventData.time}
              onChange={(e) => setNewOutreachEventData({ ...newOutreachEventData, time: e.target.value })}
              required
            />
            <Input
              type="text"
              placeholder="Location (Optional)"
              value={newOutreachEventData.location}
              onChange={(e) => setNewOutreachEventData({ ...newOutreachEventData, location: e.target.value })}
            />
            <Textarea
              placeholder="Description (Optional)"
              value={newOutreachEventData.description}
              onChange={(e) => setNewOutreachEventData({ ...newOutreachEventData, description: e.target.value })}
            />
            <Input
              type="url"
              placeholder="Image URL (Optional)"
              value={newOutreachEventData.imageUrl}
              onChange={(e) => setNewOutreachEventData({ ...newOutreachEventData, imageUrl: e.target.value })}
            />
            <Button type="submit" className="w-full">
              Create Event
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Record Donation Distribution Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Plus className="mr-2" /> Record Donation Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRecordDonation} className="space-y-4">
            <Input
              type="number"
              placeholder="Amount"
              value={newDonationLogData.amount === 0 ? '' : newDonationLogData.amount.toString()}
              onChange={(e) => setNewDonationLogData({ ...newDonationLogData, amount: parseFloat(e.target.value) || 0 })}
              required
            />
            <Textarea
              placeholder="Description of distribution"
              value={newDonationLogData.description}
              onChange={(e) => setNewDonationLogData({ ...newDonationLogData, description: e.target.value })}
              required
            />
            <select
              value={newDonationLogData.method}
              onChange={(e) => setNewDonationLogData({ ...newDonationLogData, method: e.target.value as any })}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
            >
              <option value="CASH">Cash</option>
              <option value="MPESA">Mpesa</option>
              <option value="STRIPE">Stripe</option>
              <option value="PAYPAL">PayPal</option>
              <option value="CHECK">Check</option>
              <option value="IN_KIND">In-Kind</option>
            </select>
            <Button type="submit" className="w-full">
              Record Donation
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
