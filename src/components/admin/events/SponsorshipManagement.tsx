import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Mail } from "lucide-react";

type Sponsor = {
  id: number;
  name: string;
  amount: number;
  logo: string;
};

export default function SponsorshipManagement() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([
    {
      id: 1,
      name: "Local Business",
      amount: 1000,
      logo: "/logos/business.png",
    },
  ]);

  const sendThankYouEmail = (sponsor: string) => {
    console.log(`Sending thank-you email to ${sponsor}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Sponsorship Management
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Donor Recognition
          </h3>
          <div className="mt-4 space-y-2">
            {sponsors.map((sponsor, index) => (
              <motion.div
                key={sponsor.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {sponsor.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Amount: ${sponsor.amount}
                  </div>
                  <div className="text-sm text-gray-600">
                    Logo: {sponsor.logo}
                  </div>
                </div>
                <motion.button
                  onClick={() => sendThankYouEmail(sponsor.name)}
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                  whileHover={{ scale: 1.03 }}
                >
                  <Mail className="h-4 w-4 inline mr-1" /> Send Thank-You
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
