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
          <Button variant={timeFrame === 'daily' ? 'default' : 'outline'} onClick={() => handleTimeFrameChange('daily')}>Daily</Button>
          <Button variant={timeFrame === 'weekly' ? 'default' : 'outline'} onClick={() => handleTimeFrameChange('weekly')} disabled>Weekly</Button>
          <Button variant={timeFrame === 'monthly' ? 'default' : 'outline'} onClick={() => handleTimeFrameChange('monthly')} disabled>Monthly</Button>
          <Button variant={timeFrame === 'annually' ? 'default' : 'outline'} onClick={() => handleTimeFrameChange('annually')} disabled>Annually</Button>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
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
      </CardContent>
    </Card>
  );
};

export default GivingLineChart;
