"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PlusCircle,
  Trash2,
  Edit,
  Loader2,
  Church,
  UploadCloud,
  CheckCircle,
  XCircle,
  HandHeart,
} from "lucide-react";

interface Ministry {
  id: string;
  name: string;
  description?: string;
  leaderId: string;
  leader?: { id: string; name: string };
  photo?: string;
}

interface User {
  id: string;
  name: string;
}

interface MinistryJoinRequest {
  id: string;
  userId: string;
  ministryId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  user: { id: string; name: string; email: string };
  ministry: { id: string; name: string };
}

const AdminMinistriesPage = () => {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [pendingJoinRequests, setPendingJoinRequests] = useState<MinistryJoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newMinistry, setNewMinistry] = useState({
    name: "",
    description: "",
    leaderId: "",
    photo: "",
  });

  const [editingMinistry, setEditingMinistry] = useState<Ministry | null>(null);
  const [ministryToDelete, setMinistryToDelete] = useState<Ministry | null>(
    null
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fetchMinistries = async () => {
    try {
      const res = await fetch("/api/ministry");
      if (!res.ok) throw new Error("Failed to fetch ministries");
      const data = await res.json();
      setMinistries(data.ministries);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchJoinRequests = async () => {
    try {
      const res = await fetch("/api/ministry-join-requests?status=PENDING");
      if (!res.ok) throw new Error("Failed to fetch join requests");
      const data = await res.json();
      setPendingJoinRequests(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchMinistries(), fetchUsers(), fetchJoinRequests()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const handleNewMinistryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewMinistry((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditingMinistryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditingMinistry((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const cancelImageSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Image upload failed");
    }

    const data = await res.json();
    return data.url;
  };

  const handleAddMinistry = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFormLoading(true);

    try {
      let photoUrl = newMinistry.photo;
      if (selectedFile) {
        photoUrl = await uploadImageToCloudinary(selectedFile);
      }

      const res = await fetch("/api/ministry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newMinistry, photo: photoUrl }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add ministry");
      }

      setNewMinistry({ name: "", description: "", leaderId: "", photo: "" });
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchMinistries();
      toast.success("Ministry added successfully!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateMinistry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMinistry) return;
    setFormLoading(true);

    try {
      let photoUrl = editingMinistry.photo;
      if (selectedFile) {
        photoUrl = await uploadImageToCloudinary(selectedFile);
      }

      const res = await fetch(`/api/ministry?id=${editingMinistry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editingMinistry, photo: photoUrl }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update ministry");
      }

      setEditingMinistry(null);
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchMinistries();
      toast.success("Ministry updated successfully!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteMinistry = async (id: string) => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/ministry?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete ministry");
      }
      fetchMinistries();
      toast.success("Ministry deleted successfully!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleteLoading(false);
      setMinistryToDelete(null);
    }
  };

  const handleApproveRequest = async (id: string) => {
    try {
      const res = await fetch(`/api/ministry-join-requests?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED" }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to approve request");
      }

      toast.success("Join request approved and member added!");
      fetchJoinRequests(); // Refresh pending requests
      fetchMinistries(); // Refresh ministries to update member count
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleRejectRequest = async (id: string) => {
    try {
      const res = await fetch(`/api/ministry-join-requests?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJECTED" }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to reject request");
      }

      toast.success("Join request rejected!");
      fetchJoinRequests(); // Refresh pending requests
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Ministry Management
          </h1>
          <p className="text-gray-600 mt-2">
            Create and manage church ministries
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingMinistry(null);
            setNewMinistry({
              name: "",
              description: "",
              leaderId: "",
              photo: "",
            });
            setSelectedFile(null);
            setPreviewUrl(null);
          }}
          className="w-full md:w-auto"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Ministry
        </Button>
      </div>

      <Card className="mb-8 border border-gray-200 bg-white rounded-lg shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-xl font-semibold text-gray-800">
            {editingMinistry ? "Edit Ministry" : "Create New Ministry"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form
            onSubmit={
              editingMinistry ? handleUpdateMinistry : handleAddMinistry
            }
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="e.g. Youth Ministry"
                value={
                  editingMinistry ? editingMinistry.name : newMinistry.name
                }
                onChange={
                  editingMinistry
                    ? handleEditingMinistryChange
                    : handleNewMinistryChange
                }
                required
                className="focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="leaderId"
                className="block text-sm font-medium text-gray-700"
              >
                Leader
              </label>
              <Select
                onValueChange={(value) => {
                  if (editingMinistry) {
                    setEditingMinistry((prev) =>
                      prev ? { ...prev, leaderId: value } : null
                    );
                  } else {
                    setNewMinistry((prev) => ({ ...prev, leaderId: value }));
                  }
                }}
                value={
                  editingMinistry
                    ? editingMinistry.leaderId
                    : newMinistry.leaderId
                }
              >
                <SelectTrigger className="focus:ring-primary focus:border-primary">
                  <SelectValue placeholder="Select Leader" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="A brief description of the ministry."
                value={
                  editingMinistry
                    ? editingMinistry.description || ""
                    : newMinistry.description
                }
                onChange={
                  editingMinistry
                    ? handleEditingMinistryChange
                    : handleNewMinistryChange
                }
                className="focus:ring-primary focus:border-primary min-h-[100px]"
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Ministry Photo
                </label>
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="photo-upload"
                    className={`flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      isDragging
                        ? "border-primary bg-primary/10"
                        : "border-gray-300 hover:border-primary hover:bg-gray-50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold text-primary">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF (Max. 5MB)
                      </p>
                    </div>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {(previewUrl || editingMinistry?.photo) && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">
                    Image Preview
                  </h3>
                  <div className="relative group">
                    <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={previewUrl || editingMinistry?.photo}
                        alt="Ministry preview"
                        className="w-full h-full object-contain bg-gray-50"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/90 backdrop-blur-sm hover:bg-white"
                        onClick={cancelImageSelection}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                      <label
                        htmlFor="photo-upload"
                        className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium bg-white/90 backdrop-blur-sm rounded-md border border-gray-200 hover:bg-white cursor-pointer"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Change
                      </label>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {selectedFile?.name || "Current ministry image"}
                  </p>
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 pt-2">
              {editingMinistry && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingMinistry(null);
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={formLoading}
                className="min-w-[150px]"
              >
                {formLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingMinistry ? "Update Ministry" : "Create Ministry"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 bg-white rounded-lg shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Existing Ministries
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {ministries.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="min-w-full divide-y divide-gray-200">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Photo
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leader
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      View
                    </TableHead>
                    <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {ministries.map((m) => (
                    <TableRow key={m.id} className="hover:bg-gray-50">
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        {m.photo ? (
                          <img
                            src={m.photo}
                            alt={m.name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                            <Church className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/admin/ministries/${m.id}`}
                          className="font-medium text-primary hover:text-primary/90 hover:underline"
                        >
                          {m.name}
                        </Link>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {m.description || "No description"}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {m.leader?.name || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/admin/ministries/${m.id}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingMinistry(m);
                            setSelectedFile(null);
                            setPreviewUrl(null);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setMinistryToDelete(m)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Church className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No ministries yet
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Use the form above to create your first ministry.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-8 border border-gray-200 bg-white rounded-lg shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Pending Ministry Join Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {pendingJoinRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="min-w-full divide-y divide-gray-200">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ministry
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </TableHead>
                    <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {pendingJoinRequests.map((request) => (
                    <TableRow key={request.id} className="hover:bg-gray-50">
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {request.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.user.email}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {request.ministry.name}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {request.status}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:bg-green-50"
                          onClick={() => handleApproveRequest(request.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleRejectRequest(request.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <HandHeart className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No pending join requests
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                All clear! No new requests to review at the moment.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!ministryToDelete}
        onOpenChange={() => setMinistryToDelete(null)}
      >
        <DialogContent className="sm:max-w-[425px] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Delete Ministry
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete the "{ministryToDelete?.name}"
              ministry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setMinistryToDelete(null)}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (ministryToDelete) {
                  handleDeleteMinistry(ministryToDelete.id);
                }
              }}
              disabled={deleteLoading}
              className="px-6"
            >
              {deleteLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMinistriesPage;
