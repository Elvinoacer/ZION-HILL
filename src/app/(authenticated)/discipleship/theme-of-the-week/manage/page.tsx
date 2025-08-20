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
import { Loader2, PlusCircle, Edit2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";

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

  const fetchThemes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await safeFetch<ThemeOfTheWeek[]>("/api/theme-of-the-week");
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        // This case should ideally be handled by the create page, but included for completeness
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
    if (confirm("Are you sure you want to delete this theme?")) {
      try {
        await safeFetch(`/api/theme-of-the-week?id=${id}`, {
          method: "DELETE",
        });
        toast.success("Theme deleted successfully!");
        fetchThemes();
      } catch (err: any) {
        toast.error(`Failed to delete theme: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchThemes} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Manage Weekly Themes</CardTitle>
            <CardDescription>View, edit, and delete themes of the week.</CardDescription>
          </div>
          <Link href="/discipleship/theme-of-the-week/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Theme
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {themes.length === 0 ? (
            <p className="text-center text-gray-500">No themes found. Click "Create New Theme" to add one.</p>
          ) : (
            <div className="grid gap-4">
              {themes.map((theme) => (
                <Card key={theme.id} className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-bold text-lg">{theme.title}</h3>
                    <p className="text-gray-600">"{theme.verse}" - {theme.reference}</p>
                    <p className="text-sm text-gray-500">Created: {new Date(theme.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(theme)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(theme.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Theme Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingTheme ? "Edit Theme" : "Create New Theme"}</DialogTitle>
            <DialogDescription>
              {editingTheme ? "Edit the details of the theme." : "Enter details for a new theme."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="verse">Verse</Label>
              <Textarea
                id="verse"
                name="verse"
                value={formData.verse}
                onChange={handleChange}
                required
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reference">Reference</Label>
              <Input
                id="reference"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingTheme ? "Update Theme" : "Create Theme"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageThemeOfTheWeekPage;
