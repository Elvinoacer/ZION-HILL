"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  PlusCircle,
  Trash2,
  Edit,
  MapPin,
  Calendar,
  Info,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Event, EventType } from "@/generated/prisma";
import { motion, AnimatePresence } from "framer-motion";

const EmptyState = ({ onAddNew }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200"
  >
    <MapPin className="mx-auto h-16 w-16 text-gray-400" />
    <h3 className="mt-4 text-2xl font-semibold text-gray-800">
      No Outreach Programs Yet
    </h3>
    <p className="mt-2 text-md text-gray-500">
      Get started by creating a new outreach initiative.
    </p>
    <div className="mt-6">
      <Button
        onClick={onAddNew}
        className="bg-blue-600 hover:bg-blue-700 shadow-lg"
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        Create First Program
      </Button>
    </div>
  </motion.div>
);

const AdminOutreachPage = () => {
  const [outreachPrograms, setOutreachPrograms] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProgram, setEditingProgram] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [programToDeleteId, setProgramToDeleteId] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOutreachPrograms = async () => {
    setLoading(true);
    setError(null);
    try {
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

  const filteredPrograms = useMemo(
    () =>
      outreachPrograms.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.location?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [outreachPrograms, searchTerm]
  );

  const handleOpenModalForEdit = (program: Event) => {
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
    if (!programToDeleteId) return;
    const toastId = toast.loading("Deleting program...");
    try {
      const res = await fetch(`/api/events?id=${programToDeleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete outreach program");
      }
      toast.success("Outreach program deleted successfully.", { id: toastId });
      fetchOutreachPrograms();
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
      <div className="p-4 md:p-8">
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded w-36"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded w-1/2"></div>
          <div className="rounded-lg bg-gray-200 h-96 w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          An Error Occurred
        </h1>
        <p className="text-red-500 mb-6">{error}</p>
        <Button onClick={fetchOutreachPrograms}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
              Outreach Programs
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage community initiatives and mission trips.
            </p>
          </div>
          <Button
            onClick={handleOpenModalForCreate}
            className="shadow-lg bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            New Program
          </Button>
        </header>

        <Card className="shadow-xl border-gray-200/80 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardHeader className="p-5 border-b border-gray-200/80">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-xl font-bold text-gray-800">
                Program List
              </CardTitle>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 transition"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredPrograms.length > 0 ? (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50">
                        <TableHead className="w-[25%]">Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[120px]">Date</TableHead>
                        <TableHead className="w-[180px]">Location</TableHead>
                        <TableHead className="text-center w-[150px]">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {filteredPrograms.map((program) => (
                          <motion.tr
                            layout
                            key={program.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-gray-50/70 transition-colors"
                          >
                            <TableCell className="font-semibold text-gray-800">
                              {program.title}
                            </TableCell>
                            <TableCell className="text-gray-600 text-sm">
                              {program.description || "N/A"}
                            </TableCell>
                            <TableCell>
                              {program.date
                                ? new Date(program.date).toLocaleDateString()
                                : "N/A"}
                            </TableCell>
                            <TableCell>{program.location || "N/A"}</TableCell>
                            <TableCell className="flex justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenModalForEdit(program)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteProgram(program.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>
              </>
            ) : (
              <EmptyState onAddNew={handleOpenModalForCreate} />
            )}
          </CardContent>
        </Card>

        <CreateEventModal
          key={editingProgram ? editingProgram.id : "new"}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEventCreated={fetchOutreachPrograms}
          editingEvent={editingProgram || undefined}
          onEventUpdated={fetchOutreachPrograms}
          eventTypeToLock={"TRIP"}
        />

        <AlertDialog
          open={showConfirmDeleteDialog}
          onOpenChange={setShowConfirmDeleteDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                outreach program and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteProgram}
                className="bg-red-600 hover:bg-red-700"
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminOutreachPage;
