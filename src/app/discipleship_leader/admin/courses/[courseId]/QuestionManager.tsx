"use client";

import { useState, useEffect } from "react";
import { Lesson, LessonQuestion } from "@/generated/prisma";
import {
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface QuestionManagerProps {
  lesson: Lesson;
  onClose: () => void;
}

export default function QuestionManager({
  lesson,
  onClose,
}: QuestionManagerProps) {
  const [questions, setQuestions] = useState<LessonQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [editingQuestion, setEditingQuestion] = useState<LessonQuestion | null>(
    null
  );
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/bible-study/lesson/${lesson.id}/question`
        );
        if (res.ok) {
          const data = await res.json();
          setQuestions(data.questions);
        } else {
          setError("Failed to load questions. Please try again.");
        }
      } catch (err) {
        setError("Network error occurred. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [lesson.id]);

  const resetForm = () => {
    setEditingQuestion(null);
    setQuestionText("");
    setOptions(["", ""]);
    setCorrectAnswerIndex(0);
  };

  const handleSaveQuestion = async () => {
    if (!questionText.trim() || options.some((opt) => !opt.trim())) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const isEditing = !!editingQuestion;
      const url = isEditing
        ? `/api/bible-study/question/${editingQuestion.id}`
        : `/api/bible-study/lesson/${lesson.id}/question`;
      const method = isEditing ? "PUT" : "POST";

      const body = {
        text: questionText,
        options,
        correctAnswerIndex,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const savedQuestion = await res.json();
        if (isEditing) {
          setQuestions(
            questions.map((q) =>
              q.id === savedQuestion.id ? savedQuestion : q
            )
          );
        } else {
          setQuestions([...questions, savedQuestion]);
        }
        resetForm();
      } else {
        setError("Failed to save question. Please try again.");
      }
    } catch (err) {
      setError("Network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this question? This action cannot be undone."
      )
    ) {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/bible-study/question/${questionId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setQuestions(questions.filter((q) => q.id !== questionId));
        } else {
          setError("Failed to delete question. Please try again.");
        }
      } catch (err) {
        setError("Network error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const populateFormForEdit = (question: LessonQuestion) => {
    setEditingQuestion(question);
    setQuestionText(question.text);
    setOptions(question.options);
    setCorrectAnswerIndex(question.correctAnswerIndex);
  };

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
      if (correctAnswerIndex === index) {
        setCorrectAnswerIndex(0);
      } else if (correctAnswerIndex > index) {
        setCorrectAnswerIndex(correctAnswerIndex - 1);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      ></div>

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        {/* Modal content */}
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all w-full max-w-3xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                Manage Questions:{" "}
                <span className="font-normal">{lesson.title}</span>
              </h2>
              <button
                onClick={onClose}
                className="rounded-md bg-white/10 p-1 text-white hover:bg-white/20 focus:outline-none"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="p-6 space-y-6">
            {/* Error message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XMarkIcon className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Question form */}
            <div className="rounded-lg border border-gray-200 p-6 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingQuestion ? "Edit Question" : "Add New Question"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="question-text"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Question Text <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="question-text"
                    placeholder="Enter the question text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer Options <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => setCorrectAnswerIndex(index)}
                          className={`flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center ${
                            correctAnswerIndex === index
                              ? "border-blue-500 bg-blue-100 text-blue-600"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {correctAnswerIndex === index && (
                            <CheckIcon className="h-3 w-3" />
                          )}
                        </button>
                        <input
                          type="text"
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...options];
                            newOptions[index] = e.target.value;
                            setOptions(newOptions);
                          }}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
                        />
                        {options.length > 2 && (
                          <button
                            onClick={() => removeOption(index)}
                            className="flex-shrink-0 text-gray-400 hover:text-red-500"
                            title="Remove option"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addOption}
                    className="mt-2 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Option
                  </button>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  {editingQuestion && (
                    <button
                      onClick={resetForm}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    onClick={handleSaveQuestion}
                    disabled={isLoading}
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : editingQuestion ? (
                      "Update Question"
                    ) : (
                      "Add Question"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Questions list */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Existing Questions
              </h3>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <ArrowPathIcon className="h-8 w-8 text-gray-400 animate-spin" />
                </div>
              ) : questions.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                  <p className="text-gray-500">No questions added yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {questions.map((q) => (
                    <div
                      key={q.id}
                      className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{q.text}</p>
                          <div className="mt-2 space-y-1">
                            {q.options.map((opt, idx) => (
                              <div key={idx} className="flex items-center">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    idx === q.correctAnswerIndex
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {opt}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => populateFormForEdit(q)}
                            className="rounded-md p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            title="Edit question"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="rounded-md p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                            title="Delete question"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
