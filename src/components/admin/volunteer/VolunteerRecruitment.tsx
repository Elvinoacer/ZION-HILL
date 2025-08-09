import { useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Role } from "@prisma/client";

interface VolunteerRecruitmentProps {
  roles: Role[];
}

export default function VolunteerRecruitment({
  roles,
}: VolunteerRecruitmentProps) {
  const [filter, setFilter] = useState<
    "All" | "Ministry" | "Skill" | "Duration"
  >("All");
  const [filterValue, setFilterValue] = useState("");

  const filteredRoles =
    filter === "All"
      ? roles
      : roles.filter((role) => {
          if (filter === "Ministry") return role.ministryId === filterValue; // Assuming ministryId on Role
          if (filter === "Skill") return role.skills.includes(filterValue); // Assuming skills on Role
          if (filter === "Duration") return role.duration === filterValue; // Assuming duration on Role
          return true;
        });

  const handleOnboard = (id: string) => {
    console.log(
      `Initiating onboarding for role ${id} with Checkr and training modules`
    );
    // In a real app, you would call a Zustand action here to start onboarding
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Volunteer Recruitment
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Dynamic Sign-Up Portal
          </h3>
          <div className="mt-4">
            <select
              value={filter}
              onChange={(e) =>
                setFilter(
                  e.target.value as "All" | "Ministry" | "Skill" | "Duration"
                )
              }
              className="p-2 border rounded-lg mr-2"
              aria-label="Filter Roles"
            >
              <option value="All">All Roles</option>
              <option value="Ministry">Ministry</option>
              <option value="Skill">Skill</option>
              <option value="Duration">Duration</option>
            </select>
            {filter !== "All" && (
              <input
                type="text"
                placeholder={`Filter by ${filter}`}
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="p-2 border rounded-lg"
                aria-label={`Filter by ${filter}`}
              />
            )}
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRoles.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No roles found.
              </div>
            ) : (
              filteredRoles.map((role, index) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {role.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Ministry: {role.ministryId || "N/A"} | Skills:{" "}
                      {role?.skills?.join(", ")} | {role.duration || "N/A"}
                    </div>
                    <motion.button
                      onClick={() => handleOnboard(role.id)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      whileHover={{ scale: 1.03 }}
                      aria-label={`Onboard for ${role.name}`}
                    >
                      Start Onboarding
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
