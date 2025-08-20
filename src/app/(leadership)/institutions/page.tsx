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

interface Institution {
  id: string;
  name: string;
  type: string;
  description?: string;
  address?: string;
  contactInfo?: string;
  imageUrl?: string;
}

const AdminInstitutionsPage = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const [newInstitution, setNewInstitution] = useState({
    name: '',
    type: '',
    description: '',
    address: '',
    contactInfo: '',
    imageUrl: '',
  });

  const [editingInstitution, setEditingInstitution] = useState<Institution | null>(null);

  const fetchInstitutions = async () => {
    try {
      const res = await fetch('/api/institutions');
      if (!res.ok) throw new Error('Failed to fetch institutions');
      const data = await res.json();
      setInstitutions(data);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load institutions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const handleNewInstitutionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewInstitution((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditingInstitutionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingInstitution((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleNewInstitutionTypeChange = (value: string) => {
    setNewInstitution((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleEditingInstitutionTypeChange = (value: string) => {
    setEditingInstitution((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        type: value,
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploadLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await res.json();
      const imageUrl = data.url; // Assuming the API returns { url: '...' }

      if (editingInstitution) {
        setEditingInstitution((prev) => ({
          ...prev!,
          imageUrl: imageUrl,
        }));
      } else {
        setNewInstitution((prev) => ({
          ...prev,
          imageUrl: imageUrl,
        }));
      }
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to upload image.");
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleAddInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/institutions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInstitution),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add institution');
      }

      setNewInstitution({
        name: '',
        type: '',
        description: '',
        address: '',
        contactInfo: '',
        imageUrl: '',
      });
      fetchInstitutions(); // Refresh list
      toast.success("Institution added successfully!");
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to add institution: ${err.message}`);
    }
  };

  const handleUpdateInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!editingInstitution) return;

    try {
      const res = await fetch(`/api/institutions?id=${editingInstitution.id}` , {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingInstitution),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update institution');
      }

      setEditingInstitution(null);
      fetchInstitutions(); // Refresh list
      toast.success("Institution updated successfully!");
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to update institution: ${err.message}`);
    }
  };

  const handleDeleteInstitution = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/institutions?id=${id}` , {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete institution');
      }

      fetchInstitutions(); // Refresh list
      toast.success("Institution deleted successfully!");
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to delete institution: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Manage Institutions</h1>
        <p className="text-lg text-gray-600">Loading institutions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Manage Institutions</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Manage Institutions</h1>
      <p className="text-lg text-gray-600 mb-4">
        Add, edit, and delete church-owned institutions.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingInstitution ? 'Edit Institution' : 'Add New Institution'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={editingInstitution ? handleUpdateInstitution : handleAddInstitution} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
              <Input type="text" id="name" name="name" value={editingInstitution ? editingInstitution.name : newInstitution.name} onChange={editingInstitution ? handleEditingInstitutionChange : handleNewInstitutionChange} required />
            </div>
            <div>
              <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">Type:</label>
              <Select onValueChange={editingInstitution ? handleEditingInstitutionTypeChange : handleNewInstitutionTypeChange} value={editingInstitution ? editingInstitution.type : newInstitution.type}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="School">School</SelectItem>
                  <SelectItem value="Kindergarten">Kindergarten</SelectItem>
                  <SelectItem value="Vocational Training Center">Vocational Training Center</SelectItem>
                  <SelectItem value="Health Clinic">Health Clinic</SelectItem>
                  <SelectItem value="Library">Library</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
              <Textarea id="description" name="description" value={editingInstitution ? editingInstitution.description || '' : newInstitution.description} onChange={editingInstitution ? handleEditingInstitutionChange : handleNewInstitutionChange} rows={4} />
            </div>
            <div>
              <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
              <Input type="text" id="address" name="address" value={editingInstitution ? editingInstitution.address || '' : newInstitution.address} onChange={editingInstitution ? handleEditingInstitutionChange : handleNewInstitutionChange} />
            </div>
            <div>
              <label htmlFor="contactInfo" className="block text-gray-700 text-sm font-bold mb-2">Contact Info:</label>
              <Input type="text" id="contactInfo" name="contactInfo" value={editingInstitution ? editingInstitution.contactInfo || '' : newInstitution.contactInfo} onChange={editingInstitution ? handleEditingInstitutionChange : handleNewInstitutionChange} />
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">Image:</label>
              <Input type="file" id="imageUrl" name="imageUrl" onChange={handleImageUpload} disabled={imageUploadLoading} accept="image/*" />
              {imageUploadLoading && <p className="text-sm text-gray-500 mt-1">Uploading image...</p>}
              {(editingInstitution?.imageUrl || newInstitution.imageUrl) && (
                <div className="mt-2">
                  <Image src={editingInstitution?.imageUrl || newInstitution.imageUrl || ''} alt="Institution Image Preview" width={100} height={100} className="rounded-md object-cover" />
                </div>
              )}
            </div>
            <div className="md:col-span-2 flex space-x-2">
              <Button type="submit">
                {editingInstitution ? 'Update Institution' : 'Add Institution'}
              </Button>
              {editingInstitution && (
                <Button type="button" variant="outline" onClick={() => setEditingInstitution(null)}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Institutions</CardTitle>
        </CardHeader>
        <CardContent>
          {institutions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {institutions.map((institution) => (
                    <TableRow key={institution.id}>
                      <TableCell>{institution.name}</TableCell>
                      <TableCell>{institution.type}</TableCell>
                      <TableCell>{institution.description || 'N/A'}</TableCell>
                      <TableCell>{institution.address || 'N/A'}</TableCell>
                      <TableCell>{institution.contactInfo || 'N/A'}</TableCell>
                      <TableCell>
                        {institution.imageUrl ? (
                          <Image src={institution.imageUrl} alt="Institution Image" width={50} height={50} className="rounded-md object-cover" />
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => setEditingInstitution(institution)} className="mr-2">
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteInstitution(institution.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p>No institutions found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInstitutionsPage;
