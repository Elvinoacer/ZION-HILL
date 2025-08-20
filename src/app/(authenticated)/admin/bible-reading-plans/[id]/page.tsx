'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2, Loader2, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Lesson {
  id: string;
  title: string;
  content: string;
}

interface BibleReadingPlan {
  id: string;
  title: string;
  description?: string | null;
  lessons: Lesson[];
}

const ManageLessonsPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id: planId } = params;

  const [plan, setPlan] = useState<BibleReadingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [formState, setFormState] = useState({ title: '', content: '' });

  const fetchPlanWithLessons = useCallback(async () => {
    if (!planId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/bible-reading-plans/${planId}`);
      if (!response.ok) throw new Error('Failed to fetch reading plan details.');
      const data = await response.json();
      setPlan(data);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [planId]);

  useEffect(() => {
    fetchPlanWithLessons();
  }, [fetchPlanWithLessons]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
  };

  const handleEditClick = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setFormState({ title: lesson.title, content: lesson.content || '' });
    setIsDialogOpen(true);
  };

  const handleAddNewClick = () => {
    setCurrentLesson(null);
    setFormState({ title: '', content: '' });
    setIsDialogOpen(true);
  };

  const handleDelete = async (lessonId: string) => {
    const toastId = toast.loading('Deleting lesson...');
    try {
      // You would need a new API endpoint for lessons, e.g., /api/lessons/[id]
      // For now, we'll assume such an endpoint exists.
      const response = await fetch(`/api/lessons/${lessonId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete lesson.');
      toast.success('Lesson deleted successfully.', { id: toastId });
      fetchPlanWithLessons();
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading(currentLesson ? 'Updating lesson...' : 'Creating lesson...');
    
    const url = currentLesson ? `/api/lessons/${currentLesson.id}` : '/api/lessons';
    const method = currentLesson ? 'PUT' : 'POST';
    const body = JSON.stringify({ ...formState, bibleStudyId: planId });

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (!response.ok) throw new Error('Operation failed.');
      
      toast.success(`Lesson ${currentLesson ? 'updated' : 'created'} successfully.`, { id: toastId });
      setIsDialogOpen(false);
      fetchPlanWithLessons();
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin" /></div>;
  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
    <motion.div
      className="container mx-auto py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Plans
      </Button>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">{plan?.title}</h1>
          <p className="text-lg text-gray-600">{plan?.description}</p>
        </div>
        <Button onClick={handleAddNewClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Lesson
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lesson Title</TableHead>
                <TableHead>Content Snippet</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plan?.lessons.map(lesson => (
                <TableRow key={lesson.id}>
                  <TableCell className="font-medium">{lesson.title}</TableCell>
                  <TableCell>{lesson.content.substring(0, 100)}...</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(lesson)}>
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
                            This action cannot be undone. This will permanently delete the lesson.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(lesson.id)}>
                            Continue
                          </AlertDialogAction>
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
            <DialogTitle>{currentLesson ? 'Edit Lesson' : 'Add New Lesson'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input id="title" value={formState.title} onChange={handleInputChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content" className="text-right">Content</Label>
                <Textarea id="content" value={formState.content} onChange={handleInputChange} className="col-span-3" rows={10} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {currentLesson ? 'Save Changes' : 'Create Lesson'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ManageLessonsPage;
