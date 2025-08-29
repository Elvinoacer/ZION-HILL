
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const PreachingCalendarClient = dynamic(
  () => import("./PreachingCalendarClient"),
  { ssr: false }
);

const PreachingCalendarPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Or a loading spinner
  }

  return <PreachingCalendarClient />;
};

export default PreachingCalendarPage;
