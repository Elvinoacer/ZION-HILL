import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useUserStore, useFamilyStore } from "@/store";
import AddFamilyMemberForm from "./AddFamilyMemberForm";

export default function FamilyMembers() {
  const { currentUser, familyMembers, loading, error, fetchFamilyMembers } =
    useUserStore();
  const { fetchFamilies } = useFamilyStore(); // To refresh the family list after adding a member

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  useEffect(() => {
    if (currentUser?.familyId) {
      fetchFamilyMembers(currentUser.familyId);
    }
  }, [fetchFamilyMembers, currentUser?.familyId]);

  const handleAddMemberClick = () => {
    setShowAddMemberModal(true);
  };

  const handleMemberAdded = () => {
    setShowAddMemberModal(false);
    if (currentUser?.familyId) {
      fetchFamilyMembers(currentUser.familyId); // Re-fetch family members for this family
      fetchFamilies(); // Re-fetch all families to update FamilyList if it's also displayed
    }
  };

  if (loading)
    return <div className="text-center py-8">Loading family members...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Family Members</h3>
        {currentUser?.familyId && (
          <button
            onClick={handleAddMemberClick}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Member
          </button>
        )}
      </div>

      <div className="space-y-3">
        {familyMembers.length === 0 && !loading && !error ? (
          <p className="text-gray-600">
            {currentUser?.familyId
              ? "No members in this family yet."
              : "You are not part of a family. Create one in the Family tab."}
          </p>
        ) : (
          familyMembers.map((member) => (
            <motion.div
              key={member.id}
              whileHover={{ y: -2 }}
              className="flex items-center p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-all"
            >
              <div className="relative w-12 h-12 mr-4">
                <Image
                  src={member.photo || "/images/default-avatar.png"}
                  alt={member.name || "Family Member"}
                  width={48}
                  height={48}
                  className="rounded-full object-cover w-12 h-12"
                />
                <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      member.familyId ? "bg-blue-500" : "bg-green-500"
                    }`}
                  ></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">{member.name}</div>
                <div className="text-sm text-gray-600 capitalize">
                  {member.email || member.phone || "No contact"}
                </div>
              </div>
              <div>
                {member.familyId ? (
                  <span className="inline-block bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium">
                    Member
                  </span>
                ) : (
                  <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Register
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {showAddMemberModal && currentUser?.familyId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl relative w-full max-w-md mx-auto">
            <button
              onClick={() => setShowAddMemberModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <AddFamilyMemberForm
              familyId={currentUser.familyId}
              onMemberAdded={handleMemberAdded}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
