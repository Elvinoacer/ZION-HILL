"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Edit, User, Calendar as CalendarIcon, Users, PlusCircle } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CreateEventModal from "@/components/CreateEventModal";
import Link from "next/link";
import AddMemberModal from "@/components/AddMemberModal";

interface User {
  id: string;
  name: string | null;
  image: string | null;
  email: string | null;
}

interface MinistryMember {
  user: User;
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
  leader: User;
  photo?: string;
  members: MinistryMember[];
  events: Event[];
}

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
      if (!res.ok) {
        throw new Error("Failed to fetch ministry details");
      }
      const data = await res.json();
      setMinistry(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMinistryDetails();
    }
  }, [id]);

  const existingEventDates = ministry?.events.map((event) => new Date(event.date)) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!ministry) {
    return <p>Ministry not found.</p>;
  }

  const handleEditEventClick = (event: Event) => {
    setEventToEdit(event);
    setIsCreateEventModalOpen(true);
  };

  const handleCloseCreateEventModal = () => {
    setIsCreateEventModalOpen(false);
    setEventToEdit(undefined); // Clear eventToEdit when modal closes
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">{ministry.name}</h1>
          <p className="text-lg text-gray-600 mt-2">{ministry.description}</p>
        </div>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit Ministry
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Ministry Details</CardTitle>
            </CardHeader>
            <CardContent>
              {ministry.photo && (
                <div className="mb-4">
                  <Image
                    src={ministry.photo}
                    alt={ministry.name}
                    width={400}
                    height={200}
                    className="rounded-md object-cover"
                  />
                </div>
              )}
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-gray-500" />
                  <span>Leader: {ministry.leader.name}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-gray-500" />
                  <span>Members: {ministry.members.length}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
                  <span>Events: {ministry.events.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Tabs defaultValue="members">
            <TabsList>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
            <TabsContent value="members">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Members</CardTitle>
                  <Button size="sm" onClick={() => setIsAddMemberModalOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Member
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ministry.members.map((member) => (
                        <TableRow key={member.user.id}>
                          <TableCell className="font-medium flex items-center">
                            <Image
                              src={member.user.image || "/images/default-avatar.png"}
                              alt={member.user.name || "user"}
                              width={32}
                              height={32}
                              className="rounded-full mr-3"
                            />
                            {member.user.name}
                          </TableCell>
                          <TableCell>{member.user.email}</TableCell>
                          <TableCell className="text-right">
                            <Link href={`/members/${member.user.id}`}>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="events">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Events</CardTitle>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEventToEdit(undefined); // Ensure no event is pre-filled for new creation
                      setIsCreateEventModalOpen(true);
                    }}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Event
                  </Button>
                </CardHeader>
                <CardContent>
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
                      {ministry.events.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">{event.title}</TableCell>
                          <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                          <TableCell>{event.location}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                onClick={() =>
                                  router.push(`/events/${event.id}`)
                                }
                                variant="outline"
                                size="sm"
                              >
                                View
                              </Button>
                              <Button
                                onClick={() => handleEditEventClick(event)}
                                variant="outline"
                                size="sm"
                              >
                                Edit
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CreateEventModal
        isOpen={isCreateEventModalOpen}
        onClose={handleCloseCreateEventModal}
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

export default MinistryDetailPage;
