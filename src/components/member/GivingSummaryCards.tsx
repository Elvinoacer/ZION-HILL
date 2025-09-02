import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: string;
  method: string;
  status: string;
}

interface GivingSummaryCardsProps {
  givingHistory: Transaction[];
}

const GivingSummaryCards = ({ givingHistory }: GivingSummaryCardsProps) => {
  const totalGiven = givingHistory.reduce((sum, t) => sum + t.amount, 0);
  const tithesGiven = givingHistory.filter(t => t.type === 'Tithes').reduce((acc, curr) => acc + curr.amount, 0);
  const specialOfferingsGiven = givingHistory.filter(t => t.type === 'Special Offerings').reduce((acc, curr) => acc + curr.amount, 0);
  const projectSupportGiven = givingHistory.filter(t => t.type === 'Project/Support').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="col-span-1 bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg rounded-2xl p-3 text-center">
        <h3 className="text-sm sm:text-base font-semibold text-blue-100">Total Given</h3>
        <p className="text-xl sm:text-2xl font-bold text-white">KES {totalGiven.toLocaleString()}</p>
      </Card>
      <Card className="col-span-1 bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg rounded-2xl p-3 text-center">
        <h3 className="text-sm sm:text-base font-semibold text-purple-100">Tithes</h3>
        <p className="text-xl sm:text-2xl font-bold text-white">KES {tithesGiven.toLocaleString()}</p>
      </Card>
      <Card className="col-span-1 bg-gradient-to-br from-green-500 to-green-700 text-white shadow-lg rounded-2xl p-3 text-center">
        <h3 className="text-sm sm:text-base font-semibold text-green-100">Special Offerings</h3>
        <p className="text-xl sm:text-2xl font-bold text-white">KES {specialOfferingsGiven.toLocaleString()}</p>
      </Card>
      <Card className="col-span-1 bg-gradient-to-br from-yellow-500 to-yellow-700 text-white shadow-lg rounded-2xl p-3 text-center">
        <h3 className="text-sm sm:text-base font-semibold text-yellow-100">Project/Support</h3>
        <p className="text-xl sm:text-2xl font-bold text-white">KES {projectSupportGiven.toLocaleString()}</p>
      </Card>
    </div>
  );
};

export default GivingSummaryCards;
