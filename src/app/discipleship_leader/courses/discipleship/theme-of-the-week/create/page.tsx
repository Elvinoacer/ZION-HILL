"use client";

import React, { useState } from "react";
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
import { Loader2, ArrowLeft, Sparkles, BookOpen, Hash } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const CreateThemeOfTheWeekPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    verse: "",
    reference: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.verse.trim()) {
      newErrors.verse = "Verse is required";
    } else if (formData.verse.length < 5) {
      newErrors.verse = "Verse must be at least 5 characters";
    }

    if (!formData.reference.trim()) {
      newErrors.reference = "Reference is required";
    } else if (!/^[a-zA-Z0-9\s:]+$/.test(formData.reference)) {
      newErrors.reference = "Please enter a valid Bible reference";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    try {
      await safeFetch("/api/theme-of-the-week", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      toast.success("Theme of the Week created successfully!");
      setTimeout(() => {
        router.push("/discipleship");
      }, 1500);
    } catch (err: any) {
      toast.error(`Failed to create theme: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700/60 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => router.back()}
                className="flex items-center text-blue-100 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6" />
                <span className="text-sm font-medium bg-blue-500/20 px-2 py-1 rounded-full">
                  New Theme
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-3xl font-extrabold">
                  Create New Theme of the Week
                </CardTitle>
                <CardDescription className="text-blue-100/90 mt-1">
                  Craft a powerful message to inspire your community
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="grid gap-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Label
                  htmlFor="title"
                  className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 block flex items-center"
                >
                  <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                  Theme Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Theme of Hope"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.title
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                <AnimatePresence>
                  {errors.title && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.title}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Label
                  htmlFor="verse"
                  className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 block flex items-center"
                >
                  <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                  Bible Verse
                </Label>
                <Textarea
                  id="verse"
                  name="verse"
                  value={formData.verse}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="e.g., 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.'"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.verse
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                <AnimatePresence>
                  {errors.verse && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.verse}
                    </motion.p>
                  )}
                </AnimatePresence>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Enter the full Bible verse text
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Label
                  htmlFor="reference"
                  className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 block flex items-center"
                >
                  <Hash className="w-4 h-4 mr-2 text-blue-500" />
                  Bible Reference
                </Label>
                <Input
                  id="reference"
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  required
                  placeholder="e.g., John 3:16"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.reference
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                <AnimatePresence>
                  {errors.reference && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.reference}
                    </motion.p>
                  )}
                </AnimatePresence>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Format: Book Chapter:Verse (e.g., John 3:16)
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row justify-end gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="px-6 py-3 text-base font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 text-base font-medium rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-200 shadow-md hover:shadow-lg flex-1 sm:flex-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Create Theme
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>

        {/* Help Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800/50"
        >
          <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-3 flex items-center">
            <Sparkles className="mr-2" />
            Tips for Creating Effective Themes
          </h3>
          <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
            <li className="flex items-start">
              <div className="bg-blue-200 dark:bg-blue-700/50 rounded-full p-1 mr-2 mt-0.5">
                <Hash className="h-3 w-3 text-blue-700 dark:text-blue-300" />
              </div>
              <span>
                Choose a clear, inspiring title that reflects the theme's
                message
              </span>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-200 dark:bg-blue-700/50 rounded-full p-1 mr-2 mt-0.5">
                <BookOpen className="h-3 w-3 text-blue-700 dark:text-blue-300" />
              </div>
              <span>
                Select verses that directly support and illustrate your theme
              </span>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-200 dark:bg-blue-700/50 rounded-full p-1 mr-2 mt-0.5">
                <Sparkles className="h-3 w-3 text-blue-700 dark:text-blue-300" />
              </div>
              <span>
                Keep references accurate and properly formatted for easy lookup
              </span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CreateThemeOfTheWeekPage;
