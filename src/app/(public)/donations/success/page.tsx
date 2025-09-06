"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function DonationSuccessPage() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const trackingId = searchParams.get("tracking_id");

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-green-100 rounded-full p-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="mt-4">Donation Successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Thank you for your generous contribution. Your support is greatly
            appreciated.
          </p>
          <div className="mt-6 space-y-2 text-sm">
            {transactionId && (
              <div className="flex justify-between">
                <span className="font-semibold">Transaction ID:</span>
                <span>{transactionId}</span>
              </div>
            )}
            {trackingId && (
              <div className="flex justify-between">
                <span className="font-semibold">Tracking ID:</span>
                <span>{trackingId}</span>
              </div>
            )}
          </div>
          <div className="mt-8 flex justify-center space-x-4">
            <Button asChild>
              <Link href="/member/giving">View Your Giving History</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
