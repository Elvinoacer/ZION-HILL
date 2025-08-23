"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeFetch } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BibleReadingPlan {
  id: string;
  title: string;
  description?: string;
}

const BibleReadingPlansPage = () => {
  const [plans, setPlans] = useState<BibleReadingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await safeFetch<BibleReadingPlan[]>(
          "/api/bible-reading-plans"
        );
        setPlans(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Loading Bible reading plans...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100"
        >
          <p className="text-base sm:text-lg text-red-500 mb-6 flex items-center justify-center gap-2">
            Error: {error}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg px-4 py-2 hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 sm:py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 sm:mb-12 text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
            Bible Reading Plans
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Deepen your faith with our structured Bible reading plans, designed
            to guide you through Scripture with purpose and clarity.
          </p>
        </motion.div>

        <AnimatePresence>
          {plans.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-blue-500" />
                        {plan.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <p className="text-sm sm:text-base text-gray-600 line-clamp-3">
                        {plan.description || "No description available."}
                      </p>
                      <Link href={`/bible-reading-plans/${plan.id}`}>
                        <Button
                          variant="outline"
                          className="mt-4 w-full rounded-lg text-sm sm:text-base text-blue-600 hover:bg-blue-50"
                        >
                          Start Plan
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12"
            >
              <p className="text-base sm:text-lg text-gray-600">
                No Bible reading plans available at the moment. Please check
                back later!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BibleReadingPlansPage;
