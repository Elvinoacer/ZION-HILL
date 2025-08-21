
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const EventsManagerDashboardClient = dynamic(
  () => import("./EventsManagerDashboardClient"),
  { ssr: false }
);

const EventsManagerPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Or a loading spinner
  }

  return <EventsManagerDashboardClient />;
};

export default EventsManagerPage;
