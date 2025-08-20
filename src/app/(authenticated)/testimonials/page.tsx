"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { safeFetch } from "@/lib/api";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, User, CalendarDays, Star, Send, Trash2, Edit } from "lucide-react";
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
} from "@/components/ui/dialog";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);
  const [editedComment, setEditedComment] = useState("");
  const [editedImage, setEditedImage] = useState<File | null>(null);
  const [editedImagePreview, setEditedImagePreview] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await safeFetch<{ testimonials: Testimonial[], totalTestimonials: number }>("/api/testimonials");
      setTestimonials(response.testimonials);
      setTotalPages(Math.ceil(response.totalTestimonials / 10)); // Assuming pageSize is 10, as per route.ts
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load testimonials", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      if (editedImagePreview) {
        URL.revokeObjectURL(editedImagePreview);
      }
    };
  }, [imagePreview, editedImagePreview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!newTestimonial.trim()) {
      setError("Please enter your testimonial");
      setIsSubmitting(false);
      return;
    }

    if (!session?.user?.id) {
      setError("You must be logged in to submit a testimonial");
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl: string | undefined;
      if (image) {
        const formData = new FormData();
        formData.append("file", image);

        const uploadRes = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload image.");
        }

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      await safeFetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: newTestimonial,
          userId: session.user.id,
          sentiment: "POSITIVE",
          imageUrl: imageUrl,
          tags: ["testimonial"],
        }),
      });

      toast.success("Testimonial submitted!", {
        description: "Thank you for sharing your experience with us.",
      });
      setNewTestimonial("");
      setImage(null);
      setImagePreview(null);
      fetchTestimonials();
    } catch (err: any) {
      setError(err.message);
      toast.error("Submission failed", {
        description: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (testimonialId: string) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to delete a testimonial");
      return;
    }

    if (!confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    try {
      await safeFetch(`/api/testimonials?id=${testimonialId}`, {
        method: "DELETE",
      });
      toast.success("Testimonial deleted successfully!");
      fetchTestimonials(); // Refresh the list
    } catch (err: any) {
      toast.error("Failed to delete testimonial", {
        description: err.message,
      });
    }
  };

  const handleEditClick = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setEditedComment(testimonial.comment);
    setEditedImage(null); // Clear previous image selection
    setEditedImagePreview(testimonial.imageUrl || null); // Show existing image
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTestimonial) return;

    setIsSubmitting(true);
    setError(null);

    if (!editedComment.trim()) {
      setError("Testimonial comment cannot be empty");
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl: string | undefined | null = currentTestimonial.imageUrl;

      if (editedImage) {
        const formData = new FormData();
        formData.append("file", editedImage);

        const uploadRes = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload new image.");
        }

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      } else if (editedImagePreview === null && currentTestimonial.imageUrl) {
        // User removed the image
        imageUrl = null;
      }

      await safeFetch(`/api/testimonials?id=${currentTestimonial.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: editedComment,
          imageUrl: imageUrl,
        }),
      });

      toast.success("Testimonial updated successfully!");
      setIsEditModalOpen(false);
      fetchTestimonials();
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to update testimonial", {
        description: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-80 rounded-lg" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl mx-auto">
          <MessageSquare className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            Testimonials Error
          </h1>
          <p className="text-red-500 mb-6">{error}</p>
          <Button
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50"
            onClick={fetchTestimonials}
          >
            Retry Loading Testimonials
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Community Testimonials
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Hear from our community and share your own experience with us
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Submit Testimonial Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              Share Your Story
            </CardTitle>
            <CardDescription>
              Your experience can inspire others in our community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="testimonial"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Testimonial
                </label>
                <Textarea
                  id="testimonial"
                  value={newTestimonial}
                  onChange={(e) => setNewTestimonial(e.target.value)}
                  required
                  rows={5}
                  disabled={!session?.user?.id || isSubmitting}
                  placeholder="Tell us about your experience..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Image
                </label>
                <Input
                  id="image"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    setImage(file);
                    if (file) {
                      const objectUrl = URL.createObjectURL(file);
                      setImagePreview(objectUrl);
                    } else {
                      setImagePreview(null);
                    }
                  }}
                  disabled={!session?.user?.id || isSubmitting}
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img src={imagePreview} alt="Image preview" className="w-full h-auto rounded-lg" />
                    {console.log("Rendering image preview:", imagePreview)}
                  </div>
                )}
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button
                type="submit"
                disabled={
                  !session?.user?.id || isSubmitting || !newTestimonial.trim()
                }
                className="w-full gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Share Testimonial
                  </>
                )}
              </Button>

              {!session?.user?.id && (
                <p className="text-sm text-gray-500 text-center">
                  You must be signed in to submit a testimonial
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Testimonials List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              Community Voices
            </h2>
            <Badge variant="outline" className="text-sm">
              {testimonials.length} testimonials
            </Badge>
          </div>

          {testimonials.length > 0 ? (
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={testimonial.user?.image} />
                        <AvatarFallback>
                          {testimonial.user?.name ? (
                            testimonial.user.name.charAt(0).toUpperCase()
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-800">
                            {testimonial.user?.name || "Anonymous"}
                          </h3>
                          {testimonial.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm font-medium">
                                {testimonial.rating}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {format(
                            new Date(testimonial.createdAt),
                            "MMM d, yyyy"
                          )}
                        </p>
                        {testimonial.imageUrl && (
                          <div className="mt-3 w-full h-48 relative rounded-lg overflow-hidden">
                            <img
                              src={testimonial.imageUrl}
                              alt="Testimonial image"
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                        <p className="mt-3 text-gray-700">
                          {testimonial.comment}
                        </p>
                        {testimonial.tags && testimonial.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {testimonial.tags.map((tag, index) => (
                              <Badge
                                key={`${tag}-${index}`}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {session?.user?.id === testimonial.userId && (
                          <div className="mt-4 flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditClick(testimonial)}
                            >
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(testimonial.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-sm">
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500">
                  No testimonials yet
                </h3>
                <p className="text-gray-400 mt-2">
                  Be the first to share your experience with our community
                </p>
              </CardContent>
            </Card>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
              >
                Previous
              </Button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Testimonial Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
            <DialogDescription>
              Make changes to your testimonial here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form id="edit-testimonial-form" onSubmit={handleUpdate} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="editedComment" className="text-sm font-medium">
                Testimonial
              </label>
              <Textarea
                id="editedComment"
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
                rows={5}
                required
                className="min-h-[120px]"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="editedImage" className="text-sm font-medium">
                Image
              </label>
              <Input
                id="editedImage"
                type="file"
                onChange={(e) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  setEditedImage(file);
                  if (file) {
                    const objectUrl = URL.createObjectURL(file);
                    setEditedImagePreview(objectUrl);
                  } else {
                    setEditedImagePreview(null);
                  }
                }}
              />
              {editedImagePreview && (
                <div className="mt-2 relative">
                  <img src={editedImagePreview} alt="Image preview" className="w-full h-auto rounded-lg" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setEditedImage(null);
                      setEditedImagePreview(null);
                    }}
                  >
                    Remove Image
                  </Button>
                </div>
              )}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestimonialsPage;
