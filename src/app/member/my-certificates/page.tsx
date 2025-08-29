
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Certificate, BibleStudyCourse } from "@/generated/prisma";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download, Award, BookOpen, AlertTriangle, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CertificateWithCourse extends Certificate {
  course: BibleStudyCourse | null;
}

const CertificateCard = ({ cert, index }: { cert: CertificateWithCourse; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="w-full"
  >
    <Card className="bg-white dark:bg-gray-800/40 border-gray-200 dark:border-gray-700/60 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 rounded-xl overflow-hidden group">
      <CardHeader className="p-6 bg-gray-50 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-700/60">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Badge variant="default" className="mb-2 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-300/50">
              {cert.certificateType}
            </Badge>
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {cert.course?.title ?? "Untitled Course"}
            </CardTitle>
          </div>
          <Award className="h-10 w-10 text-yellow-500 group-hover:animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          {cert.briefDescription}
        </p>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Star className="h-4 w-4 mr-2 text-yellow-400" />
          <span>Issued on: {new Date(cert.issuedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-gray-50 dark:bg-gray-900/60 border-t border-gray-200 dark:border-gray-700/60">
        <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
          <a href={`/api/certificate/${cert.id}/download`} className="flex items-center justify-center gap-2">
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </a>
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
);

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: 3 }).map((_, idx) => (
      <Card key={idx} className="rounded-xl overflow-hidden">
        <CardHeader className="p-6 bg-gray-50 dark:bg-gray-900/60">
          <Skeleton className="h-5 w-1/3 mb-3" />
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
        <CardFooter className="p-4 bg-gray-50 dark:bg-gray-900/60">
          <Skeleton className="h-10 w-full rounded-lg" />
        </CardFooter>
      </Card>
    ))}
  </div>
);

export default function MyCertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateWithCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/bible-study/my-certificates");
        if (res.ok) {
          const data = await res.json();
          setCertificates(data);
        } else {
          setError("Failed to load your achievement records. Please try again later.");
        }
      } catch (err) {
        setError("A network error occurred. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            My Achievements
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
            A collection of all the certificates you have earned through your studies and dedication.
          </p>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Alert variant="destructive" className="mb-8 max-w-3xl mx-auto bg-red-50 border-red-500 text-red-900 dark:bg-red-900/20 dark:border-red-500/50 dark:text-red-200">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle className="font-bold">Request Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {isLoading && <LoadingSkeleton />}

        {!isLoading && !error && certificates.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-gray-800/40 rounded-xl shadow-sm"
          >
            <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">No Certificates Yet</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Keep learning and complete courses to earn your first certificate!
            </p>
          </motion.div>
        )}

        {!isLoading && !error && certificates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert, idx) => (
              <CertificateCard key={cert.id} cert={cert} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

