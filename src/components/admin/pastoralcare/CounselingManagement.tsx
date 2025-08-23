"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Pencil, Loader2, AlertTriangle } from "lucide-react";
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
  const [sessionToEdit, setSessionToEdit] = useState<CounselingSession | null>(
    null
  );
  const [editFormData, setEditFormData] = useState({
    notes: "",
    progress: 0,
  });

  // Calendar state
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [sessionsForSelectedDay, setSessionsForSelectedDay] = useState<
    CounselingSession[]
  >([]);

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
        (session) =>
          format(new Date(session.date), "yyyy-MM-dd") ===
          format(selectedDay, "yyyy-MM-dd")
      );
      setSessionsForSelectedDay(filtered);
    } else {
      setSessionsForSelectedDay([]);
    }
  }, [selectedDay, sessions]);

  // Generic update handler
  const handleSessionUpdate = async (
    sessionId: string,
    updates: Partial<CounselingSession>
  ) => {
    const originalSessions = [...sessions];
    setSessions((prevSessions) =>
      prevSessions.map((s) => (s.id === sessionId ? { ...s, ...updates } : s))
    );

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
      setSessions((prevSessions) =>
        prevSessions.map((s) =>
          s.id === updatedSession.id ? updatedSession : s
        )
      );
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

  const handleCounselorChangeInTable = (
    sessionId: string,
    newCounselorId: string
  ) => {
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
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  if (loading)
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        <p className="ml-3 text-lg font-medium text-blue-400">
          Loading counseling requests...
        </p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-6 max-w-md mx-auto text-center text-white shadow-lg">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-900/50 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-2">
            Error
          </h2>
          <p className="text-red-300 mb-6">{error}</p>
          <button
            onClick={() => {
              fetchSessions();
              fetchCounselors();
            }}
            className="bg-red-800/50 hover:bg-red-800/80 text-red-200 font-semibold py-2 px-4 rounded-lg border border-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700/50"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
        Counseling Session Management
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-900/30 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-blue-700/50">
          <h3 className="text-lg font-semibold text-blue-400">
            Total Sessions
          </h3>
          <p className="text-3xl font-bold text-blue-300 mt-1">
            {sessions.length}
          </p>
        </div>
        <div className="bg-green-900/30 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-green-700/50">
          <h3 className="text-lg font-semibold text-green-400">Pending</h3>
          <p className="text-3xl font-bold text-green-300 mt-1">
            {sessions.filter((s) => s.status === "Pending").length}
          </p>
        </div>
        <div className="bg-yellow-900/30 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-yellow-700/50">
          <h3 className="text-lg font-semibold text-yellow-400">
            Scheduled
          </h3>
          <p className="text-3xl font-bold text-yellow-300 mt-1">
            {sessions.filter((s) => s.status === "Scheduled").length}
          </p>
        </div>
        <div className="bg-purple-900/30 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-purple-700/50">
          <h3 className="text-lg font-semibold text-purple-400">
            Completed
          </h3>
          <p className="text-3xl font-bold text-purple-300 mt-1">
            {sessions.filter((s) => s.status === "Completed").length}
          </p>
        </div>
        <div className="bg-red-900/30 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-red-700/50">
          <h3 className="text-lg font-semibold text-red-400">Cancelled</h3>
          <p className="text-3xl font-bold text-red-300 mt-1">
            {sessions.filter((s) => s.status === "Cancelled").length}
          </p>
        </div>
        <div className="bg-gray-700/30 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-300">
            Unique Clients
          </h3>
          <p className="text-3xl font-bold text-gray-200 mt-1">
            {new Set(sessions.map((s) => s.client?.id)).size}
          </p>
        </div>
        <div className="bg-gray-700/30 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-300">
            Unique Counselors
          </h3>
          <p className="text-3xl font-bold text-gray-200 mt-1">
            {new Set(sessions.map((s) => s.counselor?.id)).size}
          </p>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-xl">No counseling requests found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-gray-800 shadow-lg rounded-lg border border-gray-700/50">
          <Table className="w-full">
            <TableHeader className="bg-gray-700/30">
              <TableRow>
                <TableHead className="text-gray-300 font-semibold">
                  Client
                </TableHead>
                <TableHead className="text-gray-300 font-semibold">
                  Counselor
                </TableHead>
                <TableHead className="text-gray-300 font-semibold">
                  Session Date
                </TableHead>
                <TableHead className="text-gray-300 font-semibold">
                  Status
                </TableHead>
                <TableHead className="text-gray-300 font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-700">
              {sessions.map((session) => (
                <TableRow
                  key={session.id}
                  className="hover:bg-gray-700 transition-colors"
                >
                  <TableCell className="font-medium text-white">
                    {session.client?.name || "N/A"}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={session.counselorId}
                      onValueChange={(newCounselorId) =>
                        handleCounselorChangeInTable(session.id, newCounselorId)
                      }
                    >
                      <SelectTrigger className="w-[180px] border-gray-700 focus:ring-blue-400 focus:border-blue-400 bg-gray-900 text-gray-200">
                        <SelectValue placeholder="Select Counselor" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-gray-200 border-gray-700">
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
                      onChange={(e) =>
                        handleDateChangeInTable(session.id, e.target.value)
                      }
                      className="w-[150px] border-gray-700 focus:ring-blue-400 focus:border-blue-400 bg-gray-900 text-gray-200"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={session.status}
                      onValueChange={(newStatus) =>
                        handleStatusChange(session.id, newStatus)
                      }
                    >
                      <SelectTrigger className="w-[180px] border-gray-700 focus:ring-blue-400 focus:border-blue-400 bg-gray-900 text-gray-200">
                        <SelectValue placeholder="Set status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-gray-200 border-gray-700">
                        {statusOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(session)}
                      className="text-blue-400 hover:bg-blue-900/30 hover:text-blue-300 border-blue-700/50"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <h3 className="text-2xl font-bold text-white mt-12 mb-6">
        Session Calendar
      </h3>
      <div className="flex flex-col lg:flex-row gap-8 bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700/50">
        <div className="p-4 border border-gray-700/50 rounded-lg shadow-sm bg-gray-900 overflow-x-auto"> {/* Added overflow-x-auto here */}
          <style>{`
            .rdp {
              --rdp-cell-size: 40px; /* Default for larger screens */
              --rdp-background-color: #1f2937; /* gray-800 */
              --rdp-text-color: #d1d5db; /* gray-300 */
              --rdp-selected-color: #6366f1; /* indigo-500 */
              --rdp-selected-text-color: #ffffff;
              --rdp-today-color: #60a5fa; /* blue-400 */
              --rdp-caption-color: #818CF8; /* indigo-400 */
              --rdp-head-color: #9CA3AF; /* gray-400 */
              --rdp-disabled-color: #4b5563; /* gray-600 */
            }

            @media (max-width: 639px) { /* Tailwind's 'sm' breakpoint is 640px */
              .rdp {
                --rdp-cell-size: 36px; /* Slightly larger for better touch, but still smaller */
              }
            }
            @media (max-width: 480px) { /* Extra small screens */
              .rdp {
                --rdp-cell-size: 32px; /* Even smaller for very narrow screens */
              }
            }
            .rdp-caption_label {
              color: var(--rdp-caption-color);
            }
            .rdp-head_cell {
              color: var(--rdp-head-color);
            }
            .rdp-day_selected {
              background-color: var(--rdp-selected-color);
              color: var(--rdp-selected-text-color);
            }
            .rdp-day_today {
              color: var(--rdp-today-color);
            }
            .rdp-day_disabled {
              color: var(--rdp-disabled-color);
              cursor: "not-allowed",
            }
          `}</style>
          <DayPicker
            mode="single"
            selected={selectedDay}
            onSelect={setSelectedDay}
            modifiers={{ hasSessions: sessions.map((s) => new Date(s.date)) }}
            modifiersClassNames={{
              hasSessions: "bg-blue-900/30 text-blue-400 rounded-full font-bold",
            }}
            footer={
              selectedDay ? (
                <p className="text-sm text-gray-400 mt-2">
                  You selected{" "}
                  <span className="font-medium text-blue-400">
                    {format(selectedDay, "PPP")}
                  </span>
                  .
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  Please pick a day to view sessions.
                </p>
              )
            }
            styles={{
              caption: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "var(--rdp-caption-color)",
              },
              head_row: {
                display: "flex",
                justifyContent: "space-around",
                color: "var(--rdp-head-color)",
              },
              row: {
                display: "flex",
                justifyContent: "space-around",
              },
              cell: { flex: "1", textAlign: "center" },
              day_selected: {
                backgroundColor: "var(--rdp-selected-color)",
                color: "var(--rdp-selected-text-color)",
                borderRadius: "9999px", // full rounded
              },
              day_today: { fontWeight: "bold", color: "var(--rdp-today-color)" },
              day_disabled: {
                color: "var(--rdp-disabled-color)",
                cursor: "not-allowed",
              },
            }}
            className="w-full" /* Added w-full */
          />
        </div>
        <div className="flex-grow p-4">
          <h4 className="text-xl font-semibold text-white mb-4">
            Sessions on {selectedDay ? format(selectedDay, "PPP") : "Selected Day"}
          </h4>
          {sessionsForSelectedDay.length === 0 ? (
            <p className="text-gray-400">No sessions on this day.</p>
          ) : (
            <ul className="list-none pl-0 space-y-3">
              {sessionsForSelectedDay.map((session) => (
                <li
                  key={session.id}
                  className="bg-gray-700/50 p-3 rounded-lg shadow-sm border border-gray-700 flex items-center justify-between"
                >
                  <div className="space-y-6">
                    <p className="text-white font-medium">
                      Client:{" "}
                      <span className="text-blue-400">
                        {session.client?.name || "N/A"}
                      </span>
                    </p>
                    <p className="text-gray-300 text-sm">
                      Counselor:{" "}
                      <span className="text-indigo-400">
                        {session.counselor?.name || "N/A"}
                      </span>
                    </p>
                    <p className="text-gray-300 text-sm">
                      Status: <span className="font-medium">{session.status}</span>
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(session)}
                    className="text-blue-400 hover:bg-blue-900/30 hover:text-blue-300 border-blue-700/50"
                  >
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
        <DialogContent className="sm:max-w-[500px] p-6 rounded-xl shadow-2xl bg-gray-800 text-white border-gray-700/50">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-white">
              Edit Counseling Session
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-gray-300 font-medium">
                Client
              </Label>
              <div className="col-span-3 text-left font-medium text-white p-2 bg-gray-700/30 rounded-md border border-gray-700">
                {sessionToEdit?.client?.name || "N/A"}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-gray-300 font-medium">
                Counselor
              </Label>
              <div className="col-span-3 text-left font-medium text-white p-2 bg-gray-700/30 rounded-md border border-gray-700">
                {sessionToEdit?.counselor?.name || "N/A"}
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label
                htmlFor="notes"
                className="text-right text-gray-300 font-medium"
              >
                Notes
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={editFormData.notes}
                onChange={handleFormChange}
                className="col-span-3 border-gray-700 focus:ring-blue-400 focus:border-blue-400 rounded-lg bg-gray-900 text-gray-200"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="progress"
                className="text-right text-gray-300 font-medium"
              >
                Progress
              </Label>
              <Input
                id="progress"
                name="progress"
                type="number"
                value={editFormData.progress}
                onChange={handleFormChange}
                className="col-span-3 border-gray-700 focus:ring-blue-400 focus:border-blue-400 rounded-lg bg-gray-900 text-gray-200"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="text-gray-300 hover:bg-gray-700/50 border-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="bg-blue-700 hover:bg-blue-800 text-white"
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default CounselingManagement;
