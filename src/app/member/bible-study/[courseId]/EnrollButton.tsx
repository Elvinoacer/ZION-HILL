"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default function EnrollButton({ courseId }: { courseId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleEnroll = async () => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const res = await fetch(`/api/bible-study/course/${courseId}/enroll`, {
        method: "POST",
      });

      if (res.ok) {
        setIsSuccess(true);
        // Small delay before refresh to show success state
        setTimeout(() => router.refresh(), 1500);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to enroll. Please try again.");
      }
    } catch (err) {
      setError("Network error occurred. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleEnroll}
        disabled={isLoading || isSuccess}
        className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm transition-all duration-200 ${
          isSuccess
            ? "bg-green-600 text-white cursor-default"
            : isLoading
            ? "bg-blue-400 text-white cursor-wait"
            : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-md"
        }`}
      >
        {isSuccess ? (
          <>
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Enrolled Successfully!
          </>
        ) : isLoading ? (
          <>
            <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
            Enrolling...
          </>
        ) : (
          <>
            <ArrowRightIcon className="h-5 w-5 mr-2" />
            Enroll in this Course
          </>
        )}
      </button>

      {error && (
        <div className="flex items-start p-3 rounded-lg bg-red-50 text-red-700">
          <XCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
