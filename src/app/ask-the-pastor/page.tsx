"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { safeFetch } from "@/lib/api";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

interface Question {
  id: string;
  request: string;
  userId?: string;
  createdAt: string;
}

const AskThePastorPage = () => {
  const { data: session } = useSession();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      const data = await safeFetch<Question[]>("/api/ask-the-pastor");
      setQuestions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newQuestion.trim() || !session?.user?.id) {
      setError("Please enter a question and ensure you are logged in.");
      return;
    }

    try {
      await safeFetch("/api/ask-the-pastor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request: newQuestion,
          userId: session.user.id,
          isPublic: true, // Assuming questions are public for this page
          isUrgent: false, // Assuming not urgent by default
        }),
      });

      setNewQuestion("");
      fetchQuestions(); // Refresh list
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Ask the Pastor
        </h1>
        <p className="text-lg text-gray-600">Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Ask the Pastor
        </h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Ask the Pastor</h1>
      <p className="text-lg text-gray-600 mb-4">
        Submit your questions to the pastor and view answers.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Submit a New Question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="question"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Your Question:
              </label>
              <Textarea
                id="question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                required
                rows={4}
                disabled={!session?.user?.id}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={!session?.user?.id}>
              Submit Question
            </Button>
            {!session?.user?.id && (
              <p className="text-red-500 text-sm mt-2">
                You must be logged in to submit a question.
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submitted Questions</CardTitle>
        </CardHeader>
        <CardContent>
          {questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id} className="border p-4 rounded-lg">
                  <p className="text-gray-800">{question.request}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Submitted on{" "}
                    {new Date(question.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No questions found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AskThePastorPage;
