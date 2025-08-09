"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const AdminNewsletterPage = () => {
  const [subject, setSubject] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!subject.trim() || !htmlContent.trim()) {
      setError('Subject and HTML content are required.');
      return;
    }

    try {
      const res = await fetch('/api/newsletter-send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, html: htmlContent }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to send newsletter');
      }

      setMessage('Newsletter sent successfully!');
      setSubject('');
      setHtmlContent('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Send Newsletter</h1>
      <p className="text-lg text-gray-600 mb-4">
        Compose and send newsletters to your subscribed users.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Compose Newsletter</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">Subject:</label>
              <Input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="htmlContent" className="block text-gray-700 text-sm font-bold mb-2">HTML Content:</label>
              <Textarea
                id="htmlContent"
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                required
                rows={10}
              />
            </div>
            {message && <p className="text-green-500 text-sm">{message}</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit">
              Send Newsletter
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNewsletterPage;
