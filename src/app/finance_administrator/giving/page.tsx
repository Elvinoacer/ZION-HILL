'use client';
import { useSession } from 'next-auth/react';
import GivingOpportunities from '@/components/finance_administrator/GivingOpportunities';
import GivingProgress from '@/components/finance_administrator/GivingProgress';
import { RoleName } from '@/generated/prisma';

const GivingPage = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!session || !session.user.roles.includes(RoleName.FINANCE_ADMINISTRATOR)) {
    return <div className="flex justify-center items-center h-screen">Access Denied</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Giving Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all giving opportunities.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <GivingOpportunities />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <GivingProgress />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GivingPage;
