"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, XCircle } from "lucide-react";
import { toast, Toaster } from "sonner";

interface Devotional {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const AdminDevotionalsPage = () => {
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDevotional, setEditingDevotional] = useState<Devotional | null>(
    null
  );
  const [newDevotionalTitle, setNewDevotionalTitle] = useState("");
  const [newDevotionalVerse, setNewDevotionalVerse] = useState("");
  const [newDevotionalReference, setNewDevotionalReference] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [devotionalToDeleteId, setDevotionalToDeleteId] = useState<
    string | null
  >(null);

  const fetchDevotionals = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/devotionals");
      if (!res.ok) {
        throw new Error("Failed to fetch devotionals");
      }
      const data: Devotional[] = await res.json();
      const parsedData = data.map((d) => {
        const verseMatch = d.content.match(/Verse: (.*) \(Reference: (.*)\)/);
        return {
          ...d,
          verse: verseMatch ? verseMatch[1] : d.content,
          reference: verseMatch ? verseMatch[2] : "N/A",
        };
      });
      setDevotionals(parsedData);
    } catch (err: any) {
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevotionals();
  }, []);

  const resetForm = () => {
    setNewDevotionalTitle("");
    setNewDevotionalVerse("");
    setNewDevotionalReference("");
    setEditingDevotional(null);
    setShowForm(false);
  };

  const handleAddOrUpdateDevotional = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingDevotional ? "PUT" : "POST";
    const url = editingDevotional
      ? `/api/devotionals?id=${editingDevotional.id}`
      : "/api/devotionals";
    const toastId = toast.loading(
      editingDevotional ? "Updating devotional..." : "Creating devotional..."
    );

    const content = `Verse: ${newDevotionalVerse} (Reference: ${newDevotionalReference})`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newDevotionalTitle,
          content: content,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save devotional");
      }

      toast.success(
        editingDevotional
          ? "Devotional updated successfully!"
          : "Devotional created successfully!",
        { id: toastId }
      );
      resetForm();
      fetchDevotionals();
    } catch (err: any) {
      toast.error(`Error: ${err.message}`, { id: toastId });
      setError(err.message);
    }
  };

  const handleDeleteDevotional = (id: string) => {
    setDevotionalToDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteDevotional = async () => {
    if (!devotionalToDeleteId) return;

    const originalDevotionals = [...devotionals];
    setDevotionals(devotionals.filter((d) => d.id !== devotionalToDeleteId));
    setShowDeleteConfirm(false);
    const toastId = toast.loading("Deleting devotional...");

    try {
      const res = await fetch(`/api/devotionals?id=${devotionalToDeleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete devotional");
      }

      toast.success("Devotional deleted successfully!", { id: toastId });
    } catch (err: any) {
      setDevotionals(originalDevotionals);
      toast.error(`Error: ${err.message}`, { id: toastId });
      setError(err.message);
    } finally {
      setDevotionalToDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 md:p-8 font-sans">
        <div className="max-w-5xl Mx-auto space-y-6">
          <Skeleton className="h-12 w-64 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-md" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Error
          </h1>
          <p className="text-base sm:text-lg text-red-500 mb-6 flex items-center justify-center gap-2">
            <XCircle size={20} /> {error}
          </p>
          <Button
            onClick={() => fetchDevotionals()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 rounded-lg px-4 py-2"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent mb-2">
            Manage Devotionals
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Create, update, and delete daily devotionals.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <Button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg px-4 py-2"
          >
            <Plus size={18} className="mr-2" /> Add New Devotional
          </Button>
        </motion.div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 sm:mb-8 p-4 sm:p-6 rounded-2xl bg-white shadow-sm border border-blue-100 overflow-hidden"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                {editingDevotional
                  ? "Edit Devotional"
                  : "Create New Devotional"}
              </h2>
              <form
                onSubmit={handleAddOrUpdateDevotional}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="title" className="text-sm sm:text-base">
                    Title
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={newDevotionalTitle}
                    onChange={(e) => setNewDevotionalTitle(e.target.value)}
                    required
                    className="mt-1 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="verse" className="text-sm sm:text-base">
                    Verse
                  </Label>
                  <Input
                    id="verse"
                    type="text"
                    value={newDevotionalVerse}
                    onChange={(e) => setNewDevotionalVerse(e.target.value)}
                    required
                    className="mt-1 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="reference" className="text-sm sm:text-base">
                    Reference
                  </Label>
                  <Input
                    id="reference"
                    type="text"
                    value={newDevotionalReference}
                    onChange={(e) => setNewDevotionalReference(e.target.value)}
                    required
                    className="mt-1 rounded-lg"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    type="submit"
                    className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700"
                  >
                    {editingDevotional
                      ? "Update Devotional"
                      : "Create Devotional"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="flex-1 rounded-lg"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          Existing Devotionals
        </h2>
        {devotionals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {devotionals.map((devotional) => (
              <motion.div
                key={devotional.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col justify-between border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base sm:text-lg text-blue-700">
                      {devotional.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {devotional.reference}
                    </p>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm sm:text-base text-gray-800 italic mb-4">
                      "{devotional.verse}"
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Created:{" "}
                      {new Date(devotional.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                  <div className="p-4 border-t flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingDevotional(devotional);
                        setNewDevotionalTitle(devotional.title);
                        const verseMatch = devotional.content.match(
                          /Verse: (.*) \(Reference: (.*)\)/
                        );
                        setNewDevotionalVerse(
                          verseMatch ? verseMatch[1] : devotional.content
                        );
                        setNewDevotionalReference(
                          verseMatch ? verseMatch[2] : ""
                        );
                        setShowForm(true);
                      }}
                      className="rounded-lg"
                    >
                      <Edit size={16} className="mr-1" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteDevotional(devotional.id)}
                      className="rounded-lg"
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-base sm:text-lg text-gray-500">
              No devotionals found. Add one to get started!
            </p>
          </div>
        )}

        <AnimatePresence>
          {showDeleteConfirm && (
            <Dialog
              open={showDeleteConfirm}
              onOpenChange={setShowDeleteConfirm}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <DialogContent className="sm:max-w-[425px] rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">
                      Confirm Deletion
                    </DialogTitle>
                  </DialogHeader>
                  <div className="py-4 text-sm sm:text-base">
                    Are you sure you want to delete this devotional? This action
                    cannot be undone.
                  </div>
                  <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 rounded-lg"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={confirmDeleteDevotional}
                      className="flex-1 rounded-lg"
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </motion.div>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default AdminDevotionalsPage;
