"use client";

import { useState } from "react";
import { BibleStudyCourse, Lesson } from "@/generated/prisma";
import dynamic from "next/dynamic";
import QuestionManager from "./QuestionManager";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  Bars3Icon,
  XMarkIcon,
  DocumentTextIcon,
  PhotoIcon,
  ArrowPathIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
  ),
});

function SortableLessonItem({ lesson, onEdit, onManageQuestions, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="group relative p-5 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <button
            {...listeners}
            className="p-1 -ml-1 cursor-grab text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900">
              {lesson.order}. {lesson.title}
            </h3>
            {lesson.content && (
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {lesson.content.replace(/<[^>]*>/g, "")}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              {lesson.pdfUrl && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <DocumentTextIcon className="h-3 w-3 mr-1" />
                  PDF
                </span>
              )}
              {lesson.imageUrl && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <PhotoIcon className="h-3 w-3 mr-1" />
                  Image
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(lesson)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit lesson"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onManageQuestions(lesson)}
            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
            title="Manage questions"
          >
            <CheckCircleIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(lesson.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete lesson"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface LessonManagerProps {
  course: BibleStudyCourse & { lessons: Lesson[] };
}

export default function LessonManager({ course }: LessonManagerProps) {
  const [lessons, setLessons] = useState(
    course.lessons.sort((a, b) => a.order - b.order)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedLessonForQuestions, setSelectedLessonForQuestions] =
    useState<Lesson | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileUploadProgress, setFileUploadProgress] = useState<number | null>(
    null
  );
  const sensors = useSensors(useSensor(PointerSensor));

  const handleFileUpload = async (file: File, fileType: "pdf" | "image") => {
    const formData = new FormData();
    formData.append("file", file);

    let uploadUrl = "";
    if (fileType === "pdf") {
      uploadUrl = "/api/upload-certificate";
    } else if (fileType === "image") {
      uploadUrl = "/api/upload-image";
    }

    try {
      setFileUploadProgress(0);
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setFileUploadProgress(progress);
        }
      };

      const uploadPromise = new Promise<string | null>((resolve) => {
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            setFileUploadProgress(null);
            if (xhr.status === 200) {
              resolve(JSON.parse(xhr.responseText).url);
            } else {
              resolve(null);
            }
          }
        };
      });

      xhr.open("POST", uploadUrl, true);
      xhr.send(formData);

      return await uploadPromise;
    } catch (err) {
      setFileUploadProgress(null);
      return null;
    }
  };

  const openModalForEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonTitle(lesson.title);
    setLessonContent(lesson.content || "");
    setPdfUrl(lesson.pdfUrl);
    setImageUrl(lesson.imageUrl);
    setIsModalOpen(true);
  };

  const openModalForNew = () => {
    setEditingLesson(null);
    setLessonTitle("");
    setLessonContent("");
    setPdfUrl(null);
    setImageUrl(null);
    setIsModalOpen(true);
  };

  const handleOpenQuestionManager = (lesson: Lesson) => {
    setSelectedLessonForQuestions(lesson);
    setIsQuestionModalOpen(true);
  };

  const handleSaveLesson = async () => {
    setIsLoading(true);
    const isEditing = !!editingLesson;
    const url = isEditing
      ? `/api/bible-study/lesson/${editingLesson.id}`
      : `/api/bible-study/course/${course.id}/lesson`;
    const method = isEditing ? "PUT" : "POST";

    const body = {
      title: lessonTitle,
      content: lessonContent,
      pdfUrl,
      imageUrl,
      order: isEditing ? editingLesson.order : lessons.length + 1,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const savedLesson = await res.json();
        if (isEditing) {
          setLessons(
            lessons.map((l) => (l.id === savedLesson.id ? savedLesson : l))
          );
        } else {
          setLessons([...lessons, savedLesson]);
        }
        setIsModalOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this lesson? This action cannot be undone."
      )
    ) {
      const res = await fetch(`/api/bible-study/lesson/${lessonId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLessons(lessons.filter((l) => l.id !== lessonId));
      }
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setLessons((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        const updatedLessons = newOrder.map((lesson, index) => ({
          ...lesson,
          order: index + 1,
        }));

        // Optimistic UI update - we'll persist to backend in the background
        fetch("/api/bible-study/lessons/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessons: updatedLessons.map((l) => ({ id: l.id, order: l.order })),
          }),
        }).catch((err) => console.error("Failed to update lesson order:", err));

        return updatedLessons;
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Lesson Management</h2>
        <button
          onClick={openModalForNew}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Lesson
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={lessons} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {lessons.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No lessons yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first lesson.
                </p>
                <div className="mt-6">
                  <button
                    onClick={openModalForNew}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    New Lesson
                  </button>
                </div>
              </div>
            ) : (
              lessons.map((lesson) => (
                <SortableLessonItem
                  key={lesson.id}
                  lesson={lesson}
                  onEdit={openModalForEdit}
                  onManageQuestions={handleOpenQuestionManager}
                  onDelete={handleDeleteLesson}
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
      {/* Edit/Add Lesson Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay - this should be a separate div from the modal content */}
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal container - centered with proper z-index */}
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* Modal content */}
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {editingLesson ? "Edit Lesson" : "Create New Lesson"}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-6 space-y-6">
                  <div>
                    <label
                      htmlFor="lesson-title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Lesson Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="lesson-title"
                      type="text"
                      placeholder="Enter lesson title"
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PDF Attachment
                      </label>
                      <div className="flex items-center space-x-2">
                        <label className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <DocumentTextIcon className="h-5 w-5 mr-2" />
                          Choose File
                          <input
                            type="file"
                            accept=".pdf"
                            className="sr-only"
                            onChange={async (e) =>
                              e.target.files?.[0] &&
                              setPdfUrl(
                                await handleFileUpload(e.target.files[0], "pdf")
                              )
                            }
                          />
                        </label>
                        {pdfUrl && (
                          <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            View PDF
                          </a>
                        )}
                      </div>
                      {fileUploadProgress !== null && (
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${fileUploadProgress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image Attachment
                      </label>
                      <div className="flex items-center space-x-2">
                        <label className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <PhotoIcon className="h-5 w-5 mr-2" />
                          Choose Image
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={async (e) =>
                              e.target.files?.[0] &&
                              setImageUrl(
                                await handleFileUpload(
                                  e.target.files[0],
                                  "image"
                                )
                              )
                            }
                          />
                        </label>
                        {imageUrl && (
                          <div className="relative">
                            <img
                              src={imageUrl}
                              alt="Preview"
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lesson Content
                    </label>
                    <div className="mt-1 rounded-md border border-gray-300">
                      <RichTextEditor
                        content={lessonContent}
                        onChange={setLessonContent}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSaveLesson}
                  disabled={isLoading || !lessonTitle.trim()}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                      Saving...
                    </>
                  ) : editingLesson ? (
                    "Update Lesson"
                  ) : (
                    "Create Lesson"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Question Manager Modal */}
      {isQuestionModalOpen && selectedLessonForQuestions && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
            onClick={() => setIsQuestionModalOpen(false)}
          ></div>

          {/* Modal container */}
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* Modal content */}
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
              <QuestionManager
                lesson={selectedLessonForQuestions}
                onClose={() => setIsQuestionModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
