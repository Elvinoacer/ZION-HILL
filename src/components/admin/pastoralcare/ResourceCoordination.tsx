import { useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { usePastoralCareStore } from "@/store/pastoralCareStore";

export default function ResourceCoordination() {
  const { therapists } = usePastoralCareStore();

  const [filter, setFilter] = useState<"All" | "Christian">("All");

  const filteredTherapists =
    filter === "All" ? therapists : (therapists || []).filter((t: any) => t.christian);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Resource Coordination
      </h2>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Referral Network
        </h3>
        <div className="mt-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "All" | "Christian")}
            className="p-2 border rounded-lg"
            aria-label="Filter Therapists"
          >
            <option value="All">All Therapists</option>
            <option value="Christian">Christian Therapists</option>
          </select>
        </div>
        <div className="mt-4 space-y-2">
          {filteredTherapists.map((therapist, index) => (
            <motion.div
              key={therapist.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 bg-white rounded-lg shadow-sm flex items-center"
            >
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <div className="font-semibold text-gray-900">
                  {therapist.name}
                </div>
                <div className="text-sm text-gray-600">
                  Specialization: {therapist.specialization} |{" "}
                  {therapist.christian ? "Christian" : "Non-Christian"} |{" "}
                  {therapist.referralModel}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
