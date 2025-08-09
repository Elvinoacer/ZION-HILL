// components/BibleStudyProgress.tsx
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { BibleStudyProgress as PrismaBibleStudyProgress } from "@prisma/client";

interface BibleStudyProgressProps {
  overallProgress: number;
  targetSessions: number;
  completedSessions: number;
  totalSessions: number;
}

export default function BibleStudyProgress({
  overallProgress,
  targetSessions,
  completedSessions,
  totalSessions,
}: BibleStudyProgressProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold mb-5 text-gray-800">
        Bible Study Progress
      </h3>
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-32 h-32 md:mr-6 mb-4 md:mb-0">
          <CircularProgressbar
            value={overallProgress}
            text={`${overallProgress}%`}
            styles={buildStyles({
              pathColor: "#2563eb",
              textColor: "#2563eb",
              trailColor: "#e0e7ff",
              textSize: "24px",
            })}
          />
        </div>
        <div>
          <p className="text-gray-600 mb-2">
            Target: <span className="font-medium">{targetSessions} sessions per week</span>
          </p>
          <p className="text-gray-600">
            Completed: <span className="font-medium">{completedSessions}/{totalSessions} sessions</span> this
            week
          </p>
        </div>
      </div>
    </div>
  );
}
