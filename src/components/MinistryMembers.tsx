import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { MinistryMember, User } from "@/generated/prisma";

interface MinistryMembersProps {
  ministryMembers: (MinistryMember & { user: User })[];
}

export default function MinistryMembers({
  ministryMembers,
}: MinistryMembersProps) {
  const [searchTerm, setSearchTerm] = useState("");

  console.log(ministryMembers, "ministryMembers");

  const filteredMembers = ministryMembers
    ? ministryMembers.filter(
        (member) =>
          member.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="region"
      aria-labelledby="ministry-members-heading"
    >
      <div className="flex justify-between items-center mb-6">
        <h3
          id="ministry-members-heading"
          className="text-xl font-semibold text-gray-800"
        >
          Ministry Members
        </h3>
        <div className="relative">
          <label htmlFor="member-search" className="sr-only">
            Search members
          </label>
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"
            aria-hidden="true"
          />
          <input
            id="member-search"
            type="text"
            placeholder="Search by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-500"
            aria-describedby="search-desc"
          />
          <p id="search-desc" className="sr-only">
            Search members by their name or role.
          </p>
        </div>
      </div>

      <ul className="space-y-4" role="list">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No ministry members found.
          </div>
        ) : (
          filteredMembers.map((member) => (
            <motion.li
              key={member.id}
              whileHover={{ scale: 1.01 }}
              className={`flex items-center p-3 border rounded-lg ${
                member.active
                  ? "border-gray-200 hover:bg-gray-50"
                  : "border-gray-100 bg-gray-50"
              }`}
              role="listitem"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  console.log(`Selected ${member.user.name}`);
                }
              }}
            >
              <Image
                src={member.user.photo || "/avatars/placeholder.jpg"}
                alt={`${member.user.name}'s profile picture`}
                width={48}
                height={48}
                className="w-10 h-10 rounded-full object-cover mr-4"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-800">
                  {member.user.name}
                </div>
                <div className="text-sm text-gray-600">{member.role}</div>
              </div>
              <div className="text-sm text-gray-500">
                Joined: {new Date(member.joinDate).toLocaleDateString()}
              </div>
              <div className="ml-4">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${
                    member.active ? "bg-green-500" : "bg-gray-400"
                  }`}
                  aria-label={
                    member.active ? "Active member" : "Inactive member"
                  }
                ></span>
              </div>
            </motion.li>
          ))
        )}
      </ul>

      <button
        className="mt-4 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        aria-label="View all ministry members"
      >
        View All Members →
      </button>
    </motion.div>
  );
}
