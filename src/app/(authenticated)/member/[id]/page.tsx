"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
} from "lucide-react";
import { format } from "date-fns";

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  phone: string | null;
  address: string | null;
  membersince: string | null;
  birthdate: string | null;
  photo: string | null;
  roles: string[];
  christian: boolean | null;
  createdAt: string;
}

const UserProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const res = await fetch(`/api/users/profile?id=${id}`);
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to fetch user");
          }
          const data = await res.json();
          setUser(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center mt-8">Error: {error}</p>;
  }

  if (!user) {
    return <p className="text-center mt-8">User not found.</p>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg max-w-2xl mx-auto">
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage
              src={user.image || user.photo || undefined}
              alt={user.name || "User Avatar"}
            />
            <AvatarFallback>
              <UserIcon className="h-12 w-12 text-gray-400" />
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold text-gray-800">
            {user.name || "Unknown User"}
          </CardTitle>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {user.roles.map((role, index) => (
              <Badge key={index} variant="secondary">
                {role}
              </Badge>
            ))}
            {user.christian && <Badge variant="default">Christian</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {user.email && (
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-gray-500" />
              <p className="text-gray-700">{user.email}</p>
            </div>
          )}
          {user.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-gray-500" />
              <p className="text-gray-700">{user.phone}</p>
            </div>
          )}
          {user.address && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              <p className="text-gray-700">{user.address}</p>
            </div>
          )}
          {user.membersince && (
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-gray-500" />
              <p className="text-gray-700">
                Member Since: {format(new Date(user.membersince), "PPP")}
              </p>
            </div>
          )}
          {user.birthdate && (
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-gray-500" />
              <p className="text-gray-700">
                Born: {format(new Date(user.birthdate), "PPP")}
              </p>
            </div>
          )}
          <div className="text-sm text-gray-500 mt-6 text-center">
            Joined: {format(new Date(user.createdAt), "PPP")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfilePage;
