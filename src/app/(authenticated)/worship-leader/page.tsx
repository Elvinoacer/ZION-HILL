"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import WorshipTeamManagement from "@/components/worship-leader/WorshipTeamManagement";
import WorshipResourceManagement from "@/components/worship-leader/WorshipResourceManagement";
import AnnouncementBoard from "@/components/worship-leader/AnnouncementBoard";
import SongProposals from "@/components/worship-leader/SongProposals";
import ServiceDurationChart from "@/components/worship-leader/ServiceDurationChart";
import TeamParticipationChart from "@/components/worship-leader/TeamParticipationChart";
import TopSongsChart from "@/components/worship-leader/TopSongsChart";
import StreamManagement from "@/components/worship-leader/StreamManagement";
import SongArrangement from "@/components/worship-leader/SongArrangement";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface Service {
  id: string;
  title: string;
  date: string;
  location?: string;
  type: string;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
}

interface Participant {
  id: string;
  userId: string;
  status: string;
  user?: User;
}

const WorshipLeaderDashboard = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newServiceTitle, setNewServiceTitle] = useState("");
  const [newServiceDate, setNewServiceDate] = useState("");
  const [newServiceLocation, setNewServiceLocation] = useState("");
  const [newServiceType, setNewServiceType] = useState("SERVICE");

  const fetchServices = async () => {
    try {
      const servicesRes = await fetch("/api/services?type=SERVICE");
      if (!servicesRes.ok) throw new Error("Failed to fetch services");
      const servicesData = await servicesRes.json();
      setServices(servicesData);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchParticipants = async (eventId: string) => {
    try {
      const participantsRes = await fetch(
        `/api/participants?eventId=${eventId}`
      );
      if (!participantsRes.ok) throw new Error("Failed to fetch participants");
      const participantsData = await participantsRes.json();
      setParticipants(participantsData);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newServiceTitle,
          date: newServiceDate,
          location: newServiceLocation,
          type: newServiceType,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create service");
      }

      setShowServiceForm(false);
      fetchServices();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/services?id=${editingService.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newServiceTitle,
          date: newServiceDate,
          location: newServiceLocation,
          type: newServiceType,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update service");
      }

      setShowServiceForm(false);
      setEditingService(null);
      fetchServices();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    setLoading(false);
  }, []);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    fetchParticipants(service.id);
  };

  const handleAttendanceChange = async (
    participantId: string,
    newStatus: string
  ) => {
    try {
      const res = await fetch(`/api/participants?id=${participantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update attendance");
      }

      setParticipants((prev) =>
        prev.map((p) =>
          p.id === participantId ? { ...p, status: newStatus } : p
        )
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const serviceDurationData = [
    { name: "Jan", duration: 65 },
    { name: "Feb", duration: 70 },
    { name: "Mar", duration: 68 },
    { name: "Apr", duration: 72 },
  ];

  const teamParticipationData = [
    { name: "Vocalists", value: 400, color: "#0088FE" },
    { name: "Musicians", value: 300, color: "#00C49F" },
    { name: "AV Crew", value: 300, color: "#FFBB28" },
  ];

  const topSongsData = [
    { name: "Song A", times: 12 },
    { name: "Song B", times: 9 },
    { name: "Song C", times: 8 },
  ];

  const songs = [
    { id: "1", title: "Song A" },
    { id: "2", title: "Song B" },
    { id: "3", title: "Song C" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-6">
            <Skeleton className="h-12 w-64 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-lg text-red-500 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-2">
            Worship Leader Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage worship services, teams, and resources with ease
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Service Management Card */}
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="h-full bg-gradient-to-br from-white to-purple-50 border border-purple-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-purple-700">
                  Service Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => {
                    setNewServiceTitle("");
                    setNewServiceDate("");
                    setNewServiceLocation("");
                    setNewServiceType("SERVICE");
                    setEditingService(null);
                    setShowServiceForm(true);
                  }}
                  className="mb-4 w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  Add New Service
                </Button>

                <AnimatePresence>
                  {showServiceForm && (
                    <motion.form
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      onSubmit={
                        editingService ? handleUpdateService : handleAddService
                      }
                      className="space-y-4 mb-6 overflow-hidden"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          type="text"
                          id="title"
                          value={newServiceTitle}
                          onChange={(e) => setNewServiceTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                          type="datetime-local"
                          id="date"
                          value={newServiceDate}
                          onChange={(e) => setNewServiceDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          type="text"
                          id="location"
                          value={newServiceLocation}
                          onChange={(e) =>
                            setNewServiceLocation(e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select
                          value={newServiceType}
                          onValueChange={(value) => setNewServiceType(value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SERVICE">Service</SelectItem>
                            <SelectItem value="MEETING">Meeting</SelectItem>
                            <SelectItem value="TRIP">Trip</SelectItem>
                            <SelectItem value="APPOINTMENT">
                              Appointment
                            </SelectItem>
                            <SelectItem value="CLASS">Class</SelectItem>
                            <SelectItem value="EVENT">Event</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                        >
                          {editingService ? "Update Service" : "Create Service"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowServiceForm(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                  Existing Services
                </h3>
                {services.length > 0 ? (
                  <ul className="space-y-2">
                    {services.map((service) => (
                      <motion.li
                        key={service.id}
                        whileHover={{ scale: 1.01 }}
                        className="mb-2 flex items-center justify-between bg-white p-3 rounded-lg shadow-xs border border-gray-100 w-full"
                      >
                        <Button
                          variant="ghost"
                          onClick={() => handleServiceSelect(service)}
                          className="flex-grow text-left justify-start hover:bg-purple-50 truncate pr-2 min-w-0"
                        >
                          <div>
                            <strong className="text-gray-800">
                              {service.title}
                            </strong>
                            <p className="text-sm text-gray-500">
                              {new Date(service.date).toLocaleDateString()} •{" "}
                              {service.location || "No location"}
                            </p>
                          </div>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingService(service);
                            setNewServiceTitle(service.title);
                            setNewServiceDate(service.date.substring(0, 16));
                            setNewServiceLocation(service.location || "");
                            setNewServiceType(service.type);
                            setShowServiceForm(true);
                          }}
                          className="text-purple-600 border-purple-300 hover:bg-purple-50 flex-shrink-0 ml-2"
                        >
                          Edit
                        </Button>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No worship services found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Selected Service Attendance */}
          {selectedService && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="md:col-span-2"
            >
              <Card className="h-full bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-blue-700">
                    Attendance for{" "}
                    <span className="font-bold">{selectedService.title}</span>
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedService.date).toLocaleDateString()} •{" "}
                    {selectedService.location}
                  </p>
                </CardHeader>
                <CardContent>
                  {participants.length > 0 ? (
                    <div className="space-y-3">
                      {participants.map((participant) => (
                        <motion.div
                          key={participant.id}
                          whileHover={{ x: 5 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-white shadow-xs border border-gray-100"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white">
                              {participant.user?.name?.charAt(0) || "P"}
                            </div>
                            <span className="font-medium text-gray-700">
                              {participant.user?.name ||
                                `Participant ${participant.userId}`}
                            </span>
                          </div>
                          <Checkbox
                            checked={participant.status === "Attended"}
                            onCheckedChange={(checked) =>
                              handleAttendanceChange(
                                participant.id,
                                checked ? "Attended" : "Registered"
                              )
                            }
                            className="h-6 w-6 border-2 border-blue-300 data-[state=checked]:bg-blue-500"
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        No participants found for this service
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4 border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        Invite Team Members
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Team Members Card */}
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="h-full bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-indigo-700">Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <WorshipTeamManagement
                  selectedServiceId={selectedService?.id || null}
                  currentParticipants={participants.filter(
                    (p) => p.status === "Assigned"
                  )}
                  fetchParticipants={
                    selectedService
                      ? () => fetchParticipants(selectedService.id)
                      : () => {}
                  }
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Resources Card */}
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="h-full bg-gradient-to-br from-white to-teal-50 border border-teal-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-teal-700">Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <WorshipResourceManagement
                  selectedServiceId={selectedService?.id || null}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Announcements Card */}
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="h-full bg-gradient-to-br from-white to-amber-50 border border-amber-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-amber-700">
                  Team Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnnouncementBoard />
              </CardContent>
            </Card>
          </motion.div>

          {/* Song Proposals Card */}
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="h-full bg-gradient-to-br from-white to-pink-50 border border-pink-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-pink-700">Song Proposals</CardTitle>
              </CardHeader>
              <CardContent>
                <SongProposals />
              </CardContent>
            </Card>
          </motion.div>

          {/* Analytics Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-700">
                  Worship Analytics
                </CardTitle>
              </CardHeader>
              <CardContent
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                style={{ minHeight: "300px" }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="col-span-1 p-4 bg-white rounded-lg shadow-xs border border-gray-100"
                >
                  <h4 className="text-center font-semibold text-gray-700 mb-4">
                    Service Duration
                  </h4>
                  <ServiceDurationChart data={serviceDurationData} />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="col-span-1 p-4 bg-white rounded-lg shadow-xs border border-gray-100"
                >
                  <h4 className="text-center font-semibold text-gray-700 mb-4">
                    Team Participation
                  </h4>
                  <TeamParticipationChart data={teamParticipationData} />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="col-span-1 p-4 bg-white rounded-lg shadow-xs border border-gray-100"
                >
                  <h4 className="text-center font-semibold text-gray-700 mb-4">
                    Top Songs
                  </h4>
                  <TopSongsChart data={topSongsData} />
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Live Stream Card */}
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="h-full bg-gradient-to-br from-white to-red-50 border border-red-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-red-700">Live Stream</CardTitle>
              </CardHeader>
              <CardContent>
                <StreamManagement />
              </CardContent>
            </Card>
          </motion.div>

          {/* Song Arrangement Card */}
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="h-full bg-gradient-to-br from-white to-green-50 border border-green-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-green-700">
                  Song Arrangement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SongArrangement songs={songs} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WorshipLeaderDashboard;