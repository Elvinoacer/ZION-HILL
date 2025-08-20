"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CreateEventModal from "@/components/CreateEventModal";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

// This interface should be compatible with the Event model for the modal
interface OutreachProgram {
  id: string;
  title: string;
  description?: string | null;
  date?: string;
  location?: string | null;
  // Fields needed for CreateEventModal's eventToEdit prop
  type: any; // Ideally, this would be the EventType enum
  imageUrl?: string | null;
  time?: string | null;
  ministryId?: string | null;
  capacity?: number | null;
  latitude?: number | null;
  longitude?: number | null;
}

const AdminOutreachPage = () => {
  const [outreachPrograms, setOutreachPrograms] = useState<OutreachProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingProgram, setEditingProgram] = useState<OutreachProgram | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [programToDeleteId, setProgramToDeleteId] = useState<string | null>(null);

  const fetchOutreachPrograms = async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming outreach programs are events of type 'TRIP' or 'EVENT'
      // You might need to adjust the query parameter based on your EventType enum
      const res = await fetch("/api/events?type=TRIP"); 
      if (!res.ok) throw new Error("Failed to fetch outreach programs");
      const data = await res.json();
      setOutreachPrograms(data);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load outreach programs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutreachPrograms();
  }, []);

  const handleOpenModalForEdit = (program: OutreachProgram) => {
    setEditingProgram(program);
    setIsModalOpen(true);
  };

  const handleOpenModalForCreate = () => {
    setEditingProgram(null);
    setIsModalOpen(true);
  };

  const handleDeleteProgram = (id: string) => {
    setProgramToDeleteId(id);
    setShowConfirmDeleteDialog(true);
  };

  const confirmDeleteProgram = async () => {
    setError(null);
    if (!programToDeleteId) return;

    const toastId = toast.loading("Deleting program...");
    try {
      // Use the events API endpoint for deletion
      const res = await fetch(`/api/events/${programToDeleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete outreach program");
      }
      
      toast.success("Outreach program deleted successfully.", { id: toastId });
      fetchOutreachPrograms(); // Refresh list
    } catch (err: any) {
      setError(err.message);
      toast.error(`Error: ${err.message}`, { id: toastId });
    } finally {
      setShowConfirmDeleteDialog(false);
      setProgramToDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Outreach Programs Management</h1>
        <p className="text-lg text-gray-600">Loading outreach programs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Outreach Programs Management</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Outreach Programs Management</h1>
          <p className="text-lg text-gray-600">Manage community outreach initiatives and mission trips.</p>
        </div>
        <Button onClick={handleOpenModalForCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Program
        </Button>
      </header>

      {/* Table */}
      <Card className="shadow-lg border border-gray-100">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-lg font-semibold text-gray-800">Existing Outreach Programs</CardTitle>
        </CardHeader>
        <CardContent>
          {outreachPrograms.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outreachPrograms.map((program) => (
                    <TableRow key={program.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium text-gray-800">{program.title}</TableCell>
                      <TableCell className="text-gray-600">{program.description || "N/A"}</TableCell>
                      <TableCell>{program.date ? new Date(program.date).toLocaleDateString() : "N/A"}</TableCell>
                      <TableCell>{program.location || "N/A"}</TableCell>
                      <TableCell className="flex justify-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenModalForEdit(program)}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteProgram(program.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">No outreach programs found.</p>
          )}
        </CardContent>
      </Card>

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventCreated={fetchOutreachPrograms}
        eventToEdit={editingProgram || undefined}
      />

      <AlertDialog open={showConfirmDeleteDialog} onOpenChange={setShowConfirmDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the outreach program.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProgram}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminOutreachPage;
