"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { safeFetch } from "@/lib/api";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, User, CalendarDays, Star, Send, Trash2, Edit, ImagePlus, X, Loader2, Quote, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  id: string;
  comment: string;
  userId: string;
  user?: { name: string; image?: string };
  createdAt: string;
  rating?: number;
  tags?: string[];
  imageUrl?: string;
}

const TestimonialsPage = () => {
  const { data: session } = useSession();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [newTestimonial, setNewTestimonial] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);
  const [editedComment, setEditedComment] = useState("");
  const [editedImage, setEditedImage] = useState<File | null>(null);
  const [editedImagePreview, setEditedImagePreview] = useState<string | null>(null);

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      const response = await safeFetch<{ testimonials: Testimonial[] }>("/api/testimonials");
      setTestimonials(response.testimonials);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load testimonials", { description: err.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (editedImagePreview) URL.revokeObjectURL(editedImagePreview);
    };
  }, [imagePreview, editedImagePreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0] || null;
    if (isEdit) {
        setEditedImage(file);
        if (file) setEditedImagePreview(URL.createObjectURL(file));
        else setEditedImagePreview(currentTestimonial?.imageUrl || null);
    } else {
        setImage(file);
        if (file) setImagePreview(URL.createObjectURL(file));
        else setImagePreview(null);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.trim() || !session?.user?.id) {
      toast.error("Please write a testimonial and ensure you are logged in.");
      return;
    }
    setIsSubmitting(true);
    try {
      let imageUrl: string | undefined;
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        const uploadRes = await fetch("/api/upload-image", { method: "POST", body: formData });
        if (!uploadRes.ok) throw new Error("Failed to upload image.");
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      await safeFetch("/api/testimonials", {
        method: "POST",
        body: JSON.stringify({ comment: newTestimonial, userId: session.user.id, imageUrl, tags: ["testimonial"] }),
      });

      toast.success("Testimonial submitted!", { description: "Thank you for sharing your experience." });
      setNewTestimonial("");
      setImage(null);
      setImagePreview(null);
      fetchTestimonials();
    } catch (err: any) {
      toast.error("Submission failed", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (testimonialId: string) => {
    toast.warning("Are you sure you want to delete this testimonial?", {
        action: {
            label: "Delete",
            onClick: async () => {
                try {
                    await safeFetch(`/api/testimonials?id=${testimonialId}`, { method: "DELETE" });
                    toast.success("Testimonial deleted successfully!");
                    fetchTestimonials();
                } catch (err: any) {
                    toast.error("Failed to delete testimonial", { description: err.message });
                }
            }
        },
        cancel: {
            label: "Cancel"
        }
    });
  };

  const handleEditClick = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setEditedComment(testimonial.comment);
    setEditedImage(null);
    setEditedImagePreview(testimonial.imageUrl || null);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTestimonial || !editedComment.trim()) {
        toast.error("Testimonial comment cannot be empty.");
        return;
    }
    setIsSubmitting(true);
    try {
      let imageUrl: string | undefined | null = currentTestimonial.imageUrl;
      if (editedImage) {
        const formData = new FormData();
        formData.append("file", editedImage);
        const uploadRes = await fetch("/api/upload-image", { method: "POST", body: formData });
        if (!uploadRes.ok) throw new Error("Failed to upload new image.");
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      } else if (editedImagePreview === null) {
        imageUrl = null;
      }

      await safeFetch(`/api/testimonials?id=${currentTestimonial.id}`, {
        method: "PUT",
        body: JSON.stringify({ comment: editedComment, imageUrl }),
      });

      toast.success("Testimonial updated successfully!");
      setIsEditModalOpen(false);
      fetchTestimonials();
    } catch (err: any) {
      toast.error("Failed to update testimonial", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} onRetry={fetchTestimonials} />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Voices of Faith
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-500 dark:text-gray-400">
                Discover inspiring stories from our community and share your own journey of faith.
            </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1 lg:sticky top-8">
            <SubmitTestimonialForm {...{ handleSubmit, newTestimonial, setNewTestimonial, image, imagePreview, handleFileChange, isSubmitting, session, setImage, setImagePreview }} />
          </motion.div>

          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {testimonials.length > 0 ? (
                testimonials.map((testimonial, index) => (
                  <motion.div key={testimonial.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: index * 0.05 }}>
                    <TestimonialCard {...{ testimonial, session, handleEditClick, handleDelete }} />
                  </motion.div>
                ))
              ) : (
                <NoTestimonials />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <EditTestimonialDialog {...{ isEditModalOpen, setIsEditModalOpen, handleUpdate, editedComment, setEditedComment, editedImagePreview, handleFileChange, setEditedImagePreview, isSubmitting }} />
    </div>
  );
};

const LoadingSkeleton = () => (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Skeleton className="h-12 w-1/3 mx-auto mb-4" />
        <Skeleton className="h-6 w-2/3 mx-auto mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-1"><Skeleton className="h-96 rounded-2xl" /></div>
            <div className="lg:col-span-2 space-y-6">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
            </div>
        </div>
    </div>
);

const ErrorState = ({ message, onRetry }: { message: string, onRetry: () => void }) => (
    <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8 bg-red-50 dark:bg-red-900/20 border-red-500/50">
            <CardHeader><CardTitle className="text-red-600 dark:text-red-400">An Error Occurred</CardTitle></CardHeader>
            <CardContent><p className="text-red-500 dark:text-red-300">{message}</p></CardContent>
            <CardFooter><Button onClick={onRetry} variant="destructive">Try Again</Button></CardFooter>
        </Card>
    </div>
);

const SubmitTestimonialForm = ({ handleSubmit, newTestimonial, setNewTestimonial, imagePreview, handleFileChange, isSubmitting, session, setImage, setImagePreview }: any) => (
    <Card className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60 rounded-2xl shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800 dark:text-gray-100">
                <Sparkles className="h-6 w-6 text-yellow-500" />
                Share Your Story
            </CardTitle>
            <CardDescription className="dark:text-gray-400">Your journey can be a beacon of hope for others.</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Textarea id="testimonial" value={newTestimonial} onChange={(e) => setNewTestimonial(e.target.value)} required rows={5} disabled={!session?.user?.id || isSubmitting} placeholder="Tell us about your experience..." className="bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-yellow-500 rounded-xl p-4 transition" />
                </div>
                <div className="space-y-2">
                    <label htmlFor="image-upload" className={`cursor-pointer w-full border-2 border-dashed dark:border-gray-600 rounded-xl p-4 text-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition ${!session?.user?.id || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <div className="flex flex-col items-center justify-center">
                            <ImagePlus className="h-8 w-8 mb-2" />
                            <span>{imagePreview ? "Change Photo" : "Add a Photo"}</span>
                        </div>
                    </label>
                    <Input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} disabled={!session?.user?.id || isSubmitting} className="sr-only" />
                </div>
                {imagePreview && (
                    <div className="relative group">
                        <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-lg shadow-md" />
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => { setImage(null); setImagePreview(null); }}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                <Button type="submit" disabled={!session?.user?.id || isSubmitting || !newTestimonial.trim()} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                    {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin" /> Submitting...</> : <><Send className="h-5 w-5" /> Share My Story</>}
                </Button>
                {!session?.user?.id && <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Please sign in to share your testimonial.</p>}
            </form>
        </CardContent>
    </Card>
);

const TestimonialCard = ({ testimonial, session, handleEditClick, handleDelete }: any) => (
    <Card className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-200/80 dark:border-gray-700/60 overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
        <CardContent className="p-6">
            <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarImage src={testimonial.user?.image} />
                    <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{testimonial.user?.name?.[0] || 'A'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{testimonial.user?.name || "Anonymous"}</h3>
                        <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {format(new Date(testimonial.createdAt), "MMM d, yyyy")}
                        </p>
                    </div>
                    {testimonial.rating && (
                        <div className="flex items-center gap-0.5 mt-1">
                            {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} />)}
                        </div>
                    )}
                </div>
            </div>
            {testimonial.imageUrl && (
                <div className="mt-4 -mx-6 aspect-video relative rounded-t-lg overflow-hidden">
                    <Image src={testimonial.imageUrl} alt="Testimonial image" layout="fill" objectFit="cover" />
                </div>
            )}
            <blockquote className="mt-4 text-gray-600 dark:text-gray-300 italic border-l-4 border-yellow-500 pl-4 py-2">
                <Quote className="h-5 w-5 text-yellow-500/50 absolute -left-3 top-1"/>
                {testimonial.comment}
            </blockquote>
            {testimonial.tags?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {testimonial.tags.map((tag: string, index: number) => <Badge key={index} variant="secondary" className="font-normal">{tag}</Badge>)}
                </div>
            )}
            {session?.user?.id === testimonial.userId && (
                <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditClick(testimonial)}><Edit className="h-4 w-4 mr-2" /> Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50" onClick={() => handleDelete(testimonial.id)}><Trash2 className="h-4 w-4 mr-2" /> Delete</Button>
                </div>
            )}
        </CardContent>
    </Card>
);

const NoTestimonials = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 px-6 bg-white dark:bg-gray-800/40 rounded-2xl shadow-sm">
        <MessageSquare className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No Stories Shared Yet</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Be the first to share your testimony and inspire our community!</p>
    </motion.div>
);

const EditTestimonialDialog = ({ isEditModalOpen, setIsEditModalOpen, handleUpdate, editedComment, setEditedComment, editedImagePreview, handleFileChange, setEditedImagePreview, isSubmitting }: any) => (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Edit Your Testimonial</DialogTitle>
                <DialogDescription>Make changes to your story. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <form id="edit-testimonial-form" onSubmit={handleUpdate} className="space-y-4 pt-4">
                <Textarea value={editedComment} onChange={(e) => setEditedComment(e.target.value)} rows={5} required className="min-h-[120px] bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-yellow-500" />
                <Input id="edit-image-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, true)} className="text-sm" />
                {editedImagePreview && (
                    <div className="relative group mt-2">
                        <img src={editedImagePreview} alt="Preview" className="w-full h-auto rounded-lg shadow-md" />
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setEditedImagePreview(null)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                <DialogFooter className="pt-4">
                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                    <Button type="submit" disabled={isSubmitting} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                        {isSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
);

export default TestimonialsPage;
