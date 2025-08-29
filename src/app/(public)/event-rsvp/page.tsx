"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { safeFetch } from "@/lib/api";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  Loader,
  MapPin,
  Ticket,
  UserCheck,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  type: string;
}

interface Participant {
  id: string;
  eventId: string;
  userId: string;
  status: string;
  user?: { name: string };
}

const EventRsvpPage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [rsvps, setRsvps] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInitialData = useCallback(async () => {
    try {
      const eventsData = await safeFetch<Event[]>("/api/events");
      setEvents(eventsData);
      if (session?.user?.id) {
        const rsvpData = await safeFetch<Participant[]>(
          `/api/event-rsvp?userId=${session.user.id}`
        );
        setRsvps(rsvpData);
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (sessionStatus !== "loading") {
      fetchInitialData();
    }
  }, [sessionStatus, fetchInitialData]);

  const handleRsvp = async (eventId: string) => {
    if (!session?.user?.id) {
      toast.error("Please log in to RSVP.");
      return;
    }
    const toastId = toast.loading("Processing RSVP...");
    try {
      await safeFetch("/api/event-rsvp", {
        method: "POST",
        body: JSON.stringify({
          eventId,
          userId: session.user.id,
          status: "Registered",
        }),
      });
      toast.success("RSVP successful!", { id: toastId });
      fetchInitialData();
    } catch (err) {
      if (err instanceof Error) toast.error(err.message, { id: toastId });
    }
  };

  const isUserRegistered = (eventId: string) =>
    rsvps.some((p) => p.eventId === eventId);

  if (loading || sessionStatus === "loading") return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8 sm:mb-12">
          Upcoming Events
        </h2>
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {events.map((event, i) => (
              <EventCard
                key={event.id}
                event={event}
                isRegistered={isUserRegistered(event.id)}
                onRsvp={handleRsvp}
                index={i}
              />
            ))}
          </div>
        ) : (
          <NoEventsFound />
        )}
        {session?.user?.roles?.includes("Events Manager") && (
          <EventManagerSection allEvents={events} />
        )}
      </main>
      <Toaster richColors />
    </div>
  );
};

const Header = () => (
  <motion.header
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white text-center py-16 md:py-24 relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-pattern opacity-10"></div>
    <div className="container mx-auto px-4 relative">
      <Ticket className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-blue-200 mb-3 sm:mb-4" />
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight">
        Event RSVP & Check-in
      </h1>
      <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
        Join our community gatherings. View upcoming events and secure your
        spot.
      </p>
    </div>
  </motion.header>
);

const EventCard = ({ event, isRegistered, onRsvp, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="h-full"
  >
    <Card className="h-full flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200/80">
      <CardHeader className="p-4 sm:p-6 pb-0">
        <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">
          {event.title}
        </CardTitle>
        <Badge
          variant={event.type === "SERVICE" ? "default" : "secondary"}
          className="text-xs sm:text-sm"
        >
          {event.type}
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 space-y-2 sm:space-y-3 text-sm text-gray-600 p-4 sm:p-6">
        <InfoRow
          icon={Calendar}
          text={new Date(event.date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        />
        {event.location && <InfoRow icon={MapPin} text={event.location} />}
      </CardContent>
      <CardFooter className="p-4 sm:p-6 pt-0">
        <Button
          onClick={() => onRsvp(event.id)}
          disabled={isRegistered}
          className="w-full text-sm sm:text-base py-2.5 sm:py-3"
        >
          {isRegistered ? (
            <>
              <UserCheck size={14} className="mr-1.5" /> Registered
            </>
          ) : (
            "RSVP Now"
          )}
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
);

const InfoRow = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2">
    <Icon className="h-4 w-4 text-gray-400" />
    <span>{text}</span>
  </div>
);

const EventManagerSection = ({ allEvents }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);

  const handleEventChange = async (eventId: string) => {
    if (!eventId) {
      setSelectedEvent(null);
      setParticipants([]);
      return;
    }
    setLoading(true);
    const event = allEvents.find((e) => e.id === eventId) || null;
    setSelectedEvent(event);
    try {
      const data = await safeFetch<Participant[]>(
        `/api/event-rsvp?eventId=${eventId}`
      );
      setParticipants(data);
    } catch (error) {
      toast.error("Failed to fetch participants.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckinChange = async (
    participantId: string,
    newStatus: string
  ) => {
    try {
      await safeFetch(`/api/event-rsvp?id=${participantId}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === participantId ? { ...p, status: newStatus } : p
        )
      );
      toast.success("Check-in status updated.");
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-8 sm:mt-16"
    >
      <Card className="bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-200/80">
        <CardHeader className="p-0 mb-4 sm:mb-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">
            Event Check-in
          </CardTitle>
          <p className="text-sm sm:text-base text-gray-600">
            For Events Manager use only.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <Select onValueChange={handleEventChange}>
            <SelectTrigger className="h-10 sm:h-12 text-sm sm:text-base">
              <SelectValue placeholder="Select an event to manage check-ins" />
            </SelectTrigger>
            <SelectContent>
              {allEvents.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {loading && (
            <div className="text-center py-6 sm:py-8">
              <Loader className="animate-spin mx-auto h-8 w-8 sm:h-10 sm:w-10" />
            </div>
          )}

          {selectedEvent && !loading && (
            <div className="mt-4 sm:mt-6">
              <h3 className="font-bold mb-3 sm:mb-4 text-base sm:text-lg">
                Participants for {selectedEvent.title}
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {participants.length > 0 ? (
                  participants.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium text-sm sm:text-base">
                        {p.user?.name || `User ID: ${p.userId}`}
                      </span>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <label
                          htmlFor={`checkin-${p.id}`}
                          className="text-xs sm:text-sm"
                        >
                          Attended
                        </label>
                        <Checkbox
                          id={`checkin-${p.id}`}
                          checked={p.status === "Attended"}
                          onCheckedChange={(checked) =>
                            handleCheckinChange(
                              p.id,
                              checked ? "Attended" : "Registered"
                            )
                          }
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-3 sm:py-4 text-sm">
                    No registered participants for this event.
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
    <Loader className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-blue-600" />
  </div>
);
const ErrorState = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-red-50 p-4 sm:p-6">
    <Card className="p-6 sm:p-8 text-center max-w-sm sm:max-w-md">
      <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-red-500 mb-3 sm:mb-4" />
      <h2 className="text-lg sm:text-xl font-bold">Error</h2>
      <p className="my-3 sm:my-4 text-sm sm:text-base">{message}</p>
      <Button
        onClick={() => window.location.reload()}
        variant="destructive"
        className="text-sm sm:text-base py-2.5 sm:py-3"
      >
        Try Again
      </Button>
    </Card>
  </div>
);
const NoEventsFound = () => (
  <div className="text-center py-16 sm:py-24">
    <Calendar className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
    <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold">
      No Upcoming Events
    </h3>
    <p className="mt-1 sm:mt-2 text-sm text-gray-600">
      Please check back later for new events.
    </p>
  </div>
);

export default EventRsvpPage;
