import { motion } from "framer-motion";
import { useEffect } from "react";
import { useMinistryStore } from "@/store";
import { Ministry } from "@prisma/client";

export default function MinistryOverview() {
  const { ministries, loading, error, fetchMinistries } = useMinistryStore();

  useEffect(() => {
    fetchMinistries();
  }, []);

  if (loading) return <div className="text-center py-8">Loading ministries...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      <div className="px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          All Ministries Overview
        </h2>
      </div>
      <div className="p-6">
        {ministries.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No ministries found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ministries.map((ministry: Ministry) => (
              <div key={ministry.id} className="border p-4 rounded-lg">
                <h3 className="font-bold text-gray-800">{ministry.name}</h3>
                <p className="text-sm text-gray-600">{ministry.description}</p>
                {/* Display other relevant ministry details here */}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
