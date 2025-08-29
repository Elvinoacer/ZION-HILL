"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format as formatDate } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, ChevronDown, Download, Filter, HandHeart, Loader2, Target, Trophy, X, Zap } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface DonationPlan {
  id: string;
  name: string;
  description: string | null;
  goalAmount: number | null;
  imageUrl: string | null;
  type: string;
  createdAt: string;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  amount: number;
  date: string;
  method: string;
  donorName: string | null;
  donorEmail: string | null;
  reconciliationStatus: "PENDING" | "APPROVED" | "FLAGGED";
}

export default function DonationPlanDetails() {
  const [plan, setPlan] = useState<DonationPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const params = useParams();
  const { id } = params;
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setShowExportDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (id) {
      const fetchPlan = async () => {
        try {
          const response = await fetch(`/api/donation-plans/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch donation plan.");
          }
          const data = await response.json();
          setPlan(data);
        } catch (error: any) {
          toast.error("Failed to load donation plan details.");
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchPlan();
    }
  }, [id]);

  // Preload heavy libs
  useEffect(() => {
    (async () => {
      try {
        const xlsxModule = await import("xlsx");
        xlsxRef.current = xlsxModule;
      } catch (e) {
        console.warn("Could not preload xlsx:", e);
      }
      try {
        const jspdfModule = await import("jspdf");
        jspdfRef.current = jspdfModule.jsPDF ?? jspdfModule.default ?? jspdfModule;
      } catch (e) {
        console.warn("Could not preload jspdf:", e);
      }
      try {
        const at = await import("jspdf-autotable");
        autotableRef.current = at.default ?? at;
      } catch (e) {
        console.warn("Could not preload jspdf-autotable:", e);
      }
      try {
        const docxModule = await import("docx");
        docxRef.current = docxModule;
      } catch (e) {
        console.warn("Could not preload docx:", e);
      }
    })();
  }, []);

  // Module refs for preloaded libs
  const xlsxRef = useRef<any>(null);
  const jspdfRef = useRef<any>(null);
  const autotableRef = useRef<any>(null);
  const docxRef = useRef<any>(null);

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleExport = useCallback(
    async (format: "xlsx" | "csv" | "html" | "pdf" | "docx") => {
      if (!plan || plan.transactions.length === 0) {
        toast.info("No data to export.");
        return;
      }

      setExporting(true);
      setShowExportDropdown(false);

      const plainData = plan.transactions.map((t) => ({
        ID: t.id,
        Amount: t.amount,
        Method: t.method,
        Donor: t.donorName || "Anonymous",
        "Donor Email": t.donorEmail || "N/A",
        Status: t.reconciliationStatus,
        Date: formatDate(new Date(t.date), "MMM dd, yyyy"),
      }));

      const fileName = `${plan.name.replace(/\s+/g, '_')}_donations-${new Date()
        .toISOString()
        .slice(0, 10)}`;

      try {
        if (["xlsx", "csv", "html"].includes(format)) {
          const XLSX = xlsxRef.current ?? (await import("xlsx"));
          const ws = XLSX.utils.json_to_sheet(plainData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Donations");

          if (format === "xlsx") {
            XLSX.writeFile(wb, `${fileName}.xlsx`);
          } else if (format === "csv") {
            const csv = XLSX.utils.sheet_to_csv(ws);
            downloadBlob(
              new Blob([csv], { type: "text/csv;charset=utf-8;" }),
              `${fileName}.csv`
            );
          } else {
            const html = XLSX.utils.sheet_to_html(ws);
            downloadBlob(
              new Blob([html], { type: "text/html" }),
              `${fileName}.html`
            );
          }
        } else if (format === "pdf") {
          const jsPDFClass = jspdfRef.current ?? (await import("jspdf")).jsPDF;
          const autoTable =
            autotableRef.current ?? (await import("jspdf-autotable")).default;
          const doc = new jsPDFClass({ unit: "pt", format: "a4" });
          
          // Add title
          doc.setFontSize(18);
          doc.text(`${plan.name} Donations`, 40, 40);
          doc.setFontSize(12);
          doc.text(`Generated on ${new Date().toLocaleDateString()}`, 40, 60);
          
          if (typeof autoTable === "function") {
            autoTable(doc, {
              head: [Object.keys(plainData[0])],
              body: plainData.map((r) => Object.values(r)),
              startY: 80,
              styles: { fontSize: 9, cellPadding: 3 },
              headStyles: { 
                fillColor: [59, 130, 246],
                textColor: 255,
                fontStyle: 'bold'
              },
              alternateRowStyles: {
                fillColor: [241, 245, 249]
              },
              margin: { top: 80 },
            });
          }
          doc.save(`${fileName}.pdf`);
        } else if (format === "docx") {
          const docx = docxRef.current ?? (await import("docx"));
          const {
            Document,
            Packer,
            Paragraph,
            Table,
            TableRow,
            TableCell,
            WidthType,
            TextRun,
            HeadingLevel,
          } = docx;

          const headerRow = new TableRow({
            children: Object.keys(plainData[0]).map(
              (k) =>
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: k, bold: true })],
                    }),
                  ],
                  shading: {
                    fill: "D3D3D3",
                  },
                })
            ),
          });

          const bodyRows = plainData.map(
            (r) =>
              new TableRow({
                children: Object.values(r).map(
                  (val) =>
                    new TableCell({
                      children: [new Paragraph(String(val))],
                    })
                ),
              })
          );

          const table = new Table({
            rows: [headerRow, ...bodyRows],
            width: { size: 100, type: WidthType.PERCENTAGE },
          });

          const doc = new Document({
            sections: [
              {
                children: [
                  new Paragraph({
                    text: `${plan.name} Donations`,
                    heading: HeadingLevel.HEADING_1,
                  }),
                  new Paragraph({
                    text: `Generated on ${new Date().toLocaleDateString()}`,
                  }),
                  new Paragraph({}),
                  table,
                ],
              },
            ],
          });

          const blob = await Packer.toBlob(doc);
          downloadBlob(blob, `${fileName}.docx`);
        }
        toast.success("Donations exported successfully!");
      } catch (error: any) {
        toast.error(`Failed to export donations: ${error.message || error}`);
        console.error(error);
      } finally {
        setExporting(false);
      }
    },
    [plan]
  );

  // Filter and sort transactions
  const filteredTransactions = plan?.transactions
    ?.filter(transaction => {
      const matchesStatus = filterStatus === "ALL" || transaction.reconciliationStatus === filterStatus;
      const matchesSearch = searchQuery === "" || 
        transaction.donorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.donorEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.method.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    ?.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "desc" 
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return sortOrder === "desc" ? b.amount - a.amount : a.amount - b.amount;
      }
    }) || [];

  const recentTransactions = filteredTransactions.slice(0, 10);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-10 w-10 text-indigo-600 mb-4" />
          </motion.div>
          <p className="text-gray-600">Loading donation plan details...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="text-center max-w-md mx-4">
          <HandHeart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900">Donation plan not found</h2>
          <p className="text-gray-600 mt-2">The requested donation plan could not be loaded.</p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const totalDonated = plan.transactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const progress = plan.goalAmount ? (totalDonated / plan.goalAmount) * 100 : 0;
  
  // Calculate stats
  const maxDonation = plan.transactions.length > 0 
    ? Math.max(...plan.transactions.map(t => t.amount))
    : 0;
  
  const avgDonation = plan.transactions.length > 0 
    ? totalDonated / plan.transactions.length 
    : 0;
  
  const pendingCount = plan.transactions.filter(t => t.reconciliationStatus === "PENDING").length;
  const approvedCount = plan.transactions.filter(t => t.reconciliationStatus === "APPROVED").length;
  const flaggedCount = plan.transactions.filter(t => t.reconciliationStatus === "FLAGGED").length;

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "PROJECT":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "MINISTRY":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "USER_REQUEST":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getReconciliationBadgeVariant = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "FLAGGED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleSort = (field: "date" | "amount") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-6 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-lg overflow-hidden">
                {plan.imageUrl && (
                  <div className="relative h-48 sm:h-64 w-full overflow-hidden">
                    <img
                      src={plan.imageUrl}
                      alt={plan.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
                        <div>
                          <h1 className="text-xl sm:text-2xl font-bold text-white">{plan.name}</h1>
                          <Badge className={`mt-2 ${getBadgeVariant(plan.type)}`}>
                            {plan.type.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-white/80 text-sm">Created on {new Date(plan.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <CardContent className="p-4 sm:p-6">
                  {plan.description && (
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          KES {totalDonated.toLocaleString()} raised
                        </span>
                        {plan.goalAmount && (
                          <span className="text-sm font-medium text-gray-700">
                            KES {plan.goalAmount.toLocaleString()} goal
                          </span>
                        )}
                      </div>
                      <Progress 
                        value={progress} 
                        className="h-2 sm:h-3"
                        indicatorClassName={progress >= 100 ? "bg-green-500" : "bg-indigo-500"}
                      />
                      {plan.goalAmount && (
                        <p className="text-right text-sm text-gray-500 mt-1">
                          {Math.round(progress)}% of goal reached
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-100">
                        <p className="text-xs sm:text-sm text-blue-600 flex items-center">
                          <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Total
                        </p>
                        <p className="text-lg sm:text-xl font-bold">{plan.transactions.length}</p>
                      </div>
                      <div className="bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-100">
                        <p className="text-xs sm:text-sm text-purple-600 flex items-center">
                          <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Average
                        </p>
                        <p className="text-lg sm:text-xl font-bold">
                          KES {avgDonation.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                      <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-100">
                        <p className="text-xs sm:text-sm text-green-600 flex items-center">
                          <Trophy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Top
                        </p>
                        <p className="text-lg sm:text-xl font-bold">
                          KES {maxDonation.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-orange-50 p-3 sm:p-4 rounded-lg border border-orange-100">
                        <p className="text-xs sm:text-sm text-orange-600 flex items-center">
                          <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Recent
                        </p>
                        <p className="text-lg sm:text-xl font-bold">
                          {plan.transactions.length > 0 
                            ? formatDate(new Date(plan.transactions[0].date), "MMM dd") 
                            : "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Transactions Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <CardTitle>Donations</CardTitle>
                      <CardDescription>
                        {filteredTransactions.length} of {plan.transactions.length} total donations
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="relative" ref={exportDropdownRef}>
                        <Button
                          onClick={() => setShowExportDropdown((s) => !s)}
                          disabled={exporting || plan.transactions.length === 0}
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                        >
                          {exporting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Exporting...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Export
                              <ChevronDown className="h-4 w-4 ml-1" />
                            </>
                          )}
                        </Button>
                        <AnimatePresence>
                          {showExportDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-md border z-50"
                            >
                              {["xlsx", "csv", "pdf", "docx"].map((fmt) => (
                                <button
                                  key={fmt}
                                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                                  onClick={() => handleExport(fmt as any)}
                                >
                                  Export as {fmt.toUpperCase()}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="relative flex-1">
                      <Input
                        placeholder="Search donors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-8"
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery("")}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="FLAGGED">Flagged</option>
                      </select>
                    </div>
                  </div>

                  {filteredTransactions.length > 0 ? (
                    <>
                      <div className="overflow-x-auto rounded-lg border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Donor</TableHead>
                              <TableHead>
                                <button 
                                  onClick={() => handleSort("amount")}
                                  className="flex items-center font-medium"
                                >
                                  Amount
                                  {sortBy === "amount" && (
                                    <span className="ml-1">
                                      {sortOrder === "asc" ? "↑" : "↓"}
                                    </span>
                                  )}
                                </button>
                              </TableHead>
                              <TableHead>Method</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>
                                <button 
                                  onClick={() => handleSort("date")}
                                  className="flex items-center font-medium"
                                >
                                  Date
                                  {sortBy === "date" && (
                                    <span className="ml-1">
                                      {sortOrder === "asc" ? "↑" : "↓"}
                                    </span>
                                  )}
                                </button>
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {recentTransactions.map((transaction) => (
                              <TableRow key={transaction.id} className="group hover:bg-gray-50">
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{transaction.donorName || "Anonymous"}</p>
                                    {transaction.donorEmail && (
                                      <p className="text-sm text-gray-500 truncate max-w-[150px]">
                                        {transaction.donorEmail}
                                      </p>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                  KES {transaction.amount.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="capitalize text-xs">
                                    {transaction.method.toLowerCase()}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge 
                                    className={`text-xs ${getReconciliationBadgeVariant(transaction.reconciliationStatus)}`}
                                  >
                                    {transaction.reconciliationStatus}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {formatDate(new Date(transaction.date), "MMM dd, yyyy")}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      
                      {filteredTransactions.length > 10 && (
                        <div className="text-center mt-4">
                          <Button variant="outline" size="sm">
                            View all {filteredTransactions.length} donations
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-sm font-medium text-gray-900">No donations match your filters</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Try adjusting your search or filter criteria
                      </p>
                      {(searchQuery || filterStatus !== "ALL") && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4"
                          onClick={() => {
                            setSearchQuery("");
                            setFilterStatus("ALL");
                          }}
                        >
                          Clear filters
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Summary */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Status Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="text-sm font-medium text-green-800">Approved</p>
                      <p className="text-2xl font-bold">{approvedCount}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Pending</p>
                      <p className="text-2xl font-bold">{pendingCount}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <span className="text-yellow-600 font-bold">…</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <p className="text-sm font-medium text-red-800">Flagged</p>
                      <p className="text-2xl font-bold">{flaggedCount}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-600 font-bold">!</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Donors */}
            {plan.transactions.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Top Donors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[...plan.transactions]
                        .sort((a, b) => b.amount - a.amount)
                        .slice(0, 5)
                        .map((transaction, index) => (
                          <div key={transaction.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                <span className="text-sm font-bold">{index + 1}</span>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium">{transaction.donorName || "Anonymous"}</p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(new Date(transaction.date), "MMM dd")}
                                </p>
                              </div>
                            </div>
                            <span className="font-medium">
                              KES {transaction.amount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Activity Timeline */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {plan.transactions.length > 0 ? (
                      <>
                        <div className="flex items-start">
                          <div className="h-2 w-2 bg-indigo-500 rounded-full mt-2 mr-3"></div>
                          <div>
                            <p className="text-sm font-medium">Last donation received</p>
                            <p className="text-xs text-gray-500">
                              {formatDate(new Date(plan.transactions[0].date), "MMM dd, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="h-2 w-2 bg-indigo-500 rounded-full mt-2 mr-3"></div>
                          <div>
                            <p className="text-sm font-medium">First donation received</p>
                            <p className="text-xs text-gray-500">
                              {formatDate(new Date(plan.transactions[plan.transactions.length - 1].date), "MMM dd, yyyy")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="h-2 w-2 bg-indigo-500 rounded-full mt-2 mr-3"></div>
                          <div>
                            <p className="text-sm font-medium">Plan created</p>
                            <p className="text-xs text-gray-500">
                              {formatDate(new Date(plan.createdAt), "MMM dd, yyyy")}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">No activity yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}