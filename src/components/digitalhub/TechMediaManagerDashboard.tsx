"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Asset, Ticket, Sermon } from '@/generated/prisma';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Ticket as TicketIcon, BookOpen, Plus } from 'lucide-react';
import { format } from 'date-fns';

export const TechMediaManagerDashboard = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newAssetData, setNewAssetData] = useState({
    title: '',
    type: 'IMAGE', // Default type
    url: '',
    uploaderId: '', // This should ideally come from session or context
  });

  const fetchDashboardData = async () => {
    try {
      const [assetsRes, ticketsRes, sermonsRes] = await Promise.all([
        fetch('/api/media'),
        fetch('/api/tickets'),
        fetch('/api/sermons'),
      ]);

      if (!assetsRes.ok) throw new Error('Failed to fetch assets');
      if (!ticketsRes.ok) throw new Error('Failed to fetch tickets');
      if (!sermonsRes.ok) throw new Error('Failed to fetch sermons');

      const assetsData = await assetsRes.json();
      const ticketsData = await ticketsRes.json();
      const sermonsData = await sermonsRes.json();

      setAssets(assetsData);
      setTickets(ticketsData);
      setSermons(sermonsData);
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

  const handleUploadAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAssetData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload asset');
      }

      toast.success('Asset uploaded successfully!');
      setNewAssetData({ title: '', type: 'IMAGE', url: '', uploaderId: '' });
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUpdateTicketStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tickets?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update ticket status');
      }

      toast.success('Ticket status updated!');
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
        <Upload className="mr-3" /> Tech & Media Manager Dashboard
      </h1>

      {/* Recent Assets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Upload className="mr-2" /> Recent Assets</CardTitle>
        </CardHeader>
        <CardContent>
          {assets.length === 0 ? (
            <p>No assets found.</p>
          ) : (
            <ul className="space-y-2">
              {assets.map((asset) => (
                <li key={asset.id} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{asset.title} ({asset.type})</p>
                  <p className="text-sm text-gray-600">URL: {asset.url}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Open Tickets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><TicketIcon className="mr-2" /> Open Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <p>No open tickets.</p>
          ) : (
            <ul className="space-y-2">
              {tickets.filter(ticket => ticket.status !== 'Closed').map((ticket) => (
                <li key={ticket.id} className="border-b pb-2 last:border-b-0 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{ticket.issue}</p>
                    <p className="text-sm text-gray-600">Priority: {ticket.priority}</p>
                    <p className="text-xs text-gray-500">Status: {ticket.status}</p>
                  </div>
                  {ticket.status !== 'Closed' && (
                    <Button onClick={() => handleUpdateTicketStatus(ticket.id, 'Closed')} size="sm">
                      Mark as Closed
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Recent Sermons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><BookOpen className="mr-2" /> Recent Sermons</CardTitle>
        </CardHeader>
        <CardContent>
          {sermons.length === 0 ? (
            <p>No recent sermons.</p>
          ) : (
            <ul className="space-y-2">
              {sermons.map((sermon) => (
                <li key={sermon.id} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{sermon.title}</p>
                  <p className="text-sm text-gray-600">Speaker: {sermon.speakerId}</p>
                  <p className="text-xs text-gray-500">Date: {format(new Date(sermon.date), 'PP')}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Upload New Asset Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Plus className="mr-2" /> Upload New Asset</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUploadAsset} className="space-y-4">
            <Input
              type="text"
              placeholder="Asset Title"
              value={newAssetData.title}
              onChange={(e) => setNewAssetData({ ...newAssetData, title: e.target.value })}
              required
            />
            <select
              value={newAssetData.type}
              onChange={(e) => setNewAssetData({ ...newAssetData, type: e.target.value as any })}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
              required
            >
              <option value="IMAGE">Image</option>
              <option value="VIDEO">Video</option>
              <option value="AUDIO">Audio</option>
              <option value="DOCUMENT">Document</option>
            </select>
            <Input
              type="url"
              placeholder="Asset URL"
              value={newAssetData.url}
              onChange={(e) => setNewAssetData({ ...newAssetData, url: e.target.value })}
              required
            />
            <Input
              type="text"
              placeholder="Uploader ID (e.g., your user ID)"
              value={newAssetData.uploaderId}
              onChange={(e) => setNewAssetData({ ...newAssetData, uploaderId: e.target.value })}
              required
            />
            <Button type="submit" className="w-full">
              Upload Asset
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
