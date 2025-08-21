
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const OutreachClient = dynamic(
  () => import("./OutreachClient"),
  { ssr: false }
);

const OutreachPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Or a loading spinner
  }

  return <OutreachClient />;
};

export default OutreachPage;
