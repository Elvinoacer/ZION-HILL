'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Edit, User, Calendar as CalendarIcon, Users, PlusCircle, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CreateEventModal from '@/components/CreateEventModal';
import Link from 'next/link';
import AddMemberModal from '@/components/AddMemberModal';
import { motion } from 'framer-motion';

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

  const fetchMinistryDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/ministry?id=${id}`);
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
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-16 w-16 animate-spin text-blue-600" /></div>;
  }

  if (error || !ministry) {
    return <div className="text-center py-10 text-red-500">Error: {error || 'Ministry not found.'}</div>;
  }

  const handleEditEventClick = (event: Event) => {
    setEventToEdit(event);
    setIsCreateEventModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Button variant="outline" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Ministries
          </Button>

          <header className="relative rounded-2xl overflow-hidden mb-8 border border-gray-200/80 shadow-lg">
            <Image
              src={ministry.photo || '/images/hero.png'}
              alt={ministry.name}
              width={1200}
              height={400}
              className="w-full h-48 md:h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
            <div className="absolute bottom-0 left-0 p-6">
              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{ministry.name}</h1>
              <p className="text-lg text-gray-200 mt-2 max-w-3xl">{ministry.description}</p>
            </div>
          </header>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div className="lg:col-span-1 space-y-8" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <InfoCard ministry={ministry} />
          </motion.div>

          <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Tabs defaultValue="members" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100/80 rounded-lg">
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>
              <TabsContent value="members">
                <MembersSection 
                  members={ministry.members} 
                  onAddMember={() => setIsAddMemberModalOpen(true)} 
                />
              </TabsContent>
              <TabsContent value="events">
                <EventsSection 
                  events={ministry.events} 
                  onCreateEvent={() => {
                    setEventToEdit(undefined);
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
        eventToEdit={eventToEdit}
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
  <Card className="shadow-xl border-gray-200/80 rounded-2xl">
    <CardHeader><CardTitle>Ministry Details</CardTitle></CardHeader>
    <CardContent className="space-y-4">
      <InfoRow icon={User} label="Leader" value={ministry.leader.name} />
      <InfoRow icon={Users} label="Members" value={`${ministry.members.length} members`} />
      <InfoRow icon={CalendarIcon} label="Events" value={`${ministry.events.length} upcoming`} />
      <Button variant="outline" className="w-full mt-4"><Edit className="mr-2 h-4 w-4" /> Edit Details</Button>
    </CardContent>
  </Card>
);

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center text-md">
    <Icon className="h-5 w-5 mr-3 text-gray-500" />
    <span className="font-semibold text-gray-700">{label}:</span>
    <span className="ml-2 text-gray-900">{value}</span>
  </div>
);

// MembersSection Component
const MembersSection = ({ members, onAddMember }) => (
  <Card className="shadow-xl border-gray-200/80 rounded-2xl">
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Ministry Members</CardTitle>
      <Button size="sm" onClick={onAddMember}><PlusCircle className="mr-2 h-4 w-4" /> Add Member</Button>
    </CardHeader>
    <CardContent>
      {/* Responsive Layout */}
      <div className="md:hidden space-y-4">
        {members.map(member => <MemberCard key={member.user.id} member={member} />)}
      </div>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map(member => <MemberRow key={member.user.id} member={member} />)}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
);

const MemberCard = ({ member }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
            <Image src={member.user.image || '/images/default-avatar.png'} alt={member.user.name || 'user'} width={40} height={40} className="rounded-full" />
            <div>
                <p className="font-semibold">{member.user.name}</p>
                <p className="text-sm text-gray-600">{member.user.email}</p>
            </div>
        </div>
        <Link href={`/members/${member.user.id}`}><Button variant="outline" size="sm">View</Button></Link>
    </div>
);

const MemberRow = ({ member }) => (
    <TableRow>
        <TableCell className="font-medium flex items-center">
            <Image src={member.user.image || '/images/default-avatar.png'} alt={member.user.name || 'user'} width={32} height={32} className="rounded-full mr-3" />
            {member.user.name}
        </TableCell>
        <TableCell>{member.user.email}</TableCell>
        <TableCell className="text-right">
            <Link href={`/members/${member.user.id}`}><Button variant="outline" size="sm">View</Button></Link>
        </TableCell>
    </TableRow>
);

// EventsSection Component
const EventsSection = ({ events, onCreateEvent, onEditEvent }) => {
  const router = useRouter();
  return (
    <Card className="shadow-xl border-gray-200/80 rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Events</CardTitle>
        <Button size="sm" onClick={onCreateEvent}><PlusCircle className="mr-2 h-4 w-4" /> Create Event</Button>
      </CardHeader>
      <CardContent>
        <div className="md:hidden space-y-4">
            {events.map(event => <EventCard key={event.id} event={event} onEdit={onEditEvent} onView={() => router.push(`/events/${event.id}`)} />)}
        </div>
        <div className="hidden md:block">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {events.map(event => <EventRow key={event.id} event={event} onEdit={onEditEvent} onView={() => router.push(`/events/${event.id}`)} />)}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
};

const EventCard = ({ event, onEdit, onView }) => (
    <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold">{event.title}</h3>
        <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()} - {event.location}</p>
        <div className="mt-3 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onView}>View</Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(event)}>Edit</Button>
        </div>
    </div>
);

const EventRow = ({ event, onEdit, onView }) => (
    <TableRow>
        <TableCell className="font-medium">{event.title}</TableCell>
        <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
        <TableCell>{event.location}</TableCell>
        <TableCell className="text-right space-x-2">
            <Button variant="outline" size="sm" onClick={onView}>View</Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(event)}>Edit</Button>
        </TableCell>
    </TableRow>
);

export default MinistryDetailPage;
