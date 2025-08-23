"use client";

import React, { useState, useEffect } from "react";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiTag,
  FiFileText,
  FiPlus,
  FiImage,
  FiSave,
  FiEye,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";

const EditBlogPostPage = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const [newBlogPostTitle, setNewBlogPostTitle] = useState("");
  const [newBlogPostContent, setNewBlogPostContent] = useState("");
  const [newBlogPostTags, setNewBlogPostTags] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [errorImage, setErrorImage] = useState<string | null>(null);
  const [originalLoading, setOriginalLoading] = useState(isEditing);
  const [characterCount, setCharacterCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isEditing) {
      const fetchBlogPost = async () => {
        try {
          const res = await fetch(`/api/blog?id=${id}`);
          if (!res.ok) {
            throw new Error("Failed to fetch blog post");
          }
          const data = await res.json();
          setNewBlogPostTitle(data.title || "");
          setNewBlogPostContent(data.content || "");
          setNewBlogPostTags(data.tags ? data.tags.join(", ") : "");
          setCoverImageUrl(data.url || "");
          setCharacterCount(data.content?.length || 0);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setOriginalLoading(false);
        }
      };
      fetchBlogPost();
    }
  }, [id, isEditing]);

  const handleCoverImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrorImage("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorImage("Image must be less than 5MB");
      return;
    }

    setLoadingImage(true);
    setErrorImage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to upload image");
      }

      const data = await res.json();
      setCoverImageUrl(data.url);
    } catch (err: any) {
      setErrorImage(err.message);
    } finally {
      setLoadingImage(false);
    }
  };

  const handleContentChange = (html: string) => {
    setNewBlogPostContent(html);
    setCharacterCount(html.replace(/<[^>]*>/g, "").length);
  };

  const handleSubmitBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!newBlogPostTitle.trim()) {
      setError("Title is required");
      setLoading(false);
      return;
    }

    if (!newBlogPostContent.trim() || newBlogPostContent === "<p></p>") {
      setError("Content is required");
      setLoading(false);
      return;
    }

    const method = isEditing ? "PUT" : "POST";
    const apiUrl = isEditing ? `/api/blog?id=${id}` : "/api/blog";

    try {
      const res = await fetch(apiUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newBlogPostTitle,
          content: newBlogPostContent,
          tags: newBlogPostTags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
          url: coverImageUrl,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message ||
            `Failed to ${isEditing ? "update" : "create"} blog post`
        );
      }
      router.push("/communications-officer");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    // Implement draft saving functionality
    alert("Draft saving functionality would be implemented here");
  };

  if (originalLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Loading blog post for editing...
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mb-6 group"
          >
            <FiArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Share your insights with the community
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveDraft}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center"
              >
                <FiSave className="mr-2" />
                Save Draft
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
              >
                <FiEye className="mr-2" />
                Preview
              </button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-lg mb-6 flex items-start"
            >
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
              <button onClick={() => setError(null)} className="ml-auto">
                <FiX className="h-4 w-4 text-red-500" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <motion.form
            onSubmit={handleSubmitBlogPost}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 lg:col-span-2"
          >
            <motion.div whileHover={{ scale: 1.005 }} className="space-y-2">
              <label
                htmlFor="blogPostTitle"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
              >
                <FiFileText className="mr-2 text-blue-500" />
                Title
              </label>
              <input
                type="text"
                id="blogPostTitle"
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={newBlogPostTitle}
                onChange={(e) => setNewBlogPostTitle(e.target.value)}
                required
                placeholder="Enter a compelling title..."
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.005 }} className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="blogPostContent"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                >
                  <FiFileText className="mr-2 text-blue-500" />
                  Content
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {characterCount} characters
                </span>
              </div>
              <div
                className="mt-1 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <RichTextEditor
                  content={newBlogPostContent}
                  onChange={handleContentChange}
                />
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.005 }} className="space-y-2">
              <label
                htmlFor="blogPostTags"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
              >
                <FiTag className="mr-2 text-blue-500" />
                Tags
              </label>
              <input
                type="text"
                id="blogPostTags"
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={newBlogPostTags}
                onChange={(e) => setNewBlogPostTags(e.target.value)}
                placeholder="technology, marketing, design (comma separated)"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Add relevant tags to help readers find your post
              </p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.005 }} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <FiImage className="mr-2 text-blue-500" />
                Cover Image
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="Paste image URL or upload below..."
                />

                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    id="coverImageUpload"
                    className="hidden"
                    onChange={handleCoverImageUpload}
                  />
                  <label
                    htmlFor="coverImageUpload"
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-all"
                  >
                    <FiUploadCloud className="mr-2" />
                    Upload
                  </label>
                </div>
              </div>

              {loadingImage && (
                <div className="flex items-center text-blue-500 text-sm">
                  <div className="animate-spin inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
                  Uploading image...
                </div>
              )}

              {errorImage && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errorImage}
                </p>
              )}

              {coverImageUrl && !loadingImage && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Image Preview:
                  </p>
                  <div className="relative group">
                    <img
                      src={coverImageUrl}
                      alt="Cover Preview"
                      className="max-h-48 w-full object-cover rounded-lg shadow-sm"
                    />
                    <button
                      onClick={() => setCoverImageUrl("")}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className={`flex-1 flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    {isEditing ? "Updating..." : "Publishing..."}
                  </>
                ) : (
                  <>
                    <FiPlus className="mr-2" />
                    {isEditing ? "Update Blog Post" : "Publish Blog Post"}
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60"
            >
              <h3 className="font-medium text-gray-800 dark:text-white mb-3">
                Post Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Title Length
                  </span>
                  <span className="font-medium">
                    {newBlogPostTitle.length}/100
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Content Length
                  </span>
                  <span className="font-medium">
                    {characterCount} characters
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tags</span>
                  <span className="font-medium">
                    {newBlogPostTags.split(",").filter((t) => t.trim()).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Cover Image
                  </span>
                  <span className="font-medium">
                    {coverImageUrl ? "Added" : "Missing"}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Tips Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800/50"
            >
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-3">
                Writing Tips
              </h3>
              <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
                <li className="flex items-start">
                  <div className="bg-blue-200 dark:bg-blue-700/50 rounded-full p-1 mr-2 mt-0.5">
                    <svg
                      className="h-3 w-3 text-blue-700 dark:text-blue-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>Keep titles under 60 characters for best results</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-200 dark:bg-blue-700/50 rounded-full p-1 mr-2 mt-0.5">
                    <svg
                      className="h-3 w-3 text-blue-700 dark:text-blue-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>Use 3-5 relevant tags to improve discoverability</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-200 dark:bg-blue-700/50 rounded-full p-1 mr-2 mt-0.5">
                    <svg
                      className="h-3 w-3 text-blue-700 dark:text-blue-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>Add a compelling cover image to attract readers</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EditBlogPostPage;
