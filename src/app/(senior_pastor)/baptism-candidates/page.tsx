import React from 'react';
import BaptismCandidatesList from '@/components/admin/BaptismCandidatesList';

const BaptismCandidatesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Baptism Candidates</h1>
      <BaptismCandidatesList />
    </div>
  );
};

export default BaptismCandidatesPage;
