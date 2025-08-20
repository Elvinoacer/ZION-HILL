"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface CounselingSession {
  id: string;
  date: string;
  status: string;
  notes: string | null;
  progress: number;
  clientId: string; // Add clientId for counselor selection
  counselorId: string; // Add counselorId for counselor selection
  client: { id: string; name: string | null; email: string | null } | null;
  counselor: { id: string; name: string | null; email: string | null } | null;
}

interface Counselor {
  id: string;
  name: string | null;
  email: string | null;
}

const statusOptions = ["Scheduled", "Completed", "Cancelled", "Pending"];

const CounselingManagement = () => {
  const [sessions, setSessions] = useState<CounselingSession[]>([]);
  const [counselors, setCounselors] = useState<Counselor[]>([]); // New state for counselors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for editing
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState<CounselingSession | null>(null);
  const [editFormData, setEditFormData] = useState({
    notes: "",
    progress: 0,
  });

  // Calendar state
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [sessionsForSelectedDay, setSessionsForSelectedDay] = useState<CounselingSession[]>([]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/counseling");
      if (response.status === 403) {
        throw new Error("You do not have permission to view this page.");
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSessions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCounselors = async () => {
    try {
      const response = await fetch("/api/counselors");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCounselors(data);
    } catch (err: any) {
      console.error("Error fetching counselors:", err);
      // Don't set global error, just log it as it's a secondary fetch
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchCounselors(); // Fetch counselors on component mount
  }, []);

  useEffect(() => {
    if (selectedDay) {
      const filtered = sessions.filter(
        (session) => format(new Date(session.date), "yyyy-MM-dd") === format(selectedDay, "yyyy-MM-dd")
      );
      setSessionsForSelectedDay(filtered);
    } else {
      setSessionsForSelectedDay([]);
    }
  }, [selectedDay, sessions]);

  // Generic update handler
  const handleSessionUpdate = async (sessionId: string, updates: Partial<CounselingSession>) => {
    const originalSessions = [...sessions];
    setSessions((prevSessions) => prevSessions.map((s) => (s.id === sessionId ? { ...s, ...updates } : s)));

    const toastId = toast.loading(`Updating session ${sessionId}...`);

    try {
      const response = await fetch("/api/admin/counseling", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sessionId, ...updates }),
      });

      if (!response.ok) {
        throw new Error("Failed to update session.");
      }

      const updatedSession = await response.json();
      setSessions((prevSessions) => prevSessions.map((s) => (s.id === updatedSession.id ? updatedSession : s)));
      toast.success("Session updated successfully.", { id: toastId });
    } catch (err) {
      setSessions(originalSessions); // Revert on error
      toast.error("Failed to update session. Please try again.", { id: toastId });
      console.error(err);
    }
  };

  const handleStatusChange = (sessionId: string, newStatus: string) => {
    handleSessionUpdate(sessionId, { status: newStatus });
  };

  const handleDateChangeInTable = (sessionId: string, newDate: string) => {
    handleSessionUpdate(sessionId, { date: newDate });
  };

  const handleCounselorChangeInTable = (sessionId: string, newCounselorId: string) => {
    handleSessionUpdate(sessionId, { counselorId: newCounselorId });
  };

  // Handle opening edit dialog
  const handleEditClick = (session: CounselingSession) => {
    setSessionToEdit(session);
    setEditFormData({
      notes: session.notes || "",
      progress: session.progress || 0,
    });
    setIsEditDialogOpen(true);
  };

  // Handle form data changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle saving edits from dialog
  const handleSaveEdit = async () => {
    if (!sessionToEdit) return;

    const updates = {
      notes: editFormData.notes === "" ? null : editFormData.notes,
      progress: Number(editFormData.progress),
    };

    await handleSessionUpdate(sessionToEdit.id, updates);
    setIsEditDialogOpen(false);
    setSessionToEdit(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <svg
        className="animate-spin h-8 w-8 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p className="ml-3 text-lg font-medium text-blue-600">Loading counseling requests...</p>
    </div>
  );
  if (error) return (
    <div className="flex items-center justify-center py-12 text-red-500">
      <AlertTriangle className="h-8 w-8 text-red-600" />
      <p className="ml-3 text-lg font-medium text-red-600">Error: {error}</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-2xl p-6 border border-gray-200 backdrop-blur-sm"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Counseling Sessions Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-blue-800">Total Sessions</h3>
          <p className="text-3xl font-bold text-blue-700 mt-1">{sessions.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-green-800">Pending</h3>
          <p className="text-3xl font-bold text-green-700 mt-1">{sessions.filter((s) => s.status === "Pending").length}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-yellow-800">Scheduled</h3>
          <p className="text-3xl font-bold text-yellow-700 mt-1">
            {sessions.filter((s) => s.status === "Scheduled").length}
          </p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-purple-800">Completed</h3>
          <p className="text-3xl font-bold text-purple-700 mt-1">
            {sessions.filter((s) => s.status === "Completed").length}
          </p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-red-800">Cancelled</h3>
          <p className="text-3xl font-bold text-red-700 mt-1">{sessions.filter((s) => s.status === "Cancelled").length}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800">Unique Clients</h3>
          <p className="text-3xl font-bold text-gray-700 mt-1">{new Set(sessions.map((s) => s.client?.id)).size}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800">Unique Counselors</h3>
          <p className="text-3xl font-bold text-gray-700 mt-1">{new Set(sessions.map((s) => s.counselor?.id)).size}</p>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl">No counseling requests found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
          <Table className="w-full">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-gray-700 font-semibold">Client</TableHead>
                <TableHead className="text-gray-700 font-semibold">Counselor</TableHead>
                <TableHead className="text-gray-700 font-semibold">Session Date</TableHead>
                <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-gray-800">{session.client?.name || "N/A"}</TableCell>
                  <TableCell>
                    <Select
                      value={session.counselorId}
                      onValueChange={(newCounselorId) => handleCounselorChangeInTable(session.id, newCounselorId)}
                    >
                      <SelectTrigger className="w-[180px] border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                        <SelectValue placeholder="Select Counselor" />
                      </SelectTrigger>
                      <SelectContent>
                        {counselors.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name || c.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="date"
                      value={format(new Date(session.date), "yyyy-MM-dd")}
                      onChange={(e) => handleDateChangeInTable(session.id, e.target.value)}
                      className="w-[150px] border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={session.status}
                      onValueChange={(newStatus) => handleStatusChange(session.id, newStatus)}
                    >
                      <SelectTrigger className="w-[180px] border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                        <SelectValue placeholder="Set status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(session)} className="text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Session Calendar</h3>
      <div className="flex flex-col lg:flex-row gap-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex-shrink-0 p-4 border border-gray-200 rounded-lg shadow-sm">
          <DayPicker
            mode="single"
            selected={selectedDay}
            onSelect={setSelectedDay}
            modifiers={{ hasSessions: sessions.map((s) => new Date(s.date)) }}
            modifiersClassNames={{
              hasSessions: "bg-blue-200 text-blue-800 rounded-full font-bold",
            }}
            footer={selectedDay ? <p className="text-sm text-gray-600 mt-2">You selected <span className="font-medium text-blue-600">{format(selectedDay, "PPP")}</span>.</p> : <p className="text-sm text-gray-500 mt-2">Please pick a day to view sessions.</p>}
            styles={{
              caption: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#4F46E5", // indigo-600
              },
              head_row: {
                display: "flex",
                justifyContent: "space-around",
                color: "#6B7280", // gray-500
              },
              row: {
                display: "flex",
                justifyContent: "space-around",
              },
              cell: { flex: "1", textAlign: "center" },
              day_selected: {
                backgroundColor: "#4F46E5", // indigo-600
                color: "white",
                borderRadius: "9999px", // full rounded
              },
              day_today: { fontWeight: "bold", color: "#2563EB" }, // blue-600
              day_disabled: {
                color: "#9CA3AF", // gray-400
                cursor: "not-allowed",
              },
            }}
          />
        </div>
        <div className="flex-grow p-4">
          <h4 className="text-xl font-semibold text-gray-700 mb-4">Sessions on {selectedDay ? format(selectedDay, "PPP") : "Selected Day"}</h4>
          {sessionsForSelectedDay.length === 0 ? (
            <p className="text-gray-500">No sessions on this day.</p>
          ) : (
            <ul className="list-none pl-0 space-y-3">
              {sessionsForSelectedDay.map((session) => (
                <li key={session.id} className="bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-gray-800 font-medium">Client: <span className="text-blue-600">{session.client?.name || "N/A"}</span></p>
                    <p className="text-gray-600 text-sm">Counselor: <span className="text-indigo-600">{session.counselor?.name || "N/A"}</span></p>
                    <p className="text-gray-600 text-sm">Status: <span className="font-medium">{session.status}</span></p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(session)} className="text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Edit Session Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-6 rounded-xl shadow-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">Edit Counseling Session</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-gray-700 font-medium">Client</Label>
              <div className="col-span-3 text-left font-medium text-gray-800 p-2 bg-gray-50 rounded-md border border-gray-200">{sessionToEdit?.client?.name || "N/A"}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-gray-700 font-medium">Counselor</Label>
              <div className="col-span-3 text-left font-medium text-gray-800 p-2 bg-gray-50 rounded-md border border-gray-200">{sessionToEdit?.counselor?.name || "N/A"}</div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-right text-gray-700 font-medium">
                Notes
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={editFormData.notes}
                onChange={handleFormChange}
                className="col-span-3 border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="progress" className="text-right text-gray-700 font-medium">
                Progress
              </Label>
              <Input
                id="progress"
                name="progress"
                type="number"
                value={editFormData.progress}
                onChange={handleFormChange}
                className="col-span-3 border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="text-gray-700 hover:bg-gray-100">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700 text-white">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default CounselingManagement;
