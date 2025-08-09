"use client";
import { Tabs } from "@/components/ui/tabs";
import {
  TripFundraising,
  TripChecklist,
  LiveUpdates,
  ImpactReporting,
} from "@/components/outreach/trips";

export function MissionTripSection() {
  return (
    <section aria-labelledby="mission-trips">
      <h2
        id="mission-trips"
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
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        Mission Trip Coordination
      </h2>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <Tabs.Group>
          <Tab.List className="flex border-b border-gray-200">
            {["Pre-Trip", "During Trip", "Post-Trip"].map((phase) => (
              <Tab
                key={phase}
                className={({ selected }) =>
                  `px-4 py-3 text-sm font-medium focus:outline-none ${
                    selected
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`
                }
              >
                {phase}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="p-6">
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <TripFundraising />
                <TripChecklist />
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="space-y-6">
                <LiveUpdates />
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">
                    Emergency Contacts
                  </h4>
                  <p className="text-sm text-blue-700">
                    Local authorities: +1 (555) 123-4567
                  </p>
                  <p className="text-sm text-blue-700">
                    Church emergency line: +1 (555) 987-6543
                  </p>
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <ImpactReporting />
            </Tab.Panel>
          </Tab.Panels>
        </Tabs.Group>
      </div>
    </section>
  );
}
