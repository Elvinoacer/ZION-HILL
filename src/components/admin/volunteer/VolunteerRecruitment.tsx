import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Filter,
  Search,
  Clock,
  Briefcase,
  Building2,
} from "lucide-react";
import { Role } from "@/generated/prisma";

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
  const [searchQuery, setSearchQuery] = useState("");

  // Get unique ministries, skills, and durations for filter options
  const ministries = Array.from(
    new Set(roles.map((role) => role.ministryId).filter(Boolean))
  );
  const allSkills = roles.flatMap((role) => role.skills || []);
  const skills = Array.from(new Set(allSkills));
  const durations = Array.from(
    new Set(roles.map((role) => role.duration).filter(Boolean))
  );

  const filteredRoles = roles.filter((role) => {
    // Search filter
    if (
      searchQuery &&
      !role.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Additional filters
    if (filter === "All") return true;
    if (filter === "Ministry" && filterValue)
      return role.ministryId === filterValue;
    if (filter === "Skill" && filterValue)
      return role.skills?.includes(filterValue);
    if (filter === "Duration" && filterValue)
      return role.duration === filterValue;

    return true;
  });

  const handleOnboard = (id: string) => {
    console.log(
      `Initiating onboarding for role ${id} with Checkr and training modules`
    );
    // In a real app, you would call a Zustand action here to start onboarding
  };

  return (
    <div className="text-gray-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Volunteer Recruitment
        </h2>

        {/* Search Bar */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Search roles"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-400" />
            Dynamic Sign-Up Portal
          </h3>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1">
              <label
                htmlFor="filter-type"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Filter By
              </label>
              <div className="relative">
                <select
                  id="filter-type"
                  value={filter}
                  onChange={(e) => {
                    setFilter(
                      e.target.value as
                        | "All"
                        | "Ministry"
                        | "Skill"
                        | "Duration"
                    );
                    setFilterValue("");
                  }}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  aria-label="Filter Roles"
                >
                  <option value="All">All Roles</option>
                  <option value="Ministry">Ministry</option>
                  <option value="Skill">Skill</option>
                  <option value="Duration">Duration</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {filter !== "All" && (
              <div className="flex-1">
                <label
                  htmlFor="filter-value"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  {filter} Value
                </label>
                <div className="relative">
                  <select
                    id="filter-value"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    aria-label={`Filter by ${filter}`}
                  >
                    <option value="">Select {filter}</option>
                    {filter === "Ministry" &&
                      ministries.map((ministry) => (
                        <option key={ministry} value={ministry}>
                          {ministry}
                        </option>
                      ))}
                    {filter === "Skill" &&
                      skills.map((skill) => (
                        <option key={skill} value={skill}>
                          {skill}
                        </option>
                      ))}
                    {filter === "Duration" &&
                      durations.map((duration) => (
                        <option key={duration} value={duration}>
                          {duration}
                        </option>
                      ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">
                Showing {filteredRoles.length} of {roles.length} roles
              </p>
              {(filter !== "All" && filterValue) || searchQuery ? (
                <button
                  onClick={() => {
                    setFilter("All");
                    setFilterValue("");
                    setSearchQuery("");
                  }}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Clear filters
                </button>
              ) : null}
            </div>

            {filteredRoles.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No roles found matching your criteria.</p>
                <button
                  onClick={() => {
                    setFilter("All");
                    setFilterValue("");
                    setSearchQuery("");
                  }}
                  className="mt-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Clear filters and try again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRoles.map((role, index) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 bg-gray-700/50 rounded-lg border border-gray-600/50 hover:border-blue-500/30 transition-colors"
                  >
                    <div className="flex items-start">
                      <div className="bg-blue-900/30 p-2 rounded-lg mr-3">
                        <Users className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white mb-1">
                          {role.name}
                        </div>
                        <div className="text-sm text-gray-300 space-y-1">
                          {role.ministryId && (
                            <div className="flex items-center">
                              <Building2 className="h-3 w-3 mr-1 text-blue-400" />
                              <span>{role.ministryId}</span>
                            </div>
                          )}
                          {role.skills && role.skills.length > 0 && (
                            <div className="flex items-center">
                              <Briefcase className="h-3 w-3 mr-1 text-purple-400" />
                              <span>{role.skills.join(", ")}</span>
                            </div>
                          )}
                          {role.duration && (
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-green-400" />
                              <span>{role.duration}</span>
                            </div>
                          )}
                        </div>
                        <motion.button
                          onClick={() => handleOnboard(role.id)}
                          className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          aria-label={`Onboard for ${role.name}`}
                        >
                          Start Onboarding
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
