'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner'; // Updated import
import { Search, PlusCircle, Edit, Trash2, Loader2, Video, Mic, BookOpen, Users, Image as ImageIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';

const AdminKidsTeensResources = () => {
  const { data: session } = useSession();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState(null); // For editing
  const [formState, setFormState] = useState({
    title: '',
    type: '',
    tags: '',
    url: '',
    file: null, // For file upload
  });

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/kids-teens-resources');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
      setError(error);
      toast.error("Failed to load resources."); // Updated toast call
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormState(prevState => ({
      ...prevState,
      file: e.target.files[0],
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let imageUrl = formState.url;
    let assetType = formState.type;

    if (formState.file) {
      const formData = new FormData();
      formData.append('file', formState.file);

      try {
        const uploadResponse = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || `HTTP error! status: ${uploadResponse.status}`);
        }

        const result = await uploadResponse.json();
        imageUrl = result.url;
        assetType = 'IMAGE'; // Assuming uploaded files are images
        toast.success("Image uploaded to Cloudinary."); // Updated toast call
      } catch (uploadError) {
        console.error("Failed to upload image to Cloudinary:", uploadError);
        setError(uploadError);
        toast.error(`Failed to upload image: ${uploadError.message}`); // Updated toast call
        setLoading(false);
        return; // Stop submission if upload fails
      }
    }

    if (!session?.user?.id) {
      toast.error("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    const resourceData = {
      title: formState.title,
      type: assetType, // Use the determined assetType
      tags: formState.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      url: imageUrl, // Use the Cloudinary URL or existing URL
      uploaderId: session.user.id, // Add the uploaderId
    };

    try {
      let response;
      if (currentResource) {
        // Edit existing resource
        response = await fetch(`/api/kids-teens-resources?id=${currentResource.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(resourceData),
        });
      } else {
        // Create new resource
        response = await fetch('/api/kids-teens-resources', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(resourceData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      toast.success(`Resource ${currentResource ? 'updated' : 'created'} successfully.`); // Updated toast call
      setIsDialogOpen(false);
      setFormState({ title: '', type: '', tags: '', url: '', file: null });
      setCurrentResource(null);
      fetchResources(); // Refresh the list
    } catch (apiError) {
      console.error(`Failed to ${currentResource ? 'update' : 'create'} resource:`, apiError);
      setError(apiError);
      toast.error(`Failed to ${currentResource ? 'update' : 'create'} resource: ${apiError.message}`); // Updated toast call
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (resource) => {
    setCurrentResource(resource);
    setFormState({
      title: resource.title,
      type: resource.type,
      tags: resource.tags.join(', '),
      url: resource.url || '', // Populate existing URL
      file: null,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (!confirm("Are you sure you want to delete this resource?")) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/kids-teens-resources?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      toast.success("Resource deleted successfully."); // Updated toast call
      fetchResources(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete resource:", error);
      setError(error);
      toast.error(`Failed to delete resource: ${error.message}`); // Updated toast call
    } finally {
      setLoading(false);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'VIDEO':
        return <Video className="h-5 w-5 text-blue-500" />;
      case 'ACTIVITY':
      case 'DOCUMENT':
        return <BookOpen className="h-5 w-5 text-green-500" />;
      case 'AUDIO':
        return <Mic className="h-5 w-5 text-purple-500" />;
      case 'IMAGE':
        return <ImageIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="ml-4 text-lg text-gray-600">Loading resources...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600">
        <p>Error: {error.message}. Failed to load resources. Please try again later.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Kids & Teens Resources</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setCurrentResource(null);
                setFormState({ title: '', type: '', tags: '', url: '', file: null });
              }}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{currentResource ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">Title</Label>
                  <Input id="title" value={formState.title} onChange={handleInputChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">Type</Label>
                  <Input id="type" value={formState.type} onChange={handleInputChange} className="col-span-3" placeholder="e.g., VIDEO, DOCUMENT, IMAGE" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tags" className="text-right">Tags</Label>
                  <Input id="tags" value={formState.tags} onChange={handleInputChange} className="col-span-3" placeholder="e.g., kids, teens, parents (comma-separated)" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="url" className="text-right">URL (Optional)</Label>
                  <Input id="url" value={formState.url} onChange={handleInputChange} className="col-span-3" placeholder="Enter URL for external resources" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="file" className="text-right">Upload Image</Label>
                  <Input id="file" type="file" onChange={handleFileChange} className="col-span-3" accept="image/*" />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {currentResource ? 'Save Changes' : 'Create Resource'}
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
              placeholder="Search resources..." 
              className="pl-10 w-full max-w-md" 
              // Add search functionality here if needed
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No resources found. Add a new resource to get started!</p>
          ) : (
            resources.map((resource) => (
              <Card key={resource.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold text-gray-800">{resource.title}</CardTitle>
                  {getIconForType(resource.type)}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">Type: {resource.type}</p>
                  <p className="text-sm text-gray-500 mb-4">Tags: {resource.tags.join(', ')}</p>
                  {resource.url && (
                    <p className="text-sm text-blue-600 truncate mb-4">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">View Resource</a>
                    </p>
                  )}
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(resource)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(resource.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminKidsTeensResources;
