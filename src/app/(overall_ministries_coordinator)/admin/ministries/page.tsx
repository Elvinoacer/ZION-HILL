'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  Users as UsersIcon,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Interfaces
interface Ministry {
  id: string;
  name: string;
  description?: string;
  leaderId: string;
  leader?: { id: string; name: string };
  photo?: string;
  members: any[]; // Add members to ministry type
}

interface User {
  id: string;
  name: string;
}

interface MinistryJoinRequest {
  id: string;
  userId: string;
  ministryId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  user: { id: string; name: string; email: string };
  ministry: { id: string; name: string };
}

// Main Page Component
const AdminMinistriesPage = () => {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [pendingJoinRequests, setPendingJoinRequests] = useState<MinistryJoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMinistry, setEditingMinistry] = useState<Ministry | null>(null);

  const fetchData = async () => {
    try {
      const [ministriesRes, usersRes, requestsRes] = await Promise.all([
        fetch("/api/ministry"),
        fetch("/api/users"),
        fetch("/api/ministry-join-requests?status=PENDING"),
      ]);
      if (!ministriesRes.ok) throw new Error("Failed to fetch ministries");
      if (!usersRes.ok) throw new Error("Failed to fetch users");
      if (!requestsRes.ok) throw new Error("Failed to fetch join requests");

      const ministriesData = await ministriesRes.json();
      const usersData = await usersRes.json();
      const requestsData = await requestsRes.json();

      setMinistries(ministriesData.ministries);
      setUsers(usersData);
      setPendingJoinRequests(requestsData);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormSubmit = () => {
    fetchData();
    setIsFormOpen(false);
    setEditingMinistry(null);
  };

  const handleEdit = (ministry: Ministry) => {
    setEditingMinistry(ministry);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingMinistry(null);
    setIsFormOpen(true);
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-16 w-16 animate-spin text-blue-600" /></div>;
  }

  if (error) {
    return <div className="container mx-auto py-8 px-4 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">Ministries</h1>
              <p className="text-lg text-gray-600 mt-1">Oversee all church ministries and member requests.</p>
            </div>
            <Button onClick={handleAddNew} className="shadow-lg bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Ministry
            </Button>
        </header>

        <AnimatePresence>
          {isFormOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <MinistryForm
                ministry={editingMinistry}
                users={users}
                onSubmit={handleFormSubmit}
                onCancel={() => setIsFormOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MinistriesList ministries={ministries} onEdit={handleEdit} onDelete={fetchData} />
          </div>
          <div>
            <JoinRequests requests={pendingJoinRequests} onUpdate={fetchData} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Ministry Form Component
const MinistryForm = ({ ministry, users, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(ministry || { name: '', description: '', leaderId: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(ministry?.photo || null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let photoUrl = ministry?.photo;
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);
        const res = await fetch('/api/upload-image', { method: 'POST', body: uploadFormData });
        if (!res.ok) throw new Error('Image upload failed');
        const data = await res.json();
        photoUrl = data.url;
      }

      const url = ministry ? `/api/ministry?id=${ministry.id}` : '/api/ministry';
      const method = ministry ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, photo: photoUrl }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to ${ministry ? 'update' : 'create'} ministry`);
      }

      toast.success(`Ministry ${ministry ? 'updated' : 'created'} successfully!`);
      onSubmit();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-8 shadow-lg border-gray-200/80 rounded-2xl">
      <CardHeader>
        <CardTitle>{ministry ? 'Edit Ministry' : 'Create New Ministry'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Ministry Name" required />
            <Select onValueChange={(value) => setFormData(p => ({...p, leaderId: value}))} value={formData.leaderId}>
              <SelectTrigger><SelectValue placeholder="Select Leader" /></SelectTrigger>
              <SelectContent>
                {users.map(user => <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ministry Photo</label>
            <Input type="file" onChange={handleFileChange} accept="image/*" />
            {previewUrl && <img src={previewUrl} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-lg" />}
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin"/> : 'Save'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Ministries List Component
const MinistriesList = ({ ministries, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ministryToDelete, setMinistryToDelete] = useState<Ministry | null>(null);

  const filteredMinistries = useMemo(() =>
    ministries.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [ministries, searchTerm]
  );

  const handleDelete = async () => {
    if (!ministryToDelete) return;
    try {
      const res = await fetch(`/api/ministry?id=${ministryToDelete.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete ministry');
      toast.success('Ministry deleted successfully');
      onDelete();
    } catch (err: any) {
      toast.error(err.message);
    }
    setMinistryToDelete(null);
  };

  return (
    <Card className="shadow-xl border-gray-200/80 rounded-2xl">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle>Existing Ministries</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input placeholder="Search ministries..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ministry</TableHead>
                <TableHead>Leader</TableHead>
                <TableHead>Members</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMinistries.map(m => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">
                    <Link href={`/admin/ministries/${m.id}`} className="flex items-center gap-3 hover:underline">
                      <img src={m.photo || '/images/default-2.png'} alt={m.name} className="w-10 h-10 rounded-lg object-cover"/>
                      {m.name}
                    </Link>
                  </TableCell>
                  <TableCell>{m.leader?.name || 'N/A'}</TableCell>
                  <TableCell>{m.members?.length || 0}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => onEdit(m)}><Edit className="h-4 w-4"/></Button>
                    <Button variant="destructive" size="icon" onClick={() => setMinistryToDelete(m)}><Trash2 className="h-4 w-4"/></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="md:hidden p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredMinistries.map(m => (
                <Card key={m.id} className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center gap-4 p-4">
                        <img src={m.photo || '/images/default-2.png'} alt={m.name} className="w-16 h-16 rounded-lg object-cover"/>
                        <div>
                            <Link href={`/admin/ministries/${m.id}`}><CardTitle className="hover:underline">{m.name}</CardTitle></Link>
                            <p className="text-sm text-gray-600">Leader: {m.leader?.name || 'N/A'}</p>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm"><UsersIcon className="h-4 w-4"/> {m.members?.length || 0} members</div>
                        <div className="space-x-2">
                            <Button variant="outline" size="icon" onClick={() => onEdit(m)}><Edit className="h-4 w-4"/></Button>
                            <Button variant="destructive" size="icon" onClick={() => setMinistryToDelete(m)}><Trash2 className="h-4 w-4"/></Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </CardContent>
      <Dialog open={!!ministryToDelete} onOpenChange={() => setMinistryToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>This will permanently delete the {ministryToDelete?.name} ministry.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMinistryToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// Join Requests Component
const JoinRequests = ({ requests, onUpdate }) => {
  const handleRequest = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/ministry-join-requests?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(`Failed to ${status.toLowerCase()} request`);
      toast.success(`Request ${status.toLowerCase()} successfully.`);
      onUpdate();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <Card className="shadow-xl border-gray-200/80 rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><HandHeart/> Pending Join Requests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {requests.length > 0 ? requests.map(req => (
          <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold">{req.user.name}</p>
              <p className="text-sm text-gray-600">wants to join {req.ministry.name}</p>
            </div>
            <div className="space-x-2">
              <Button size="icon" variant="outline" className="text-green-600" onClick={() => handleRequest(req.id, 'APPROVED')}><CheckCircle className="h-4 w-4"/></Button>
              <Button size="icon" variant="outline" className="text-red-600" onClick={() => handleRequest(req.id, 'REJECTED')}><XCircle className="h-4 w-4"/></Button>
            </div>
          </div>
        )) : <p className="text-center text-gray-500 py-8">No pending requests.</p>}
      </CardContent>
    </Card>
  );
};

export default AdminMinistriesPage;
