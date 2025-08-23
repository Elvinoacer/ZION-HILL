"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Edit,
  Plus,
  Loader2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Filter,
  Search,
  ChevronDown,
  X,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Financial {
  id: string;
  eventId: string;
  budget: number;
  expenses: number;
  revenue: number;
  vendorPayments: any;
}

interface Event {
  id: string;
  title: string;
}

const AdminFinancialsPage = () => {
  const [financials, setFinancials] = useState<Financial[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [financialToDelete, setFinancialToDelete] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const [newFinancial, setNewFinancial] = useState({
    eventId: "",
    budget: 0,
    expenses: 0,
    revenue: 0,
    vendorPayments: {},
  });

  const [editingFinancial, setEditingFinancial] = useState<Financial | null>(
    null
  );

  const fetchFinancials = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/financials");
      if (!res.ok) throw new Error("Failed to fetch financials");
      const data = await res.json();
      const transformedData = data.map((financial: Financial) => ({
        ...financial,
        vendorPayments: Array.isArray(financial.vendorPayments)
          ? {}
          : financial.vendorPayments || {},
      }));
      setFinancials(transformedData);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load financial records");
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load events");
    }
  };

  useEffect(() => {
    fetchFinancials();
    fetchEvents();
  }, []);

  // Filter financials based on search and status filter
  const filteredFinancials = financials.filter((financial) => {
    const event = events.find((e) => e.id === financial.eventId);
    const matchesSearch =
      searchQuery === "" ||
      (event?.title.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const net = financial.revenue - financial.expenses;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "profit" && net > 0) ||
      (statusFilter === "loss" && net < 0) ||
      (statusFilter === "breakEven" && net === 0);

    return matchesSearch && matchesStatus;
  });

  const handleNewFinancialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFinancial((prev) => ({
      ...prev,
      [name]:
        name === "budget" || name === "expenses" || name === "revenue"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleEditingFinancialChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setEditingFinancial((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]:
          name === "budget" || name === "expenses" || name === "revenue"
            ? parseFloat(value)
            : value,
      };
    });
  };

  const handleAddFinancial = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/financials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFinancial),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add financial record");
      }

      setNewFinancial({
        eventId: "",
        budget: 0,
        expenses: 0,
        revenue: 0,
        vendorPayments: {},
      });
      fetchFinancials();
      toast.success("Financial record added successfully!");
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to add financial record: ${err.message}`);
    }
  };

  const handleUpdateFinancial = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!editingFinancial) return;

    try {
      const res = await fetch(`/api/financials?id=${editingFinancial.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingFinancial),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update financial record");
      }

      setEditingFinancial(null);
      fetchFinancials();
      toast.success("Financial record updated successfully!");
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to update financial record: ${err.message}`);
    }
  };

  const confirmDelete = (id: string) => {
    setFinancialToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteFinancial = async () => {
    if (!financialToDelete) return;

    setError(null);
    try {
      const res = await fetch(`/api/financials?id=${financialToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete financial record");
      }

      fetchFinancials();
      toast.success("Financial record deleted successfully!");
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to delete financial record: ${err.message}`);
    } finally {
      setDeleteDialogOpen(false);
      setFinancialToDelete(null);
    }
  };

  // Calculate statistics
  const stats = {
    totalRecords: financials.length,
    totalBudget: financials.reduce((sum, f) => sum + f.budget, 0),
    totalExpenses: financials.reduce((sum, f) => sum + f.expenses, 0),
    totalRevenue: financials.reduce((sum, f) => sum + f.revenue, 0),
    netProfit: financials.reduce((sum, f) => sum + (f.revenue - f.expenses), 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-10 w-10 text-blue-600 mb-4" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Financial Management
            </h1>
            <p className="text-gray-600">Loading financial records...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Financial Management
          </h1>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">Error: {error}</p>
                <button
                  onClick={fetchFinancials}
                  className="mt-2 text-sm font-medium text-red-800 hover:text-red-900 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Financial Management
          </h1>
          <p className="text-lg text-gray-600">
            Track and manage church finances, budgets, and expenses
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-blue-800">Total Budget</p>
                  <p className="text-2xl font-bold text-gray-900">
                    KES {stats.totalBudget.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingDown className="h-6 w-6 text-red-600 mr-3" />
                <div>
                  <p className="text-sm text-red-800">Total Expenses</p>
                  <p className="text-2xl font-bold text-gray-900">
                    KES {stats.totalExpenses.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-green-800">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    KES {stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign
                  className={`h-6 w-6 ${
                    stats.netProfit >= 0 ? "text-green-600" : "text-red-600"
                  } mr-3`}
                />
                <div>
                  <p className="text-sm text-gray-800">Net Profit/Loss</p>
                  <p
                    className={`text-2xl font-bold ${
                      stats.netProfit >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    KES {stats.netProfit.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Add/Edit Financial Record Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-6 w-6" />
                {editingFinancial
                  ? "Edit Financial Record"
                  : "Add New Financial Record"}
              </CardTitle>
              <CardDescription className="text-blue-100">
                {editingFinancial
                  ? "Update the financial details for this event"
                  : "Add a new financial record for an event"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form
                onSubmit={
                  editingFinancial ? handleUpdateFinancial : handleAddFinancial
                }
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="eventId"
                      className="block text-gray-700 text-sm font-medium mb-2"
                    >
                      Event
                    </label>
                    <Select
                      required
                      onValueChange={(value) => {
                        if (editingFinancial) {
                          setEditingFinancial((prev) =>
                            prev ? { ...prev, eventId: value } : null
                          );
                        } else {
                          setNewFinancial((prev) => ({
                            ...prev,
                            eventId: value,
                          }));
                        }
                      }}
                      value={
                        editingFinancial
                          ? editingFinancial.eventId
                          : newFinancial.eventId
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an Event" />
                      </SelectTrigger>
                      <SelectContent>
                        {events.map((event) => (
                          <SelectItem key={event.id} value={event.id}>
                            {event.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="budget"
                    className="block text-gray-700 text-sm font-medium mb-2"
                  >
                    Budget (KES)
                  </label>
                  <Input
                    type="number"
                    id="budget"
                    name="budget"
                    value={
                      editingFinancial
                        ? editingFinancial.budget
                        : newFinancial.budget
                    }
                    onChange={
                      editingFinancial
                        ? handleEditingFinancialChange
                        : handleNewFinancialChange
                    }
                    step="0.01"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label
                    htmlFor="expenses"
                    className="block text-gray-700 text-sm font-medium mb-2"
                  >
                    Expenses (KES)
                  </label>
                  <Input
                    type="number"
                    id="expenses"
                    name="expenses"
                    value={
                      editingFinancial
                        ? editingFinancial.expenses
                        : newFinancial.expenses
                    }
                    onChange={
                      editingFinancial
                        ? handleEditingFinancialChange
                        : handleNewFinancialChange
                    }
                    step="0.01"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label
                    htmlFor="revenue"
                    className="block text-gray-700 text-sm font-medium mb-2"
                  >
                    Revenue (KES)
                  </label>
                  <Input
                    type="number"
                    id="revenue"
                    name="revenue"
                    value={
                      editingFinancial
                        ? editingFinancial.revenue
                        : newFinancial.revenue
                    }
                    onChange={
                      editingFinancial
                        ? handleEditingFinancialChange
                        : handleNewFinancialChange
                    }
                    step="0.01"
                    required
                    className="w-full"
                  />
                </div>

                <div className="md:col-span-2 flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {editingFinancial ? "Update Record" : "Add Record"}
                  </Button>
                  {editingFinancial && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingFinancial(null)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Financial Records List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-white">
                    Financial Records
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    {filteredFinancials.length} of {financials.length} records
                  </CardDescription>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                    />
                  </div>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    <ChevronDown
                      className={`h-4 w-4 ml-2 transition-transform ${
                        showFilters ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            </CardHeader>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-gray-50 border-b border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Financial Status
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">All Status</option>
                        <option value="profit">Profit</option>
                        <option value="loss">Loss</option>
                        <option value="breakEven">Break Even</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <CardContent className="p-0">
              <AnimatePresence mode="wait">
                {filteredFinancials.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="overflow-x-auto"
                  >
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="text-gray-600 font-medium">
                            Event
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium">
                            Budget (KES)
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium">
                            Expenses (KES)
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium">
                            Revenue (KES)
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium">
                            Net (KES)
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium">
                            Status
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredFinancials.map((financial, index) => {
                          const event = events.find(
                            (e) => e.id === financial.eventId
                          );
                          const net = financial.revenue - financial.expenses;
                          const status =
                            net > 0 ? "profit" : net < 0 ? "loss" : "breakEven";

                          return (
                            <motion.tr
                              key={financial.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="hover:bg-gray-50"
                            >
                              <TableCell>
                                <div className="font-medium text-gray-900">
                                  {event?.title || "N/A"}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-gray-800">
                                  {financial.budget.toLocaleString()}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-red-600">
                                  {financial.expenses.toLocaleString()}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-green-600">
                                  {financial.revenue.toLocaleString()}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div
                                  className={`font-medium ${
                                    net >= 0 ? "text-green-600" : "text-red-600"
                                  }`}
                                >
                                  {net.toLocaleString()}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    status === "profit"
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : status === "loss"
                                      ? "bg-red-100 text-red-800 border-red-200"
                                      : "bg-gray-100 text-gray-800 border-gray-200"
                                  }
                                >
                                  {status === "profit"
                                    ? "Profit"
                                    : status === "loss"
                                    ? "Loss"
                                    : "Break Even"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      setEditingFinancial(financial)
                                    }
                                    className="h-8 w-8 p-0 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => confirmDelete(financial.id)}
                                    className="h-8 w-8 p-0 text-gray-600 hover:text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </motion.tr>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8 text-center"
                  >
                    <div className="bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-300">
                      <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">
                        No financial records found
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {searchQuery || statusFilter !== "all"
                          ? "Try adjusting your search or filters"
                          : "Get started by adding your first financial record"}
                      </p>
                      <Button
                        onClick={() => {
                          setEditingFinancial(null);
                          setNewFinancial({
                            eventId: "",
                            budget: 0,
                            expenses: 0,
                            revenue: 0,
                            vendorPayments: {},
                          });
                        }}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Record
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="max-w-md rounded-xl shadow-xl border-0">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-gray-800">
                Confirm Deletion
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Are you sure you want to delete this financial record? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteFinancial}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg"
              >
                Delete Record
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminFinancialsPage;
