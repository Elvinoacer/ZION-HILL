"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const InboxPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Secretary Inbox</h1>
      <p className="text-lg text-gray-600 mb-4">
        This page will display the unified inbox for managing communications.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Unified Inbox</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Inbox content will appear here. (Under Development)</p>
          <Button className="mt-4" onClick={() => window.history.back()}>Go Back to Dashboard</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InboxPage;
