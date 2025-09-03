import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GivingPieChart from "./GivingPieChart";
import GivingLineChart from "./GivingLineChart";
import {
  format,
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
} from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  BarChart3,
  PieChart,
  Download,
} from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: string;
  method: string;
  status: string;
}

interface GivingDashboardProps {
  givingHistory: Transaction[];
}

const GivingDashboard = ({ givingHistory }: GivingDashboardProps) => {
  const [activeTimeFrame, setActiveTimeFrame] = useState<
    "daily" | "weekly" | "monthly" | "annually"
  >("monthly");
  const [isExpanded, setIsExpanded] = useState(false);

  // Process data for Pie Chart
  const pieChartData = givingHistory.reduce((acc, t) => {
    const existing = acc.find((item) => item.name === t.type);
    if (existing) {
      existing.value += t.amount;
    } else {
      acc.push({ name: t.type, value: t.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Process data for Line Chart
  const processLineChartData = (
    history: Transaction[],
    timeFrame: "daily" | "weekly" | "monthly" | "annually"
  ) => {
    if (history.length === 0) return [];

    const sortedHistory = [...history].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const firstDate = new Date(sortedHistory[0].date);
    const lastDate = new Date(sortedHistory[sortedHistory.length - 1].date);

    let interval: Date[] = [];
    let dateFormat = "";

    switch (timeFrame) {
      case "daily":
        interval = eachDayOfInterval({
          start: startOfDay(firstDate),
          end: startOfDay(lastDate),
        });
        dateFormat = "MMM d";
        break;
      case "weekly":
        interval = eachWeekOfInterval({
          start: startOfWeek(firstDate),
          end: startOfWeek(lastDate),
        });
        dateFormat = "MMM d, yyyy";
        break;
      case "monthly":
        interval = eachMonthOfInterval({
          start: startOfMonth(firstDate),
          end: startOfMonth(lastDate),
        });
        dateFormat = "MMM yyyy";
        break;
      case "annually":
        interval = eachYearOfInterval({
          start: startOfYear(firstDate),
          end: startOfYear(lastDate),
        });
        dateFormat = "yyyy";
        break;
    }

    const aggregatedData = interval.map((date) => {
      const formattedDate = format(date, dateFormat);
      return {
        date: formattedDate,
        Tithes: 0,
        "Special Offerings": 0,
        "Project/Support": 0,
      };
    });

    history.forEach((t) => {
      let keyDate: Date;
      switch (timeFrame) {
        case "daily":
          keyDate = startOfDay(new Date(t.date));
          break;
        case "weekly":
          keyDate = startOfWeek(new Date(t.date));
          break;
        case "monthly":
          keyDate = startOfMonth(new Date(t.date));
          break;
        case "annually":
          keyDate = startOfYear(new Date(t.date));
          break;
      }
      const formattedKeyDate = format(keyDate, dateFormat);
      const dataPoint = aggregatedData.find((d) => d.date === formattedKeyDate);
      if (dataPoint) {
        dataPoint[
          t.type as "Tithes" | "Special Offerings" | "Project/Support"
        ] += t.amount;
      }
    });

    return aggregatedData;
  };

  const lineChartData = {
    daily: processLineChartData(givingHistory, "daily"),
    weekly: processLineChartData(givingHistory, "weekly"),
    monthly: processLineChartData(givingHistory, "monthly"),
    annually: processLineChartData(givingHistory, "annually"),
  };

  // Calculate total given for display
  const totalGiven =
    givingHistory.reduce((acc, curr) => acc + curr.amount, 0) || 0;

  const exportData = () => {
    // In a real implementation, this would export the data as CSV
    alert("Export functionality would be implemented here");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-12"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
          Giving Analytics
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportData}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 sm:hidden"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
        </div>
      </div>

      <motion.div
        className={`overflow-hidden ${
          isExpanded ? "block" : "hidden sm:block"
        }`}
        animate={{ height: isExpanded ? "auto" : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border-0 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                Total Given: KES {totalGiven.toLocaleString()}
              </CardTitle>

              <Tabs
                value={activeTimeFrame}
                onValueChange={(v) => setActiveTimeFrame(v as any)}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                  <TabsTrigger value="daily" className="text-xs py-1">
                    Day
                  </TabsTrigger>
                  <TabsTrigger value="weekly" className="text-xs py-1">
                    Week
                  </TabsTrigger>
                  <TabsTrigger value="monthly" className="text-xs py-1">
                    Month
                  </TabsTrigger>
                  <TabsTrigger value="annually" className="text-xs py-1">
                    Year
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="grid grid-cols-1 gap-6 mt-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl"
              >
                <div className="flex items-center gap-2 mb-4">
                  <PieChart className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">Distribution by Type</h3>
                </div>
                <GivingPieChart data={pieChartData} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl"
              >
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-5 w-5 text-indigo-500" />
                  <h3 className="font-semibold">Giving Over Time</h3>
                </div>
                <GivingLineChart
                  data={lineChartData}
                  activeTimeFrame={activeTimeFrame}
                />
              </motion.div>
            </div>

            {givingHistory.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No giving history available yet.</p>
                <p className="text-sm">
                  Your giving analytics will appear here once you make
                  givings.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default GivingDashboard;
