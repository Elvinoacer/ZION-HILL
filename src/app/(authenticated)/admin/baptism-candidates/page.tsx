import React from 'react';
import BaptismCandidatesList from '@/components/admin/BaptismCandidatesList';

const BaptismCandidatesPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Baptism Candidates</h1>
      <BaptismCandidatesList />
    </div>
  );
};

export default BaptismCandidatesPage;
