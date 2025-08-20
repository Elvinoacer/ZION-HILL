"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Resource, User, VolunteerShift, Category, ResourceType } from '@/generated/prisma';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Users, Calendar, Plus } from 'lucide-react';
import { format } from 'date-fns';

export const ChildrenYouthDirectorDashboard = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [users, setUsers] = useState<User[]>([]); // To identify children/youth and parents
  const [volunteerShifts, setVolunteerShifts] = useState<VolunteerShift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newResourceData, setNewResourceData] = useState({
    title: '',
    description: '',
    url: '',
    category: 'KIDS' as Category,
    type: 'DOCUMENT' as ResourceType,
  });

  const fetchDashboardData = async () => {
    try {
      const [resourcesRes, usersRes, shiftsRes] = await Promise.all([
        fetch('/api/resources'), // Will filter by category on client-side for now
        fetch('/api/users'),
        fetch('/api/volunteer-shifts'),
      ]);

      if (!resourcesRes.ok) throw new Error('Failed to fetch resources');
      if (!usersRes.ok) throw new Error('Failed to fetch users');
      if (!shiftsRes.ok) throw new Error('Failed to fetch volunteer shifts');

      const resourcesData = await resourcesRes.json();
      const usersData = await usersRes.json();
      const shiftsData = await shiftsRes.json();

      setResources(resourcesData);
      setUsers(usersData);
      setVolunteerShifts(shiftsData);
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

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResourceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create resource');
      }

      toast.success('Resource created successfully!');
      setNewResourceData({ title: '', description: '', url: '', category: 'KIDS', type: 'DOCUMENT' });
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="text-center py-8">Loading dashboard...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  const childrenYouthResources = resources.filter(r => r.category === 'KIDS' || r.category === 'TEENS');
  const childrenYouthUsers = users.filter(user => user.roles.includes('MEMBER') || user.roles.includes('GUEST')); // Simplified for example

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-6">
        <Users className="mr-3" /> Children/Youth Director Dashboard
      </h1>

      {/* Children/Youth Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Book className="mr-2" /> Resources for Children & Youth</CardTitle>
        </CardHeader>
        <CardContent>
          {childrenYouthResources.length === 0 ? (
            <p>No resources found for children and youth.</p>
          ) : (
            <ul className="space-y-2">
              {childrenYouthResources.map((resource) => (
                <li key={resource.id} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{resource.title} ({resource.category})</p>
                  <p className="text-sm text-gray-600">Type: {resource.type}</p>
                  <p className="text-xs text-gray-500">URL: {resource.url}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Users (Children/Youth/Parents) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Users className="mr-2" /> Registered Users (Children/Youth/Parents)</CardTitle>
        </CardHeader>
        <CardContent>
          {childrenYouthUsers.length === 0 ? (
            <p>No relevant users found.</p>
          ) : (
            <ul className="space-y-2">
              {childrenYouthUsers.map((user) => (
                <li key={user.id} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500">Roles: {user.roles.join(', ')}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Volunteer Shifts for Children/Youth Programs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Calendar className="mr-2" /> Volunteer Shifts</CardTitle>
        </CardHeader>
        <CardContent>
          {volunteerShifts.length === 0 ? (
            <p>No volunteer shifts found for children/youth programs.</p>
          ) : (
            <ul className="space-y-2">
              {volunteerShifts.map((shift) => (
                <li key={shift.id} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{shift.user?.name || 'Unknown'} for {shift.event?.title || 'Unknown Event'}</p>
                  <p className="text-sm text-gray-600">Time: {shift.time}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Create New Resource Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Plus className="mr-2" /> Create New Resource</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateResource} className="space-y-4">
            <Input
              type="text"
              placeholder="Resource Title"
              value={newResourceData.title}
              onChange={(e) => setNewResourceData({ ...newResourceData, title: e.target.value })}
              required
            />
            <Textarea
              placeholder="Description (Optional)"
              value={newResourceData.description}
              onChange={(e) => setNewResourceData({ ...newResourceData, description: e.target.value })}
            />
            <Input
              type="url"
              placeholder="Resource URL"
              value={newResourceData.url}
              onChange={(e) => setNewResourceData({ ...newResourceData, url: e.target.value })}
              required
            />
            <select
              value={newResourceData.category}
              onChange={(e) => setNewResourceData({ ...newResourceData, category: e.target.value as Category })}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
              required
            >
              <option value="KIDS">Kids</option>
              <option value="TEENS">Teens</option>
              <option value="PARENTS">Parents</option>
            </select>
            <select
              value={newResourceData.type}
              onChange={(e) => setNewResourceData({ ...newResourceData, type: e.target.value as ResourceType })}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
              required
            >
              <option value="DOCUMENT">Document</option>
              <option value="VIDEO">Video</option>
              <option value="AUDIO">Audio</option>
              <option value="IMAGE">Image</option>
              <option value="ACTIVITY">Activity</option>
            </select>
            <Button type="submit" className="w-full">
              Create Resource
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
