import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Music,
  Image,
  File,
  Link as LinkIcon,
  Edit,
  Trash2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface WorshipResource {
  id: string;
  url: string;
  title: string;
  serviceId: string;
  type: string;
  createdAt: string;
}

interface WorshipResourceManagementProps {
  selectedServiceId: string | null;
}

const getFileIcon = (type: string) => {
  if (type.includes("image")) return <Image className="h-5 w-5" />;
  if (type.includes("audio")) return <Music className="h-5 w-5" />;
  if (type.includes("pdf")) return <FileText className="h-5 w-5" />;
  if (type.toUpperCase() === "LINK") return <LinkIcon className="h-5 w-5" />;
  return <File className="h-5 w-5" />;
};

const WorshipResourceManagement: React.FC<WorshipResourceManagementProps> = ({
  selectedServiceId,
}) => {
  const [resources, setResources] = useState<WorshipResource[]>([]);
  const [newResourceTitle, setNewResourceTitle] = useState("");
  const [newResourceFile, setNewResourceFile] = useState<File | null>(null);
  const [newResourceUrl, setNewResourceUrl] = useState(""); // For URL-based resources
  const [newResourceType, setNewResourceType] = useState("LINK"); // Default type
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [showCreateResourceModal, setShowCreateResourceModal] = useState(false);
  const [editingResource, setEditingResource] =
    useState<WorshipResource | null>(null);
  const [showEditResourceModal, setShowEditResourceModal] = useState(false);
  const [editedResourceTitle, setEditedResourceTitle] = useState("");
  const [editedResourceUrl, setEditedResourceUrl] = useState("");
  const [editedResourceType, setEditedResourceType] = useState("");

  const fetchResources = async (serviceId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/worship-resources?serviceId=${serviceId}`);
      if (!res.ok) throw new Error("Failed to fetch resources");
      const data = await res.json();
      setResources(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedServiceId) {
      fetchResources(selectedServiceId);
    }
  }, [selectedServiceId]);

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId) return;

    setUploading(true);
    setError(null);

    try {
      let res;
      if (newResourceFile) {
        // File upload
        const formData = new FormData();
        formData.append("file", newResourceFile);
        formData.append("title", newResourceTitle);
        formData.append("serviceId", selectedServiceId);
        formData.append("type", newResourceType);

        res = await fetch("/api/worship-resources", {
          method: "POST",
          body: formData,
        });
      } else if (newResourceUrl) {
        // URL submission
        res = await fetch("/api/worship-resources", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newResourceTitle,
            url: newResourceUrl,
            serviceId: selectedServiceId,
            type: newResourceType,
          }),
        });
      } else {
        throw new Error("Please provide a file or a URL.");
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add resource");
      }

      setNewResourceTitle("");
      setNewResourceFile(null);
      setNewResourceUrl("");
      setNewResourceType("LINK");
      setShowCreateResourceModal(false); // Close modal after adding
      fetchResources(selectedServiceId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEditClick = (resource: WorshipResource) => {
    setEditingResource(resource);
    setEditedResourceTitle(resource.title);
    setEditedResourceUrl(resource.url);
    setEditedResourceType(resource.type);
    setShowEditResourceModal(true);
  };

  const handleUpdateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource || !selectedServiceId) return;

    setUploading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/worship-resources?id=${editingResource.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editedResourceTitle,
            url: editedResourceUrl,
            type: editedResourceType,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update resource");
      }

      setShowEditResourceModal(false);
      fetchResources(selectedServiceId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!selectedServiceId) return;

    if (!confirm("Are you sure you want to delete this resource?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/worship-resources?id=${resourceId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete resource");
      }

      fetchResources(selectedServiceId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedServiceId) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 rounded-lg bg-blue-50 text-blue-600 text-center"
      >
        Select a service to manage resources
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        onClick={() => setShowCreateResourceModal(true)}
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
      >
        Add New Resource
      </Button>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-lg bg-red-50 text-red-600 border border-red-200"
        >
          {error}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <h4 className="font-semibold text-lg text-gray-700">
          Service Resources
        </h4>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : resources.length > 0 ? (
          <ul className="space-y-3">
            <AnimatePresence>
              {resources.map((resource) => (
                <motion.li
                  key={resource.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{
                    scale: 1.01,
                    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                    borderColor: "rgba(99, 102, 241, 0.3)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                    hover: { duration: 0.2 },
                  }}
                  className="flex items-center justify-between p-5 rounded-xl bg-white shadow-sm border border-gray-200 cursor-pointer transition-all duration-200 hover:border-indigo-100"
                >
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 flex-shrink-0 shadow-inner">
                      {getFileIcon(resource.type)}
                    </div>
                    <div className="overflow-hidden">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-gray-900 truncate hover:underline"
                      >
                        {resource.title}
                      </a>
                      <p className="text-sm text-gray-500 mt-1">
                        Uploaded{" "}
                        {new Date(resource.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(resource)}
                      className="text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-200"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteResource(resource.id)}
                      className="text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <div className="p-4 rounded-lg bg-gray-50 text-center text-gray-500">
            No resources for this service
          </div>
        )}
      </motion.div>

      {/* Create Resource Modal */}
      <Dialog
        open={showCreateResourceModal}
        onOpenChange={setShowCreateResourceModal}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
            <DialogDescription>
              Add a new resource for this service.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddResource} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <Input
                type="text"
                placeholder="Resource Title"
                value={newResourceTitle}
                onChange={(e) => setNewResourceTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Resource Type
              </label>
              <Select
                onValueChange={setNewResourceType}
                value={newResourceType}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select resource type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LINK">Link</SelectItem>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="IMAGE">Image</SelectItem>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="AUDIO">Audio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newResourceType === "LINK" ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  URL
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com/resource"
                  value={newResourceUrl}
                  onChange={(e) => setNewResourceUrl(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  File
                </label>
                <Input
                  type="file"
                  onChange={(e) =>
                    setNewResourceFile(
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                  required
                />
              </div>
            )}
            <DialogFooter>
              <Button type="submit" disabled={uploading}>
                {uploading ? "Adding..." : "Add Resource"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Resource Modal */}
      <Dialog
        open={showEditResourceModal}
        onOpenChange={setShowEditResourceModal}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
            <DialogDescription>
              Edit the details of this resource.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateResource} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <Input
                type="text"
                placeholder="Resource Title"
                value={editedResourceTitle}
                onChange={(e) => setEditedResourceTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Resource Type
              </label>
              <Select
                onValueChange={setEditedResourceType}
                value={editedResourceType}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select resource type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LINK">Link</SelectItem>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="IMAGE">Image</SelectItem>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="AUDIO">Audio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                URL
              </label>
              <Input
                type="url"
                placeholder="https://example.com/resource"
                value={editedResourceUrl}
                onChange={(e) => setEditedResourceUrl(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={uploading}>
                {uploading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorshipResourceManagement;
