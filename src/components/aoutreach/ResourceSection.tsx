"use client";
import {
  DonationLogs,
  TaxReceiptGenerator,
} from "@/components/outreach/resources";

export function ResourceSection() {
  return (
    <section aria-labelledby="resource-allocation">
      <h2
        id="resource-allocation"
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
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
        Resource Allocation
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-medium mb-4">
            Donation Distribution Logs
          </h3>
          <DonationLogs />
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-medium mb-4">Tax Receipt Generator</h3>
          <TaxReceiptGenerator />
        </div>
      </div>
    </section>
  );
}
