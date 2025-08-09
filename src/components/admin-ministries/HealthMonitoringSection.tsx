"use client";
// import { AlertFeed, NeedsAssessment } from "@/components/admin/health";

export function HealthMonitoringSection() {
  return (
    <section aria-labelledby="health-monitoring">
      <h2
        id="health-monitoring"
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
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        Ministry Health Monitoring
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-medium mb-4">Needs Assessment</h3>
          {/* <NeedsAssessment /> */}
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-medium mb-4">Intervention Alerts</h3>
          {/* <AlertFeed /> */}
        </div>
      </div>
    </section>
  );
}
