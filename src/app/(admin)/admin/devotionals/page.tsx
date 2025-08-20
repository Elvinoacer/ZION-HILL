"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, XCircle } from "lucide-react";
import { toast, Toaster } from 'sonner';

interface Devotional {
  id: string;
  title: string;
  content: string; // Now stores verse and reference
  createdAt: string;
}

const AdminDevotionalsPage = () => {
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDevotional, setEditingDevotional] = useState<Devotional | null>(null);
  const [newDevotionalTitle, setNewDevotionalTitle] = useState("");
  const [newDevotionalVerse, setNewDevotionalVerse] = useState(""); // Still used for form input
  const [newDevotionalReference, setNewDevotionalReference] = useState(""); // Still used for form input
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [devotionalToDeleteId, setDevotionalToDeleteId] = useState<string | null>(null);

  const fetchDevotionals = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/devotionals");
      if (!res.ok) {
        throw new Error("Failed to fetch devotionals");
      }
      const data: Devotional[] = await res.json();
      // Parse content back into verse and reference for display
      const parsedData = data.map(d => {
        const verseMatch = d.content.match(/Verse: (.*) \(Reference: (.*)\)/);
        return {
          ...d,
          verse: verseMatch ? verseMatch[1] : d.content, // Fallback to full content if parsing fails
          reference: verseMatch ? verseMatch[2] : 'N/A',
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
    const url = editingDevotional ? `/api/devotionals?id=${editingDevotional.id}` : "/api/devotionals";
    const toastId = toast.loading(editingDevotional ? "Updating devotional..." : "Creating devotional...");

    const content = `Verse: ${newDevotionalVerse} (Reference: ${newDevotionalReference})`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newDevotionalTitle,
          content: content, // Send combined content
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save devotional");
      }

      toast.success(editingDevotional ? "Devotional updated successfully!" : "Devotional created successfully!", { id: toastId });
      resetForm();
      fetchDevotionals(); // Re-fetch to ensure data consistency
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
    // Optimistic update
    setDevotionals(devotionals.filter(d => d.id !== devotionalToDeleteId));
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
      setDevotionals(originalDevotionals); // Revert on error
      toast.error(`Error: ${err.message}`, { id: toastId });
      setError(err.message);
    } finally {
      setDevotionalToDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-lg text-red-500 mb-6 flex items-center justify-center gap-2">
            <XCircle size={24} /> {error}
          </p>
          <Button
            onClick={() => fetchDevotionals()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent mb-2">
            Manage Devotionals
          </h1>
          <p className="text-lg text-gray-600">
            Create, update, and delete daily devotionals.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <Button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Plus size={20} className="mr-2" /> Add New Devotional
          </Button>
        </motion.div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 p-6 rounded-lg bg-white shadow-sm border border-blue-100 overflow-hidden"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {editingDevotional ? "Edit Devotional" : "Create New Devotional"}
              </h2>
              <form onSubmit={handleAddOrUpdateDevotional} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    value={newDevotionalTitle}
                    onChange={(e) => setNewDevotionalTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="verse">Verse</Label>
                  <Input
                    id="verse"
                    type="text"
                    value={newDevotionalVerse}
                    onChange={(e) => setNewDevotionalVerse(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reference">Reference</Label>
                  <Input
                    id="reference"
                    type="text"
                    value={newDevotionalReference}
                    onChange={(e) => setNewDevotionalReference(e.target.value)}
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    {editingDevotional ? "Update Devotional" : "Create Devotional"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Existing Devotionals</h2>
        {devotionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devotionals.map((devotional) => (
              <motion.div
                key={devotional.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col justify-between border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-blue-700">{devotional.title}</CardTitle>
                    <p className="text-gray-600 text-sm">{devotional.reference}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-800 italic mb-4">"{devotional.verse}"</p>
                    <p className="text-gray-500 text-xs">Created: {new Date(devotional.createdAt).toLocaleDateString()}</p>
                  </CardContent>
                  <div className="p-4 border-t flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingDevotional(devotional);
                        setNewDevotionalTitle(devotional.title);
                        // Parse content back to verse and reference for editing
                        const verseMatch = devotional.content.match(/Verse: (.*) \(Reference: (.*)\)/);
                        setNewDevotionalVerse(verseMatch ? verseMatch[1] : devotional.content);
                        setNewDevotionalReference(verseMatch ? verseMatch[2] : '');
                        setShowForm(true);
                      }}
                    >
                      <Edit size={16} className="mr-1" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteDevotional(devotional.id)}
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">No devotionals found. Add one to get started!</p>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
            >
              <Dialog
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
              >
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    Are you sure you want to delete this devotional? This action
                    cannot be undone.
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={confirmDeleteDevotional}
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default AdminDevotionalsPage;
