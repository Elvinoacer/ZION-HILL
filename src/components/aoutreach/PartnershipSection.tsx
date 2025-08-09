"use client";
import { PartnerTable, MouTracker } from "@/components/outreach/partners";

export function PartnershipSection() {
  return (
    <section aria-labelledby="partnerships">
      <h2
        id="partnerships"
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        Community Partnerships
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          <PartnerTable />
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-medium mb-4">MOU Tracking</h3>
          <MouTracker />
        </div>
      </div>
    </section>
  );
}
