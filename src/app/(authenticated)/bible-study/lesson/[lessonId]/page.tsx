"use client";

import { useState, useEffect } from "react";
import { Lesson, LessonQuestion } from "@/generated/prisma";
import {
  BookOpenIcon,
  DocumentTextIcon,
  CameraIcon as PhotographIcon,
  LinkIcon as ExternalLinkIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface LessonData extends Lesson {
  questions: LessonQuestion[];
}

export default function LessonPage({
  params,
}: {
  params: { lessonId: string };
}) {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [result, setResult] = useState<{
    score: number;
    feedback: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/bible-study/lesson/${params.lessonId}`);
        if (res.ok) {
          const data = await res.json();
          setLesson(data);
        } else {
          setError("Failed to load lesson. Please try again.");
        }
      } catch (err) {
        setError("Network error occurred. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLesson();
  }, [params.lessonId]);

  const handleAnswerChange = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/bible-study/lesson/${params.lessonId}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        setError("Failed to submit quiz. Please try again.");
      }
    } catch (err) {
      setError("Network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 mx-auto text-blue-600 animate-spin" />
          <p className="mt-4 text-lg text-gray-600">
            Loading lesson content...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-md">
          <XCircleIcon className="h-12 w-12 mx-auto text-red-500" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Error Loading Lesson
          </h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-md">
          <BookOpenIcon className="h-12 w-12 mx-auto text-gray-400" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Lesson Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            The requested lesson could not be found.
          </p>
          <Link
            href="/bible-study"
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Browse Other Lessons
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Lesson Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {lesson.title}
          </h1>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {lesson.pdfUrl && (
              <a
                href={lesson.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
              >
                <DocumentTextIcon className="h-4 w-4 mr-1.5" />
                PDF Notes
              </a>
            )}
            {lesson.imageUrl && (
              <a
                href={lesson.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
              >
                <PhotographIcon className="h-4 w-4 mr-1.5" />
                Visual Aid
              </a>
            )}
            {lesson.externalLink && (
              <a
                href={lesson.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
              >
                <ExternalLinkIcon className="h-4 w-4 mr-1.5" />
                External Resource
              </a>
            )}
          </div>
        </div>

        {/* Lesson Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <div className="p-6 sm:p-8">
            {lesson.content && (
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            )}
            {lesson.imageUrl && (
              <div className="mt-6 rounded-lg overflow-hidden shadow-md">
                <img
                  src={lesson.imageUrl}
                  alt={lesson.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Quiz Section */}
        {lesson.questions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Test Your Knowledge
              </h2>

              {!result ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {lesson.questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="p-4 sm:p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow bg-gray-50/50"
                    >
                      <p className="text-md sm:text-lg font-medium text-gray-900 mb-4">
                        <span className="font-bold">{index + 1}.</span>{" "}
                        {question.text}
                      </p>
                      <div className="space-y-3">
                        {question.options.map((option, idx) => (
                          <label
                            key={idx}
                            className={`flex items-start p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                              answers[question.id] === idx
                                ? "bg-blue-50 border-blue-400 shadow-sm"
                                : "bg-white hover:bg-blue-50/50 border-gray-200 hover:border-blue-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={idx}
                              checked={answers[question.id] === idx}
                              onChange={() =>
                                handleAnswerChange(question.id, idx)
                              }
                              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-3 text-md text-gray-700">
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        Object.keys(answers).length !== lesson.questions.length
                      }
                      className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                    >
                      {isSubmitting ? (
                        <>
                          <ArrowPathIcon className="animate-spin h-5 w-5 mr-3" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="h-5 w-5 mr-3" />
                          Submit Quiz
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div
                    className={`mx-auto flex items-center justify-center h-20 w-20 sm:h-24 sm:w-24 rounded-full animate-pulse ${
                      result.score >= 80
                        ? "bg-green-100 text-green-600"
                        : result.score >= 50
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    <span className="text-3xl sm:text-4xl font-bold">
                      {result.score.toFixed(0)}%
                    </span>
                  </div>
                  <h3 className="mt-6 text-2xl sm:text-3xl font-medium text-gray-900">
                    {result.score >= 80
                      ? "Excellent Work!"
                      : result.score >= 50
                      ? "Good Job!"
                      : "Keep Practicing!"}
                  </h3>
                  <p className="mt-2 text-md text-gray-600 max-w-md mx-auto">
                    {result.feedback}
                  </p>
                  <button
                    onClick={() => {
                      setResult(null);
                      setAnswers({});
                    }}
                    className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
                  >
                    <ArrowPathIcon className="h-5 w-5 mr-2" />
                    Try Quiz Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
