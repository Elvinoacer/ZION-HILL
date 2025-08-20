"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  FaHandHoldingHeart,
  FaArrowRight,
  FaDonate,
  FaUsers,
} from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";
import DonationForm from "@/components/DonationForm";
import { Progress } from "@/components/ui/progress";

interface DonationPlan {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  goalAmount?: number;
  transactions: { amount: number }[];
}

const DonationsPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get("plan");

  const [donationPlans, setDonationPlans] = useState<DonationPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonationPlans = async () => {
      try {
        const res = await fetch("/api/donation-plans");
        if (!res.ok) throw new Error("Failed to fetch donation plans");
        const data = await res.json();
        setDonationPlans(data);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchDonationPlans();
  }, []);

  const selectedDonationPlan = donationPlans.find((p) => p.id === planId);

  const generalDonationPlan: DonationPlan = {
    id: "general",
    name: "General Church Fund",
    description: "Your contribution to the general fund helps us allocate resources where they are most needed across all ministries and operations.",
    imageUrl: "/images/community-prayer.png", // Or a generic image
    goalAmount: null, // General fund typically doesn't have a specific goal
    transactions: [], // Not relevant for display here
  };

  if (loadingPlans) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-lg text-indigo-700 font-medium">
            Loading donation opportunities...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-md p-6 bg-white rounded-xl shadow-md border border-red-100">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <svg
                className="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Error Loading Content
            </h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {planId === "general" ? (
          <DonationForm plan={generalDonationPlan} />
        ) : planId && selectedDonationPlan ? (
          <DonationForm plan={selectedDonationPlan} />
        ) : (
          <div>
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-indigo-600 to-purple-700 p-6 rounded-full shadow-xl">
                    <FaHandHoldingHeart className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Support Our Mission
                </span>
              </h1>
              <p className="mt-3 text-xl text-gray-600 max-w-2xl mx-auto">
                Your generous donation fuels our mission to spread God's love
                and serve our community.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => router.push("/donors")}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:-translate-y-1"
                >
                  <FaUsers className="mr-2" />
                  View Our Donors
                </button>
                <button
                  onClick={() =>
                    window.scrollTo({
                      top: document.getElementById("donation-plans")?.offsetTop,
                      behavior: "smooth",
                    })
                  }
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-full shadow-sm text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  <FaDonate className="mr-2" />
                  See Giving Options
                </button>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-indigo-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-indigo-700 mb-2">
                    {donationPlans.length}+
                  </div>
                  <div className="text-gray-600">Giving Opportunities</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-purple-700 mb-2">
                    KES 
                    {donationPlans
                      .reduce(
                        (acc, plan) =>
                          acc +
                          plan.transactions.reduce(
                            (sum, t) => sum + t.amount,
                            0
                          ),
                        0
                      )
                      .toLocaleString()}
                  </div>
                  <div className="text-gray-600">Raised This Year</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-blue-700 mb-2">
                    {donationPlans.reduce(
                      (acc, plan) => acc + plan.transactions.length,
                      0
                    )}
                    +
                  </div>
                  <div className="text-gray-600">Generous Donors</div>
                </div>
              </div>
            </div>

            {/* Donation Plans */}
            <div id="donation-plans" className="mb-16">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                <span className="relative">
                  <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Ways to Give
                  </span>
                  <span className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full -z-0"></span>
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {donationPlans
                  .filter((plan) => plan.id !== "general") // Filter out the 'general' plan
                  .map((plan) => {
                  const totalDonated = plan.transactions.reduce(
                    (acc, transaction) => acc + transaction.amount,
                    0
                  );
                  const progress = plan.goalAmount
                    ? (totalDonated / plan.goalAmount) * 100
                    : 0;

                  return (
                    <div
                      key={plan.id}
                      className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
                      onClick={() => router.push(`/donations?plan=${plan.id}`)}
                    >
                      {/* Ribbon for completed goals */}
                      {progress >= 100 && (
                        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 transform rotate-45 translate-x-8 -translate-y-1 z-10">
                          Goal Met!
                        </div>
                      )}

                      {plan.imageUrl ? (
                        <div className="h-56 relative overflow-hidden">
                          <img
                            src={plan.imageUrl}
                            alt={plan.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                        </div>
                      ) : (
                        <div className="h-56 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                          <FaHandHoldingHeart className="h-16 w-16 text-indigo-300" />
                        </div>
                      )}

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                          {plan.name}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {plan.description}
                        </p>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-500 mb-1">
                            <span>Raised</span>
                            <span>Goal</span>
                          </div>
                          <div className="flex justify-between font-medium mb-2">
                            <span className="text-indigo-600">
                              KES {totalDonated.toLocaleString()}
                            </span>
                            <span className="text-purple-600">
                              KES {plan.goalAmount?.toLocaleString()}
                            </span>
                          </div>
                          <Progress
                            value={progress}
                            className="h-2 bg-gray-200"
                            indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-500"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {Math.round(progress)}% funded
                          </span>
                          <button className="inline-flex items-center text-indigo-600 hover:text-purple-600 font-medium group transition-colors">
                            Donate
                            <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Make a General Donation
              </h3>
              <p className="text-lg text-indigo-100 mb-6 max-w-2xl mx-auto">
                Not sure which fund to choose? Contribute to our general fund
                and we'll allocate it where it's needed most.
              </p>
              <button
                onClick={() => router.push("/donations?plan=general")}
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-medium rounded-full shadow-sm text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200 transform hover:scale-105"
              >
                <FaDonate className="mr-2" />
                Give to General Fund
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DonationsPage = () => (
  <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-indigo-700">Loading donation page...</p>
        </div>
      </div>
    }
  >
    <DonationsPageContent />
  </Suspense>
);

export default DonationsPage;
