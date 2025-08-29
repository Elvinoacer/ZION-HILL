"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Users,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Sponsor {
  id: string;
  name: string;
  amount: number;
  contactEmail?: string;
}

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [filteredSponsors, setFilteredSponsors] = useState<Sponsor[]>([]);
  const [newSponsor, setNewSponsor] = useState({
    name: "",
    amount: "",
    contactEmail: "",
  });
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSponsors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/sponsors");
      if (!res.ok) {
        throw new Error("Failed to fetch sponsors");
      }
      const data: Sponsor[] = await res.json();
      setSponsors(data);
      setFilteredSponsors(data);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load sponsors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = sponsors.filter(
        (sponsor) =>
          sponsor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sponsor.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSponsors(filtered);
    } else {
      setFilteredSponsors(sponsors);
    }
  }, [searchTerm, sponsors]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingSponsor) {
      setEditingSponsor((prev) => ({
        ...prev!,
        [name]: name === "amount" ? parseFloat(value) || "" : value,
      }));
    } else {
      setNewSponsor((prev) => ({
        ...prev,
        [name]: name === "amount" ? parseFloat(value) || "" : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const sponsorData = editingSponsor || newSponsor;
    const method = editingSponsor ? "PUT" : "POST";
    const url = editingSponsor
      ? `/api/sponsors?id=${editingSponsor.id}`
      : "/api/sponsors";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...sponsorData,
          amount: parseFloat(String(sponsorData.amount)), // Ensure amount is a number
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error ||
            `Failed to ${editingSponsor ? "update" : "create"} sponsor`
        );
      }

      toast.success(
        `Sponsor ${editingSponsor ? "updated" : "created"} successfully!`
      );
      setNewSponsor({ name: "", amount: "", contactEmail: "" });
      setEditingSponsor(null);
      fetchSponsors(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sponsor?")) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/sponsors?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete sponsor");
      }

      toast.success("Sponsor deleted successfully!");
      fetchSponsors(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <p className="text-lg font-medium text-gray-700">
            Loading sponsors...
          </p>
          <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-500 max-w-md w-full">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-800">
              Error Loading Sponsors
            </h3>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={fetchSponsors}
            className="w-full bg-red-500 hover:bg-red-600"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Sponsor Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your sponsors and their contributions
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search sponsors..."
                className="pl-10 pr-4 py-2 rounded-full bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sponsor Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="rounded-2xl shadow-lg border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="flex items-center">
                  {editingSponsor ? (
                    <>
                      <Edit className="h-5 w-5 mr-2" />
                      Edit Sponsor
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Add New Sponsor
                    </>
                  )}
                </CardTitle>
                <CardDescription className="text-blue-100">
                  {editingSponsor
                    ? "Update the details of the sponsor."
                    : "Fill in the details to add a new sponsor."}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-700 mb-2 block">
                      Sponsor Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={editingSponsor?.name || newSponsor.name}
                      onChange={handleInputChange}
                      required
                      className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="amount"
                      className="text-gray-700 mb-2 block"
                    >
                      Amount (KES)
                    </Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      value={editingSponsor?.amount || newSponsor.amount}
                      onChange={handleInputChange}
                      required
                      className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="contactEmail"
                      className="text-gray-700 mb-2 block"
                    >
                      Contact Email (Optional)
                    </Label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={
                        editingSponsor?.contactEmail || newSponsor.contactEmail
                      }
                      onChange={handleInputChange}
                      className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-lg py-3 bg-blue-600 hover:bg-blue-700 transition-colors shadow-md"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : editingSponsor ? (
                      <>
                        <Edit className="mr-2 h-4 w-4" />
                        Update Sponsor
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Sponsor
                      </>
                    )}
                  </Button>
                  {editingSponsor && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingSponsor(null)}
                      className="w-full mt-2 rounded-lg py-3 border-gray-300"
                    >
                      Cancel Edit
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sponsors List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="rounded-2xl shadow-lg border-0 overflow-hidden">
              <CardHeader className="bg-white border-b">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-800">
                      All Sponsors
                    </CardTitle>
                    <CardDescription>
                      A list of all registered sponsors.{" "}
                      {filteredSponsors.length} found
                    </CardDescription>
                  </div>
                  {filteredSponsors.length > 0 && (
                    <div className="mt-2 md:mt-0">
                      <span className="text-sm font-medium text-gray-700">
                        Total: KES{" "}
                        {filteredSponsors
                          .reduce((sum, sponsor) => sum + sponsor.amount, 0)
                          .toLocaleString("en-US")}
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredSponsors.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No sponsors found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm
                        ? "Try a different search term"
                        : "Get started by adding your first sponsor"}
                    </p>
                    {searchTerm ? (
                      <Button
                        onClick={() => setSearchTerm("")}
                        className="rounded-lg"
                      >
                        Clear Search
                      </Button>
                    ) : (
                      <Button
                        onClick={() => document.getElementById("name")?.focus()}
                        className="rounded-lg bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Sponsor
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                          <TableHead className="text-gray-600 font-semibold py-4">
                            Name
                          </TableHead>
                          <TableHead className="text-gray-600 font-semibold">
                            Amount
                          </TableHead>
                          <TableHead className="text-gray-600 font-semibold">
                            Contact Email
                          </TableHead>
                          <TableHead className="text-right text-gray-600 font-semibold">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence>
                          {filteredSponsors.map((sponsor) => (
                            <motion.tr
                              key={sponsor.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.2 }}
                              className="border-t hover:bg-gray-50 transition-colors"
                            >
                              <TableCell className="font-medium py-4">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {sponsor.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-gray-900 font-medium">
                                      {sponsor.name}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="font-semibold text-blue-600">
                                  KES {sponsor.amount.toLocaleString("en-US")}
                                </span>
                              </TableCell>
                              <TableCell>
                                {sponsor.contactEmail ? (
                                  <a
                                    href={`mailto:${sponsor.contactEmail}`}
                                    className="text-blue-600 hover:underline"
                                  >
                                    {sponsor.contactEmail}
                                  </a>
                                ) : (
                                  <span className="text-gray-400">N/A</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingSponsor(sponsor)}
                                    className="rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50"
                                    disabled={submitting}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(sponsor.id)}
                                    disabled={submitting}
                                    className="rounded-lg border-red-200 text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
