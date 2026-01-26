import { motion } from "framer-motion";
import { Users, PlusCircle, X } from "lucide-react";
import Image from "next/image";
import { Family, User as PrismaUser } from "@/generated/prisma";
import { useState } from "react";
import AddFamilyMemberForm from "./AddFamilyMemberForm";
import { useFamilyStore } from "@/store";

interface FamilyListProps {
  families: (Family & { members: PrismaUser[] })[];
}

export default function FamilyList({ families }: FamilyListProps) {
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const { fetchFamilies } = useFamilyStore();

  const handleAddMemberClick = (familyId: string) => {
    setSelectedFamilyId(familyId);
    setShowAddMemberModal(true);
  };

  const handleMemberAdded = () => {
    setShowAddMemberModal(false);
    setSelectedFamilyId(null);
    fetchFamilies(); // Re-fetch families to update the list
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="region"
      aria-labelledby="family-members-heading"
    >
      <h3
        id="family-members-heading"
        className="text-xl font-semibold mb-4 flex items-center text-gray-800"
      >
        <Users className="mr-2 h-5 w-5" aria-hidden="true" /> Family Units
      </h3>
      <ul className="space-y-6" role="list">
        {families.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No family units found. Create one above!
          </div>
        ) : (
          families.map((family) => (
            <li
              key={family.id}
              className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-lg text-gray-800">
                  {family.name}
                </h4>
                <button
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                  onClick={() => handleAddMemberClick(family.id)}
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> Add Member
                </button>
              </div>
              {family.members.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No members yet.</p>
              ) : (
                <ul className="space-y-3 pl-4 border-l-2 border-blue-200">
                  {family.members.map((member) => (
                    <motion.li
                      key={member.id}
                      whileHover={{ x: 3 }}
                      className="flex items-center p-2 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      <div className="relative mr-3">
                        <Image
                          src={member.photo || "/images/default-avatar.png"}
                          width={40}
                          height={40}
                          alt={`${member.name}'s profile picture`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-700">
                          {member.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.email || member.phone || "No contact"}
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </li>
          ))
        )}
      </ul>

      {showAddMemberModal && selectedFamilyId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl relative w-full max-w-md mx-auto">
            <button
              onClick={() => setShowAddMemberModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <AddFamilyMemberForm
              familyId={selectedFamilyId}
              onMemberAdded={handleMemberAdded}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
