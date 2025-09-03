"use client";

import GivingDashboard from "@/components/GivingDashboard";
import GivingHistory from "@/components/GivingHistory";
import SimpleGivingForm from "@/components/SimpleGivingForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import GivingSummaryCards from "@/components/member/GivingSummaryCards";
import GivingSummaryExpansiveCard from "@/components/member/GivingSummaryExpansiveCard";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Handshake, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: string;
  method: string;
  status: string;
}

interface GivingOpportunity {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

const MemberGivingPageContent = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [givingOpportunities, setGivingOpportunities] = useState<
    GivingOpportunity[]
  >([]);
  const [givingHistory, setGivingHistory] = useState<Transaction[]>([]);
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [givingOpportunitiesError, setGivingOpportunitiesError] =
    useState<Error | null>(null);
  const [givingHistoryError, setGivingHistoryError] = useState<Error | null>(
    null
  );

  const fetchGivingOpportunities = async () => {
    try {
      const res = await fetch(`/api/giving`);
      if (!res.ok) {
        throw new Error("Failed to fetch giving opportunities");
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setGivingOpportunities(data);
      } else {
        console.error("API did not return an array for giving opportunities:", data);
        throw new Error("Received invalid data for giving opportunities.");
      }
    } catch (error) {
      setGivingOpportunitiesError(error as Error);
    } finally {
      setIsLoadingOpportunities(false);
    }
  };

