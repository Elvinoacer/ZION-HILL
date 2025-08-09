import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Music, Image, File } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
  return <File className="h-5 w-5" />;
};

const WorshipResourceManagement: React.FC<WorshipResourceManagementProps> = ({
  selectedServiceId,
}) => {
  const [resources, setResources] = useState<WorshipResource[]>([]);
  const [newResourceTitle, setNewResourceTitle] = useState("");
  const [newResourceFile, setNewResourceFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

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
    if (!selectedServiceId || !newResourceFile) return;

    const formData = new FormData();
    formData.append("file", newResourceFile);
    formData.append("title", newResourceTitle);
    formData.append("serviceId", selectedServiceId);

    try {
      setUploading(true);
      const res = await fetch("/api/worship-resources", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to upload resource");
      }

      setNewResourceTitle("");
      setNewResourceFile(null);
      fetchResources(selectedServiceId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
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
      <motion.form
        onSubmit={handleAddResource}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100"
      >
        <h4 className="font-semibold text-lg text-gray-700">
          Add New Resource
        </h4>
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
            File
          </label>
          <div className="flex items-center space-x-2">
            <Input
              type="file"
              onChange={(e) =>
                setNewResourceFile(e.target.files ? e.target.files[0] : null)
              }
              required
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={uploading}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          {uploading ? "Uploading..." : "Add Resource"}
        </Button>
      </motion.form>

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
          <ul className="space-y-2">
            <AnimatePresence>
              {resources.map((resource) => (
                <motion.li
                  key={resource.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white shadow-xs border border-gray-100"
                >
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    {getFileIcon(resource.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-700 truncate">
                      {resource.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Uploaded on{" "}
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Download
                  </a>
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
    </div>
  );
};

export default WorshipResourceManagement;
