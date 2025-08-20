"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Event, Partner, Transaction, EventType, TransactionType, TransactionMethod } from '@/generated/prisma';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Handshake, DollarSign, Plus } from 'lucide-react';
import { format } from 'date-fns';

export const MissionsPastorDashboard = () => {
  const [missionTrips, setMissionTrips] = useState<Event[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newMissionTripData, setNewMissionTripData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    imageUrl: '',
    time: '',
  });

  const [newTransactionData, setNewTransactionData] = useState({
    amount: 0,
    type: 'DONATION' as TransactionType,
    method: 'CASH' as TransactionMethod,
    description: '',
  });

  const fetchDashboardData = async () => {
    try {
      const [tripsRes, partnersRes, transactionsRes] = await Promise.all([
        fetch('/api/events?type=TRIP'), // Assuming mission trips are events of type TRIP
        fetch('/api/partners'),
        fetch('/api/transactions'),
      ]);

      if (!tripsRes.ok) throw new Error('Failed to fetch mission trips');
      if (!partnersRes.ok) throw new Error('Failed to fetch partners');
      if (!transactionsRes.ok) throw new Error('Failed to fetch transactions');

      const tripsData = await tripsRes.json();
      const partnersData = await partnersRes.json();
      const transactionsData = await transactionsRes.json();

      setMissionTrips(tripsData);
      setPartners(partnersData);
      setTransactions(transactionsData);
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

  const handleCreateMissionTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newMissionTripData,
          type: 'TRIP',
          date: new Date(newMissionTripData.date),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create mission trip');
      }

      toast.success('Mission trip created successfully!');
      setNewMissionTripData({ title: '', date: '', location: '', description: '', imageUrl: '', time: '' });
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleRecordTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTransactionData,
          amount: parseFloat(newTransactionData.amount.toString()),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to record transaction');
      }

      toast.success('Transaction recorded successfully!');
      setNewTransactionData({ amount: 0, type: 'DONATION', method: 'CASH', description: '' });
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
        <Globe className="mr-3" /> Missions Pastor Dashboard
      </h1>

      {/* Upcoming Mission Trips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Globe className="mr-2" /> Upcoming Mission Trips</CardTitle>
        </CardHeader>
        <CardContent>
          {missionTrips.length === 0 ? (
            <p>No upcoming mission trips.</p>
          ) : (
            <ul className="space-y-2">
              {missionTrips.map((trip) => (
                <li key={trip.id} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{trip.title}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(trip.date), 'PPP')} {trip.time && `at ${trip.time}`}
                  </p>
                  <p className="text-xs text-gray-500">Location: {trip.location || 'N/A'}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Community Partners */}
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

      {/* Recent Transactions (Fundraising Progress) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><DollarSign className="mr-2" /> Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p>No recent transactions.</p>
          ) : (
            <ul className="space-y-2">
              {transactions.map((transaction) => (
                <li key={transaction.id} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{transaction.description} - {transaction.amount} ({transaction.method})</p>
                  <p className="text-xs text-gray-500">{format(new Date(transaction.date), 'PP')}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Create New Mission Trip Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Plus className="mr-2" /> Create New Mission Trip</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateMissionTrip} className="space-y-4">
            <Input
              type="text"
              placeholder="Trip Title"
              value={newMissionTripData.title}
              onChange={(e) => setNewMissionTripData({ ...newMissionTripData, title: e.target.value })}
              required
            />
            <Input
              type="date"
              value={newMissionTripData.date}
              onChange={(e) => setNewMissionTripData({ ...newMissionTripData, date: e.target.value })}
              required
            />
            <Input
              type="time"
              value={newMissionTripData.time}
              onChange={(e) => setNewMissionTripData({ ...newMissionTripData, time: e.target.value })}
              required
            />
            <Input
              type="text"
              placeholder="Location (Optional)"
              value={newMissionTripData.location}
              onChange={(e) => setNewMissionTripData({ ...newMissionTripData, location: e.target.value })}
            />
            <Textarea
              placeholder="Description (Optional)"
              value={newMissionTripData.description}
              onChange={(e) => setNewMissionTripData({ ...newMissionTripData, description: e.target.value })}
            />
            <Input
              type="url"
              placeholder="Image URL (Optional)"
              value={newMissionTripData.imageUrl}
              onChange={(e) => setNewMissionTripData({ ...newMissionTripData, imageUrl: e.target.value })}
            />
            <Button type="submit" className="w-full">
              Create Trip
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Record Transaction Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Plus className="mr-2" /> Record Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRecordTransaction} className="space-y-4">
            <Input
              type="number"
              placeholder="Amount"
              value={newTransactionData.amount === 0 ? '' : newTransactionData.amount.toString()}
              onChange={(e) => setNewTransactionData({ ...newTransactionData, amount: parseFloat(e.target.value) || 0 })}
              required
            />
            <select
              value={newTransactionData.type}
              onChange={(e) => setNewTransactionData({ ...newTransactionData, type: e.target.value as TransactionType })}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
              required
            >
              <option value="DONATION">Donation</option>
              <option value="EXPENSE">Expense</option>
              <option value="REVENUE">Revenue</option>
            </select>
            <select
              value={newTransactionData.method}
              onChange={(e) => setNewTransactionData({ ...newTransactionData, method: e.target.value as TransactionMethod })}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
              required
            >
              <option value="CASH">Cash</option>
              <option value="MPESA">Mpesa</option>
              <option value="STRIPE">Stripe</option>
              <option value="PAYPAL">PayPal</option>
              <option value="CHECK">Check</option>
              <option value="IN_KIND">In-Kind</option>
            </select>
            <Textarea
              placeholder="Description (Optional)"
              value={newTransactionData.description}
              onChange={(e) => setNewTransactionData({ ...newTransactionData, description: e.target.value })}
            />
            <Button type="submit" className="w-full">
              Record Transaction
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
