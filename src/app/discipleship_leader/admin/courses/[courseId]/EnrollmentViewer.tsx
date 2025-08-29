
"use client";

import { useState } from "react";
import { BibleStudyEnrollment, User, LessonProgress, QuizAttempt } from "@/generated/prisma";

interface EnrollmentWithDetails extends BibleStudyEnrollment {
  user: User;
  progress: LessonProgress[];
  quizAttempts: QuizAttempt[];
}

interface EnrollmentViewerProps {
  enrollments: EnrollmentWithDetails[];
}

const ProgressDetailsModal = ({ enrollment, onClose }: { enrollment: EnrollmentWithDetails, onClose: () => void }) => {
  // A real implementation would fetch the course lessons to display all of them
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Progress for {enrollment.user.name}</h2>
        <div className="space-y-4">
          {/* This should map over all lessons in the course, not just quiz attempts */}
          {enrollment.quizAttempts.map(attempt => (
            <div key={attempt.id} className="p-4 border rounded-lg">
              <p>Lesson ID: {attempt.lessonId}</p>
              <p>Score: {attempt.score}%</p>
              <p>Attempted at: {new Date(attempt.attemptedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">Close</button>
        </div>
      </div>
    </div>
  );
};

export default function EnrollmentViewer({ enrollments }: EnrollmentViewerProps) {
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentWithDetails | null>(null);

  const calculateProgress = (enrollment: EnrollmentWithDetails) => {
    return enrollment.progress.filter(p => p.completedAt).length;
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Enrolled At</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Progress</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((enrollment) => (
            <tr key={enrollment.id}>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">{enrollment.user.name}</p>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">{enrollment.user.email}</p>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">{new Date(enrollment.enrolledAt).toLocaleDateString()}</p>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">{calculateProgress(enrollment)} lessons completed</p>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <button onClick={() => setSelectedEnrollment(enrollment)} className="text-blue-600 hover:underline">View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedEnrollment && <ProgressDetailsModal enrollment={selectedEnrollment} onClose={() => setSelectedEnrollment(null)} />}
    </div>
  );
}
