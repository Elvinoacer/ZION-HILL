"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BookingsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Secretary Bookings</h1>
      <p className="text-base sm:text-lg text-gray-300 mb-6">
        This page will allow managing facility and equipment bookings.
      </p>
      <Card className="bg-gray-800 border-gray-700/50 shadow-lg text-white">
        <CardHeader className="bg-gray-700/30 pb-3">
          <CardTitle className="text-xl sm:text-2xl font-bold text-blue-400">Facility & Equipment Bookings</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-base text-gray-300 mb-4">Booking management tools will appear here. (Under Development)</p>
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base py-2" onClick={() => window.history.back()}>Go Back to Dashboard</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsPage;
