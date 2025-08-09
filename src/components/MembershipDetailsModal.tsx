import { motion } from "framer-motion";
import { X, User, Mail, Phone, Calendar, Home, Shield } from "lucide-react";
import { useEffect } from "react";
import { useUserStore } from "@/store";

interface MembershipDetailsModalProps {
  userId: string;
  onClose: () => void;
}

export default function MembershipDetailsModal({
  userId,
  onClose,
}: MembershipDetailsModalProps) {
  const { currentUser, loading, error, fetchCurrentUser } = useUserStore();

  useEffect(() => {
    if (userId && (!currentUser || currentUser.id !== userId)) {
      fetchCurrentUser(userId);
    }
  }, [userId, fetchCurrentUser, currentUser]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Loading membership details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Error: {error}</p>
        <button onClick={onClose} className="mt-4 text-blue-600">
          Close
        </button>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="p-6 text-center">
        <p>No user data found.</p>
        <button onClick={onClose} className="mt-4 text-blue-600">
          Close
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <X className="h-6 w-6" />
      </button>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Membership Details</h2>

      <div className="space-y-4">
        <div className="flex items-center">
          <User className="h-5 w-5 text-blue-600 mr-3" />
          <p className="text-gray-700">
            <span className="font-semibold">Name:</span> {currentUser.name}
          </p>
        </div>
        <div className="flex items-center">
          <Mail className="h-5 w-5 text-blue-600 mr-3" />
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span> {currentUser.email}
          </p>
        </div>
        {currentUser.phone && (
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-blue-600 mr-3" />
            <p className="text-gray-700">
              <span className="font-semibold">Phone:</span> {currentUser.phone}
            </p>
          </div>
        )}
        {currentUser.membersince && (
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-blue-600 mr-3" />
            <p className="text-gray-700">
              <span className="font-semibold">Member Since:</span>{" "}
              {new Date(currentUser.membersince).toLocaleDateString()}
            </p>
          </div>
        )}
        {currentUser.address && (
          <div className="flex items-center">
            <Home className="h-5 w-5 text-blue-600 mr-3" />
            <p className="text-gray-700">
              <span className="font-semibold">Address:</span> {currentUser.address}
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 mt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Roles</h3>
          {currentUser.roles && currentUser.roles.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {currentUser.roles.map((role) => (
                <li key={role.id} className="text-gray-700 flex items-center">
                  <Shield className="h-4 w-4 text-green-600 mr-2" /> {role.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No roles assigned.</p>
          )}
        </div>

        {currentUser.family && (
          <div className="pt-4 border-t border-gray-200 mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Family</h3>
            <p className="text-gray-700">
              <span className="font-semibold">Family Name:</span>{" "}
              {currentUser.family.name}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
