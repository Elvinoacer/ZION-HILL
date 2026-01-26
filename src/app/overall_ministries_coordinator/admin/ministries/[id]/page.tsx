"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Edit,
  User,
  Calendar as CalendarIcon,
  Users,
  PlusCircle,
  ArrowLeft,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateEventModal from "@/components/CreateEventModal";
import Link from "next/link";
import AddMemberModal from "@/components/AddMemberModal";
import { motion } from "framer-motion";

// Interfaces
interface UserProfile {
  id: string;
  name: string | null;
  image: string | null;
  email: string | null;
}

interface MinistryMember {
  user: UserProfile;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string | null;
}

interface Ministry {
  id: string;
  name: string;
  description?: string;
  leader: UserProfile;
  photo?: string;
  members: MinistryMember[];
  events: Event[];
}

// Main Component
const MinistryDetailPage = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [ministry, setMinistry] = useState<Ministry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("members");

  const fetchMinistryDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/ministries?id=${id}`);
      if (!res.ok) throw new Error("Failed to fetch ministry details");
      const data = await res.json();
      setMinistry(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchMinistryDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-blue-800 font-medium">
            Loading ministry details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !ministry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <Card className="w-full max-w-md mx-4 border-red-200 bg-white shadow-lg">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Ministry
            </h3>
            <p className="text-red-500 mb-4">
              {error || "Ministry not found."}
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleEditEventClick = (event: Event) => {
    setEventToEdit(event);
    setIsCreateEventModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-6 border-blue-200 bg-white/80 hover:bg-white text-blue-700 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Ministries
          </Button>

          <header className="relative rounded-2xl overflow-hidden mb-8 border border-white shadow-xl">
            <div className="relative h-48 md:h-64 lg:h-80 w-full overflow-hidden">
              <Image
                src={ministry.photo || "/images/hero.png"}
                alt={ministry.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <motion.h1
                  className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {ministry.name}
                </motion.h1>
                <motion.p
                  className="text-lg text-gray-100 max-w-3xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {ministry.description}
                </motion.p>
              </div>
            </div>
          </header>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            className="lg:col-span-1 space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <InfoCard ministry={ministry} />
          </motion.div>

          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Tabs
              defaultValue="members"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-white rounded-lg p-1 shadow-sm border border-blue-100">
                <TabsTrigger
                  value="members"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300 rounded-md"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Members
                </TabsTrigger>
                <TabsTrigger
                  value="events"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300 rounded-md"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Events
                </TabsTrigger>
              </TabsList>
              <TabsContent value="members" className="mt-6">
                <MembersSection
                  members={ministry.members}
                  onAddMember={() => setIsAddMemberModalOpen(true)}
                />
              </TabsContent>
              <TabsContent value="events" className="mt-6">
                <EventsSection
                  events={ministry.events}
                  onCreateEvent={() => {
                    setEventToEdit(null);
                    setIsCreateEventModalOpen(true);
                  }}
                  onEditEvent={handleEditEventClick}
                />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      <CreateEventModal
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
        ministryId={ministry?.id}
        onEventCreated={fetchMinistryDetails}
        onEventUpdated={fetchMinistryDetails}
        editingEvent={eventToEdit as any}
      />

      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        ministryId={id}
        onMemberAdded={fetchMinistryDetails}
      />
    </div>
  );
};

// InfoCard Component
const InfoCard = ({ ministry }: { ministry: Ministry }) => (
  <Card className="shadow-xl border-blue-100/50 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
    <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4">
      <CardTitle className="text-xl flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
            clipRule="evenodd"
          />
        </svg>
        Ministry Details
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 space-y-4">
      <InfoRow icon={User} label="Leader" value={ministry.leader.name} />
      <InfoRow
        icon={Users}
        label="Members"
        value={`${ministry.members.length} members`}
      />
      <InfoRow
        icon={CalendarIcon}
        label="Events"
        value={`${ministry.events.length} upcoming`}
      />
    </CardContent>
  </Card>
);

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center text-md p-3 rounded-lg bg-blue-50/50">
    <Icon className="h-5 w-5 mr-3 text-blue-600" />
    <span className="font-semibold text-blue-800">{label}:</span>
    <span className="ml-2 text-gray-900">{value}</span>
  </div>
);

// MembersSection Component
const MembersSection = ({ members, onAddMember }) => (
  <Card className="shadow-xl border-blue-100/50 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
    <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4">
      <div className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Ministry Members
        </CardTitle>
        <Button
          size="sm"
          onClick={onAddMember}
          className="bg-white text-blue-700 hover:bg-blue-50 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Member
        </Button>
      </div>
    </CardHeader>
    <CardContent className="p-6">
      {members.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500">No members yet</h3>
          <p className="text-gray-400 mb-4">Add members to get started</p>
          <Button
            onClick={onAddMember}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add First Member
          </Button>
        </div>
      ) : (
        <>
          {/* Responsive Layout */}
          <div className="md:hidden space-y-4">
            {members.map((member, index) => (
              <motion.div
                key={member.user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MemberCard member={member} />
              </motion.div>
            ))}
          </div>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-blue-800 font-semibold">
                    Name
                  </TableHead>
                  <TableHead className="text-blue-800 font-semibold">
                    Email
                  </TableHead>
                  <TableHead className="text-right text-blue-800 font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member, index) => (
                  <motion.tr
                    key={member.user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-blue-100/50"
                  >
                    <MemberRow member={member} />
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </CardContent>
  </Card>
);

const MemberCard = ({ member }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center gap-3">
      <div className="relative">
        <Image
          src={member.user.image || "/images/default-avatar.png"}
          alt={member.user.name || "user"}
          width={48}
          height={48}
          className="rounded-full border-2 border-white shadow-sm"
        />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
      </div>
      <div>
        <p className="font-semibold text-gray-900">{member.user.name}</p>
        <p className="text-sm text-gray-600">{member.user.email}</p>
      </div>
    </div>
    <Link href={`/member/members/${member.user.id}`}>
      <Button
        variant="outline"
        size="sm"
        className="border-blue-200 text-blue-700 hover:bg-blue-50"
      >
        View
      </Button>
    </Link>
  </div>
);

const MemberRow = ({ member }) => (
  <>
    <TableCell className="font-medium flex items-center py-4">
      <Image
        src={member.user.image || "/images/default-avatar.png"}
        alt={member.user.name || "user"}
        width={40}
        height={40}
        className="rounded-full mr-3 border-2 border-white shadow-sm"
      />
      {member.user.name}
    </TableCell>
    <TableCell className="text-gray-600">{member.user.email}</TableCell>
    <TableCell className="text-right">
      <Link href={`/member/members/${member.user.id}`}>
        <Button
          variant="outline"
          size="sm"
          className="border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          View
        </Button>
      </Link>
    </TableCell>
  </>
);

// EventsSection Component
const EventsSection = ({ events, onCreateEvent, onEditEvent }) => {
  const router = useRouter();

  return (
    <Card className="shadow-xl border-blue-100/50 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Upcoming Events
          </CardTitle>
          <Button
            size="sm"
            onClick={onCreateEvent}
            className="bg-white text-blue-700 hover:bg-blue-50 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Create Event
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {events.length === 0 ? (
          <div className="text-center py-8">
            <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500">
              No events scheduled
            </h3>
            <p className="text-gray-400 mb-4">Create an event to get started</p>
            <Button
              onClick={onCreateEvent}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Create First Event
            </Button>
          </div>
        ) : (
          <>
            <div className="md:hidden space-y-4">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <EventCard
                    key={event.id}
                    event={event}
                    onEdit={onEditEvent}
                    onView={() => router.push(`/events/${event.id}`)}
                  />
                </motion.div>
              ))}
            </div>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-blue-800 font-semibold">
                      Title
                    </TableHead>
                    <TableHead className="text-blue-800 font-semibold">
                      Date
                    </TableHead>
                    <TableHead className="text-blue-800 font-semibold">
                      Location
                    </TableHead>
                    <TableHead className="text-right text-blue-800 font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event, index) => (
                    <motion.tr
                      key={event.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-blue-100/50 hover:bg-blue-50/30 transition-colors duration-200"
                    >
                      <EventRow
                        key={event.id}
                        event={event}
                        onEdit={onEditEvent}
                        onView={() => router.push(`/events/${event.id}`)}
                      />
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const EventCard = ({ event, onEdit, onView }) => (
  <div className="p-4 bg-white rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300">
    <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
    <div className="flex items-center text-sm text-gray-600 mb-1">
      <CalendarIcon className="h-4 w-4 mr-2 text-blue-600" />
      {new Date(event.date).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </div>
    <div className="flex items-center text-sm text-gray-600 mb-3">
      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
      {event.location || "No location specified"}
    </div>
    <div className="mt-3 flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onView}
        className="border-blue-200 text-blue-700 hover:bg-blue-50"
      >
        View
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(event)}
        className="border-blue-200 text-blue-700 hover:bg-blue-50"
      >
        Edit
      </Button>
    </div>
  </div>
);

const EventRow = ({ event, onEdit, onView }) => (
  <>
    <TableCell className="font-medium py-4">{event.title}</TableCell>
    <TableCell>
      {new Date(event.date).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </TableCell>
    <TableCell>
      <div className="flex items-center">
        <MapPin className="h-4 w-4 mr-1 text-blue-600" />
        {event.location || "No location specified"}
      </div>
    </TableCell>
    <TableCell className="text-right space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onView}
        className="border-blue-200 text-blue-700 hover:bg-blue-50"
      >
        View
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(event)}
        className="border-blue-200 text-blue-700 hover:bg-blue-50"
      >
        Edit
      </Button>
    </TableCell>
  </>
);

export default MinistryDetailPage;
