"use client";
// import { ExpenseApproval, BudgetSetter } from "@/components/admin/budget";

export function BudgetMonitoringSection() {
  return (
    <section aria-labelledby="budget-monitoring">
      <h2
        id="budget-monitoring"
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
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Budget Monitoring
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-medium mb-4">Expense Reports</h3>
          {/* <ExpenseApproval /> */}
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-medium mb-4">Budget Planning</h3>
          {/* <BudgetSetter /> */}
        </div>
      </div>
    </section>
  );
}
