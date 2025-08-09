import { motion } from "framer-motion";
import { BookOpen, Users, Calendar, BarChart2, X } from "lucide-react";
import { useState } from "react";
import { Ministry, User } from "@prisma/client";
import { useMinistryStore } from "@/store";

interface MinistryInfoProps {
  ministry: Ministry & { leader: User | null };
}

export default function MinistryInfo({ ministry }: MinistryInfoProps) {
  const { updateMinistry } = useMinistryStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: ministry.name,
    description: ministry.description || "",
    leaderId: ministry.leaderId || "",
  });

  const stats = [
    {
      icon: <Users className="h-5 w-5" aria-hidden="true" />,
      label: "Members",
      value: ministry.membersCount || 0,
    },
    {
      icon: <BookOpen className="h-5 w-5" aria-hidden="true" />,
      label: "Active Programs",
      value: ministry.activePrograms || 0,
    },
    {
      icon: <Calendar className="h-5 w-5" aria-hidden="true" />,
      label: "Upcoming Events",
      value: ministry.upcomingEvents || 0,
    },
  ];

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMinistry(ministry.id, editData);
      alert("Ministry updated successfully!");
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating ministry:", error);
      alert("Failed to update ministry.");
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="region"
      aria-labelledby="ministry-info-heading"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3
            id="ministry-info-heading"
            className="text-xl font-semibold text-gray-800"
          >
            {ministry.name}
          </h3>
          <p className="text-gray-600">Leader: {ministry.leader?.name || "N/A"}</p>
        </div>
        <button
          onClick={() => setShowEditModal(true)}
          className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          aria-label="Edit ministry details"
        >
          Edit Ministry
        </button>
      </div>

      <p className="text-gray-700 mb-6">{ministry.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -3 }}
            className="bg-gradient-to-b from-gray-50 to-gray-100 p-4 rounded-lg text-center"
            role="group"
            aria-label={`${stat.label}: ${stat.value}`}
          >
            <div className="flex justify-center text-blue-600 mb-2">
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-semibold mb-3 flex items-center text-gray-800">
          <BarChart2 className="mr-2 h-5 w-5" aria-hidden="true" /> Ministry
          Growth
        </h4>
        <div
          className="h-40 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-gray-500"
          aria-hidden="true"
        >
          [Growth Chart Placeholder]
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white p-6 rounded-lg shadow-xl relative w-full max-w-md mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Ministry</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="name" name="name" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" name="description" value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
              </div>
              <div>
                <label htmlFor="leaderId" className="block text-sm font-medium text-gray-700">Leader ID</label>
                <input type="text" id="leaderId" name="leaderId" value={editData.leaderId} onChange={(e) => setEditData({ ...editData, leaderId: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                Save Changes
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
