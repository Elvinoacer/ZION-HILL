"use client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FinancialSupportRequest {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  amountRequested: number;
  reason: string;
  status: string;
  createdAt: string;
}

export default function FinancialSupportRequests() {
  const [requests, setRequests] = useState<FinancialSupportRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/financial-support");
      if (!response.ok) {
        throw new Error("Failed to fetch requests.");
      }
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      toast.error("Failed to load financial support requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/financial-support/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status.");
      }

      toast.success("Status updated successfully.");
      fetchRequests(); // Refresh the list
    } catch (error: any) {
      toast.error("An error occurred while updating the status.");
      console.error(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Financial Support Requests</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.name}</TableCell>
              <TableCell>{request.email}</TableCell>
              <TableCell>KES {request.amountRequested.toFixed(2)}</TableCell>
              <TableCell>{request.reason}</TableCell>
              <TableCell>
                <Badge>{request.status}</Badge>
              </TableCell>
              <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button size="sm" onClick={() => handleStatusChange(request.id, "APPROVED")}>Approve</Button>
                <Button size="sm" variant="destructive" className="ml-2" onClick={() => handleStatusChange(request.id, "REJECTED")}>Reject</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
