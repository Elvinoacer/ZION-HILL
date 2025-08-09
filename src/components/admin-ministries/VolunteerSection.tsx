"use client";
// import { VolunteerTable, TrainingStatus } from "@/components/admin/volunteers";

export function VolunteerSection() {
  return (
    <section aria-labelledby="volunteer-management">
      <h2
        id="volunteer-management"
        className="text-2xl font-semibold mb-6 flex items-center"
      >
        <svg
          className="w-6 h-6 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        Volunteer Management
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          {/* <VolunteerTable /> */}
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-medium mb-4">Training Coordination</h3>
          {/* <TrainingStatus /> */}
        </div>
      </div>
    </section>
  );
}
