"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface PrayerRequest {
  id: string;
  request: string;
  isUrgent: boolean;
  isPublic: boolean;
  userId?: string;
  createdAt: string;
}

const PrayerRequestsPage = () => {
  const { data: session } = useSession();
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [newPrayerRequest, setNewPrayerRequest] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrayerRequests = async () => {
    try {
      const res = await fetch('/api/prayer-requests');
      if (!res.ok) throw new Error('Failed to fetch prayer requests');
      const data = await res.json();
      setPrayerRequests(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayerRequests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newPrayerRequest.trim() || !session?.user?.id) {
      setError('Please enter a prayer request and ensure you are logged in.');
      return;
    }

    try {
      const res = await fetch('/api/prayer-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request: newPrayerRequest,
          isUrgent,
          isPublic,
          userId: session.user.id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to submit prayer request');
      }

      setNewPrayerRequest('');
      setIsUrgent(false);
      setIsPublic(true);
      fetchPrayerRequests(); // Refresh list
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Prayer Requests</h1>
        <p className="text-lg text-gray-600">Loading prayer requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Prayer Requests</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Prayer Requests</h1>
      <p className="text-lg text-gray-600 mb-4">
        Submit your prayer requests and see how others are praying.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Submit a New Prayer Request</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="prayerRequest" className="block text-gray-700 text-sm font-bold mb-2">Your Request:</label>
              <Textarea
                id="prayerRequest"
                value={newPrayerRequest}
                onChange={(e) => setNewPrayerRequest(e.target.value)}
                required
                rows={4}
                disabled={!session?.user?.id}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isUrgent"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                disabled={!session?.user?.id}
              />
              <label htmlFor="isUrgent" className="text-gray-700 text-sm">Mark as Urgent</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                disabled={!session?.user?.id}
              />
              <label htmlFor="isPublic" className="text-gray-700 text-sm">Make Public (visible to others)</label>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={!session?.user?.id}>
              Submit Request
            </Button>
            {!session?.user?.id && (
              <p className="text-red-500 text-sm mt-2">You must be logged in to submit prayer requests.</p>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Public Prayer Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {prayerRequests.length > 0 ? (
            <div className="space-y-4">
              {prayerRequests.filter(req => req.isPublic).map((request) => (
                <div key={request.id} className="border p-4 rounded-lg">
                  <p className="text-gray-800">{request.request}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {request.isUrgent && <span className="text-red-500 font-semibold mr-2">URGENT!</span>}
                    Submitted on {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No public prayer requests found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrayerRequestsPage;
