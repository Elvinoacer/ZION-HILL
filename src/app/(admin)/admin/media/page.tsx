"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  Loader2,
  Video,
  Mic,
  BookOpen,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface MediaAsset {
  id: string;
  title: string;
  url: string;
  type: string;
  tags: string[];
  description?: string;
  uploaderId: string;
  createdAt: string;
}

const ASSETS_PER_PAGE = 9;

const AdminMediaPage = () => {
  const { data: session } = useSession();
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState<MediaAsset | null>(
    null
  );
  const [formState, setFormState] = useState({
    title: "",
    type: "",
    tags: "",
    url: "",
    description: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const getPreviewComponent = (url: string, type: string) => {
    if (!url) return null;
    const lowerCaseUrl = url.toLowerCase();
    if (
      type === "IMAGE" ||
      lowerCaseUrl.match(/\.(jpeg|jpg|png|gif|webp|svg)$/)
    ) {
      return (
        <img
          src={url}
          alt="Preview"
          className="w-full h-40 sm:h-48 object-contain rounded-lg"
        />
      );
    }
    if (
      type === "VIDEO" ||
      lowerCaseUrl.match(/\.(mp4|webm|ogg)$/) ||
      lowerCaseUrl.includes("youtube.com") ||
      lowerCaseUrl.includes("youtu.be")
    ) {
      if (lowerCaseUrl.includes("youtube.com/watch?v=")) {
        const videoId = url.split("v=")[1]?.split("&")[0];
        return (
          <iframe
            className="w-full h-40 sm:h-48 rounded-lg"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video player"
          ></iframe>
        );
      }
      if (lowerCaseUrl.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1]?.split("&")[0];
        return (
          <iframe
            className="w-full h-40 sm:h-48 rounded-lg"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video player"
          ></iframe>
        );
      }
      return (
        <video
          controls
          className="w-full h-40 sm:h-48 object-contain rounded-lg"
        >
          <source src={url} type={`video/${lowerCaseUrl.split(".").pop()}`} />
        </video>
      );
    }
    if (type === "DOCUMENT" || lowerCaseUrl.match(/\.(pdf)$/)) {
      return (
        <iframe
          src={url}
          className="w-full h-40 sm:h-48 rounded-lg"
          style={{ border: "none" }}
          title="Document Preview"
        ></iframe>
      );
    }
    if (type === "AUDIO" || lowerCaseUrl.match(/\.(mp3|wav|ogg)$/)) {
      return (
        <audio controls className="w-full rounded-lg">
          <source src={url} type={`audio/${lowerCaseUrl.split(".").pop()}`} />
        </audio>
      );
    }
    return (
      <div className="w-full h-40 sm:h-48 flex items-center justify-center bg-gray-100 rounded-lg text-gray-500 text-sm">
        No preview available
      </div>
    );
  };

  const fetchMediaAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/media");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setMediaAssets(data);
    } catch (error: any) {
      console.error("Failed to fetch media assets:", error);
      setError(error);
      toast.error("Failed to load media assets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaAssets();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [id]: value }));
    if (id === "url") setPreviewUrl(value);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!session?.user?.id) {
      toast.error("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    const resourceData = {
      title: formState.title,
      type: formState.type,
      tags: formState.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
      url: formState.url,
      description: formState.description,
      uploaderId: session.user.id,
    };

    try {
      let response;
      if (currentResource) {
        response = await fetch(`/api/media?id=${currentResource.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resourceData),
        });
      } else {
        response = await fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resourceData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      toast.success(
        `Media asset ${currentResource ? "updated" : "created"} successfully.`
      );
      setIsDialogOpen(false);
      setFormState({ title: "", type: "", tags: "", url: "", description: "" });
      setCurrentResource(null);
      setPreviewUrl(null);
      fetchMediaAssets();
    } catch (apiError: any) {
      console.error(
        `Failed to ${currentResource ? "update" : "create"} media asset:`,
        apiError
      );
      setError(apiError);
      toast.error(
        `Failed to ${currentResource ? "update" : "create"} media asset: ${
          apiError.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (resource: MediaAsset) => {
    setCurrentResource(resource);
    setFormState({
      title: resource.title,
      type: resource.type,
      tags: resource.tags.join(", "),
      url: resource.url || "",
      description: resource.description || "",
    });
    setPreviewUrl(resource.url || null);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset?")) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/media?id=${id}`, { method: "DELETE" });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      toast.success("Media asset deleted successfully.");
      fetchMediaAssets();
    } catch (error: any) {
      console.error("Failed to delete media asset:", error);
      setError(error);
      toast.error(`Failed to delete media asset: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <Video className="h-5 w-5 text-blue-500" />;
      case "DOCUMENT":
        return <BookOpen className="h-5 w-5 text-green-500" />;
      case "AUDIO":
        return <Mic className="h-5 w-5 text-purple-500" />;
      case "IMAGE":
        return <ImageIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const filteredAssets = useMemo(() => {
    return mediaAssets.filter((asset) => {
      const query = searchQuery.toLowerCase();
      return (
        asset.title.toLowerCase().includes(query) ||
        (asset.description &&
          asset.description.toLowerCase().includes(query)) ||
        asset.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [mediaAssets, searchQuery]);

  const paginatedAssets = useMemo(() => {
    const startIndex = (currentPage - 1) * ASSETS_PER_PAGE;
    return filteredAssets.slice(startIndex, startIndex + ASSETS_PER_PAGE);
  }, [filteredAssets, currentPage]);

  const totalPages = Math.ceil(filteredAssets.length / ASSETS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading && mediaAssets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="ml-4 text-base sm:text-lg text-gray-600">
          Loading media assets...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100"
        >
          <p className="text-base sm:text-lg text-red-500 mb-6 flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5" /> Error: {error.message}
          </p>
          <Button
            onClick={fetchMediaAssets}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 rounded-lg px-4 py-2"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 md:p-8 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Manage Media Assets
          </h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setCurrentResource(null);
                  setFormState({
                    title: "",
                    type: "",
                    tags: "",
                    url: "",
                    description: "",
                  });
                  setPreviewUrl(null);
                  setIsDialogOpen(true);
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] sm:max-w-lg rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">
                  {currentResource ? "Edit Media Asset" : "Add New Media Asset"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="title"
                    className="text-right sm:col-span-1 text-sm sm:text-base"
                  >
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={formState.title}
                    onChange={handleInputChange}
                    className="col-span-3 rounded-lg"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="type"
                    className="text-right sm:col-span-1 text-sm sm:text-base"
                  >
                    Type
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        type: value,
                      }))
                    }
                    value={formState.type}
                  >
                    <SelectTrigger className="col-span-3 rounded-lg">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VIDEO">Video</SelectItem>
                      <SelectItem value="AUDIO">Audio</SelectItem>
                      <SelectItem value="IMAGE">Image</SelectItem>
                      <SelectItem value="DOCUMENT">Document</SelectItem>
                      <SelectItem value="LOGO">Logo</SelectItem>
                      <SelectItem value="FONT">Font</SelectItem>
                      <SelectItem value="TEMPLATE">Template</SelectItem>
                      <SelectItem value="SERMON">Sermon</SelectItem>
                      <SelectItem value="RESOURCE">Resource</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="tags"
                    className="text-right sm:col-span-1 text-sm sm:text-base"
                  >
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    value={formState.tags}
                    onChange={handleInputChange}
                    className="col-span-3 rounded-lg"
                    placeholder="e.g., worship, sermon, event (comma-separated)"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="url"
                    className="text-right sm:col-span-1 text-sm sm:text-base"
                  >
                    URL
                  </Label>
                  <Input
                    id="url"
                    value={formState.url}
                    onChange={handleInputChange}
                    className="col-span-3 rounded-lg"
                    placeholder="Enter URL for the media asset"
                    required
                  />
                </div>
                {previewUrl && formState.type && (
                  <div className="col-span-4">
                    {getPreviewComponent(previewUrl, formState.type)}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-4">
                  <Label
                    htmlFor="description"
                    className="text-right sm:col-span-1 text-sm sm:text-base"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formState.description}
                    onChange={handleInputChange}
                    className="col-span-3 rounded-lg"
                    placeholder="Enter a brief description"
                  />
                </div>
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700"
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {currentResource ? "Save Changes" : "Create Asset"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1 rounded-lg"
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by title, description, or tag..."
              className="pl-10 w-full sm:max-w-md rounded-lg"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {paginatedAssets.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 text-base sm:text-lg">
              No media assets found.{" "}
              {searchQuery && "Try a different search term."}
            </p>
          ) : (
            paginatedAssets.map((asset) => (
              <Card
                key={asset.id}
                className="shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                    {asset.title}
                  </CardTitle>
                  {getIconForType(asset.type)}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-2">
                    Type: {asset.type}
                  </p>
                  <p className="text-sm text-gray-500 mb-4 truncate">
                    Tags: {asset.tags.join(", ")}
                  </p>
                  {asset.url && (
                    <p className="text-sm text-blue-600 truncate mb-4">
                      <a
                        href={asset.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        View Asset
                      </a>
                    </p>
                  )}
                  {asset.url && asset.type && (
                    <div className="mb-4">
                      {getPreviewComponent(asset.url, asset.type)}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(asset)}
                      className="flex-1 rounded-lg"
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(asset.id)}
                      className="flex-1 rounded-lg"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 sm:mt-8 space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-lg"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Previous</span>
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg"
            >
              <span className="mr-2 hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminMediaPage;
