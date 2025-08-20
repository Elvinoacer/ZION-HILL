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
  _count?: { members: number };
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="ml-3 text-lg text-gray-700">Loading ministries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">Failed to load ministries: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
        Our Ministries
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ministries.length > 0 ? (
          ministries.map((ministry) => (
            <Card
              key={ministry.id}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {ministry.photo && (
                <div className="relative h-48 w-full">
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
                <CardTitle className="text-2xl font-bold text-gray-800">
                  {ministry.name}
                </CardTitle>
                {ministry.leader && (
                  <p className="text-sm text-gray-600">
                    Led by: {ministry.leader.name}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 line-clamp-3">
                  {ministry.description}
                </p>
                <div className="flex items-center text-gray-500 text-sm">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{ministry._count?.members || 0} Members</span>
                </div>
                <Link href={`/ministries/${ministry.id}`} passHref>
                  <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600 text-lg">
            No ministries found.
          </div>
        )}
      </div>
    </div>
  );
};

const MinistriesPage = () => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="ml-3 text-lg text-gray-700">Loading page...</p>
      </div>
    }
  >
    <MinistriesPageContent />
  </Suspense>
);

export default MinistriesPage;
