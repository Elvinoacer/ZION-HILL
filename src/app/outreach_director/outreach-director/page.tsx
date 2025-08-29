
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const OutreachDirectorDashboardClient = dynamic(
  () => import("./OutreachDirectorDashboardClient"),
  { ssr: false }
);

const OutreachDirectorPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Or a loading spinner
  }

  return <OutreachDirectorDashboardClient />;
};

export default OutreachDirectorPage;