  const fetchGivingHistory = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(`/api/member/giving-history`);
      if (!res.ok) {
        throw new Error("Failed to fetch giving history");
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setGivingHistory(data);
      } else {
        console.error("API did not return an array for giving history:", data);
        throw new Error("Received invalid data for giving history.");
      }
    } catch (error) {
      setGivingHistoryError(error as Error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchGivingOpportunities();
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      fetchGivingHistory();
    }
  }, [session?.user?.id]);

  const [selectedOpportunity, setSelectedOpportunity] =
    useState<GivingOpportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (opportunity: GivingOpportunity) => {
    setSelectedOpportunity(opportunity);
    setIsModalOpen(true);
  };

  if (isLoadingOpportunities || isLoadingHistory) return <LoadingState />;
  if (givingOpportunitiesError)
    return <ErrorState message={givingOpportunitiesError.message} />;
  if (givingHistoryError)
    return <ErrorState message={givingHistoryError.message} />;
  

  const totalGiven =
    givingHistory?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const tithesGiven =
    givingHistory
      ?.filter((t) => t.type === "Tithes")
      .reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const specialOfferingsGiven =
    givingHistory
      ?.filter((t) => t.type === "Special Offerings")
      .reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const projectSupportGiven =
    givingHistory
      ?.filter((t) => t.type === "Project/Support")
      .reduce((acc, curr) => acc + curr.amount, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="max-w-7xl mx-auto mt-8 space-y-10">
        <GivingSummaryCards givingHistory={givingHistory} />
        <GivingSummaryExpansiveCard givingHistory={givingHistory} />

        <GivingOpportunitiesList
          opportunities={givingOpportunities || []}
          onCardClick={handleCardClick}
        />

        <div className="text-center mt-8">
          <Button
            onClick={() => router.push("/donations")}
            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 flex items-center justify-center gap-2"
          >
            View All Giving Opportunities
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        <GivingDashboard givingHistory={givingHistory} />

        {session?.user && (
          <div className="mt-12">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent"
            >
              Your Giving History
            </motion.h2>
            <Card className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border-0 overflow-hidden">
              <CardContent className="p-0">
                <GivingHistory donations={givingHistory || []} />
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl p-0 border-0 overflow-hidden max-w-md md:max-w-2xl [&>button]:text-white">
          {selectedOpportunity && (
            <>              <DialogHeader className="relative">
                <div className="h-32 w-full relative">
                  <Image
                    src={
                      selectedOpportunity.imageUrl || "/images/blog-default.png"
                    }
                    alt={selectedOpportunity.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <DialogTitle className="text-2xl font-bold text-white absolute bottom-4 left-6">
                    Give to {selectedOpportunity.name}
                  </DialogTitle>
                </div>
              </DialogHeader>
              <ScrollArea className="h-[70vh] md:h-[60vh]">
                <div className="p-6">
                  <SimpleGivingForm
                    plan={selectedOpportunity}
                    donationType="giving"
                    onSuccess={() => {
                      fetchGivingHistory();
                      setIsModalOpen(false);
                    }}
                  />
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Header = () => (
  <motion.header
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center mb-12 pt-4"
  >
    <div className="relative inline-block">
      <Handshake className="mx-auto h-14 w-14 sm:h-16 sm:w-16 text-blue-500 dark:text-blue-400 mb-4" />
      <div className="absolute -inset-4 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-lg opacity-50 -z-10"></div>
    </div>
    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-800 to-blue-700 dark:from-gray-100 dark:to-blue-200 bg-clip-text text-transparent">
      Your Giving
    </h1>
    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
      Manage your tithes, offerings, and view your giving history.
    </p>
  </motion.header>
);

const GivingOpportunitiesList = ({
  opportunities,
  onCardClick,
}: {
  opportunities: GivingOpportunity[];
  onCardClick: (opportunity: GivingOpportunity) => void;
}) => {
  return (
    <div id="giving-opportunities" className="mb-8 sm:mb-16">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl sm:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-gray-800 to-blue-700 dark:from-gray-100 dark:to-blue-200 bg-clip-text text-transparent"
      >
        Available Opportunities
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
        {opportunities.map((opportunity, i) => (
          <GivingOpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            index={i}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </div>
  );
};

const GivingOpportunityCard = ({
  opportunity,
  index,
  onCardClick,
}: {
  opportunity: GivingOpportunity;
  index: number;
  onCardClick: (opportunity: GivingOpportunity) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      className="h-full"
      whileHover={{ y: -5 }}
    >
      <Card
        className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group cursor-pointer"
        onClick={() => onCardClick(opportunity)}
      >
        <div className="relative h-48 sm:h-56 w-full overflow-hidden">
          <Image
            src={opportunity.imageUrl || "/images/blog-default.png"}
            alt={opportunity.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <div className="absolute top-4 right-4">
            <div className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Give
            </div>
          </div>
        </div>
        <CardHeader className="p-5 pb-0">
          <CardTitle className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {opportunity.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-5">
          <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
            {opportunity.description}
          </p>
        </CardContent>
        <CardFooter className="p-5 pt-0">
          <Button
            variant="outline"
            className="w-full justify-between group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 rounded-lg py-5 border-gray-300 dark:border-gray-600"
          >
            Give Now
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center space-y-4"
    >
      <div className="relative">
        <Loader className="h-12 w-12 mx-auto text-blue-500 dark:text-blue-400 animate-spin" />
        <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-lg"></div>
      </div>
      <p className="text-lg">Loading Giving Information...</p>
    </motion.div>
  </div>
);

const ErrorState = ({ message }: { message: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="bg-white dark:bg-gray-800 border border-red-300 dark:border-red-500/50 shadow-xl p-8 text-center max-w-sm sm:max-w-md rounded-2xl">
          <div className="relative inline-block mb-4">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
            <div className="absolute inset-0 bg-red-100 dark:bg-red-900/30 rounded-full blur-md"></div>
          </div>
          <h2 className="text-xl font-bold mb-2">Error Loading Content</h2>
          <p className="text-gray-600 dark:text-gray-300 my-4">{message}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:from-red-700 hover:to-red-800 transition-all duration-300 w-full"
          >
            Try Again
          </Button>
        </Card>
      </motion.div>
    </div>
  );
};

const MemberGivingPage = () => (
  <Suspense fallback={<LoadingState />}>
    <MemberGivingPageContent />
  </Suspense>
);

export default MemberGivingPage;
