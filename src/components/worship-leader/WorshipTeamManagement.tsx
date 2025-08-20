import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  Search,
  UserPlus,
  Users,
  MessageSquare,
  X,
  Mail,
  UserCheck,
  UserX,
} from "lucide-react";

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
  role?: string;
  user?: User;
}

interface WorshipTeamManagementProps {
  worshipMinistryId: string | null;
  currentMinistryMembers: Participant[];
  fetchMinistryMembers: (ministryId: string) => void;
  onMessageMember: (member: User) => void;
}

const WorshipTeamManagement: React.FC<WorshipTeamManagementProps> = ({
  worshipMinistryId,
  currentMinistryMembers,
  fetchMinistryMembers,
  onMessageMember,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUserIdToAdd, setSelectedUserIdToAdd] = useState<string>("");
  const [showAllMembersModal, setShowAllMembersModal] = useState(false);
  const [allMembersSearchTerm, setAllMembersSearchTerm] = useState("");
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [addMemberSearchTerm, setAddMemberSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsersAndMinistryMembers = async () => {
      if (!worshipMinistryId) {
        setLoading(false);
        return;
      }
      try {
        // Fetch all users
        const usersRes = await fetch("/api/users");
        if (!usersRes.ok) throw new Error("Failed to fetch users");
        const allUsersData: User[] = await usersRes.json();

        // Fetch current ministry members
        const ministryMembersRes = await fetch(
          `/api/ministry-members?ministryId=${worshipMinistryId}`
        );
        if (!ministryMembersRes.ok)
          throw new Error("Failed to fetch ministry members");
        const ministryMembersData: { userId: string }[] =
          await ministryMembersRes.json();

        // Filter out users who are already ministry members
        const currentMemberIds = new Set(
          ministryMembersData.map((m) => m.userId)
        );
        const availableUsers = allUsersData.filter(
          (user) => !currentMemberIds.has(user.id)
        );

        setUsers(availableUsers);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsersAndMinistryMembers();
  }, [worshipMinistryId]);

  const handleAssignTeamMember = async (userId: string) => {
    if (!worshipMinistryId) return;
    try {
      const res = await fetch("/api/ministry-members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ministryId: worshipMinistryId,
          role: "Member",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add team member");
      }
      fetchMinistryMembers(worshipMinistryId);
      // Refresh available users
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveTeamMember = async (userId: string) => {
    if (!worshipMinistryId) return;
    try {
      const res = await fetch(
        `/api/ministry-members?userId=${userId}&ministryId=${worshipMinistryId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to remove team member");
      }
      fetchMinistryMembers(worshipMinistryId);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-200 flex items-center"
      >
        <div className="bg-red-100 p-2 rounded-full mr-3">
          <X size={16} className="text-red-600" />
        </div>
        <p>Error: {error}</p>
      </motion.div>
    );
  }

  if (!worshipMinistryId) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 rounded-lg bg-blue-50 text-blue-600 text-center border border-blue-200"
      >
        <Users size={24} className="mx-auto mb-2" />
        <p>Select a ministry to manage team members</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Available Users Section */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
            <UserPlus size={20} />
            Available Users
          </h4>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {users.length} available
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {users.slice(0, 4).map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200 shadow-xs hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <Avatar className="border-2 border-blue-100">
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-400 text-white">
                      {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-800 truncate">
                      {user.name || user.email}
                    </p>
                    {user.name && (
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAssignTeamMember(user.id)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 flex-shrink-0 ml-2"
                >
                  <UserPlus size={14} className="mr-1" />
                  Add
                </Button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-gray-50 text-center text-gray-500 border border-gray-200">
            <UserCheck size={24} className="mx-auto mb-2 opacity-50" />
            <p>All available users have been added to the team</p>
          </div>
        )}

        {users.length > 4 && (
          <div className="text-center mt-2">
            <Button
              variant="outline"
              onClick={() => setShowAddMemberModal(true)}
              className="flex items-center gap-2"
            >
              <UserPlus size={16} />
              View All Available Users ({users.length})
            </Button>
          </div>
        )}
      </motion.div>

      {/* Current Team Members Section */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex flex-col space-y-2">
          <h4 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
            <Users size={20} />
            Current Team Members
          </h4>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAddMemberModal(true)}
            className="flex items-center gap-1 w-fit"
          >
            <UserPlus size={14} />
            Add Member
          </Button>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full w-fit">
            {currentMinistryMembers.length} members
          </span>
        </div>

        {currentMinistryMembers.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            <AnimatePresence>
              {currentMinistryMembers.slice(0, 5).map((member) => (
                <motion.div
                  key={member.userId}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-lg bg-white border border-gray-200 shadow-xs hover:shadow-sm transition-shadow"
                >
                  <div className="flex flex-col">
                    {/* Member info with avatar */}
                    <div className="flex items-start gap-3 flex-1 min-w-0 mb-4">
                      <Avatar className="border-2 border-green-100 flex-shrink-0 h-10 w-10">
                        <AvatarImage src={member.user?.image || undefined} />
                        <AvatarFallback className="bg-gradient-to-r from-green-400 to-teal-400 text-white">
                          {member.user?.name?.charAt(0) ||
                            member.user?.email?.charAt(0) ||
                            "M"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {member.user?.name || "Unnamed Member"}
                          </h3>
                          {member.role && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                              {member.role}
                            </span>
                          )}
                        </div>

                        {member.user?.email && (
                          <p className="text-sm text-gray-600 truncate flex items-center gap-1">
                            <Mail
                              size={12}
                              className="text-gray-400 flex-shrink-0"
                            />
                            {member.user.email}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 mt-2">
                          {member.status && (
                            <span
                              className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                                member.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : member.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {member.status}
                            </span>
                          )}

                          {member.userId && (
                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-mono bg-gray-100 text-gray-600 rounded">
                              ID: {member.userId.substring(0, 6)}...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end gap-2 mt-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onMessageMember(member.user as User)}
                        className="flex items-center gap-1.5"
                      >
                        <MessageSquare size={14} />
                        Message
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveTeamMember(member.userId)}
                        className="flex items-center gap-1.5"
                      >
                        <UserX size={14} />
                        Remove
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="p-6 rounded-lg bg-gray-50 text-center text-gray-500 border border-gray-200">
            <Users size={32} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium">No members in this team yet</p>
            <p className="text-sm mt-1">
              Add users from the Available Users section
            </p>
          </div>
        )}

        {currentMinistryMembers.length > 5 && (
          <div className="text-center mt-2">
            <Button
              variant="outline"
              onClick={() => setShowAllMembersModal(true)}
              className="flex items-center gap-2"
            >
              <Users size={16} />
              Show All Members ({currentMinistryMembers.length})
            </Button>
          </div>
        )}
      </motion.div>

      {/* All Members Modal */}
      <Dialog open={showAllMembersModal} onOpenChange={setShowAllMembersModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users size={20} />
              All Team Members
            </DialogTitle>
            <DialogDescription>
              View and manage all {currentMinistryMembers.length} members of
              this team.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex-1 overflow-hidden flex flex-col">
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search members..."
                value={allMembersSearchTerm}
                onChange={(e) => setAllMembersSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="grid gap-2">
                {currentMinistryMembers
                  .filter(
                    (member) =>
                      member.user?.name
                        ?.toLowerCase()
                        .includes(allMembersSearchTerm.toLowerCase()) ||
                      member.user?.email
                        ?.toLowerCase()
                        .includes(allMembersSearchTerm.toLowerCase())
                  )
                  .map((member) => (
                    <div
                      key={member.userId}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0 mb-2 sm:mb-0">
                        <Avatar>
                          <AvatarImage src={member.user?.image || undefined} />
                          <AvatarFallback className="bg-gradient-to-r from-green-400 to-teal-400 text-white">
                            {member.user?.name?.charAt(0) ||
                              member.user?.email?.charAt(0) ||
                              "M"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-800 truncate">
                            {member.user?.name || member.user?.email}
                          </p>
                          {member.user?.name && (
                            <p className="text-sm text-gray-500 truncate">
                              {member.user?.email}
                            </p>
                          )}
                          {member.role && (
                            <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                              {member.role}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 self-end sm:self-auto">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            onMessageMember(member.user as User);
                            setShowAllMembersModal(false);
                          }}
                          className="flex items-center gap-1"
                        >
                          <MessageSquare size={12} />
                          Message
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveTeamMember(member.userId)}
                          className="flex items-center gap-1"
                        >
                          <UserX size={12} />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAllMembersModal(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Modal */}
      <Dialog open={showAddMemberModal} onOpenChange={setShowAddMemberModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus size={20} />
              Add New Team Member
            </DialogTitle>
            <DialogDescription>
              Search for users and add them to this ministry.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex-1 overflow-hidden flex flex-col">
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search users..."
                value={addMemberSearchTerm}
                onChange={(e) => setAddMemberSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {users.length > 0 ? (
                <div className="grid gap-2">
                  {users
                    .filter(
                      (user) =>
                        user.name
                          ?.toLowerCase()
                          .includes(addMemberSearchTerm.toLowerCase()) ||
                        user.email
                          ?.toLowerCase()
                          .includes(addMemberSearchTerm.toLowerCase())
                    )
                    .map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200"
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <Avatar>
                            <AvatarImage src={user.image || undefined} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-400 text-white">
                              {user.name?.charAt(0) ||
                                user.email?.charAt(0) ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-800 truncate">
                              {user.name || user.email}
                            </p>
                            {user.name && (
                              <p className="text-sm text-gray-500 truncate">
                                {user.email}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            handleAssignTeamMember(user.id);
                            setShowAddMemberModal(false);
                          }}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 flex-shrink-0 ml-2"
                        >
                          <UserPlus size={14} className="mr-1" />
                          Add
                        </Button>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <UserCheck size={32} className="mx-auto mb-3 opacity-50" />
                  <p>No available users to add</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddMemberModal(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorshipTeamManagement;
