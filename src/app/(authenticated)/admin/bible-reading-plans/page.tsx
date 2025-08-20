"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import { PlusCircle, Edit, Trash2, Loader2, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BibleReadingPlan {
  id: string;
  title: string;
  description?: string | null;
}

const AdminBibleReadingPlansPage = () => {
  const [plans, setPlans] = useState<BibleReadingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<BibleReadingPlan | null>(null);
  const [formState, setFormState] = useState({ title: "", description: "" });

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/bible-reading-plans");
      if (!response.ok) throw new Error("Failed to fetch reading plans.");
      const data = await response.json();
      setPlans(data);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormState((prev) => ({ ...prev, [id]: value }));
  };

  const handleEditClick = (plan: BibleReadingPlan) => {
    setCurrentPlan(plan);
    setFormState({ title: plan.title, description: plan.description || "" });
    setIsDialogOpen(true);
  };

  const handleAddNewClick = () => {
    setCurrentPlan(null);
    setFormState({ title: "", description: "" });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting plan...");
    try {
      const response = await fetch(`/api/bible-reading-plans?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete plan.");
      }
      toast.success("Plan deleted successfully.", { id: toastId });
      fetchPlans();
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading(currentPlan ? "Updating plan..." : "Creating plan...");

    const url = currentPlan ? `/api/bible-reading-plans?id=${currentPlan.id}` : "/api/bible-reading-plans";

    const method = currentPlan ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Operation failed.");
      }

      toast.success(`Plan ${currentPlan ? "updated" : "created"} successfully.`, { id: toastId });
      setIsDialogOpen(false);
      fetchPlans();
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
    <motion.div className="container mx-auto py-8 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Manage Bible Reading Plans</h1>
          <p className="text-lg text-gray-600">Create, edit, and delete reading plans.</p>
        </div>
        <Button onClick={handleAddNewClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Plan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Existing Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.title}</TableCell>
                  <TableCell>{plan.description}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/admin/bible-reading-plans/${plan.id}`}>
                      <Button variant="outline" size="sm">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Manage Lessons
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(plan)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the reading plan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(plan.id)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentPlan ? "Edit Plan" : "Add New Plan"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={formState.title}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formState.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{currentPlan ? "Save Changes" : "Create Plan"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AdminBibleReadingPlansPage;
