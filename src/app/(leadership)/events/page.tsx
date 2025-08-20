"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { CalendarIcon, Edit, Trash2, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
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

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  type: string;
  description?: string;
  imageUrl?: string;
}

const AdminEventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const eventTypes = [
    { value: "SERVICE", label: "Service", color: "bg-blue-100 text-blue-800" },
    { value: "MEETING", label: "Meeting", color: "bg-green-100 text-green-800" },
    { value: "TRIP", label: "Trip", color: "bg-yellow-100 text-yellow-800" },
    { value: "APPOINTMENT", label: "Appointment", color: "bg-purple-100 text-purple-800" },
    { value: "CLASS", label: "Class", color: "bg-indigo-100 text-indigo-800" },
    { value: "EVENT", label: "Event", color: "bg-pink-100 text-pink-800" },
    { value: "BOOKING", label: "Booking", color: "bg-gray-100 text-gray-800" },
  ];

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const confirmDelete = (id: string) => {
    setEventToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;

    setError(null);
    try {
      const res = await fetch(`/api/events?id=${eventToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete event");
      }

      fetchEvents();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Event Management</h1>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Event Management</h1>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Error: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Event Management</h1>
        <p className="text-lg text-gray-600">
          Plan and manage church events, including services, conferences, and training sessions.
        </p>
      </div>

      {/* Add New Event Button */}
      <div className="mb-8 flex justify-end">
        <Button onClick={() => { setIsModalOpen(true); setEditingEvent(null); }} className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Add New Event
        </Button>
      </div>

      {/* Events List */}
      <Card className="border border-gray-200 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
          <CardTitle className="text-white">Existing Events</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {events.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-gray-600 font-medium">Title</TableHead>
                    <TableHead className="text-gray-600 font-medium">Date</TableHead>
                    <TableHead className="text-gray-600 font-medium">Location</TableHead>
                    <TableHead className="text-gray-600 font-medium">Type</TableHead>
                    <TableHead className="text-gray-600 font-medium">Image</TableHead>
                    <TableHead className="text-gray-600 font-medium text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => {
                    const eventType = eventTypes.find((t) => t.value === event.type);
                    return (
                      <TableRow key={event.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {event.imageUrl && (
                              <div className="relative w-10 h-10 rounded-md overflow-hidden mr-3 shadow-sm">
                                <Image src={event.imageUrl} alt="Event Image" fill className="object-cover" />
                              </div>
                            )}
                            <div>
                              <p className="text-gray-900 font-medium">{event.title}</p>
                              {event.description && (
                                <p className="text-gray-500 text-sm line-clamp-1">{event.description}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-gray-700">{event.date ? format(parseISO(event.date), "MMM d, yyyy") : "N/A"}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-gray-700">{event.location || "N/A"}</div>
                        </TableCell>
                        <TableCell>
                          {eventType ? (
                            <Badge className={`${eventType.color} rounded-md shadow-sm`}>{eventType.label}</Badge>
                          ) : (
                            event.type
                          )}
                        </TableCell>
                        <TableCell>
                          {event.imageUrl ? (
                            <div className="relative w-10 h-10 rounded-md overflow-hidden shadow-sm">
                              <Image src={event.imageUrl} alt="Event Image" fill className="object-cover" />
                            </div>
                          ) : (
                            <span className="text-gray-500">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => { setEditingEvent(event); setIsModalOpen(true); }}
                              className="text-gray-600 hover:text-gray-900 border-gray-300 hover:bg-gray-50 rounded-md shadow-sm"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => confirmDelete(event.id)}
                              className="text-white hover:bg-red-700 rounded-md shadow-sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No events found</h3>
              <p className="mt-1 text-gray-500">Get started by adding a new event.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md rounded-lg shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-800">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md shadow-sm">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEvent}
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 rounded-md shadow-sm"
            >
              Delete Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CreateEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onEventCreated={fetchEvents} eventToEdit={editingEvent} />
    </div>
  );
};

export default AdminEventsPage;
