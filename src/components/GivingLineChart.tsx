"use client";

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'annually';

const GivingLineChart = ({ data }: { data: any }) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('daily');

  const handleTimeFrameChange = (newTimeFrame: TimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

  const chartData = data[timeFrame] || [];

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Giving Over Time</CardTitle>
        <div className="flex space-x-2">
          <Button
            onClick={() => handleTimeFrameChange('daily')}
            className={`font-bold text-center px-4 py-2 rounded-lg shadow-md transition-all duration-300 ${
              timeFrame === 'daily'
                ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            Daily
          </Button>
          <Button
            onClick={() => handleTimeFrameChange('weekly')}
            className={`font-bold text-center px-4 py-2 rounded-lg shadow-md transition-all duration-300 ${
              timeFrame === 'weekly'
                ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            Weekly
          </Button>
          <Button
            onClick={() => handleTimeFrameChange('monthly')}
            className={`font-bold text-center px-4 py-2 rounded-lg shadow-md transition-all duration-300 ${
              timeFrame === 'monthly'
                ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            Monthly
          </Button>
          <Button
            onClick={() => handleTimeFrameChange('annually')}
            className={`font-bold text-center px-4 py-2 rounded-lg shadow-md transition-all duration-300 ${
              timeFrame === 'annually'
                ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            Annually
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 md:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value: number) => `KES ${value.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="Tithes" stroke="#0088FE" />
              <Line type="monotone" dataKey="Special Offerings" stroke="#00C49F" />
              <Line type="monotone" dataKey="Project/Support" stroke="#FFBB28" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default GivingLineChart;
