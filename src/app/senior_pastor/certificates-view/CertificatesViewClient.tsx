"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  ExternalLink,
  Eye,
  FileText,
  Loader2,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { toast } from "sonner";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

interface Certificate {
  id: string;
  certificateType: string;
  recipientName: string;
  cloudinaryUrl: string;
  issuedDate: string;
  user: { name: string; email: string };
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState<string | null>(
    null
  );
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [certificateToPreview, setCertificateToPreview] = useState<
    string | null
  >(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCertificates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/certificates");
      if (!response.ok) {
        throw new Error(`Failed to load certificates: ${response.status}`);
      }
      const data = await response.json();
      setCertificates(data);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load certificates", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleDeleteClick = (id: string) => {
    setCertificateToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!certificateToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/certificates/${certificateToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete certificate: ${response.status}`);
      }

      setCertificates(
        certificates.filter((cert) => cert.id !== certificateToDelete)
      );
      setIsDeleteDialogOpen(false);
      setCertificateToDelete(null);

      toast.success("Certificate deleted successfully", {
        action: {
          label: "Undo",
          onClick: () => fetchCertificates(),
        },
      });
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to delete certificate", {
        description: err.message,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePreviewClick = (url: string) => {
    setCertificateToPreview(url);
    setIsPreviewDialogOpen(true);
  };

  const handleViewInNewTab = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificateType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSearch = () => {
    setSearchTerm("");
  };

  if (loading)
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-48 sm:h-10 sm:w-64" />
            <Skeleton className="h-3 w-64 sm:h-4 sm:w-80" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-8 w-full max-w-xs sm:max-w-sm" />
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg sm:h-16" />
            ))}
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 sm:p-6 md:p-8"
      >
        <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-6 max-w-md mx-auto text-center text-white shadow-lg">
          <div className="mx-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-red-900/50 mb-4">
            <X className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-2">
            Error Loading Certificates
          </h2>
          <p className="text-red-300 mb-6">{error}</p>
          <Button
            variant="outline"
            className="border-red-700 text-red-300 hover:bg-red-800/50 gap-2"
            onClick={fetchCertificates}
          >
            <Loader2 className="h-4 w-4 animate-spin text-red-300" />
            Try Again
          </Button>
        </div>
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 md:p-8"
    >
      <div className="flex flex-col gap-2 mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          Certificate Management
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg text-gray-300"
        >
          Manage and review all issued certificates
        </motion.p>
        <Link href="/senior_pastor/certificate-generator" passHref>
          <Button className="mt-4 bg-blue-700 hover:bg-blue-800 text-white py-2.5 px-5 rounded-lg shadow-lg text-base">
            Generate New Certificate
          </Button>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative mb-8 w-full sm:max-w-md"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 py-2.5 border border-gray-700 bg-gray-900 text-gray-200 placeholder-gray-500 rounded-lg"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {filteredCertificates.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 sm:py-16 bg-gray-800 rounded-xl shadow-lg border border-gray-700/50 text-white"
          >
            <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-blue-900/30 mb-6">
              <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-blue-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
              {searchTerm
                ? "No matching certificates found"
                : "No certificates issued yet"}
            </h3>
            <p className="text-gray-300 mb-6">
              {searchTerm
                ? "Try adjusting your search query"
                : "When certificates are issued, they will appear here"}
            </p>
            {searchTerm ? (
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-700/50" onClick={clearSearch}>
                Clear search
              </Button>
            ) : (
              <Button onClick={fetchCertificates} className="bg-blue-700 hover:bg-blue-800 text-white py-2.5 px-5 rounded-lg shadow-lg text-base">Refresh</Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="certificates-table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="overflow-hidden bg-gray-800 shadow-lg rounded-xl border border-gray-700/50"
          >
            <Table className="min-w-full divide-y divide-gray-200">
              <TableHeader className="bg-gray-700/30">
                <TableRow>
                  <TableHead className="px-6 py-4 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      Recipient
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Certificate Type
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Issued By
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      Issued Date
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-4 text-right text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-gray-800 divide-y divide-gray-700">
                {filteredCertificates.map((certificate, index) => (
                  <motion.tr
                    key={certificate.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-700 transition-colors"
                  >
                    <TableCell className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-900/30 to-purple-900/30 flex items-center justify-center">
                          <span className="font-medium text-blue-400">
                            {certificate.recipientName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {certificate.recipientName}
                          </div>
                          <div className="text-xs text-gray-400">
                            {certificate.user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-2 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className="border-blue-700 text-blue-400 bg-blue-900/30"
                      >
                        {certificate.certificateType}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {certificate.user.name}
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-2 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {format(new Date(certificate.issuedDate), "PPP")}
                      </div>
                      <div className="text-xs text-gray-400">
                        {format(new Date(certificate.issuedDate), "pp")}
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium space-x-1 sm:space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handlePreviewClick(certificate.cloudinaryUrl)
                              }
                              className="group border-blue-700 text-blue-400 hover:bg-blue-800/50 hover:border-blue-700"
                            >
                              <Eye className="h-4 w-4 text-blue-400 group-hover:text-blue-300" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Preview Certificate</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleViewInNewTab(certificate.cloudinaryUrl)
                              }
                              className="group border-green-700 text-green-400 hover:bg-green-800/50 hover:border-green-700"
                            >
                              <ExternalLink className="h-4 w-4 text-green-400 group-hover:text-green-300" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Open in New Tab</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(certificate.id)}
                              className="bg-red-700 hover:bg-red-800"
                            >
                              <Trash2 className="h-4 w-4 text-white" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Certificate</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-gray-700/50 shadow-lg">
          <DialogHeader className="bg-gray-700/30 p-4">
            <div className="mx-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-red-900/50 mb-4">
              <Trash2 className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
            </div>
            <DialogTitle className="text-center text-xl font-bold text-red-400">
              Delete Certificate?
            </DialogTitle>
          </DialogHeader>
          <div className="text-center text-gray-300 py-4">
            This action cannot be undone. The certificate will be permanently
            removed.
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 bg-gray-700/30 p-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-transparent border-gray-600 text-gray-100 hover:bg-gray-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                  Deleting...
                </>
              ) : (
                "Delete Permanently"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Certificate Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col bg-gray-800 text-white border-gray-700/50 shadow-lg">
          <DialogHeader className="bg-gray-700/30 p-4">
            <DialogTitle className="text-xl font-bold text-blue-400">Certificate Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-grow flex items-center justify-center overflow-auto bg-gray-900 rounded-lg">
            {certificateToPreview ? (
              <Document
                file={certificateToPreview}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                onLoadError={(error) => {
                  console.error("Error loading PDF:", error);
                  toast.error("Failed to load PDF", {
                    description: error.message,
                  });
                }}
                loading={
                  <div className="flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    <p className="text-gray-400">Loading certificate...</p>
                  </div>
                }
                noData={
                  <div className="flex flex-col items-center justify-center gap-4">
                    <FileText className="h-8 w-8 text-gray-500" />
                    <p className="text-gray-500">No certificate to display</p>
                  </div>
                }
              >
                {numPages &&
                  Array.from(new Array(numPages), (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      width={800}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="border border-gray-700 shadow-md"
                    />
                  ))}
              </Document>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4">
                <FileText className="h-8 w-8 text-gray-400" />
                <p className="text-gray-400">
                  No certificate selected for preview
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="bg-gray-700/30 p-4">
            <Button
              onClick={() => setIsPreviewDialogOpen(false)}
              className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white py-2.5 px-5 rounded-lg shadow-lg text-base"
            >
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
