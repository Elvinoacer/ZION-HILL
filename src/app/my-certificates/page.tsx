
"use client";

import { useState, useEffect } from "react";
import { Certificate, BibleStudyCourse } from "@/generated/prisma";

interface CertificateWithCourse extends Certificate {
  course: BibleStudyCourse | null;
}

export default function MyCertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateWithCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      setIsLoading(true);
      const res = await fetch("/api/bible-study/my-certificates");
      if (res.ok) {
        const data = await res.json();
        setCertificates(data);
      } else {
        setError("Failed to load certificates.");
      }
      setIsLoading(false);
    };
    fetchCertificates();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6">My Certificates</h1>
      {certificates.length === 0 ? (
        <p>You have not earned any certificates yet.</p>
      ) : (
        <div className="space-y-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="p-6 bg-white rounded-lg border border-gray-200 shadow-md flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">{cert.course?.title}</h2>
                <p className="font-normal text-gray-700">{cert.briefDescription}</p>
                <p className="mt-2 text-sm text-gray-500">Issued on: {new Date(cert.issuedDate).toLocaleDateString()}</p>
              </div>
              <a 
                href={`/api/certificate/${cert.id}/download`}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
