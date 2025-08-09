"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { toast } from "sonner";
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

interface MediaAsset {
  id: string;
  title: string;
  url: string;
  type: string; // Corresponds to AssetType enum
  tags: string[];
  uploaderId: string;
  createdAt: string;
}

const AdminMediaPage = () => {
  const { data: session } = useSession();
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);

  const [newMedia, setNewMedia] = useState({
    title: '',
    url: '',
    type: '',
    tags: '',
  });

  const [editingMedia, setEditingMedia] = useState<MediaAsset | null>(null);

  const fetchMediaAssets = async () => {
    try {
      const res = await fetch('/api/media');
      if (!res.ok) throw new Error('Failed to fetch media assets');
      const data = await res.json();
      setMediaAssets(data);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load media assets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaAssets();
  }, []);

  const handleNewMediaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMedia((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditingMediaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingMedia((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleNewMediaTypeChange = (value: string) => {
    setNewMedia((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleEditingMediaTypeChange = (value: string) => {
    setEditingMedia((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        type: value,
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileUploadLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }

      const data = await res.json();
      const fileUrl = data.url; // Assuming the API returns { url: '...' }

      if (editingMedia) {
        setEditingMedia((prev) => ({
          ...prev!,
          url: fileUrl,
        }));
      } else {
        setNewMedia((prev) => ({
          ...prev,
          url: fileUrl,
        }));
      }
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to upload file.");
    } finally {
      setFileUploadLoading(false);
    }
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!session?.user?.id) {
      toast.error("You must be logged in to upload media.");
      return;
    }

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newMedia,
          tags: newMedia.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
          uploaderId: session.user.id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add media asset');
      }

      setNewMedia({
        title: '',
        url: '',
        type: '',
        tags: '',
      });
      fetchMediaAssets(); // Refresh list
      toast.success("Media asset added successfully!");
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to add media asset: ${err.message}`);
    }
  };

  const handleUpdateMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!editingMedia) return;

    try {
      const res = await fetch(`/api/media?id=${editingMedia.id}` , {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingMedia,
          tags: editingMedia.tags.toString().split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update media asset');
      }

      setEditingMedia(null);
      fetchMediaAssets(); // Refresh list
      toast.success("Media asset updated successfully!");
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to update media asset: ${err.message}`);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/media?id=${id}` , {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete media asset');
      }

      fetchMediaAssets(); // Refresh list
      toast.success("Media asset deleted successfully!");
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to delete media asset: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Manage Media Assets</h1>
        <p className="text-lg text-gray-600">Loading media assets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Manage Media Assets</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Manage Media Assets</h1>
      <p className="text-lg text-gray-600 mb-4">
        Upload, edit, and organize church media assets (images, videos, audio).
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingMedia ? 'Edit Media Asset' : 'Add New Media Asset'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={editingMedia ? handleUpdateMedia : handleAddMedia} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
              <Input type="text" id="title" name="title" value={editingMedia ? editingMedia.title : newMedia.title} onChange={editingMedia ? handleEditingMediaChange : handleNewMediaChange} required />
            </div>
            <div>
              <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">Type:</label>
              <Select onValueChange={editingMedia ? handleEditingMediaTypeChange : handleNewMediaTypeChange} value={editingMedia ? editingMedia.type : newMedia.type}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IMAGE">Image</SelectItem>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="AUDIO">Audio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="tags" className="block text-gray-700 text-sm font-bold mb-2">Tags (comma-separated):</label>
              <Input type="text" id="tags" name="tags" value={editingMedia ? editingMedia.tags.join(', ') : newMedia.tags} onChange={editingMedia ? handleEditingMediaChange : handleNewMediaChange} />
            </div>
            <div>
              <label htmlFor="file" className="block text-gray-700 text-sm font-bold mb-2">File:</label>
              <Input type="file" id="file" name="file" onChange={handleFileUpload} disabled={fileUploadLoading} accept="image/*,video/*,audio/*" />
              {fileUploadLoading && <p className="text-sm text-gray-500 mt-1">Uploading file...</p>}
              {(editingMedia?.url || newMedia.url) && (
                <div className="mt-2">
                  {editingMedia?.type?.startsWith('IMAGE') || newMedia.type.startsWith('IMAGE') ? (
                    <Image src={editingMedia?.url || newMedia.url || ''} alt="Media Preview" width={100} height={100} className="rounded-md object-cover" />
                  ) : editingMedia?.type?.startsWith('VIDEO') || newMedia.type.startsWith('VIDEO') ? (
                    <video src={editingMedia?.url || newMedia.url || ''} controls width={100} height={100} className="rounded-md object-cover" />
                  ) : editingMedia?.type?.startsWith('AUDIO') || newMedia.type.startsWith('AUDIO') ? (
                    <audio src={editingMedia?.url || newMedia.url || ''} controls className="rounded-md" />
                  ) : null}
                </div>
              )}
            </div>
            <div className="md:col-span-2 flex space-x-2">
              <Button type="submit">
                {editingMedia ? 'Update Media Asset' : 'Add Media Asset'}
              </Button>
              {editingMedia && (
                <Button type="button" variant="outline" onClick={() => setEditingMedia(null)}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Media Assets</CardTitle>
        </CardHeader>
        <CardContent>
          {mediaAssets.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Uploader ID</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mediaAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell>{asset.title}</TableCell>
                      <TableCell>{asset.type}</TableCell>
                      <TableCell><a href={asset.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a></TableCell>
                      <TableCell>{asset.tags.join(', ')}</TableCell>
                      <TableCell>{asset.uploaderId}</TableCell>
                      <TableCell>{new Date(asset.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => setEditingMedia(asset)} className="mr-2">
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteMedia(asset.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p>No media assets found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMediaPage;
