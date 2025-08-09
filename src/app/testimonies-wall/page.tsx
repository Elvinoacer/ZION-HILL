"use client";

import { safeFetch } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface Testimony {
  id: string;
  comment: string;
  userId: string;
  user?: { name: string };
  createdAt: string;
}

const TestimoniesWallPage = () => {
  const { data: session } = useSession();
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [newTestimony, setNewTestimony] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonies = async () => {
    try {
      const data = await safeFetch<Testimony[]>("/api/testimonies-wall");
      setTestimonies(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newTestimony.trim() || !session?.user?.id) {
      setError("Please enter a testimony and ensure you are logged in.");
      return;
    }

    try {
      await safeFetch("/api/testimonies-wall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: newTestimony,
          userId: session.user.id,
          sentiment: "POSITIVE", // Assuming testimonies are positive
          tags: ["testimony"],
        }),
      });

      setNewTestimony("");
      fetchTestimonies(); // Refresh list
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Testimonies Wall
        </h1>
        <p className="text-lg text-gray-600">Loading testimonies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Testimonies Wall
        </h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Testimonies Wall
      </h1>
      <p className="text-lg text-gray-600 mb-4">
        Read inspiring testimonies and share your own experience.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Submit Your Testimony</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="testimony"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Your Testimony:
              </label>
              <Textarea
                id="testimony"
                value={newTestimony}
                onChange={(e) => setNewTestimony(e.target.value)}
                required
                rows={4}
                disabled={!session?.user?.id}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={!session?.user?.id}>
              Submit Testimony
            </Button>
            {!session?.user?.id && (
              <p className="text-red-500 text-sm mt-2">
                You must be logged in to submit a testimony.
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What Others Are Saying</CardTitle>
        </CardHeader>
        <CardContent>
          {testimonies.length > 0 ? (
            <div className="space-y-4">
              {testimonies.map((testimony) => (
                <div key={testimony.id} className="border p-4 rounded-lg">
                  <p className="text-gray-800">{testimony.comment}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    - {testimony.user?.name || "Anonymous"} on{" "}
                    {new Date(testimony.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No testimonies found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestimoniesWallPage;
