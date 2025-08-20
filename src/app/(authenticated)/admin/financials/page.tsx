"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, Plus, Loader2 } from "lucide-react";
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
  const [financialToDelete, setFinancialToDelete] = useState<string | null>(null);

  const [newFinancial, setNewFinancial] = useState({
    eventId: "",
    budget: 0,
    expenses: 0,
    revenue: 0,
    vendorPayments: {},
  });

  const [editingFinancial, setEditingFinancial] = useState<Financial | null>(null);

  const fetchFinancials = async () => {
    try {
      const res = await fetch("/api/financials");
      if (!res.ok) throw new Error("Failed to fetch financials");
      const data = await res.json();
      const transformedData = data.map((financial: Financial) => ({
        ...financial,
        vendorPayments: Array.isArray(financial.vendorPayments) ? {} : financial.vendorPayments || {},
      }));
      setFinancials(transformedData);
    } catch (err: any) {
      setError(err.message);
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
    }
  };

  useEffect(() => {
    fetchFinancials();
    fetchEvents();
    setLoading(false);
  }, []);

  const handleNewFinancialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFinancial((prev) => ({
      ...prev,
      [name]: name === "budget" || name === "expenses" || name === "revenue" ? parseFloat(value) : value,
    }));
  };

  const handleEditingFinancialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingFinancial((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: name === "budget" || name === "expenses" || name === "revenue" ? parseFloat(value) : value,
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
    } catch (err: any) {
      setError(err.message);
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
    } catch (err: any) {
      setError(err.message);
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleteDialogOpen(false);
      setFinancialToDelete(null);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-8 px-4 max-w-7xl min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Financial Overview</h1>
          <p className="text-lg text-gray-600">Loading financial records...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-8 px-4 max-w-7xl min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Financial Overview</h1>
        <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-base text-red-700 font-medium">Error: {error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="container mx-auto py-12 px-4 max-w-7xl min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Financial Overview</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Efficiently track donations, expenses, and manage church funds with precision and clarity.
        </p>
      </motion.div>

      {/* Add/Edit Financial Record Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="mb-10 border-none shadow-xl rounded-2xl overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
            <CardTitle className="flex items-center text-white text-xl font-semibold">
              {editingFinancial ? (
                <>
                  <Edit className="h-5 w-5 mr-3" />
                  <span>Edit Financial Record</span>
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-3" />
                  <span>Add New Financial Record</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={editingFinancial ? handleUpdateFinancial : handleAddFinancial}>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg shadow-sm"
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label htmlFor="eventId" className="block text-sm font-semibold text-gray-700">
                    Event *
                  </label>
                  <Select
                    onValueChange={(value) => {
                      if (editingFinancial) {
                        setEditingFinancial((prev) => (prev ? { ...prev, eventId: value } : null));
                      } else {
                        setNewFinancial((prev) => ({ ...prev, eventId: value }));
                      }
                    }}
                    value={editingFinancial ? editingFinancial.eventId : newFinancial.eventId}
                  >
                    <SelectTrigger className="w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-lg bg-gray-50">
                      <SelectValue placeholder="Select an Event" />
                    </SelectTrigger>
                    <SelectContent className="shadow-xl rounded-lg bg-white border-gray-200">
                      {events.map((event) => (
                        <SelectItem key={event.id} value={event.id} className="hover:bg-indigo-50 transition-colors">
                          {event.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="budget" className="block text-sm font-semibold text-gray-700">
                    Budget (KES) *
                  </label>
                  <Input
                    type="number"
                    id="budget"
                    name="budget"
                    value={editingFinancial ? editingFinancial.budget : newFinancial.budget}
                    onChange={editingFinancial ? handleEditingFinancialChange : handleNewFinancialChange}
                    step="0.01"
                    required
                    className="focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="expenses" className="block text-sm font-semibold text-gray-700">
                    Expenses (KES) *
                  </label>
                  <Input
                    type="number"
                    id="expenses"
                    name="expenses"
                    value={editingFinancial ? editingFinancial.expenses : newFinancial.expenses}
                    onChange={editingFinancial ? handleEditingFinancialChange : handleNewFinancialChange}
                    step="0.01"
                    required
                    className="focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="revenue" className="block text-sm font-semibold text-gray-700">
                    Revenue (KES) *
                  </label>
                  <Input
                    type="number"
                    id="revenue"
                    name="revenue"
                    value={editingFinancial ? editingFinancial.revenue : newFinancial.revenue}
                    onChange={editingFinancial ? handleEditingFinancialChange : handleNewFinancialChange}
                    step="0.01"
                    required
                    className="focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                {editingFinancial && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingFinancial(null)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg shadow-sm transition-all"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg shadow-md text-white font-semibold transition-all"
                >
                  {editingFinancial ? (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Update Record
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Record
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Financial Records List */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
            <CardTitle className="text-white text-xl font-semibold">Existing Financial Records</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {financials.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-100 sticky top-0">
                    <TableRow>
                      <TableHead className="text-gray-700 font-semibold py-4">Event</TableHead>
                      <TableHead className="text-gray-700 font-semibold py-4">Budget (KES)</TableHead>
                      <TableHead className="text-gray-700 font-semibold py-4">Expenses (KES)</TableHead>
                      <TableHead className="text-gray-700 font-semibold py-4">Revenue (KES)</TableHead>
                      <TableHead className="text-gray-700 font-semibold py-4">Net (KES)</TableHead>
                      <TableHead className="text-gray-700 font-semibold py-4 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financials.map((financial, index) => {
                      const net = financial.revenue - financial.expenses;
                      const eventTitle = events.find((e) => e.id === financial.eventId)?.title || "N/A";

                      return (
                        <motion.tr
                          key={financial.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                          className={`hover:bg-gray-50 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <TableCell className="font-medium py-4">
                            <div className="text-gray-900">{eventTitle}</div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="text-gray-800 font-medium">
                              {financial.budget.toLocaleString("en-KE", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div
                              className={`font-medium ${
                                financial.expenses > financial.budget ? "text-red-600" : "text-gray-800"
                              }`}
                            >
                              {financial.expenses.toLocaleString("en-KE", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="text-gray-800 font-medium">
                              {financial.revenue.toLocaleString("en-KE", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className={`font-medium ${net < 0 ? "text-red-600" : "text-green-600"}`}>
                              {net.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-4">
                            <div className="flex justify-end space-x-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingFinancial(financial)}
                                className="text-indigo-600 hover:text-indigo-900 border-indigo-300 hover:bg-indigo-50 rounded-lg shadow-sm transition-all"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => confirmDelete(financial.id)}
                                className="bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all"
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
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 text-center">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No financial records found</h3>
                <p className="text-gray-500 text-lg">Get started by adding a new financial record above.</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md rounded-2xl shadow-2xl bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-gray-900">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-base">
              Are you sure you want to delete this financial record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg shadow-sm transition-all">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFinancial}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg shadow-md text-white font-semibold transition-all"
            >
              Delete Record
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default AdminFinancialsPage;
