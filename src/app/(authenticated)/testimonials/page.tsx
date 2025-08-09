"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { safeFetch } from '@/lib/api';

interface Testimonial {
  id: string;
  comment: string;
  userId: string;
  user?: { name: string };
  createdAt: string;
}

const TestimonialsPage = () => {
  const { data: session } = useSession();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [newTestimonial, setNewTestimonial] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      const data = await safeFetch<Testimonial[]>('/api/testimonials');
      setTestimonials(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newTestimonial.trim() || !session?.user?.id) {
      setError('Please enter a testimonial and ensure you are logged in.');
      return;
    }

    try {
      await safeFetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: newTestimonial,
          userId: session.user.id,
          sentiment: 'POSITIVE', // Assuming testimonials are positive
          tags: ['testimonial'],
        }),
      });

      setNewTestimonial('');
      fetchTestimonials(); // Refresh list
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Testimonials</h1>
        <p className="text-lg text-gray-600">Loading testimonials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Testimonials</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Testimonials</h1>
      <p className="text-lg text-gray-600 mb-4">
        Read what others are saying and share your own experience.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Submit Your Testimonial</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="testimonial" className="block text-gray-700 text-sm font-bold mb-2">Your Testimonial:</label>
              <Textarea
                id="testimonial"
                value={newTestimonial}
                onChange={(e) => setNewTestimonial(e.target.value)}
                required
                rows={4}
                disabled={!session?.user?.id}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={!session?.user?.id}>
              Submit Testimonial
            </Button>
            {!session?.user?.id && (
              <p className="text-red-500 text-sm mt-2">You must be logged in to submit a testimonial.</p>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What Others Are Saying</CardTitle>
        </CardHeader>
        <CardContent>
          {testimonials.length > 0 ? (
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="border p-4 rounded-lg">
                  <p className="text-gray-800">{testimonial.comment}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    - {testimonial.user?.name || 'Anonymous'} on {new Date(testimonial.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No testimonials found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestimonialsPage;
