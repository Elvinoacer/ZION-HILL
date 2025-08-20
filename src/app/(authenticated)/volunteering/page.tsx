'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface VolunteeringOpportunity {
  id: string;
  title: string;
  description: string;
  type: string;
  imageUrl?: string;
  requiredPeople: number;
  currentApplicants: number;
  isAssigned: boolean;
  coordinator: {
    name: string;
  };
  applications: {
    id: string;
    status: string;
    applicant: {
      id: string;
    };
  }[];
  customFields: any;
}

interface UserApplication {
  id: string;
  opportunityId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedAt: string;
  opportunity: {
    title: string;
  };
}

export default function VolunteeringPage() {
  const { data: session, status } = useSession();
  const [opportunities, setOpportunities] = useState<VolunteeringOpportunity[]>([]);
  const [userApplications, setUserApplications] = useState<UserApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [session]); // Refetch data when session changes

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all public opportunities
      const opportunitiesRes = await fetch('/api/volunteering-opportunities');
      if (!opportunitiesRes.ok) {
        throw new Error('Failed to fetch opportunities');
      }
      const opportunitiesData = await opportunitiesRes.json();
      setOpportunities(opportunitiesData);

      // Fetch user's applications if authenticated
      if (session?.user) {
        const userApplicationsRes = await fetch('/api/volunteering-applications');
        if (!userApplicationsRes.ok) {
          throw new Error('Failed to fetch user applications');
        }
        const userApplicationsData = await userApplicationsRes.json();
        setUserApplications(userApplicationsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load volunteering data.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (opportunityId: string) => {
    if (status !== 'authenticated') {
      toast.info('Please log in to apply for volunteering opportunities.');
      return;
    }

    setApplying(opportunityId);
    try {
      const res = await fetch('/api/volunteering-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ opportunityId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to apply for opportunity');
      }

      toast.success('Application submitted successfully!');
      fetchData(); // Refresh all data
    } catch (error: any) {
      console.error('Error applying:', error);
      toast.error(error.message || 'Failed to submit application.');
    } finally {
      setApplying(null);
    }
  };

  const handleWithdraw = async (applicationId: string) => {
    if (!confirm('Are you sure you want to withdraw this application?')) {
      return;
    }
    setWithdrawing(applicationId);
    try {
      const res = await fetch(`/api/volunteering-applications/${applicationId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to withdraw application');
      }

      toast.success('Application withdrawn successfully!');
      fetchData(); // Refresh all data
    } catch (error: any) {
      console.error('Error withdrawing:', error);
      toast.error(error.message || 'Failed to withdraw application.');
    } finally {
      setWithdrawing(null);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading opportunities...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Volunteering Opportunities</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.length === 0 ? (
          <p>No volunteering opportunities available at the moment.</p>
        ) : (
          opportunities.map((opportunity) => {
            const userApplication = userApplications.find(
              (app) => app.opportunityId === opportunity.id
            );
            const hasApplied = !!userApplication;

            return (
              <Card key={opportunity.id} className="flex flex-col">
                {opportunity.imageUrl && (
                  <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                    <img
                      src={opportunity.imageUrl}
                      alt={opportunity.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{opportunity.title}</CardTitle>
                  <p className="text-sm text-gray-500">Type: {opportunity.type}</p>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <p className="text-gray-700 mb-4">{opportunity.description}</p>
                  {opportunity.customFields && (
                    <div className="mb-4">
                      {Object.entries(opportunity.customFields).map(([key, value]) => (
                        <p key={key} className="text-sm text-gray-600">
                          <strong>{key}:</strong> {String(value)}
                        </p>
                      ))}
                    </div>
                  )}
                  <div className="mt-auto">
                    <p className="text-sm text-gray-600">
                      Required: {opportunity.requiredPeople} people
                    </p>
                    <p className="text-sm text-gray-600">
                      Applicants: {opportunity.currentApplicants}
                    </p>
                    <p className="text-sm text-gray-600">
                      Coordinator: {opportunity.coordinator?.name || 'N/A'}
                    </p>
                    {opportunity.isAssigned && (
                      <p className="text-sm text-green-600 font-semibold">
                        This opportunity is fully assigned!
                      </p>
                    )}
                    {session?.user && !opportunity.isAssigned && (
                      <>
                        {hasApplied ? (
                          <div className="flex items-center justify-between mt-4">
                            <p className="text-sm text-gray-700">
                              Your Status:{' '}
                              <Badge
                                className={`${
                                  userApplication?.status === 'APPROVED'
                                    ? 'bg-green-500'
                                    : userApplication?.status === 'REJECTED'
                                    ? 'bg-red-500'
                                    : 'bg-yellow-500'
                                }`}
                              >
                                {userApplication?.status}
                              </Badge>
                            </p>
                            {userApplication?.status === 'PENDING' && (
                              <Button
                                variant="outline"
                                onClick={() => handleWithdraw(userApplication.id)}
                                disabled={withdrawing === userApplication.id}
                              >
                                {withdrawing === userApplication.id ? 'Withdrawing...' : 'Withdraw'}
                              </Button>
                            )}
                          </div>
                        ) : (
                          <Button
                            onClick={() => handleApply(opportunity.id)}
                            disabled={applying === opportunity.id}
                            className="mt-4 w-full"
                          >
                            {applying === opportunity.id ? 'Applying...' : 'Apply Now'}
                          </Button>
                        )}
                      </>
                    )}
                    {!session?.user && !opportunity.isAssigned && (
                      <Button className="mt-4 w-full" disabled>
                        Log in to Apply
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {session?.user && userApplications.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">My Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userApplications.map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <CardTitle>{app.opportunity.title}</CardTitle>
                  <p className="text-sm text-gray-500">Applied On: {new Date(app.appliedAt).toLocaleDateString()}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    Status:{' '}
                    <Badge
                      className={`${
                        app.status === 'APPROVED'
                          ? 'bg-green-500'
                          : app.status === 'REJECTED'
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                      }`}
                    >
                      {app.status}
                    </Badge>
                  </p>
                  {app.status === 'PENDING' && (
                    <Button
                      variant="outline"
                      onClick={() => handleWithdraw(app.id)}
                      disabled={withdrawing === app.id}
                      className="mt-4 w-full"
                    >
                      {withdrawing === app.id ? 'Withdrawing...' : 'Withdraw'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
