"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { safeFetch } from "@/lib/api";
import { formatInTimeZone } from "date-fns-tz"; // New import
import { AnimatePresence, motion } from "framer-motion"; // Added framer-motion import
import "leaflet/dist/leaflet.css";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

// Fix for default marker icon issue with Leaflet
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Dynamic imports for Leaflet components
const DynamicMapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const DynamicTileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const DynamicMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const DynamicPopup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface Event {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  type: string;
  date: string;
  location?: string;
  latitude?: number;
  time: string;
  longitude?: number;
}

interface Participant {
  id: string;
  eventId: string;
  userId: string;
  status: string;
}

const EventDetailPage = () => {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRsvpd, setIsRsvpd] = useState(false);
  const [messageToAdmin, setMessageToAdmin] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  console.log(event);
  const fetchEvent = async () => {
    try {
      const data = await safeFetch<Event>(`/api/events?id=${id}`);
      setEvent(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkRsvpStatus = async () => {
    if (!session?.user?.id || !id) return;
    try {
      const data = await safeFetch<{ rsvpd: boolean }>(
        `/api/events/rsvp?eventId=${id}&userId=${session.user.id}`
      );
      setIsRsvpd(data.rsvpd);
    } catch (err) {
      setIsRsvpd(false);
      console.error("Failed to check RSVP status:", err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  useEffect(() => {
    if (status === "authenticated" && id) {
      checkRsvpStatus();
    }
  }, [status, id]);

  const handleRsvp = async () => {
    if (status !== "authenticated") {
      toast.error("Please log in to RSVP.");
      return;
    }
    if (!event) return;

    try {
      await safeFetch("/api/events/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          userId: session.user.id,
        }),
      });
      setIsRsvpd(true);
      toast.success("RSVP successful!");
    } catch (err: any) {
      toast.error(`Failed to RSVP: ${err.message}`);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "authenticated") {
      toast.error("Please log in to send a message.");
      return;
    }
    if (!event || !messageToAdmin.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }

    setIsSendingMessage(true);
    try {
      await safeFetch("/api/messages/send-to-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          userId: session?.user?.id,
          message: messageToAdmin,
          subject: `Message about event: ${event.title}`,
        }),
      });
      setMessageToAdmin("");
      toast.success("Message sent to admin!");
    } catch (err: any) {
      toast.error(`Failed to send message: ${err.message}`);
    } finally {
      setIsSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center min-h-screen flex items-center justify-center"
      >
        <p className="text-lg text-gray-600">Loading event details...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center min-h-screen flex items-center justify-center"
      >
        <p className="text-lg text-red-500">Error: {error}</p>
      </motion.div>
    );
  }

  if (!event) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center min-h-screen flex items-center justify-center"
      >
        <p className="text-lg text-gray-600">Event not found.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="container mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8"
    >
      <Card className="shadow-xl overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50">
        {" "}
        {/* Added gradient background to card */}
        <div className="relative h-56 sm:h-64 md:h-80 lg:h-96 w-full">
          <Image
            src={event.imageUrl || "/images/youth-camp.png"}
            alt={`Cover image for ${event.title}`}
            fill
            className="object-cover brightness-75 rounded-t-2xl" // Slightly darkened for better text contrast
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent" // Enhanced gradient for better readability
          >
            <CardTitle className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 drop-shadow-lg">
              {event.title}
            </CardTitle>
            <CardDescription className="text-gray-200 text-sm sm:text-base md:text-lg drop-shadow-md">
              {event.type} •{" "}
              {(() => {
                const eventDateTime = new Date(event.date);
                if (event.time) {
                  const [hours, minutes] = event.time.split(":").map(Number);
                  eventDateTime.setUTCHours(hours, minutes, 0, 0);
                }
                return formatInTimeZone(
                  eventDateTime,
                  "UTC",
                  "MMMM d, yyyy h:mm a"
                );
              })()}
            </CardDescription>
          </motion.div>
        </div>
        <CardContent className="p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {" "}
            {/* Changed to lg:grid-cols-2 for better responsiveness */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6 sm:space-y-8"
            >
              <section aria-labelledby="event-details-heading">
                <h2
                  id="event-details-heading"
                  className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4"
                >
                  Event Details
                </h2>
                <div className="space-y-3 sm:space-y-4 bg-gray-100 p-4 sm:p-5 rounded-lg shadow-inner">
                  {" "}
                  {/* Added subtle gradient-like background for details section */}
                  <p className="text-gray-700 text-sm sm:text-base">
                    <strong className="font-medium">Date:</strong>{" "}
                    {(() => {
                      const eventDateTime = new Date(event.date);
                      if (event.time) {
                        const [hours, minutes] = event.time
                          .split(":")
                          .map(Number);
                        eventDateTime.setUTCHours(hours, minutes, 0, 0);
                      }
                      return formatInTimeZone(
                        eventDateTime,
                        "UTC",
                        "EEEE, MMMM d, yyyy 'at' h:mm a"
                      );
                    })()}
                  </p>
                  {event.location && (
                    <p className="text-gray-700 text-sm sm:text-base">
                      <strong className="font-medium">Location:</strong>{" "}
                      {event.location}
                    </p>
                  )}
                  <p className="text-gray-700 text-sm sm:text-base">
                    <strong className="font-medium">Type:</strong> {event.type}
                  </p>
                  {event.description && (
                    <div className="prose prose-sm sm:prose-base max-w-none text-gray-600">
                      <p>{event.description}</p>
                    </div>
                  )}
                </div>
              </section>

              <section aria-labelledby="participate-heading">
                <h3
                  id="participate-heading"
                  className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4"
                >
                  Participate
                </h3>
                <AnimatePresence mode="wait">
                  {status === "authenticated" ? (
                    isRsvpd ? (
                      <motion.button
                        key="rsvpd"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        disabled
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 cursor-not-allowed text-sm sm:text-base"
                        aria-label="You're already registered for this event"
                      >
                        RSVP'd (You're Registered!)
                      </motion.button>
                    ) : (
                      <motion.button
                        key="rsvp"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={handleRsvp}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 text-sm sm:text-base"
                        aria-label="RSVP for this event"
                      >
                        RSVP Now
                      </motion.button>
                    )
                  ) : (
                    <p className="text-red-600 text-xs sm:text-sm">
                      Please log in to RSVP for this event.
                    </p>
                  )}
                </AnimatePresence>
              </section>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6 sm:space-y-8"
            >
              {event.latitude && event.longitude ? (
                <section aria-labelledby="map-heading">
                  <h3
                    id="map-heading"
                    className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4"
                  >
                    Event Location
                  </h3>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="h-56 sm:h-64 w-full rounded-lg overflow-hidden shadow-md border border-gray-200"
                  >
                    <DynamicMapContainer
                      center={[event.latitude, event.longitude]}
                      zoom={13}
                      scrollWheelZoom={true} // Enabled scroll zoom for better UX
                      style={{ height: "100%", width: "100%" }}
                      aria-label="Map showing event location"
                    >
                      <DynamicTileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <DynamicMarker
                        position={[event.latitude, event.longitude]}
                      >
                        <DynamicPopup>{event.title}</DynamicPopup>
                      </DynamicMarker>
                    </DynamicMapContainer>
                  </motion.div>
                </section>
              ) : (
                event.location && (
                  <p className="text-gray-600 text-sm sm:text-base">
                    Map not available for this location.
                  </p>
                )
              )}

              <section aria-labelledby="contact-admin-heading">
                <h3
                  id="contact-admin-heading"
                  className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4"
                >
                  Contact Event Organizer
                </h3>
                <form onSubmit={handleSendMessage} className="space-y-3 sm:space-y-4">
                  <div>
                    <label htmlFor="message" className="sr-only">
                      Message to admin
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Type your message here..."
                      value={messageToAdmin}
                      onChange={(e) => setMessageToAdmin(e.target.value)}
                      rows={4} // Adjusted rows for better mobile view
                      required
                      aria-required="true"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base"
                      disabled={status !== "authenticated"}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isSendingMessage || status !== "authenticated"}
                    aria-disabled={
                      isSendingMessage || status !== "authenticated"
                    }
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {isSendingMessage ? "Sending..." : "Send Message"}
                  </motion.button>
                  {status !== "authenticated" && (
                    <p className="text-red-600 text-xs sm:text-sm">
                      Please log in to send a message.
                    </p>
                  )}
                </form>
              </section>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EventDetailPage;
