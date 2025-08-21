"use client";
import { useEffect, useState } from "react";
import {
  Calendar,
  DollarSign,
  User,
  Map,
  BarChart2,
  Handshake,
} from "lucide-react";
import MissionTrips from "@/components/admin/mission-outreach-dash/MissionTrips";
import FundraisingTracker from "@/components/admin/mission-outreach-dash/FundraisingTracker";
import MissionarySupport from "@/components/admin/mission-outreach-dash/MissionarySupport";
import OutreachCoordination from "@/components/admin/mission-outreach-dash/OutreachCoordination";
import ReportingTools from "@/components/admin/mission-outreach-dash/ReportingTools";
import PartnershipPortal from "@/components/admin/mission-outreach-dash/PartnershipPortal";
import { useMissionOutreachStore } from "@/store";

export default function MissionOutreachDashboard() {
  const [activeSection, setActiveSection] = useState("mission-trips");

  const {
    itineraries,
    fundraisers,
    missionaries,
    documents,
    outreachLocations,
    volunteers,
    partners,
    sharedDocuments,
    loading,
    error,
    fetchItineraries,
    fetchFundraisers,
    fetchMissionaries,
    fetchDocuments,
    fetchOutreachLocations,
    fetchVolunteers,
    fetchPartners,
    fetchSharedDocuments,
  } = useMissionOutreachStore();

  useEffect(() => {
    fetchItineraries();
    fetchFundraisers();
    fetchMissionaries();
    fetchDocuments();
    fetchOutreachLocations();
    fetchVolunteers();
    fetchPartners();
    fetchSharedDocuments();
  }, [
    fetchItineraries,
    fetchFundraisers,
    fetchMissionaries,
    fetchDocuments,
    fetchOutreachLocations,
    fetchVolunteers,
    fetchPartners,
    fetchSharedDocuments,
  ]);

  if (loading) return <div className="text-center py-8">Loading mission & outreach data...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  const sections = [
    { id: "mission-trips", label: "Mission Trips", icon: Calendar },
    { id: "fundraising", label: "Fundraising Progress", icon: DollarSign },
    { id: "missionary-support", label: "Missionary Support", icon: User },
    { id: "outreach", label: "Outreach Coordination", icon: Map },
    { id: "reporting", label: "Reporting Tools", icon: BarChart2 },
    { id: "partnerships", label: "Partnership Portal", icon: Handshake },
  ];

  return (
    <div className="p-6">
      <h1 id="dashboard-heading" className="sr-only">
        Mission Trip and Outreach Management Dashboard
      </h1>
      {/* The actual content of the dashboard */}
      {activeSection === "mission-trips" && <MissionTrips itineraries={itineraries} />}
      {activeSection === "fundraising" && <FundraisingTracker fundraisers={fundraisers} />}
      {activeSection === "missionary-support" && <MissionarySupport missionaries={missionaries} documents={documents} />}
      {activeSection === "outreach" && <OutreachCoordination locations={outreachLocations} volunteers={volunteers} />}
      {activeSection === "reporting" && <ReportingTools />}
      {activeSection === "partnerships" && <PartnershipPortal partners={partners} sharedDocuments={sharedDocuments} />}
    </div>
  );
}