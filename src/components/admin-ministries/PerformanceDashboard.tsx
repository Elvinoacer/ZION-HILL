"use client";
// import { BarChart, LineChart } from "@/components/charts";
import { Ministry } from "@/lib/types";

export function PerformanceDashboard() {
  const ministries: Ministry[] = []; // Fetch from API

  return (
    <section aria-labelledby="performance-tracking">
      <h2
        id="performance-tracking"
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        Ministry Performance Tracking
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-medium mb-4">Attendance Analytics</h3>
          {/* <LineChart
            data={attendanceData}
            options={{
              xAxis: { title: "Week" },
              yAxis: { title: "Attendance" },
            }}
          /> */}
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-medium mb-4">Participation Comparison</h3>
          {/* <BarChart
            data={participationData}
            options={{
              groupBy: "ministry",
              metrics: ["regular", "new", "volunteers"],
            }}
          /> */}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-medium mb-4">Growth Trends</h3>
        <div className="flex space-x-4 mb-4">
          <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md">
            Weekly
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Monthly
          </button>
          <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md">
            Quarterly
          </button>
        </div>
        {/* <LineChart
          data={growthData}
          options={{
            xAxis: { title: "Time Period" },
            yAxis: { title: "Growth %" },
            showTrendline: true,
          }}
        /> */}
      </div>
    </section>
  );
}
