"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { HandHeart, ArrowUpRight, Loader2 } from "lucide-react";
import { format as formatDate } from "date-fns";

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
  const params = useParams();
  const { id } = params;

  // Module refs for preloaded libs
  const xlsxRef = useRef<any>(null);
  const jspdfRef = useRef<any>(null);
  const autotableRef = useRef<any>(null);
  const docxRef = useRef<any>(null);

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
        xlsxRef.current = await import("xlsx");
      } catch (e) {
        console.warn("Could not preload xlsx:", e);
      }
      try {
        const jspdfModule = await import("jspdf");
        jspdfRef.current =
          jspdfModule.jsPDF ?? jspdfModule.default ?? jspdfModule;
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
        docxRef.current = await import("docx");
      } catch (e) {
        console.warn("Could not preload docx:", e);
      }
    })();
  }, []);

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
          if (typeof autoTable === "function") {
            autoTable(doc, {
              head: [Object.keys(plainData[0])],
              body: plainData.map((r) => Object.values(r)),
              styles: { fontSize: 8 },
              headStyles: { fillColor: [20, 83, 136] }, // A nice blue for headers
              margin: { top: 30 },
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
                })
            ),
          });

          const bodyRows = plainData.map(
            (r) =>
              new TableRow({
                children: Object.values(r).map(
                  (val) =>
                    new TableCell({ children: [new Paragraph(String(val))] })
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
                    heading: docx.HeadingLevel?.HEADING_1 ?? undefined,
                  }),
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
          <p className="text-gray-600">Loading donation plan details...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <HandHeart className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900">Donation plan not found</h2>
          <p className="text-gray-600 mt-2">The requested donation plan could not be loaded.</p>
        </div>
      </div>
    );
  }

  const totalDonated = plan.transactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const progress = plan.goalAmount ? (totalDonated / plan.goalAmount) * 100 : 0;
  const recentTransactions = [...plan.transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 10);

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "PROJECT":
        return "bg-blue-100 text-blue-800";
      case "MINISTRY":
        return "bg-purple-100 text-purple-800";
      case "USER_REQUEST":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate max donation amount
  const maxDonation = plan.transactions.length > 0 
    ? Math.max(...plan.transactions.map(t => t.amount))
    : 0;

  const getReconciliationBadgeVariant = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FLAGGED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg">
            {plan.imageUrl && (
              <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
                <img
                  src={plan.imageUrl}
                  alt={plan.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <h1 className="text-2xl font-bold text-white">{plan.name}</h1>
                      <Badge className={getBadgeVariant(plan.type)}>
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
            <CardContent className="p-6">
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
                    className="h-3"
                    indicatorClassName={progress >= 100 ? "bg-green-500" : "bg-indigo-500"}
                  />
                  {plan.goalAmount && (
                    <p className="text-right text-sm text-gray-500 mt-1">
                      {Math.round(progress)}% of goal reached
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600">Total Donations</p>
                    <p className="text-xl font-bold">{plan.transactions.length}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600">Average Donation</p>
                    <p className="text-xl font-bold">
                      KES {(totalDonated / (plan.transactions.length || 1)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600">Top Donation</p>
                    <p className="text-xl font-bold">
                      KES {maxDonation.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-orange-600">Recent Activity</p>
                    <p className="text-xl font-bold">
                      {plan.transactions.length > 0 
                        ? new Date(recentTransactions[0].date).toLocaleDateString() 
                        : new Date(plan.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Donations</CardTitle>
                <div className="relative">
                  <button
                    onClick={() => setShowExportDropdown((s) => !s)}
                    disabled={exporting || plan.transactions.length === 0}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
                  >
                    {exporting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        Export All
                        <ArrowUpRight className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </button>
                  {showExportDropdown && (
                    <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-md border z-50">
                      {["xlsx", "csv", "html", "pdf", "docx"].map((fmt) => (
                        <button
                          key={fmt}
                          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                          onClick={() => {
                            setShowExportDropdown(false);
                            handleExport(fmt as any);
                          }}
                        >
                          {fmt.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <CardDescription>
                Last {recentTransactions.length} of {plan.transactions.length} total donations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{transaction.donorName || "Anonymous"}</p>
                            {transaction.donorEmail && (
                              <p className="text-sm text-gray-500">{transaction.donorEmail}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          KES {transaction.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {transaction.method.toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getReconciliationBadgeVariant(transaction.reconciliationStatus)}>
                            {transaction.reconciliationStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(transaction.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {plan.transactions.length > 10 && (
                <div className="text-center mt-4">
                  <button className="text-sm text-indigo-600 hover:text-indigo-800">
                    View all {plan.transactions.length} donations
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">First Donation</p>
                <p className="font-medium">
                  {plan.transactions.length > 0 
                    ? new Date(plan.transactions[plan.transactions.length - 1].date).toLocaleDateString()
                    : "No donations yet"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Donation</p>
                <p className="font-medium">
                  {plan.transactions.length > 0 
                    ? new Date(plan.transactions[0].date).toLocaleDateString()
                    : "No donations yet"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Donation Frequency</p>
                <p className="font-medium">
                  {plan.transactions.length > 1
                    ? `${Math.round(plan.transactions.length / ((new Date().getTime() - new Date(plan.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)))} per month`
                    : "Not enough data"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Top Donors */}
          {plan.transactions.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Top Donors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...plan.transactions]
                    .sort((a, b) => b.amount - a.amount)
                    .slice(0, 5)
                    .map((transaction, index) => (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-gray-500 w-6">{index + 1}.</span>
                          <div>
                            <p className="font-medium">{transaction.donorName || "Anonymous"}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(transaction.date).toLocaleDateString('short')}
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
          )}
        </div>
      </div>
    </motion.div>
  );
}