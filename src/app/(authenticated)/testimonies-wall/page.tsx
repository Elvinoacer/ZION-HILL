"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { safeFetch } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image"; // Import Image component
import { FileImage, Loader2 } from "lucide-react"; // Import icons

interface Testimony {
  id: string;
  comment: string;
  userId: string;
  user?: { name: string };
  imageUrl?: string; // Add imageUrl to interface
  createdAt: string;
}

const TestimoniesWallPage = () => {
  const { data: session } = useSession();
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [newTestimony, setNewTestimony] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null); // State for image file
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // State for submission loading

  const fetchTestimonies = async () => {
    try {
      const data = await safeFetch<Testimony[]>("/api/testimonies-wall");
      setTestimonies(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonies();
  }, []);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await safeFetch<{ url: string }>("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      return response.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      setError("Failed to upload image.");
      return null;
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!newTestimony.trim() && !imageFile) {
      setError("Please enter a testimony or upload an image.");
      setIsSubmitting(false);
      return;
    }

    if (!session?.user?.id) {
      setError("You must be logged in to submit a testimony.");
      setIsSubmitting(false);
      return;
    }

    let uploadedImageUrl: string | null = null;
    if (imageFile) {
      uploadedImageUrl = await handleImageUpload(imageFile);
      if (!uploadedImageUrl) {
        setIsSubmitting(false);
        return; // Error already set in handleImageUpload
      }
    }

    try {
      await safeFetch("/api/testimonies-wall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: newTestimony,
          userId: session.user.id,
          sentiment: "POSITIVE",
          tags: ["testimony"],
          imageUrl: uploadedImageUrl, // Include imageUrl
        }),
      });

      setNewTestimony("");
      setImageFile(null);
      setImagePreview(null);
      fetchTestimonies(); // Refresh list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Testimonies Wall
        </h1>
        <p className="text-lg text-gray-600">Loading testimonies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Testimonies Wall
        </h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Testimonies Wall
      </h1>
      <p className="text-lg text-gray-600 mb-4">
        Read inspiring testimonies and share your own experience.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Submit Your Testimony</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="testimony"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Your Testimony:
              </label>
              <Textarea
                id="testimony"
                value={newTestimony}
                onChange={(e) => setNewTestimony(e.target.value)}
                rows={4}
                disabled={!session?.user?.id || isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="imageUpload"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Upload Image (Optional):
              </label>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="imageUpload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={imagePreview}
                        alt="Image Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileImage className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Click to upload an image
                      </p>
                    </div>
                  )}
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={!session?.user?.id || isSubmitting}
                  />
                </label>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={!session?.user?.id || isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Testimony
            </Button>
            {!session?.user?.id && (
              <p className="text-red-500 text-sm mt-2">
                You must be logged in to submit a testimony.
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What Others Are Saying</CardTitle>
        </CardHeader>
        <CardContent>
          {testimonies.length > 0 ? (
            <div className="space-y-4">
              {testimonies.map((testimony) => (
                <div key={testimony.id} className="border p-4 rounded-lg">
                  {testimony.imageUrl && (
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={testimony.imageUrl}
                        alt="Testimony Image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <p className="text-gray-800">{testimony.comment}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    - {testimony.user?.name || "Anonymous"} on{" "}
                    {new Date(testimony.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No testimonies found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestimoniesWallPage;
