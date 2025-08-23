'use client';

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DonationForm from "@/components/DonationForm";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, Users, TrendingUp, Heart, ArrowRight, Loader, AlertCircle } from 'lucide-react';
import Image from "next/image";

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
    imageUrl: "/images/community-prayer.png",
    goalAmount: undefined,
    transactions: [],
  };

  if (loadingPlans) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const totalRaised = donationPlans.reduce((acc, plan) => acc + plan.transactions.reduce((sum, t) => sum + t.amount, 0), 0);
  const totalDonors = donationPlans.reduce((acc, plan) => acc + plan.transactions.length, 0);

  if (planId) {
    const plan = planId === 'general' ? generalDonationPlan : selectedDonationPlan;
    if (plan) return <DonationForm plan={plan} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <StatsSection opportunities={donationPlans.length} totalRaised={totalRaised} totalDonors={totalDonors} />
        <DonationPlansList plans={donationPlans.filter(p => p.id !== 'general')} />
        <GeneralDonationCTA />
      </main>
    </div>
  );
};

const Header = () => (
  <motion.header 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white text-center py-16 md:py-24 relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-pattern opacity-10"></div>
    <div className="container mx-auto px-4 relative">
      <Heart className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-blue-200 mb-3 sm:mb-4" />
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight">Support Our Mission</h1>
      <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">Your generosity fuels our work in the community and beyond. Join us in making a difference.</p>
    </div>
  </motion.header>
);

const StatsSection = ({ opportunities, totalRaised, totalDonors }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
    <Card className="bg-white/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200/80 -mt-16 sm:-mt-20 md:-mt-24 mb-8 sm:mb-16 sticky top-4 z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-center">
        <StatItem icon={Handshake} value={opportunities} label="Giving Opportunities" />
        <StatItem icon={TrendingUp} value={`KES ${totalRaised.toLocaleString()}`} label="Raised This Year" />
        <StatItem icon={Users} value={totalDonors} label="Generous Donors" />
      </div>
    </Card>
  </motion.div>
);

const StatItem = ({ icon: Icon, value, label }) => (
  <div className="p-3 sm:p-4">
    <Icon className="h-8 w-8 sm:h-10 sm:w-10 mx-auto text-blue-600 mb-2 sm:mb-3" />
    <div className="text-xl sm:text-3xl font-bold text-gray-800">{value}</div>
    <div className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">{label}</div>
  </div>
);

const DonationPlansList = ({ plans }) => (
  <div id="donation-plans" className="mb-8 sm:mb-16">
    <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8 sm:mb-12">Ways to Give</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {plans.map((plan, i) => <DonationPlanCard key={plan.id} plan={plan} index={i} />)}
    </div>
  </div>
);

const DonationPlanCard = ({ plan, index }) => {
  const router = useRouter();
  const totalDonated = plan.transactions.reduce((acc, t) => acc + t.amount, 0);
  const progress = plan.goalAmount ? (totalDonated / plan.goalAmount) * 100 : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + index * 0.1 }} className="h-full">
      <Card 
        className="h-full flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/80 overflow-hidden group cursor-pointer"
        onClick={() => router.push(`/donations?plan=${plan.id}`)}
      >
        <div className="relative h-48 sm:h-56 w-full">
          <Image src={plan.imageUrl || '/images/blog-default.png'} alt={plan.name} layout="fill" objectFit="cover" className="transition-transform duration-500 group-hover:scale-105 rounded-t-2xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        <CardHeader className="p-4 sm:p-6 pb-0">
          <CardTitle className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{plan.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-4 sm:p-6">
          <p className="text-gray-600 text-sm line-clamp-2 mb-3 sm:mb-4">{plan.description}</p>
          {plan.goalAmount && (
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-1">
                <span className="font-medium text-gray-700">Raised: KES {totalDonated.toLocaleString()}</span>
                <span className="text-gray-500">Goal: KES {plan.goalAmount.toLocaleString()}</span>
              </div>
              <Progress value={progress} className="h-1.5 sm:h-2" />
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 sm:p-6 pt-0 sm:pt-4">
          <Button variant="ghost" className="w-full justify-between group text-blue-600 hover:bg-blue-50">
            Donate Now <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const GeneralDonationCTA = () => {
  const router = useRouter();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <Card className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl p-6 sm:p-8 md:p-10 text-center">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Not Sure Where to Give?</h3>
        <p className="text-sm sm:text-base text-blue-100 mb-4 sm:mb-6 max-w-2xl mx-auto">Contribute to our general fund, and we'll direct your gift to where it's needed most.</p>
        <Button size="lg" variant="secondary" onClick={() => router.push("/donations?plan=general")} className="text-blue-700 font-bold hover:scale-105 transition-transform text-sm sm:text-base py-2.5 sm:py-3">
          Give to General Fund
        </Button>
      </Card>
    </motion.div>
  );
};

const LoadingState = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
        <div className="text-center space-y-3 sm:space-y-4">
            <Loader className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-blue-600 animate-spin" />
            <p className="text-base sm:text-lg text-gray-600">Loading Giving Opportunities...</p>
        </div>
    </div>
);

const ErrorState = ({ message }) => (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4 sm:p-6">
        <Card className="p-6 sm:p-8 text-center max-w-sm sm:max-w-md">
            <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-red-500 mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Error Loading Content</h2>
            <p className="text-gray-600 my-3 sm:my-4 text-sm sm:text-base">{message}</p>
            <Button onClick={() => window.location.reload()} variant="destructive" className="text-sm sm:text-base py-2.5 sm:py-3">Try Again</Button>
        </Card>
    </div>
);

const DonationsPage = () => (
  <Suspense fallback={<LoadingState />}>
    <DonationsPageContent />
  </Suspense>
);

export default DonationsPage;
