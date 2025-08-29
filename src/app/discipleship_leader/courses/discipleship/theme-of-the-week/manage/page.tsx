"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { safeFetch } from "@/lib/api";
import { toast } from "sonner";
import {
  Loader2,
  PlusCircle,
  Edit2,
  Trash2,
  ArrowLeft,
  BookOpen,
  Calendar,
  Hash,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface ThemeOfTheWeek {
  id: string;
  title: string;
  verse: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
}

const ManageThemeOfTheWeekPage = () => {
  const [themes, setThemes] = useState<ThemeOfTheWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<ThemeOfTheWeek | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    verse: "",
    reference: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchThemes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await safeFetch<ThemeOfTheWeek[]>(
        "/api/theme-of-the-week"
      );
      setThemes(response);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to fetch themes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingTheme) {
        await safeFetch(`/api/theme-of-the-week?id=${editingTheme.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        toast.success("Theme updated successfully!");
      } else {
        await safeFetch("/api/theme-of-the-week", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        toast.success("Theme created successfully!");
      }
      setIsModalOpen(false);
      setEditingTheme(null);
      setFormData({ title: "", verse: "", reference: "" });
      fetchThemes();
    } catch (err: any) {
      toast.error(`Failed to save theme: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (theme: ThemeOfTheWeek) => {
    setEditingTheme(theme);
    setFormData({
      title: theme.title,
      verse: theme.verse,
      reference: theme.reference,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await safeFetch(`/api/theme-of-the-week?id=${id}`, {
        method: "DELETE",
      });
      toast.success("Theme deleted successfully!");
      setDeleteConfirm(null);
      fetchThemes();
    } catch (err: any) {
      toast.error(`Failed to delete theme: ${err.message}`);
    }
  };

  const openModal = () => {
    setEditingTheme(null);
    setFormData({ title: "", verse: "", reference: "" });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Loading themes...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/60">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Error
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={fetchThemes}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div>
            <Link
              href="/discipleship"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Discipleship
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Manage Weekly Themes
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              View, edit, and delete themes of the week
            </p>
          </div>
          <Button
            onClick={openModal}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Theme
          </Button>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total Themes
                </dt>
                <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {themes.length}
                </dd>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
                <Sparkles className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Active Theme
                </dt>
                <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {themes.length > 0 ? "Yes" : "No"}
                </dd>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Last Updated
                </dt>
                <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                  {themes.length > 0
                    ? new Date(themes[0].updatedAt).toLocaleDateString()
                    : "Never"}
                </dd>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Themes List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 overflow-hidden"
        >
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-6 w-6" />
              <div>
                <CardTitle className="text-2xl font-bold">
                  Weekly Themes
                </CardTitle>
                <CardDescription className="text-blue-100/90">
                  Manage your inspirational themes and verses
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {themes.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No themes found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Get started by creating your first inspirational theme.
                </p>
                <Button
                  onClick={openModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <PlusCircle className="mr-2 h-5 w-5" /> Create Your First
                  Theme
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {themes.map((theme, index) => (
                  <motion.div
                    key={theme.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                              {theme.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 italic mb-3">
                              "{theme.verse}"
                            </p>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
                              <Hash className="h-4 w-4 mr-1" />
                              {theme.reference}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-500 mt-2">
                              <Calendar className="h-4 w-4 mr-1" />
                              Created:{" "}
                              {new Date(theme.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(theme)}
                              className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                            >
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeleteConfirm(theme.id)}
                              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </motion.div>

        {/* Theme Edit/Create Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingTheme ? "Edit Theme" : "Create New Theme"}
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                {editingTheme
                  ? "Edit the details of the theme."
                  : "Enter details for a new inspirational theme."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label
                  htmlFor="title"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  placeholder="e.g., Theme of Hope"
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="verse"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Verse
                </Label>
                <Textarea
                  id="verse"
                  name="verse"
                  value={formData.verse}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  placeholder="Enter the Bible verse text..."
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="reference"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Reference
                </Label>
                <Input
                  id="reference"
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  required
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  placeholder="e.g., John 3:16"
                />
              </div>
              <DialogFooter className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingTheme ? "Update Theme" : "Create Theme"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog
          open={!!deleteConfirm}
          onOpenChange={(open) => !open && setDeleteConfirm(null)}
        >
          <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Confirm Deletion
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Are you sure you want to delete this theme? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
                className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Theme
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ManageThemeOfTheWeekPage;
