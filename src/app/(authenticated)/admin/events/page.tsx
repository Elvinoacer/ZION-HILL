"use client";

import React, { useEffect, useState } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, parseISO } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming cn utility exists
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import Image from "next/image"; // Import Image component

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  type: string;
  description?: string; // Added description
  imageUrl?: string; // Added imageUrl
}

const AdminEventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false); // State for image upload loading

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    location: "",
    type: "",
    description: "",
    imageUrl: "",
  });

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data);
      // Extract dates for disabling
      const dates = data.map((event: Event) => parseISO(event.date));
      setDisabledDates(dates);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchEvents();
    setLoading(false);
  }, []);

  const handleNewEventChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditingEventChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditingEvent((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploadLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await res.json();
      const imageUrl = data.url; // Assuming the API returns { url: '...' }

      if (editingEvent) {
        setEditingEvent((prev) => ({
          ...prev!,
          imageUrl: imageUrl,
        }));
      } else {
        setNewEvent((prev) => ({
          ...prev,
          imageUrl: imageUrl,
        }));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleNewEventTypeChange = (value: string) => {
    setNewEvent((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleEditingEventTypeChange = (value: string) => {
    setEditingEvent((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        type: value,
      };
    });
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add event");
      }

      setNewEvent({
        title: "",
        date: "",
        location: "",
        type: "",
        description: "",
        imageUrl: "",
      });
      fetchEvents(); // Refresh event list
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!editingEvent) return;

    try {
      const res = await fetch(`/api/events?id=${editingEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingEvent),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update event");
      }

      setEditingEvent(null);
      fetchEvents(); // Refresh event list
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/events?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete event");
      }

      fetchEvents(); // Refresh event list
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Event Management
        </h1>
        <p className="text-lg text-gray-600">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Event Management
        </h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Event Management
      </h1>
      <p className="text-lg text-gray-600 mb-4">
        Plan and manage church events, including services, conferences, and
        training sessions.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingEvent ? "Edit Event" : "Add New Event"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label
                htmlFor="title"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Title:
              </label>
              <Input
                type="text"
                id="title"
                name="title"
                value={editingEvent ? editingEvent.title : newEvent.title}
                onChange={
                  editingEvent ? handleEditingEventChange : handleNewEventChange
                }
                required
              />
            </div>
            <div>
              <label
                htmlFor="date"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Date:
              </label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editingEvent?.date &&
                        !newEvent.date &&
                        "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editingEvent?.date
                      ? format(parseISO(editingEvent.date), "PPP")
                      : newEvent.date
                      ? format(parseISO(newEvent.date), "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <DayPicker
                    mode="single"
                    selected={
                      editingEvent
                        ? parseISO(editingEvent.date)
                        : newEvent.date
                        ? parseISO(newEvent.date)
                        : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        if (editingEvent) {
                          setEditingEvent((prev) => ({
                            ...prev!,
                            date: date.toISOString(),
                          }));
                        } else {
                          setNewEvent((prev) => ({
                            ...prev,
                            date: date.toISOString(),
                          }));
                        }
                        setDatePickerOpen(false);
                      }
                    }}
                    disabled={disabledDates}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Location:
              </label>
              <Input
                type="text"
                id="location"
                name="location"
                value={
                  editingEvent ? editingEvent.location || "" : newEvent.location
                }
                onChange={
                  editingEvent ? handleEditingEventChange : handleNewEventChange
                }
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Description:
              </label>
              <Textarea
                id="description"
                name="description"
                value={
                  editingEvent
                    ? editingEvent.description || ""
                    : newEvent.description
                }
                onChange={
                  editingEvent ? handleEditingEventChange : handleNewEventChange
                }
                rows={4}
              />
            </div>
            <div>
              <label
                htmlFor="imageUrl"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Image:
              </label>
              <Input
                type="file"
                id="imageUrl"
                name="imageUrl"
                onChange={handleImageUpload}
                disabled={imageUploadLoading}
                accept="image/*"
              />
              {imageUploadLoading && (
                <p className="text-sm text-gray-500 mt-1">Uploading image...</p>
              )}
              {(editingEvent?.imageUrl || newEvent.imageUrl) && (
                <div className="mt-2">
                  <Image
                    src={editingEvent?.imageUrl || newEvent.imageUrl || ""}
                    alt="Event Image Preview"
                    width={100}
                    height={100}
                    className="rounded-md object-cover"
                  />
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="type"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Type:
              </label>
              <Select
                onValueChange={
                  editingEvent
                    ? handleEditingEventTypeChange
                    : handleNewEventTypeChange
                }
                value={editingEvent ? editingEvent.type : newEvent.type}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SERVICE">Service</SelectItem>
                  <SelectItem value="MEETING">Meeting</SelectItem>
                  <SelectItem value="TRIP">Trip</SelectItem>
                  <SelectItem value="APPOINTMENT">Appointment</SelectItem>
                  <SelectItem value="CLASS">Class</SelectItem>
                  <SelectItem value="EVENT">Event</SelectItem>
                  <SelectItem value="BOOKING">Booking</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 flex space-x-2">
              <Button type="submit">
                {editingEvent ? "Update Event" : "Add Event"}
              </Button>
              {editingEvent && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingEvent(null)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Events</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>{event.title}</TableCell>
                      <TableCell>
                        {new Date(event.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{event.location || "N/A"}</TableCell>
                      <TableCell>{event.description || "N/A"}</TableCell>
                      <TableCell>
                        {event.imageUrl ? (
                          <Image
                            src={event.imageUrl}
                            alt="Event Image"
                            width={50}
                            height={50}
                            className="rounded-md object-cover"
                          />
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>{event.type}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingEvent(event)}
                          className="mr-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p>No events found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEventsPage;
