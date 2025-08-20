"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { BibleStudy, PrayerRequest, Group } from '@/generated/prisma';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, MessageSquare, Users, Plus } from 'lucide-react';
import { format } from 'date-fns';

export const DiscipleshipLeaderDashboard = () => {
  const [bibleStudies, setBibleStudies] = useState<BibleStudy[]>([]);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [smallGroups, setSmallGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newLessonData, setNewLessonData] = useState({
    title: '',
    content: '',
    bibleStudyId: '',
  });

  const fetchDashboardData = async () => {
    try {
      const [bibleStudiesRes, prayerRequestsRes, smallGroupsRes] = await Promise.all([
        fetch('/api/bible-study'),
        fetch('/api/prayer-requests'),
        fetch('/api/groups'),
      ]);

      if (!bibleStudiesRes.ok) throw new Error('Failed to fetch Bible studies');
      if (!prayerRequestsRes.ok) throw new Error('Failed to fetch prayer requests');
      if (!smallGroupsRes.ok) throw new Error('Failed to fetch small groups');

      const bibleStudiesData = await bibleStudiesRes.json();
      const prayerRequestsData = await prayerRequestsRes.json();
      const smallGroupsData = await smallGroupsRes.json();

      setBibleStudies(bibleStudiesData);
      setPrayerRequests(prayerRequestsData);
      setSmallGroups(smallGroupsData);
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

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/bible-study/lessons', { // Assuming a /api/bible-study/lessons endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLessonData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create lesson');
      }

      toast.success('Lesson created successfully!');
      setNewLessonData({ title: '', content: '', bibleStudyId: '', });
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleMarkPrayerRequestAsPrayed = async (id: string) => {
    try {
      const response = await fetch(`/api/prayer-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PRAYED' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update prayer request');
      }

      toast.success('Prayer request marked as prayed!');
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
        <BookOpen className="mr-3" /> Discipleship Leader Dashboard
      </h1>

      {/* Bible Studies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><BookOpen className="mr-2" /> Bible Studies</CardTitle>
        </CardHeader>
        <CardContent>
          {bibleStudies.length === 0 ? (
            <p>No Bible studies found.</p>
          ) : (
            <ul className="space-y-2">
              {bibleStudies.map((study) => (
                <li key={study.id} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{study.title}</p>
                  <p className="text-sm text-gray-600">{study.description}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Prayer Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><MessageSquare className="mr-2" /> Prayer Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {prayerRequests.length === 0 ? (
            <p>No prayer requests.</p>
          ) : (
            <ul className="space-y-2">
              {prayerRequests.map((request) => (
                <li key={request.id} className="border-b pb-2 last:border-b-0 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{request.request}</p>
                    <p className="text-sm text-gray-600">Status: {request.status}</p>
                  </div>
                  {request.status !== 'PRAYED' && (
                    <Button onClick={() => handleMarkPrayerRequestAsPrayed(request.id)} size="sm">
                      Mark as Prayed
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Small Groups */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Users className="mr-2" /> Small Groups</CardTitle>
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
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Create New Lesson Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Plus className="mr-2" /> Create New Lesson</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateLesson} className="space-y-4">
            <Input
              type="text"
              placeholder="Lesson Title"
              value={newLessonData.title}
              onChange={(e) => setNewLessonData({ ...newLessonData, title: e.target.value })}
              required
            />
            <Textarea
              placeholder="Lesson Content"
              value={newLessonData.content}
              onChange={(e) => setNewLessonData({ ...newLessonData, content: e.target.value })}
              required
            />
            <Input
              type="text"
              placeholder="Bible Study ID (e.g., from URL)"
              value={newLessonData.bibleStudyId}
              onChange={(e) => setNewLessonData({ ...newLessonData, bibleStudyId: e.target.value })}
              required
            />
            <Button type="submit" className="w-full">
              Create Lesson
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
