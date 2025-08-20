"use client";
import React, { useState, useEffect } from 'react';
import { RoleName } from '@/generated/prisma';
import { useMinistryStore } from '@/store';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Megaphone, Plus } from 'lucide-react';

export const MinistriesCoordinatorDashboard = ({ roleName }: { roleName?: RoleName }) => {
  const { ministries, fetchMinistries, loading, error } = useMinistryStore();
  const [newAnnouncementContent, setNewAnnouncementContent] = useState('');
  const [ministrySpecificData, setMinistrySpecificData] = useState<any>(null); // Placeholder for specific ministry data

  useEffect(() => {
    fetchMinistries();
    // In a real app, you'd fetch specific data for the roleName here
    // For example, if roleName is MEN_MINISTRY_COORDINATOR, fetch data specific to Men's Ministry
    if (roleName && roleName !== RoleName.OVERALL_MINISTRIES_COORDINATOR) {
      // Simulate fetching specific ministry data
      const specificMinistry = ministries.find(m => m.name.toUpperCase().includes(roleName.split('_')[0]));
      if (specificMinistry) {
        setMinistrySpecificData(specificMinistry);
      }
    }
  }, [fetchMinistries, roleName, ministries]);

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
      // Optionally re-fetch announcements if displayed on this dashboard
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="text-center py-8">Loading ministries data...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-6">
        <Users className="mr-3" /> {roleName ? `${roleName.replace(/_/g, ' ')} Dashboard` : 'Ministries Coordinator Dashboard'}
      </h1>

      {ministrySpecificData && roleName !== RoleName.OVERALL_MINISTRIES_COORDINATOR && (
        <Card>
          <CardHeader>
            <CardTitle>Ministry: {ministrySpecificData.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{ministrySpecificData.description}</p>
            {/* Add more specific ministry details here */}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Calendar className="mr-2" /> All Ministries Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {ministries.length === 0 ? (
            <p>No ministries found.</p>
          ) : (
            <ul className="space-y-2">
              {ministries.map((ministry) => (
                <li key={ministry.id} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{ministry.name}</p>
                  <p className="text-sm text-gray-600">Leader ID: {ministry.leaderId}</p>
                  {/* Add more ministry details like performance metrics if available */}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Megaphone className="mr-2" /> Create Cross-Ministry Announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateAnnouncement} className="space-y-4">
            <Textarea
              placeholder="Type your announcement here..."
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
    </div>
  );
};
