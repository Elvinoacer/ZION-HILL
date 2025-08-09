"use client";
import {
  SkillMatcher,
  DigitalWaiver,
  ReminderSystem,
} from "@/components/outreach/volunteers";

export function VolunteerMobilizationSection() {
  return (
    <section aria-labelledby="volunteer-mobilization">
      <h2
        id="volunteer-mobilization"
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
        Volunteer Mobilization
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-medium mb-4">Skill-Based Matching</h3>
          <SkillMatcher />
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-medium mb-4">Digital Waivers</h3>
            <DigitalWaiver />
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-medium mb-4">Reminder System</h3>
            <ReminderSystem />
          </div>
        </div>
      </div>
    </section>
  );
}
