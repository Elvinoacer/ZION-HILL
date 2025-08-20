"use client";

import { Event, EventType } from "@/generated/prisma";
import { useEventStore } from "@/store/eventStore";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Image as ImageIcon, MapPin, Search, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { toast } from "sonner";

// Fix Leaflet default icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  ministryId?: string;
  onEventCreated: () => void;
  editingEvent?: Event; // Optional prop for editing an event
  onEventUpdated: () => void; // Added
}

export default function CreateEventModal({
  isOpen,
  onClose,
  ministryId,
  onEventCreated,
  editingEvent,
  onEventUpdated,
}: CreateEventModalProps) {
  const { createEvent, updateEvent } = useEventStore();
  const [newEventData, setNewEventData] = useState({
    title: editingEvent?.title || "",
    type: editingEvent?.type || ("SERVICE" as EventType),
    date: editingEvent?.date
      ? format(new Date(editingEvent.date), "yyyy-MM-dd")
      : "",
    location: editingEvent?.location || "",
    description: editingEvent?.description || "",
    image: editingEvent?.imageUrl || "",
    time: editingEvent?.time || "",
    ministryId: ministryId || editingEvent?.ministryId || "",
    capacity: editingEvent?.capacity || 0,
    latitude: editingEvent?.latitude || (null as number | null),
    longitude: editingEvent?.longitude || (null as number | null),
  });
  const [localDisabledDates, setLocalDisabledDates] = useState<Date[]>([]);
  const [ministries, setMinistries] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    editingEvent?.imageUrl || null
  );
  const [searchQuery, setSearchQuery] = useState(editingEvent?.location || "");
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(
    editingEvent?.latitude && editingEvent?.longitude
      ? { lat: editingEvent.latitude, lng: editingEvent.longitude }
      : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = editingEvent && editingEvent.id;

  useEffect(() => {
    if (editingEvent) {
      setNewEventData({
        title: editingEvent.title || "",
        type: editingEvent.type || "SERVICE",
        date: editingEvent.date
          ? format(new Date(editingEvent.date), "yyyy-MM-dd")
          : "",
        location: editingEvent.location || "",
        description: editingEvent.description || "",
        image: editingEvent.imageUrl || "",
        time: editingEvent.time || "",
        ministryId: ministryId || editingEvent.ministryId || "",
        capacity: editingEvent.capacity || 0,
        latitude: editingEvent.latitude || null,
        longitude: editingEvent.longitude || null,
      });
      setImagePreview(editingEvent.imageUrl || null);
      setSearchQuery(editingEvent.location || "");
      setMarkerPosition(
        editingEvent.latitude && editingEvent.longitude
          ? { lat: editingEvent.latitude, lng: editingEvent.longitude }
          : null
      );
    } else {
      // Reset form for new event creation
      setNewEventData({
        title: "",
        type: "SERVICE",
        date: "",
        location: "",
        description: "",
        image: "",
        time: "",
        ministryId: ministryId || "",
        capacity: 0,
        latitude: null,
        longitude: null,
      });
      setSelectedImage(null);
      setImagePreview(null);
      setSearchQuery("");
      setMarkerPosition(null);
    }
  }, [editingEvent, isOpen, ministryId]);

  useEffect(() => {
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedImage);
    } else if (!isEditMode) {
      setImagePreview(null);
    }
  }, [selectedImage, isEditMode]);

  useEffect(() => {
    if (isOpen) {
      const fetchDisabledDates = async () => {
        try {
          const response = await fetch("/api/events/dates");
          if (!response.ok) {
            throw new Error("Failed to fetch disabled dates");
          }
          const data: string[] = await response.json();
          setLocalDisabledDates(data.map((dateString) => new Date(dateString)));
        } catch (error) {
          console.error("Error fetching disabled dates:", error);
          toast.error("Failed to load disabled dates.");
        }
      };
      fetchDisabledDates();

      if (!ministryId && ministries.length === 0) {
        const fetchMinistries = async () => {
          try {
            const response = await fetch("/api/ministries");
            if (!response.ok) {
              throw new Error("Failed to fetch ministries");
            }
            const data = await response.json();
            setMinistries(data);
          } catch (error) {
            console.error("Error fetching ministries:", error);
            toast.error("Failed to load ministries.");
          }
        };
        fetchMinistries();
      }
    }
  }, [isOpen, ministryId, ministries.length]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const loadingToast = toast.loading(
      isEditMode ? "Updating event..." : "Creating event..."
    );

    try {
      let imageUrl = newEventData.image;
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);

        const uploadToast = toast.loading("Uploading image...");
        const uploadResponse = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Image upload failed");
        }

        const { url } = await uploadResponse.json();
        imageUrl = url;
        toast.dismiss(uploadToast);
        toast.success("Image uploaded successfully");
      }

      const eventPayload = {
        title: newEventData.title,
        type: newEventData.type,
        date: new Date(newEventData.date),
        location: newEventData.location || null,
        description: newEventData.description || null,
        imageUrl: imageUrl || null,
        latitude: newEventData.latitude,
        longitude: newEventData.longitude,
        ministryId: newEventData.ministryId || null,
        time: newEventData.time,
        capacity: newEventData.capacity,
      };

      if (isEditMode) {
        // Update event using updateEvent from useEventStore
        await updateEvent(editingEvent.id, eventPayload);
        toast.dismiss(loadingToast);
        toast.success("Event updated successfully!");
        onEventUpdated();
      } else {
        // Create event
        await createEvent({
          ...eventPayload,
          tags: [],
          groupId: null,
          createdAt: new Date(),
        });
        toast.dismiss(loadingToast);
        toast.success("Event created successfully!");
        onEventCreated();
      }

      onClose();
      // Reset form only if creating a new event
      if (!isEditMode) {
        setNewEventData({
          title: "",
          type: "SERVICE",
          date: "",
          location: "",
          description: "",
          image: "",
          time: "",
          ministryId: ministryId || "",
          capacity: 0,
          latitude: null,
          longitude: null,
        });
        setSelectedImage(null);
        setImagePreview(null);
        setSearchQuery("");
        setMarkerPosition(null);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error(
        isEditMode ? "Update Event Error:" : "Create Event Error:",
        error
      );
      toast.error(
        isEditMode ? "Failed to update event" : "Failed to create event"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      toast.warning("Please enter a search query");
      return;
    }

    const loadingToast = toast.loading("Searching location...");

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json&limit=1`
      );
      const data = await res.json();

      if (data[0]) {
        const { lat, lon, display_name } = data[0];
        const parsedLat = parseFloat(lat);
        const parsedLon = parseFloat(lon);

        setNewEventData((prev) => ({
          ...prev,
          location: display_name,
          latitude: parsedLat,
          longitude: parsedLon,
        }));
        setMarkerPosition({ lat: parsedLat, lng: parsedLon });

        toast.dismiss(loadingToast);
        toast.success("Location found!");
      } else {
        toast.dismiss(loadingToast);
        toast.warning("No results found for the search query");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Search Error:", error);
      toast.error("Failed to search location");
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();

      if (data.display_name) {
        setNewEventData((prev) => ({
          ...prev,
          location: data.display_name,
          latitude: lat,
          longitude: lng,
        }));
        toast.success("Location selected");
      }
    } catch (error) {
      console.error("Reverse Geocode Error:", error);
      toast.error("Failed to get location details");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-2xl relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-event-heading"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full p-1 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-6">
              <div>
                <h2
                  id="create-event-heading"
                  className="text-2xl font-bold text-gray-900"
                >
                  {isEditMode ? "Edit Event" : "Create New Event"}
                </h2>
                <p className="text-gray-500 mt-1">
                  {isEditMode
                    ? "Edit the details of this event."
                    : "Fill out the form below to create a new church event."}
                </p>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Title */}
                  <div className="space-y-1">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={newEventData.title}
                      onChange={(e) =>
                        setNewEventData({
                          ...newEventData,
                          title: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
                      required
                    />
                  </div>

                  {/* Event Type */}
                  <div className="space-y-1">
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Event Type *
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={newEventData.type}
                      onChange={(e) =>
                        setNewEventData({
                          ...newEventData,
                          type: e.target.value as EventType,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
                      required
                    >
                      <option value="SERVICE">Service</option>
                      <option value="MEETING">Meeting</option>
                      <option value="TRIP">Trip</option>
                      <option value="APPOINTMENT">Appointment</option>
                      <option value="CLASS">Class</option>
                      <option value="EVENT">Event</option>
                    </select>
                  </div>

                  {/* Date */}
                  <div className="space-y-1">
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date *
                    </label>
                    <div className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors">
                      <DayPicker
                        mode="single"
                        selected={
                          newEventData.date
                            ? new Date(newEventData.date)
                            : undefined
                        }
                        onSelect={(date) => {
                          if (date) {
                            setNewEventData({
                              ...newEventData,
                              date: format(date, "yyyy-MM-dd"),
                            });
                          } else {
                            setNewEventData({
                              ...newEventData,
                              date: "",
                            });
                          }
                        }}
                        disabled={localDisabledDates}
                        className="w-full"
                        styles={{
                          caption: {
                            display: "flex",
                            justifyContent: "space-between",
                          },
                          head_row: {
                            display: "flex",
                            justifyContent: "space-around",
                          },
                          row: {
                            display: "flex",
                            justifyContent: "space-around",
                          },
                          cell: { flex: "1", textAlign: "center" },
                          day_selected: {
                            backgroundColor: "var(--blue-600)",
                            color: "white",
                          },
                          day_today: { fontWeight: "bold" },
                          day_disabled: {
                            color: "var(--gray-400)",
                            cursor: "not-allowed",
                          },
                        }}
                      />
                    </div>
                    {newEventData.date && (
                      <p className="text-sm text-gray-600 mt-2">
                        Selected Date:{" "}
                        {format(new Date(newEventData.date), "PPP")}
                      </p>
                    )}
                  </div>

                  {/* Time */}
                  <div className="space-y-1">
                    <label
                      htmlFor="time"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Time *
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={newEventData.time}
                      onChange={(e) =>
                        setNewEventData({
                          ...newEventData,
                          time: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
                      required
                    />
                  </div>

                  {/* Capacity */}
                  <div className="space-y-1">
                    <label
                      htmlFor="capacity"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Capacity
                    </label>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      min="0"
                      value={newEventData.capacity}
                      onChange={(e) =>
                        setNewEventData({
                          ...newEventData,
                          capacity: parseInt(e.target.value) || 0,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
                    />
                  </div>

                  {/* Ministry ID */}
                  {!ministryId && (
                    <div className="space-y-1">
                      <label
                        htmlFor="ministryId"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Ministry
                      </label>
                      <select
                        required
                        id="ministryId"
                        name="ministryId"
                        value={newEventData.ministryId}
                        onChange={(e) =>
                          setNewEventData({
                            ...newEventData,
                            ministryId: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
                      >
                        <option value="">Select a Ministry</option>
                        {ministries.map((ministry) => (
                          <option key={ministry.id} value={ministry.id}>
                            {ministry.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Location Picker */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Location *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for a place..."
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors pr-10"
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button
                      type="button"
                      onClick={handleSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 focus:outline-none"
                      aria-label="Search location"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-2 h-64 rounded-lg overflow-hidden border border-gray-200">
                    <MapContainer
                      center={markerPosition || [51.505, -0.09]}
                      zoom={markerPosition ? 15 : 13}
                      style={{ height: "100%", width: "100%" }}
                      className="z-0"
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <LocationMarker
                        markerPosition={markerPosition}
                        setMarkerPosition={setMarkerPosition}
                        reverseGeocode={reverseGeocode}
                      />
                    </MapContainer>
                  </div>

                  {newEventData.location && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                        <MapPin className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                        <span className="truncate">
                          {newEventData.location}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="font-medium">Latitude:</span>{" "}
                          {newEventData.latitude?.toFixed(6)}
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="font-medium">Longitude:</span>{" "}
                          {newEventData.longitude?.toFixed(6)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newEventData.description}
                    onChange={(e) =>
                      setNewEventData({
                        ...newEventData,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
                    placeholder="Enter event description..."
                  ></textarea>
                </div>

                {/* Image Upload */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Event Image
                  </label>

                  <div className="mt-1 flex flex-col sm:flex-row gap-4">
                    {/* File Input */}
                    <div className="flex-1">
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="image-upload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF (MAX. 5MB)
                            </p>
                          </div>
                          <input
                            id="image-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                  toast.error("File size exceeds 5MB limit");
                                  return;
                                }
                                setSelectedImage(file);
                              }
                            }}
                            ref={fileInputRef}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Image Preview */}
                    <div className="flex-1">
                      {imagePreview ? (
                        <div className="relative h-32 w-full rounded-lg overflow-hidden border border-gray-200">
                          <Image
                            src={imagePreview}
                            alt="Preview of selected image"
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedImage(null);
                              setNewEventData((prev) => ({
                                ...prev,
                                image: "",
                              })); // Clear image URL if it was from eventToEdit
                              setImagePreview(null);
                              if (fileInputRef.current)
                                fileInputRef.current.value = "";
                            }}
                            className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow-sm hover:bg-white transition-colors"
                            aria-label="Remove image"
                          >
                            <X className="h-4 w-4 text-gray-700" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-32 w-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 text-gray-400">
                          No image selected
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        {isEditMode ? "Updating..." : "Creating..."}
                      </span>
                    ) : isEditMode ? (
                      "Update Event"
                    ) : (
                      "Create Event"
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LocationMarker({
  markerPosition,
  setMarkerPosition,
  reverseGeocode,
}: {
  markerPosition: { lat: number; lng: number } | null;
  setMarkerPosition: (pos: { lat: number; lng: number } | null) => void;
  reverseGeocode: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  useMapEvents({
    click(e) {
      setMarkerPosition(e.latlng);
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    if (markerPosition) {
      map.setView(markerPosition, 15);
    }
  }, [markerPosition, map]);

  return markerPosition ? (
    <Marker position={markerPosition}>
      <Popup>Selected location</Popup>
    </Marker>
  ) : null;
}
