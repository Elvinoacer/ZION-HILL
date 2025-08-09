import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image?: string | null;
}

interface Participant {
  id: string;
  userId: string;
  status: string;
  user?: User;
}

interface WorshipTeamManagementProps {
  selectedServiceId: string | null;
  currentParticipants: Participant[];
  fetchParticipants: (eventId: string) => void;
}

const WorshipTeamManagement: React.FC<WorshipTeamManagementProps> = ({
  selectedServiceId,
  currentParticipants,
  fetchParticipants,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRes = await fetch("/api/users");
        if (!usersRes.ok) throw new Error("Failed to fetch users");
        const usersData = await usersRes.json();
        setUsers(usersData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleAssignTeamMember = async (userId: string) => {
    if (!selectedServiceId) return;
    try {
      const res = await fetch("/api/participants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          eventId: selectedServiceId,
          status: "Assigned",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to assign team member");
      }
      fetchParticipants(selectedServiceId);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveTeamMember = async (participantId: string) => {
    if (!selectedServiceId) return;
    try {
      const res = await fetch(`/api/participants?id=${participantId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to remove team member");
      }
      fetchParticipants(selectedServiceId);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-200"
      >
        Error: {error}
      </motion.div>
    );
  }

  if (!selectedServiceId) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 rounded-lg bg-blue-50 text-blue-600 text-center"
      >
        Select a service to manage team members
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="space-y-4"
      >
        <h4 className="font-semibold text-lg text-gray-700">
          Available Team Members
        </h4>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : users.length > 0 ? (
          <ul className="space-y-2">
            {users.map((user) => (
              <motion.li
                key={user.id}
                whileHover={{ x: 5 }}
                className="flex items-center justify-between p-3 rounded-lg bg-white shadow-xs border border-gray-100"
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-400 text-white">
                      {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-700">
                      {user.name || user.email}
                    </p>
                    {user.name && (
                      <p className="text-sm text-gray-500">{user.email}</p>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAssignTeamMember(user.id)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Assign
                </Button>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="p-4 rounded-lg bg-gray-50 text-center text-gray-500">
            No users found
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <h4 className="font-semibold text-lg text-gray-700">
          Assigned Members
        </h4>
        {currentParticipants.length > 0 ? (
          <ul className="space-y-2">
            <AnimatePresence>
              {currentParticipants.map((participant) => (
                <motion.li
                  key={participant.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white shadow-xs border border-gray-100 overflow-hidden"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={participant.user?.image || undefined} />
                      <AvatarFallback className="bg-gradient-to-r from-green-400 to-teal-400 text-white">
                        {participant.user?.name?.charAt(0) ||
                          participant.user?.email?.charAt(0) ||
                          "P"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-700">
                        {participant.user?.name ||
                          participant.user?.email ||
                          `Participant ${participant.userId}`}
                      </p>
                      {participant.user?.name && (
                        <p className="text-sm text-gray-500">
                          {participant.user?.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveTeamMember(participant.id)}
                  >
                    Remove
                  </Button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <div className="p-4 rounded-lg bg-gray-50 text-center text-gray-500">
            No members assigned to this service yet
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WorshipTeamManagement;
