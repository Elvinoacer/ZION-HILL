"use client";
import dynamic from "next/dynamic";
import { OutreachProgram } from "@/lib/types";

// Dynamically import to avoid SSR issues with maps
const Map = dynamic(() => import("@/components/maps/ActivityMap"), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 animate-pulse rounded-lg" />,
});

export function LiveActivityMap() {
  const programs: OutreachProgram[] = []; // Fetch from API

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Outreach Locations</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md">
            Evangelism
          </button>
          <button className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md">
            Social Justice
          </button>
          <button className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-md">
            Disaster Relief
          </button>
        </div>
      </div>

      <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
        <Map programs={programs} />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {programs.slice(0, 3).map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>
    </div>
  );
}

function ProgramCard({ program }: { program: OutreachProgram }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start">
        <div
          className={`w-3 h-3 mt-1 rounded-full mr-2 ${
            program.type === "evangelism"
              ? "bg-green-500"
              : program.type === "social-justice"
              ? "bg-blue-500"
              : "bg-purple-500"
          }`}
        ></div>
        <div>
          <h4 className="font-medium">{program.name}</h4>
          <p className="text-sm text-gray-600">{program.location}</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-gray-500">
              {program.volunteers} volunteers
            </span>
            <span className="mx-2">•</span>
            <span className="text-gray-500">{program.frequency}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
