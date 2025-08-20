"use client";

import React, { useState, useEffect } from "react";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiTag,
  FiFileText,
  FiPlus,
  FiImage,
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
  const [originalLoading, setOriginalLoading] = useState(isEditing); // New state
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
          setCoverImageUrl(data.url || ""); // Use 'url' for cover image
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
      setCoverImageUrl(data.url); // Assuming the API returns { url: "..." }
    } catch (err: any) {
      setErrorImage(err.message);
    } finally {
      setLoadingImage(false);
    }
  };

  const handleSubmitBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
          tags: newBlogPostTags.split(",").map((tag) => tag.trim()),
          url: coverImageUrl,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to ${isEditing ? "update" : "create"} blog post`);
      }
      router.push("/communications-officer"); // Navigate back to dashboard
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      {originalLoading ? (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="mt-4 text-lg text-gray-600">Loading blog post for editing...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <button
              onClick={() => router.back()}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6"
            >
              <FiArrowLeft className="mr-2" />
              Back to Dashboard
            </button>

            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
            </h1>
            <p className="text-gray-600">
              Share your insights with the community
            </p>
          </motion.div>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
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
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
          <motion.form
            onSubmit={handleSubmitBlogPost}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100"
          >
            <motion.div whileHover={{ scale: 1.005 }} className="space-y-1">
              <label
                htmlFor="blogPostTitle"
                className="block text-sm font-medium text-gray-700 flex items-center"
              >
                <FiFileText className="mr-2 text-blue-500" />
                Title
              </label>
              <input
                type="text"
                id="blogPostTitle"
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={newBlogPostTitle}
                onChange={(e) => setNewBlogPostTitle(e.target.value)}
                required
                placeholder="Enter a compelling title..."
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.005 }} className="space-y-1">
              <label
                htmlFor="blogPostContent"
                className="block text-sm font-medium text-gray-700 flex items-center"
              >
                <FiFileText className="mr-2 text-blue-500" />
                Content
              </label>
              <div
                className="mt-1 border border-gray-300 rounded-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <RichTextEditor
                  content={newBlogPostContent}
                  onChange={(html) => setNewBlogPostContent(html)}
                />
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.005 }} className="space-y-1">
              <label
                htmlFor="blogPostTags"
                className="block text-sm font-medium text-gray-700 flex items-center"
              >
                <FiTag className="mr-2 text-blue-500" />
                Tags
              </label>
              <input
                type="text"
                id="blogPostTags"
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={newBlogPostTags}
                onChange={(e) => setNewBlogPostTags(e.target.value)}
                placeholder="technology, marketing, design (comma separated)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Add relevant tags to help readers find your post
              </p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.005 }} className="space-y-1">
              <label
                htmlFor="coverImage"
                className="block text-sm font-medium text-gray-700 flex items-center"
              >
                <FiImage className="mr-2 text-blue-500" />
                Cover Image URL (for blog card)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  id="coverImage"
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="Paste image URL or upload below..."
                />
                <input
                  type="file"
                  accept="image/*"
                  id="coverImageUpload"
                  className="hidden"
                  onChange={handleCoverImageUpload}
                />
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("coverImageUpload")?.click()
                  }
                  className="mt-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  Upload
                </button>
              </div>
              {loadingImage && (
                <p className="text-sm text-blue-500 mt-1">Uploading image...</p>
              )}
              {errorImage && (
                <p className="text-sm text-red-500 mt-1">{errorImage}</p>
              )}
              {coverImageUrl && !loadingImage && (
                <div className="mt-2">
                  <img
                    src={coverImageUrl}
                    alt="Cover Preview"
                    className="max-h-40 rounded-lg shadow-sm"
                  />
                </div>
              )}
            </motion.div>

            <div className="pt-4">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <FiPlus className="mr-2" />
                )}
                {loading ? (isEditing ? "Updating..." : "Publishing...") : (isEditing ? "Update Blog Post" : "Publish Blog Post")}
              </motion.button>
            </div>
          </motion.form>
        </div>
      )}
    </motion.div>
  );
};

export default EditBlogPostPage;
