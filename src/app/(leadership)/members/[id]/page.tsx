"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/icons";
import { toast } from "sonner";

interface MemberProfile {
  id: string;
  name: string;
  image?: string;
  membersince?: string;
  ministryMemberships: Array<{ ministry: { name: string } }>;
}

const PublicMemberProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchProfile = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/members/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch member profile.");
          }
          const data = await response.json();
          setProfile(data);
        } catch (err: any) {
          setError(err.message);
          toast.error(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 text-center"
        >
          <div className="flex justify-center">
            <Icons.spinner className="h-12 w-12 animate-spin text-blue-600" />
          </div>
          <p className="text-lg font-medium text-blue-600">Loading member profile...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 text-center"
        >
          <div className="flex justify-center">
            <Icons.warning className="h-12 w-12 text-red-600" />
          </div>
          <p className="text-lg font-medium text-red-600">Error: {error}. Please try again.</p>
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 text-center"
        >
          <div className="flex justify-center">
            <Icons.userX className="h-12 w-12 text-gray-400" />
          </div>
          <p className="text-lg font-medium text-gray-600">Member not found.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        >
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-md">
              <AvatarImage src={profile.image || "/images/default-avatar.png"} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl font-extrabold tracking-tight">{profile.name}</CardTitle>
            {profile.membersince && (
              <p className="text-blue-100 text-sm mt-1">Member since: {profile.membersince}</p>
            )}
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {profile.ministryMemberships.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Ministry Memberships</h3>
                <ul className="space-y-2">
                  {profile.ministryMemberships.map((membership, index) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-700">
                      <Icons.checkCircle className="h-5 w-5 text-green-500" />
                      <span>{membership.ministry.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add more public profile details here as needed */}
            <div className="text-center text-gray-500 italic mt-8">
              <p>This is a public profile. For privacy reasons, not all information is displayed.</p>
            </div>
          </CardContent>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicMemberProfilePage;
