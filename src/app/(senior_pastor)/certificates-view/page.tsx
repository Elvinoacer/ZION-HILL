
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CertificatesViewClient = dynamic(
  () => import("./CertificatesViewClient"),
  { ssr: false }
);

const CertificatesViewPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Or a loading spinner
  }

  return <CertificatesViewClient />;
};

export default CertificatesViewPage;
