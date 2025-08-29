"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { safeFetch } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FileImage, Loader2, Send, Quote, User, Calendar, Sparkles, Inbox, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { toast } from "sonner";

interface Testimony {
  id: string;
  comment: string;
  userId: string;
  user?: { name: string, image?: string };
  imageUrl?: string;
  createdAt: string;
}

const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
            <Skeleton className="h-12 w-1/2 mx-auto mb-4" />
            <Skeleton className="h-6 w-3/4 mx-auto mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm overflow-hidden">
                        <Skeleton className="h-48 w-full" />
                        <CardContent className="p-6 space-y-3">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-5/6" />
                            <div className="flex items-center gap-3 pt-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    </div>
);

const TestimoniesWallPage = () => {
  const { data: session } = useSession();
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [newTestimony, setNewTestimony] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTestimonies = useCallback(async () => {
    try {
      const data = await safeFetch<Testimony[]>("/api/testimonies-wall");
      setTestimonies(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load testimonies.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonies();
  }, [fetchTestimonies]);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await safeFetch<{ url: string }>("/api/upload-image", { method: "POST", body: formData });
      return response.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image.");
      return null;
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimony.trim() && !imageFile) {
      toast.warning("Please write a testimony or upload an image.");
      return;
    }
    if (!session?.user?.id) {
      toast.error("You must be logged in to submit a testimony.");
      return;
    }

    setIsSubmitting(true);
    let uploadedImageUrl: string | null = null;
    if (imageFile) {
      uploadedImageUrl = await handleImageUpload(imageFile);
      if (!uploadedImageUrl) {
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await safeFetch("/api/testimonies-wall", {
        method: "POST",
        body: JSON.stringify({ comment: newTestimony, userId: session.user.id, imageUrl: uploadedImageUrl }),
      });
      toast.success("Your testimony has been shared!");
      setNewTestimony("");
      setImageFile(null);
      setImagePreview(null);
      fetchTestimonies();
    } catch (err: any) {
      toast.error("Failed to submit testimony.", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 bg-clip-text text-transparent">
                Wall of Testimonies
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-500 dark:text-gray-400">
                Witness the incredible work of faith in our community. Share your story and inspire others.
            </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <SubmitTestimonyForm {...{ handleSubmit, newTestimony, setNewTestimony, imagePreview, handleImageChange, isSubmitting, session, setImageFile, setImagePreview }} />
        </motion.div>

        <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-10 flex items-center justify-center gap-3">
                <Sparkles className="h-8 w-8 text-green-400"/>
                Community Stories
            </h2>
            {error && <ErrorDisplay message={error} />}
            <AnimatePresence>
                {testimonies.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonies.map((testimony) => (
                            <motion.div key={testimony.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}>
                                <TestimonyCard testimony={testimony} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <NoTestimoniesDisplay />
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

interface SubmitTestimonyFormProps {
  handleSubmit: (e: React.FormEvent) => void;
  newTestimony: string;
  setNewTestimony: (value: string) => void;
  imagePreview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
  session: any; // You might want to replace `any` with a more specific session type
  setImageFile: (file: File | null) => void;
  setImagePreview: (preview: string | null) => void;
}

const SubmitTestimonyForm = ({ handleSubmit, newTestimony, setNewTestimony, imagePreview, handleImageChange, isSubmitting, session, setImageFile, setImagePreview }: SubmitTestimonyFormProps) => (
    <Card className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60 rounded-2xl shadow-xl max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800 dark:text-gray-100">
                Share Your Testimony
            </CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea value={newTestimony} onChange={(e) => setNewTestimony(e.target.value)} placeholder="What has God done for you?" rows={4} disabled={!session?.user?.id || isSubmitting} className="bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-teal-500 rounded-xl p-4 transition" />
                <label htmlFor="image-upload" className={`cursor-pointer w-full border-2 border-dashed dark:border-gray-600 rounded-xl p-4 text-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition ${!session?.user?.id || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="flex flex-col items-center justify-center">
                        <FileImage className="h-8 w-8 mb-2" />
                        <span>{imagePreview ? "Image Selected" : "Add an Image"}</span>
                    </div>
                </label>
                <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} disabled={!session?.user?.id || isSubmitting} className="sr-only" />
                {imagePreview && (
                    <div className="relative group">
                        <Image src={imagePreview} alt="Preview" width={500} height={300} className="rounded-lg shadow-md" />
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => { setImageFile(null); setImagePreview(null); }}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                <Button type="submit" disabled={!session?.user?.id || isSubmitting} className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                    {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin" /> Submitting...</> : <><Send className="h-5 w-5" /> Share Testimony</>}
                </Button>
                {!session?.user?.id && <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Please sign in to share your testimony.</p>}
            </form>
        </CardContent>
    </Card>
);

const TestimonyCard = ({ testimony }: { testimony: Testimony }) => (
    <Card className="h-full flex flex-col bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-200/80 dark:border-gray-700/60 overflow-hidden transform hover:-translate-y-1.5 transition-transform duration-300 group">
        {testimony.imageUrl && (
            <div className="aspect-video w-full overflow-hidden">
                <Image src={testimony.imageUrl} alt="Testimony Image" width={500} height={300} className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
        )}
        <CardContent className="p-6 flex-grow flex flex-col">
            <blockquote className="flex-grow text-gray-600 dark:text-gray-300 italic mb-4">
                <Quote className="h-5 w-5 text-teal-500/50 absolute -left-3 top-4"/>
                {testimony.comment}
            </blockquote>
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700/60">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                    <AvatarImage src={testimony.user?.image} />
                    <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{testimony.user?.name?.[0] || 'A'}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{testimony.user?.name || "Anonymous"}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(testimony.createdAt), "MMM d, yyyy")}
                    </p>
                </div>
            </div>
        </CardContent>
    </Card>
);

const NoTestimoniesDisplay = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center col-span-full py-16 px-6 bg-white dark:bg-gray-800/40 rounded-2xl shadow-sm">
        <Inbox className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">The Wall is Awaiting Stories</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Be the first to share a testimony and light up this wall with faith.</p>
    </motion.div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="col-span-full flex justify-center">
        <Card className="w-full max-w-md text-center p-6 bg-red-50 dark:bg-red-900/20 border-red-500/50">
            <CardHeader className="flex flex-col items-center">
                <AlertCircle className="h-8 w-8 text-red-500 mb-2"/>
                <CardTitle className="text-red-600 dark:text-red-400">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent><p className="text-red-500 dark:text-red-300">{message}</p></CardContent>
        </Card>
    </div>
);

export default TestimoniesWallPage;
