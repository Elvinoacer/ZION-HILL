"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  X,
  Building,
  MapPin,
  Phone,
  BookOpen,
  Upload,
  ImageIcon,
  Loader2,
  School,
  Heart,
  Book,
  GraduationCap,
} from "lucide-react";
import Image from "next/image";

interface Institution {
  id: string;
  name: string;
  type: string;
  description?: string;
  address?: string;
  contactInfo?: string;
  imageUrl?: string;
}

const AdminInstitutionsPage = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const [newInstitution, setNewInstitution] = useState({
    name: "",
    type: "",
    description: "",
    address: "",
    contactInfo: "",
    imageUrl: "",
  });

  const [editingInstitution, setEditingInstitution] =
    useState<Institution | null>(null);

  const institutionTypes = [
    {
      value: "School",
      label: "School",
      icon: <School className="h-4 w-4" />,
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      value: "Kindergarten",
      label: "Kindergarten",
      icon: <GraduationCap className="h-4 w-4" />,
      color: "bg-green-100 text-green-800 border-green-200",
    },
    {
      value: "Vocational Training Center",
      label: "Vocational Center",
      icon: <Book className="h-4 w-4" />,
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
    {
      value: "Health Clinic",
      label: "Health Clinic",
      icon: <Heart className="h-4 w-4" />,
      color: "bg-red-100 text-red-800 border-red-200",
    },
    {
      value: "Library",
      label: "Library",
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-amber-100 text-amber-800 border-amber-200",
    },
  ];

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/institutions");
      if (!res.ok) throw new Error("Failed to fetch institutions");
      const data = await res.json();
      setInstitutions(data);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load institutions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  // Filter institutions based on search and type filter
  const filteredInstitutions = institutions.filter((institution) => {
    const matchesSearch =
      searchQuery === "" ||
      institution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      institution.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      institution.address?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" || institution.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleNewInstitutionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewInstitution((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditingInstitutionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditingInstitution((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleNewInstitutionTypeChange = (value: string) => {
    setNewInstitution((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleEditingInstitutionTypeChange = (value: string) => {
    setEditingInstitution((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        type: value,
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploadLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await res.json();
      const imageUrl = data.url;

      if (editingInstitution) {
        setEditingInstitution((prev) => ({
          ...prev!,
          imageUrl: imageUrl,
        }));
      } else {
        setNewInstitution((prev) => ({
          ...prev,
          imageUrl: imageUrl,
        }));
      }
      toast.success("Image uploaded successfully!");
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to upload image.");
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleAddInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/institutions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newInstitution),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add institution");
      }

      setNewInstitution({
        name: "",
        type: "",
        description: "",
        address: "",
        contactInfo: "",
        imageUrl: "",
      });
      fetchInstitutions();
      toast.success("Institution added successfully!");
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to add institution: ${err.message}`);
    }
  };

  const handleUpdateInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!editingInstitution) return;

    try {
      const res = await fetch(`/api/institutions?id=${editingInstitution.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingInstitution),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update institution");
      }

      setEditingInstitution(null);
      fetchInstitutions();
      toast.success("Institution updated successfully!");
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to update institution: ${err.message}`);
    }
  };

  const handleDeleteInstitution = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this institution? This action cannot be undone."
      )
    ) {
      return;
    }

    setError(null);
    try {
      const res = await fetch(`/api/institutions?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete institution");
      }

      fetchInstitutions();
      toast.success("Institution deleted successfully!");
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to delete institution: ${err.message}`);
    }
  };

  const stats = {
    total: institutions.length,
    schools: institutions.filter((i) => i.type === "School").length,
    clinics: institutions.filter((i) => i.type === "Health Clinic").length,
    libraries: institutions.filter((i) => i.type === "Library").length,
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
              Institution Management
            </h1>
            <p className="text-gray-600">Loading institutions...</p>
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
            Institution Management
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
                  onClick={fetchInstitutions}
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
            Institution Management
          </h1>
          <p className="text-lg text-gray-600">
            Manage church-owned institutions including schools, clinics, and
            community centers
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
                <Building className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-blue-800">Total Institutions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <School className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-green-800">Schools</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.schools}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="h-6 w-6 text-red-600 mr-3" />
                <div>
                  <p className="text-sm text-red-800">Health Clinics</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.clinics}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-6 w-6 text-amber-600 mr-3" />
                <div>
                  <p className="text-sm text-amber-800">Libraries</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.libraries}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Add/Edit Institution Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <CardTitle className="text-white flex items-center gap-2">
                <Building className="h-6 w-6" />
                {editingInstitution
                  ? "Edit Institution"
                  : "Add New Institution"}
              </CardTitle>
              <CardDescription className="text-blue-100">
                {editingInstitution
                  ? "Update the details of this institution"
                  : "Add a new church-owned institution to the system"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form
                onSubmit={
                  editingInstitution
                    ? handleUpdateInstitution
                    : handleAddInstitution
                }
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-gray-700 text-sm font-medium mb-2"
                    >
                      Name
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={
                        editingInstitution
                          ? editingInstitution.name
                          : newInstitution.name
                      }
                      onChange={
                        editingInstitution
                          ? handleEditingInstitutionChange
                          : handleNewInstitutionChange
                      }
                      required
                      className="w-full"
                      placeholder="Enter institution name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="type"
                      className="block text-gray-700 text-sm font-medium mb-2"
                    >
                      Type
                    </label>
                    <Select
                      onValueChange={
                        editingInstitution
                          ? handleEditingInstitutionTypeChange
                          : handleNewInstitutionTypeChange
                      }
                      value={
                        editingInstitution
                          ? editingInstitution.type
                          : newInstitution.type
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select institution type" />
                      </SelectTrigger>
                      <SelectContent>
                        {institutionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center">
                              {type.icon}
                              <span className="ml-2">{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-gray-700 text-sm font-medium mb-2"
                  >
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={
                      editingInstitution
                        ? editingInstitution.description || ""
                        : newInstitution.description
                    }
                    onChange={
                      editingInstitution
                        ? handleEditingInstitutionChange
                        : handleNewInstitutionChange
                    }
                    rows={4}
                    className="w-full"
                    placeholder="Enter a description of the institution"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-gray-700 text-sm font-medium mb-2"
                  >
                    Address
                  </label>
                  <Input
                    type="text"
                    id="address"
                    name="address"
                    value={
                      editingInstitution
                        ? editingInstitution.address || ""
                        : newInstitution.address
                    }
                    onChange={
                      editingInstitution
                        ? handleEditingInstitutionChange
                        : handleNewInstitutionChange
                    }
                    className="w-full"
                    placeholder="Enter full address"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contactInfo"
                    className="block text-gray-700 text-sm font-medium mb-2"
                  >
                    Contact Information
                  </label>
                  <Input
                    type="text"
                    id="contactInfo"
                    name="contactInfo"
                    value={
                      editingInstitution
                        ? editingInstitution.contactInfo || ""
                        : newInstitution.contactInfo
                    }
                    onChange={
                      editingInstitution
                        ? handleEditingInstitutionChange
                        : handleNewInstitutionChange
                    }
                    className="w-full"
                    placeholder="Phone number or email"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="imageUrl"
                    className="block text-gray-700 text-sm font-medium mb-2"
                  >
                    Institution Image
                  </label>
                  <div className="flex flex-col gap-3">
                    <div className="relative">
                      <Input
                        type="file"
                        id="imageUrl"
                        name="imageUrl"
                        onChange={handleImageUpload}
                        disabled={imageUploadLoading}
                        accept="image/*"
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                      />
                      <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>

                    {imageUploadLoading && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Uploading image...
                      </div>
                    )}

                    {(editingInstitution?.imageUrl ||
                      newInstitution.imageUrl) && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Preview:
                        </p>
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                          <Image
                            src={
                              editingInstitution?.imageUrl ||
                              newInstitution.imageUrl ||
                              ""
                            }
                            alt="Institution Image Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {editingInstitution
                      ? "Update Institution"
                      : "Add Institution"}
                  </Button>
                  {editingInstitution && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingInstitution(null)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Institutions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-white">Institutions</CardTitle>
                  <CardDescription className="text-blue-100">
                    {filteredInstitutions.length} of {institutions.length}{" "}
                    institutions
                  </CardDescription>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search institutions..."
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
                        Institution Type
                      </label>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">All Types</option>
                        {institutionTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <CardContent className="p-0">
              <AnimatePresence mode="wait">
                {filteredInstitutions.length > 0 ? (
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
                            Institution
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium">
                            Type
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium">
                            Contact
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium">
                            Image
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInstitutions.map((institution) => {
                          const institutionType = institutionTypes.find(
                            (t) => t.value === institution.type
                          );

                          return (
                            <motion.tr
                              key={institution.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="hover:bg-gray-50"
                            >
                              <TableCell>
                                <div className="flex items-start gap-4">
                                  {institution.imageUrl ? (
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                      <Image
                                        src={institution.imageUrl}
                                        alt={institution.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <Building className="h-6 w-6 text-gray-400" />
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <h3 className="font-semibold text-gray-900">
                                      {institution.name}
                                    </h3>
                                    {institution.description && (
                                      <p className="text-gray-500 text-sm line-clamp-2 mt-1">
                                        {institution.description}
                                      </p>
                                    )}
                                    {institution.address && (
                                      <div className="flex items-center text-sm text-gray-500 mt-2">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        <span className="truncate">
                                          {institution.address}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {institutionType ? (
                                  <Badge
                                    className={`${institutionType.color} rounded-md flex items-center w-min gap-1`}
                                  >
                                    {institutionType.icon}
                                    {institutionType.label}
                                  </Badge>
                                ) : (
                                  institution.type
                                )}
                              </TableCell>
                              <TableCell>
                                {institution.contactInfo ? (
                                  <div className="flex items-center text-gray-700">
                                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                    <span className="truncate">
                                      {institution.contactInfo}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-gray-500">N/A</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {institution.imageUrl ? (
                                  <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                                    <Image
                                      src={institution.imageUrl}
                                      alt={institution.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <span className="text-gray-500">N/A</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      setEditingInstitution(institution)
                                    }
                                    className="h-8 w-8 p-0 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteInstitution(institution.id)
                                    }
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
                      <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">
                        No institutions found
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {searchQuery || typeFilter !== "all"
                          ? "Try adjusting your search or filters"
                          : "Get started by adding your first institution"}
                      </p>
                      <Button
                        onClick={() => {
                          setEditingInstitution(null);
                          setNewInstitution({
                            name: "",
                            type: "",
                            description: "",
                            address: "",
                            contactInfo: "",
                            imageUrl: "",
                          });
                        }}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Institution
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminInstitutionsPage;
