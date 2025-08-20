"use client";

import { motion } from "framer-motion";
import { Search, User as UserIcon, Calendar, Circle } from "lucide-react";
import { useState } from "react";
import { MinistryMember, User } from "@/generated/prisma";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define interfaces for better type safety
interface MinistryMemberWithUser extends MinistryMember {
  user: User;
}

interface MinistryMembersProps {
  ministryMembers: MinistryMemberWithUser[];
}

// Reusable components
const MemberCard = ({
  member,
  index,
}: {
  member: MinistryMemberWithUser;
  index: number;
}) => (
  <motion.li
    key={member.user.id}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ y: -4 }}
    className="flex flex-col p-4 rounded-lg border border-gray-100 bg-white hover:shadow-md transition-all duration-200"
  >
    <div className="flex items-center gap-4">
      <Avatar className="h-8 w-8 flex-shrink-0 border-2 border-white shadow">
        <AvatarImage
          src={member.user.photo || undefined}
          alt={member.user.name || "Member"}
        />
        <AvatarFallback className="bg-indigo-100 text-indigo-600">
          {member.user.name?.charAt(0) || "M"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 truncate">
          {member.user.name || "Unnamed Member"}
        </h4>
        <p className="text-xs text-gray-500 mt-1">{member.role || "Member"}</p>
        <div className="flex items-center mt-2 text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Circle
          className={`h-2 w-2 ${
            member.active ? "text-green-500" : "text-gray-400"
          }`}
          fill="currentColor"
        />
        <span className="text-xs text-gray-500">
          {member.active ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  </motion.li>
);

const ModalMemberItem = ({
  member,
  index,
}: {
  member: MinistryMemberWithUser;
  index: number;
}) => (
  <motion.div
    key={member.user.id}
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.03 }}
    className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
  >
    <Avatar className="h-10 w-10 flex-shrink-0">
      <AvatarImage
        src={member.user.photo || undefined}
        alt={member.user.name || "Member"}
      />
      <AvatarFallback className="bg-indigo-100 text-indigo-600">
        {member.user.name?.charAt(0) || "M"}
      </AvatarFallback>
    </Avatar>

    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-medium text-gray-900 truncate">
        {member.user.name || "Unnamed Member"}
      </h4>
      <div className="flex flex-wrap items-center mt-1 text-xs text-gray-500 gap-x-2">
        <span>{member.role || "Member"}</span>
        <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
      </div>
    </div>

    <div className="flex items-center gap-1">
      <Circle
        className={`h-2 w-2 ${
          member.active ? "text-green-500" : "text-gray-400"
        }`}
        fill="currentColor"
      />
      <span className="text-xs text-gray-500">
        {member.active ? "Active" : "Inactive"}
      </span>
    </div>
  </motion.div>
);

const EmptyState = ({ searchTerm }: { searchTerm: string }) => (
  <section
    role="status"
    className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 space-y-2"
  >
    <UserIcon className="w-12 h-12 text-gray-400" />
    <h4 className="text-lg font-medium text-gray-700">No members found</h4>
    <p className="text-gray-500 max-w-md">
      {searchTerm
        ? "Try adjusting your search query"
        : "This ministry currently has no members"}
    </p>
  </section>
);

const ModalEmptyState = () => (
  <div
    role="status"
    className="flex flex-col items-center justify-center py-8 text-center space-y-2"
  >
    <Search className="h-8 w-8 text-gray-400" />
    <h4 className="text-gray-700 font-medium">No results found</h4>
    <p className="text-gray-500 text-sm">Try adjusting your search query</p>
  </div>
);

export default function MinistryMembers({
  ministryMembers,
}: MinistryMembersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter members based on search term
  const filterMembers = (members: MinistryMemberWithUser[], term: string) =>
    members.filter(
      (m) =>
        m.user.name?.toLowerCase().includes(term.toLowerCase()) ||
        m.role?.toLowerCase().includes(term.toLowerCase())
    );

  const filteredMembers = ministryMembers
    ? ministryMembers.filter(
        (member) =>
          member?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || // Added ?.
          member.role?.toLowerCase().includes(searchTerm.toLowerCase()) // Added ?.
      ).slice(0, 3) // Limit to 3 members for the main card
    : [];

  // filteredModalMembers should always filter from the original ministryMembers
  const filteredModalMembers = ministryMembers
    ? ministryMembers.filter(
        (member) =>
          member.user.name
            ?.toLowerCase() // Added ?.
            .includes(modalSearchTerm.toLowerCase()) ||
          member.role?.toLowerCase().includes(modalSearchTerm.toLowerCase()) // Added ?.
      )
    : [];

  return (
    <motion.div
      className="rounded-2xl p-6 shadow-sm border border-gray-100 bg-white"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header Section */}
      <header className="mb-6 space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Ministry Members</h3>
          <p className="text-gray-600 text-sm">
            {ministryMembers.length} active members serving
          </p>
        </div>

        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
          <Input
            id="member-search"
            placeholder="Search by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </header>

      {/* Members List */}
      {filteredMembers.length === 0 ? (
        <EmptyState searchTerm={searchTerm} />
      ) : (
        <ul role="list" className="grid grid-cols-1 gap-6">
          {filteredMembers.map((member, index) => (
            <MemberCard key={member.user.id} member={member} index={index} />
          ))}
        </ul>
      )}

      {/* View All Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        setIsModalOpen(open);
        if (open) { // When modal opens
          setModalSearchTerm(""); // Clear modal search term
        }
      }}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="mt-6 w-full sm:w-auto border-indigo-600 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
          >
            View All Members
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-2xl rounded-xl p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white space-y-4">
            <DialogHeader>
              <DialogTitle className="text-xl">
                All Ministry Members
              </DialogTitle>
              <DialogDescription className="text-indigo-100">
                Browse and search through all {ministryMembers.length} members
              </DialogDescription>
            </DialogHeader>

            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-200"
                aria-hidden="true"
              />
              <Input
                id="modal-member-search"
                placeholder="Search members..."
                value={modalSearchTerm}
                onChange={(e) => setModalSearchTerm(e.target.value)}
                className="pl-10 rounded-lg border-indigo-300 bg-indigo-500/20 text-white placeholder-indigo-200 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-6 space-y-3">
            {filteredModalMembers.length === 0 ? (
              <ModalEmptyState />
            ) : (
              filteredModalMembers.map((member, index) => (
                <ModalMemberItem
                  key={member.user.id}
                  member={member}
                  index={index}
                />
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
