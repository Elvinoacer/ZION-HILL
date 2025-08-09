"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  membersince?: string;
  birthdate?: string;
  photo?: string;
  transactions: any[]; // Giving history
  shifts: any[]; // Volunteer schedules
}

const MemberProfilePage = () => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(`/api/member-profile?userId=${session.user.id}`);
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [session]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!profile || !session?.user?.id) return;

    try {
      const res = await fetch(`/api/member-profile?userId=${session.user.id}` , {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      setIsEditing(false);
      fetchProfile(); // Refresh profile data
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Member Profile</h1>
        <p className="text-lg text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Member Profile</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!session?.user?.id) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Member Profile</h1>
        <p className="text-lg text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Member Profile</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          {profile ? (
            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                <Input type="text" id="name" name="name" value={profile.name} onChange={handleProfileChange} disabled={!isEditing} />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                <Input type="email" id="email" name="email" value={profile.email} onChange={handleProfileChange} disabled={!isEditing} />
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone:</label>
                <Input type="text" id="phone" name="phone" value={profile.phone || ''} onChange={handleProfileChange} disabled={!isEditing} />
              </div>
              <div>
                <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
                <Input type="text" id="address" name="address" value={profile.address || ''} onChange={handleProfileChange} disabled={!isEditing} />
              </div>
              <div>
                <label htmlFor="membersince" className="block text-gray-700 text-sm font-bold mb-2">Member Since:</label>
                <Input type="text" id="membersince" name="membersince" value={profile.membersince || ''} onChange={handleProfileChange} disabled={!isEditing} />
              </div>
              <div>
                <label htmlFor="birthdate" className="block text-gray-700 text-sm font-bold mb-2">Birthdate:</label>
                <Input type="text" id="birthdate" name="birthdate" value={profile.birthdate || ''} onChange={handleProfileChange} disabled={!isEditing} />
              </div>
              <div>
                <label htmlFor="photo" className="block text-gray-700 text-sm font-bold mb-2">Photo URL:</label>
                <Input type="text" id="photo" name="photo" value={profile.photo || ''} onChange={handleProfileChange} disabled={!isEditing} />
              </div>
              <div className="md:col-span-2 flex space-x-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button type="submit">
                      Save Changes
                    </Button>
                    <Button type="button" variant="outline" onClick={() => {
                      setIsEditing(false);
                      fetchProfile(); // Revert changes
                    }}>
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </form>
          ) : (
            <p>No profile data available.</p>
          )}
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Giving History</CardTitle>
        </CardHeader>
        <CardContent>
          {profile?.transactions && profile.transactions.length > 0 ? (
            <ul>
              {profile.transactions.map((transaction: any) => (
                <li key={transaction.id} className="mb-2">
                  {new Date(transaction.date).toLocaleDateString()}: ${transaction.amount.toFixed(2)} - {transaction.description || 'Donation'}
                </li>
              ))}
            </ul>
          ) : (
            <p>No giving history available.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Volunteer Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          {profile?.shifts && profile.shifts.length > 0 ? (
            <ul>
              {profile.shifts.map((shift: any) => (
                <li key={shift.id} className="mb-2">
                  {shift.time} - {shift.eventId} (Status: {shift.checkedIn ? 'Checked In' : 'Pending'})
                </li>
              ))}
            </ul>
          ) : (
            <p>No volunteer schedules available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberProfilePage;
