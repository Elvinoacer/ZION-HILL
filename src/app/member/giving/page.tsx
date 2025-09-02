"use client";

import GivingDashboard from "@/components/GivingDashboard";
import GivingHistory from "@/components/GivingHistory";
import SimpleDonationForm from "@/components/SimpleDonationForm";
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
      setGivingOpportunities(data);
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
      setGivingHistory(data);
    } catch (error) {
      setGivingHistoryError(error as Error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchGivingOpportunities();
    fetchGivingHistory();
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
  if (!givingOpportunities)
    return <ErrorState message="Could not load giving opportunities" />;

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="max-w-7xl mx-auto mt-8">
        <GivingDashboard givingHistory={givingHistory} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="col-span-1 bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg rounded-2xl p-3 text-center">
            <h3 className="text-sm sm:text-base font-semibold text-blue-100">
              Total Given
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-white">
              KES {totalGiven.toLocaleString()}
            </p>
          </Card>
          <Card className="col-span-1 bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg rounded-2xl p-3 text-center">
            <h3 className="text-sm sm:text-base font-semibold text-purple-100">
              Tithes
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-white">
              KES {tithesGiven.toLocaleString()}
            </p>
          </Card>
          <Card className="col-span-1 bg-gradient-to-br from-green-500 to-green-700 text-white shadow-lg rounded-2xl p-3 text-center">
            <h3 className="text-sm sm:text-base font-semibold text-green-100">
              Special Offerings
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-white">
              KES {specialOfferingsGiven.toLocaleString()}
            </p>
          </Card>
          <Card className="col-span-1 bg-gradient-to-br from-yellow-500 to-yellow-700 text-white shadow-lg rounded-2xl p-3 text-center">
            <h3 className="text-sm sm:text-base font-semibold text-yellow-100">
              Project/Support
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-white">
              KES {projectSupportGiven.toLocaleString()}
            </p>
          </Card>
        </div>

        <GivingOpportunitiesList
          opportunities={givingOpportunities || []}
          onCardClick={handleCardClick}
        />

        <div className="text-center mt-8">
          <Button
            onClick={() => router.push("/donations")}
            variant="outline"
            className="w-full md:w-auto justify-between group hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600"
          >
            View All Donation Opportunities{" "}
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
          </Button>
        </div>

        {session?.user && (
          <div className="mt-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
              Your Giving History
            </h2>
            <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <GivingHistory donations={givingHistory || []} />
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg">
          {selectedOpportunity && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center">
                  Give to {selectedOpportunity.name}
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[70vh]">
                <div className="p-6">
                  <SimpleDonationForm
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
    className="text-center mb-12"
  >
    <Handshake className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-blue-500 dark:text-blue-400 mb-3 sm:mb-4" />
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
      Your Giving
    </h1>
    <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
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
  const router = useRouter();
  return (
    <div id="giving-opportunities" className="mb-8 sm:mb-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
        Available Opportunities
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
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
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      className="h-full"
    >
      <Card
        className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group cursor-pointer"
        onClick={() => onCardClick(opportunity)}
      >
        <div className="relative h-48 sm:h-56 w-full">
          <Image
            src={opportunity.imageUrl || "/images/blog-default.png"}
            alt={opportunity.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 group-hover:scale-105 rounded-t-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        <CardHeader className="p-4 sm:p-6 pb-0">
          <CardTitle className="text-lg sm:text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {opportunity.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-4 sm:p-6">
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
            {opportunity.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 sm:p-6 pt-0 sm:pt-4">
          <Button
            onClick={() => onCardClick(opportunity)}
            variant="outline"
            className="w-full justify-between group hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600"
          >
            Give Now{" "}
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
    <div className="text-center space-y-3 sm:space-y-4">
      <Loader className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-blue-500 dark:text-blue-400 animate-spin" />
      <p className="text-base sm:text-lg">Loading Giving Information...</p>
    </div>
  </div>
);

const ErrorState = ({ message }: { message: string }) => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <Card className="bg-white dark:bg-gray-800 border border-red-500/50 shadow-lg p-6 sm:p-8 text-center max-w-sm sm:max-w-md">
        <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-red-500 mb-3 sm:mb-4" />
        <h2 className="text-lg sm:text-xl font-bold">Error Loading Content</h2>
        <p className="text-gray-600 dark:text-gray-300 my-3 sm:my-4 text-sm sm:text-base">
          {message}
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="destructive"
          className="text-sm sm:text-base py-2.5 sm:py-3"
        >
          Try Again
        </Button>
      </Card>
    </div>
  );
};

const MemberGivingPage = () => (
  <Suspense fallback={<LoadingState />}>
    <MemberGivingPageContent />
  </Suspense>
);

export default MemberGivingPage;
