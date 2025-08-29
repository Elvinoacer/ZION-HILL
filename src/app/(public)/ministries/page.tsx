"use client";
import React from "react";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { safeFetch } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Users, ArrowRight } from "lucide-react";

interface Ministry {
  id: string;
  name: string;
  description: string;
  photo?: string;
  leader?: { name: string };
  members?: any[];
}

const MinistriesPageContent = () => {
  const [ministries, setMinistries] = React.useState<Ministry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const data = await safeFetch<Ministry[]>("/api/ministries");
        setMinistries(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMinistries();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center animate-fade-in">
        <Loader2 className="h-10 w-10 animate-spin text-blue-400" />
        <p className="ml-3 text-lg text-gray-300">Loading ministries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-6 flex items-center justify-center animate-fade-in">
        <Card className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-400 mb-4">Failed to load ministries: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-6 animate-fade-in">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-8 sm:mb-12">
        Our Ministries
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {ministries.length > 0 ? (
          ministries.map((ministry) => (
            <Card
              key={ministry.id}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-lg"
            >
              {ministry.photo && (
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src={ministry.photo}
                    alt={ministry.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">
                  {ministry.name}
                </CardTitle>
                {ministry.leader && (
                  <p className="text-sm text-gray-400">
                    Led by: {ministry.leader.name}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 line-clamp-3">
                  {ministry.description}
                </p>
                <div className="flex items-center text-gray-400 text-sm">
                  <Users className="h-4 w-4 mr-2 text-blue-400" />
                  <span>{ministry.members?.length || 0} Members</span>
                </div>
                <Link href={`/ministries/${ministry.id}`} passHref>
                  <Button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/30 shadow-lg">
              <p className="text-xl text-gray-400">
                No ministries found at the moment. Please check back later!
              </p>
            </div>
        )}
      </div>
    </div>
  );
};

const MinistriesPage = () => (
  <Suspense
    fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-400" />
        <p className="ml-3 text-lg text-gray-300">Loading page...</p>
      </div>
    }
  >
    <MinistriesPageContent />
  </Suspense>
);

export default MinistriesPage;
