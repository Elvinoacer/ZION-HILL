"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TiptapEditor from '@/components/TiptapEditor';


import { Mail, Send, AlertTriangle, CheckCircle } from 'lucide-react';

const AdminNewsletterPage = () => {
  const [subject, setSubject] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('/api/newsletter-templates');
        if (!res.ok) throw new Error('Failed to fetch templates');
        const data = await res.json();
        setTemplates(data);
      } catch (err) {
        console.error("Failed to fetch templates", err);
        setError("Could not load newsletter templates.");
      }
    };
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      const fetchTemplateContent = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/newsletter-templates?template=${selectedTemplate}`);
          if (!res.ok) throw new Error('Failed to fetch template content');
          const data = await res.json();
          setHtmlContent(data.content);
          // Optionally set a subject from the template if available
          // setSubject(data.subject || '');
        } catch (err) {
          console.error("Failed to fetch template content", err);
          setError(`Failed to load content for "${selectedTemplate}".`);
        } finally {
          setIsLoading(false);
        }
      };
      fetchTemplateContent();
    }
  }, [selectedTemplate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!subject.trim() || !htmlContent.trim()) {
      setError('Subject and content are required.');
      return;
    }

    setIsLoading(true);
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
      setSelectedTemplate(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center">
          <Mail className="mr-3 h-8 w-8 text-sky-600" />
          Newsletter Publisher
        </h1>
        <p className="text-lg text-gray-500 mt-2">
          Compose and broadcast newsletters to all subscribed members.
        </p>
      </div>

      <Card className="bg-white shadow-lg border-gray-200">
        <CardHeader>
          <CardTitle>Compose Message</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="template" className="block text-gray-700 text-sm font-bold mb-2">Use a Template</label>
                <Select onValueChange={setSelectedTemplate} value={selectedTemplate || ""} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template} value={template}>
                        {template.charAt(0).toUpperCase() + template.slice(1).replace(/-/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">Subject</label>
                <Input
                  type="text"
                  id="subject"
                  placeholder="Enter the newsletter subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  disabled={isLoading}
                  className="py-2 px-3"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="htmlContent" className="block text-gray-700 text-sm font-bold mb-2">Content</label>
              <div className="border rounded-md overflow-hidden">
                <TiptapEditor
                  content={htmlContent}
                  onChange={setHtmlContent}
                  disabled={isLoading}
                />
              </div>
            </div>

            {message && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md flex items-center">
                <CheckCircle className="h-5 w-5 mr-3" />
                <p>{message}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center">
                <AlertTriangle className="h-5 w-5 mr-3" />
                <p>{error}</p>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isLoading}>
                <Send className="mr-2 h-4 w-4" />
                {isLoading ? 'Sending...' : 'Send Newsletter'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};


export default AdminNewsletterPage;
