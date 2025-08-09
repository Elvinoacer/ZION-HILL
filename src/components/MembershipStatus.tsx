import { motion } from "framer-motion";
import { BadgeCheck, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store";
import MembershipDetailsModal from "./MembershipDetailsModal";

export default function MembershipStatus() {
  const {
    membershipStatus,
    loading,
    error,
    fetchMembershipStatus,
    currentUser,
  } = useUserStore();

  const [showModal, setShowModal] = useState(false);

  // Placeholder for userId - in a real app, this would come from auth context
  const userId = "cmdyug60e0000rqhot5b47ii0"; // Replace with actual user ID

  useEffect(() => {
    fetchMembershipStatus(userId);
  }, [fetchMembershipStatus, userId]);

  const handleViewDetailsClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (loading)
    return <div className="text-center py-8">Loading membership status...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  const memberRole = membershipStatus.find((role) => role.name === "MEMBER");

  return (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3 className="text-xl font-bold mb-5 text-gray-800">
        Membership Status
      </h3>

      <div className="flex items-center mb-6">
        <div className="p-2 rounded-full bg-blue-50 mr-3">
          <BadgeCheck className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <div className="text-sm text-gray-500">Current Status</div>
          <div className="text-lg font-medium text-blue-700">
            {memberRole ? memberRole.name : (currentUser ? "Community Member" : "Not a Member")}
          </div>
        </div>
      </div>

      <div className="flex items-center p-3 bg-gray-50 rounded-lg mb-6">
        <div className="p-2 rounded-full bg-blue-50 mr-3">
          <Calendar className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <div className="text-sm text-gray-500">Member Since</div>
          <div className="font-medium text-gray-800">
            {currentUser?.membersince
              ? new Date(currentUser.membersince).toLocaleDateString()
              : "N/A"}
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm">
        Additional membership details, such as renewal dates or specific
        requirements, are not currently available.
      </p>

      <button
        onClick={handleViewDetailsClick}
        className="mt-6 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium flex items-center"
      >
        View Membership Details
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <MembershipDetailsModal userId={userId} onClose={handleCloseModal} />
        </div>
      )}
    </motion.div>
  );
}
